const pg = require('pg'),
	Pool = pg.Pool

let conn
if (!conn) {
	conn = new Pool({
		user: 'postgres',
		password: 'bellaciao.11',
		host: 'localhost',
		port: '5432',
		database: 'ecommerce',
	})
}

module.exports = conn
