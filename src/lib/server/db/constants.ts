export const PRODUCT_UNITS = ['stk', 'g', 'kg', 'L', 'mL'] as const;
export type ProductUnit = (typeof PRODUCT_UNITS)[number];
