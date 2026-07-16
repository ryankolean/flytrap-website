import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { extractSoup } from '../.github/scripts/specials-sync.mjs';
import { updateSoupSpecial } from '../apps-script/lib/specials.js';

const HERE = dirname(fileURLToPath(import.meta.url));

// Toast payload with a "Soup of the Day" item carrying the given modifier groups.
const soupPayload = (modifierGroups) => ({
  menus: [{ name: 'Food', menuGroups: [
    { name: 'Other Stuff', menuItems: [
      { name: 'Soup of the Day', description: 'd', modifierGroups },
    ] },
  ] }],
});

test('extractSoup reads Cup/Bowl modifier prices (Toast v2 shape)', () => {
  const soup = extractSoup(soupPayload([
    { name: 'Size', modifierOptions: [{ name: 'Cup', price: 5 }, { name: 'Bowl', price: 6 }] },
  ]));
  assert.deepEqual(soup, { cup: 5, bowl: 6 });
});

test('extractSoup finds the soup item nested anywhere in the tree', () => {
  const payload = { menus: [{ menuGroups: [
    { name: 'Food', menuGroups: [
      { name: 'Sides', menuItems: [
        { name: 'SOUP OF THE DAY', modifierGroups: [
          { name: 'Size', modifierOptions: [{ name: 'Cup', price: 4.5 }, { name: 'Bowl', price: 5.5 }] },
        ] },
      ] },
    ] },
  ] }] };
  assert.deepEqual(extractSoup(payload), { cup: 4.5, bowl: 5.5 });
});

test('extractSoup tolerates optionGroups/options aliases', () => {
  const payload = { menus: [{ menuGroups: [{ name: 'X', menuItems: [
    { name: 'Soup of the Day', optionGroups: [
      { name: 'Size', options: [{ name: 'Cup', price: 5 }, { name: 'Bowl', price: 6 }] },
    ] },
  ] }] }] };
  assert.deepEqual(extractSoup(payload), { cup: 5, bowl: 6 });
});

test('extractSoup returns null when the soup item is absent', () => {
  const payload = { menus: [{ menuGroups: [{ name: 'Eggs', menuItems: [{ name: 'Omelette', price: 9 }] }] }] };
  assert.equal(extractSoup(payload), null);
});

test('extractSoup returns null when there are no cup/bowl modifiers', () => {
  assert.equal(extractSoup(soupPayload([])), null);
  assert.equal(extractSoup(soupPayload([
    { name: 'Size', modifierOptions: [{ name: 'Large', price: 9 }] },
  ])), null);
});

test('extractSoup returns a partial result when only one size exists', () => {
  const soup = extractSoup(soupPayload([
    { name: 'Size', modifierOptions: [{ name: 'Bowl', price: 6 }] },
  ]));
  assert.deepEqual(soup, { bowl: 6 });
});

test('extractSoup works against the committed fixture', async () => {
  const payload = JSON.parse(await readFile(resolve(HERE, '../.github/scripts/fixtures/soup.sample.json'), 'utf8'));
  assert.deepEqual(extractSoup(payload), { cup: 5, bowl: 6 });
});

const DATA = [
  'window.FT_DATA = {',
  '  /* EXTRAS:START */',
  '  muffinSpecial: { name: "Mini Muffins", flavor: "Blueberry Lemon" },',
  '  soupSpecial: { name: "Soup of the Day", flavor: "Chickpea Lemon Rice", cup: "5.00", bowl: "6.00" },',
  '  /* EXTRAS:END */',
  '};',
].join('\n');

test('updateSoupSpecial writes cup/bowl, preserves name/flavor and muffin', () => {
  const out = updateSoupSpecial(DATA, { cup: 5, bowl: 7 });
  assert.match(out, /soupSpecial: \{ name: "Soup of the Day", flavor: "Chickpea Lemon Rice", cup: "5\.00", bowl: "7\.00" \}/);
  assert.match(out, /muffinSpecial: \{ name: "Mini Muffins", flavor: "Blueberry Lemon" \}/);
});

test('updateSoupSpecial money-formats numbers and strips a leading $', () => {
  const out = updateSoupSpecial(DATA, { cup: '$4', bowl: 6.5 });
  assert.match(out, /cup: "4\.00", bowl: "6\.50"/);
  assert.doesNotMatch(out, /cup: "\$/);
});

test('updateSoupSpecial preserves the existing cup when only bowl is given', () => {
  const out = updateSoupSpecial(DATA, { bowl: 8 });
  assert.match(out, /cup: "5\.00", bowl: "8\.00"/);
});

test('updateSoupSpecial throws when soupSpecial is absent', () => {
  assert.throws(() => updateSoupSpecial('window.FT_DATA = {};', { cup: 5 }), /soupSpecial/);
});
