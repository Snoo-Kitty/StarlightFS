import path from "path"
import {Logger} from "../util"
import {app} from ".."
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs"

export class FileResource {
	private static readonly logger: Logger = new Logger(`FILE`)
	private static readonly directory: string = "files"

	public static async init() {
		mkdirSync(this.directory, {recursive: true})
	}

	private static getPath(username: string, name: string) {
		return path.join(this.directory, username, name)
	}

	public static async getFile(name: string, sessionId: string) {
		const username = app.server.sessionIds[sessionId]
		if (!username) return false

		try {
			const filePath = this.getPath(username, name)
			if (!existsSync(filePath)) return false
			const file = readdirSync(filePath)

			return {owner: username, name, file}
		} catch (err) {
			this.logger.err(err)
			return false
		}
	}

	public static async saveFile(username: string, name: string, file: Buffer) {
		const directory = path.join(this.directory, username)
		const filePath = this.getPath(username, name)
		try {
			mkdirSync(directory, {recursive: true})
			writeFileSync(filePath, file)
			return true
		} catch (err: any) {
			this.logger.err(err)
			return false
		}
	}

	public static async getAll(sessionId: string) {
		const username = app.server.sessionIds[sessionId]
		if (!username) return false
		try {
			const directory = path.join(this.directory, username)
			if (!existsSync(directory)) return []
			const entries = readdirSync(directory, {withFileTypes: true})
			return entries.filter(entry => entry.isFile()).map(entry => ({name: entry.name}))
		} catch (err: any) {
			this.logger.err(err)
			return false
		}
	}
}
