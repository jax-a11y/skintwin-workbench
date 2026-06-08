/**
 * Mock Data Store
 * 
 * In-memory data stores for MSW handlers.
 * Provides deterministic seeded data and runtime state management.
 */

export interface ShopInstallation {
  installationId: string;
  shopDomain: string;
  scopes: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Order {
  orderId: string;
  shopDomain: string;
  lineItems: Array<{ sku: string; quantity: number }>;
  status: 'received' | 'processing' | 'fulfilled';
  createdAt: string;
}

export interface MrpPlan {
  planId: string;
  planningHorizonDays: number;
  demand: Array<{ sku: string; requiredUnits: number }>;
  materialRequirements: Array<{
    componentSku: string;
    requiredQuantity: number;
    requiredByDate: string;
  }>;
  status: 'generated' | 'approved' | 'executed';
  createdAt: string;
}

export interface PurchaseOrder {
  purchaseOrderId: string;
  supplierId: string;
  lines: Array<{ componentSku: string; quantity: number }>;
  status: 'draft' | 'issued' | 'partially_received' | 'received';
  createdAt: string;
}

export interface FulfillmentEvent {
  orderId: string;
  status: 'packed' | 'shipped' | 'delivered';
  carrier: string;
  trackingNumber?: string;
  timestamp: string;
}

// Runtime data stores (reset between tests)
export const mockShopInstallations = new Map<string, ShopInstallation>();
export const mockOrders = new Map<string, Order>();
export const mockMrpPlans = new Map<string, MrpPlan>();
export const mockPurchaseOrders = new Map<string, PurchaseOrder>();
export const mockFulfillmentEvents = new Map<string, FulfillmentEvent[]>();

/**
 * Reset all mock data stores
 */
export function resetMockData(): void {
  mockShopInstallations.clear();
  mockOrders.clear();
  mockMrpPlans.clear();
  mockPurchaseOrders.clear();
  mockFulfillmentEvents.clear();
}

/**
 * Seed mock data for smoke tests
 */
export function seedSmokeData(): void {
  // Pre-seed a shop installation
  const installationId = 'seed-installation-001';
  mockShopInstallations.set(installationId, {
    installationId,
    shopDomain: 'beauty-lab.myshopify.com',
    scopes: ['read_products', 'write_orders', 'read_inventory'],
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  });
}

/**
 * Seed mock data for exhaustive tests
 */
export function seedExhaustiveData(): void {
  seedSmokeData();

  // Add more varied test data
  const shopDomains = [
    'skincare-plus.myshopify.com',
    'glow-cosmetics.myshopify.com',
    'nature-beauty.myshopify.com',
  ];

  shopDomains.forEach((domain, index) => {
    const installationId = `seed-installation-${String(index + 10).padStart(3, '0')}`;
    mockShopInstallations.set(installationId, {
      installationId,
      shopDomain: domain,
      scopes: ['read_products', 'write_orders'],
      status: 'active',
      createdAt: '2026-01-01T00:00:00Z',
    });
  });

  // Pre-seed some orders
  const orderIds = ['ORDER-001', 'ORDER-002', 'ORDER-003'];
  orderIds.forEach((orderId, index) => {
    mockOrders.set(orderId, {
      orderId,
      shopDomain: 'beauty-lab.myshopify.com',
      lineItems: [
        { sku: `SKU-${String(index + 1).padStart(3, '0')}`, quantity: index + 1 },
      ],
      status: 'received',
      createdAt: '2026-01-15T00:00:00Z',
    });
  });
}
