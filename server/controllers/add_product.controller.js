function addProduct(req, res) {
	const { body } = req,
		result = { response: 'Respuesta no disponible' }
	if (body.product_id === undefined) {
		result.response = 'No se encontró el producto id'
		return
	} else if (body.client_id === undefined) {
		result.response = 'No se encontró el client id'
		return
	} else {
		result.response = saveProduct(body)
	}
	res.send(result)
}

async function saveProduct({ product_id, client_id }) {
	const conn = require('../database/index')
	try {
		const query = `	insert into shops(product_id, client_id) 
		values('${product_id}', '${client_id}');`
		const dbResponse = await conn.query(query)
		console.log(dbResponse)
		if (dbResponse) return 'Agregado éxitosamente'
	} catch (error) {
		return `¡Error, algo ha salido mal!`
	}
}

module.exports = addProduct
