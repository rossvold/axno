export { createStrexClient, getStrexClient } from './createClient';
export {
	sendSms,
	sendSmsBatch,
	getOutMessage,
	updateScheduledMessage,
	deleteScheduledMessage
} from './sendSms';
export type {
	SendSmsOptions,
	SendSmsBatchItem,
	OutMessage
} from './types';
