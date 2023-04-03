const conn = require('../database/index')

async function shopCart(req, res) {
	const result = { response: 'Servidor no disponible' }
	try {
		const { client_id } = req.body
		if (client_id === undefined) throw { response: 'Id no encontrado' }
		const query = `select * from get_client_shops(${client_id}) as "client_shops";`
		const dbResponse = await conn.query(query)
		if (dbResponse) result.response = dbResponse.rows[0]
	} catch (error) {
		result.response = error.response || 'Servidor no disponible'
	} finally {
		res.send(result)
	}
}
module.exports = shopCart
