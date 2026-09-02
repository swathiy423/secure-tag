/**
 * Algorithm 2 — Dual QR/NFC Authentication
 * Compares the identity encoded in a QR tag against the identity encoded in
 * an NFC tag to make sure both point to the same physical product. A
 * mismatch is a strong counterfeit/tag-swap signal.
 *
 * @param {string} qrId
 * @param {string} nfcId
 * @returns {{status: 'VERIFIED'|'REJECTED', message: string}}
 */
function dualVerification(qrId, nfcId) {
  if (!qrId || !nfcId) {
    return {
      status: 'REJECTED',
      message: 'Missing QR or NFC identity — both scans are required.'
    };
  }

  if (qrId === nfcId) {
    return {
      status: 'VERIFIED',
      message: 'QR and NFC identities match.'
    };
  }

  return {
    status: 'REJECTED',
    message: 'QR and NFC identities do not match.'
  };
}

module.exports = { dualVerification };
