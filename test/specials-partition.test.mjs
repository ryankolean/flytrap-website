import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partitionSpecials } from '../.github/scripts/specials-sync.mjs';

const names = (arr) => arr.map((x) => x.name);

test('keeps a special that has no photo', () => {
  const { kept, skipped } = partitionSpecials([
    { name: 'The Riz Ahmed', price: 15.95 },                        // no image
    { name: 'The Cuban Croque Senora', price: 15.95, image: 'https://toast/x.jpg' },
  ]);
  assert.deepEqual(names(kept), ['The Riz Ahmed', 'The Cuban Croque Senora']);
  assert.deepEqual(skipped, []);
});

test('excludes the soup — it publishes as an extras card', () => {
  const { kept, skipped } = partitionSpecials([
    { name: "Soup O' The Day", price: 5 },
    { name: 'The Ali Wong', price: 14.95 },
  ]);
  assert.deepEqual(names(kept), ['The Ali Wong']);
  assert.equal(skipped.length, 1);
  assert.match(skipped[0].reason, /soup/i);
});

test('excludes legacy Cup of Soup / Bowl of Soup items', () => {
  const { kept, skipped } = partitionSpecials([
    { name: 'Cup of Soup', price: 5 },
    { name: 'Bowl of Soup', price: 6 },
    { name: 'El Puerco Borracho', price: 14.95 },
  ]);
  assert.deepEqual(names(kept), ['El Puerco Borracho']);
  assert.equal(skipped.length, 2);
});

test('excludes the muffin', () => {
  const { kept, skipped } = partitionSpecials([
    { name: 'Mini Muffins', price: 0.99 },
    { name: 'The Lou Costello', price: 13.95 },
  ]);
  assert.deepEqual(names(kept), ['The Lou Costello']);
  assert.match(skipped[0].reason, /muffin/i);
});

test('excludes $0 and price-less POS artifacts', () => {
  const { kept, skipped } = partitionSpecials([
    { name: '***ADD ON***', price: 0 },
    { name: 'NO BEV' },
    { name: 'The Minnie Pearl', price: 16.95 },
  ]);
  assert.deepEqual(names(kept), ['The Minnie Pearl']);
  assert.equal(skipped.length, 2);
  for (const s of skipped) assert.match(s.reason, /price/i);
});

test('every skipped item carries a name and a reason', () => {
  const { skipped } = partitionSpecials([
    { name: "Soup O' The Day", price: 5 },
    { price: 0 },
  ]);
  for (const s of skipped) {
    assert.ok(s.name && s.name.length, 'skipped item has a name');
    assert.ok(s.reason && s.reason.length, 'skipped item has a reason');
  }
});

test('name matching is case-insensitive and substring-based', () => {
  const { kept } = partitionSpecials([{ name: "TODAY'S SOUP O' THE DAY SPECIAL", price: 5 }]);
  assert.deepEqual(kept, []);
});

test('respects overridden soup and muffin names', () => {
  const { kept } = partitionSpecials(
    [{ name: 'Potage du Jour', price: 5 }, { name: 'The Karen Gillan', price: 12.95 }],
    { soupItem: 'Potage', muffinItem: 'Scone' }
  );
  assert.deepEqual(names(kept), ['The Karen Gillan']);
});

test('handles a missing or empty group without throwing', () => {
  assert.deepEqual(partitionSpecials(undefined), { kept: [], skipped: [] });
  assert.deepEqual(partitionSpecials([]), { kept: [], skipped: [] });
});
