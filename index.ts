#!/usr/bin/env node

import './package.json';
import * as spawn from "cross-spawn";
import * as exit from 'exit';

function normalize(args, isWindows) {
    return args.map(arg => {
        Object.keys(process.env)
            .sort((x, y) => Number(x.length < y.length)) // sort by descending length to prevent partial replacement
            .forEach(key => {
                const regex = new RegExp(`\\$${ key }|%${ key }%`, "ig");
                arg = arg.replace(regex, process.env[key]);
            });
        return arg;
    })
}

const [command, ...args] = normalize(process.argv.slice(2), false);
const proc = spawn.sync(command, args, {stdio: "inherit"});
exit(proc.status);
