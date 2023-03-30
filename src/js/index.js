const SHOPPING_BTN_CONTENT = 'Agregar al carrito',
	MAIN_API = 'http://localhost:3000',
	PRODUCTS_API = `${MAIN_API}/products`,
	DEFAULT_PRODUCTS = {
		products: [
			{
				id: '0',
				name: 'Apple iPhone 13',
				price: '$700.00',
			},
			{
				id: '1',
				name: 'Apple iPhone 7',
				price: '$200.00',
			},
			{
				id: '2',
				name: 'Apple iPhone 7 Plus',
				price: '$200.00',
			},
			{
				id: '3',
				name: 'Apple iPhone 8 Plus',
				price: '$200.00',
			},
			{
				id: '4',
				name: 'Apple iPhone 12',
				price: '$200.00',
			},
			{
				id: '5',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
			{
				id: '6',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
			{
				id: '7',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
			{
				id: '8',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
			{
				id: '9',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
			{
				id: '10',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
			{
				id: '11',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
			{
				id: '12',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
			{
				id: '13',
				name: 'Apple iPhone 13 Pro Max',
				price: '$200.00',
			},
		],
	}

const d = document,
	$aside = d.querySelector('.aside'),
	$shoppingNumber = d.querySelector('.shopping-cart b'),
	$productsTemplate = d.querySelector('#product-template').content,
	$listProducts = d.querySelector('.list-products'),
	$loader = d.querySelector('.loader')

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

		$productName.textContent = product.name
		$productPrice.textContent = product.price

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
	setTimeout(() => {
		if (!location.hostname.includes('github')) {
			getProducts()
		} else {
			getDefaultProducts()
		}
	}, 2000)
})
