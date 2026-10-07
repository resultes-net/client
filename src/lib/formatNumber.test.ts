import { describe, expect, it } from 'vitest';

import { formatMoney, formatNumber } from './formatNumber';

describe('formatNumber', () => {
	it('Adds thousands separators of the language', () => {
		expect(formatNumber(24631, 'en', 0)).toBe('24,631');
		expect(formatNumber(24631, 'de-CH', 0)).toBe('24’631');
	});

	it('Uses the decimal separator of the language and a fixed number of decimals', () => {
		expect(formatNumber(1234.5, 'en', 2)).toBe('1,234.50');
		expect(formatNumber(1234.5, 'de-CH', 2)).toBe('1’234.50');
		expect(formatNumber(2.345678, 'en', 1)).toBe('2.3');
	});

	it('Does not round without decimals', () => {
		expect(formatNumber(0.000006, 'en')).toBe('0.000006');
		expect(formatNumber(1234567.891, 'en')).toBe('1,234,567.891');
		expect(formatNumber(1234567.891, 'de-CH')).toBe('1’234’567.891');
		expect(formatNumber(5, 'en')).toBe('5');
	});
});

describe('formatMoney', () => {
	it('Uses k€ without decimals below one million', () => {
		expect(formatMoney(412000, '€', 'en')).toEqual({ value: '412', unit: 'k€' });
		expect(formatMoney(412400, '€', 'en')).toEqual({ value: '412', unit: 'k€' });
		expect(formatMoney(0, '€', 'en')).toEqual({ value: '0', unit: 'k€' });
	});

	it('Uses M€ with two decimals from one million', () => {
		expect(formatMoney(24631000, '€', 'en')).toEqual({ value: '24.63', unit: 'M€' });
		expect(formatMoney(1000000, '€', 'en')).toEqual({ value: '1.00', unit: 'M€' });
	});

	it('Decides the unit after rounding', () => {
		expect(formatMoney(999700, '€', 'en')).toEqual({ value: '1.00', unit: 'M€' });
		expect(formatMoney(999499, '€', 'en')).toEqual({ value: '999', unit: 'k€' });
	});

	it('Uses the currency of the cost region and the language', () => {
		expect(formatMoney(412000, 'CHF', 'de-CH')).toEqual({ value: '412', unit: 'kCHF' });
		expect(formatMoney(24631000, 'CHF', 'de-CH')).toEqual({ value: '24.63', unit: 'MCHF' });
		expect(formatMoney(1234567000, '€', 'de-CH')).toEqual({ value: '1’234.57', unit: 'M€' });
	});

	it('Handles negative amounts', () => {
		expect(formatMoney(-412000, '€', 'en').unit).toBe('k€');
		expect(formatMoney(-24631000, '€', 'en')).toEqual({ value: '-24.63', unit: 'M€' });
	});
});
