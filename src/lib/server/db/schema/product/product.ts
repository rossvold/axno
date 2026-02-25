import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { productSupplier } from './supplier';
import { product_brand } from './brand';

export const product = sqliteTable('product', {
	// Primary identifiers
	product_number: integer('product_number').primaryKey(), // AUTOINCREMENT starting from 100001
	id: text('id').notNull().unique(), // UUID for external references
	// Product information
	name: text('name').notNull(),
	description: text('description'),
	dosage_usage: text('dosage_usage'),
	ingredients: text('ingredients'),
	nutritional_content: text('nutritional_content'),
	opprinnelsesland: text('opprinnelsesland'), // Country of origin
	is_new: integer('is_new', { mode: 'boolean' }).notNull().default(false), // New product flag
	// Media links
	image_link: text('image_link'),
	website_link: text('website_link'),
	// Categorization & relationships (categories via product_category_relation)
	supplier_id: text('supplier_id').references(() => productSupplier.id),
	brand_id: text('brand_id').references(() => product_brand.id),
	// Stock management (order-only products)
	bestillingsvare: integer('bestillingsvare', { mode: 'boolean' }).notNull().default(false),
	bestillingsvare_leveringstid: text('bestillingsvare_leveringstid'),
	bestillings_enhet: text('bestillings_enhet'), // Ordering unit for products
	// Reviews & ratings
	bought: integer('bought').default(0),
	rating: real('rating').notNull().default(0), // Product rating 0-5
	reviews: integer('reviews').notNull().default(0), // Number of reviews
	// Status & configuration
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
	subscription: integer('subscription', { mode: 'boolean' }).notNull().default(false),
	// Timestamps
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

export type Product = typeof product.$inferSelect;
