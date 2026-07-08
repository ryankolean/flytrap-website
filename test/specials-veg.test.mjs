import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyVeg, containsMeat } from '../.github/scripts/specials-sync.mjs';

test('real specials: no-meat description is vegetarian', () => {
  // The Karen Gillan — lemon poundcake French toast. No meat.
  const { veg, desc } = classifyVeg(
    "It's lemon poundcake French toast! Served up with macerated Michigan strawberries and burnt butter cream cheese.",
  );
  assert.equal(veg, true);
  assert.match(desc, /French toast/);
});

test('real specials: pork/carnitas description is not vegetarian', () => {
  const { veg } = classifyVeg(
    "Pork carnitas swimming in beer soaked pintos served up with eggs how you like 'em, a jack cheese and scallion quesadilla, lime crema and salsa verde.",
  );
  assert.equal(veg, false);
});

test('explicit (v) marker overrides meat words (mock meat) and is stripped', () => {
  const { veg, desc } = classifyVeg('Tempeh bacon BLT with vegan mayo. (v)');
  assert.equal(veg, true);
  assert.doesNotMatch(desc, /\(v\)/);
});

test('common meats are detected', () => {
  for (const d of ['Grilled chicken thigh', 'Seared salmon', 'Shrimp scampi', 'Beef brisket hash', 'El Puerco special']) {
    assert.equal(containsMeat(d), true, `expected meat in: ${d}`);
  }
});

test('word boundaries avoid false positives', () => {
  // "beefsteak tomato" and "hamlet" should not trip beef/steak/ham
  assert.equal(containsMeat('Heirloom beefsteak tomato salad'), false);
  assert.equal(containsMeat('Grilled cheese with hamlet greens'), false);
});

test('plain vegetarian dish is veg', () => {
  assert.equal(classifyVeg('Mixed greens, feta, beets, kalamata olives, tomato vinaigrette.').veg, true);
});

test('empty description defaults to vegetarian', () => {
  assert.equal(classifyVeg('').veg, true);
  assert.equal(classifyVeg(null).veg, true);
});
