import { existsSync, readFileSync } from "fs"
import path from "path"
import { Logger } from "./log"

export class LanguageUtil {

    private static languagePath: string = `language`
    private static logger: Logger = new Logger(`LANG`)

    public static getLanguageTexts(language: string) {
        let texts = path.join(this.languagePath, `${language}.json`)
        if (!existsSync(texts)) {
            this.logger.warn(`${language} doesn't exist, returning en-US`)
            texts = path.join(this.languagePath, 'en-US.json')
        }
        return JSON.parse(readFileSync(texts, {encoding: "utf-8"}))
    }

}