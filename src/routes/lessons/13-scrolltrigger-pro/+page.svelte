<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(ScrollTrigger);

	const lesson = getLesson('13-scrolltrigger-pro');

	const chapters = [
		{
			title: 'Snap',
			text: 'The scroll settles on a label instead of a random point.',
			color: '#0ae448'
		},
		{
			title: 'Labels',
			text: 'Labels give the timeline named stops. Snap can use them.',
			color: '#ffb800'
		},
		{
			title: 'Progress',
			text: 'Read the scroll progress and update the interface.',
			color: '#00b3ff'
		},
		{
			title: 'Ship',
			text: 'Add markers while you build. Remove them before you ship.',
			color: '#ff5c7c'
		}
	];

	let stage = $state<HTMLDivElement | null>(null);
	let scrollBox = $state<HTMLDivElement | null>(null);
	let activeChapter = $state(0);
	let progressValue = $state(0);

	const currentChapter = $derived(chapters[activeChapter]);

	onMount(() => {
		if (stage === null || scrollBox === null) {
			return;
		}

		const chaptersTrack = stage.querySelector<HTMLElement>('.chapters');

		if (chaptersTrack === null) {
			return;
		}

		const context = gsap.context(() => {
			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: chaptersTrack,
					scroller: scrollBox,
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
					snap: {
						snapTo: 'labels',
						duration: { min: 0.2, max: 0.7 },
						delay: 0.1,
						directional: false,
						ease: 'power1.inOut'
					},
					onUpdate: function (self) {
						progressValue = self.progress;
						activeChapter = Math.round(self.progress * (chapters.length - 1));
					}
				}
			});

			timeline.addLabel('chapter-1', 0);
			timeline.to('.rail-fill', { height: '100%', duration: 3, ease: 'none' }, 0);
			timeline.addLabel('chapter-2', 1);
			timeline.addLabel('chapter-3', 2);
			timeline.addLabel('chapter-4', 3);

			ScrollTrigger.refresh();
		}, stage);

		return () => context.revert();
	});

	function goToChapter(index: number): void {
		if (stage === null || scrollBox === null) {
			return;
		}

		const chapterElements = stage.querySelectorAll<HTMLElement>('.chapter');

		if (index < 0 || index >= chapterElements.length) {
			return;
		}

		const chapter = chapterElements[index];
		const scrollBoxRect = scrollBox.getBoundingClientRect();
		const chapterRect = chapter.getBoundingClientRect();
		const targetTop = scrollBox.scrollTop + chapterRect.top - scrollBoxRect.top;

		scrollBox.scrollTo({ top: targetTop, behavior: 'smooth' });
	}

	const snippet = `
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: '.chapters',
    scroller: '.scroll-box',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    snap: {
      snapTo: 'labels',
      duration: { min: 0.2, max: 0.7 },
      delay: 0.1,
      directional: false,
      ease: 'power1.inOut'
    },
    onUpdate: function (self) {
      progressValue = self.progress;
    }
  }
});

timeline.addLabel('chapter-1', 0);
timeline.to('.rail-fill', { height: '100%', duration: 3, ease: 'none' }, 0);
timeline.addLabel('chapter-2', 1);
timeline.addLabel('chapter-3', 2);
timeline.addLabel('chapter-4', 3);
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Scroll a little and let go. The box snaps to a chapter.">
		<div class="pro-wrap" bind:this={stage}>
			<div class="pro-top">
				<div class="chapter-badge">
					<span class="badge-number">{activeChapter + 1}</span>
					<span>
						<strong>{currentChapter.title}</strong>
						<small>{Math.round(progressValue * 100)}% scroll</small>
					</span>
				</div>

				<div class="jump-buttons">
					{#each chapters as chapter, index (chapter.title)}
						<button
							class="btn btn-sm"
							class:btn-primary={activeChapter === index}
							type="button"
							title={chapter.title}
							onclick={() => goToChapter(index)}
						>
							{index + 1}
						</button>
					{/each}
				</div>
			</div>

			<div class="pro-layout">
				<div class="scroll-box" bind:this={scrollBox}>
					<div class="chapters">
						{#each chapters as chapter, index (chapter.title)}
							<section class="chapter" style={`background: ${chapter.color}`}>
								<span class="chapter-number">0{index + 1}</span>
								<h3>{chapter.title}</h3>
								<p>{chapter.text}</p>
							</section>
						{/each}
					</div>
				</div>

				<div class="rail" aria-hidden="true">
					<div class="rail-fill"></div>
				</div>
			</div>

			<div class="progress-track" aria-hidden="true">
				<div class="progress-fill" style={`width: ${progressValue * 100}%`}></div>
			</div>
		</div>
	</DemoStage>

	<h2>Snap to a stop</h2>
	<p>
		<code>snap</code> moves the scroll to the nearest snap point after the user stops scrolling.
		That makes a section feel like a slide deck. <code>snapTo: 'labels'</code> uses the labels on the
		timeline.
	</p>

	<p>
		The <code>duration</code> object sets the shortest and longest snap time. A short trip takes
		less time. A long trip can take longer. The <code>delay</code> waits for the scroll to stop
		before the snap starts. This demo sets <code>directional: false</code> so it always moves to the
		nearest chapter. With the default <code>true</code>, snap follows the scroll direction.
	</p>

	<CodeBlock code={snippet} title="Snap, labels, and progress" />

	<h2>Callbacks on scroll</h2>
	<p>
		<code>onUpdate</code> runs when the scroll progress changes. This demo uses it to update the chapter
		badge and the progress bar. Keep the work small, because it can run on every scroll tick.
	</p>

	<h2>Good places for snap</h2>
	<ul>
		<li>A short story with three or four full-screen chapters.</li>
		<li>A product tour with one feature per screen.</li>
		<li>A slide deck that users control with the scrollbar.</li>
	</ul>

	<div class="callout callout-warn">
		<span class="callout-title">Snap can fight the user</span>
		<p>
			Do not use snap on long pages with normal reading content. It can feel heavy and can interrupt
			the reader. Use it when each stop is a complete idea.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change <code>snapTo: 'labels'</code> to <code>snapTo: [0, 0.5, 1]</code>. Then remove
			<code>directional: false</code> and snap in both directions. Compare the two behaviors.
		</p>
	</div>
</LessonShell>

<style>
	.pro-wrap {
		min-height: 450px;
	}

	.pro-top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.6rem;
	}

	.chapter-badge {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.badge-number {
		display: flex;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--color-ink);
		border-radius: 0.6rem;
		background-color: var(--color-brand);
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 800;
	}

	.chapter-badge strong {
		display: block;
		font-family: var(--font-display);
		font-size: 0.95rem;
		line-height: 1.1;
	}

	.chapter-badge small {
		display: block;
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.58rem;
	}

	.jump-buttons {
		display: flex;
		gap: 0.35rem;
	}

	.pro-layout {
		display: flex;
		gap: 0.6rem;
	}

	.scroll-box {
		height: 330px;
		flex: 1;
		overflow-y: auto;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #fffdf8;
		scrollbar-width: thin;
	}

	.chapters {
		position: relative;
	}

	.chapter {
		display: flex;
		height: 330px;
		flex-direction: column;
		justify-content: center;
		border-bottom: 2px solid var(--color-ink);
		padding: 1.4rem;
	}

	.chapter:last-child {
		border-bottom: 0;
	}

	.chapter-number {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 500;
		letter-spacing: 0.08em;
	}

	.chapter h3 {
		margin: 0.3rem 0 0;
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 800;
		line-height: 1;
	}

	.chapter p {
		max-width: 260px;
		margin-top: 0.5rem;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.rail {
		position: relative;
		width: 18px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
	}

	.rail-fill {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		height: 0;
		background-color: var(--color-ink);
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
		background-color: var(--color-grape);
	}
</style>
