#!/usr/bin/env node

import * as meow from 'meow';
import { main } from './main';

const help = `
  Usage
    $ pkgname [options]

  Options
    --help, -h        Usage information
    --version, -v     Version information
    --npm-check       Displays only names that are available on npm
    --latest          Fetches the latest npm registry data even if it's already fetched
    --max-length <n>  Displays only names with a maximum length of <n>

  Examples
    $ pkgname
    $ pkgname --npm-check --max-length 7
    $ pkgname --npm-check --latest --max-length 7
`;

const args = meow(help, {
  alias: {
    h: 'help',
    v: 'version'
  }
});

// tslint:disable-next-line no-floating-promises
main({
  latest: Boolean(args.flags['latest']),
  maxLength: args.flags['maxLength'] && parseInt(args.flags['maxLength'], 10),
  npmCheck: Boolean(args.flags['npmCheck'])
}).catch(error => {
  console.error(error && error.message ? error.message : error);

  process.exit(1);
});
