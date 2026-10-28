export class Logger {
	public readonly name: string

	constructor(name: string) {
		this.name = name
	}

	public log(...text: any[]) {
		text.forEach((i, s) => {
			if (typeof i === "object" && i !== null) text[s] = JSON.stringify(i)
		})
		console.log(`[${this.name}] ${text.join(" ")}`)
	}

	public err(...error: any[]) {
		error.forEach((i, s) => {
			if (typeof i === "object" && i !== null) error[s] = JSON.stringify(i)
		})
		console.error(`[${this.name}] ERROR\n${error.join(" ")}`)
	}

	public warn(...warning: any[]) {
		warning.forEach((i, s) => {
			if (typeof i === "object" && i !== null) warning[s] = JSON.stringify(i)
		})
		console.log(`[${this.name}] WARNING\n${warning.join(" ")}`)
	}
}
