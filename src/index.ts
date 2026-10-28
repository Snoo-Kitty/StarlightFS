import {Db, MongoClient} from "mongodb"
import APIEndpoint from "./api"
import Server from "./server"
import {ConfigUtil, Logger} from "./util/"
import {AccountData, FileResource} from "./data"
import Protector from "./util/protect"

export default class Application {
	public readonly config: ConfigUtil
	public server!: Server
	public accountData!: AccountData
	public fileResource!: FileResource
	public database!: Db
	private readonly logger: Logger = new Logger(`APP`)

	constructor() {
		this.config = new ConfigUtil()
	}

	public async start() {
		this.logger.log(`Starting application...`)
		await Protector.init()
		await this.connectDatabase()

		this.server = new Server()
		APIEndpoint.init(this.server)

		await this.server.listen(this.config)
	}

	private async connectDatabase() {
		const client = new MongoClient(this.config.databaseUrl)
		await client.connect()
		this.database = client.db(`Starlight`)
		this.accountData = new AccountData(this.database.collection(`userdata`))
		await FileResource.init()
		this.logger.log(`Database started`)
	}
}
export const app = new Application()

void (async () => {
	try {
		await app.start()
	} catch (err) {
		console.error(err)
	}
})()
