# pkgname

[![npm][0]][1]
[![Build Status][2]][3]
[![Commitizen friendly][4]][5]

A simple tool that helps you find a name for your app, framework or library.

The name suggestions are generated using data from [WordNet®][6], a lexical database for English.

![Screenshot](https://raw.githubusercontent.com/clebert/pkgname/master/screenshot.png)

## Installation

```sh
npm install -g pkgname
```

## Usage

```
Usage
  $ pkgname [options]

Options
  --help, -h                Usage information
  --version, -v             Version information
  --max-length <n>          Displays only names with a maximum length of <n>
  --npm-check               Displays only names that are available on npm
  --npm-latest              Downloads always the latest list of npm package names, even if you already have them
  --remove-hyphens          Removes the hyphens from all hyphenated names
  --search-definitions <s>  Displays only names whose definition match the case-insensitive pattern <s>
  --search-names <s>        Displays only names that match the case-insensitive pattern <s>
  --shuffle-names           Displays the names in random order

Examples
  $ pkgname
  $ pkgname --npm-check --npm-latest
  $ pkgname --max-length 7 --npm-check --search-definitions "the [a-z]+ star" --shuffle-names
  $ pkgname --npm-check --remove-hyphens --search-names "^[a-z]{5}$"
```

## Development

### Installing the dev dependencies

```sh
npm install
```

### Watching the sources and tests

```sh
npm run watch
```

### Checking for formatting and linting errors

```sh
npm run check
```

### Formatting the sources

```sh
npm run format
```

### Committing a new change

```sh
npm run cz
```

### Publishing a new version

```sh
npm run release
```

```sh
git push --follow-tags origin master
```

```sh
npm publish
```

### Starting in debug mode

```sh
DEBUG=* node ./lib/index.js
```

---
Built by (c) Clemens Akens. Released under the MIT license.

[0]: https://img.shields.io/npm/v/pkgname.svg?maxAge=3600
[1]: https://www.npmjs.com/package/pkgname
[2]: https://travis-ci.org/clebert/pkgname.svg?branch=master
[3]: https://travis-ci.org/clebert/pkgname
[4]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[5]: http://commitizen.github.io/cz-cli/
[6]: http://wordnet.princeton.edu/wordnet/
