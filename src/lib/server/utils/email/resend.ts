import { Resend } from 'resend';
import { PRIVATE_RESEND_API_KEY } from '$env/static/private';
import { assert } from '$lib/assertion/assert';
import { supabaseServer } from '$lib/supabase/supabaseServer';
import { documentError } from './errorTracking';

const resend = new Resend(PRIVATE_RESEND_API_KEY);

export async function sendEmail(from: string, recipient: string[], subject: string, html: string) {
	console.log('Email utility called');
	assert(typeof from === 'string', 'from must be a string');
	assert(Array.isArray(recipient), 'to must be an array');
	assert(typeof subject === 'string', 'subject must be a string');
	assert(typeof html === 'string', 'html must be a string');
	
	let batch = [];
	for (let i = 0; i < recipient.length; i++) {
		// Add object to batch
		let to = recipient[i];
		batch.push({
			from,
			to,
			subject,
			html
		});
	}

	// Send batch
	const { data, error } = await resend.batch.send(batch);
	// Throw if error
	if (error) {
		throw new Error(error.message);
	}

	const id = data.data; // Respons with an array of id's. One id per recipient.
	const to = recipient; // Array of recipients.
	// make object to store email in supabase
	const emailSent = {
		id,
		from,
		to: to,
		subject,
		html
	};
	// Store email in our database
	const { error: storeEmailError } = await supabaseServer.from('emails_sent').insert(emailSent);

	if (storeEmailError) {
		throw new Error(`Failed to store email: ${storeEmailError.message}`);
	}
}
