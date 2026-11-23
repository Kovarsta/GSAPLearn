<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let spinner = $state<HTMLDivElement | null>(null);

	onMount(() => {
		if (spinner === null) {
			return;
		}

		// The context collects the tween. revert() kills it on unmount.
		const context = gsap.context(() => {
			gsap.to(spinner, {
				rotation: 360,
				duration: 1.2,
				repeat: -1,
				ease: 'none'
			});
		}, spinner);

		return () => context.revert();
	});
</script>

<div class="spinner-wrap">
	<div class="spinner" bind:this={spinner} aria-hidden="true"></div>
	<p>Mounted and spinning</p>
</div>

<style>
	.spinner-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.spinner {
		width: 54px;
		height: 54px;
		border: 5px solid #d8d0c0;
		border-top-color: var(--color-brand);
		border-right-color: var(--color-ink);
		border-radius: 999px;
	}

	p {
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.6rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
</style>
