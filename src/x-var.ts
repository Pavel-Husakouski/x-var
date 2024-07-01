#!/usr/bin/env node

import { interpolate } from './interpolate';
import { extractArgs } from './parse';
import * as shell from 'shelljs';
import * as os from 'os';

function main() {
    const [cmdLine, path, env] = extractArgs(process.argv.slice(2), os.platform());

    if(cmdLine.length === 0) {
        console.error('Usage: x-var [[KEY=VALUE] <list of variables>] <command> [args...]');

        process.exit(1);
    }

    const newCommandLine = interpolate(cmdLine, { ...process.env, ...env });

    return shell.exec(newCommandLine.join(' ')).code;
}

main();