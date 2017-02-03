/* tslint:disable max-line-length */

import test from 'ava';
import { readFileSync } from 'fs';
import { createNounDictionary } from '../wordnet';

const lexicalDatabase = {
  'dict/data.noun': readFileSync(__dirname + '/../../fixtures/dict/data.noun', 'utf-8')
};

test('create noun dictionary with hyphenated names', t => {
  t.plan(7);

  const nounDictionary = createNounDictionary(lexicalDatabase);

  t.is(nounDictionary.size, 6);
  t.is(nounDictionary.get('9-11'), 'the day in 2001 when Arab suicide bombers hijacked United States airliners and used them as bombs');
  t.is(nounDictionary.get('rock-n-roll'), 'a genre of popular music originating in the 1950s; a blend of black rhythm-and-blues with white country-and-western; "rock is a generic term for the range of styles that evolved out of rock\'n\'roll."');
  t.is(nounDictionary.get('y2k'), 'the year 2000 in the Gregorian calendar');
  t.is(nounDictionary.get('all-souls-day'), 'a day of supplication for all the souls in purgatory');
  t.is(nounDictionary.get('entity'), 'that which is perceived or known or inferred to have its own distinct existence (living or nonliving)');
  t.is(nounDictionary.get('physical-entity'), 'an entity that has physical existence');
});

test('create noun dictionary without hyphenated names', t => {
  t.plan(7);

  const nounDictionary = createNounDictionary(lexicalDatabase, true);

  t.is(nounDictionary.size, 6);
  t.is(nounDictionary.get('911'), 'the day in 2001 when Arab suicide bombers hijacked United States airliners and used them as bombs');
  t.is(nounDictionary.get('rocknroll'), 'a genre of popular music originating in the 1950s; a blend of black rhythm-and-blues with white country-and-western; "rock is a generic term for the range of styles that evolved out of rock\'n\'roll."');
  t.is(nounDictionary.get('y2k'), 'the year 2000 in the Gregorian calendar');
  t.is(nounDictionary.get('allsoulsday'), 'a day of supplication for all the souls in purgatory');
  t.is(nounDictionary.get('entity'), 'that which is perceived or known or inferred to have its own distinct existence (living or nonliving)');
  t.is(nounDictionary.get('physicalentity'), 'an entity that has physical existence');
});
