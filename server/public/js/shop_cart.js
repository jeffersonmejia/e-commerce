import { APIS } from './modules/index.js'

const d = document,
	$aside = d.querySelector('.aside'),
	$shoppingNumber = d.querySelector('.shopping-cart b'),
	$productsTemplate = d.querySelector('#product-template').content,
	$shopsList = d.querySelector('.shops-list article'),
	$loader = d.querySelector('.loader')

const { GET_PRODUCTS_SHOPS, SHOPS_CART } = APIS
let client_id = -1

function toggleAside({ target }) {
	if (target.matches('.burger-menu') || target.matches('.aside-back')) {
		$aside.classList.toggle('hidden')
	}
}

function payShop({ target }) {
	if (target.matches('#pay-shop')) {
		target.textContent = '...'
		setTimeout(() => {
			target.textContent = 'Pagado con éxito'
			setTimeout(() => {
				location.pathname = '/'
			}, 500)
		}, 300)
	}
}

function getFetchOptions(data) {
	const OPTIONS = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	}
	return OPTIONS
}

async function getProductsShops() {
	try {
		const data = { client_id: localStorage.getItem('client_id') }
		const options = getFetchOptions(data)
		const res = await fetch(GET_PRODUCTS_SHOPS, options)
		const json = await res.json()
		setTimeout(() => {
			loadProducts(json.response)
		}, 1500)
	} catch (error) {
		console.log(error)
	}
}

function loadProducts(products) {
	products.forEach((product) => {
		const $productName = $productsTemplate.querySelector('.product-name')
		const $productsShops = $productsTemplate.querySelector('.products-shops')
		const $productUnitValue = $productsTemplate.querySelector('.product-unit-value')
		const $productTotalValue = $productsTemplate.querySelector('.product-total-value')

		const { product_name, product_unit, products_shops, products_total } = product

		$productName.textContent = `Producto: ${product_name}`
		$productsShops.textContent = `Cantidad: ${products_shops}`
		$productUnitValue.textContent = `Precio unitario: ${product_unit}`
		$productTotalValue.textContent = `Precio total: ${products_total}`

		let $clone = $productsTemplate.cloneNode(true)
		$shopsList.appendChild($clone)
	})
	$loader.classList.add('hidden')
}

function loadCartShops() {
	client_id = JSON.parse(localStorage.getItem('client_id')) || -1
	if (client_id !== -1) loadClientCart()
	else $shoppingNumber.textContent = 0
}

async function loadClientCart() {
	try {
		$shoppingNumber.textContent = '...'
		const res = await fetch(SHOPS_CART, getFetchOptions({ client_id }))
		const json = await res.json()
		const { response } = json
		$shoppingNumber.textContent = response.client_shops || 0
	} catch (error) {
		console.log(error)
	}
}

d.addEventListener('click', (e) => {
	toggleAside(e)
	payShop(e)
})

d.addEventListener('DOMContentLoaded', (e) => {
	loadCartShops()
	getProductsShops()
})
