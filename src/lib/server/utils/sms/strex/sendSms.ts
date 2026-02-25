import { randomUUID } from 'node:crypto';
import { getStrexClient } from './createClient';
import type { OutMessage, SendSmsBatchItem, SendSmsOptions } from './types';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

/**
 * Send a single SMS via STREX/Target365.
 * @param options SMS options
 * @param db Optional database instance to log SMS to sms_sent table
 * @returns The transaction id (created resource id).
 */
export async function sendSms(
	options: SendSmsOptions,
	db?: LibSQLDatabase<typeof schema>
): Promise<string> {
	const {
		sender,
		recipient,
		content,
		transactionId = randomUUID(),
		deliveryReportUrl,
		tags,
		sendTime,
		allowUnicode
	} = options;

	const outMessage: OutMessage = {
		transactionId,
		sender,
		recipient,
		content,
		...(deliveryReportUrl && { deliveryReportUrl }),
		...(tags && tags.length > 0 && { tags }),
		...(sendTime && { sendTime }),
		...(typeof allowUnicode === 'boolean' && { allowUnicode })
	};

	const client = getStrexClient();
	let id: unknown;
	let finalId: string;
	
	try {
		id = await (
			client as { postOutMessage: (m: OutMessage) => Promise<unknown> }
		).postOutMessage(outMessage);

		// Check if response is an error object
		if (id && typeof id === 'object' && 'error' in id) {
			const errorObj = id as { error: string; status?: number; message?: unknown };
			const errorMessage =
				typeof errorObj.message === 'object' && errorObj.message !== null && 'Message' in errorObj.message
					? String((errorObj.message as { Message: string }).Message)
					: typeof errorObj.message === 'string'
						? errorObj.message
						: errorObj.error || 'Unknown STREX API error';

			const apiError = new Error(`STREX API error: ${errorMessage}`);
			(apiError as Error & { status?: number }).status = errorObj.status;

			// Get keyName from environment for debugging
			const keyName = env.STREX_KEY_NAME ?? env.STREX_PUBLIC_KEY;
			const baseUrl = env.STREX_BASE_URL ?? 'https://test.target365.io/';

			console.error('STREX API call failed:', {
				sender,
				recipient,
				transactionId,
				messageLength: content.length,
				status: 'api_error',
				error: errorMessage,
				httpStatus: errorObj.status,
				errorType: errorObj.error,
				configuration: {
					keyName,
					baseUrl,
					hasPrivateKey: !!env.STREX_PRIVATE_KEY
				},
				response: id
			});

			// Add helpful error message for 401 errors
			if (errorObj.status === 401) {
				console.error('STREX Authentication Error - Troubleshooting:', {
					issue: 'Public key not found in STREX system',
					keyNameUsed: keyName,
					baseUrlUsed: baseUrl,
					possibleCauses: [
						'1. The STREX_KEY_NAME or STREX_PUBLIC_KEY does not match what is registered in STREX Connect',
						'2. The private key does not match the public key',
						'3. The key has not been properly registered/activated in STREX Connect',
						'4. You may be using the wrong environment (test vs production)',
						'5. The key may have been deleted or deactivated in STREX Connect'
					],
					actionItems: [
						'Check STREX Connect dashboard to verify the key name',
						'Verify STREX_PRIVATE_KEY matches the key pair',
						'Ensure you are using the correct baseUrl (test vs production)',
						'Contact STREX support if the key should be valid'
					]
				});
			}
			throw apiError;
		}

		// Validate that we got a string transaction ID
		if (typeof id !== 'string') {
			const errorMessage = `Invalid response from STREX API: expected string transaction ID, got ${typeof id}`;
			console.error('STREX API call failed:', {
				sender,
				recipient,
				transactionId,
				messageLength: content.length,
				status: 'api_error',
				error: errorMessage,
				response: id
			});
			throw new Error(errorMessage);
		}

		finalId = id;

		console.log('STREX API call successful:', {
			sender,
			recipient,
			transactionId: finalId,
			messageLength: content.length,
			status: 'accepted'
		});
	} catch (apiError) {
		// Only log if we haven't already logged above
		if (apiError instanceof Error && !apiError.message.startsWith('STREX API error:')) {
			console.error('STREX API call failed:', {
				sender,
				recipient,
				transactionId,
				messageLength: content.length,
				status: 'api_error',
				error: apiError.message,
				stack: apiError.stack
			});
		}
		throw apiError; // Re-throw to let caller handle
	}

	// Log to database if db is provided
	if (db) {
		try {
			await db.insert(schema.smsSent).values({
				id: randomUUID(),
				to: recipient,
				body: content,
				status: 'sent',
				provider: 'strex',
				external_id: finalId
			});
			console.log('SMS logged to database:', {
				recipient,
				transactionId: finalId,
				status: 'logged'
			});
		} catch (error) {
			// Don't fail SMS sending if logging fails
			console.error('Failed to log SMS to database:', {
				recipient,
				transactionId: finalId,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}

	return finalId;
}

/**
 * Send a batch of SMS messages (up to 10 000 per batch; each must have a unique transactionId).
 * @param messages Array of SMS messages to send
 * @param db Optional database instance to log SMS to sms_sent table
 * @returns Array of transaction ids for the created messages.
 */
export async function sendSmsBatch(
	messages: SendSmsBatchItem[],
	db?: LibSQLDatabase<typeof schema>
): Promise<string[]> {
	const client = getStrexClient();
	const outMessages = messages.map((m) => ({
		transactionId: m.transactionId ?? randomUUID(),
		sender: m.sender,
		recipient: m.recipient,
		content: m.content,
		...(m.deliveryReportUrl && { deliveryReportUrl: m.deliveryReportUrl }),
		...(m.tags && m.tags.length > 0 && { tags: m.tags })
	}));

	let ids: unknown;
	let finalIds: string[];

	try {
		ids = await (
			client as { postOutMessageBatch: (msgs: unknown[]) => Promise<unknown> }
		).postOutMessageBatch(outMessages);

		// Check if response is an error object
		if (ids && typeof ids === 'object' && 'error' in ids) {
			const errorObj = ids as { error: string; status?: number; message?: unknown };
			const errorMessage =
				typeof errorObj.message === 'object' && errorObj.message !== null && 'Message' in errorObj.message
					? String((errorObj.message as { Message: string }).Message)
					: typeof errorObj.message === 'string'
						? errorObj.message
						: errorObj.error || 'Unknown STREX API error';

			const apiError = new Error(`STREX API batch error: ${errorMessage}`);
			(apiError as Error & { status?: number }).status = errorObj.status;

			console.error('STREX API batch call failed:', {
				batchSize: outMessages.length,
				recipients: outMessages.map((m) => m.recipient),
				status: 'api_error',
				error: errorMessage,
				httpStatus: errorObj.status,
				errorType: errorObj.error,
				response: ids
			});
			throw apiError;
		}

		// Validate that we got an array of strings
		if (!Array.isArray(ids)) {
			const errorMessage = `Invalid response from STREX API: expected array of transaction IDs, got ${typeof ids}`;
			console.error('STREX API batch call failed:', {
				batchSize: outMessages.length,
				recipients: outMessages.map((m) => m.recipient),
				status: 'api_error',
				error: errorMessage,
				response: ids
			});
			throw new Error(errorMessage);
		}

		// Validate all IDs are strings
		if (!ids.every((id) => typeof id === 'string')) {
			const errorMessage = 'Invalid response from STREX API: expected all transaction IDs to be strings';
			console.error('STREX API batch call failed:', {
				batchSize: outMessages.length,
				recipients: outMessages.map((m) => m.recipient),
				status: 'api_error',
				error: errorMessage,
				response: ids
			});
			throw new Error(errorMessage);
		}

		finalIds = ids as string[];

		console.log('STREX API batch call successful:', {
			batchSize: outMessages.length,
			recipients: outMessages.map((m) => m.recipient),
			transactionIds: finalIds,
			status: 'accepted'
		});
	} catch (apiError) {
		// Only log if we haven't already logged above
		if (apiError instanceof Error && !apiError.message.startsWith('STREX API batch error:')) {
			console.error('STREX API batch call failed:', {
				batchSize: outMessages.length,
				recipients: outMessages.map((m) => m.recipient),
				status: 'api_error',
				error: apiError.message,
				stack: apiError.stack
			});
		}
		throw apiError; // Re-throw to let caller handle
	}

	// Log to database if db is provided
	if (db) {
		try {
			await db.insert(schema.smsSent).values(
				outMessages.map((msg, idx) => ({
					id: randomUUID(),
					to: msg.recipient,
					body: msg.content,
					status: 'sent',
					provider: 'strex',
					external_id: finalIds[idx]
				}))
			);
			console.log('SMS batch logged to database:', {
				batchSize: outMessages.length,
				transactionIds: finalIds,
				status: 'logged'
			});
		} catch (error) {
			// Don't fail SMS sending if logging fails
			console.error('Failed to log SMS batch to database:', {
				batchSize: outMessages.length,
				transactionIds: finalIds,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}

	return finalIds;
}

/**
 * Get an out-message by transaction id.
 */
export async function getOutMessage(
	transactionId: string
): Promise<(OutMessage & Record<string, unknown>) | null> {
	const client = getStrexClient();
	return (client as { getOutMessage: (id: string) => Promise<OutMessage | null> }).getOutMessage(
		transactionId
	);
}

/**
 * Update a scheduled out-message (e.g. content or sendTime).
 */
export async function updateScheduledMessage(
	transactionId: string,
	updates: Partial<Pick<OutMessage, 'content' | 'sendTime'>>
): Promise<void> {
	const existing = await getOutMessage(transactionId);
	if (!existing) {
		throw new Error(`Out-message not found: ${transactionId}`);
	}
	const client = getStrexClient();
	const updated = {
		...existing,
		transactionId: existing.transactionId ?? transactionId,
		...updates
	};
	await (
		client as { putOutMessage: (m: OutMessage & Record<string, unknown>) => Promise<void> }
	).putOutMessage(updated);
}

/**
 * Delete a scheduled out-message.
 */
export async function deleteScheduledMessage(transactionId: string): Promise<void> {
	const client = getStrexClient();
	await (client as { deleteOutMessage: (id: string) => Promise<void> }).deleteOutMessage(
		transactionId
	);
}
