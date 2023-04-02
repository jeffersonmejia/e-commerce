import { APIS } from './modules/index.js'

const d = document,
	$aside = d.querySelector('.aside'),
	$shoppingNumber = d.querySelector('.shopping-cart b'),
	$productsTemplate = d.querySelector('#product-template').content,
	$listProducts = d.querySelector('.list-products'),
	$loader = d.querySelector('.loader'),
	$registerModal = d.querySelector('.register-modal')

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
		const $productId = $productsTemplate.querySelector('button'),
			$productName = $productsTemplate.querySelector('.product-name'),
			$productPrice = $productsTemplate.querySelector('.product-price')

		const { product_id, product_price, product_name } = product

		$productId.id = product_id
		$productName.textContent = product_name
		$productPrice.textContent = product_price

		let $clone = $productsTemplate.cloneNode(true)
		$listProducts.appendChild($clone)
	})
	$loader.classList.add('hidden')
}

function validateInputs(inputs) {
	let isEmpty = true
	inputs.forEach((input) => {
		isEmpty = input.value === ''
		if (isEmpty) {
			input.classList.add('input-fail')
			setTimeout(() => {
				input.classList.remove('input-fail')
			}, 1500)
		}
	})
	return isEmpty
}

function registerUser(e) {
	const { target } = e,
		$inputs = $registerModal.querySelectorAll('input')

	if (target.matches('.register-modal button')) {
		e.preventDefault()
		if (!validateInputs($inputs)) {
			target.textContent = '...'
			setTimeout(() => {
				target.textContent = 'Registrado con éxito'
				setTimeout(() => {
					$registerModal.classList.add('hidden')
				}, 1000)
			}, 1000)
		}
	}
}
d.addEventListener('click', (e) => {
	toggleAside(e)
	addShoppingCart(e)
	registerUser(e)
})

d.addEventListener('DOMContentLoaded', (e) => {
	$shoppingNumber.textContent = shoppingList.length
	getProducts()
})
