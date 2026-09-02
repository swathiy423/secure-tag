const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateTagMapping } = require('../src/tagMapping');
const { createDatabase } = require('../src/database');

function makeDb() {
  return createDatabase({
    'PRODUCT-ST001': { name: 'A', qrTag: 'QR-ST001', nfcTag: 'NFC-ST001', status: 'AUTHENTIC', sealStatus: 'INTACT' },
    'PRODUCT-ST002': { name: 'B', qrTag: 'QR-ST002', nfcTag: 'NFC-ST002', status: 'AUTHENTIC', sealStatus: 'INTACT' }
  });
}

test('tags belonging to the same product are valid', () => {
  const result = validateTagMapping('QR-ST001', 'NFC-ST001', makeDb());
  assert.equal(result.status, 'VALID');
  assert.equal(result.productId, 'PRODUCT-ST001');
});

test('tags from two different products are invalid', () => {
  const result = validateTagMapping('QR-ST001', 'NFC-ST002', makeDb());
  assert.equal(result.status, 'INVALID');
});

test('unregistered tag is invalid', () => {
  const result = validateTagMapping('QR-UNKNOWN', 'NFC-ST001', makeDb());
  assert.equal(result.status, 'INVALID');
});

test('missing tag input is invalid', () => {
  const result = validateTagMapping('', 'NFC-ST001', makeDb());
  assert.equal(result.status, 'INVALID');
});
