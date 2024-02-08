#!/usr/bin/env node

import * as spawn from 'cross-spawn';
// @ts-ignore
import * as exit from 'exit';
import { config } from 'dotenv';
import * as process from 'process';
import { interpolate } from './interpolate';
import { extractArgs } from './parse';

function main() {
    const [cmdLine, path, env] = extractArgs(process.argv.slice(2));

    config({ path: path || '.env' });

    const [command, ...args] = interpolate(cmdLine, { ...process.env, ...env });
    const proc = spawn.sync(command, args, { stdio: 'inherit' });

    exit(proc.status);
}

main();