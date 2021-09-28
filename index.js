const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./lib/configs/Config.js');
const { apibase } = require('./lib/configs/Apibase.js');
const { categoryRouter, productRouter } = require('./lib/routers/index.js');
const { checkInitialSetup, initializeSetup } = require('./lib/handlers/Initializer.js');

const app = express();
const commandPort = config.nodeEnv === 'production' ? (config.port || 80) : (config.commandPort || 5000);

app.set('port', commandPort);

//middlewares
app.use(express.json());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// creating db connection and doing intialsetup
mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(async (result) => {
		console.log("Successfully connect to MongoDB.");
		
		//check: config data of Category.js and Product.js is stored inside their repective collections or not if not then store
		let { categoriesPresentInsideDb, productsPresentInsideDb } = await checkInitialSetup();
		if(categoriesPresentInsideDb !=true || productsPresentInsideDb !=true)
				await initializeSetup(categoriesPresentInsideDb, productsPresentInsideDb);
	})
	.catch((error) => {
		console.error("Database Connection error: ", error);
    	process.exit();
	});




// home page or default route where router will listen on some port
app.get(`${apibase}/`, (req, res) => {
	res.status(200).json({
		ok: true,
		message: 'you are in home page'
	});
}).listen(process.env.PORT || 5000);


//adding all routes
app.use(categoryRouter, productRouter);