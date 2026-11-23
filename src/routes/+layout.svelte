<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-shell">
	<Sidebar />

	<div class="app-main">
		{@render children()}
	</div>
</div>
