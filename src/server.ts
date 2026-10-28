import fastify from "fastify"
import {ConfigUtil, Logger} from "./util"
import {fastifyStatic} from "@fastify/static"
import path from "node:path"
import multipart from "@fastify/multipart"

export default class Server {
	public readonly server
	private readonly logger: Logger = new Logger(`SRV`)
	public sessionIds: {[id: string]: string}

	constructor() {
		this.server = fastify()
		this.server.register(fastifyStatic, {
			root: path.join(process.cwd(), `pages/assets`),
			prefix: "/assets/",
		})
		this.sessionIds = {}
	}

	public async listen(config: ConfigUtil) {
		try {
			await this.server.register(multipart, {
				limits: {fileSize: config.fileSizeLimit * 1024 * 1024 * 1024, files: 1},
			})
			await this.server.listen({port: config.hostPort, host: config.hostIp})
			this.logger.log(`Listening at ${config.hostIp}:${config.hostPort}`)
		} catch (err) {
			this.logger.err(err)
			throw err
		}
	}
}
