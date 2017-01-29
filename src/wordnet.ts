import gunzip = require('gunzip-maybe');
import { get } from 'http';
import { extract } from 'tar-stream';
import { getCache } from './cache';

export interface LexicalDatabase {
  readonly [filename: string]: string;
}

export function createNounDictionary(lexicalDatabase: LexicalDatabase): Map<string, string> {
  const nounDictionary = new Map<string, string>();
  const nounData = lexicalDatabase['dict/data.noun'];

  if (!nounData) {
    throw new Error('Database entry not found: "dict/data.noun"');
  }

  const lines = nounData.trim().split('\n').map(line => line.trim());

  for (const line of lines) {
    const result = /^[0-9]{8}\s[0-9]{2}\s[a-z]\s[0-9]{2}\s(\S+)/.exec(line);

    if (result) {
      const noun = result[1].replace(/[^A-Za-z_]/g, '').replace(/_/g, ' ').trim().replace(/ /g, '-').toLowerCase();
      const definition = line.split('|')[1].trim();

      nounDictionary.set(noun, definition);
    }
  }

  return nounDictionary;
}

const cacheKey = 'lexicalDatabase';

export async function fetchLexicalDatabase(): Promise<LexicalDatabase> {
  const cache = getCache();

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return new Promise<LexicalDatabase>((resolve, reject) => {
    get('http://wordnetcode.princeton.edu/wn3.1.dict.tar.gz', res => {
      res.once('error', reject);

      if (res.statusCode !== 200) {
        res.resume();

        reject(new Error(`Expected status code 200, got ${res.statusCode}`));

        return;
      }

      const gzStream = gunzip();

      gzStream.once('error', reject);

      const tarStream = extract();

      tarStream.once('error', reject);

      const lexicalDatabase: LexicalDatabase = {};

      tarStream.on('entry', (header, stream, next) => {
        stream.once('error', reject);

        stream.setEncoding('utf8');

        let data = '';

        stream.on('data', (chunk: string) => {
          data += chunk;
        });

        stream.once('end', () => {
          (lexicalDatabase as Partial<LexicalDatabase>)[header.name] = data;

          next();
        });

        stream.resume();
      });

      tarStream.once('finish', () => {
        cache.set(cacheKey, lexicalDatabase);

        resolve(lexicalDatabase);
      });

      res.pipe(gzStream).pipe(tarStream);
    });
  });
}
