// This schema tracks individual items within an order
// Each row represents one product/item in an order
import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { user } from '../auth.schema';
import { product } from '../product/product';
import { product_stock } from '../product/stock';
import { order } from './order';
import { order_items_status } from './order_items_status';

export const order_items = sqliteTable('order_items', {
	id: text('id').primaryKey(), // uuid
	order_id: text('order_id')
		.notNull()
		.references(() => order.id),
	product_id: text('product_id')
		.notNull()
		.references(() => product.id),
	product_stock_id: text('product_stock_id').references(() => product_stock.id), // nullable when product has no variants
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	order_items_status: text('order_items_status').references(() => order_items_status.id),
	// Item details (prices in øre)
	quantity: integer('quantity').notNull(),
	unit_price_ore: integer('unit_price_ore').notNull(),
	line_price_ore: integer('line_price_ore').notNull(),
	note: text('note'),
	// Meta info
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

export type OrderItem = typeof order_items.$inferSelect;
export type NewOrderItem = typeof order_items.$inferInsert;
