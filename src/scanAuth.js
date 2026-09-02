/**
 * Algorithm 4 — Instant QR/NFC Scan Authentication
 * Looks up a scanned product ID against the registry and reports whether
 * it is a known, authentic product.
 *
 * @param {string} scannedId
 * @param {ReturnType<typeof import('./database').createDatabase>} db
 * @returns {{status: 'VERIFIED'|'REJECTED', message: string, product: object|null}}
 */
function authenticateProduct(scannedId, db) {
  if (!scannedId) {
    return { status: 'REJECTED', message: 'No product ID scanned.', product: null };
  }

  const product = db.getProduct(scannedId);

  if (!product) {
    return {
      status: 'REJECTED',
      message: 'Product not found — possible counterfeit.',
      product: null
    };
  }

  if (product.status !== 'AUTHENTIC') {
    return {
      status: 'REJECTED',
      message: `Product verification failed (status: ${product.status}).`,
      product
    };
  }

  return {
    status: 'VERIFIED',
    message: `Authentic product: ${product.name}`,
    product
  };
}

module.exports = { authenticateProduct };
