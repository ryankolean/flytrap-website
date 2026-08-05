import { test } from 'node:test';
import assert from 'node:assert/strict';
import { specialsAwaitingPhoto } from '../.github/scripts/toast-sync.mjs';

const wrap = (inner) => `
window.FT_DATA = {
  /* SPECIALS:START */
  weekOf: "Week of July 6",
  specials: [
${inner}
  ],
  /* SPECIALS:END */
  dishes: [ { src: "assets/dishes/x.jpg", label: "X" } ],
};`;

test('true when a special has an empty photo', () => {
  assert.equal(specialsAwaitingPhoto(wrap(
    '    { id: "special-1", name: "La Figata", photo: "", price: "15.95" },'
  )), true);
});

test('false when every special has a photo', () => {
  assert.equal(specialsAwaitingPhoto(wrap(
    '    { id: "special-1", name: "The Cuban", photo: "assets/specials/toast-the-cuban.jpg", price: "15.95" },'
  )), false);
});

test('true when only one of several is missing its photo', () => {
  assert.equal(specialsAwaitingPhoto(wrap(
    '    { id: "special-1", name: "A", photo: "assets/specials/toast-a.jpg" },\n' +
    '    { id: "special-2", name: "B", photo: "" },'
  )), true);
});

test('ignores empty photo values outside the SPECIALS block', () => {
  const src = `
window.FT_DATA = {
  /* SPECIALS:START */
  specials: [ { id: "special-1", name: "A", photo: "assets/specials/toast-a.jpg" } ],
  /* SPECIALS:END */
  retail: [ { name: "Gift Cards", photo: "" } ],
};`;
  assert.equal(specialsAwaitingPhoto(src), false);
});

test('false when there are no specials at all', () => {
  assert.equal(specialsAwaitingPhoto(wrap('')), false);
});

test('false when the markers are missing or the input is empty', () => {
  assert.equal(specialsAwaitingPhoto('specials: [ { photo: "" } ]'), false);
  assert.equal(specialsAwaitingPhoto(''), false);
  assert.equal(specialsAwaitingPhoto(undefined), false);
});

test('tolerates whitespace variations around the value', () => {
  assert.equal(specialsAwaitingPhoto(wrap('    { name: "A", photo:   "" },')), true);
});
