import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orphanedPhotos } from '../.github/scripts/specials-sync.mjs';

test('keeps the photos the new specials block references', () => {
  const files = ['toast-the-ali-wong.jpg', 'toast-el-puerco-borracho.jpg'];
  const kept = ['assets/specials/toast-the-ali-wong.jpg'];
  assert.deepEqual(orphanedPhotos(files, kept), ['toast-el-puerco-borracho.jpg']);
});

test('never touches files the sync did not create', () => {
  const files = [
    'week-2026-06-29-1.jpg',   // Apps Script form publisher
    'hand-added.jpg',          // someone dropped it in
    'toast-old-special.jpg',   // ours, rotated out
    '.DS_Store',
  ];
  assert.deepEqual(orphanedPhotos(files, []), ['toast-old-special.jpg']);
});

test('prunes nothing when every photo is still current', () => {
  const files = ['toast-a.jpg', 'toast-b.jpg'];
  const kept = ['assets/specials/toast-a.jpg', 'assets/specials/toast-b.jpg'];
  assert.deepEqual(orphanedPhotos(files, kept), []);
});

test('ignores non-jpg and near-miss names', () => {
  const files = ['toast-.jpg', 'toast-x.jpeg', 'toast-x.png', 'toasted-x.jpg', 'toast-x.jpg'];
  assert.deepEqual(orphanedPhotos(files, []), ['toast-x.jpg']);
});
