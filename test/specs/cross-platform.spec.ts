import { after, afterEach, before, describe, it } from 'node:test';
import { expect } from 'chai';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let bin: string;
let currentDir: string;

describe('cross platform', () => {
    before(() => {
        const output = execSync('npm root').toString();

        bin = output?.trim() + '/.bin/';
        currentDir = process.cwd();

        process.chdir(__dirname);
    });

    after(() => {
        execSync('cd ' + currentDir);
    });

    afterEach(() => {
        delete process.env.TEST;
    });

    it('x-var should read variable from the command line', () => {
        const test = script('x-var TEST=passed! echo %TEST%');

        expect(test).to.eq('passed!');
    });

    it('x-var should read variable from the process env', () => {
        process.env.TEST = 'passed!';
        const test = script('x-var echo %TEST%');

        expect(test).to.eq('passed!');
    });

    it('x-env should read variable from the command line', () => {
        const test = script('x-env TEST=passed! echo %TEST%');

        expect(test).to.eq('passed!');
    });

    it('x-env should read variable from the process env', () => {
        process.env.TEST = 'passed!';
        const test = script('x-env echo %TEST%');

        expect(test).to.eq('passed!');
    });

    it('x-env should read variable from the local .env file', () => {
        const test = script('x-env echo %TEST%');

        expect(test).to.eq('PASSED IMPLICIT');
    });

    it('x-env should read variable from the .env file by the custom path', () => {
        const test = script('x-env -e=./.env-explicit echo %TEST%');

        expect(test).to.eq('PASSED EXPLICIT');
    });

    it('should work being enclosed into single quotes', () => {
        process.env.TEST = 'passed!';
        const test = script(`x-var 'echo $TEST'`);

        expect(test).to.eq('passed!');
    });

    it('should work with curly braces', () => {
        process.env.TEST = 'passed!';
        const test = script(`x-var 'echo \${TEST}'`);

        expect(test).to.eq('passed!');
    });
});

function script(command: string): string {
    return execSync(bin + command).toString().trim();
}
