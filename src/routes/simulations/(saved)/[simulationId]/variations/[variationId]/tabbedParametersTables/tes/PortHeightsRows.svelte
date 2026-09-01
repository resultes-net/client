<script lang="ts">
	import { t } from '$lib/i18n/translations';
	import type { TesRelativePortHeights } from '$lib/openapi/generated/model/tesRelativePortHeights';

	export let parameters: TesRelativePortHeights;
</script>

<tr>
	<td>{$t('common.portHeightTop')}</td>
	<td>{parameters.top}</td>
	<td>&percnt;</td>
	<td />
</tr>
<tr>
	<td>{$t('common.portHeightMiddle')}</td>
	<td>{parameters.middle}</td>
	<td>&percnt;</td>
	<td />
</tr>
<tr>
	<td>{$t('common.portHeightBottom')}</td>
	<td>{parameters.bottom}</td>
	<td>&percnt;</td>
	<td />
</tr>
