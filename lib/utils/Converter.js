/**
 * method converts id from number(1,2,3.....27,28,..) to alphabet sequence(A,B,C.....AA,AB,..) format
 * @param {id} id represents unique number
 */
const convertIdIntoCharId = async (id) => {
    let charOffset = 64;
    let idInChar = "";
    let remainder;
	return new Promise(async (resolve)=>{
	    while(id > 0) {
	        remainder = id % 26 == 0 ? 26 : id % 26;
	        id = (id-remainder) / 26;
	        idInChar = String.fromCharCode(charOffset+remainder) + idInChar;
	    }
	    resolve(idInChar);
	});     
};

/**
 * method converts given product name("Air Jordan 1 mid ankle shoes") into slug("air-jordan-1-mid-ankle-shoes")
 * @param {productName} productName represents product name
 */
const convertNameIntoSlug = async (productName) => {
	let min = 10000;
    let max = 1000000000;
    let randomNumber;
	return new Promise(async (resolve)=>{
		let words = productName.split(" ");
		let slug = words.reduce((acc, curr) => {
			if(acc == null)
				return curr.toLowerCase();
			else 
				return acc + "-" + curr.toLowerCase();
		}, null);
    	randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min;
    	slug = slug + "-" + randomNumber;
	    resolve(slug);
	});     
};

/**
 * method converts given levelNames array["Men's", "Topwear", "T-shirts", "Round-neck Tshirts"] into hierarchy string("Men's > Topwear > T-shirts > Round-neck Tshirts")
 * @param {levelNames} levelNames contains list of all hierarchy levels
 */
const convertLevelNamesArrayIntoHierarchyString = async (levelNames) => {
	return new Promise(async (resolve)=>{
		let hierarchy = levelNames.reduce((acc, curr) => {
			if(acc == null)
				return curr;
			else 
				return acc + " > " + curr;
		}, null);
	    resolve(hierarchy);
	});     
};

/**
 * method converts given number into indian Rs format
 * @param {price} price represents value of product
 */
const convertNumberIntoIndianRs = async (price) => {

    //below code snippt will convert random number into indian Rs format
    return new Promise(async (resolve)=>{
    	let passThrough = false;
		let numberInIndiaRs = "";
		let start=0, end = price.length-1;
		
		//trimming of number from start
		while(price[start]=="0"){
			start++;
		}
		
		//trimming of number from end
		while(price[end]=="0"){
			end--;
		}
		price = price.substring(start, end+1);
		
		//formatting code
		if(price.length > 3){
			passThrough = true;
		    numberInIndiaRs =  "," + price.substring(price.length-3);
		    price = price.substring(0, price.length-3);
		}
		while(price.length > 2 && passThrough){
		   	numberInIndiaRs =  "," + price.substring(price.length-2) + numberInIndiaRs;    
		    price = price.substring(0, price.length-2);
		}
		numberInIndiaRs = price + numberInIndiaRs;
	    resolve(numberInIndiaRs+" INR");
	});   
};


module.exports = {
	convertIdIntoCharId, 
	convertNameIntoSlug,
	convertLevelNamesArrayIntoHierarchyString,
	convertNumberIntoIndianRs 
};