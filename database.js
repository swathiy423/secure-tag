/**
 * In-memory "database" standing in for a real backend (e.g. Postgres/DynamoDB).
 * Centralizing product + tag records here means every algorithm reads from a
 * single source of truth instead of redeclaring its own copy of `products`.
 *
 * In production, replace `createDatabase()` with real DB queries but keep the
 * same method signatures so the algorithm modules don't need to change.
 */

function createDatabase(seedProducts = {}) {
  const products = new Map(Object.entries(seedProducts));

  return {
    /** Look up a product by its SecureTag product ID. */
    getProduct(productId) {
      return products.get(productId) || null;
    },

    /** Register a new product record (used by generateProductId flow). */
    registerProduct(productId, record) {
      if (products.has(productId)) {
        throw new Error(`Product ID already registered: ${productId}`);
      }
      products.set(productId, record);
      return products.get(productId);
    },

    /** Update fields on an existing product (e.g. seal status after a scan). */
    updateProduct(productId, updates) {
      const existing = products.get(productId);
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      products.set(productId, updated);
      return updated;
    },

    /** Resolve which product a QR tag belongs to, or null if unregistered. */
    getProductIdByQrTag(qrTag) {
      for (const [id, record] of products) {
        if (record.qrTag === qrTag) return id;
      }
      return null;
    },

    /** Resolve which product an NFC tag belongs to, or null if unregistered. */
    getProductIdByNfcTag(nfcTag) {
      for (const [id, record] of products) {
        if (record.nfcTag === nfcTag) return id;
      }
      return null;
    },

    /** Snapshot of everything currently registered (mostly useful for tests/demo). */
    all() {
      return Object.fromEntries(products);
    }
  };
}

/** A small seeded dataset used by the CLI demo and shared across tests. */
function seedDemoDatabase() {
  return createDatabase({
    'ST-DELL-001': {
      name: 'Dell XPS 13 Laptop',
      manufacturer: 'Dell',
      status: 'AUTHENTIC',
      qrTag: 'QR-ST001',
      nfcTag: 'NFC-ST001',
      sealStatus: 'INTACT'
    },
    'ST-SONY-002': {
      name: 'Sony WH-1000XM5 Headphones',
      manufacturer: 'Sony',
      status: 'AUTHENTIC',
      qrTag: 'QR-ST002',
      nfcTag: 'NFC-ST002',
      sealStatus: 'BROKEN'
    }
  });
}

module.exports = { createDatabase, seedDemoDatabase };
