const crypto = require('crypto');

/**
 * Algorithm 3 — Unique Product Identity Generation
 * Generates a unique SecureTag product identifier. Uses crypto.randomBytes
 * instead of Math.random() — Math.random() is not collision-resistant and
 * is predictable, which matters here since the ID doubles as an
 * anti-counterfeit token.
 *
 * @param {string} [prefix='ST'] - Short brand/category prefix, e.g. 'ST-DELL'
 * @returns {string} e.g. "ST-1B4F9C-7K2QAZ91"
 */
function generateProductId(prefix = 'ST') {
  if (typeof prefix !== 'string' || prefix.trim() === '') {
    throw new Error('prefix must be a non-empty string');
  }

  const timestampPart = Date.now().toString(36).toUpperCase();
  const randomPart = crypto.randomBytes(6).toString('hex').toUpperCase();

  return `${prefix}-${timestampPart}-${randomPart}`;
}

module.exports = { generateProductId };
