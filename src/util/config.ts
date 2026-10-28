import "dotenv/config"
import { writeFileSync } from "fs"

export class ConfigUtil {

    public readonly hostIp: string
    public readonly hostPort: number
    public readonly databaseUrl: string
    public readonly fileSizeLimit: number

    constructor() {
        // we will assume the .env isnt setup
        if (!process.env.IP) {
            writeFileSync('.env', `IP=0.0.0.0\nPORT=80\nDATABASE_URL=mongodb://localhost:27017\nFILE_SIZE_LIMIT=1`, {encoding: 'utf-8'})
        }
        this.hostIp = process.env.IP ?? `0.0.0.0`
        this.hostPort = process.env.PORT ? Number(process.env.port) : 80
        this.databaseUrl = process.env.DATABASE_URL ?? `mongodb://localhost:27017`
        this.fileSizeLimit = process.env.FILE_SIZE_LIMIT ? Number(process.env.FILE_SIZE_LIMIT) : 1
    }

}