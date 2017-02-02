#!/usr/bin/env node

import * as meow from 'meow';
import { main } from './main';

const help = `
  Usage
    $ pkgname [options]

  Options
    --help, -h            Usage information
    --version, -v         Version information
    --npm-check           Displays only names that are available on npm
    --npm-latest          Downloads always the latest list of npm package names, even if you already have them
    --max-length <n>      Displays only names with a maximum length of <n>
    --search-pattern <s>  Displays only names that themselves or their definitions match the case-insensitive pattern

  Examples
    $ pkgname
    $ pkgname --npm-check --max-length 7
    $ pkgname --npm-check --npm-latest --max-length 7
    $ pkgname --npm-check --max-length 7 --search-pattern "the [a-z]+ star"
`;

const args = meow(help, {
  alias: {
    h: 'help',
    v: 'version'
  }
});

const knownFlags = ['maxLength', 'npmCheck', 'npmLatest', 'searchPattern'];

for (const flag of Object.keys(args.flags)) {
  if (!knownFlags.some(knownFlag => knownFlag === flag)) {
    args.showHelp();

    process.exit(1);
  }
}

// tslint:disable-next-line no-floating-promises
main({
  maxLength: args.flags['maxLength'] && parseInt(args.flags['maxLength'], 10),
  npmCheck: Boolean(args.flags['npmCheck']),
  npmLatest: Boolean(args.flags['npmLatest']),
  searchPattern: args.flags['searchPattern']
}).catch(error => {
  console.error(error && error.message ? error.message : error);

  process.exit(1);
});
