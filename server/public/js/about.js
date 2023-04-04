import { APIS } from './modules/index.js'

const d = document,
	$shoppingNumber = d.querySelector('.shopping-cart b')
const { SHOPS_CART } = APIS
let client_id = -1

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

function setClientId() {
	if (client_id === -1 && localStorage.getItem('client_id')) {
		client_id = localStorage.getItem('client_id')
	}
}

function loadCartShops() {
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
d.addEventListener('DOMContentLoaded', (e) => {
	setClientId()
	loadCartShops()
})
