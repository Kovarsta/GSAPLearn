<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('09-callbacks-and-keyframes');

	let stage = $state<HTMLDivElement | null>(null);
	let timeline: gsap.core.Timeline | null = null;
	let status = $state('Ready on the pad');
	let step = $state(0);
	let progressValue = $state(0);

	const steps = ['Ready', 'Liftoff', 'Orbit'];

	onMount(() => {
		if (stage === null) {
			return;
		}

		const context = gsap.context(() => {
			timeline = gsap.timeline({
				onStart: setStarted,
				onUpdate: updateProgress,
				onComplete: setComplete
			});

			timeline.to('.rocket', { y: -7, duration: 0.1, repeat: 5, yoyo: true }, 0.2);
			timeline.call(setLiftoff, [], 1);
			timeline.to('.rocket', { y: -150, duration: 1.2, ease: 'power2.in' }, 1);
			timeline.to('.stars', { opacity: 1, duration: 0.5 }, 1.9);
			timeline.to('.rocket', { rotation: 8, duration: 0.5, ease: 'sine.inOut' }, 2.1);

			gsap.to('.flame', {
				keyframes: [
					{ scaleY: 0.7, opacity: 0.55, duration: 0.2 },
					{ scaleY: 1.25, opacity: 1, duration: 0.2 },
					{ scaleY: 0.85, opacity: 0.7, duration: 0.2 }
				],
				repeat: -1,
				ease: 'sine.inOut'
			});
		}, stage);

		if (timeline !== null) {
			timeline.play();
		}

		return () => context.revert();
	});

	function setStarted(): void {
		status = 'Countdown started';
		step = 1;
	}

	function setLiftoff(): void {
		status = 'Liftoff! Hold on.';
		step = 2;
	}

	function setComplete(): void {
		status = 'Orbit reached. Nice work.';
		step = 3;
		progressValue = 1;
	}

	function updateProgress(): void {
		if (timeline === null) {
			return;
		}

		progressValue = timeline.progress();
	}

	function replay(): void {
		if (timeline === null) {
			return;
		}

		status = 'Ready on the pad';
		step = 0;
		progressValue = 0;
		timeline.restart();
	}

	const snippet = `
const timeline = gsap.timeline({
  onStart: () => { status = 'Countdown started'; },
  onComplete: () => { status = 'Orbit reached'; }
});

timeline.to('.rocket', {
  y: -7,
  duration: 0.1,
  repeat: 5,
  yoyo: true
}, 0.2);

// Insert a callback at 1 second.
timeline.call(() => { status = 'Liftoff!'; }, [], 1);

timeline.to('.rocket', {
  y: -150,
  duration: 1.2,
  ease: 'power2.in'
}, 1);

// Keyframes: a list of steps inside one tween.
gsap.to('.flame', {
  keyframes: [
    { scaleY: 0.7, opacity: 0.55, duration: 0.2 },
    { scaleY: 1.25, opacity: 1, duration: 0.2 },
    { scaleY: 0.85, opacity: 0.7, duration: 0.2 }
  ],
  repeat: -1,
  ease: 'sine.inOut'
});
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Watch the status text and the step list.">
		<div class="mission-wrap" bind:this={stage}>
			<div class="space">
				<div class="stars" aria-hidden="true"></div>
				<div class="rocket" aria-hidden="true">
					<span class="flame"></span>
					<span class="body">🚀</span>
				</div>
				<p class="status">{status}</p>
			</div>

			<div class="mission-foot">
				<div class="steps">
					{#each steps as stepName, index (stepName)}
						<span class="step" class:step-active={step > index}>
							<span class="step-dot"></span>
							{stepName}
						</span>
					{/each}
				</div>

				<button class="btn btn-primary btn-sm" type="button" onclick={replay}>Launch again</button>
			</div>

			<div class="progress-track" aria-hidden="true">
				<div class="progress-fill" style={`width: ${progressValue * 100}%`}></div>
			</div>
		</div>
	</DemoStage>

	<h2>Run code at a moment in time</h2>
	<p>
		Callbacks connect an animation to your app. Use them to change text, play a sound, start a
		request, or update a counter. GSAP calls your function at the exact moment that you choose.
	</p>

	<CodeBlock code={snippet} title="Callbacks and keyframes" />

	<h2>The callback names</h2>
	<ul>
		<li><code>onStart</code> runs when the animation starts.</li>
		<li>
			<code>onUpdate</code> runs on every frame while the animation moves. Keep this function small.
		</li>
		<li><code>onComplete</code> runs when the animation reaches the end.</li>
		<li><code>onRepeat</code> runs each time a repeat starts.</li>
		<li><code>onReverseComplete</code> runs when a reversed animation returns to the start.</li>
		<li>
			<code>timeline.call(function, params, position)</code> puts a callback at a position inside a timeline.
		</li>
	</ul>

	<h2>Keyframes</h2>
	<p>
		A keyframes array turns one tween into a small sequence. Each object is a step. Each step can
		have its own duration and ease. The flame uses three steps in a loop.
	</p>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: do not do heavy work in onUpdate</span>
		<p>
			<code>onUpdate</code> can run 60 times each second. Update a small value or a CSS variable. Do not
			rebuild the DOM or start a network request there.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add a fourth step named "Signal". Use <code>timeline.call()</code> at 2.4 seconds to set the status
			to "Signal sent". Then make the stars blink with a keyframes tween.
		</p>
	</div>
</LessonShell>

<style>
	.mission-wrap {
		display: flex;
		min-height: 360px;
		flex-direction: column;
		gap: 0.9rem;
	}

	.space {
		position: relative;
		height: 240px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background: radial-gradient(circle at 50% 120%, #1d3b2a 0%, #101813 55%, #090b0a 100%);
	}

	.stars {
		position: absolute;
		inset: 0;
		opacity: 0;
		background-image:
			radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffb800 1px, transparent 1px);
		background-position:
			0 0,
			18px 26px;
		background-size:
			42px 42px,
			64px 64px;
	}

	.rocket {
		position: absolute;
		bottom: 30px;
		left: calc(50% - 22px);
		width: 44px;
		text-align: center;
	}

	.body {
		display: block;
		font-size: 2.4rem;
		line-height: 1;
		transform: rotate(-45deg);
	}

	.flame {
		position: absolute;
		bottom: -8px;
		left: calc(50% - 8px);
		width: 16px;
		height: 30px;
		border-radius: 999px 999px 4px 4px;
		background: linear-gradient(180deg, #fff3b8, #ffb800 45%, #ff5c7c);
		transform-origin: top center;
	}

	.status {
		position: absolute;
		right: 1rem;
		bottom: 0.8rem;
		left: 1rem;
		color: #eafff0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-align: center;
	}

	.mission-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.steps {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.step {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		border: 1.5px solid var(--color-line);
		border-radius: 999px;
		padding: 0.25rem 0.55rem;
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
	}

	.step-active {
		border-color: var(--color-ink);
		background-color: var(--color-brand);
		color: var(--color-ink);
	}

	.step-dot {
		width: 5px;
		height: 5px;
		border-radius: 999px;
		background-color: currentColor;
	}

	.progress-track {
		height: 8px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-brand);
	}
</style>
