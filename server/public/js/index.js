import { APIS } from './modules/index.js'

const d = document,
	$aside = d.querySelector('.aside'),
	$shoppingNumber = d.querySelector('.shopping-cart b'),
	$productsTemplate = d.querySelector('#product-template').content,
	$listProducts = d.querySelector('.list-products'),
	$loader = d.querySelector('.loader')

const SHOPPING_BTN_CONTENT = 'Agregar al carrito',
	{ PRODUCTS_API } = APIS

const shoppingList = [],
	product = { name: null, price: null }

function toggleAside({ target }) {
	if (target.matches('.burger-menu') || target.matches('.aside-back')) {
		$aside.classList.toggle('hidden')
	}
}

function addShoppingCart({ target }) {
	if (target.matches('.product button')) {
		target.textContent = '...'
		setTimeout(() => {
			target.textContent = SHOPPING_BTN_CONTENT
			addShop()
		}, 300)
	}
}

function addShop() {
	let shops = parseInt($shoppingNumber.textContent)
	$shoppingNumber.textContent = shops + 1
}

async function getProducts() {
	try {
		const res = await fetch(PRODUCTS_API)
		if (!res.ok) throw { status: res.status, statusText: res.statusText }
		const json = await res.json()
		loadProducts(json)
	} catch (error) {
		console.log(error)
	}
}

function loadProducts(products) {
	products.forEach((product) => {
		const $productName = $productsTemplate.querySelector('.product-name'),
			$productPrice = $productsTemplate.querySelector('.product-price')

		const { product_price, product_name } = product

		$productName.textContent = product_name
		$productPrice.textContent = product_price

		let $clone = $productsTemplate.cloneNode(true)
		$listProducts.appendChild($clone)
	})
	$loader.classList.add('hidden')
}
function getDefaultProducts() {
	loadProducts(DEFAULT_PRODUCTS.products)
}
d.addEventListener('click', (e) => {
	toggleAside(e)
	addShoppingCart(e)
})

d.addEventListener('DOMContentLoaded', (e) => {
	$shoppingNumber.textContent = shoppingList.length
	getProducts()
})
