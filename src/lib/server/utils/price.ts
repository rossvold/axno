/**
 * Øre <-> KR conversion utilities for Norwegian market.
 * All prices stored in DB are always whole integers in øre.
 */
export function oreToKr(ore: number): number {
	return Math.round(ore / 100);
}

export function krToOre(kr: number): number {
	return kr * 100;
}
