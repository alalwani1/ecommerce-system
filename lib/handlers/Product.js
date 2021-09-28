const Product = require('../models/Product.js');
const { productData } = require('../configs/Config.js');
const { convertIdIntoCharId, convertNameIntoSlug, convertNumberIntoIndianRs } = require('../utils/Converter.js');


/**
 * method fetch first product of Product.json data from db in order to check Product.json data is already store or not
 */
const getProductFromCollection = async (tag_id) => {
	return Product.find({tag_id : tag_id}).exec();
};


/**
 * method check if no product present inside collection then iterate through all products mention inside Product.json file and add those data
 * but if products present inside collection then add product details sent by client
 */
const addProductsDetails = async (productDetailsSentByClient) => {	
	//finding total count of products present inside Product Collection
	let count = await Product.count({}).exec();
	if(count == 0){
		let rootProductName = Object.keys(productData)[0];
		productData[rootProductName].map(async (productDetails, index) =>{
			await addProductIntoCollection(productDetails, index+count);
		});
	}
	else {
		await addProductIntoCollection(productDetailsSentByClient, count);
	}
};


/**
 * method adds store provided product details mention inside Product Collection
 * @param {productDetails} productDetails contains details of product
 */
const addProductIntoCollection = async (productDetails, index) => {
	try{
		let tag_id = await convertIdIntoCharId(index+1);
		let price = await convertNumberIntoIndianRs(productDetails.price);
		let slug = await convertNameIntoSlug(productDetails.name); 
		
		let rootProduct = { 
			tag_id: tag_id,  
			slug: slug, 
			name: productDetails.name, 
			description: productDetails.description, 
			price: price,
			category: productDetails.category, 
			masterCategory: productDetails.masterCategory,
			images: productDetails.images
		};
		console.log(rootProduct);
		await Product.create(rootProduct);
	}
	catch(error){
		throw error;
	}
	
};

module.exports = {
	getProductFromCollection,
	addProductsDetails,
	addProductIntoCollection
};