const Category = require('../models/Category.js');
const { categoryData } = require('../configs/Config.js');
const { convertLevelNamesArrayIntoHierarchyString } = require('../utils/Converter.js');

/**
 * method storing each category with parentId & ancesters recursively in Category collection
 * @param {category} category contains details of product
 * @param {categoryName} categoryName contains category name
 * @param {parentId} parentId contains parentId of current category
 * @param {ancesters} ancesters contains ancesters for current category name
 */
const addCategoryData = async (category, categoryName, parentId, ancesters) => {
	let newCategory;
	if(category instanceof Array){
		category.map(async (subcategory) =>{
			await addCategoryData(subcategory, subcategory.name, parentId, ancesters);
		});
	}
	else if(category instanceof Object){
		for (const [categoryName, subCategory] of Object.entries(category)) {
			newCategory = { name: categoryName, parentId: parentId, ancesters: [...ancesters] };	
			console.log(newCategory);
			await Category.create(newCategory);
			await addCategoryData(subCategory, subCategory.name, categoryName, [...newCategory.ancesters, categoryName]);
        }
	}
	else{
		newCategory = { name: category, parentId: parentId, ancesters: [...ancesters] };	
		await Category.create(newCategory);
		console.log(newCategory)
		return;
	}
};

/**
 * method adds all categories data present inside Category.json file in Category collection
 */
const addAllCategoriesFromConfig = async () => {
	let rootCategoryName = Object.keys(categoryData)[0];
	let rootCategory = { name: rootCategoryName, parentId: "root", ancesters: [] };
	await Category.create(rootCategory);
	console.log(rootCategory);
	//iterate through each root category of Category.json file
	categoryData.Categories.map(async (category) =>{
		await addCategoryData(category, category.name, rootCategory.name, [rootCategoryName]);
	});
};



/**
 * method checks Is given name and parentId category present inside Category collection or not
 * @param {name} name represents name of category
 * @param {parentId} parentId represents parentId of given name
 */
const isCategoryExist = async (name) => {
	let category =  await Category.findOne({name : name}).exec();
	return category;
};



/**
 * method fetch category from Category collection and return promise
 * @param {categoryName} categoryName represents category Name
 */
const getCategoryFromCollection = async (categoryName) => {
	if(typeof categoryName == undefined)
		categoryName = Object.keys(categoryData)[0];
	return Category.find({name : categoryName}).exec();
};




module.exports = {
	addAllCategoriesFromConfig,
	isCategoryExist,
	getCategoryFromCollection
};