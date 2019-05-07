const route = require("express").Router();
const products = require("../controllers/productController.js");


// http://localhost:9999/api/products/              - hämtar alla produkter som finns tillgängliga
route.get("/", products.getProducts);


// http://localhost:9999/api/products/id            - hämtar en specifik produkt genom ett id
route.get("/:id", products.getProduct);



module.exports = route;