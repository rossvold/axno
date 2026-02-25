import type { Handle, HandleServerError } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;

// Handle uncaught server errors
export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	console.log("unhandled error caught");

	const errorMessage = error instanceof Error ? error.message : String(error);
	const errorStack = error instanceof Error ? error.stack : undefined;

	// Don't log 404 errors as they are expected behavior for non-existent routes
	if (status === 404) {
		if (process.env.NODE_ENV === 'development') {
			console.log("404 Not Found:", event.url.pathname, "- This is expected behavior, not logging.");
		}
		return {
			message: message || 'Page not found.'
		};
	}

	if (process.env.NODE_ENV === 'development') {
		console.log("ENV = Dev, not logging to database.");
		console.log("ErrorMessage:", errorMessage);
		console.log("errorStack:", errorStack);
		console.log("status:", status);
		console.log("event", event);
	} else {
		try {
			// Log to database
			const errorId = crypto.randomUUID();
			const uncaughtError = {
				id: errorId,
				message: errorMessage,
				stack: errorStack,
				route: event.url.pathname,
				user_id: event.locals.user?.id ?? null,
				environment: process.env.NODE_ENV || 'production',
				http_status: status,
				error_type: "server_error",
				caught: false, // This error is always uncaught. AKA more critical.
				created_at: new Date(),
				updated_at: new Date()
			};

			await db.insert(schema.uncaught_errors).values(uncaughtError);
			console.error('Error logged to database. Status:', status, ' error: ', error);
		} catch (logError) {
			// If we can't log the error, at least log it to console
			console.error('Failed to log server error to database:', logError);
			console.error('Original error:', error);
		}
	}

	// Return the message that was passed in, or a default
	return {
		message: message || 'An unexpected server error occurred.'
	};
};
