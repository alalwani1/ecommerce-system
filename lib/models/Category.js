const mongoose = require('mongoose');

/**
 * category schema with validations
 */
const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter new category name'],
		minLength: [4, 'Minimum category name length is 4'],
		trim: true
	},
	parentId: {
		type: String,
		required: [true, "Please enter parent category name like Men's or Shirts or Shoes"],
		minLength: [4, 'Minimum parent category name length is 4'],
		trim: true
	},
	ancesters: {
		type : Array , 
		default: []
	}
});

const Category = mongoose.model('Categories', categorySchema);

module.exports = Category;

