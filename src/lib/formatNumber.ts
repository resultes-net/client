/**
 * Formats a number for display in the given language (e.g. `24,631` in `en`, `24’631` in `de-CH`).
 *
 * With `decimals`, the value is rounded to exactly that many decimals. Without, it isn't rounded
 * (only separators are added): use that for the user's inputs, some of which are tiny.
 */
export function formatNumber(value: number, locale: string, decimals?: number): string {
	if (decimals === undefined) {
		return value.toLocaleString(locale, { maximumFractionDigits: 20 });
	}
	return value.toLocaleString(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
}

export interface FormattedMoney {
	value: string;
	/** E.g. `k€`, `M€` or `kCHF`. */
	unit: string;
}

/**
 * Formats an amount of money as k€ (no decimals) below one million, as M€ (two decimals) from there.
 * The unit is decided after rounding: 999,700 € is `1.00 M€`, not `1000 k€`.
 */
export function formatMoney(
	amount: number,
	currencySymbol: string,
	locale: string
): FormattedMoney {
	const thousands = amount / 1e3;
	if (Math.round(Math.abs(thousands)) < 1e3) {
		return { value: formatNumber(thousands, locale, 0), unit: `k${currencySymbol}` };
	}
	return { value: formatNumber(amount / 1e6, locale, 2), unit: `M${currencySymbol}` };
}
