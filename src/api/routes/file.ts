import {FastifyRequest, FastifyReply} from "fastify"
import {readFile} from "fs/promises"
import path from "path"
import {lookup} from "mime-types"
import {app} from "../.."
import { existsSync, readFileSync } from "fs"

export default class GetFileRoute {
	public static readonly route = "/files/:name"
	public static readonly method = "get"

	public static handle = async (req: FastifyRequest, rsp: FastifyReply) => {
		const sessionId = req.headers.authorization?.replace("Bearer ", "")
		if (!sessionId) return rsp.code(400).send()

		const username = app.server.sessionIds[sessionId]
		if (!username) return rsp.code(401).send({success: false, msg: "ERR_SESSION_INVALID"})

		const {name} = req.params as {name: string}
		if (!name || name !== path.basename(name)) return rsp.code(400).send()

		const filePath = path.join(process.cwd(), "files", username, decodeURIComponent(name))
        if (!existsSync(filePath)) return rsp.code(404).send()
		try {
			const file = readFileSync(filePath)
			const contentType = lookup(name) || "application/octet-stream"
			return rsp.type(contentType).send(file)
		} catch (err) {
			console.error(err)
			return rsp.code(500).send()
		}
	}
}