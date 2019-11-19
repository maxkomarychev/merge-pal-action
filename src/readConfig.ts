import * as fs from 'fs'
import jsyaml from 'js-yaml'
import { Config } from './types'

export function parseConfig(rawConfig: any) {
    const result: Config = { whitelist: [], blacklist: [], method: undefined }
    if (rawConfig && rawConfig.whitelist) {
        if (Array.isArray(rawConfig.whitelist)) {
            result.whitelist = rawConfig.whitelist
        } else {
            throw new Error('`whitelist` should be an array')
        }
    }
    if (rawConfig && rawConfig.blacklist) {
        if (Array.isArray(rawConfig.blacklist)) {
            result.blacklist = rawConfig.blacklist
        } else {
            throw new Error('`blacklist` should be an array')
        }
    }
    if (rawConfig && rawConfig.method) {
        const allowedString = ['squash', 'merge', 'rebase']
        if (
            typeof rawConfig.method !== 'string' ||
            !allowedString.includes(rawConfig.method)
        ) {
            throw new Error(
                `'method' should be either 'merge', 'rebase', 'squash' or 'undefined', got ${rawConfig.method}`,
            )
        }
        result.method = rawConfig.method
    }
    return result
}

function getFileData(filename: string) {
    try {
        return fs.readFileSync(filename).toString()
    } catch (error) {
        console.log(`Did not find config ${filename}`)
        return ''
    }
}

export default function readConfig(filename: string) {
    const cwd = process.cwd()
    console.log('cwd', cwd)
    console.log('path?', process.env.GITHUB_WORKSPACE)
    const data = getFileData(filename)
    const yaml = jsyaml.safeLoad(data)
    return parseConfig(yaml)
}
