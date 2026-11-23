<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { SplitText } from 'gsap/SplitText';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(SplitText);

	const lesson = getLesson('22-capstone');

	let stage = $state<HTMLDivElement | null>(null);
	let headline = $state<HTMLHeadingElement | null>(null);
	let rocket = $state<HTMLDivElement | null>(null);
	let split: SplitText | null = null;
	let timeline: gsap.core.Timeline | null = null;
	let context: gsap.Context | null = null;
	let countdown = $state('3');
	let status = $state('Ready on the pad');

	onMount(() => {
		if (stage === null || headline === null || rocket === null) {
			return;
		}

		context = gsap.context(() => {
			const splitText = SplitText.create(headline, {
				type: 'chars,words',
				charsClass: 'cap-char'
			});

			split = splitText;

			gsap.set(splitText.chars, { yPercent: 120, opacity: 0 });

			const launchTimeline = gsap.timeline({
				paused: true,
				onStart: handleStart,
				onComplete: handleComplete
			});

			timeline = launchTimeline;

			launchTimeline.call(setCountdown, ['3'], 0.1);
			launchTimeline.to(rocket, { y: -7, duration: 0.1, repeat: 5, yoyo: true }, 0.2);
			launchTimeline.call(setCountdown, ['2'], 0.6);
			launchTimeline.call(setCountdown, ['1'], 1.1);
			launchTimeline.call(setCountdown, ['GO'], 1.6);
			launchTimeline.to(rocket, { y: -180, duration: 1.4, ease: 'power2.in' }, 1.7);
			launchTimeline.to('.stars', { opacity: 1, duration: 0.5 }, 1.9);
			launchTimeline.to(
				splitText.chars,
				{
					yPercent: 0,
					opacity: 1,
					duration: 0.6,
					stagger: 0.06,
					ease: 'back.out(1.7)'
				},
				2.1
			);
			launchTimeline.to(rocket, { rotation: 8, duration: 0.5, ease: 'sine.inOut' }, 2.4);

			gsap.to('.flame', {
				keyframes: [
					{ scaleY: 0.7, opacity: 0.55, duration: 0.18 },
					{ scaleY: 1.25, opacity: 1, duration: 0.18 },
					{ scaleY: 0.85, opacity: 0.7, duration: 0.18 }
				],
				repeat: -1,
				ease: 'sine.inOut'
			});

			launchTimeline.play();
		}, stage);

		return () => {
			if (split !== null) {
				split.revert();
			}

			if (context !== null) {
				context.revert();
			}
		};
	});

	function handleStart(): void {
		countdown = '3';
		status = 'Launch started. Hold on.';
	}

	function handleComplete(): void {
		status = 'Orbit reached. The sequence is complete.';
	}

	function setCountdown(value: string): void {
		countdown = value;
	}

	function launchAgain(): void {
		if (timeline === null) {
			return;
		}

		status = 'Ready on the pad';
		timeline.restart();
	}

	const snippet = `
const split = SplitText.create('.liftoff', {
  type: 'chars,words'
});

gsap.set(split.chars, { yPercent: 120, opacity: 0 });

const timeline = gsap.timeline({
  onStart: () => { status = 'Launch started'; },
  onComplete: () => { status = 'Orbit reached'; }
});

timeline.call(setCountdown, ['3'], 0.1);
timeline.to('.rocket', {
  y: -7,
  duration: 0.1,
  repeat: 5,
  yoyo: true
}, 0.2);

timeline.call(setCountdown, ['2'], 0.6);
timeline.call(setCountdown, ['1'], 1.1);
timeline.call(setCountdown, ['GO'], 1.6);

timeline.to('.rocket', {
  y: -180,
  duration: 1.4,
  ease: 'power2.in'
}, 1.7);

timeline.to('.stars', { opacity: 1, duration: 0.5 }, 1.9);

timeline.to(split.chars, {
  yPercent: 0,
  opacity: 1,
  duration: 0.6,
  stagger: 0.06,
  ease: 'back.out(1.7)'
}, 2.1);

// On cleanup:
// split.revert();
// context.revert();
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="One timeline. One split headline. Several small beats.">
		<div class="capstone" bind:this={stage}>
			<div class="space">
				<div class="stars" aria-hidden="true"></div>
				<p class="countdown">{countdown}</p>

				<div class="rocket" bind:this={rocket} aria-hidden="true">
					<span class="flame"></span>
					<span class="body">🚀</span>
				</div>
			</div>

			<div class="control">
				<h2 class="liftoff" bind:this={headline}>LIFTOFF</h2>
				<p class="status">{status}</p>
				<button class="btn btn-primary btn-sm" type="button" onclick={launchAgain}>
					Launch again
				</button>
			</div>
		</div>
	</DemoStage>

	<h2>Plan the beats first</h2>
	<p>
		A complex sequence is easier when you write the beats before the code. This demo has six beats:
		countdown, shake, countdown, countdown, liftoff, and title reveal.
	</p>

	<ol>
		<li>Show 3. Shake the rocket.</li>
		<li>Show 2 and 1.</li>
		<li>Show GO. Move the rocket up.</li>
		<li>Reveal the stars.</li>
		<li>Stagger the letters of the title.</li>
		<li>Set the final status with a callback.</li>
	</ol>

	<CodeBlock code={snippet} title="The launch timeline" />

	<h2>What this demo uses</h2>
	<ul>
		<li><strong>Timeline</strong> to put every beat in order.</li>
		<li><strong>SplitText</strong> to turn "LIFTOFF" into characters.</li>
		<li><strong>Stagger</strong> to reveal the letters one by one.</li>
		<li><strong>Callbacks</strong> to update the countdown and the status.</li>
		<li><strong>Keyframes</strong> to loop the flame.</li>
		<li><strong>Eases</strong> to make the launch feel heavy, then playful.</li>
		<li><strong>Cleanup</strong> to revert the split and the timeline when the page leaves.</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: replay must reset</span>
		<p>
			The replay button calls <code>timeline.restart()</code>. The timeline returns to its recorded
			start values. The countdown text is set again by the <code>onStart</code>
			callback.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Final challenge</span>
		<p>
			Build your own version. Add ScrollTrigger so the launch starts when the panel enters the view.
			Add a Flip layout change for a crew list. Or add a second headline that splits into lines.
			Keep the cleanup.
		</p>
	</div>
</LessonShell>

<style>
	.capstone {
		display: flex;
		min-height: 430px;
		flex-direction: column;
		gap: 0.8rem;
	}

	.space {
		position: relative;
		height: 300px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background: radial-gradient(circle at 50% 115%, #1d3b2a 0%, #101813 55%, #090b0a 100%);
	}

	.stars {
		position: absolute;
		inset: 0;
		opacity: 0;
		background-image:
			radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffb800 1px, transparent 1px);
		background-position:
			0 0,
			22px 34px;
		background-size:
			46px 46px,
			70px 70px;
	}

	.countdown {
		position: absolute;
		top: 22px;
		left: 0;
		right: 0;
		color: #eafff0;
		font-family: var(--font-display);
		font-size: 3.6rem;
		font-weight: 800;
		line-height: 1;
		text-align: center;
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
		font-size: 2.6rem;
		line-height: 1;
		transform: rotate(-45deg);
	}

	.flame {
		position: absolute;
		bottom: -10px;
		left: calc(50% - 9px);
		width: 18px;
		height: 34px;
		border-radius: 999px 999px 4px 4px;
		background: linear-gradient(180deg, #fff3b8, #ffb800 45%, #ff5c7c);
		transform-origin: top center;
	}

	.control {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
	}

	.liftoff {
		color: var(--color-ink);
		font-family: var(--font-display);
		font-size: 2.2rem;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.03em;
	}

	.status {
		flex: 1;
		min-width: 180px;
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.65rem;
	}

	:global(.cap-char) {
		display: inline-block;
		will-change: transform;
	}
</style>
