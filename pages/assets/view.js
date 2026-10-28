const params = new URLSearchParams(window.location.search)
const file = params.get("file")

async function loadFile(file) {
	const res = await axios.get("/api/files", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("sessionId")}`,
		},
	})

	const data = res.data
	const fileData = data.find(s => s.name === file)

	if (!fileData) {
		document.querySelector(".fileName").textContent = "File not found"
		return
	}

	const name = fileData.name
	const ext = name.split(".").pop().toLowerCase()
	const preview = document.querySelector(".filePreview")
	const fileName = document.querySelector(".fileName")

	fileName.textContent = name
	fileName.href = "#"
	fileName.onclick = async (event) => {
		event.preventDefault()

		const url = await getFileUrl(`/files/${encodeURIComponent(name)}`)
		const a = document.createElement("a")
		a.href = url
		a.download = name
		a.click()
		URL.revokeObjectURL(url)
	}

	document.querySelector(".fileDate").textContent = fileData.date ?? "Unknown date"
	document.querySelector(".fileSize").textContent = fileData.size + "MB"

	preview.replaceChildren()

	const url = `/files/${encodeURIComponent(name)}`

	if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "avif"].includes(ext)) {
		const img = document.createElement("img")
		img.className = "fileMedia"
		img.src = await getFileUrl(url)
		img.alt = name
		preview.appendChild(img)
	} else if (["mp4", "webm", "ogg", "mov", "m4v"].includes(ext)) {
		const video = document.createElement("video")
		video.className = "fileMedia"
		video.src = await getFileUrl(url)
		video.controls = true
		video.preload = "metadata"
		preview.appendChild(video)
	} else if (["mp3", "wav", "ogg", "m4a", "aac", "flac", "opus"].includes(ext)) {
		const audio = document.createElement("audio")
		audio.className = "fileMedia"
		audio.src = await getFileUrl(url)
		audio.controls = true
		audio.preload = "metadata"
		preview.appendChild(audio)
	} else {
		const icon = document.createElement("div")
		icon.className = "fileDocument"
		icon.textContent = "📄"
		preview.appendChild(icon)
	}
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

document.addEventListener("DOMContentLoaded", () => {
	if (file) {
		loadFile(file).catch(console.error)
	} else {
		document.querySelector(".fileName").textContent = "No file specified"
	}
})