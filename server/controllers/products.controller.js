const path = require('path')
function products(req, res) {
	const homePath = path.join(__dirname, '..', '..', 'index.html')
	res.sendFile(homePath)
}
module.exports = products
