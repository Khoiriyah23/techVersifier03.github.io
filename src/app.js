const express = require("express");
const app =  express();
const products = require("./products.json");
const mongoose =require("mongoose");
const product = require("./models/product.model.js");
const queryString = require("querystring");
const bodyParser = require("body-parser");
const { error } = require("console");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const adminAuth = require("./middleware/admin.middleware");

mongoose.connect("mongodb://127.0.0.1:27017/geegstack_store")
.then(() => {
    console.log("Database is connected successfully!");
})
.catch((err) => {
    console.log("Error connecting to DB:", err.message);
})

app.use(session ({
    secret: "Geegstack101",
    resave: true,
    saveUninitialized: false,
}));
app.use(flash())
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.locals.adminSession = req.session.adminId;


    next();
})

app.set("view engine", "ejs");
app.set("views", __dirname + "/views")

const {homePage, productsPage, createProductPage, productDetailsPage,
editProductPage, createProduct, updateProduct, deleteProduct} 
= require("./controllers/product.controller");

const { signUpPage, addAdmin, logInPage, login, profilePage, logout } = require("./controllers/admin.controller");

app.get("/", homePage);
app.get("/products", productsPage);
app.get("/products/new", adminAuth, createProductPage)
app.get("/products/:productId", productDetailsPage)
app.get("/products/:productId/edit",adminAuth, editProductPage)
app.post("/products", createProduct);
app.put("/products/:id", adminAuth, updateProduct);
app.delete("/products/:id", deleteProduct);

app.get("/admin/signup", signUpPage)
app.post("/admin/signup", addAdmin)
app.get("/admin/login", logInPage)
app.post("/admin/login", login)
app.get("/admin/profile",adminAuth, profilePage)

app.post("/admin/logout", logout)


app.listen(4000);

