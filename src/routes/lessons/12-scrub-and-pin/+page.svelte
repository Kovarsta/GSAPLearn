<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(ScrollTrigger);

	const lesson = getLesson('12-scrub-and-pin');

	let stage = $state<HTMLDivElement | null>(null);
	let progressValue = $state(0);

	onMount(() => {
		if (stage === null) {
			return;
		}

		const scrollBox = stage.querySelector<HTMLElement>('.scroll-box');
		const pinSection = stage.querySelector<HTMLElement>('.pin-section');

		if (scrollBox === null || pinSection === null) {
			return;
		}

		const context = gsap.context(() => {
			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: pinSection,
					scroller: scrollBox,
					start: 'top top',
					end: '+=520',
					scrub: 1,
					pin: true,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					onUpdate: function (self) {
						progressValue = self.progress;
					}
				}
			});

			timeline.to(
				'.scrub-box',
				{
					x: function () {
						return Math.max(70, pinSection.clientWidth - 140);
					},
					rotation: 180,
					borderRadius: '999px',
					backgroundColor: '#ff5c7c',
					ease: 'none'
				},
				0
			);

			timeline.to(
				'.scrub-copy',
				{
					y: -34,
					opacity: 0,
					ease: 'none'
				},
				0
			);

			ScrollTrigger.refresh();
		}, stage);

		return () => context.revert();
	});

	const snippet = `
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: '.pin-section',
    scroller: '.scroll-box',
    start: 'top top',
    end: '+=520',
    scrub: 1,
    pin: true
  }
});

timeline.to('.scrub-box', {
  x: 220,
  rotation: 180,
  borderRadius: '999px',
  backgroundColor: '#ff5c7c',
  ease: 'none'
});

timeline.to('.scrub-copy', {
  y: -34,
  opacity: 0,
  ease: 'none'
});
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Scroll inside the box. The panel stays pinned while the box moves.">
		<div class="scrub-wrap" bind:this={stage}>
			<div class="scrub-meta">
				<span>↓ Scroll to scrub the timeline</span>
				<span>{Math.round(progressValue * 100)}%</span>
			</div>

			<div class="scroll-box">
				<div class="scroll-intro">
					<p class="intro-title">Ready to pin</p>
					<p class="intro-copy">Scroll down to start the scrub.</p>
				</div>

				<section class="pin-section">
					<p class="scrub-copy">Scrub me</p>
					<div class="scrub-box"></div>
				</section>

				<div class="scroll-end">
					<p>The pin released. Scroll up to run it backward.</p>
				</div>
			</div>

			<div class="progress-track" aria-hidden="true">
				<div class="progress-fill" style={`width: ${progressValue * 100}%`}></div>
			</div>
		</div>
	</DemoStage>

	<h2>Let the scrollbar control time</h2>
	<p>
		<code>scrub</code> connects the scroll position to the timeline progress. When you scroll down, the
		timeline moves forward. When you scroll up, it moves backward. The user controls the playhead.
	</p>

	<p>
		<code>pin</code> holds the trigger element in place while the timeline is active. The rest of the
		page keeps its normal flow.
	</p>

	<CodeBlock code={snippet} title="A scrubbed, pinned timeline" />

	<h2>What each setting does</h2>
	<ul>
		<li>
			<code>scrub: 1</code> means the animation catches up to the scrollbar in about one second.
			<code>scrub: true</code> is a direct link with no smoothing.
		</li>
		<li><code>pin: true</code> holds the trigger element for the length of the active zone.</li>
		<li>
			<code>end: '+=520'</code> makes the active zone 520 pixels long. The number controls how much scroll
			distance the animation uses.
		</li>
		<li>
			<code>ease: 'none'</code> keeps the motion linear. This is the normal choice for scrubbed timelines.
		</li>
		<li><code>invalidateOnRefresh: true</code> recalculates function-based values on resize.</li>
	</ul>

	<div class="callout callout-warn">
		<span class="callout-title">Pin needs space</span>
		<p>
			A pinned section needs scroll distance before and after it. Without that space, the pin cannot
			move and the animation can look stuck.
		</p>
	</div>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: scrub is not a scroll listener</span>
		<p>
			Do not update an animation in a scroll event. ScrollTrigger syncs to the browser's scroll
			position and avoids extra work on each frame.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change <code>scrub: 1</code> to <code>scrub: true</code>. Then change
			<code>end: '+=520'</code> to <code>end: '+=800'</code>. How does the speed feel? Add a
			<code>scale: 1.4</code> to the box.
		</p>
	</div>
</LessonShell>

<style>
	.scrub-wrap {
		min-height: 420px;
	}

	.scrub-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.55rem;
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.62rem;
	}

	.scroll-box {
		height: 370px;
		overflow-y: auto;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #fffdf8;
		scrollbar-width: thin;
	}

	.scroll-intro {
		display: flex;
		min-height: 90px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.intro-title {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 800;
	}

	.intro-copy {
		color: var(--color-muted);
		font-size: 0.72rem;
	}

	.pin-section {
		position: relative;
		display: flex;
		min-height: 300px;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-top: 2px solid var(--color-ink);
		border-bottom: 2px solid var(--color-ink);
		background-color: #d8ffe2;
	}

	.scrub-copy {
		position: absolute;
		top: 24px;
		left: 0;
		right: 0;
		color: var(--color-ink);
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-weight: 800;
		text-align: center;
	}

	.scrub-box {
		position: absolute;
		bottom: 54px;
		left: 30px;
		width: 72px;
		height: 72px;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: var(--color-brand);
		box-shadow: 4px 4px 0 var(--color-ink);
	}

	.scroll-end {
		display: flex;
		min-height: 170px;
		align-items: center;
		justify-content: center;
		padding: 1.25rem;
		color: var(--color-muted);
		font-size: 0.78rem;
		line-height: 1.5;
		text-align: center;
	}

	.progress-track {
		height: 9px;
		margin-top: 0.55rem;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-pink);
	}
</style>
