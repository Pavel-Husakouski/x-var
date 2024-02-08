#!/usr/bin/env node

import * as spawn from 'cross-spawn';
// @ts-ignore
import * as exit from 'exit';
import { interpolate } from './interpolate';
import { extractArgs } from './parse';

function main() {
    const [cmdLine, path, env] = extractArgs(process.argv.slice(2));

    if(cmdLine.length === 0) {
        console.error('Usage: x-var [[KEY=VALUE] <list of variables>] <command> [args...]');

        exit(1);
    }

    const [command, ...args] = interpolate(cmdLine, {...process.env, ...env});
    const proc = spawn.sync(command, args, { stdio: 'inherit' });

    exit(proc.status);
}

main();