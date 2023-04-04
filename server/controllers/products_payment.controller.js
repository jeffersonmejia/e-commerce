const conn = require('../database/index')

async function productsPayment(req, res) {
	const result = { response: 'Servidor no disponible' }
	try {
		const { client_id } = req.body
		if (client_id === undefined) throw { response: 'Id no encontrado' }

		const query = `select * from  get_user_payment(${client_id});`
		const dbResponse = await conn.query(query)
		if (dbResponse) result.response = dbResponse.rows[0]
	} catch (error) {
		result.response = error.response || 'Servidor no disponible'
	} finally {
		res.send(result)
	}
}

module.exports = productsPayment
