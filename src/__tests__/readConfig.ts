import readConfig from '../readConfig'
import * as path from 'path'

describe('config', () => {
    it('provides default config when file is absent', () => {
        expect(readConfig(path.join(__dirname, '.mergepal.yml'))).toEqual({
            whitelist: [],
            blacklist: [],
        })
    })
    it('it parses whitelist and blacklist', () => {
        expect(
            readConfig(path.join(__dirname, './configs/whiteandblack.yml')),
        ).toEqual({
            whitelist: ['white'],
            blacklist: ['black'],
        })
    })
    it('it parses whitelist', () => {
        expect(
            readConfig(path.join(__dirname, './configs/whiteonly.yml')),
        ).toEqual({
            whitelist: ['white'],
            blacklist: [],
        })
    })
    it('it parses blacklist', () => {
        expect(
            readConfig(path.join(__dirname, './configs/blackonly.yml')),
        ).toEqual({
            whitelist: [],
            blacklist: ['black'],
        })
    })
})
