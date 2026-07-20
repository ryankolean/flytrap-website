import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { extractSoup, extractMuffin } from '../.github/scripts/specials-sync.mjs';
import { updateSoupSpecial, updateMuffinSpecial } from '../apps-script/lib/specials.js';

const HERE = dirname(fileURLToPath(import.meta.url));

// Toast payload with the given menu items in one group.
const menu = (items) => ({ menus: [{ name: 'Food', menuGroups: [{ name: 'Weekly Specials', menuItems: items }] }] });
// The current Toast shape: a single "Soup O' The Day" item, flavor in its
// description (with the 🥬 veg glyph kept verbatim), cup = base price.
const soupItem = (over = {}) => ({ name: "Soup O' The Day", price: 5, description: 'Egg Drop 🥬', ...over });
// A Cup/Bowl size modifier group on the single item.
const size = (cup, bowl) => ({ modifierGroups: [{ name: 'Size', modifierOptions: [{ name: 'Cup', price: cup }, { name: 'Bowl', price: bowl }] }] });
// The legacy shape: two separate items sharing a description.
const cup = (price, description) => ({ name: 'Cup of Soup', price, description });
const bowl = (price, description) => ({ name: 'Bowl of Soup', price, description });

// --- extractSoup: current single "Soup O' The Day" item ---
test("extractSoup reads the single item: description is the flavor (🥬 kept), base price is the cup", () => {
  assert.deepEqual(extractSoup(menu([soupItem()])), { available: true, flavor: 'Egg Drop 🥬', cup: 5, bowl: '' });
});

test('extractSoup pulls the bowl price from a size modifier on the item', () => {
  assert.deepEqual(extractSoup(menu([soupItem(size(5, 6))])), { available: true, flavor: 'Egg Drop 🥬', cup: 5, bowl: 6 });
});

test('extractSoup: out of stock -> available:false, prices cleared, message kept as the flavor', () => {
  const payload = menu([soupItem({ description: 'No soup on the weekend!', outOfStock: true, ...size(5, 6) })]);
  assert.deepEqual(extractSoup(payload), { available: false, flavor: 'No soup on the weekend!', cup: '', bowl: '' });
});

test('extractSoup: the single item takes precedence over legacy Cup/Bowl items', () => {
  const soup = extractSoup(menu([soupItem(size(5, 6)), cup(4, 'Legacy'), bowl(5, 'Legacy')]));
  assert.deepEqual(soup, { available: true, flavor: 'Egg Drop 🥬', cup: 5, bowl: 6 });
});

test('extractSoup: no size modifier -> falls back to a Bowl of Soup item for the bowl price', () => {
  assert.deepEqual(extractSoup(menu([soupItem(), bowl(6, 'ignored')])), { available: true, flavor: 'Egg Drop 🥬', cup: 5, bowl: 6 });
});

test('extractSoup finds the item nested anywhere in the tree', () => {
  const payload = { menus: [{ menuGroups: [
    { name: 'Food', menuGroups: [{ name: 'Sides', menuItems: [soupItem({ price: 4.5, ...size(4.5, 5.5) })] }] },
  ] }] };
  assert.deepEqual(extractSoup(payload), { available: true, flavor: 'Egg Drop 🥬', cup: 4.5, bowl: 5.5 });
});

test('extractSoup works against the committed fixture', async () => {
  const payload = JSON.parse(await readFile(resolve(HERE, '../.github/scripts/fixtures/soup.sample.json'), 'utf8'));
  assert.deepEqual(extractSoup(payload), { available: true, flavor: 'Egg Drop 🥬', cup: 5, bowl: 6 });
});

// --- extractSoup: legacy Cup of Soup / Bowl of Soup fallback ---
test('extractSoup (legacy): two items share a description as the flavor', () => {
  assert.deepEqual(
    extractSoup(menu([cup(5, 'Chickpea Lemon Rice'), bowl(6, 'Chickpea Lemon Rice')])),
    { available: true, cup: 5, bowl: 6, flavor: 'Chickpea Lemon Rice' },
  );
});

test('extractSoup (legacy): omits flavor (preserves hand-set) when the two descriptions differ', () => {
  assert.deepEqual(extractSoup(menu([cup(5, 'Chickpea Lemon Rice'), bowl(6, 'Tomato Basil')])), { available: true, cup: 5, bowl: 6 });
});

test('extractSoup (legacy): matches item names case-insensitively', () => {
  assert.deepEqual(
    extractSoup(menu([{ name: 'CUP OF SOUP', price: 5, description: 'Corn Chowder' }, { name: 'bowl of soup', price: 6, description: 'Corn Chowder' }])),
    { available: true, cup: 5, bowl: 6, flavor: 'Corn Chowder' },
  );
});

test('extractSoup (legacy): partial result when only one item exists', () => {
  assert.deepEqual(extractSoup(menu([bowl(6, 'Minestrone')])), { available: true, bowl: 6, flavor: 'Minestrone' });
  assert.deepEqual(extractSoup(menu([cup(5, '')])), { available: true, cup: 5 });
});

test('extractSoup (legacy): both items out of stock -> available:false, prices cleared, message kept', () => {
  const payload = menu([
    { name: 'Cup of Soup', price: 5, description: 'No soup today', outOfStock: true },
    { name: 'Bowl of Soup', price: 6, description: 'No soup today', outOfStock: true },
  ]);
  assert.deepEqual(extractSoup(payload), { available: false, cup: '', bowl: '', flavor: 'No soup today' });
});

test('extractSoup returns null when there is no soup item at all', () => {
  assert.equal(extractSoup(menu([{ name: 'Omelette', price: 9 }])), null);
});

// --- updateSoupSpecial: writes flavor/cup/bowl/available, preserves the rest ---
const DATA = [
  'window.FT_DATA = {',
  '  /* EXTRAS:START */',
  '  muffinSpecial: { name: "Mini Muffins", flavor: "Blueberry Lemon" },',
  '  soupSpecial: { name: "Soup of the Day", flavor: "Egg Drop 🥬", available: true, cup: "5.00", bowl: "6.00" },',
  '  /* EXTRAS:END */',
  '};',
].join('\n');

test('updateSoupSpecial writes flavor/cup/bowl/available, preserves name and muffin', () => {
  const out = updateSoupSpecial(DATA, { available: true, flavor: 'Tomato Basil', cup: 5, bowl: 7 });
  assert.match(out, /soupSpecial: \{ name: "Soup of the Day", flavor: "Tomato Basil", available: true, cup: "5\.00", bowl: "7\.00" \}/);
  assert.match(out, /muffinSpecial: \{ name: "Mini Muffins", flavor: "Blueberry Lemon" \}/);
});

test('updateSoupSpecial: out of stock writes available:false and drops the prices, keeping the message', () => {
  const out = updateSoupSpecial(DATA, { available: false, flavor: 'No soup on the weekend!', cup: '', bowl: '' });
  assert.match(out, /soupSpecial: \{ name: "Soup of the Day", flavor: "No soup on the weekend!", available: false \}/);
  assert.doesNotMatch(out, /cup:/);
  assert.doesNotMatch(out, /bowl:/);
});

test('updateSoupSpecial preserves the hand-set flavor when none is provided', () => {
  const out = updateSoupSpecial(DATA, { available: true, cup: 5, bowl: 8 });
  assert.match(out, /flavor: "Egg Drop 🥬", available: true, cup: "5\.00", bowl: "8\.00"/);
});

test('updateSoupSpecial money-formats numbers and strips a leading $', () => {
  const out = updateSoupSpecial(DATA, { available: true, cup: '$4', bowl: 6.5 });
  assert.match(out, /cup: "4\.00", bowl: "6\.50"/);
  assert.doesNotMatch(out, /cup: "\$/);
});

test('updateSoupSpecial defaults available to true when neither the update nor the object carry it', () => {
  const legacy = 'x = { soupSpecial: { name: "Soup of the Day", flavor: "Minestrone", cup: "5.00", bowl: "6.00" } };';
  const out = updateSoupSpecial(legacy, { cup: 5, bowl: 6 });
  assert.match(out, /soupSpecial: \{ name: "Soup of the Day", flavor: "Minestrone", available: true, cup: "5\.00", bowl: "6\.00" \}/);
});

test('updateSoupSpecial throws when soupSpecial is absent', () => {
  assert.throws(() => updateSoupSpecial('window.FT_DATA = {};', { cup: 5 }), /soupSpecial/);
});

// --- extractMuffin: one item's price + its description as the flavor (unchanged) ---
test('extractMuffin reads the muffin item price + description flavor', () => {
  assert.deepEqual(
    extractMuffin(menu([{ name: 'Mini Muffin', price: 0.99, description: 'Blueberry Lemon' }])),
    { price: 0.99, flavor: 'Blueberry Lemon' },
  );
});

test('extractMuffin matches loosely on "muffin", case-insensitive', () => {
  assert.deepEqual(
    extractMuffin(menu([{ name: 'MINI-MUFFIN', price: 1.25, description: 'Corn' }])),
    { price: 1.25, flavor: 'Corn' },
  );
});

test('extractMuffin omits flavor when the description is blank (preserve hand-set)', () => {
  assert.deepEqual(extractMuffin(menu([{ name: 'Mini Muffin', price: 0.99, description: '' }])), { price: 0.99 });
});

test('extractMuffin returns null when no muffin item exists', () => {
  assert.equal(extractMuffin(menu([{ name: 'Bagel', price: 2 }])), null);
});

test('extractMuffin works against the committed fixture', async () => {
  const payload = JSON.parse(await readFile(resolve(HERE, '../.github/scripts/fixtures/soup.sample.json'), 'utf8'));
  assert.deepEqual(extractMuffin(payload), { price: 0.99, flavor: 'Blueberry Lemon' });
});

// --- updateMuffinSpecial: writes price/flavor, preserves name + soup ---
test('updateMuffinSpecial writes price + flavor, preserves name and soup', () => {
  const out = updateMuffinSpecial(DATA, { price: 0.99, flavor: 'Pumpkin Spice' });
  assert.match(out, /muffinSpecial: \{ name: "Mini Muffins", flavor: "Pumpkin Spice", price: "0\.99" \}/);
  assert.match(out, /soupSpecial: \{ name: "Soup of the Day", flavor: "Egg Drop 🥬", available: true, cup: "5\.00", bowl: "6\.00" \}/);
});

test('updateMuffinSpecial preserves the hand-set flavor when none is provided', () => {
  const out = updateMuffinSpecial(DATA, { price: 1.5 });
  assert.match(out, /muffinSpecial: \{ name: "Mini Muffins", flavor: "Blueberry Lemon", price: "1\.50" \}/);
});

test('updateMuffinSpecial throws when muffinSpecial is absent', () => {
  assert.throws(() => updateMuffinSpecial('window.FT_DATA = {};', { price: 1 }), /muffinSpecial/);
});
