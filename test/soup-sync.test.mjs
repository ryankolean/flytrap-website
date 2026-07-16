import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { extractSoup } from '../.github/scripts/specials-sync.mjs';
import { updateSoupSpecial } from '../apps-script/lib/specials.js';

const HERE = dirname(fileURLToPath(import.meta.url));

// Toast payload with the given menu items in one group.
const menu = (items) => ({ menus: [{ name: 'Food', menuGroups: [{ name: 'Weekly Specials', menuItems: items }] }] });
const cup = (price, description) => ({ name: 'Cup of Soup', price, description });
const bowl = (price, description) => ({ name: 'Bowl of Soup', price, description });

test('extractSoup pulls each item price + the shared description as flavor', () => {
  const soup = extractSoup(menu([cup(5, 'Chickpea Lemon Rice'), bowl(6, 'Chickpea Lemon Rice')]));
  assert.deepEqual(soup, { cup: 5, bowl: 6, flavor: 'Chickpea Lemon Rice' });
});

test('extractSoup finds the two items nested anywhere in the tree', () => {
  const payload = { menus: [{ menuGroups: [
    { name: 'Food', menuGroups: [
      { name: 'Sides', menuItems: [cup(4.5, 'Tomato Basil'), bowl(5.5, 'Tomato Basil')] },
    ] },
  ] }] };
  assert.deepEqual(extractSoup(payload), { cup: 4.5, bowl: 5.5, flavor: 'Tomato Basil' });
});

test('extractSoup matches item names case-insensitively', () => {
  const soup = extractSoup(menu([
    { name: 'CUP OF SOUP', price: 5, description: 'Corn Chowder' },
    { name: 'bowl of soup', price: 6, description: 'Corn Chowder' },
  ]));
  assert.deepEqual(soup, { cup: 5, bowl: 6, flavor: 'Corn Chowder' });
});

test('extractSoup omits flavor (preserves hand-set) when the two descriptions differ', () => {
  const soup = extractSoup(menu([cup(5, 'Chickpea Lemon Rice'), bowl(6, 'Tomato Basil')]));
  assert.deepEqual(soup, { cup: 5, bowl: 6 });
});

test('extractSoup returns a partial result when only one soup item exists', () => {
  assert.deepEqual(extractSoup(menu([bowl(6, 'Minestrone')])), { bowl: 6, flavor: 'Minestrone' });
  assert.deepEqual(extractSoup(menu([cup(5, '')])), { cup: 5 });
});

test('extractSoup returns null when neither soup item is present', () => {
  assert.equal(extractSoup(menu([{ name: 'Omelette', price: 9 }])), null);
});

test('extractSoup works against the committed fixture', async () => {
  const payload = JSON.parse(await readFile(resolve(HERE, '../.github/scripts/fixtures/soup.sample.json'), 'utf8'));
  assert.deepEqual(extractSoup(payload), { cup: 5, bowl: 6, flavor: 'Chickpea Lemon Rice' });
});

// --- updateSoupSpecial: writes cup/bowl/flavor into data.js, preserves the rest ---
const DATA = [
  'window.FT_DATA = {',
  '  /* EXTRAS:START */',
  '  muffinSpecial: { name: "Mini Muffins", flavor: "Blueberry Lemon" },',
  '  soupSpecial: { name: "Soup of the Day", flavor: "Chickpea Lemon Rice", cup: "5.00", bowl: "6.00" },',
  '  /* EXTRAS:END */',
  '};',
].join('\n');

test('updateSoupSpecial writes cup/bowl/flavor, preserves name and muffin', () => {
  const out = updateSoupSpecial(DATA, { cup: 5, bowl: 7, flavor: 'Tomato Basil' });
  assert.match(out, /soupSpecial: \{ name: "Soup of the Day", flavor: "Tomato Basil", cup: "5\.00", bowl: "7\.00" \}/);
  assert.match(out, /muffinSpecial: \{ name: "Mini Muffins", flavor: "Blueberry Lemon" \}/);
});

test('updateSoupSpecial preserves the hand-set flavor when none is provided', () => {
  const out = updateSoupSpecial(DATA, { cup: 5, bowl: 8 });
  assert.match(out, /flavor: "Chickpea Lemon Rice", cup: "5\.00", bowl: "8\.00"/);
});

test('updateSoupSpecial money-formats numbers and strips a leading $', () => {
  const out = updateSoupSpecial(DATA, { cup: '$4', bowl: 6.5 });
  assert.match(out, /cup: "4\.00", bowl: "6\.50"/);
  assert.doesNotMatch(out, /cup: "\$/);
});

test('updateSoupSpecial throws when soupSpecial is absent', () => {
  assert.throws(() => updateSoupSpecial('window.FT_DATA = {};', { cup: 5 }), /soupSpecial/);
});
