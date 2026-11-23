<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('04-eases');

	const easeNames = ['none', 'power2.out', 'back.out(1.7)', 'elastic.out(1, 0.4)', 'bounce.out'];
	const easeLabels = ['none', 'power2.out', 'back.out(1.7)', 'elastic.out', 'bounce.out'];
	const easeColors = ['#171717', '#0ae448', '#ffb800', '#ff5c7c', '#00b3ff'];

	let stage = $state<HTMLDivElement | null>(null);
	let race: gsap.core.Timeline | null = null;

	onMount(() => {
		return () => {
			if (race !== null) {
				race.kill();
			}
		};
	});

	function startRace(): void {
		if (stage === null) {
			return;
		}

		const lanes = gsap.utils.toArray<HTMLElement>('.lane', stage);
		const balls = gsap.utils.toArray<HTMLElement>('.racer', stage);

		if (race !== null) {
			race.kill();
		}

		const timeline = gsap.timeline();

		for (let index = 0; index < balls.length; index++) {
			const ball = balls[index];
			const lane = lanes[index];
			const distance = lane.clientWidth - ball.offsetWidth - 6;
			const ease = easeNames[index];

			timeline.fromTo(
				ball,
				{ x: 0 },
				{
					x: distance,
					duration: 2.4,
					ease: ease
				},
				0
			);
		}

		race = timeline;
	}

	function resetRace(): void {
		if (stage === null) {
			return;
		}

		const balls = gsap.utils.toArray<HTMLElement>('.racer', stage);

		if (race !== null) {
			race.kill();
		}

		gsap.to(balls, { x: 0, duration: 0.4, ease: 'power2.out' });
	}

	const snippet = `
const lanes = gsap.utils.toArray('.lane');
const balls = gsap.utils.toArray('.racer');
const eases = ['none', 'power2.out', 'back.out(1.7)', 'elastic.out(1, 0.4)', 'bounce.out'];

for (let index = 0; index < balls.length; index++) {
  const ball = balls[index];
  const lane = lanes[index];
  const distance = lane.clientWidth - ball.offsetWidth;

  gsap.fromTo(ball,
    { x: 0 },
    {
      x: distance,
      duration: 2.4,
      ease: eases[index]
    }
  );
}
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="All balls use the same duration. Only the ease changes.">
		<div class="race-wrap" bind:this={stage}>
			<div class="race-top">
				<p class="race-note">Same distance. Same 2.4 seconds. Different speed curves.</p>
				<button class="btn btn-primary btn-sm" type="button" onclick={startRace}>Start race</button>
				<button class="btn btn-sm" type="button" onclick={resetRace}>Reset</button>
			</div>

			<div class="track">
				{#each easeLabels as label, index (label)}
					<div class="lane-row">
						<span class="ease-label" style={`color: ${easeColors[index]}`}>{label}</span>
						<div class="lane">
							<div class="racer" style={`background: ${easeColors[index]}`}></div>
							<div class="flag" aria-hidden="true">⚑</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</DemoStage>

	<h2>An ease is a speed curve</h2>
	<p>
		Every tween moves from a start value to an end value. The ease controls how fast it travels at
		each moment. It does not change the duration. It changes the feel.
	</p>

	<p>
		The default ease is <code>power1.out</code>. It starts fast, then slows down. That feels natural
		for many interface animations.
	</p>

	<CodeBlock code={snippet} title="Five eases, one race" />

	<h2>The common families</h2>
	<ul>
		<li><code>none</code> is linear. The speed never changes.</li>
		<li>
			<code>power1</code> to <code>power4</code> are smooth curves. Add <code>.in</code>,
			<code>.out</code>, or <code>.inOut</code>.
		</li>
		<li>
			<code>back.out(1.7)</code> moves past the end value, then returns. The number controls the overshoot.
		</li>
		<li>
			<code>elastic.out(1, 0.4)</code> springs like a rubber band. The first number is the amplitude.
			The second is the period.
		</li>
		<li><code>bounce.out</code> hits the end and bounces a few times.</li>
		<li><code>steps(6)</code> jumps in six equal steps. Use it for a retro or mechanical look.</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: try the ease visualizer</span>
		<p>
			The GSAP ease visualizer shows the curve and lets you tune the numbers. Search for "GSAP ease
			visualizer" in your browser when you need a custom feel.
		</p>
	</div>

	<div class="callout callout-warn">
		<span class="callout-title">Do not overdo it</span>
		<p>
			Use a strong ease for a playful moment. Use a calm ease for navigation, buttons, and content
			that appears many times.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change <code>power2.out</code> to <code>steps(6)</code>. Then change the bounce ease to
			<code>elastic.out(1, 0.2)</code>. Which one looks slower, even with the same duration?
		</p>
	</div>
</LessonShell>

<style>
	.race-wrap {
		min-height: 300px;
	}

	.race-top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.race-note {
		color: var(--color-muted);
		font-size: 0.78rem;
	}

	.track {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.lane-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.ease-label {
		width: 96px;
		flex-shrink: 0;
		font-family: var(--font-mono);
		font-size: 0.63rem;
		font-weight: 500;
		text-align: right;
	}

	.lane {
		position: relative;
		height: 38px;
		flex: 1;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
	}

	.racer {
		position: absolute;
		top: 4px;
		left: 4px;
		width: 26px;
		height: 26px;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
	}

	.flag {
		position: absolute;
		top: 50%;
		right: 8px;
		color: var(--color-muted);
		font-size: 0.85rem;
		transform: translateY(-50%);
	}

	@media (max-width: 640px) {
		.ease-label {
			width: 66px;
			font-size: 0.55rem;
		}
	}
</style>
