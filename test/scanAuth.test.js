const { test } = require('node:test');
const assert = require('node:assert/strict');
const { authenticateProduct } = require('../src/scanAuth');
const { createDatabase } = require('../src/database');

function makeDb() {
  return createDatabase({
    'ST-DELL-001': { name: 'Dell Laptop', manufacturer: 'Dell', status: 'AUTHENTIC' },
    'ST-FAKE-001': { name: 'Suspicious Item', manufacturer: 'Unknown', status: 'FLAGGED' }
  });
}

test('registered authentic product is verified', () => {
  const result = authenticateProduct('ST-DELL-001', makeDb());
  assert.equal(result.status, 'VERIFIED');
});

test('unregistered product ID is rejected as possible counterfeit', () => {
  const result = authenticateProduct('ST-UNKNOWN-999', makeDb());
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.product, null);
});

test('registered but flagged product fails verification', () => {
  const result = authenticateProduct('ST-FAKE-001', makeDb());
  assert.equal(result.status, 'REJECTED');
});

test('empty scan input is rejected', () => {
  const result = authenticateProduct('', makeDb());
  assert.equal(result.status, 'REJECTED');
});
