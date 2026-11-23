<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('06-timelines');

	let stage = $state<HTMLDivElement | null>(null);
	let timeline: gsap.core.Timeline | null = null;

	onMount(() => {
		if (stage === null) {
			return;
		}

		const context = gsap.context(() => {
			timeline = gsap.timeline({
				defaults: {
					duration: 0.7,
					ease: 'power2.out'
				}
			});

			timeline.from('.sun', { y: 90, opacity: 0, scale: 0.6 });
			timeline.from('.cloud', { x: -90, opacity: 0 });
			timeline.from('.rocket', { x: -130, y: 30, rotation: -15 });
			timeline.from('.message', { y: 24, opacity: 0 });
		}, stage);

		if (timeline !== null) {
			timeline.play();
		}

		return () => context.revert();
	});

	function replay(): void {
		if (timeline === null) {
			return;
		}

		timeline.restart();
	}

	const snippet = `
const timeline = gsap.timeline({
  defaults: {
    duration: 0.7,
    ease: 'power2.out'
  }
});

timeline.from('.sun', { y: 90, opacity: 0, scale: 0.6 });
timeline.from('.cloud', { x: -90, opacity: 0 });
timeline.from('.rocket', { x: -130, y: 30, rotation: -15 });
timeline.from('.message', { y: 24, opacity: 0 });
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="The tweens run in the order that you add them.">
		<div class="scene-wrap">
			<div class="scene" bind:this={stage}>
				<div class="sun"></div>
				<div class="cloud">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<div class="rocket">🚀</div>
				<p class="message">Good morning, world.</p>
			</div>

			<button class="btn btn-primary btn-sm replay" type="button" onclick={replay}>Replay</button>
		</div>
	</DemoStage>

	<h2>A container for tweens</h2>
	<p>
		A timeline holds tweens and plays them in order. Each new tween starts when the one before it
		ends. You do not need to calculate delays.
	</p>

	<p>
		The timeline also has its own playhead. You can pause it, reverse it, or jump to any point.
		Lesson 08 covers those controls.
	</p>

	<CodeBlock code={snippet} title="A short scene" />

	<h2>Why timelines are better than delays</h2>
	<ul>
		<li>You can reorder a scene by moving one line.</li>
		<li>You can change the speed of the whole scene with one setting.</li>
		<li>You can nest timelines inside other timelines.</li>
		<li>You can attach a timeline to ScrollTrigger as one unit.</li>
	</ul>

	<h2>Defaults save typing</h2>
	<p>
		The <code>defaults</code> object gives every child tween the same settings. In this scene, every
		tween gets <code>duration: 0.7</code> and <code>ease: 'power2.out'</code>. A child tween can
		still override a default when it needs a different value.
	</p>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: name the pieces</span>
		<p>
			Use clear names such as <code>introTimeline</code> or <code>cardTimeline</code>. A short name
			such as <code>tl</code> is common in examples, but longer names are easier to read.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add a star element to the scene. Animate it after the message with
			<code>timeline.from('.star', &#123; scale: 0, rotation: -90 &#125;)</code>. Then move that
			line before the rocket line. What changed?
		</p>
	</div>
</LessonShell>

<style>
	.scene-wrap {
		display: flex;
		min-height: 340px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.scene {
		position: relative;
		width: min(100%, 520px);
		height: 280px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 1.25rem;
		background: linear-gradient(180deg, #cdeeff 0%, #e8fbff 58%, #d8ffe2 100%);
		box-shadow: 5px 5px 0 var(--color-ink);
	}

	.sun {
		position: absolute;
		top: 36px;
		right: 62px;
		width: 72px;
		height: 72px;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background: radial-gradient(circle at 35% 30%, #fff3b8, #ffb800 65%, #ff8a00);
		box-shadow: 0 0 0 12px rgba(255, 184, 0, 0.22);
	}

	.cloud {
		position: absolute;
		top: 64px;
		left: 60px;
		width: 96px;
		height: 34px;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
	}

	.cloud span {
		position: absolute;
		bottom: 18px;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
	}

	.cloud span:nth-child(1) {
		left: 12px;
		width: 34px;
		height: 34px;
	}

	.cloud span:nth-child(2) {
		left: 38px;
		width: 46px;
		height: 46px;
	}

	.cloud span:nth-child(3) {
		left: 70px;
		width: 26px;
		height: 26px;
	}

	.rocket {
		position: absolute;
		bottom: 84px;
		left: 70px;
		font-size: 2.6rem;
		line-height: 1;
	}

	.message {
		position: absolute;
		right: 24px;
		bottom: 22px;
		left: 24px;
		color: var(--color-ink);
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		text-align: center;
	}

	.replay {
		flex-shrink: 0;
	}

	@media (max-width: 520px) {
		.sun {
			right: 26px;
		}

		.rocket {
			left: 34px;
		}
	}
</style>
