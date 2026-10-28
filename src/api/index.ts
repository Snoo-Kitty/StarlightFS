import path from "node:path"
import { Logger } from "../util"
import { createRequire } from "node:module"
import { readdirSync } from "node:fs"
import Server from "../server"

export default class APIEndpoint {

    private static readonly logger: Logger = new Logger(`API`)
    public static init(server: Server) {
        const handlers = path.join(__dirname, "routes")
        const req = createRequire(__filename)
        const routes = readdirSync(handlers, { recursive: true, encoding: "utf8" }).filter(s => /\.(ts|js)$/.test(s) && !s.endsWith(".d.ts"))
        for (const route of routes) {
            const handler = req(path.join(handlers, route))
            const rtcl = handler.default
            if (rtcl) {
                switch(rtcl.method) {
                    case "get":
                        server.server.get(rtcl.route, rtcl.handle)
                        break
                    case "post":
                        server.server.post(rtcl.route, rtcl.handle)
                        break
                    default:
                        this.logger.log(`Unsupported method ${rtcl.method}`)
                        break
                }
                this.logger.log(`Registered ${rtcl.route}`)
            }
        }
    }

}