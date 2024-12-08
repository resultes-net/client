<script lang="ts">
    import { t } from '$lib/i18n/translations';

    import { TtesStorage} from '$lib/openapi/generated/model/ttesStorage'

    import Size from './size.svelte';

    export let parameters: TtesStorage;
</script>

<Size parameters={parameters.size} />

<div class="grid grid-cols-[30%_70%] items-center">
</div>