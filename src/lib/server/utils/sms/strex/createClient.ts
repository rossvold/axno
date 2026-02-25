import { createRequire } from 'node:module';
import { env } from '$env/dynamic/private';

const require = createRequire(import.meta.url);
const Client = require('target365-sdk');

if (!env.STREX_PRIVATE_KEY) {
	throw new Error('STREX_PRIVATE_KEY is not set');
}

// keyName should be the KEY NAME identifier from STREX Connect (e.g., "SveltMedia2026")
// NOT the public key value itself. The SDK uses this name to look up the public key on the server.
// STREX_KEY_NAME is the preferred method - use the exact key name from STREX Connect dashboard
const keyName =
	(env.STREX_KEY_NAME ?? env.STREX_PUBLIC_KEY) as string | undefined;
if (!keyName) {
	throw new Error('STREX_KEY_NAME must be set (the key name identifier from STREX Connect, e.g., "SveltMedia2026")');
}

const baseUrl =
	env.STREX_BASE_URL ?? 'https://test.target365.io/';

let clientInstance: ReturnType<typeof createStrexClient> | null = null;

/**
 * Create a Target365/STREX client. Uses lazy singleton by default when getStrexClient() is used.
 */
export function createStrexClient() {
	const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

	console.log('Creating STREX client:', {
		baseUrl: finalBaseUrl,
		keyName,
		hasPrivateKey: !!env.STREX_PRIVATE_KEY,
		privateKeyLength: env.STREX_PRIVATE_KEY?.length ?? 0,
		environment: finalBaseUrl.includes('test.') ? 'TEST' : 'PRODUCTION',
		note: 'Ensure the keyName matches exactly what is registered in STREX Connect for this environment'
	});

	return new Client(env.STREX_PRIVATE_KEY!, {
		baseUrl: finalBaseUrl,
		keyName
	});
}

/**
 * Get the shared STREX client instance (lazy-created).
 */
export function getStrexClient() {
	if (!clientInstance) {
		clientInstance = createStrexClient();
	}
	return clientInstance;
}
