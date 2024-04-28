#!/usr/bin/env node

import * as spawn from 'cross-spawn';
import { config } from 'dotenv';
import * as process from 'process';
import { interpolate } from './interpolate';
import { extractArgs } from './parse';

function main() {
    const [cmdLine, path, env] = extractArgs(process.argv.slice(2));

    if(cmdLine.length === 0) {
        console.error('Usage: x-env [-e <path to .env file>] [[KEY=VALUE] <list of variables>] <command> [args...]');

        process.exit(1);
    }

    config({ path: path || '.env' });

    const [command, ...args] = interpolate(cmdLine, { ...process.env, ...env });
    const proc = spawn.sync(command, args, { stdio: 'inherit' });

    process.exit(proc.status);
}

main();