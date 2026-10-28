import {Collection} from "mongodb"
import {registerBody} from "../types"
import {Logger} from "../util"
import Protector from "../util/protect"
import argon2 from "argon2"
import {randomUUID} from "crypto"

export class AccountData {
	private readonly collection: Collection
	private readonly logger: Logger = new Logger(`USERDATA`)

	constructor(collection: Collection) {
		this.collection = collection
	}

	public async get(username: string) {
		const encodedVal = Protector.encode(username)
		const res = await this.collection.findOne({username: encodedVal})
		if (!res) return null

		res.username = Protector.decode(res.username)
		if (res.fileSeeds) {
			res.fileSeeds = Protector.decode(Buffer.from(res.fileSeeds.value()))
			console.log("Decoded fileSeeds:", res.fileSeeds, typeof res.fileSeeds, Array.isArray(res.fileSeeds))
		}

		return res
	}

	public async create(form: registerBody): Promise<boolean> {
		const existing = await this.get(form.username)
		if (existing) return false

		const account = {
			username: Protector.encode(form.username),
			password: await argon2.hash(form.password),
		}

		await this.collection.insertOne(account)
		return true
	}

	public async verifyPassword(username: string, password: string): Promise<boolean> {
		const account = await this.get(username)
		if (!account) return false

		return argon2.verify(account.password, password)
	}
}
