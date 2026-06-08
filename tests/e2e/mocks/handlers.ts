/**
 * MSW Request Handlers
 * 
 * Mock handlers for SkinTwin Shopify App API endpoints.
 * These handlers simulate the backend behavior for E2E testing.
 */

import { http, HttpResponse } from 'msw';
import {
  mockShopInstallations,
  mockOrders,
  mockMrpPlans,
  mockPurchaseOrders,
  mockFulfillmentEvents,
} from './data';

const BASE_URL = 'https://api.skintwin.ai';

export const handlers = [
  // ───────────────────────────────────────────────────────────
  // Shopify App Endpoints
  // ───────────────────────────────────────────────────────────

  /**
   * POST /shopify/app/install
   * Register or update a Shopify installation
   */
  http.post(`${BASE_URL}/shopify/app/install`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    // Validate required fields
    if (!body.shopDomain || !body.accessToken || !body.scopes) {
      return HttpResponse.json(
        { error: 'Missing required fields: shopDomain, accessToken, scopes' },
        { status: 400 }
      );
    }

    // Check for valid shop domain format
    if (!String(body.shopDomain).endsWith('.myshopify.com')) {
      return HttpResponse.json(
        { error: 'Invalid shop domain format' },
        { status: 400 }
      );
    }

    const installationId = crypto.randomUUID();
    mockShopInstallations.set(installationId, {
      installationId,
      shopDomain: body.shopDomain as string,
      scopes: body.scopes as string[],
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    return HttpResponse.json(
      { installationId, status: 'active' },
      { status: 201 }
    );
  }),

  /**
   * POST /shopify/webhooks/orders-created
   * Ingest Shopify order events and trigger MRP demand planning
   */
  http.post(`${BASE_URL}/shopify/webhooks/orders-created`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    // Validate required fields
    if (!body.orderId || !body.shopDomain || !body.lineItems) {
      return HttpResponse.json(
        { error: 'Missing required fields: orderId, shopDomain, lineItems' },
        { status: 400 }
      );
    }

    const lineItems = body.lineItems as Array<{ sku?: string; quantity?: number }>;

    // Validate line items
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return HttpResponse.json(
        { error: 'lineItems must be a non-empty array' },
        { status: 400 }
      );
    }

    for (const item of lineItems) {
      if (!item.sku || typeof item.quantity !== 'number' || item.quantity < 1) {
        return HttpResponse.json(
          { error: 'Each line item must have sku and quantity >= 1' },
          { status: 400 }
        );
      }
    }

    // Check for duplicate orders (idempotency)
    if (mockOrders.has(body.orderId as string)) {
      return HttpResponse.json(null, { status: 202 });
    }

    mockOrders.set(body.orderId as string, {
      orderId: body.orderId as string,
      shopDomain: body.shopDomain as string,
      lineItems,
      status: 'received',
      createdAt: new Date().toISOString(),
    });

    return HttpResponse.json(null, { status: 202 });
  }),

  // ───────────────────────────────────────────────────────────
  // MRP Endpoints
  // ───────────────────────────────────────────────────────────

  /**
   * POST /mrp/plans
   * Generate a material requirements plan from demand signals
   */
  http.post(`${BASE_URL}/mrp/plans`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    // Validate required fields
    if (!body.planningHorizonDays || !body.demand) {
      return HttpResponse.json(
        { error: 'Missing required fields: planningHorizonDays, demand' },
        { status: 400 }
      );
    }

    const planningHorizonDays = body.planningHorizonDays as number;
    const demand = body.demand as Array<{ sku?: string; requiredUnits?: number }>;

    // Validate planning horizon
    if (typeof planningHorizonDays !== 'number' || planningHorizonDays < 1) {
      return HttpResponse.json(
        { error: 'planningHorizonDays must be >= 1' },
        { status: 400 }
      );
    }

    // Validate demand array
    if (!Array.isArray(demand) || demand.length === 0) {
      return HttpResponse.json(
        { error: 'demand must be a non-empty array' },
        { status: 400 }
      );
    }

    for (const item of demand) {
      if (!item.sku || typeof item.requiredUnits !== 'number' || item.requiredUnits < 1) {
        return HttpResponse.json(
          { error: 'Each demand item must have sku and requiredUnits >= 1' },
          { status: 400 }
        );
      }
    }

    const planId = crypto.randomUUID();
    const requiredByDate = new Date();
    requiredByDate.setDate(requiredByDate.getDate() + planningHorizonDays);

    const materialRequirements = demand.map((item) => ({
      componentSku: `COMP-${item.sku}`,
      requiredQuantity: (item.requiredUnits ?? 0) * 2, // Simple formula: 2 components per unit
      requiredByDate: requiredByDate.toISOString().split('T')[0],
    }));

    mockMrpPlans.set(planId, {
      planId,
      planningHorizonDays,
      demand,
      materialRequirements,
      status: 'generated',
      createdAt: new Date().toISOString(),
    });

    return HttpResponse.json({ planId, materialRequirements }, { status: 200 });
  }),

  // ───────────────────────────────────────────────────────────
  // SCM Endpoints
  // ───────────────────────────────────────────────────────────

  /**
   * POST /scm/purchase-orders
   * Create supplier purchase orders from MRP outputs
   */
  http.post(`${BASE_URL}/scm/purchase-orders`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    // Validate required fields
    if (!body.supplierId || !body.lines) {
      return HttpResponse.json(
        { error: 'Missing required fields: supplierId, lines' },
        { status: 400 }
      );
    }

    const lines = body.lines as Array<{ componentSku?: string; quantity?: number }>;

    // Validate lines array
    if (!Array.isArray(lines) || lines.length === 0) {
      return HttpResponse.json(
        { error: 'lines must be a non-empty array' },
        { status: 400 }
      );
    }

    for (const line of lines) {
      if (!line.componentSku || typeof line.quantity !== 'number' || line.quantity < 1) {
        return HttpResponse.json(
          { error: 'Each line must have componentSku and quantity >= 1' },
          { status: 400 }
        );
      }
    }

    const purchaseOrderId = crypto.randomUUID();

    mockPurchaseOrders.set(purchaseOrderId, {
      purchaseOrderId,
      supplierId: body.supplierId as string,
      lines,
      status: 'draft',
      createdAt: new Date().toISOString(),
    });

    return HttpResponse.json(
      {
        purchaseOrderId,
        supplierId: body.supplierId,
        status: 'draft',
      },
      { status: 201 }
    );
  }),

  /**
   * POST /scm/fulfillment-events
   * Synchronize fulfillment and shipment updates back to Shopify
   */
  http.post(`${BASE_URL}/scm/fulfillment-events`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;

    // Validate required fields
    if (!body.orderId || !body.status || !body.carrier) {
      return HttpResponse.json(
        { error: 'Missing required fields: orderId, status, carrier' },
        { status: 400 }
      );
    }

    const status = body.status as string;
    const validStatuses = ['packed', 'shipped', 'delivered'];

    if (!validStatuses.includes(status)) {
      return HttpResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Check for valid state transitions
    const existingEvents = mockFulfillmentEvents.get(body.orderId as string) || [];
    const lastStatus = existingEvents.length > 0
      ? existingEvents[existingEvents.length - 1].status
      : null;

    const validTransitions: Record<string, string[]> = {
      null: ['packed'],
      packed: ['shipped'],
      shipped: ['delivered'],
      delivered: [], // Terminal state
    };

    const allowedNextStatuses = validTransitions[lastStatus ?? 'null'] || [];
    if (!allowedNextStatuses.includes(status)) {
      return HttpResponse.json(
        {
          error: `Invalid state transition from '${lastStatus || 'none'}' to '${status}'`,
          allowedTransitions: allowedNextStatuses,
        },
        { status: 400 }
      );
    }

    const event = {
      orderId: body.orderId as string,
      status,
      carrier: body.carrier as string,
      trackingNumber: body.trackingNumber as string | undefined,
      timestamp: new Date().toISOString(),
    };

    existingEvents.push(event);
    mockFulfillmentEvents.set(body.orderId as string, existingEvents);

    return HttpResponse.json(null, { status: 202 });
  }),
];
