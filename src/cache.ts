import createDebug = require('debug');
import createEnvPaths = require('env-paths');
import mkdirp = require('mkdirp');

import { readFile, writeFile } from 'fs';

// tslint:disable-next-line no-var-requires
const pkg = require('../package.json');
const envPaths = createEnvPaths(`${pkg.name}@${pkg.version}`);
const debug = createDebug('cache');

debug('path: %s', envPaths.cache);

export function getCachePath(key: string): string {
  return `${envPaths.cache}/${key}.json`;
}

export async function readCache<T>(key: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    readFile(getCachePath(key), 'utf-8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

export async function writeCache<T>(key: string, value: T): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    mkdirp(envPaths.cache, error1 => {
      if (error1) {
        reject(error1);
      } else {
        writeFile(getCachePath(key), JSON.stringify(value), 'utf-8', error2 => {
          if (error2) {
            reject(error2);
          } else {
            resolve();
          }
        });
      }
    });
  });
}
