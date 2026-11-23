<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('05-stagger');

	const cellNumbers = Array.from({ length: 30 }, function (_, index) {
		return index + 1;
	});

	let stage = $state<HTMLDivElement | null>(null);
	let animation: gsap.core.Tween | gsap.core.Timeline | null = null;

	onMount(() => {
		return () => {
			if (animation !== null) {
				animation.kill();
			}
		};
	});

	function getCells(): HTMLElement[] {
		if (stage === null) {
			return [];
		}

		return gsap.utils.toArray<HTMLElement>('.cell', stage);
	}

	function runFromStart(): void {
		const cells = getCells();

		if (animation !== null) {
			animation.kill();
		}

		animation = gsap.fromTo(
			cells,
			{ scale: 0, opacity: 0 },
			{
				scale: 1,
				opacity: 1,
				duration: 0.45,
				stagger: 0.04,
				ease: 'power2.out'
			}
		);
	}

	function runFromCenter(): void {
		const cells = getCells();

		if (animation !== null) {
			animation.kill();
		}

		animation = gsap.fromTo(
			cells,
			{ scale: 0, opacity: 0 },
			{
				scale: 1,
				opacity: 1,
				duration: 0.45,
				stagger: {
					each: 0.04,
					from: 'center',
					grid: 'auto',
					ease: 'power2.inOut'
				},
				ease: 'back.out(1.5)'
			}
		);
	}

	function runRandom(): void {
		const cells = getCells();

		if (animation !== null) {
			animation.kill();
		}

		animation = gsap.fromTo(
			cells,
			{ scale: 0, opacity: 0, rotation: -20 },
			{
				scale: 1,
				opacity: 1,
				rotation: 0,
				duration: 0.5,
				stagger: {
					each: 0.03,
					from: 'random'
				},
				ease: 'back.out(1.8)'
			}
		);
	}

	function runWave(): void {
		const cells = getCells();

		if (animation !== null) {
			animation.kill();
		}

		animation = gsap.fromTo(
			cells,
			{ y: 0 },
			{
				y: -28,
				duration: 0.35,
				repeat: 1,
				yoyo: true,
				ease: 'sine.inOut',
				stagger: {
					each: 0.035,
					from: 'start',
					grid: 'auto',
					axis: 'x'
				}
			}
		);
	}

	function resetGrid(): void {
		const cells = getCells();

		if (animation !== null) {
			animation.kill();
		}

		gsap.set(cells, { scale: 1, opacity: 1, rotation: 0, y: 0 });
	}

	const snippet = `
const cells = gsap.utils.toArray('.cell');

gsap.fromTo(cells,
  { scale: 0, opacity: 0 },
  {
    scale: 1,
    opacity: 1,
    duration: 0.45,
    ease: 'power2.out',
    stagger: {
      each: 0.04,
      from: 'center',
      grid: 'auto',
      ease: 'power2.inOut'
    }
  }
);
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Watch where the wave starts. Then try the other modes.">
		<div class="stagger-wrap" bind:this={stage}>
			<div class="controls">
				<button class="btn btn-sm" type="button" onclick={runFromStart}>From start</button>
				<button class="btn btn-sm" type="button" onclick={runFromCenter}>From center</button>
				<button class="btn btn-sm" type="button" onclick={runRandom}>Random</button>
				<button class="btn btn-sm" type="button" onclick={runWave}>Wave</button>
				<button class="btn btn-sm btn-primary" type="button" onclick={resetGrid}>Reset</button>
			</div>

			<div class="grid">
				{#each cellNumbers as cellNumber (cellNumber)}
					<div class="cell" style={`--cell-hue: ${(cellNumber - 1) * 11}`}>
						<span>{cellNumber}</span>
					</div>
				{/each}
			</div>
		</div>
	</DemoStage>

	<h2>One tween, many little delays</h2>
	<p>
		A stagger adds a small delay between each target. You do not need a loop and you do not need a
		timeline. Add <code>stagger</code> to any tween.
	</p>

	<p>
		The simple form is a number. <code>stagger: 0.1</code> starts each target 0.1 seconds after the one
		before it. The advanced form is an object with more control.
	</p>

	<CodeBlock code={snippet} title="Advanced stagger" />

	<h2>The advanced options</h2>
	<ul>
		<li>
			<code>each</code> sets the delay between targets. It is the same idea as the simple number.
		</li>
		<li>
			<code>from</code> sets the start point: <code>'start'</code>, <code>'center'</code>,
			<code>'end'</code>, <code>'edges'</code>, <code>'random'</code>, or an index.
		</li>
		<li>
			<code>grid: 'auto'</code> reads the visual grid. GSAP uses the element positions, not the HTML order.
		</li>
		<li>
			<code>axis: 'x'</code> or <code>'y'</code> limits the distance calculation to one axis. It gives
			a clean wave.
		</li>
		<li>
			<code>ease</code> inside the stagger object changes the delay spacing, not the tween itself.
		</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: repeat placement matters</span>
		<p>
			A top-level <code>repeat</code> waits for all targets to finish, then repeats the whole group.
			A <code>repeat</code> inside the stagger object repeats each target on its own.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Set <code>from: 'edges'</code> and <code>each: 0.02</code>. Then add
			<code>axis: 'y'</code> to the wave. Which change feels more like a wave?
		</p>
	</div>
</LessonShell>

<style>
	.stagger-wrap {
		display: flex;
		min-height: 330px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
	}

	.grid {
		display: grid;
		width: min(100%, 360px);
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.cell {
		display: flex;
		aspect-ratio: 1;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--color-ink);
		border-radius: 0.65rem;
		background: hsl(var(--cell-hue) 75% 78%);
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 500;
		box-shadow: 2px 2px 0 var(--color-ink);
	}
</style>
