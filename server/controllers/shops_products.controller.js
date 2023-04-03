const conn = require('../database/index')

async function shopProducts(req, res) {
	const result = { response: 'Servidor no disponible' }
	try {
		const { client_id } = req.body
		console.log(client_id)
		if (client_id === undefined) throw { response: 'Id no encontrado' }

		const query = `select * from get_products_by_client_id(${client_id});`
		const dbResponse = await conn.query(query)
		if (dbResponse) result.response = dbResponse.rows
	} catch (error) {
		result.response = error.response || 'Servidor no disponible'
	} finally {
		res.send(result)
	}
}

module.exports = shopProducts
