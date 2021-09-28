const express = require('express');
const { apibase } = require('../configs/Apibase.js');
const { addProductDetails, getProductDetails, getAllProductDetailsWithPagination , updateProductDetails} = require('../controllers/Product.js');

const productRouter = new express.Router();

productRouter.post(`${apibase}/products`, addProductDetails);
productRouter.get(`${apibase}/products`, getAllProductDetailsWithPagination);
productRouter.get(`${apibase}/products/:slug`, getProductDetails);
productRouter.put(`${apibase}/products/:slug`, updateProductDetails);

module.exports = productRouter;