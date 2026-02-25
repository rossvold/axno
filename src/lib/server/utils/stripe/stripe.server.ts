// stripe.server.ts
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

if (!env['STRIPE_SECRET_KEY']) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

// Initialize Stripe with your secret key
export const stripe = new Stripe(env['STRIPE_SECRET_KEY'], {
    apiVersion: '2025-07-30.basil'
});
