import "dotenv/config"
import {randomBytes} from "node:crypto"
import {appendFileSync} from "node:fs"
import {Logger} from "./log"
export default class Protector {
	private static readonly logger: Logger = new Logger(`PROT`)
	private static SEED: Buffer

	public static async init() {
		let seed = process.env.SEED
		if (!seed) {
			seed = randomBytes(16).toString("hex")
			appendFileSync(`.env`, `\nSEED=${seed}`, `utf-8`)
			process.env.SEED = seed
		}
		this.SEED = Buffer.from(seed, "hex")

		this.logger.log(`Initialized`)
	}

	public static decode(data: Uint8Array, seed?: string) {
		const input = Buffer.from(data)
		const output = Buffer.alloc(input.length)
		const Seed = seed ? Buffer.from(seed, "hex") : this.SEED

		for (let i = 0; i < input.length; i++) output[i] = input[i]! ^ Seed[i % Seed.length]!

		try {
			return JSON.parse(output.toString())
		} catch {
			return output.toString()
		}
	}

	public static encode(data: Object, seed?: string) {
		const buffer = Buffer.from(JSON.stringify(data))
		const out = Buffer.alloc(buffer.length)
		const Seed = seed ? Buffer.from(seed, "hex") : this.SEED
		for (let i = 0; i < buffer.length; i++) out[i] = buffer[i]! ^ Seed[i % Seed.length]!
		return out
	}

	public static decodeFile(data: Uint8Array, seed: string): Buffer {
		const key = Buffer.from(seed, "hex")
		if (!key.length) throw new Error("Invalid file seed")
		const input = Buffer.from(data)
		const output = Buffer.alloc(input.length)
		for (let i = 0; i < input.length; i++) output[i] = input[i]! ^ key[i % key.length]!
		return output
	}

	public static encodeFile(data: Uint8Array, seed: string): Buffer {
		const key = Buffer.from(seed, "hex")
		if (!key.length) throw new Error("Invalid file seed")
		const input = Buffer.from(data)
		const output = Buffer.alloc(input.length)
		for (let i = 0; i < input.length; i++) output[i] = input[i]! ^ key[i % key.length]!
		return output
	}
}
