<script lang="ts">
	import { formatNumber } from '$lib/formatNumber';
	import { locale } from '$lib/i18n/translations';
	import { t } from '$lib/i18n/translations';
	import type { TesRelativePortHeights } from '$lib/openapi/generated/model/tesRelativePortHeights';

	export let parameters: TesRelativePortHeights;
</script>

<tr>
	<td>{$t('common.portHeightTop')}</td>
	<td>{formatNumber(parameters.top, $locale)}</td>
	<td>&percnt;</td>
	<td />
</tr>
<tr>
	<td>{$t('common.portHeightMiddle')}</td>
	<td>{formatNumber(parameters.middle, $locale)}</td>
	<td>&percnt;</td>
	<td />
</tr>
<tr>
	<td>{$t('common.portHeightBottom')}</td>
	<td>{formatNumber(parameters.bottom, $locale)}</td>
	<td>&percnt;</td>
	<td />
</tr>
