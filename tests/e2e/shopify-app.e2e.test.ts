/**
 * Shopify App E2E Tests
 * 
 * Exhaustive end-to-end tests for the SkinTwin Shopify App API.
 * Covers critical paths, negative scenarios, and edge cases.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TEST_CONFIG } from './setup';
import { resetMockData, seedSmokeData, seedExhaustiveData } from './mocks/data';

const BASE_URL = TEST_CONFIG.baseUrl;

// Helper function to make API requests
async function apiRequest(
  method: string,
  endpoint: string,
  body?: unknown
): Promise<Response> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response;
}

// ═══════════════════════════════════════════════════════════════════
// SHOPIFY APP INSTALLATION TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Shopify App Installation', () => {
  beforeEach(() => {
    resetMockData();
  });

  describe('smoke: critical path', () => {
    it('smoke: should successfully install Shopify app with valid credentials', async () => {
      const response = await apiRequest('POST', '/shopify/app/install', {
        shopDomain: 'test-store.myshopify.com',
        accessToken: 'shpat_test_token_12345',
        scopes: ['read_products', 'write_orders', 'read_inventory'],
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.installationId).toBeDefined();
      expect(data.status).toBe('active');
    });
  });

  describe('negative: validation errors', () => {
    it('negative: should reject installation without shopDomain', async () => {
      const response = await apiRequest('POST', '/shopify/app/install', {
        accessToken: 'shpat_test_token_12345',
        scopes: ['read_products'],
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Missing required fields');
    });

    it('negative: should reject installation without accessToken', async () => {
      const response = await apiRequest('POST', '/shopify/app/install', {
        shopDomain: 'test-store.myshopify.com',
        scopes: ['read_products'],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject installation without scopes', async () => {
      const response = await apiRequest('POST', '/shopify/app/install', {
        shopDomain: 'test-store.myshopify.com',
        accessToken: 'shpat_test_token_12345',
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject invalid shop domain format', async () => {
      const response = await apiRequest('POST', '/shopify/app/install', {
        shopDomain: 'invalid-domain.com',
        accessToken: 'shpat_test_token_12345',
        scopes: ['read_products'],
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid shop domain');
    });
  });

  describe('contract: schema conformance', () => {
    it('contract: response should match ShopifyInstallResponse schema', async () => {
      const response = await apiRequest('POST', '/shopify/app/install', {
        shopDomain: 'schema-test.myshopify.com',
        accessToken: 'shpat_test_token_schema',
        scopes: ['read_products'],
      });

      expect(response.status).toBe(201);
      const data = await response.json();

      // Validate response schema
      expect(typeof data.installationId).toBe('string');
      expect(data.installationId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(data.status).toBe('active');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// WEBHOOK ORDER INGESTION TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Shopify Webhook: Orders Created', () => {
  beforeEach(() => {
    resetMockData();
    seedSmokeData();
  });

  describe('smoke: critical path', () => {
    it('smoke: should accept valid order webhook', async () => {
      const response = await apiRequest('POST', '/shopify/webhooks/orders-created', {
        orderId: 'ORDER-12345',
        shopDomain: 'beauty-lab.myshopify.com',
        lineItems: [
          { sku: 'SERUM-001', quantity: 2 },
          { sku: 'CREAM-002', quantity: 1 },
        ],
      });

      expect(response.status).toBe(202);
    });
  });

  describe('negative: validation errors', () => {
    it('negative: should reject webhook without orderId', async () => {
      const response = await apiRequest('POST', '/shopify/webhooks/orders-created', {
        shopDomain: 'beauty-lab.myshopify.com',
        lineItems: [{ sku: 'SERUM-001', quantity: 1 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject webhook without shopDomain', async () => {
      const response = await apiRequest('POST', '/shopify/webhooks/orders-created', {
        orderId: 'ORDER-12345',
        lineItems: [{ sku: 'SERUM-001', quantity: 1 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject webhook with empty lineItems', async () => {
      const response = await apiRequest('POST', '/shopify/webhooks/orders-created', {
        orderId: 'ORDER-12345',
        shopDomain: 'beauty-lab.myshopify.com',
        lineItems: [],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject line item without sku', async () => {
      const response = await apiRequest('POST', '/shopify/webhooks/orders-created', {
        orderId: 'ORDER-12345',
        shopDomain: 'beauty-lab.myshopify.com',
        lineItems: [{ quantity: 1 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject line item with zero quantity', async () => {
      const response = await apiRequest('POST', '/shopify/webhooks/orders-created', {
        orderId: 'ORDER-12345',
        shopDomain: 'beauty-lab.myshopify.com',
        lineItems: [{ sku: 'SERUM-001', quantity: 0 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject line item with negative quantity', async () => {
      const response = await apiRequest('POST', '/shopify/webhooks/orders-created', {
        orderId: 'ORDER-12345',
        shopDomain: 'beauty-lab.myshopify.com',
        lineItems: [{ sku: 'SERUM-001', quantity: -1 }],
      });

      expect(response.status).toBe(400);
    });
  });

  describe('edge: idempotency', () => {
    it('idempotent: should accept duplicate webhook gracefully', async () => {
      const payload = {
        orderId: 'ORDER-IDEMPOTENT-001',
        shopDomain: 'beauty-lab.myshopify.com',
        lineItems: [{ sku: 'SERUM-001', quantity: 1 }],
      };

      // First submission
      const response1 = await apiRequest('POST', '/shopify/webhooks/orders-created', payload);
      expect(response1.status).toBe(202);

      // Duplicate submission
      const response2 = await apiRequest('POST', '/shopify/webhooks/orders-created', payload);
      expect(response2.status).toBe(202);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// MRP PLANNING TESTS
// ═══════════════════════════════════════════════════════════════════

describe('MRP Plan Generation', () => {
  beforeEach(() => {
    resetMockData();
    seedSmokeData();
  });

  describe('smoke: critical path', () => {
    it('smoke: should generate MRP plan from demand signals', async () => {
      const response = await apiRequest('POST', '/mrp/plans', {
        planningHorizonDays: 14,
        demand: [
          { sku: 'SERUM-001', requiredUnits: 100 },
          { sku: 'CREAM-002', requiredUnits: 50 },
        ],
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.planId).toBeDefined();
      expect(data.materialRequirements).toBeInstanceOf(Array);
      expect(data.materialRequirements.length).toBeGreaterThan(0);
    });
  });

  describe('negative: validation errors', () => {
    it('negative: should reject plan without planningHorizonDays', async () => {
      const response = await apiRequest('POST', '/mrp/plans', {
        demand: [{ sku: 'SERUM-001', requiredUnits: 100 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject plan without demand', async () => {
      const response = await apiRequest('POST', '/mrp/plans', {
        planningHorizonDays: 14,
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject zero planning horizon', async () => {
      const response = await apiRequest('POST', '/mrp/plans', {
        planningHorizonDays: 0,
        demand: [{ sku: 'SERUM-001', requiredUnits: 100 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject negative planning horizon', async () => {
      const response = await apiRequest('POST', '/mrp/plans', {
        planningHorizonDays: -7,
        demand: [{ sku: 'SERUM-001', requiredUnits: 100 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject demand with zero requiredUnits', async () => {
      const response = await apiRequest('POST', '/mrp/plans', {
        planningHorizonDays: 14,
        demand: [{ sku: 'SERUM-001', requiredUnits: 0 }],
      });

      expect(response.status).toBe(400);
    });
  });

  describe('contract: schema conformance', () => {
    it('contract: response should match MrpPlanResponse schema', async () => {
      const response = await apiRequest('POST', '/mrp/plans', {
        planningHorizonDays: 30,
        demand: [{ sku: 'SERUM-001', requiredUnits: 100 }],
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      // Validate planId format
      expect(typeof data.planId).toBe('string');
      expect(data.planId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );

      // Validate materialRequirements structure
      expect(data.materialRequirements).toBeInstanceOf(Array);
      for (const req of data.materialRequirements) {
        expect(typeof req.componentSku).toBe('string');
        expect(typeof req.requiredQuantity).toBe('number');
        expect(req.requiredQuantity).toBeGreaterThanOrEqual(1);
        expect(typeof req.requiredByDate).toBe('string');
        expect(req.requiredByDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// SCM PURCHASE ORDER TESTS
// ═══════════════════════════════════════════════════════════════════

describe('SCM Purchase Orders', () => {
  beforeEach(() => {
    resetMockData();
    seedSmokeData();
  });

  describe('smoke: critical path', () => {
    it('smoke: should create purchase order from MRP outputs', async () => {
      const response = await apiRequest('POST', '/scm/purchase-orders', {
        supplierId: 'SUPPLIER-VIAGLAMOUR-001',
        lines: [
          { componentSku: 'COMP-HYALURONIC-ACID', quantity: 500 },
          { componentSku: 'COMP-VITAMIN-C', quantity: 300 },
        ],
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.purchaseOrderId).toBeDefined();
      expect(data.supplierId).toBe('SUPPLIER-VIAGLAMOUR-001');
      expect(data.status).toBe('draft');
    });
  });

  describe('negative: validation errors', () => {
    it('negative: should reject order without supplierId', async () => {
      const response = await apiRequest('POST', '/scm/purchase-orders', {
        lines: [{ componentSku: 'COMP-001', quantity: 100 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject order without lines', async () => {
      const response = await apiRequest('POST', '/scm/purchase-orders', {
        supplierId: 'SUPPLIER-001',
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject order with empty lines array', async () => {
      const response = await apiRequest('POST', '/scm/purchase-orders', {
        supplierId: 'SUPPLIER-001',
        lines: [],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject line without componentSku', async () => {
      const response = await apiRequest('POST', '/scm/purchase-orders', {
        supplierId: 'SUPPLIER-001',
        lines: [{ quantity: 100 }],
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject line with zero quantity', async () => {
      const response = await apiRequest('POST', '/scm/purchase-orders', {
        supplierId: 'SUPPLIER-001',
        lines: [{ componentSku: 'COMP-001', quantity: 0 }],
      });

      expect(response.status).toBe(400);
    });
  });

  describe('contract: schema conformance', () => {
    it('contract: response should match PurchaseOrder schema', async () => {
      const response = await apiRequest('POST', '/scm/purchase-orders', {
        supplierId: 'SUPPLIER-SCHEMA-TEST',
        lines: [{ componentSku: 'COMP-001', quantity: 50 }],
      });

      expect(response.status).toBe(201);
      const data = await response.json();

      expect(typeof data.purchaseOrderId).toBe('string');
      expect(data.purchaseOrderId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(typeof data.supplierId).toBe('string');
      expect(['draft', 'issued', 'partially_received', 'received']).toContain(data.status);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// SCM FULFILLMENT EVENTS TESTS
// ═══════════════════════════════════════════════════════════════════

describe('SCM Fulfillment Events', () => {
  beforeEach(() => {
    resetMockData();
    seedSmokeData();
  });

  describe('smoke: critical path', () => {
    it('smoke: should accept fulfillment event for packed status', async () => {
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-FULFILL-001',
        status: 'packed',
        carrier: 'FedEx',
      });

      expect(response.status).toBe(202);
    });
  });

  describe('state: lifecycle transitions', () => {
    it('state: should allow transition from packed to shipped', async () => {
      // First: packed
      await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-LIFECYCLE-001',
        status: 'packed',
        carrier: 'FedEx',
      });

      // Then: shipped
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-LIFECYCLE-001',
        status: 'shipped',
        carrier: 'FedEx',
        trackingNumber: 'FDX123456789',
      });

      expect(response.status).toBe(202);
    });

    it('state: should allow transition from shipped to delivered', async () => {
      // Setup: packed -> shipped
      await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-LIFECYCLE-002',
        status: 'packed',
        carrier: 'UPS',
      });
      await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-LIFECYCLE-002',
        status: 'shipped',
        carrier: 'UPS',
        trackingNumber: 'UPS987654321',
      });

      // Then: delivered
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-LIFECYCLE-002',
        status: 'delivered',
        carrier: 'UPS',
      });

      expect(response.status).toBe(202);
    });

    it('state: should reject invalid transition from none to shipped', async () => {
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-INVALID-TRANSITION-001',
        status: 'shipped',
        carrier: 'FedEx',
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid state transition');
    });

    it('state: should reject invalid transition from packed to delivered', async () => {
      // First: packed
      await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-INVALID-TRANSITION-002',
        status: 'packed',
        carrier: 'FedEx',
      });

      // Invalid: packed -> delivered (skipping shipped)
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-INVALID-TRANSITION-002',
        status: 'delivered',
        carrier: 'FedEx',
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid state transition');
    });

    it('state: should reject transition after delivered (terminal state)', async () => {
      // Setup: full lifecycle
      const orderId = 'ORDER-TERMINAL-001';
      await apiRequest('POST', '/scm/fulfillment-events', {
        orderId,
        status: 'packed',
        carrier: 'DHL',
      });
      await apiRequest('POST', '/scm/fulfillment-events', {
        orderId,
        status: 'shipped',
        carrier: 'DHL',
      });
      await apiRequest('POST', '/scm/fulfillment-events', {
        orderId,
        status: 'delivered',
        carrier: 'DHL',
      });

      // Invalid: any transition after delivered
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId,
        status: 'shipped', // or any status
        carrier: 'DHL',
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid state transition');
    });
  });

  describe('negative: validation errors', () => {
    it('negative: should reject event without orderId', async () => {
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        status: 'packed',
        carrier: 'FedEx',
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject event without status', async () => {
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-001',
        carrier: 'FedEx',
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject event without carrier', async () => {
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-001',
        status: 'packed',
      });

      expect(response.status).toBe(400);
    });

    it('negative: should reject invalid status enum value', async () => {
      const response = await apiRequest('POST', '/scm/fulfillment-events', {
        orderId: 'ORDER-001',
        status: 'pending', // Not a valid status
        carrier: 'FedEx',
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid status');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// EXHAUSTIVE FULL FLOW TESTS
// ═══════════════════════════════════════════════════════════════════

describe('exhaustive: End-to-End Business Flow', () => {
  beforeEach(() => {
    resetMockData();
  });

  it('exhaustive: complete flow from app install to fulfillment delivery', async () => {
    // Step 1: Install Shopify app
    const installResponse = await apiRequest('POST', '/shopify/app/install', {
      shopDomain: 'complete-flow-test.myshopify.com',
      accessToken: 'shpat_complete_flow_token',
      scopes: ['read_products', 'write_orders', 'read_inventory'],
    });
    expect(installResponse.status).toBe(201);
    const installData = await installResponse.json();
    expect(installData.installationId).toBeDefined();

    // Step 2: Receive order webhook
    const orderId = `ORDER-COMPLETE-FLOW-${Date.now()}`;
    const orderResponse = await apiRequest('POST', '/shopify/webhooks/orders-created', {
      orderId,
      shopDomain: 'complete-flow-test.myshopify.com',
      lineItems: [
        { sku: 'SERUM-COMPLETE-001', quantity: 5 },
        { sku: 'CREAM-COMPLETE-002', quantity: 3 },
      ],
    });
    expect(orderResponse.status).toBe(202);

    // Step 3: Generate MRP plan
    const mrpResponse = await apiRequest('POST', '/mrp/plans', {
      planningHorizonDays: 7,
      demand: [
        { sku: 'SERUM-COMPLETE-001', requiredUnits: 5 },
        { sku: 'CREAM-COMPLETE-002', requiredUnits: 3 },
      ],
    });
    expect(mrpResponse.status).toBe(200);
    const mrpData = await mrpResponse.json();
    expect(mrpData.planId).toBeDefined();
    expect(mrpData.materialRequirements.length).toBe(2);

    // Step 4: Create purchase order
    const poResponse = await apiRequest('POST', '/scm/purchase-orders', {
      supplierId: 'SUPPLIER-VIAGLAMOUR',
      lines: mrpData.materialRequirements.map((req: { componentSku: string; requiredQuantity: number }) => ({
        componentSku: req.componentSku,
        quantity: req.requiredQuantity,
      })),
    });
    expect(poResponse.status).toBe(201);
    const poData = await poResponse.json();
    expect(poData.purchaseOrderId).toBeDefined();

    // Step 5: Fulfill order - packed
    const packedResponse = await apiRequest('POST', '/scm/fulfillment-events', {
      orderId,
      status: 'packed',
      carrier: 'FedEx',
    });
    expect(packedResponse.status).toBe(202);

    // Step 6: Fulfill order - shipped
    const shippedResponse = await apiRequest('POST', '/scm/fulfillment-events', {
      orderId,
      status: 'shipped',
      carrier: 'FedEx',
      trackingNumber: 'FDX-COMPLETE-FLOW-001',
    });
    expect(shippedResponse.status).toBe(202);

    // Step 7: Fulfill order - delivered
    const deliveredResponse = await apiRequest('POST', '/scm/fulfillment-events', {
      orderId,
      status: 'delivered',
      carrier: 'FedEx',
    });
    expect(deliveredResponse.status).toBe(202);
  });

  it('exhaustive: handles multiple concurrent orders', async () => {
    // Install app
    await apiRequest('POST', '/shopify/app/install', {
      shopDomain: 'concurrent-test.myshopify.com',
      accessToken: 'shpat_concurrent_token',
      scopes: ['read_products', 'write_orders'],
    });

    // Submit multiple orders concurrently
    const orderPromises = Array.from({ length: 5 }, (_, i) =>
      apiRequest('POST', '/shopify/webhooks/orders-created', {
        orderId: `ORDER-CONCURRENT-${i + 1}`,
        shopDomain: 'concurrent-test.myshopify.com',
        lineItems: [{ sku: `SKU-${i + 1}`, quantity: i + 1 }],
      })
    );

    const orderResponses = await Promise.all(orderPromises);
    expect(orderResponses.every((r) => r.status === 202)).toBe(true);
  });
});
