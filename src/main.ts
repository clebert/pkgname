import shuffle = require('lodash/shuffle');

import { blue, gray, green, yellow } from 'chalk';
import { createInterface } from 'readline';
import { createReservedNames, fetchPackageRegistry } from './npm';
import { createNounDictionary, fetchLexicalDatabase } from './wordnet';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

export interface Options {
  readonly maxLength?: number;
  readonly npmCheck?: boolean;
  readonly npmLatest?: boolean;
}

export async function loadNounDictionary(options: Options): Promise<Map<string, string>> {
  console.log(yellow('Loading the WordNet lexical database'));

  const lexicalDatabase = await fetchLexicalDatabase();

  return createNounDictionary(lexicalDatabase);
}

export async function loadReservedNames(options: Options): Promise<Set<string> | undefined> {
  if (!options.npmCheck) {
    return;
  }

  if (options.npmLatest) {
    console.log(yellow('Loading the latest npm package registry'));
  } else {
    console.log(yellow('Loading the npm package registry'));
  }

  const packageRegistry = await fetchPackageRegistry(options.npmLatest);

  return createReservedNames(packageRegistry);
}

export async function main(options: Options): Promise<void> {
  const nounDictionary = await loadNounDictionary(options);
  const reservedNames = await loadReservedNames(options);

  let nouns = [];

  for (const noun of nounDictionary.keys()) {
    if ((!options.maxLength || noun.length <= options.maxLength) && (!reservedNames || !reservedNames.has(noun))) {
      nouns.push(noun);
    }
  }

  nouns = shuffle(nouns);

  console.log(green(`\n${nouns.length} names are available`));
  console.log(yellow('\nPress \u23ce to display next name\nPress q+\u23ce to quit'));

  for (const noun of nouns) {
    const definition = nounDictionary.get(noun);

    if (definition) {
      const response = await new Promise<string>(resolve => {
        rl.question(`\n${blue(noun)}: ${gray(definition)}`, resolve);
      });

      if (response === 'q') {
        process.exit(0);
      }
    }
  }

  process.exit(0);
}
