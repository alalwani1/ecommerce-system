let config = {
	dbURI: 'mongodb+srv://manan:CFQmsKJhlDHgSDEG@cluster0.uwoc8.mongodb.net/ecommerce?retryWrites=true&w=majority', //process.env.DB_URI,
	commandPort: 5000, //process.env.COMMAND_PORT,
	port: 80,
	nodeEnv: 'dev', //process.env.NODE_ENV
	categoryData: require('/Users/alalwani/Documents/Amit/Assignments/capermint/ecommerce-system/lib/data/Category.json'),
	productData: require('/Users/alalwani/Documents/Amit/Assignments/capermint/ecommerce-system/lib/data/Product.json')
}
module.exports = config;
