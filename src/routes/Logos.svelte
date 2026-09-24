<script lang="ts">
	import dcarboLogo from '$lib/assets/logos/LOGOS-DCARBO.png';
	import meteonormLogo from '$lib/assets/logos/meteonorm-logo.4_5lpRm8_ZJ2Bx.svg';
	import ostLogo from '$lib/assets/logos/ost-logo-de.svg';
	import solarKeyMarkLogo from '$lib/assets/logos/Solar-Keymark-Logo.png';
	import solitesLogo from '$lib/assets/logos/Solites_Logo.png';
	import spfLogo from '$lib/assets/logos/spf-logo.svg';
	import swissLogoFlag from '$lib/assets/logos/swiss-logo-flag.svg';
	import trnsysLogo from '$lib/assets/logos/trnsys-bg-logo.png';

	import { t } from 'src/lib/i18n/translations';
</script>

<div class="flex flex-col">
	<span class="text-lg">{$t('logos.DevelopedBy')}</span>
	<div class="mt-2 ml-12 flex flex-row">
		<a class="self-end" href="https://spf.ch">
			<div class="dark:bg-white w-[250px] p-1"><img alt={$t('logos.SPFLogo')} src={spfLogo} /></div>
		</a>
		<a class="ml-14" href="https://www.ost.ch">
			<div class="dark:bg-white p-1"><img alt={$t('logos.OSTLogo')} src={ostLogo} /></div>
		</a>
	</div>
	<span class="text-lg mt-10">{$t('logos.ProjectPartners')}</span>
	<div class="mt-2 ml-12 flex flex-row">
		<a class="self-end" href="https://dcarbo.es">
			<img
				class="bg-black dark:bg-transparent"
				alt={$t('logos.DCarboLogo')}
				src={dcarboLogo}
				width="250"
			/>
		</a>
		<a href="https://solites.de">
			<img class="ml-14" alt={$t('logos.SolitesLogo')} src={solitesLogo} width="250" />
		</a>
	</div>
	<span class="text-lg mt-10">{$t('logos.RunningOn')}</span>
	<div class="mt-2 ml-12 flex flex-row">
		<a href="https://www.trnsys.com">
			<div class="flex flex-row">
				<span class="self-center family-[TitilliumMedium] text-[#d7e5ee] text-[50px]">TRNSYS</span>
				<img class="ml-1" alt={$t('logos.TRNSYSLogo')} src={trnsysLogo} width="80" />
			</div>
		</a>
		<div class="flex flex-row ml-4 self-end">
			<span>{$t('common.and')}</span>
			<a href="https://github.com/SPF-OST/pytrnsys_gui" class="ml-2 anchor italic">pytrnsys</a>
		</div>
	</div>
	<span class="text-lg mt-10">{$t('logos.UsesDataFrom')}</span>
	<div class="mt-2 ml-12 flex flex-row">
		<a class="self-end" href="https://meteonorm.com/">
			<div class="bg-black dark:bg-transparent p-1 w-[250px]">
				<img alt={$t('logos.MeteonormLogo')} src={meteonormLogo} />
			</div>
		</a>
		<a href="https://solarkeymark.eu/">
			<img class="ml-14" alt={$t('logos.SolitesLogo')} src={solarKeyMarkLogo} width="250" />
		</a>
	</div>
	<span class="text-lg mt-10">{$t('logos.FundedBy')}</span>
	<div class="flex flex-col w-fit mt-2 mb-2 ml-12">
		<a href="https://www.bfe.admin.ch" class="flex flex-row items-start">
			<img
				class="self-start"
				alt={$t('logos.SwissLogoFlag')}
				src={swissLogoFlag}
				height="34px"
				width="32px"
			/>
			<div class="ml-1 text-xs">
				Schweizer Eidgenossenschaft
				<br />
				Conféderation Suisse
				<br />
				Confederazione Svizzera
				<br />
				Confederaziun svizzra
			</div>
			<div class="w-[1px] h-[3.5rem] mx-[1.5rem] bg-[rgb(209,213,219)]" />
			<div class="font-bold">
				{$t('logos.SwissFederalOfficeOfEnergy')}
				<br />
				{$t('logos.SFOE')}
			</div>
		</a>
		<span class="text-xs self-end">
			{$t('logos.UnderContractNr')}:
			<a class="anchor" href="https://www.aramis.admin.ch/Grunddaten/?ProjectID=55434">
				SI/502780
			</a>
		</span>
	</div>
	<span class="mt-14">
		{$t('logos.ResulTESis')} <a href="https://github.com/resultes-net" class="anchor">{$t('logos.openSource')}</a>
	</span>
</div>
