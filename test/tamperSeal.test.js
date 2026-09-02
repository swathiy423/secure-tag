const { test } = require('node:test');
const assert = require('node:assert/strict');
const { verifyTamperSeal } = require('../src/tamperSeal');

test('INTACT seal is verified', () => {
  const result = verifyTamperSeal('INTACT');
  assert.equal(result.status, 'VERIFIED');
  assert.equal(result.code, 'SEAL_INTACT');
});

test('BROKEN seal is rejected', () => {
  const result = verifyTamperSeal('BROKEN');
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.code, 'SEAL_BROKEN');
});

test('MISSING seal is rejected as high-risk', () => {
  const result = verifyTamperSeal('MISSING');
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.code, 'SEAL_MISSING');
});

test('lowercase input is normalized', () => {
  const result = verifyTamperSeal('intact');
  assert.equal(result.status, 'VERIFIED');
});

test('invalid/garbage input is rejected, not crashed on', () => {
  const result = verifyTamperSeal('BANANA');
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.code, 'INVALID_INPUT');
});

test('non-string input is handled gracefully', () => {
  const result = verifyTamperSeal(undefined);
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.code, 'INVALID_INPUT');
});
