/**
 * Options for sending a single SMS via STREX/Target365.
 */
export interface SendSmsOptions {
	/** Sender: alphanumeric string (e.g. "MyApp") or short number. */
	sender: string;
	/** Recipient in E.164 format (e.g. "+4798079008"). */
	recipient: string;
	/** Message body. */
	content: string;
	/** Optional unique transaction id; default is a new UUID. */
	transactionId?: string;
	/** Optional URL for delivery reports (DLR). */
	deliveryReportUrl?: string;
	/** Optional tags for statistics/grouping. */
	tags?: string[];
	/** Optional ISO date string for scheduled send. */
	sendTime?: string;
	/** Optional: allow unicode (otherwise replaced or rejected per SDK). */
	allowUnicode?: boolean;
}

/**
 * One item in a batch of outbound messages.
 */
export interface SendSmsBatchItem {
	sender: string;
	recipient: string;
	content: string;
	transactionId?: string;
	deliveryReportUrl?: string;
	tags?: string[];
}

/**
 * Out-message shape used by the Target365 API (minimal fields we use).
 */
export interface OutMessage {
	transactionId?: string;
	sender: string;
	recipient: string;
	content: string;
	sendTime?: string;
	deliveryReportUrl?: string;
	allowUnicode?: boolean;
	tags?: string[];
}
