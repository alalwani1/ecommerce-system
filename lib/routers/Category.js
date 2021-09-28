const express = require('express');
const { apibase } = require('../configs/Apibase.js');
const { getAllCategories, addCategory } = require('../controllers/Category.js');

const categoryRouter = new express.Router();

categoryRouter.get(`${apibase}/categories`, getAllCategories);
categoryRouter.post(`${apibase}/categories`, addCategory);

module.exports = categoryRouter;