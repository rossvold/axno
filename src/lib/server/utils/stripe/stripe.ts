// stripe.ts
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_STRIPE_KEY } from '$env/static/public';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (server-side)
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	  apiVersion: '2025-07-30.basil',
});

// Export public key for client-side
export const publicKey = PUBLIC_STRIPE_KEY;
