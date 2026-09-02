const { test } = require('node:test');
const assert = require('node:assert/strict');
const { detectReturnFraud } = require('../src/fraudDetection');

test('same ID and intact seal is a verified return', () => {
  const result = detectReturnFraud('ST-DELL-001', 'ST-DELL-001', 'INTACT');
  assert.equal(result.status, 'VERIFIED');
});

test('mismatched IDs trigger a fraud alert', () => {
  const result = detectReturnFraud('ST-DELL-001', 'ST-SONY-002', 'INTACT');
  assert.equal(result.status, 'FRAUD_ALERT');
});

test('broken seal on a matching ID still triggers a fraud alert', () => {
  const result = detectReturnFraud('ST-DELL-001', 'ST-DELL-001', 'BROKEN');
  assert.equal(result.status, 'FRAUD_ALERT');
});

test('missing IDs trigger a fraud alert rather than crashing', () => {
  const result = detectReturnFraud('', '', 'INTACT');
  assert.equal(result.status, 'FRAUD_ALERT');
});
