const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateProductId } = require('../src/productId');

test('generated ID starts with the given prefix', () => {
  const id = generateProductId('ST-DELL');
  assert.match(id, /^ST-DELL-/);
});

test('defaults to ST prefix when none given', () => {
  const id = generateProductId();
  assert.match(id, /^ST-/);
});

test('generated IDs are unique across many calls', () => {
  const ids = new Set();
  for (let i = 0; i < 1000; i++) {
    ids.add(generateProductId());
  }
  assert.equal(ids.size, 1000);
});

test('throws on empty prefix', () => {
  assert.throws(() => generateProductId(''), /non-empty string/);
});

test('throws on non-string prefix', () => {
  assert.throws(() => generateProductId(42), /non-empty string/);
});
