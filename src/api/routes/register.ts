import {FastifyRequest, FastifyReply} from "fastify"
import {Logger} from "../../util"
import {registerBody} from "../../types"
import {app} from "../.."

export default class RegisterRoute {
	public static readonly route: string = `/api/register`
	public static readonly method: string = `post`
	private static readonly logger: Logger = new Logger(`REGISTER`)

	public static handle = async (req: FastifyRequest<{Body: registerBody}>, rsp: FastifyReply) => {
		try {
			const body = req.body
			if (!app.accountData) return rsp.code(500).send()
			const registered = await app.accountData.create(body)
			if (!registered) {
				return rsp.code(409).send({success: false, msg: `TEXT_ERR_REGISTER_409`})
			}
			this.logger.log(`Registered user ${body.username}`)
			return rsp.code(201).send({success: true, msg: `TEXT_REGISTER_SUCC`})
		} catch (err) {
			this.logger.err(`${err}`)
			return rsp.code(500)
		}
	}
}
