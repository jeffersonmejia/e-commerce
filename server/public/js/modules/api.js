const HOST = 'http://localhost'
const PORT = 3000
const HOST_NAME = `${HOST}:${PORT}`

export const APIS = {
	PRODUCTS_API: `${HOST_NAME}/productos/listado`,
	ADD_PRODUCTS_API: `${HOST_NAME}/agregar-producto`,
	GET_PRODUCTS_SHOPS: `${HOST_NAME}/compras/productos`,
	SIGNUP_API: `${HOST_NAME}/signup`,
	SHOPS_CART: `${HOST_NAME}/productos/carrito`,
	USER_PAYMENT: `${HOST_NAME}/compras/pagar`,
	PAY_SHOPS: `${HOST_NAME}/compras`,
}
