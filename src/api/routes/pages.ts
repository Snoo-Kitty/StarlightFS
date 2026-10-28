import { FastifyRequest, FastifyReply } from "fastify"
import { PageUtil } from "../../util"

export default class LoginPage {

    public static readonly route: string = `/:page`
    public static readonly method: string = `get`

    public static handle = async (req: FastifyRequest, rsp: FastifyReply) => {
        const param = req.params as {page: string}
        const page = PageUtil.getPage(param.page)
        if (!page) return rsp.status(404).send()
        return rsp.type("text/html").send(page)
    }

}