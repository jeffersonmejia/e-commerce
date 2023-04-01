const express = require('express'),
	path = require('path'),
	router = express.Router()

router.get('/', (req, res) => res.redirect('/productos'))

router.get('/productos', (req, res) => {
	const homePath = path.join(__dirname, '..', '..', 'index.html')
	res.sendFile(homePath)
})

router.get('/compras', (req, res) => {
	const shopsPath = path.join(__dirname, '..', 'public', 'pages/shop_cart.html')
	res.sendFile(shopsPath)
})

router.get('/sobre-mi', (req, res) => {
	const aboutPath = path.join(__dirname, '..', 'public', 'pages/about.html')
	res.sendFile(aboutPath)
})

module.exports = router
