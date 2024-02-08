# x-var

## Purpose

Maintaining `npm scripts` that work on both **macOS/Linux (bash)** and **Windows** is a hassle. This is because the two operating systems have different syntax for environment variables. Some utilities accept variables, while others accept only command line arguments. The solution is the `x-var` package.

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

## How to use the same syntax for all operating systems

See examples below. 
```json
{
  "scripts": {
    "example-1": "x-var echo $npm_package_json"
  }
}
```

When a `.env` files are used, there is a possibility to use them with `x-env` utility:
```json
{
  "scripts": {
    "example-2": "x-env echo $DEPLOY_HOST",
    "example-3": "x-env -e=./.env-prod echo $DEPLOY_HOST"
  }
}
```
Note: 
* The `x-env` utility just loads the `.env` file and executes the command. 
* The `-e` option is used to specify the `.env` file.
* `dotenv` package is used under the hood. So, almost all capabilities of this packages are kept.

Warning - the `.env` is loaded directly into `process.env` which makes all variables to be visible to the target application or script. If the `.env` is used by the target application, consider to use `x-var` to avoid conflicts.

Generally speaking, the `x-env` utility should be used for the most of the cases. The `x-var` should be used to avoid using `.env` files.

## Difference with the cross-var package

* replace `@babel` with `typescript` and move it to devDependencies
* fix stderr and stdout
* fix exit code
* upgrade `cross-spawn`
* add test
* add x-env utility to load `.env` files
* fix the partial replacement of the variables
* capability to set environment variables in the command line