import createDebug = require('debug');
import shuffle = require('lodash/shuffle');

import { blue, gray, green, yellow } from 'chalk';
import { createInterface } from 'readline';
import { readCache, writeCache } from './cache';
import { PackageRegistry, createReservedNames, fetchPackageRegistry } from './npm';
import { LexicalDatabase, createNounDictionary, fetchLexicalDatabase } from './wordnet';

const debug = createDebug('main');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

export interface Options {
  readonly maxLength?: number;
  readonly npmCheck?: boolean;
  readonly npmLatest?: boolean;
  readonly removeHyphens?: boolean;
  readonly searchDefinitions?: string;
  readonly searchNames?: string;
  readonly shuffleNames?: boolean;
}

function startWaitAnimation(prefix: string): () => void {
  process.stdout.write(yellow(`\n${prefix}`));

  const intervalId = setInterval(() => {
    process.stdout.write(yellow('.'));
  }, 1000);

  return () => {
    process.stdout.write('\n');

    clearInterval(intervalId);
  };
}

async function downloadLexicalDatabase(): Promise<LexicalDatabase> {
  const stopWaitAnimation = startWaitAnimation('Downloading the WordNet lexical database');
  const lexicalDatabase = await fetchLexicalDatabase();

  await writeCache('lexicalDatabase', lexicalDatabase);

  stopWaitAnimation();

  return lexicalDatabase;
}

async function downloadPackageRegistry(): Promise<PackageRegistry> {
  const stopWaitAnimation = startWaitAnimation('Downloading the latest list of npm package names');
  const packageRegistry = await fetchPackageRegistry();

  await writeCache('packageRegistry', packageRegistry);

  stopWaitAnimation();

  return packageRegistry;
}

async function loadNounDictionary(options: Options): Promise<Map<string, string>> {
  try {
    return createNounDictionary(await readCache<LexicalDatabase>('lexicalDatabase'), options.removeHyphens);
  } catch (error) {
    return createNounDictionary(await downloadLexicalDatabase(), options.removeHyphens);
  }
}

async function loadReservedNames(options: Options): Promise<Set<string> | undefined> {
  if (!options.npmCheck) {
    return;
  }

  if (options.npmLatest) {
    return createReservedNames(await downloadPackageRegistry());
  }

  try {
    return createReservedNames(await readCache<PackageRegistry>('packageRegistry'));
  } catch (error) {
    return createReservedNames(await downloadPackageRegistry());
  }
}

export async function main(options: Options): Promise<void> {
  debug('options: %o', options);

  const dictionary = await loadNounDictionary(options);
  const reservedNames = await loadReservedNames(options);

  const { maxLength, searchDefinitions, searchNames, shuffleNames } = options;

  let names = [];

  for (const name of dictionary.keys()) {
    if ((!maxLength || name.length <= maxLength) && (!reservedNames || !reservedNames.has(name))) {
      names.push(name);
    }
  }

  if (searchDefinitions) {
    const regex = new RegExp(searchDefinitions, 'i');

    names = names.filter(name => {
      const definition = dictionary.get(name);

      return definition && regex.test(definition);
    });
  }

  if (searchNames) {
    const regex = new RegExp(searchNames, 'i');

    names = names.filter(name => regex.test(name));
  }

  names = shuffleNames ? shuffle(names) : names.sort();

  console.log(green(`\n${names.length} names are available`));
  console.log(yellow('\nPress \u23ce to display next name\nPress q+\u23ce to quit'));

  for (const name of names) {
    const definition = dictionary.get(name);

    if (definition) {
      const response = await new Promise<string>(resolve => {
        rl.question(`\n${blue(name)}: ${gray(definition)}`, resolve);
      });

      if (response === 'q') {
        process.exit(0);
      }
    }
  }

  process.exit(0);
}
