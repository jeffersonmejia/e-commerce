const HOST = 'http://localhost',
	PORT = 3000

export const APIS = {
	PRODUCTS_API: `${HOST}:${PORT}/productos/listado`,
	ADD_PRODUCTS_API: `${HOST}:${PORT}/agregar-producto`,
	GET_PRODUCTS_SHOPS: `${HOST}:${PORT}/compras/productos`,
	SIGNUP_API: `${HOST}:${PORT}/signup`,
	SHOPS_CART: `${HOST}:${PORT}/productos/carrito`,
	USER_PAYMENT: `${HOST}:${PORT}/compras/pagar`,
	PAY_SHOPS: `${HOST}:${PORT}/compras`,
}
