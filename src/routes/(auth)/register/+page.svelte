<script lang="ts">
	import { t } from '$lib/i18n/translations';
</script>

<div class="flex flex-col w-[80%] self-center gap-y-4">
	<label class="label">
		<span>{$t('auth.fullname')}</span>
		<input class="input" type="text" />
	</label>
	<label class="label">
		<span>{$t('auth.email')}</span>
		<input class="input" type="email" />
	</label>
    <label class="label">
		<span>{$t('auth.username')}</span>
		<input class="input" type="text" />
	</label>
	<label class="label">
		<span>{$t('auth.password')}</span>
		<input class="input" type="password" />
	</label>
    <button type="button" class="btn variant-filled-primary self-center mt-2">{$t('auth.register')}</button>
</div>
