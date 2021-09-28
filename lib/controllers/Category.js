const Category = require('../models/Category.js');
const { isCategoryExist } = require('../handlers/Category.js');
const errorHandler = require('../handlers/ValidationError.js');

/**
 * controller adds category inside Category collection
 */
const addCategory = async (req, res) => {
	let { name, parentId } = req.body;
	try {
		let categoryData = await isCategoryExist(name);
		let parentCategoryData = await isCategoryExist(parentId);

		//if parentId category not present inside Category collection
		if ( parentCategoryData == null){
			res.status(400).send({ 
				ok: true,
				message: "parentId category is not present inside Category collection" 
			});
			return;
		}
		//else parentId category present inside Category collection
		else{
			if(categoryData != null){
				//checking parentId present inside category's ancesters array or not
				let parentIdPresent = categoryData.ancesters.some(master => {
					return master ==  parentId;
				});
				//if masterCategory present inside category's ancesters array
				if(parentIdPresent == true){
					res.status(400).send({ 
						ok: true,
						message: "there is already relationship exist between category and parentId" 
					});
					return;
				}
			}
			else {
				let category = await Category.findOne({parentId : parentId});
				newCategory = await Category.create({ name, parentId, ancesters: [...category.ancesters, parentId]});	
				res.status(201).json({ 
					ok: true,
					message: "New Category added successfully inside Category Collection." 
				});
			}
		}
	}
	catch(error){
		const errors = await errorHandler(error, 'Categories validation failed');
		res.status(400).json({ 
			ok: true,
			errors 
		})
	}
};


/**
 * controller fetches all categories present inside Category collection
 */
const getAllCategories = async (req, res) => {
	let parentId = req.body.parentId;
	let categories;
	//get all existing categories
	if(parentId == null || parentId.length==0){
		categories = await Category.find();
	}
	//get All categories of provided parentId
	else{
		categories = await Category.find({parentId : parentId});
	}
	if(categories.length == 0){
		res.status(400).send({ 
			ok: true,
			message: "category is not present inside Category collection" 
		});
		return;
	}
	let formattedCategory = categories.map(category =>{
		return {
			id: category._id,
			name: category.name
		};
	});	
	res.status(200).send({
		ok: true,
		list: formattedCategory
	});
};


module.exports = {
	addCategory,
	getAllCategories,
};
