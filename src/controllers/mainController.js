const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		let productsinSale = products.filter(product => product.category==="in-sale") //filtra todos los productos que tengan categoria in-sale
		let productsVisited = products.filter(product => product.category==="visited") //Idem pero con visited
		res.render('index',{ productsinSale, productsVisited,toThousand})
	},
	search: (req, res) => {
        let keywords = req.query.keywords.trim()
        let result = products.filter(product => product.name.toLowerCase().includes(keywords))
        let subCategory = products.find(product => product.subcategory === keywords.subcategory)
        
        res.render('results', {
            title:"Resultado de la busqueda",
            result,
            search: keywords,
            session: req.session,
            subCategory
        })

    }
};

module.exports = controller;
