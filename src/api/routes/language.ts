import { FastifyRequest, FastifyReply } from "fastify"
import { LanguageUtil } from "../../util"

export default class RegisterRoute {

    public static readonly route: string = `/api/language`
    public static readonly method: string = `get`

    public static handle = async (req: FastifyRequest, rsp: FastifyReply) => {
        const query = req.query as {language?: string}
        if (!query.language) return rsp.status(400).send()
        const language = LanguageUtil.getLanguageTexts(query.language)
        if (!language) return rsp.status(404).send()
        return rsp.type('application/json').send(language)
    }

}