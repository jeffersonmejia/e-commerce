const d = document,
	$aside = d.querySelector('.aside'),
	$shoppingNumber = d.querySelector('.shopping-cart b')

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

d.addEventListener('click', (e) => {
	toggleAside(e)
	payShop(e)
})

d.addEventListener('DOMContentLoaded', (e) => {
	$shoppingNumber.textContent = 0
})
