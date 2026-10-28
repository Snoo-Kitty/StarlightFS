let textData = {}

async function getTextData(language) {
    const res = await axios.get(`/api/language?language=${encodeURIComponent(language)}`)
    return res.data
}

function getText(key) {
    const username = localStorage.getItem("username") ?? "?"
    const date = new Date()
    const day = date.getDate()
    const suffix = day % 100 >= 11 && day % 100 <= 13 ? "th" : ({1: "st", 2: "nd", 3: "rd"}[day % 10] ?? "th")
    const today = `${day}${suffix} ${date.toLocaleDateString("en-GB", {month: "long", year: "numeric"})} (${date.toLocaleDateString("en-US", {weekday: "short"})}.)`

    return String(textData?.[key] ?? key).replaceAll("<#USER>", username).replaceAll("<#TODAY>", today)
}

function loadTexts() {
    for (const key of Object.keys(textData)) {
        document.querySelectorAll(`#${CSS.escape(key)}, .${CSS.escape(key)}`).forEach((doc) => {
            doc.textContent = getText(key)
        })
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    let lang = localStorage.getItem("language") ?? "en-US"
    localStorage.setItem("language", lang)

    try {
        textData = await getTextData(lang)
        loadTexts()
    } catch (err) {
        console.error("Failed to load language data:", err)
    }
})