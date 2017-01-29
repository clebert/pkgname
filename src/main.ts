import shuffle = require('lodash/shuffle');

import { blue, gray, green, yellow } from 'chalk';
import { createInterface } from 'readline';
import { fetchNpmPackageNames } from './npm';
import { fetchDictionary } from './wordnet';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

export interface Options {
  readonly maxLength?: number;
  readonly npmCheck?: boolean;
  readonly npmLatest?: boolean;
}

export async function main(options: Options): Promise<void> {
  console.log(yellow(`Detected options: ${JSON.stringify(options)}\n`));

  const npmPackageNames = new Set(options.npmCheck ? await fetchNpmPackageNames(options.npmLatest) : []);
  const dictionary = new Map(await fetchDictionary());

  let names = [];

  for (const name of dictionary.keys()) {
    if ((!options.maxLength || name.length <= options.maxLength) && !npmPackageNames.has(name)) {
      names.push(name);
    }
  }

  names = shuffle(names);

  console.log(green(`\n${names.length} names are available`));
  console.log(yellow('\nPress \u23ce to display next name\nPress q+\u23ce to quit'));

  for (const name of names) {
    const definition = dictionary.get(name);

    if (definition) {
      const query = `\n${blue(name)}: ${gray(definition)}`;
      const response = await new Promise<string>(resolve => {
        rl.question(query, resolve);
      });

      if (response === 'q') {
        process.exit(0);
      }
    }
  }

  process.exit(0);
}
