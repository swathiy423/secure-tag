const { test } = require('node:test');
const assert = require('node:assert/strict');
const { dualVerification } = require('../src/dualAuth');

test('matching QR and NFC identities are verified', () => {
  const result = dualVerification('ST-DELL-001', 'ST-DELL-001');
  assert.equal(result.status, 'VERIFIED');
});

test('mismatched identities are rejected', () => {
  const result = dualVerification('ST-DELL-001', 'ST-SONY-002');
  assert.equal(result.status, 'REJECTED');
});

test('missing QR id is rejected', () => {
  const result = dualVerification('', 'ST-DELL-001');
  assert.equal(result.status, 'REJECTED');
});

test('missing NFC id is rejected', () => {
  const result = dualVerification('ST-DELL-001', undefined);
  assert.equal(result.status, 'REJECTED');
});
