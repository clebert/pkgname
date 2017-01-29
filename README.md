# pkgname

[![npm][0]][1]
[![Build Status][2]][3]
[![Commitizen friendly][4]][5]

A simple tool that helps you find a name for your app, framework or library.

## Installation

```sh
npm install -g pkgname
```

## Usage

```
Usage
  $ pkgname [options]

Options
  --help, -h        Usage information
  --version, -v     Version information
  --npm-check       Displays only names that are available on npm
  --npm-latest      Fetches the latest npm registry data even if it's already fetched
  --max-length <n>  Displays only names with a maximum length of <n>

Examples
  $ pkgname
  $ pkgname --npm-check --max-length 7
  $ pkgname --npm-check --npm-latest --max-length 7
```

## Roadmap

- [ ] Categorized names: `--animal`, `--food`, `--person`, `--plant`, `...`
- [ ] Favorites list

## Development

### Installing the dev dependencies

```sh
npm install
```

### Watching the sources

```sh
npm run watch
```

### Running the tests

```sh
npm test
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

---
Built by (c) Clemens Akens. Released under the MIT license.

[0]: https://img.shields.io/npm/v/pkgname.svg?maxAge=3600
[1]: https://www.npmjs.com/package/pkgname
[2]: https://travis-ci.org/clebert/pkgname.svg?branch=master
[3]: https://travis-ci.org/clebert/pkgname
[4]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[5]: http://commitizen.github.io/cz-cli/
