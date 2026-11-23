<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';

	let stage = $state<HTMLDivElement | null>(null);

	onMount(() => {
		if (stage === null) {
			return;
		}

		const context = gsap.context(() => {
			// ============================================================
			// WRITE YOUR CODE BETWEEN THESE TWO FENCES
			//
			// The selectors .ball, .box, and .dot only find elements
			// inside this sandbox. Nothing else on the site is affected.
			// ============================================================

			// Nothing here yet. Your first tween goes on the next line.

			// ============================================================
			// END OF YOUR CODE
			// ============================================================
		}, stage);

		return () => context.revert();
	});

	function reloadPage(): void {
		window.location.reload();
	}

	const fenceExample = `
const context = gsap.context(() => {
  // WRITE YOUR CODE BETWEEN THESE TWO FENCES
  //
  //      <-- your code goes here
  //
  // END OF YOUR CODE
}, stage);
`;
</script>

<svelte:head>
	<title>Practice sandbox · GSAP Lab</title>
	<meta name="description" content="A free practice space for the GSAP Lab course." />
</svelte:head>

<article class="lesson-shell">
	<header>
		<p class="mb-2 font-mono text-xs font-bold tracking-widest text-muted uppercase">Practice</p>
		<h1 class="font-display text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-5xl">
			Sandbox
		</h1>
		<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
			This page is yours. Type real GSAP code in the file, save it, and watch the browser update.
			Break it as much as you like. The lessons never change.
		</p>
	</header>

	<div class="callout callout-tip mt-8">
		<span class="callout-title">How to use this page</span>
		<ol class="mt-2 space-y-1 pl-5">
			<li>Open <code>src/routes/sandbox/+page.svelte</code> in your editor.</li>
			<li>
				Search for <code>WRITE YOUR CODE</code>. Your code goes between that fence and
				<code>END OF YOUR CODE</code>.
			</li>
			<li>Type a tween, then press Ctrl+S. The page updates by itself.</li>
			<li>If the page goes blank, read the error in the browser. Then fix it. That is normal.</li>
		</ol>
	</div>

	<section class="demo-card my-6">
		<div class="demo-bar">
			<div class="flex items-center gap-2">
				<span class="h-2.5 w-2.5 rounded-full bg-brand" aria-hidden="true"></span>
				<span class="font-mono text-[0.7rem] font-bold tracking-widest uppercase">
					Your targets
				</span>
			</div>
			<button class="btn btn-sm" type="button" onclick={reloadPage}>Reload</button>
		</div>

		<div class="demo-surface" bind:this={stage}>
			<div class="sandbox-row">
				<div class="ball" aria-hidden="true"></div>
				<div class="box" aria-hidden="true"></div>
				<div class="dots" aria-hidden="true">
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
				</div>
			</div>
		</div>
	</section>

	<h2>The fence, exactly where you type</h2>
	<p>
		Everything else on this page is wiring that you do not need to touch. Find these comments and
		put your code in the middle.
	</p>

	<CodeBlock code={fenceExample} title="Where your code lives" />

	<h2>Targets you can use</h2>
	<ul>
		<li><code>.ball</code>: the green circle.</li>
		<li><code>.box</code>: the orange square.</li>
		<li><code>.dot</code>: the five small dots. Use one selector and GSAP handles all five.</li>
	</ul>

	<h2>Try these, in order</h2>
	<ol>
		<li>
			Move the ball: <code>gsap.to('.ball', &#123; x: 120, duration: 1 &#125;);</code>
		</li>
		<li>Make it loop: add <code>repeat: -1, yoyo: true</code> to the same tween.</li>
		<li>
			Animate all five dots at once: <code>
				gsap.to('.dot', &#123; y: -20, stagger: 0.1 &#125;);
			</code>
		</li>
		<li>
			Start the box from off-screen: <code>
				gsap.from('.box', &#123; x: -200, opacity: 0 &#125;);
			</code>
		</li>
	</ol>

	<div class="callout callout-challenge">
		<span class="callout-title">Rule of the sandbox</span>
		<p>
			Type the code by hand. Do not copy and paste. Your fingers remember syntax better than your
			eyes do.
		</p>
	</div>
</article>

<style>
	.sandbox-row {
		display: flex;
		min-height: 260px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 2.5rem;
	}

	.ball {
		width: 76px;
		height: 76px;
		border: 3px solid var(--color-ink);
		border-radius: 999px;
		background: radial-gradient(circle at 34% 28%, #d8ffe2, #0ae448 58%, #05a832);
		box-shadow:
			inset -8px -10px 0 rgba(0, 0, 0, 0.09),
			0 8px 0 rgba(23, 23, 23, 0.12);
	}

	.box {
		width: 76px;
		height: 76px;
		border: 3px solid var(--color-ink);
		border-radius: 0.6rem;
		background: linear-gradient(150deg, #ffd166, #ff8a3d);
		box-shadow:
			inset -8px -10px 0 rgba(0, 0, 0, 0.09),
			0 8px 0 rgba(23, 23, 23, 0.12);
	}

	.dots {
		display: flex;
		gap: 0.6rem;
	}

	.dot {
		width: 22px;
		height: 22px;
		border: 3px solid var(--color-ink);
		border-radius: 999px;
		background-color: #b6a4ff;
	}
</style>
