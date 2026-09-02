const { validateTagMapping } = require('./tagMapping');
const { generateVerificationResult } = require('./verificationResult');

/**
 * Algorithm 9 — Combined SecureTag Verification
 * The end-to-end flow: look up the product, confirm the scanned QR/NFC tags
 * both map to it, confirm the seal is intact, then produce the final
 * VERIFIED / FRAUD_ALERT result. This is what the scan-time UI calls.
 *
 * @param {string} productId
 * @param {string} scannedQr
 * @param {string} scannedNfc
 * @param {string} sealStatus
 * @param {ReturnType<typeof import('./database').createDatabase>} db
 */
function verifyProduct(productId, scannedQr, scannedNfc, sealStatus, db) {
  const product = db.getProduct(productId);

  if (!product) {
    return {
      result: 'REJECTED',
      alert: 'FRAUD_ALERT',
      message: 'Product not found.',
      reasons: ['Scanned product ID is not registered.']
    };
  }

  const productValid = product.status === 'AUTHENTIC';

  const mapping = validateTagMapping(scannedQr, scannedNfc, db);
  const tagsMatch = mapping.status === 'VALID' && mapping.productId === productId;

  const sealIntact = sealStatus === 'INTACT' && product.sealStatus === 'INTACT';

  const outcome = generateVerificationResult(productValid, tagsMatch, sealIntact);

  return {
    ...outcome,
    product: { id: productId, name: product.name, manufacturer: product.manufacturer }
  };
}

module.exports = { verifyProduct };
