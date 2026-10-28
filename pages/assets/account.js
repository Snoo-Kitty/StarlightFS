async function register(event) {
	event.preventDefault()

	const username = document.getElementById("username").value
	const password = document.getElementById("password").value
	const err = document.getElementById("TEXT_REGISTER_ERR")

	err.style.visibility = "hidden"

	try {
		const res = await axios.post("/api/register", {username, password})
		const data = res.data

		err.textContent = getText(data.msg)
		err.style.color = data.success === false ? "rgb(144, 15, 26)" : "white"
		err.style.visibility = "visible"
	} catch (error) {
		err.textContent = getText(error.response?.data?.msg ?? "Registration error.")
		err.style.color = "rgb(144, 15, 26)"
		err.style.visibility = "visible"
	}
}

async function login(event) {
	event.preventDefault()

	const username = document.getElementById("username").value
	const password = document.getElementById("password").value
	const err = document.getElementById("TEXT_LOGIN_ERR")

	err.style.visibility = "hidden"

	try {
		const res = await axios.post("/api/login", {username, password})
		const data = res.data
		if (!data.success) {
			err.textContent = getText(data.msg)
			err.style.color = data.success === false ? "rgb(144, 15, 26)" : "white"
			err.style.visibility = "visible"
			return
		}
		localStorage.setItem("sessionId", data.sessionId)
		localStorage.setItem("username", username)
		window.location.href = "/home"
	} catch (error) {
		err.textContent = getText(error.response?.data?.msg ?? "TEXT_AUTH_ERR")
		err.style.color = "rgb(144, 15, 26)"
		err.style.visibility = "visible"
	}
}
