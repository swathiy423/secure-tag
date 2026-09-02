const { test } = require('node:test');
const assert = require('node:assert/strict');
const { verifyProduct } = require('../src/combinedVerification');
const { seedDemoDatabase } = require('../src/database');

test('genuine, matching, sealed product is VERIFIED end-to-end', () => {
  const db = seedDemoDatabase();
  const result = verifyProduct('ST-DELL-001', 'QR-ST001', 'NFC-ST001', 'INTACT', db);
  assert.equal(result.result, 'VERIFIED');
  assert.equal(result.alert, 'NONE');
});

test('product with a broken seal is REJECTED with a FRAUD_ALERT', () => {
  const db = seedDemoDatabase();
  const result = verifyProduct('ST-SONY-002', 'QR-ST002', 'NFC-ST002', 'INTACT', db);
  assert.equal(result.result, 'REJECTED');
  assert.equal(result.alert, 'FRAUD_ALERT');
  assert.ok(result.reasons.some((r) => r.toLowerCase().includes('seal')));
});

test('unregistered product ID is REJECTED', () => {
  const db = seedDemoDatabase();
  const result = verifyProduct('ST-GHOST-999', 'QR-ST001', 'NFC-ST001', 'INTACT', db);
  assert.equal(result.result, 'REJECTED');
});

test('mismatched QR/NFC tags on a real product trigger FRAUD_ALERT', () => {
  const db = seedDemoDatabase();
  // NFC tag belongs to the Sony product, not the Dell one being scanned
  const result = verifyProduct('ST-DELL-001', 'QR-ST001', 'NFC-ST002', 'INTACT', db);
  assert.equal(result.result, 'REJECTED');
  assert.equal(result.alert, 'FRAUD_ALERT');
});
