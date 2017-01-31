#!/usr/bin/env node

import * as meow from 'meow';
import { main } from './main';

const help = `
  Usage
    $ pkgname [options]

  Options
    --help, -h          Usage information
    --version, -v       Version information
    --npm-check         Displays only names that are available on npm
    --npm-latest        Downloads the latest npm package registry even if it already exists
    --max-length <n>    Displays only names with a maximum length of <n>
    --search-query <s>  Displays only names that match the search query

  Examples
    $ pkgname
    $ pkgname --npm-check --max-length 7
    $ pkgname --npm-check --npm-latest --max-length 7
    $ pkgname --npm-check --max-length 7 --search-query "the brightest star"
`;

const args = meow(help, {
  alias: {
    h: 'help',
    v: 'version'
  }
});

// tslint:disable-next-line no-floating-promises
main({
  searchQuery: args.flags['searchQuery'],
  maxLength: args.flags['maxLength'] && parseInt(args.flags['maxLength'], 10),
  npmCheck: Boolean(args.flags['npmCheck']),
  npmLatest: Boolean(args.flags['npmLatest'])
}).catch(error => {
  console.error(error && error.message ? error.message : error);

  process.exit(1);
});
