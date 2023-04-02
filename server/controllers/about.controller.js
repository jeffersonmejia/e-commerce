const path = require('path')

function about(req, res) {
	const aboutPath = path.join(__dirname, '..', 'public', 'pages/about.html')
	res.sendFile(aboutPath)
}

module.exports = about
