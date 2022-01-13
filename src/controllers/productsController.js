const fs = require('fs');
const path = require('path');
const { off } = require('process');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson= database =>fs.writeFileSync(productsFilePath, JSON.stringify(database),'utf-8')
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productId = +req.params.id
		let product = products.find(product=> product.id===productId)
		res.render('detail',{
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		//res.send(req.body)//Para verificar si llegaron bien los datos
		//const{name ,price, discount, category, description}=req.body //destructuring
		let lastId=1;
		products.forEach(producto => {
			if(producto.id > lastId){
				lastId=producto.id
			}
		});

	/* let newProduct ={
		id: lastId +1,
		name, // name: name  Esto funciona xq utiliza la propiedad de arriba del destructuring
		price,
		discount,
		category,
		description,
		image:"default-image.png"
		
	} */
	let newProduct={ //refactorizado de arriba
		...req.body,
		id:lastId+1,
		image: req.file? req.file.filename: "default-image.png" //Si manda un arhcivo lo guarda sino un string
	}

	products.push(newProduct)
	writeJson(products)
	res.redirect('/products')
},

	// Update - Form to edit
	edit: (req, res) => {
		let productId= +req.params.id
		let productToEdit= products.find(product=> product.id===productId)
		res.render('product-edit-form',{
			product:productToEdit
		})

	},
	// Update - Method to update
	update: (req, res) => {
		let productId= +req.params.id
		const{name ,price, discount, category, description}=req.body //destructuring

		products.forEach(product=>{
			if(product.id===productId){
				product.id=product.id,
				product.name =name,
				product.price=+price,
				product.discount=discount,
				product.description=description
				if(req.file){
					if(fs.existsSync("./public/images/products/",product.image)){
						fs.unlinkSync(`./public/images/products/ ${product.image}`)
					}
					else{
						console.log("No econtré el archivo")
					}
					product.image=req.file.filename
				}
				else{
					product.image= product.image
				}
			}
		})
		writeJson(products)
		res.redirect(`/products/detail/${productId}`)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productId= +req.params.id //capturo ID
		products.forEach(product=> { //Si en el products for each coincide con el id capturado lo elimina
			if(product.id===productId){// Si el elemento del foreach en su propiedad id es igual estricto a la variable productID
				if(fs.existsSync("./public/images/products/",product.image)){
					fs.unlinkSync(`./public/images/products/ ${product.image}`)
				}
				else{
					console.log("No econtré el archivo")
				}

				let productToDestroyIndex=products.indexOf(product)
				if (productToDestroyIndex !== -1){
					products.splice(productToDestroyIndex, 1)// primer parametro es el indice del elemento, 2do parametro cuantos elementos a borrar
				}
				else{
					console.log("no enocontre el producto")
				}
			}
		})
		writeJson(products)
		res.redirect('/product')
	}
};

module.exports = controller;