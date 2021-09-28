const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const { productData } = require('../configs/Config.js');
const errorHandler = require('../handlers/ValidationError.js');
const { addProductsDetails } = require('../handlers/Product.js');
const { isCategoryExist } = require('../handlers/Category.js');
const { convertLevelNamesArrayIntoHierarchyString, convertNameIntoSlug, convertNumberIntoIndianRs } = require('../utils/Converter.js');


/**
 * controller add product details inside Category collection
 */
const addProductDetails = async (req, res) => {
	try {
		let  { name, description, price, images, category, masterCategory } = req.body;
		let productDetails = { 
			tag_id: "",  
			slug: "", 
			name: name, 
			description: description, 
			price: price,
			category: category,
			masterCategory: masterCategory,
			images: images
		};

		let categoryData = await isCategoryExist(category);
		let masterCategoryData = await isCategoryExist(masterCategory);
		
		//if category not present inside collection
		if (categoryData == null){
			res.status(400).send({ 
				ok: true,
				message: "category is not present inside Category collection" 
			});
			return;
		}
		
		//if master category not present inside collection
		if ( masterCategoryData == null){
			res.status(400).send({ 
				ok: true,
				message: "master category is not present inside Category collection" 
			});
			return;
		}
		
		//checking masterCategory present inside category's ancesters array or not
		let masterCategoryPresent = categoryData.ancesters.some(master => {
			return master ==  masterCategory;
		});
		
		//if masterCategory not present inside category's ancesters array
		if(masterCategoryPresent == false){
			res.status(400).send({ 
				ok: true,
				message: "there is no relationship present between category and master category" 
			});
			return;
		}
		
		await addProductsDetails(productDetails);
		res.status(201).send({ 
			ok: true,
			message: "Product details added successfully!"
		});
		
	}
	catch(error){
		const errors = await errorHandler(error, 'Products validation failed');
		res.status(400).json({ 
			ok: true,
			errors 
		})
	}
};





/**
 * controller update product details inside Category collection based upon the values provided inside body and params
 */
const updateProductDetails = async (req, res) => {
	try {
		let slug = req.params.slug;
		let productDetails;
		let categoryData, masterCategoryData;
		let  { name, description, price, images, category, masterCategory } = req.body;
		let newProductDetails;
		
		//if no slug provided then send error message
		if(slug == null){
			res.status(400).send({ 
				ok: true,
				message: 'you should provide slug for an update product details' 
			});
			return;
		}
		//if slug provided then fetch product details
		else{
			productDetails = await Product.find({slug : slug});
			if( productDetails.length == 0 ){
					res.status(400).send({ 
					ok: true,
					message: 'Please provide a valid slug for an update product details' 
				});
				return;
			}
		}
		
		newProductDetails = productDetails[0];

		//if name field provided but not satisfies the name constraints
		if(name.length !=0 && name.length<8){
			res.status(400).send({ 
				ok: true,
				message: "Minimum product name length is 8" 
			});
			return;
		}
		//else name field provided and satisfies the constraints
		else {
			newProductDetails.name = name;
			newProductDetails.slug = await convertNameIntoSlug(newProductDetails.name);
		}

		//if description field provided but not satisfies the description constraints
		if(description.length ==0 || description.length<8 || description.length>25){
			res.status(400).send({ 
				ok: true,
				message: "description valid length is between in range of [8, 25]" 
			});
			return;
		}
		//else description field provided and satisfies the constraints
		else {
			newProductDetails.description = description;
		}


		//if price field provided for an update and not satisies  constraints
		if(parseInt(price)<1){
			res.status(400).send({ 
				ok: true,
				message: "please enter valid price" 
			});
			return;
		}
		//else price field provided for an update and satisies  constraints
		else{
			newProductDetails.price = await convertNumberIntoIndianRs(price);
		}
		
		//if new category field is provided
		if (category.length != 0){
			categoryData = await isCategoryExist(category);
			//if provided category not present inside collection
			if(categoryData == null)
			{
				res.status(400).send({ 
					ok: true,
					message: "category is not present inside Category collection" 
				});
				return;
			}
		}

		//if images field provided but not satisfies the constraints
		if(images.length ==0 || images.length<3 || images.length>10){
			res.status(400).send({ 
				ok: true,
				message: "images can have length in between range of [3, 10]" 
			});
			return;
		}
		//else images field provided and satisfies the images constraints
		else {
			newProductDetails.images = images;
		}
		
		//if new master category field is provided
		if (masterCategory.length != 0){
			masterCategoryData = await isCategoryExist(masterCategory);
			//if provided master category not present inside collection
			if ( masterCategoryData == null){
				res.status(400).send({ 
					ok: true,
					message: "master category is not present inside Category collection" 
				});
				return;
			}
		}
		
		
		//checking masterCategory present inside category's ancesters array or not
		let masterCategoryPresent = categoryData.ancesters.some(master => {
			return master ==  masterCategory;
		});
		
		//if masterCategory not present inside category's ancesters array
		if(masterCategoryPresent == false){
			res.status(400).send({ 
				ok: true,
				message: "there is no relationship present between category and master category" 
			});
			return;
		}
		
		//updating data into database
		Product.findOneAndUpdate({_id: productDetails[0]._id}, newProductDetails, {upsert: true}, function(err, doc) {
		    if (err) return res.send(500, {error: err});
		    res.status(201).send({ 
				ok: true,
				message: "Product details are updated successfully!"
			});
		});
		
	}
	catch(error){
		const errors = await errorHandler(error, 'Products validation failed');
		res.status(400).json({ 
			ok: true,
			errors 
		})
	}
};




/**
 * controller list all Products Details With Pagination
 */
const getAllProductDetailsWithPagination = async (req, res) => {
	let category = req.body.category;
	let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit; 
    let products = {};
    
    //get all existing products if category is null
    if(category == null){
    	products = await Product.find({}, null, {limit: limit, skip: startIndex}).exec();
    }
    //get all existing product for a specified category
    else {
    	products = await Product.find({category : category}, null, {limit: limit, skip: startIndex}).exec();	
    }
	let formattedProducts = products.map(product =>{
		return {
			tag_id: product.tag_id,
			name: product.name,
			slug: product.slug,
			description: product.description
		};
	});	
	res.status(200).send({
		ok: true,
		list: formattedProducts
	});
};



/**
 * controller list all products without pagination
 */
const getAllProductDetails = async (req, res) => {
	let { category } = req.params;
	let products;
	//get all existing product
	if(category == null){
		products = await Product.find();
	}
	//get all existing product of specified category
	else{
		products = await Product.find({category : category});
	}
	let formattedProducts = products.map(product =>{
		return {
			tag_id: product.tag_id,
			name: product.name,
			slug: product.slug,
			description: product.description
		};
	});	
	res.status(200).send({
		ok: true,
		list: formattedProducts
	});
};



/**
 * controller get product details from slug
 */
const getProductDetails = async (req, res) => {
	let slug = req.params.slug;
	let productDetails;
	console.log(slug)
	//if no slug provided then send error message
	if(slug == null ){
		res.status(400).send({ 
			ok: true,
			message: 'you should provide slug for product details' 
		});
		return;
	}
	//if slug provided then fetch product details
	else{
		productDetails = await Product.find({slug : slug});
		if( productDetails.length == 0 ){
				res.status(400).send({ 
				ok: true,
				message: 'Please provide a valid slug for product details' 
			});
			return;
		}
	}

	//checking category & masterCategory of productDetails match inside Category Collection's name & ancesters
	Category.find({
			$and: [
			    {name: productDetails[0].category },
			    {ancesters: productDetails[0].masterCategory}
			]
			
			  
		}, async function(error, category) {
			if (error) {
		        res.status(500).send({ 
		          	ok: true,
		          	message: 'error occurred inside while fetching category in getProductDetails method' 
		        });
		        return;
		    }
			//if category found
			if(category == null){
				res.status(200).json({ 
					ok: true,
					message: 'no category found',
				});
				return;
			}
			//else category found
			else{
				let category_hierarchy = await convertLevelNamesArrayIntoHierarchyString([...category[0].ancesters, category[0].name])
				res.status(200).json({ 
					ok: true,
					item: {
						tag_id: productDetails[0].tag_id,
						name: productDetails[0].name,
						description: productDetails[0].description,
						price: productDetails[0].price,
						category_hierarchy: category_hierarchy
					}
				});
				return;
			}
		}
	);
};



module.exports = {
	addProductDetails,
	getProductDetails,
	getAllProductDetailsWithPagination,
	updateProductDetails
};
