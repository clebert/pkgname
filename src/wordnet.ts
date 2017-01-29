import { green, red, yellow } from 'chalk';
import gunzip = require('gunzip-maybe');
import { get } from 'http';
import { extract } from 'tar-stream';
import { loadDictionary, saveDictionary } from './store';

export async function fetchDictionary(): Promise<[string, string][]> {
  let dictionary = loadDictionary();

  if (dictionary) {
    console.log(green('\u2713 The WordNet database package is already fetched'));

    return dictionary;
  }

  console.log(red('\u2717 The WordNet database package is not yet fetched'));
  console.log(yellow('\u2026 Fetching the latest WordNet database package'));

  return new Promise<[string, string][]>((resolve, reject) => {
    get('http://wordnetcode.princeton.edu/wn3.1.dict.tar.gz', res => {
      res.once('error', reject);

      if (res.statusCode === 200) {
        const gzStream = gunzip();

        gzStream.once('error', reject);

        const tarStream = extract();

        tarStream.once('error', reject);

        tarStream.once('finish', () => {
          reject(new Error('File not found: "dict/data.noun"'));
        });

        tarStream.on('entry', (header, stream, next) => {
          stream.once('error', reject);

          stream.setEncoding('utf8');

          let data = '';

          stream.on('data', (chunk: string) => {
            data += chunk;
          });

          stream.on('end', () => {
            if (header.name === 'dict/data.noun') {
              try {
                const lines = data.trim().split('\n').map(line => line.trim());

                dictionary = [];

                for (const line of lines) {
                  const result = /^[0-9]{8}\s[0-9]{2}\s[a-z]\s[0-9]{2}\s([A-Za-z_]+)/.exec(line);

                  if (result) {
                    const noun = result[1].replace(/_/g, '-').toLowerCase();

                    dictionary.push([noun, line.split('|')[1].trim()]);
                  }
                }

                saveDictionary(dictionary);

                console.log(green('\u2713 The latest WordNet database package is now fetched'));

                resolve(dictionary);
              } catch (error) {
                reject(error);
              }
            }

            next();
          });

          stream.resume();
        });

        res.pipe(gzStream).pipe(tarStream);
      } else {
        reject(new Error(`Expected status code 200, got ${res.statusCode}`));

        res.resume();
      }
    });
  });
}
