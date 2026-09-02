const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateVerificationResult } = require('../src/verificationResult');

test('all conditions true yields VERIFIED with no reasons', () => {
  const result = generateVerificationResult(true, true, true);
  assert.equal(result.result, 'VERIFIED');
  assert.equal(result.alert, 'NONE');
  assert.deepEqual(result.reasons, []);
});

test('any single failing condition yields FRAUD_ALERT', () => {
  const result = generateVerificationResult(false, true, true);
  assert.equal(result.result, 'REJECTED');
  assert.equal(result.alert, 'FRAUD_ALERT');
  assert.equal(result.reasons.length, 1);
});

test('multiple failing conditions are all listed as reasons', () => {
  const result = generateVerificationResult(false, false, false);
  assert.equal(result.reasons.length, 3);
});
