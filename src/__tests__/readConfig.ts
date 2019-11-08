import readConfig, { parseConfig } from '../readConfig'
import * as path from 'path'

describe('config', () => {
    describe('config sanity', () => {
        it.each`
            value
            ${undefined}
            ${null}
            ${{}}
        `('returns default values when input is $value', ({ value }) => {
            expect(parseConfig(value)).toEqual({
                whitelist: [],
                blacklist: [],
                method: undefined,
            })
        })
        it('throws when types mismatch', () => {
            expect(() => {
                parseConfig({
                    whitelist: {},
                })
            }).toThrowError()
            expect(() => {
                parseConfig({
                    blacklist: {},
                })
            }).toThrowError()
            expect(() => {
                parseConfig({
                    method: {},
                })
            }).toThrowError()
            expect(() => {
                parseConfig({
                    method: 'unknown string',
                })
            }).toThrowError()
        })
        it('assigns method', () => {
            expect(parseConfig({ method: 'merge' })).toEqual({
                whitelist: [],
                blacklist: [],
                method: 'merge',
            })
        })
    })
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
