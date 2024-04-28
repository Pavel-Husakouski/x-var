# x-var

`cross-var` revamped! Use same env var syntax under Linux and Windows. `.env` supported!

## How to use the same syntax for all operating systems

The variable placeholders are replaced by the `x-var` package. The placeholders are in the form `%VAR%`.
See the section [Caveats of the linux and windows command line compatibility](#caveats-of-the-linux-and-windows-command-line-compatibility) for more details.

See examples below.
```json
{
  "scripts": {
    "version": "x-var echo %npm_package_version%"
  }
}
```
Will render the version of the package.

When a `.env` files are used, there is a possibility to use them with `x-env` utility:
```json
{
  "scripts": {
    "implicit": "x-env echo %DEPLOY_HOST%",
    "explicit": "x-env -e=./.env-prod echo %DEPLOY_HOST%"
  }
}
```
Note:
* The `x-env` utility just loads the `.env` file and executes the command.
* The `-e` option is used to specify the `.env` file.
* `dotenv` package is used under the hood. So, almost all capabilities of this packages are kept.

Warning - the `.env` is loaded directly into `process.env` which makes all variables to be visible to the target application or script. If the `.env` is used by the target application, consider to use `x-var` to avoid conflicts.

Generally speaking, the `x-env` utility should be used for the most of the cases. The `x-var` should be used to avoid using `.env` files.

## Caveats of the linux and windows command line compatibility

The linux command line uses `$` to access the environment variables, while the windows command line uses `%`.
However, this is not the only difference. The linux command line replaces the variables before the command is executed, while the windows command line replaces the variables during the command execution.
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
The output is empty as well.

The solution is to use the `x-var` package:
```json
{
  "scripts": {
    "example": "x-var echo %TEST%"
  }
}
```
Note - the percent sign `%` is used to access the environment variables. This will work on both Linux and Windows.

### Linux only solution

Despite the fact that linux command line replaces the variables before the command is executed, there are some usefull features that can be used.

If the cross-platform compatibility is not required, the encapsulation of the variable in the single quotes will work:
```bash
x-var TEST=PASSED echo \$TEST
```
same as
```bash
TEST=PASSED x-var echo \$TEST
```
In this case the variable is not replaced by the shell, but by the `x-var` package.
In contrast, under Windows, the output will be `\PASSED`, with the slash `\` in front of the variable.
Actually, I don't know how to avoid this behavior under Windows. If it is doable, please create a pull request.

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

