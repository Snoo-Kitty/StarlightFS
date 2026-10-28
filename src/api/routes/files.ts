import {FastifyRequest, FastifyReply} from "fastify"
import {stat} from "fs/promises"
import path from "path"
import {app} from "../.."
import {existsSync, mkdirSync, readdirSync} from "fs"
import { lookup } from "mime-types"

export default class GetAllFilesRoute {
	public static readonly route = "/api/files"
	public static readonly method = "get"

	public static handle = async (req: FastifyRequest, rsp: FastifyReply) => {
		const sessionId = req.headers.authorization?.replace("Bearer ", "")
		if (!sessionId) return rsp.code(400).send()

		const username = app.server.sessionIds[sessionId]
		if (!username) return rsp.code(401).send({success: false, msg: "ERR_SESSION_INVALID"})

		const directory = path.join("files", username)
        if (!existsSync(directory)) mkdirSync(directory)
		try {
			const entries = readdirSync(directory, {withFileTypes: true})
			const files = await Promise.all(
				entries
					.filter((entry) => entry.isFile())
					.map(async (entry) => {
						const filePath = path.join(directory, entry.name)
						const info = await stat(filePath)
						const mimeType = lookup(entry.name) || ""
						const type = mimeType.startsWith("audio/") ? "music" : mimeType.startsWith("video/") ? "video" : mimeType.startsWith("image/") ? "image" : "other"
						const fileUrl = `/files/${encodeURIComponent(entry.name)}`
						return {
							name: entry.name,
							size: Number((info.size / (1024 * 1024)).toFixed(2)),
							modifydate: info.mtime.toISOString(),
							type,
							fileUrl,
						}
					}),
			)

			return rsp.send(files)
		} catch (err) {
			console.error(err)
			return rsp.code(500).send()
		}
	}
}
