const conn = require('../database/index')

async function payShops(req, res) {
	const result = { response: 'Servidor no disponible' }
	console.log(req.params)
	try {
		const { client_id } = req.params
		if (client_id === undefined) throw { response: 'Id no encontrado' }

		const query = `select * from pay_products(${client_id});`
		const dbResponse = await conn.query(query)
		if (dbResponse)
			result.response =
				dbResponse.rowCount > 0 ? 'Pagado con éxito' : 'No tiene compras activas'
	} catch (error) {
		result.response = error.response || 'Servidor no disponible'
	} finally {
		res.send(result)
	}
}

module.exports = payShops
