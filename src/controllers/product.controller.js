
const product = require("../models/product.model")

const homePage = (req, res) => {
    res.render("index")
}
const productsPage = (req, res) => {
    product.find()
    .then((products) => { 
    res.render("products", { products })
    console.log(products);
    })
    .catch(error => {
        res.redirect("/")
    })
}
const createProductPage = (req, res) => {
    console.log(req.flash("form"));
    res.render("create_product", { error: req.flash("errorMsg"), form: req.flash("form")})
}

const productDetailsPage = (req, res) => {
    const productId = req.params.productId
    product.findById(productId)
    .then((product) => {
        console.log(product);
        console.log(product.admin);
        console.log(req.session.adminId);
        res.render("single_product", {product})  
    })
    .catch(error  => {
        console.log(error);
        res.redirect("/")
    })
}

const editProductPage = (req, res) => {
    const productId = req.params.productId
    product.findById(productId)
    .then((product) => {
        if (!product) {
            // If the product is not found, handle the error appropriately
            console.log("Product not found");
            req.flash("error", "Product not found");
            return res.redirect("/products");
        }

        console.log(product);
        res.render("edit_product", { product, error: req.flash("error") });
    })
    .catch((error) => {
        console.log("Error fetching product details:", error);
        req.flash("error", "Error fetching product details");
        res.redirect("/products");
    });
}

const createProduct = (req, res) => {
    const data = {
        name: req.body.name,
        price: req.body.price,
        imageURL: req.body.imageURL,
        category: req.body.category,
        description: req.body.description,
        admin: req.session.adminId
    }
    product.create(data)
    .then((product) => {
        // Redirect data to product view
        res.redirect("/products/" + product._id);
        console.log(product);
    })
    .catch((error) => {
        console.error("Error creating product:", error);
        req.flash("errorMsg", error._message);
        req.flash("form", req.body);
        res.redirect("/products/new");
    })
    
}

const updateProduct = (req, res) => {
    const productId = req.params.id
    const data = {
        name: req.body.name,
        price: req.body.price,
        imageURL: req.body.imageURL,
        category: req.body.category,
        description: req.body.description
    }
    console.log("Updating product with ID:", productId);
    console.log("New product data:", data);

    product.updateOne({_id: productId}, data)
    .then( (result) => {
        console.log("Update result:", result);
        res.redirect("/products/" + productId)
    })
    .catch((error) => {
        console.error("Error updating product:", error);
        req.flash("error", error._message);
        res.redirect(`/products/${productId}/edit`);
    })
}

const deleteProduct = (req, res) => {
    const productId = req.params.id;
    product.findByIdAndDelete(productId)
    .then(() => {
        res.redirect("/products")
    })
    .catch((error) => {
        req.flash("error", error._message);
        res.redirect("/products");
    })
}

module.exports = {
    homePage,
    productsPage,
    createProductPage,
    productDetailsPage,
    editProductPage,
    createProduct,
    updateProduct,
    deleteProduct
}