# x-var

`cross-var` revamped! Use same env var syntax under Linux and Windows. `.env` supported!

# Capabilities

* Use the same syntax for all operating systems
* Load `.env` files
* Set environment variables in the command line for all operating systems
* Postpone the variable replacement

# Use the same syntax for all operating systems

The variable placeholders are replaced by the `x-var` package. The placeholders are in the form `$VAR` or `%VAR%`.
See the section [Caveats of the Linux and Windows command line compatibility](#caveats-of-the-Linux-and-Windows-command-line-compatibility) for more details.

Look at the examples below. If you're Linux addicted:
```json
{
  "scripts": {
    "version": "x-var echo \\$npm_package_version%"
  }
}
```
or, if you lean towards the Windows style:
```json
{
  "scripts": {
    "version": "x-var echo %npm_package_version%"
  }
}
```
Both will render the version of the package.

## Source of variables

There is a bunch of sources of variables:
* local host operating system variables
* CI/CI
* docker
* user variables
* `npm config` - npm configuration
* `package.json` - package.json file
* ...

All these variables are available in the `npm scripts`.
Execute `npm run env` to see the list of available variables.

## .env files

Some projects use .env files, i.e.
* `.env` - default variables
* `.env-stage` - staging variables
* `.env-prod` - production variables

For such cases there is an `x-env` utility:
```json
{
  "scripts": {
    "run:dev": "x-env echo \\$DEPLOY_HOST",
    "run:prod": "x-env -e=.prod.env echo \\$DEPLOY_HOST"
  }
}
```
Note:
* The `x-env` utility just loads the `.env` file and executes the command.
* The `-e` option is used to specify the custom `.env` file.
* `dotenv` package is used under the hood. So, almost all capabilities of these packages are kept.

Warning - the `.env` is loaded directly into `process.env` which makes all variables to be visible to the target application or script. If the `.env` is used by the target application, consider to use `x-var` to avoid conflicts.

Generally speaking, the `x-env` utility should be used for the most of the cases. The `x-var` should be used to avoid using `.env` files.

# Caveats of the Linux and Windows command line compatibility

The Linux command line uses `$` to access the environment variables, while the Windows command line uses `%`.
However, this is not the only difference. The Linux command line replaces the variables before the command is executed, while the Windows command line replaces the variables during the command execution.
Consider a simple example:
```bash 
TEST=PASSED echo $TEST
```
The expected output is `PASSED`. But the actual output is empty!
This is because the `$TEST` is replaced by the shell before the command is executed.
The very same if we run the command in the `npm scripts`:
```json
{
  "scripts": {
    "example": "TEST=PASSED echo $TEST"
  }
}
```
The output is empty as well. To fix this you might need to escape the dollar `$` sign:
```json
{
  "scripts": {
    "example": "TEST=PASSED echo \\$TEST"
  }
}
```
However, this won't work being run under Windows! The solution - [Use the same syntax for all operating systems](#use-the-same-syntax-for-all-operating-systems)

## Linux only solution

Despite the fact that Linux command line replaces the variables before the command is executed, there are still some useful features.
If the cross-platform compatibility is not required, the encapsulation of the variable in the single quotes will work:
Late evaluation of the variable:
```bash
x-var TEST=PASSED echo \$TEST
```
same as
```bash
TEST=PASSED x-var echo \$TEST
```
In this case the variable is not replaced by the shell, but by the `x-var` package.

## Difference with the cross-var package

* replace `@babel` with `typescript` and move it to devDependencies
* fix stderr and stdout
* fix exit code
* upgrade `cross-spawn`
* add test
* add x-env utility to load `.env` files
* fix the partial replacement of the variables
* capability to set environment variables in the command line
* fix stderr, again - replace the `cross-spawn` with the `shell.js`
* correct escaping of the dollar `$` sign under Windows

