import { existsSync, readFileSync } from "fs"
import path from "path"

export class PageUtil {

    private static  pagesPath: string = `pages`

    public static getPage(page: string) {
        if (!existsSync(path.join(this.pagesPath, `${page}.html`))) return
        return readFileSync(path.join(this.pagesPath, `${page}.html`), {encoding: "utf-8"})
    }

}