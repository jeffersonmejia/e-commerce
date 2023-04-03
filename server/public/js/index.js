import { APIS } from './modules/index.js'

const d = document,
	$aside = d.querySelector('.aside'),
	$shoppingNumber = d.querySelector('.shopping-cart b'),
	$productsTemplate = d.querySelector('#product-template').content,
	$listProducts = d.querySelector('.list-products'),
	$loader = d.querySelector('.loader'),
	$registerModal = d.querySelector('.register-modal')

const SHOPPING_BTN_CONTENT = 'Agregar al carrito',
	{ PRODUCTS_API, SIGNUP_API } = APIS

const shoppingList = []
let user_id = -1
function toggleAside({ target }) {
	if (target.matches('.burger-menu') || target.matches('.aside-back')) {
		$aside.classList.toggle('hidden')
	}
}

function addShoppingCart({ target }) {
	if (target.matches('.product button')) {
		if (user_id === -1) {
			$registerModal.classList.remove('hidden')
		} else {
			target.textContent = '...'
			setTimeout(() => {
				target.textContent = SHOPPING_BTN_CONTENT
				addShop()
			}, 300)
		}
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

function validateSignup() {
	const $inputs = $registerModal.querySelectorAll('input')
	return { isValidate: !validateInputs($inputs), inputs: $inputs }
}

function getSigninData(inputs) {
	const data = {}
	inputs.forEach((input) => (data[input.name] = input.value))
	return data
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

function resetSignupInputs() {
	const inputs = $registerModal.querySelectorAll('input')
	inputs.forEach((input) => (input.value = ''))
}

function disableSignupInputs(flag) {
	const inputs = $registerModal.querySelectorAll('input')
	inputs.forEach((input) => (input.disabled = flag))
}

async function signupUser(target, data) {
	try {
		const res = await fetch(SIGNUP_API, getFetchOptions(data))
		const json = await res.json()
		const DEFAULT_RESPONSE = {
			status: -1,
			statusText: 'Servidor no disponible',
		}
		if (!res.ok) {
			DEFAULT_RESPONSE.status = res.status
			DEFAULT_RESPONSE.statusText = res.statusText
			throw DEFAULT_RESPONSE
		} else if (json.code !== 200) {
			DEFAULT_RESPONSE.status = json.code
			DEFAULT_RESPONSE.statusText = json.message
			throw DEFAULT_RESPONSE
		}
		target.textContent = json.message
		setTimeout(() => {
			$registerModal.classList.add('hidden')
			user_id = json.id
		}, 300)
	} catch (error) {
		target.textContent = error.statusText
		setTimeout(() => {
			resetSignupInputs()
			target.textContent = 'Registrarme'
			disableSignupInputs(false)
		}, 3000)
	}
}

function signup(e) {
	const { target } = e
	if (target.matches('.register-modal button')) {
		e.preventDefault()
		const { isValidate, inputs } = validateSignup()
		if (isValidate) {
			const data = getSigninData(inputs)
			disableSignupInputs(true)
			target.textContent = '...'
			setTimeout(() => signupUser(target, data), 1500)
		}
	}
}

function cancelSignup({ target }) {
	if (target.matches('.register-modal small')) {
		$registerModal.classList.add('hidden')
	}
}
d.addEventListener('click', (e) => {
	toggleAside(e)
	addShoppingCart(e)
	signup(e)
	cancelSignup(e)
})

d.addEventListener('DOMContentLoaded', (e) => {
	$shoppingNumber.textContent = shoppingList.length
	getProducts()
})
