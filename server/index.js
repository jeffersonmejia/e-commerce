const app = require('./server'),
	express = require('express'),
	path = require('path'),
	router = require('./routes'),
	dotenv = require('dotenv').config(),
	bodyParser = require('body-parser'),
	logger = require('morgan')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
console.log(path.join(__dirname, 'public'))
//rutas
app.use('/', router)

app.set('port', process.env.PORT || 3001)

app.listen(app.get('port'), () => {
	console.log(`host: http://localhost:${app.get('port')}`)
})
