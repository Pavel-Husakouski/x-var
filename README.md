# x-var

`cross-var` and `cross-env` revamped! Same syntax under Linux and Windows. `.env` supported!

# Capabilities

* Use the same syntax for all operating systems [Use the same syntax for all operating systems](#use-the-same-syntax-for-all-operating-systems)
* Load `.env` files, see [env files](#env-files)
* Set environment variables in the command line for all operating systems (both `x-var` and `x-env`)
* Postpone the variable replacement

# Use the same syntax for all operating systems

The variable placeholders are replaced by the `x-var` package. The placeholders are in the form `$VAR` or `%VAR%`.
See the section [Caveats of the Linux and Windows command line compatibility](#caveats-of-the-Linux-and-Windows-command-line-compatibility) for more details.

Look at the examples below. If you're Linux addicted:
```json
{
  "scripts": {
    "version": "x-var echo \\$npm_package_version"
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

## env files

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

## Similar packages

* [cross-var](https://www.npmjs.com/package/cross-var) - the original package
* [cross-env](https://www.npmjs.com/package/cross-env) - the most popular package
* [dotenv](https://www.npmjs.com/package/dotenv) - the package to load `.env` files

## Difference with the cross-env package

* The `cross-env` package is barely maintained
* The cross-env package is unable to load `.env` files. `x-var` uses `dotenv` under the hood.
* This does not work in cross-env and it works in `x-var`:
    ```bash
    cross-env TEST=value echo \$TEST
    ```
* And this
    ```bash
    cross-env TEST=value echo %TEST%
    ```
* Cross-env relies on unmaintained `cross-spawn` package. The `x-var` uses `shell.js` package.

## Difference with the cross-var package

* the `cross-var` package in unmaintained and has dozens of vulnerabilities
* replaced `@babel` with `typescript` and move it to devDependencies
* fixed stderr and stdout
* fixed exit code
* added tests
* added `x-env` utility to load `.env` files
* fixed the partial replacement of the variables
* added capability to set environment variables in the command line
* dropped exit package
* fixed stderr, again - by replacing the `cross-spawn` with the `shell.js`
* added escaping of the dollar `$` sign under Windows

# Drawbacks

The `x-var` package is not a silver bullet. It has some drawbacks:
* it uses naive but aggressive replacement of the variables
* some things might be tricky to implement using `x-var`

Let me know if you have any issues or suggestions.