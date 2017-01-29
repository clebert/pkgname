import { green, red, yellow } from 'chalk';
import fetch from 'node-fetch';
import { loadNpmPackageNames, saveNpmPackageNames } from './store';

interface NpmPackageData {
  readonly id: string;
}

interface NpmRegistryData {
  readonly total_rows: number;
  readonly rows: NpmPackageData[];
}

export async function fetchNpmPackageNames(force?: boolean): Promise<string[]> {
  let npmPackageNames = loadNpmPackageNames();

  if (npmPackageNames && !force) {
    console.log(green('\u2713 The npm registry data is already fetched'));

    return npmPackageNames;
  }

  if (!npmPackageNames) {
    console.log(red('\u2717 The npm registry data is not yet fetched'));
  }

  console.log(yellow('\u2026 Fetching the latest npm registry data'));

  const res = await fetch('https://skimdb.npmjs.com/registry/_all_docs');
  const data: NpmRegistryData = await res.json();

  if (data.total_rows !== data.rows.length) {
    throw new Error('Invalid npm registry data');
  }

  npmPackageNames = data.rows.map(row => row.id);

  saveNpmPackageNames(npmPackageNames);

  console.log(green('\u2713 The latest npm registry data is now fetched'));

  return npmPackageNames;
}
