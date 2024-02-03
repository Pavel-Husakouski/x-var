#!/usr/bin/env node

import * as spawn from 'cross-spawn';
// @ts-ignore
import * as exit from 'exit';
import { interpolate } from './interpolate';

function main() {
    const cmdLine = process.argv.slice(2);
    const [command, ...args] = interpolate(cmdLine, process.env);
    const proc = spawn.sync(command, args, { stdio: 'inherit' });

    exit(proc.status);
}

main();