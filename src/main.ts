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
  readonly searchPattern?: string;
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

async function loadNounDictionary(): Promise<Map<string, string>> {
  try {
    return createNounDictionary(await readCache<LexicalDatabase>('lexicalDatabase'));
  } catch (error) {
    return createNounDictionary(await downloadLexicalDatabase());
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

  const nounDictionary = await loadNounDictionary();
  const reservedNames = await loadReservedNames(options);

  const { maxLength, searchPattern } = options;

  let nouns = [];

  for (const noun of nounDictionary.keys()) {
    if ((!maxLength || noun.length <= maxLength) && (!reservedNames || !reservedNames.has(noun))) {
      nouns.push(noun);
    }
  }

  if (searchPattern) {
    const regex = new RegExp(searchPattern, 'i');

    nouns = nouns.filter(noun => {
      if (regex.test(noun)) {
        return true;
      }

      const definition = nounDictionary.get(noun);

      return definition && regex.test(definition);
    });
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
