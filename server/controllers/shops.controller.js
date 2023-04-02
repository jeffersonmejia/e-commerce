const path = require('path')

function shops(req, res) {
	const shopsPath = path.join(__dirname, '..', 'public', 'pages/shop_cart.html')
	res.sendFile(shopsPath)
}

module.exports = shops
