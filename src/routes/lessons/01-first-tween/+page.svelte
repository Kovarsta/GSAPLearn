<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('01-first-tween');

	let ball = $state<HTMLDivElement | null>(null);
	let animation: gsap.core.Tween | null = null;

	onMount(() => {
		if (ball === null) {
			return;
		}

		const context = gsap.context(() => {
			animation = gsap.to(ball, {
				y: 84,
				rotation: 180,
				duration: 1.2,
				repeat: -1,
				yoyo: true,
				ease: 'power1.inOut'
			});
		}, ball);

		return () => context.revert();
	});

	function replay(): void {
		if (animation === null) {
			return;
		}

		animation.restart();
	}

	const snippet = `
gsap.to('.ball', {
  y: 84,
  rotation: 180,
  duration: 1.2,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut'
});
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="The ball loops forever. Click replay to start again.">
		<div class="playground">
			<div class="ring" aria-hidden="true"></div>
			<div class="ball" bind:this={ball} aria-hidden="true">
				<span class="eye eye-left"></span>
				<span class="eye eye-right"></span>
				<span class="smile"></span>
			</div>
			<button class="btn btn-primary replay" type="button" onclick={replay}>Replay</button>
		</div>
	</DemoStage>

	<h2>One method does the work</h2>
	<p>
		A tween changes a value over time. <code>gsap.to()</code> is the most common tween. It reads the current
		value, then animates to the value that you give it.
	</p>

	<p>Every tween has the same three parts:</p>
	<ol>
		<li>
			<strong>Target</strong>: the element or object to animate. Here it is <code>.ball</code>.
		</li>
		<li>
			<strong>Vars</strong>: the values to animate. Here it is <code>y</code> and
			<code>rotation</code>.
		</li>
		<li>
			<strong>Special settings</strong>: timing and feel. Here it is <code>duration</code>,
			<code>repeat</code>, <code>yoyo</code>, and <code>ease</code>.
		</li>
	</ol>

	<CodeBlock code={snippet} title="First tween" />

	<h2>What each line means</h2>
	<ul>
		<li>
			<code>y: 84</code> moves the ball 84 pixels down. GSAP uses a transform, so the page layout does
			not move.
		</li>
		<li><code>rotation: 180</code> turns the ball 180 degrees.</li>
		<li><code>duration: 1.2</code> makes the trip last 1.2 seconds. The default is 0.5 seconds.</li>
		<li>
			<code>repeat: -1</code> repeats with no limit. A positive number repeats that many times.
		</li>
		<li><code>yoyo: true</code> plays the tween back on each repeat.</li>
		<li>
			<code>ease: 'power1.inOut'</code> starts slow, speeds up, then slows down. Lesson 04 covers eases.
		</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: seconds, not milliseconds</span>
		<p>
			GSAP uses seconds for time. Use <code>0.5</code> for half a second. Do not use
			<code>500</code>.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change <code>y</code> to 20. Change <code>duration</code> to 0.4. Then set
			<code>repeat: 3</code> and remove <code>yoyo</code>. Run it again. What changed?
		</p>
	</div>
</LessonShell>

<style>
	.playground {
		position: relative;
		display: flex;
		min-height: 320px;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.ring {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 220px;
		height: 220px;
		border: 2px dashed rgba(23, 23, 23, 0.28);
		border-radius: 999px;
		transform: translate(-50%, -50%);
	}

	.ball {
		position: relative;
		z-index: 2;
		width: 92px;
		height: 92px;
		border: 3px solid var(--color-ink);
		border-radius: 999px;
		background: radial-gradient(circle at 34% 28%, #d8ffe2, #0ae448 58%, #05a832);
		box-shadow:
			inset -10px -12px 0 rgba(0, 0, 0, 0.09),
			0 10px 0 rgba(23, 23, 23, 0.12);
	}

	.eye {
		position: absolute;
		top: 31px;
		width: 8px;
		height: 12px;
		border-radius: 999px;
		background-color: var(--color-ink);
	}

	.eye-left {
		left: 28px;
	}

	.eye-right {
		right: 28px;
	}

	.smile {
		position: absolute;
		bottom: 23px;
		left: 50%;
		width: 24px;
		height: 12px;
		border-bottom: 3px solid var(--color-ink);
		border-radius: 0 0 24px 24px;
		transform: translateX(-50%);
	}

	.replay {
		position: absolute;
		bottom: 10px;
		left: 12px;
	}

	.replay:hover {
		transform: translateY(-1px);
	}

	.replay:active {
		transform: translate(2px, 2px);
	}
</style>
