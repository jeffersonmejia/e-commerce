const conn = require('../database/index')

async function signup(req, res) {
	try {
		const { client_dni, client_name } = req.body
		const query = `select * from register_user('${client_dni}', '${client_name}') as  "message";`,
			dbResponse = await conn.query(query)
		if (dbResponse) res.send(dbResponse.rows[0])
	} catch (error) {
		console.log(error)
	}
}

module.exports = signup
