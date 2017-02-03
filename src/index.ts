#!/usr/bin/env node

import createDebug = require('debug');

import * as meow from 'meow';
import { main } from './main';

const debug = createDebug('index');

const help = `
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
`;

const args = meow(help, {
  alias: {
    h: 'help',
    v: 'version'
  }
});

const knownFlags = [
  'maxLength',
  'npmCheck',
  'npmLatest',
  'removeHyphens',
  'searchDefinitions',
  'searchNames',
  'shuffleNames'
];

for (const flag of Object.keys(args.flags)) {
  if (!knownFlags.some(knownFlag => knownFlag === flag)) {
    debug('unknown flag: %s', flag);

    args.showHelp();

    process.exit(1);
  }
}

// tslint:disable-next-line no-floating-promises
main({
  maxLength: args.flags['maxLength'] && parseInt(args.flags['maxLength'], 10),
  npmCheck: Boolean(args.flags['npmCheck']),
  npmLatest: Boolean(args.flags['npmLatest']),
  removeHyphens: Boolean(args.flags['removeHyphens']),
  searchDefinitions: args.flags['searchDefinitions'],
  searchNames: args.flags['searchNames'],
  shuffleNames: Boolean(args.flags['shuffleNames'])
}).catch(error => {
  console.error(error && error.message ? error.message : error);

  process.exit(1);
});
