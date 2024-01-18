# `x-var`

## Purpose

The main purpose of this package is the same as the main purpose of the
[`cross-var`](https://www.npmjs.com/package/cross-var)
As the `cross-var` package is derelict and has not been updated for more than five years, this package serves as a replacement.

## Difference with the cross-var package

* replace `@babel` with `typescript` and move it to devDependencies
* fix stderr and stdout
* fix exit code
* upgrade `cross-spawn`
* add test

## Overview

When using `npm scripts` it creates a lot of environment variables that are available for you to leverage when executing scripts.

If you'd like to take a look at all of the variables then you can run `npm run env` in your terminal. 

```
> npm run env

npm_package_name=cross-var
npm_package_author_name=Elijah Manor
npm_package_version=1.0.0
... lots more ...
```

Now you can use those environment variables in your `npm scripts` by referencing them like the following

```
{
  "name": "World",
  "scripts": {
    "//": "The following only works on Mac OS X/Linux (bash)",
    "bash-script": "echo Hello $npm_package_name"
    "//": "The following only works on a Windows machine",
    "win-script": "echo Hello %npm_package_name%"
  }
}
```

```
> npm run bash-script

Hello World
```
However, this won't work on Windows... because it expects the variables to be surrounded by percent signs, so we can change our script just slightly.

### `x-var` to the Rescue!

The goal of `x-var` is to let you use one script syntax to work either on a **Mac OS X/Linux (bash)** or **Windows**. Reference the [Usage]() documention below on how to use `.x-var` in your scripts.

## Usage

### Simple Commands

```
{
  "version": "1.0.0",
  "config": {
    "port": "1337"
  },
  "scripts": {
    "prebuild": "x-var rimraf public/$npm_package_version",
    "build:html": "x-var jade --obj data.json src/index.jade --out public/$npm_package_version/",
    "server:create": "x-var http-server public/$npm_package_version -p $npm_package_config_port",
    "server:launch": "x-var opn http://localhost:$npm_package_config_port"
  }
}
```

### Complex Commands

```
{
  "version": "1.0.0",
  "scripts": {
    "build:css": "x-var \"node-sass src/index.scss | postcss -c .postcssrc.json | cssmin > public/$npm_package_version/index.min.css\"",
    "build:js": "x-var \"mustache data.json src/index.mustache.js | uglifyjs > public/$npm_package_version/index.min.js\"",
  }
}
```

## But What About!?!

> Click on one of the following questions to reveal a detailed answer

<details>
	<summary>Why don't you use `cross-env`?</summary>
    `cross-env` is great for scripts that need a particular environment variable
set, but isn't intended to fix cross-environment issues when using variables
inside an `npm script` 
</details>

<details>
	<summary>Why don't you use an external node file?</summary>
    That is a fine solution to this problem, but if you would rather stick to
straight up `npm scripts`, then this is a good solution
</details>

<details>
  <summary>Why don't you just use Windows 10 Ubuntu-based Bash shell?</summary>
Yes, if you can do that... then great! Windows 10’s version 1607 update, dubbed the “Anniversary Update”, has [intergrated a great bash shell](https://msdn.microsoft.com/en-us/commandline/wsl/about) that should allow you to run Linux software directly on Windows without any changes.

However, if you want to support older Windows versions, then you might consider using `cross-env` or another approach to leverage environment variables in your scripts.
</details>
