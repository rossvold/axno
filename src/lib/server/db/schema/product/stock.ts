import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { product } from './product';

export const product_stock = sqliteTable('product_stock', {
	// Primary identifiers
	id: text('id').primaryKey(), // UUID for unique identification (variant/SKU)
	product_id: text('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }), // FK to product (uuid)
	// Variant attributes (e.g. 500g, 1L, Blue)
	amount: real('amount'), // Numeric value for size (500, 1, 2.5)
	unit: text('unit'), // One of: stk, g, kg, L, mL (validated via PRODUCT_UNITS)
	variant_label: text('variant_label'), // Optional display label ("500g", "Large", "Blue")
	// Pricing (always in øre)
	price_ore: integer('price_ore').notNull().default(0),
	discount_percent: integer('discount_percent'), // 0-100, nullable
	// Stock management
	stock_real: integer('stock_real').notNull().default(0), // REAL STOCK
	stock_order: integer('stock_order').notNull().default(0), // Ordered amount
	stock_processing: integer('stock_processing').default(0), // Stock in plukkliste
	stock_minimum: integer('stock_minimum').default(0),
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
	// Timestamps
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

export type ProductStock = typeof product_stock.$inferSelect;
