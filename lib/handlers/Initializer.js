const { getCategoryFromCollection, addAllCategoriesFromConfig } = require('./Category.js');
const { getProductFromCollection, addProductsDetails } = require('./Product.js');
const { categoryData } = require('../configs/Config.js');


/**
 * method adds config data of category.json and Product.json in their respective collections
 * @param {categoriesPresentInsideDb} categoriesPresentInsideDb boolean parameter tells Category collection contains any data or not
 * @param {productsPresentInsideDb} productsPresentInsideDb boolean parameter tells Product collection contains any data or not
 */
const initializeSetup = async (categoriesPresentInsideDb, productsPresentInsideDb) => {
	return new Promise(async (resolve)=>{
		//if no category added from Category.json inside Category Collection
	    if(categoriesPresentInsideDb != true){
	    	console.log('Adding few categories inside Category collection.');
	    	await addAllCategoriesFromConfig();
	    }
	    //if no product added from Product.json inside Product Collection
	    if(productsPresentInsideDb != true){
	    	console.log('Adding few categories inside Product collection.');
	    	await addProductsDetails();
	    }
	    resolve();
	});     
};


/**
 * method checks config data of category.json and Product.json is present inside collection or not if not then adds data inside their repective collections
 */
const checkInitialSetup = async () => {
	let categoriesPresentInsideDb = false;
	let productsPresentInsideDb = false;
	let rootCategoryName = Object.keys(categoryData)[0];

	//code snippet checks data present inside Category collection or not
	categoriesPresentInsideDb = await getCategoryFromCollection(rootCategoryName).then((categories) => { 
			let numberOfcategoriesPresentInsideDb = categories.length;
			//few categories present inside Category Collection
			if(numberOfcategoriesPresentInsideDb != 0){
				console.log("few categories present inside Category collection");
				return true;	
			}
			//else no category found 
			else{
				console.log("no category found inside Category collection");	
				return false;
			}
		}
	);

	//code snippet checks data present inside Product collection or not
	productsPresentInsideDb =  await getProductFromCollection("A").then((products) => { 
			let numberOfProductsPresentInsideDb = products.length; 
			//few products present inside Category Collection
			if(numberOfProductsPresentInsideDb !== 0){
				console.log("few products present inside Product collection");
				return true;
			}
			//else no product found
			else{
				console.log("no product found inside Product collection");
				return false;
			}
		}
	);

	return { categoriesPresentInsideDb, productsPresentInsideDb };
};

module.exports = {
	checkInitialSetup,
	initializeSetup
};