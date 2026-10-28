async function upload() {
	const fileInput = document.getElementById("upload")
	const header = document.getElementById("TEXT_UPLOAD")

	if (!fileInput.files?.length) {
		header.textContent = getText("TEXT_UPLOAD_SELECT")
		return
	}

	const formData = new FormData()
	formData.append("file", fileInput.files[0])

	try {
		const rsp = await axios.post("/api/upload", formData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("sessionId")}`,
			},
		})

		const data = rsp.data
		if (!data.success) {
			if (data.msg === "ERR_SESSION_INVALID") return (window.location.href = "/login")
			header.textContent = getText(data.msg || "TEXT_UPLOAD_ERR")
			return
		}

		header.textContent = getText("TEXT_UPLOAD_SUCCESS")
		await update(data.name)
	} catch (err) {
		if (err.response?.data?.msg === "ERR_SESSION_INVALID") return (window.location.href = "/login")
		header.textContent = getText(err.response?.data?.msg || "TEXT_UPLOAD_ERR")
		console.error(err)
	}
}

async function getFiles() {
	try {
		const res = await axios.get("/api/files", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("sessionId")}`,
			},
		})
		const container = document.querySelector(".files")
		const template = container.querySelector(".fileItem")

		await Promise.all(
			res.data.map(async (file) => {
				const item = await createFileItem(file, template)
				container.appendChild(item)
			}),
		)
	} catch (err) {
		if (err.response?.data?.msg === "ERR_SESSION_INVALID") return (window.location.href = "/login")
		console.error("Failed to load files:", err)
	}
}

async function update(name) {
	try {
		const res = await axios.get("/api/files", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("sessionId")}`,
			},
		})
		const file = res.data.find((file) => file.name === name)
		if (!file) return

		const container = document.querySelector(".files")
		const template = container.querySelector(".fileItem")
		const item = await createFileItem(file, template)
		container.appendChild(item)
	} catch (err) {
		if (err.response?.data?.msg === "ERR_SESSION_INVALID") return (window.location.href = "/login")
		console.error("Failed to update file list:", err)
	}
}

async function createFileItem(file, template) {
	const item = template.cloneNode(true)
	item.style.display = ""

	const fileName = item.querySelector(".fileName")
	fileName.textContent = file.name
	fileName.href = `/file?file=${encodeURIComponent(file.name)}`
	item.querySelector(".fileDate").textContent = new Date(file.modifydate).toLocaleString()
	item.querySelector(".fileSize").textContent = `${file.size} MB`

	const thumbnail = item.querySelector(".fileThumbnail")

	if (file.type === "image") {
		thumbnail.src = await getFileUrl(file.fileUrl)
	} else if (file.type === "video") {
		thumbnail.replaceWith(createFileIcon("🎬"))
	} else if (file.type === "music") {
		thumbnail.replaceWith(createFileIcon("🎵"))
	} else {
		thumbnail.replaceWith(createFileIcon("📄"))
	}

	return item
}

async function getFileUrl(url) {
	const res = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("sessionId")}`,
		},
		responseType: "blob",
	})

	return URL.createObjectURL(res.data)
}

function createFileIcon(icon) {
	const element = document.createElement("div")
	element.className = "fileIcon"
	element.textContent = icon
	return element
}

document.addEventListener("DOMContentLoaded", getFiles)
