import { sql } from 'drizzle-orm';
import { primaryKey, sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { product } from './product';
import { productCategory } from './category';

export const productCategoryRelation = sqliteTable(
	'product_category_relation',
	{
		product_id: text('product_id')
			.notNull()
			.references(() => product.id, { onDelete: 'cascade' }),
		category_id: text('category_id')
			.notNull()
			.references(() => productCategory.id, { onDelete: 'cascade' }),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(unixepoch())`)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.product_id, table.category_id] })
	})
);

export type ProductCategoryRelation = typeof productCategoryRelation.$inferSelect;
