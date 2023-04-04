const express = require('express'),
	router = express.Router(),
	home = require('../controllers/index.controller'),
	products = require('../controllers/products.controller'),
	shops = require('../controllers/shops.controller'),
	about = require('../controllers/about.controller'),
	listado = require('../controllers/listado.controller'),
	signup = require('../controllers/signup.controller'),
	addProduct = require('../controllers/add_product.controller'),
	shopProducts = require('../controllers/shops_products.controller'),
	shopCart = require('../controllers/shop_cart.controller'),
	productsPayment = require('../controllers/products_payment.controller')

router.get('/', (req, res) => home(req, res))
router.get('/productos', (req, res) => products(req, res))
router.get('/productos/listado', (req, res) => listado(req, res))
router.get('/compras', (req, res) => shops(req, res))
router.get('/sobre-mi', (req, res) => about(req, res))
router.post('/signup', (req, res) => signup(req, res))
router.post('/agregar-producto', (req, res) => addProduct(req, res))
router.post('/compras/productos', (req, res) => shopProducts(req, res))
router.post('/productos/carrito', (req, res) => shopCart(req, res))
router.post('/compras/pagar', (req, res) => productsPayment(req, res))

module.exports = router
