/**
 * Algorithm 7 — Product–Tag Mapping and Validation
 * Confirms that a scanned QR tag and a scanned NFC tag both resolve to the
 * SAME registered product. If either tag is unregistered, or they resolve
 * to two different products, that's a red flag (e.g. a counterfeit tag
 * stuck onto a genuine product, or vice versa).
 *
 * @param {string} qrTag
 * @param {string} nfcTag
 * @param {ReturnType<typeof import('./database').createDatabase>} db
 * @returns {{status: 'VALID'|'INVALID', message: string, productId: string|null}}
 */
function validateTagMapping(qrTag, nfcTag, db) {
  if (!qrTag || !nfcTag) {
    return { status: 'INVALID', message: 'Both a QR tag and an NFC tag are required.', productId: null };
  }

  const qrProductId = db.getProductIdByQrTag(qrTag);
  const nfcProductId = db.getProductIdByNfcTag(nfcTag);

  if (!qrProductId || !nfcProductId) {
    return { status: 'INVALID', message: 'One or both tags are not registered.', productId: null };
  }

  if (qrProductId === nfcProductId) {
    return {
      status: 'VALID',
      message: 'Tag mapping valid — QR and NFC point to the same product.',
      productId: qrProductId
    };
  }

  return {
    status: 'INVALID',
    message: 'Tag mismatch — QR and NFC point to different products. Possible tag replacement.',
    productId: null
  };
}

module.exports = { validateTagMapping };
