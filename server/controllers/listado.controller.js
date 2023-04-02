const conn = require('../database/index')

async function listado(req, res) {
	try {
		const query = 'select * from products_view;',
			dbResponse = await conn.query(query)
		if (dbResponse) {
			const products = dbResponse.rows
			res.send(products)
		}
	} catch (error) {
		console.log(error)
	}
}
module.exports = listado
