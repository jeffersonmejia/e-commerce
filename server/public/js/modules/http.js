/**
 *
 * @param {string} method It gets: get, post, put or delete
 * @param {any} data It gets the data and convert it to json
 * @returns A object with the fetch options
 */
function getHttpOptions(method, data) {
	return {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	}
}

/**
 *
 * @param {Object} res Fetch response
 * @returns A object with a error message
 */
function throwFetch(res) {
	return {
		status: res.status || -1,
		statusText: res.statusText || 'Internal server error',
	}
}

/**
 *
 * @returns A object with the fetch functions
 */
function http() {
	let result = null,
		res = null
	const controller = new AbortController()
	const signal = controller.signal
	/**
	 *
	 * @param {string} api url/api to fetch data
	 * @param {Object} options Fetch options(optional)
	 * @returns The fetch result
	 */
	async function get(api, options) {
		try {
			setTimeout(() => {
				if (!res) signal.abort()
			}, 2000)
			res = await fetch(api, getHttpOptions('GET', options))
			if (!res.ok) throw throwFetch(res)
			result = await res.json()
		} catch (error) {
			if (!error) result = throwFetch(error)
			result = error
		}
		return result
	}
	/**
	 *
	 * @param {string} api url/api to fetch data
	 * @param {Object} data Fetch data to send
	 * @returns The fetch result
	 */
	async function post(api, data) {
		try {
			res = await fetch(api, getHttpOptions('POST', data))
			if (!res.ok) throw throwFetch(res)
			result = await res.json()
		} catch (error) {
			if (!error) result = throwFetch(error)
			result = error
		}
		return result
	}
	return { get, post }
}

export { http }
