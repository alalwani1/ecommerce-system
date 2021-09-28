## Task : API Development
Must Use : NodeJS, ExpressJS, Mongodb

## Note: Please scroll down for additional information for Rest APIs

## Schema:

Product :
- To store all the product details
- Store additional tag_id in this you will set numeric id from 1
in an
auto-increment manner like we have in mysql database
- Generate a unique slug from the product name like if product
name is
"Air Jordan 1 mid ankle shoes" then generated slug should be
"air-jordan-1-mid-ankle-shoes" [Keep in mind the issue of products
with
exact same names]
[Added by Amit: Same slug issue can be remove by appending random number at the end of slug]

Category :
- To store multilevel categories [Like Men's category would would
have
sub categories like Topwear, bottomwear; Topwear would have
Shirts,
T-shirts; T-shirts would have Round-neck, Full-sleeve etc. till n
levels]

## API:

1. List Categories
Input : parent
Output: list of sub categories of given parent id

2. Add category
Input : Name, parent id
Output: Success / Error message . Validation errors, if any.

3. Add product in database
Input : Name, Description, Price, Images(multiple), Category , masterCategory [Added by Amit, masterCategory]
Output: Success / Error message . Validation errors, if any.

4. List Products
Input : Category [If null, list all]
Output : tag_id, name, slug, description

5. Product Details
Input : slug
Output : tag_id, name, description , price, category hierarchy**,
images

** category hierarchy like: If a product category is set as round
neck
t
shirt; Category hierarchy would be like "Men's > Topwear >
T-shirts >
Round-neck Tshirts"

## Bonus task :

- Use pagination for list products API [Onscroll pagination with
next
pointer]
- Show price in Indian currency format in product details [ i.e.
`1,24,345 INR` ]
- Update product details API [including images]
- Select cover image. [ Use automatically & then give a way in
update
API to change that ]

## Bonus++ :

- Instead of numbers, use capital alphabets for generating tag_id
i.e. it goes like A, B, C... Z, AA, AB, AC, ... , AZ, BA, BB, ...
BZ,
... ZZ, AAA, AAB, ... ZZZ and so on...



## REST API Additional Information:

## 1. home page:   
	Rest API:   GET http://localhost:5000/api/v1.0/
	
	o/p:    
	{
		"ok": true,
		"message": "you are in home page"
	}


## 2. List all Products(with pagination): 
Rest API:  GET http://localhost:5000/api/v1.0/products?page=1&limit=4
	
	o/p:
		{
		    "ok": true,
		    "list": [
		        {
		            "tag_id": "B",
		            "name": "Gucci 1 Yellow Mens Cuba Collar shirt",
		            "slug": "gucci-1-yellow-mens-cuba-collar-shirt-407644105",
		            "description": "A masterpiece"
		        },
		        {
		            "tag_id": "A",
		            "name": "Air Jordan 1 Mid Ankle Shoes",
		            "slug": "air-jordan-1-mid-ankle-shoes-156662448",
		            "description": "A masterPiece"
		        },
		        {
		            "tag_id": "D",
		            "name": "Gucci 1 Yellow Mens Cuba Collar shirt",
		            "slug": "gucci-1-yellow-mens-cuba-collar-shirt-783935761",
		            "description": "A"
		        },
		        {
		            "tag_id": "E",
		            "name": "Gucci 1 Yellow Mens Cuba Collar shirt",
		            "slug": "gucci-1-yellow-mens-cuba-collar-shirt-223462834",
		            "description": "A masterpiece"
		        }
		    ]
		}

## 3. Get Product Details:
In this Rest API, slug appended as params in url

	Rest API:  GET http://localhost:5000/api/v1.0/products/gucci-1-yellow-mens-cuba-collar-shirt-407644105
	
	o/p:
		{
		    "ok": true,
		    "item": {
		        "tag_id": "B",
		        "name": "Gucci 1 Yellow Mens Cuba Collar shirt",
		        "description": "A masterpiece",
		        "price": "56,421 INR",
		        "category_hierarchy": "Categories > Clothes > Men's > Topwear > T-Shirts > Full Sleeve"
		    }
		}


## 4. List all Categories

Rest API:  GET http://localhost:5000/api/v1.0/categories

	body:
		{
    		"parentId": "Men's"
		}

	o/p:
		{
		    "ok": true,
		    "list": [
		        {
		            "id": "61436be368cf6c625d94cc9a",
		            "name": "Topwear"
		        },
		        {
		            "id": "61436be368cf6c625d94cca1",
		            "name": "Bottomwear"
		        },
		        {
		            "id": "61436be368cf6c625d94ccaf",
		            "name": "Footwear"
		        }
		    ]
		}

## 5. Add product details

Rest API: POST http://localhost:5000/api/v1.0/products

	body:
		{
		    "name": "Gucci 1 Yellow Mens Cuba Collar shirt",
			"description": "A masterpiece",
			"price": "564210",
			"images": [
					"image1",
					"image2",
					"image3"
			],
			"category": "Mid Ankle",
			"masterCategory": "Men's"
		}

	o/p:
		{
		    "ok": true,
		    "message": "Product details added successfully!"
		}

## 6. Update product details
In this Rest API, slug appended as params in url
	
	Rest API:  PUT http://localhost:5000/api/v1.0/products/gucci-1-yellow-mens-cuba-collar-shirt-131599513

	body:

		{
		    "name": "Gucci 1 Yellow Mens Cuba Collar shirt",
			"description": "A masterpiece",
			"price": "564210",
			"images": [
					"image1",
					"image2",
					"image3"
			],
			"category": "Mid Ankle",
			"masterCategory": "Men's"
		}

	o/p:
	{
	    "ok": true,
	    "message": "Product details are updated successfully!"
	}


## 7. Add Category
Rest API:  POST http://localhost:5000/api/v1.0/categories

	body:
	{
    	"name": "Lower",
		"parentId": "Bottomwear"
	}

	o/p:
	{
	    "ok": true,
	    "message": "New Category added successfully inside Category Collection."
	}
