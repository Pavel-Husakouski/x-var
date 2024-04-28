#!/usr/bin/env node

import { config } from 'dotenv';
import { interpolate } from './interpolate';
import { extractArgs } from './parse';
import * as shell from 'shelljs';

function main() {
    const [cmdLine, path, env] = extractArgs(process.argv.slice(2));

    if(cmdLine.length === 0) {
        console.error('Usage: x-env [-e <path to .env file>] [[KEY=VALUE] <list of variables>] <command> [args...]');

        process.exit(1);
    }

    config({ path: path || '.env' });

    const newCommandLine = interpolate(cmdLine, { ...process.env, ...env });

    return shell.exec(newCommandLine.join(' ')).code;
}

main();