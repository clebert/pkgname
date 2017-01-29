import Conf = require('conf');

let cache: Conf | undefined;

export function getCache(): Conf {
  return cache ? cache : (cache = new Conf({ configName: 'v2' }));
}
