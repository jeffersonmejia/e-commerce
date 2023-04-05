import { APIS } from './modules/api.js'
import { http } from './modules/http.js'

const SHOPPING_BTN_CONTENT = 'Agregar al carrito',
	USERGHOST = -1,
	{ PRODUCTS_API, SIGNUP_API, ADD_PRODUCTS_API, SHOPS_CART } = APIS,
	d = document,
	$aside = d.querySelector('.aside'),
	$shoppingNumber = d.querySelector('.shopping-cart b'),
	$productsTemplate = d.querySelector('#product-template').content,
	$products = d.querySelector('.list-products'),
	$productsChild = d.createElement('section'),
	$loader = d.querySelector('.loader'),
	$registerModal = d.querySelector('.register-modal'),
	navbarMatches = ['.burger-menu', , '.aside-back'],
	productButtonMatches = ['.product button'],
	signupMatches = ['.register-modal button'],
	cancelSignupMatches = ['.register-modal small']

let client_id = -1

function hasMatches(target, matches) {
	return matches.some((match) => target.matches(match))
}

function toggleAside({ target }) {
	if (hasMatches(target, navbarMatches)) {
		$aside.classList.toggle('hidden')
	}
}

function addShoppingCart({ target }) {
	if (hasMatches(target, productButtonMatches)) {
		checkUserExists(target)
	}
}

function checkUserExists(target) {
	if (client_id === -1) {
		$registerModal.classList.remove('hidden')
	} else {
		waitForShop(target)
		setTimeout(() => addShop(target.id, target), 300)
	}
}

function waitForShop(target) {
	target.disabled = true
	target.classList.add('btn-disabled')
	target.textContent = '...'
}

async function addShop(product_id, target) {
	const myHttp = http()
	let shops = parseInt($shoppingNumber.textContent)

	myHttp.post(ADD_PRODUCTS_API, { product_id, client_id })
	$shoppingNumber.textContent = shops + 1
	target.classList.remove('btn-disabled')
	target.disabled = false
	target.textContent = SHOPPING_BTN_CONTENT
}

async function getProducts() {
	const myHttp = http()
	const res = await myHttp.get(PRODUCTS_API)
	loadProducts(res)
}

function loadProducts(products) {
	products.forEach((product) => setEveryProduct(product))
	setTimeout(() => waitForProducts(), 1500)
}

function setEveryProduct(product) {
	const $productId = $productsTemplate.querySelector('button'),
		$productColor = $productsTemplate.querySelector('.product-color'),
		$productName = $productsTemplate.querySelector('.product-name'),
		$productPrice = $productsTemplate.querySelector('.product-price'),
		{ product_id, product_color, product_name, product_price } = product

	$productId.id = product_id
	$productName.textContent = product_name
	$productPrice.textContent = product_price
	$productColor.src = `assets/img/${product_color}.png` || 'assets/img/header.png'
	let $clone = $productsTemplate.cloneNode(true)
	$productsChild.appendChild($clone)
}

function waitForProducts() {
	$products.appendChild($productsChild)
	$loader.classList.add('hidden')
}

function validateInputs(inputs) {
	let isEmpty = true
	inputs.forEach((input) => validateInput(input, isEmpty))
	return isEmpty
}

function validateInput(input, isValidInput) {
	isValidInput = input.value === ''
	if (isValidInput) {
		input.classList.add('input-fail')
		setTimeout(() => shakeInput(input), 1500)
	}
}

function shakeInput() {
	input.classList.remove('input-fail')
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

function resetSignupInputs() {
	const inputs = $registerModal.querySelectorAll('input')
	inputs.forEach((input) => (input.value = ''))
}

function disableSignupInputs(flag) {
	const inputs = $registerModal.querySelectorAll('input')
	inputs.forEach((input) => (input.disabled = flag))
}

async function signupUser(target, data) {
	const myHttp = http()
	const res = await myHttp.post(SIGNUP_API, data)
	target.textContent = res.message
	saveUserLocal(res.id)
	if (res.status > 400) repeatSignup(target)
}

function saveUserLocal(id) {
	setTimeout(() => {
		$registerModal.classList.add('hidden')
		client_id = id
		localStorage.setItem('client_id', client_id)
	}, 300)
}

function repeatSignup(target) {
	target.textContent = res.statusText
	setTimeout(() => {
		resetSignupInputs()
		target.textContent = 'Registrarme'
		disableSignupInputs(false)
	}, 3000)
}

function signup(e) {
	const { target } = e
	if (hasMatches(target, signupMatches)) {
		e.preventDefault()
		const { isValidate, inputs } = validateSignup()
		if (isValidate) waitForSignup(target, inputs)
	}
}

function waitForSignup(target, inputs) {
	const data = getSigninData(inputs)
	disableSignupInputs(true)
	target.textContent = '...'
	setTimeout(() => signupUser(target, data), 1500)
}

function cancelSignup({ target }) {
	if (hasMatches(target, cancelSignupMatches)) {
		$registerModal.classList.add('hidden')
	}
}

function setClientId() {
	if (client_id === USERGHOST && getLocalUser()) setLocalUser()
}

function getLocalUser() {
	return localStorage.getItem('client_id')
}

function setLocalUser() {
	client_id = localStorage.getItem('client_id')
}

function loadCartShops() {
	if (client_id !== -1) loadClientCart()
	else $shoppingNumber.textContent = 0
}

async function loadClientCart() {
	$shoppingNumber.textContent = '...'
	const myHttp = http()
	const res = await myHttp.post(`${SHOPS_CART}`, { client_id })
	const { response } = res
	if (response !== undefined) {
		$shoppingNumber.textContent = response.client_shops || 0
	} else if (res.status > 400) {
		$shoppingNumber.textContent = 0
	}
}

d.addEventListener('DOMContentLoaded', (e) => {
	setClientId()
	loadCartShops()
	getProducts()
})
d.addEventListener('click', (e) => {
	toggleAside(e)
	addShoppingCart(e)
	signup(e)
	cancelSignup(e)
})
