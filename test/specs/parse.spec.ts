import { describe, it } from 'node:test';
import { expect } from 'chai';
import { extractArgs } from 'x-var';

const dummy = null;

describe('extractArgs', () => {
    it('should resolve empty list', () => {
        const x = extractArgs([], dummy);

        expect(x).to.deep.eq([[], '', {}]);
    });

    it('should resolve just command', () => {
        const x = extractArgs(['echo', 'hello'], dummy);

        expect(x).to.deep.eq([['echo', 'hello'], '', {}]);
    });

    it('should not unquote command when non win32', () => {
        const x = extractArgs(['\'echo', 'hello\''], dummy);

        expect(x).to.deep.eq([['\'echo', 'hello\''], '', {}]);
    });

    it('should unquote command 1', () => {
        const x = extractArgs(['\'echo', 'hello\''], 'win32');

        expect(x).to.deep.eq([['echo hello'], '', {}]);
    });

    it('should unquote command 2', () => {
        const x = extractArgs(['\'echo', 'hello'], 'win32');

        expect(x).to.deep.eq([['echo hello'], '', {}]);
    });

    it('should unquote command 3', () => {
        const x = extractArgs(['\'echo', 'hello', 'world\''], 'win32');

        expect(x).to.deep.eq([['echo hello world'], '', {}]);
    });

    it('should unquote command 3', () => {
        const x = extractArgs(['\'echo', 'hello', 'world\'', 'again'], 'win32');

        expect(x).to.deep.eq([['echo hello world', 'again'], '', {}]);
    });

    it('should resolve path to .env', () => {
        const x = extractArgs(['-e', './test.env', 'echo', 'hello'], dummy);

        expect(x).to.deep.eq([['echo', 'hello'], './test.env', {}]);
    });

    it('should resolve path to .env', () => {
        const x = extractArgs(['-e=./test.env', 'echo', 'hello'], dummy);

        expect(x).to.deep.eq([['echo', 'hello'], './test.env', {}]);
    });

    it('should resolve just path to .env', () => {
        const x = extractArgs(['-e=./test.env'], dummy);

        expect(x).to.deep.eq([[], './test.env', {}]);
    });

    it('should resolve just path .env no cmd', () => {
        const x = extractArgs(['-e=./test.env'], dummy);

        expect(x).to.deep.eq([[], './test.env', {}], dummy);
    });

    it('env file option is read only once as it should mean an obvious error', () => {
        const x = extractArgs(['-e=./test.env', '-e=./test.env'], dummy);

        expect(x).to.deep.eq([['-e=./test.env'], './test.env', {}]);
    });

    it('should resolve a variable', () => {
        const x = extractArgs(['KEY=VALUE', 'echo $KEY'], dummy);

        expect(x).to.deep.eq([['echo $KEY'], '', { KEY: 'VALUE' }]);
    });

    it('should resolve a set of variables', () => {
        const x = extractArgs(['KEY1=VALUE1', 'KEY2=VALUE2', 'echo $KEY'], dummy);

        expect(x).to.deep.eq([['echo $KEY'], '', { KEY1: 'VALUE1', KEY2: 'VALUE2' }]);
    });

    it('should resolve just a set of variables', () => {
        const x = extractArgs(['KEY1=VALUE1', 'KEY2=VALUE2'], dummy);

        expect(x).to.deep.eq([[], '', { KEY1: 'VALUE1', KEY2: 'VALUE2' }]);
    });

    it('should resolve just a path to env and a set of variables', () => {
        const x = extractArgs(['-e=.env', 'KEY1=VALUE1', 'KEY2=VALUE2'], dummy);

        expect(x).to.deep.eq([[], '.env', { KEY1: 'VALUE1', KEY2: 'VALUE2' }]);
    });

    it('should resolve everything', () => {
        const x = extractArgs(['-e', '.env', 'KEY1=VALUE1', 'KEY2=VALUE2', 'echo', '$KEY'], dummy);

        expect(x).to.deep.eq([['echo', '$KEY'], '.env', { KEY1: 'VALUE1', KEY2: 'VALUE2' }]);
    });
});
