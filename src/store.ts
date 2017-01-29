import Conf = require('conf');

const config = new Conf({ configName: 'v1' });

export function loadDictionary(): [string, string][] | undefined {
  return config.get('dictionary');
}

export function saveDictionary(dictionary: [string, string][]): void {
  config.set('dictionary', dictionary);
}

export function loadNpmPackageNames(): string[] | undefined {
  return config.get('npmPackageNames');
}

export function saveNpmPackageNames(npmPackageNames: string[]): void {
  config.set('npmPackageNames', npmPackageNames);
}
