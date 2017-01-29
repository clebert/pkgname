import Conf = require('conf');

// tslint:disable-next-line no-var-requires
const configName = require('../package.json').version;

let cache: Conf | undefined;

export function getCache(): Conf {
  return cache ? cache : (cache = new Conf({ configName }));
}
