import * as fs from 'fs'
import jsyaml from 'js-yaml'

export default function readConfig(filename: string) {
    const cwd = process.cwd()
    console.log('cwd', cwd)
    try {
        const data = fs.readFileSync(filename).toString()
        const yaml = jsyaml.safeLoad(data)
        return {
            whitelist: yaml.whitelist || [],
            blacklist: yaml.blacklist || [],
        }
    } catch (error) {
        console.warn('error reading config', error)
        return { whitelist: [], blacklist: [] }
    }
}
