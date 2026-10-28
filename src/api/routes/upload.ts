
import {FastifyRequest, FastifyReply} from "fastify"
import { app } from "../.."
import { FileResource } from "../../data"

export default class Upload {
    public static readonly route: string = `/api/upload`
    public static readonly method: string = `post`

    public static handle = async (req: FastifyRequest, rsp: FastifyReply) => {
        const sessionId = req.headers.authorization?.replace("Bearer ", "")
        if (!sessionId) return rsp.code(400).send({success: false})

        const username = app.server.sessionIds[sessionId]
        if (!username) return rsp.code(401).send({success: false, msg: "ERR_SESSION_INVALID"})

        try {
            const file = await req.file()
            if (!file) return rsp.code(400).send({success: false, msg: "TEXT_UPLOAD_SELECT"})

            const name = file.filename.replaceAll("/", "_").replaceAll("\\", "_").trim()
            if (!name || name === "." || name === "..") return rsp.code(400).send({success: false, msg: "TEXT_UPLOAD_NAME_INVALID"})

            const buffer = await file.toBuffer()
            const saved = await FileResource.saveFile(username, name, buffer)

            if (!saved) return rsp.code(409).send({success: false, msg: "TEXT_UPLOAD_NAME_DUPE"})

            return rsp.code(201).send({success: true, name})
        } catch (err) {
            console.error(err)
            return rsp.code(500).send()
        }
    }
}
