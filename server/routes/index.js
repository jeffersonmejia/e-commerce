const express = require('express'),
	router = express.Router(),
	home = require('../controllers/index.controller'),
	products = require('../controllers/products.controller'),
	shops = require('../controllers/shops.controller'),
	about = require('../controllers/about.controller'),
	listado = require('../controllers/listado.controller')

router.get('/', (req, res) => home(req, res))
router.get('/productos', (req, res) => products(req, res))
router.get('/productos/listado', (req, res) => listado(req, res))
router.get('/compras', (req, res) => shops(req, res))
router.get('/sobre-mi', (req, res) => about(req, res))

module.exports = router
