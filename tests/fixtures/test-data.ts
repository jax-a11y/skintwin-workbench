/**
 * Test Fixtures
 * 
 * Deterministic seeded data for consistent E2E testing.
 * Includes smoke (minimal) and exhaustive (comprehensive) datasets.
 */

// ═══════════════════════════════════════════════════════════════════
// SHOPIFY FIXTURES
// ═══════════════════════════════════════════════════════════════════

export const shopifyFixtures = {
  validInstallation: {
    shopDomain: 'beauty-lab.myshopify.com',
    accessToken: 'shpat_fixture_token_12345',
    scopes: ['read_products', 'write_orders', 'read_inventory', 'read_customers'],
  },

  invalidInstallations: {
    missingDomain: {
      accessToken: 'shpat_token',
      scopes: ['read_products'],
    },
    missingToken: {
      shopDomain: 'test.myshopify.com',
      scopes: ['read_products'],
    },
    missingScopes: {
      shopDomain: 'test.myshopify.com',
      accessToken: 'shpat_token',
    },
    invalidDomain: {
      shopDomain: 'invalid-domain.com',
      accessToken: 'shpat_token',
      scopes: ['read_products'],
    },
  },

  orders: {
    simple: {
      orderId: 'ORDER-FIXTURE-SIMPLE',
      shopDomain: 'beauty-lab.myshopify.com',
      lineItems: [
        { sku: 'SERUM-001', quantity: 1 },
      ],
    },
    multiLine: {
      orderId: 'ORDER-FIXTURE-MULTI',
      shopDomain: 'beauty-lab.myshopify.com',
      lineItems: [
        { sku: 'SERUM-001', quantity: 2 },
        { sku: 'CREAM-002', quantity: 1 },
        { sku: 'TONER-003', quantity: 3 },
      ],
    },
    highVolume: {
      orderId: 'ORDER-FIXTURE-HIGHVOL',
      shopDomain: 'beauty-lab.myshopify.com',
      lineItems: [
        { sku: 'SERUM-001', quantity: 100 },
        { sku: 'CREAM-002', quantity: 50 },
      ],
    },
  },

  invalidOrders: {
    missingOrderId: {
      shopDomain: 'test.myshopify.com',
      lineItems: [{ sku: 'SKU-001', quantity: 1 }],
    },
    emptyLineItems: {
      orderId: 'ORDER-EMPTY',
      shopDomain: 'test.myshopify.com',
      lineItems: [],
    },
    zeroQuantity: {
      orderId: 'ORDER-ZERO-QTY',
      shopDomain: 'test.myshopify.com',
      lineItems: [{ sku: 'SKU-001', quantity: 0 }],
    },
    negativeQuantity: {
      orderId: 'ORDER-NEG-QTY',
      shopDomain: 'test.myshopify.com',
      lineItems: [{ sku: 'SKU-001', quantity: -5 }],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// MRP FIXTURES
// ═══════════════════════════════════════════════════════════════════

export const mrpFixtures = {
  validPlans: {
    shortHorizon: {
      planningHorizonDays: 7,
      demand: [
        { sku: 'SERUM-001', requiredUnits: 100 },
      ],
    },
    mediumHorizon: {
      planningHorizonDays: 14,
      demand: [
        { sku: 'SERUM-001', requiredUnits: 200 },
        { sku: 'CREAM-002', requiredUnits: 150 },
      ],
    },
    longHorizon: {
      planningHorizonDays: 30,
      demand: [
        { sku: 'SERUM-001', requiredUnits: 500 },
        { sku: 'CREAM-002', requiredUnits: 300 },
        { sku: 'TONER-003', requiredUnits: 400 },
        { sku: 'MOISTURIZER-004', requiredUnits: 250 },
      ],
    },
  },

  invalidPlans: {
    missingHorizon: {
      demand: [{ sku: 'SKU-001', requiredUnits: 100 }],
    },
    zeroHorizon: {
      planningHorizonDays: 0,
      demand: [{ sku: 'SKU-001', requiredUnits: 100 }],
    },
    negativeHorizon: {
      planningHorizonDays: -7,
      demand: [{ sku: 'SKU-001', requiredUnits: 100 }],
    },
    emptyDemand: {
      planningHorizonDays: 14,
      demand: [],
    },
    zeroUnits: {
      planningHorizonDays: 14,
      demand: [{ sku: 'SKU-001', requiredUnits: 0 }],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// SCM FIXTURES
// ═══════════════════════════════════════════════════════════════════

export const scmFixtures = {
  suppliers: {
    viaglamour: 'SUPPLIER-VIAGLAMOUR-001',
    backup: 'SUPPLIER-BACKUP-002',
    local: 'SUPPLIER-LOCAL-003',
  },

  validPurchaseOrders: {
    single: {
      supplierId: 'SUPPLIER-VIAGLAMOUR-001',
      lines: [
        { componentSku: 'COMP-HYALURONIC-ACID', quantity: 500 },
      ],
    },
    multi: {
      supplierId: 'SUPPLIER-VIAGLAMOUR-001',
      lines: [
        { componentSku: 'COMP-HYALURONIC-ACID', quantity: 500 },
        { componentSku: 'COMP-VITAMIN-C', quantity: 300 },
        { componentSku: 'COMP-RETINOL', quantity: 200 },
      ],
    },
  },

  invalidPurchaseOrders: {
    missingSupplierId: {
      lines: [{ componentSku: 'COMP-001', quantity: 100 }],
    },
    emptyLines: {
      supplierId: 'SUPPLIER-001',
      lines: [],
    },
    zeroQuantity: {
      supplierId: 'SUPPLIER-001',
      lines: [{ componentSku: 'COMP-001', quantity: 0 }],
    },
  },

  fulfillmentEvents: {
    packed: {
      orderId: 'ORDER-FULFILL-001',
      status: 'packed',
      carrier: 'FedEx',
    },
    shipped: {
      orderId: 'ORDER-FULFILL-001',
      status: 'shipped',
      carrier: 'FedEx',
      trackingNumber: 'FDX123456789',
    },
    delivered: {
      orderId: 'ORDER-FULFILL-001',
      status: 'delivered',
      carrier: 'FedEx',
    },
  },

  carriers: ['FedEx', 'UPS', 'DHL', 'USPS'],
};

// ═══════════════════════════════════════════════════════════════════
// BULK TEST DATA GENERATORS
// ═══════════════════════════════════════════════════════════════════

/**
 * Generate N valid orders for load testing
 */
export function generateOrders(count: number, shopDomain = 'bulk-test.myshopify.com') {
  return Array.from({ length: count }, (_, i) => ({
    orderId: `ORDER-BULK-${String(i + 1).padStart(5, '0')}`,
    shopDomain,
    lineItems: [
      { sku: `SKU-${(i % 10) + 1}`, quantity: (i % 5) + 1 },
    ],
  }));
}

/**
 * Generate N demand items for MRP testing
 */
export function generateDemand(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    sku: `SKU-DEMAND-${String(i + 1).padStart(3, '0')}`,
    requiredUnits: Math.floor(Math.random() * 100) + 10,
  }));
}

/**
 * Generate N purchase order lines
 */
export function generatePurchaseOrderLines(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    componentSku: `COMP-BULK-${String(i + 1).padStart(3, '0')}`,
    quantity: Math.floor(Math.random() * 500) + 50,
  }));
}
