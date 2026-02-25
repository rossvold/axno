import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('#1 MASTER_DATABASE_URL is not set');
if (!process.env.DATABASE_TOKEN) throw new Error('#2 DB_TOKEN token is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema/**/*.ts',
	dialect: 'turso',
	dbCredentials: {
		authToken: process.env.DATABASE_TOKEN,
		url: process.env.DATABASE_URL
	},
	verbose: true,
	strict: true
});
