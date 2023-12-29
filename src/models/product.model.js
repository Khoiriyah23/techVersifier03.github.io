
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    category: { type: String, required: true },
    imageURL: {type: String, required:true},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: "Admin"}
})

const productModel =  mongoose.model("Product", productSchema);

module.exports = productModel; 