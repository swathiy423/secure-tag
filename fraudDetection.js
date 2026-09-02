/**
 * Algorithm 5 — Return Fraud Detection
 * Compares the product identity presented at purchase against the identity
 * presented at return, and checks the tamper seal, to catch box-swap or
 * "different item returned" fraud.
 *
 * @param {string} originalId
 * @param {string} returnedId
 * @param {string} sealStatus - 'INTACT' | 'BROKEN' | 'MISSING'
 * @returns {{status: 'VERIFIED'|'FRAUD_ALERT', message: string}}
 */
function detectReturnFraud(originalId, returnedId, sealStatus) {
  if (!originalId || !returnedId) {
    return {
      status: 'FRAUD_ALERT',
      message: 'Missing original or returned product ID.'
    };
  }

  if (originalId !== returnedId) {
    return {
      status: 'FRAUD_ALERT',
      message: 'Product identity mismatch — a different item was returned.'
    };
  }

  if (sealStatus !== 'INTACT') {
    return {
      status: 'FRAUD_ALERT',
      message: 'Returned product appears tampered or opened.'
    };
  }

  return {
    status: 'VERIFIED',
    message: 'Return verified — genuine and untampered product.'
  };
}

module.exports = { detectReturnFraud };
