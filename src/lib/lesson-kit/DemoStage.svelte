<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title?: string;
		hint?: string;
		children: Snippet;
	};

	let { title = 'Live demo', hint = '', children }: Props = $props();
</script>

<section class="demo-card my-6">
	<div class="demo-bar">
		<div class="flex items-center gap-2">
			<span class="h-2.5 w-2.5 rounded-full bg-brand" aria-hidden="true"></span>
			<span class="font-mono text-[0.7rem] font-bold tracking-widest uppercase">{title}</span>
		</div>
		{#if hint !== ''}
			<span class="demo-hint">{hint}</span>
		{/if}
	</div>

	<div class="demo-surface">
		{@render children()}
	</div>
</section>
