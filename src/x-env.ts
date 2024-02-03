#!/usr/bin/env node

import * as spawn from 'cross-spawn';
// @ts-ignore
import * as exit from 'exit';
import { config } from 'dotenv';
import * as process from 'process';
import { interpolate } from './interpolate';

function extractArgs(args: string[]): [string[], string] {
    if (args.length === 0) {
        return [[], '.env'];
    }
    if (args[0] === '-e') {
        const env = args[1];

        return [args.slice(2), env];
    }
    if (args[0].startsWith('-e=')) {
        const env = args[0].slice(3);

        return [args.slice(1), env];
    }
    return [args, '.env'];
}

function main() {
    const [cmdLine, env] = extractArgs(process.argv.slice(2));

    config({ path: env });

    const [command, ...args] = interpolate(cmdLine, process.env);
    const proc = spawn.sync(command, args, { stdio: 'inherit' });

    exit(proc.status);
}

main();