/**
 * Algorithm 8 — Fraud Alert and Verification Result
 * Combines the three underlying checks (product validity, tag match, seal
 * intact) into one final verdict used to drive the UI/alerting.
 *
 * @param {boolean} productValid
 * @param {boolean} tagsMatch
 * @param {boolean} sealIntact
 * @returns {{result: 'VERIFIED'|'REJECTED', alert: 'NONE'|'FRAUD_ALERT', message: string, reasons: string[]}}
 */
function generateVerificationResult(productValid, tagsMatch, sealIntact) {
  const reasons = [];
  if (!productValid) reasons.push('Product is not registered as authentic.');
  if (!tagsMatch) reasons.push('QR and NFC tags do not match the same product.');
  if (!sealIntact) reasons.push('Tamper-evident seal is not intact.');

  if (reasons.length === 0) {
    return {
      result: 'VERIFIED',
      alert: 'NONE',
      message: 'Genuine and untampered product.',
      reasons: []
    };
  }

  return {
    result: 'REJECTED',
    alert: 'FRAUD_ALERT',
    message: 'Product requires further inspection.',
    reasons
  };
}

module.exports = { generateVerificationResult };
