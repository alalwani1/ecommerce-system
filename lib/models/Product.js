const mongoose = require('mongoose');

/**
 * product schema with validations
 */
const productSchema = new mongoose.Schema({
	tag_id: {
		type: String,
	},
	slug: {
		type: String,
		unique: true
	},
	name: {
		type: String,
		required: [true, "Please enter product name"],
		minLength: [8, 'Minimum product name length is 8'],
		trim: true
	},
	description: {
		type: String,
		required: [true, "Please enter product description"],
		minLength: [8, 'Minimum product description length is 8'],
		maxLength: [25, 'Maxmum product description length is 25'],
		trim: true
	},
	price: {
	    type: String,
	    required: [true, "Please enter product's price"],
	    validate: {
	        validator: function(value) {
	        	let number = value.split(",");
	        	console.log(number[0]);
	            return parseInt(number[0]) >= 1;
	        },
	        message: "price of product should be more than or equals to 1"
	    },
	    trim: true
    },
	category: {
		type: String,
		required: [true, "Please enter product's category name like Polo or Round-neck"],
		trim: true
	},
	masterCategory: {
		type: String,
		required: [true, "Please enter product's master category name(or any parent category like Men's, Women's)"],
		trim: true
	},
	images: {
		type : Array,
		required: [true, "Please provide product's images"],
		validate: {
	        validator: function(value) {
	            return value.length >=2 && value.length <= 10;
	        },
	        message: "number of images must be within range [2,10]"
	    }
    }
});


const Product = mongoose.model('Products', productSchema);

module.exports = Product;

