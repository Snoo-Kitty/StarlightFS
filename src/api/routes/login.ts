import {FastifyRequest, FastifyReply} from "fastify"
import {Logger} from "../../util"
import {loginBody} from "../../types"
import {app} from "../.."
import {randomUUID} from "node:crypto"

export default class LoginRoute {
	public static readonly route: string = `/api/login`
	public static readonly method: string = `post`
	private static readonly logger: Logger = new Logger(`LOGIN`)

	public static handle = async (req: FastifyRequest<{Body: loginBody}>, rsp: FastifyReply) => {
		try {
			const body = req.body
			if (!app.accountData) return rsp.code(500).send({success: false, msg: `TEXT_ERR_500`})

			const verify = await app.accountData.verifyPassword(body.username, body.password)
			if (!verify) return rsp.code(401).send({success: false, msg: `TEXT_ERR_USER_401`})

			const sessionId = randomUUID()
			app.server.sessionIds[sessionId] = body.username

			return rsp.code(200).send({success: true, sessionId})
		} catch (err) {
			this.logger.err(`${err}`)
			return rsp.code(500).send({success: false, msg: `TEXT_ERR_500`})
		}
	}
}
