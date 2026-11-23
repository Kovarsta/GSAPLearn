<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(ScrollTrigger);

	const lesson = getLesson('11-scrolltrigger-basics');

	const cards = [
		{
			name: 'Trigger',
			emoji: '🎯',
			color: '#0ae448',
			text: 'The element that ScrollTrigger watches.'
		},
		{
			name: 'Start and end',
			emoji: '📏',
			color: '#ffb800',
			text: 'The two scroll positions that define the active zone.'
		},
		{
			name: 'Toggle actions',
			emoji: '🎛️',
			color: '#00b3ff',
			text: 'What happens on enter, leave, enter back, and leave back.'
		}
	];

	let stage = $state<HTMLDivElement | null>(null);
	let lastEvent = $state('Waiting for a scroll');
	let scrollProgress = $state(0);

	onMount(() => {
		if (stage === null) {
			return;
		}

		const scrollBox = stage.querySelector<HTMLElement>('.scroll-box');

		if (scrollBox === null) {
			return;
		}

		const context = gsap.context(() => {
			const revealCards = gsap.utils.toArray<HTMLElement>('.reveal-card', scrollBox);

			for (const card of revealCards) {
				const cardName = card.dataset.name;

				if (cardName === undefined) {
					continue;
				}

				gsap.from(card, {
					y: 46,
					autoAlpha: 0,
					duration: 0.7,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: card,
						scroller: scrollBox,
						start: 'top 88%',
						end: 'top 35%',
						toggleActions: 'play none none reverse',
						onEnter: function () {
							lastEvent = 'Entered: ' + cardName;
						},
						onLeave: function () {
							lastEvent = 'Left: ' + cardName;
						},
						onEnterBack: function () {
							lastEvent = 'Entered back: ' + cardName;
						},
						onLeaveBack: function () {
							lastEvent = 'Left back: ' + cardName;
						}
					}
				});
			}

			ScrollTrigger.create({
				trigger: scrollBox,
				scroller: scrollBox,
				start: 0,
				end: 'max',
				onUpdate: function (self) {
					scrollProgress = self.progress;
				}
			});

			ScrollTrigger.refresh();
		}, stage);

		return () => context.revert();
	});

	const snippet = `
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scrollBox = document.querySelector('.scroll-box');
const cards = gsap.utils.toArray('.reveal-card');

for (const card of cards) {
  gsap.from(card, {
    y: 46,
    autoAlpha: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,
      scroller: scrollBox,
      start: 'top 88%',
      end: 'top 35%',
      toggleActions: 'play none none reverse'
    }
  });
}
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Scroll inside the box. Then scroll back up.">
		<div class="scroll-wrap" bind:this={stage}>
			<div class="scroll-meta">
				<span class="scroll-hint">↓ Scroll inside this box</span>
				<span class="event">{lastEvent}</span>
			</div>

			<div class="scroll-box">
				<div class="scroll-intro">
					<p class="intro-title">Scroll down</p>
					<p class="intro-copy">Each card has its own ScrollTrigger.</p>
				</div>

				{#each cards as card (card.name)}
					<article class="reveal-card" data-name={card.name}>
						<span class="card-icon" style={`background: ${card.color}`}>{card.emoji}</span>
						<div>
							<h3>{card.name}</h3>
							<p>{card.text}</p>
						</div>
					</article>
				{/each}

				<div class="scroll-end">
					<p>You reached the bottom. Scroll back up to reverse the cards.</p>
				</div>
			</div>

			<div class="scroll-progress" aria-hidden="true">
				<div class="scroll-progress-fill" style={`width: ${scrollProgress * 100}%`}></div>
			</div>
		</div>
	</DemoStage>

	<h2>Hook an animation to scroll</h2>
	<p>
		ScrollTrigger is a plugin. It watches the scroll position and controls an animation. Register
		the plugin one time before you use it.
	</p>

	<CodeBlock code={snippet} title="A basic reveal" />

	<h2>The four settings that matter first</h2>
	<ul>
		<li><code>trigger</code> is the element that ScrollTrigger watches.</li>
		<li>
			<code>start</code> is the scroll position where the animation starts. Here, the top of the card
			must reach 88 percent of the scroller height.
		</li>
		<li><code>end</code> is the scroll position where the active zone ends.</li>
		<li>
			<code>toggleActions</code> controls the four events in this order: enter, leave, enter back, leave
			back.
		</li>
	</ul>

	<p>
		The default scroller is the window. This demo uses a small scroll box, so it passes that box
		with <code>scroller</code>. The same settings work for the page.
	</p>

	<h2>Toggle actions in plain words</h2>
	<p><code>toggleActions: 'play none none reverse'</code> means:</p>
	<ol>
		<li>When the trigger enters, play the animation.</li>
		<li>When it leaves at the end, do nothing.</li>
		<li>When it enters again from the end, do nothing.</li>
		<li>When it leaves at the start, reverse the animation.</li>
	</ol>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: markers help you debug</span>
		<p>
			Add <code>markers: true</code> to a ScrollTrigger to see the start and end lines. Remove the markers
			before you ship.
		</p>
	</div>

	<div class="callout callout-warn">
		<span class="callout-title">Refresh after layout changes</span>
		<p>
			ScrollTrigger calculates positions when it starts. If images, fonts, or content change the
			layout, call <code>ScrollTrigger.refresh()</code>. Then the start and end values are correct.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change <code>start</code> to <code>'top 70%'</code>. Then change
			<code>toggleActions</code> to <code>'play pause resume reset'</code>. Scroll slowly and read
			the event text above the box.
		</p>
	</div>
</LessonShell>

<style>
	.scroll-wrap {
		min-height: 400px;
	}

	.scroll-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.63rem;
		color: var(--color-muted);
	}

	.scroll-hint {
		color: var(--color-ink);
		font-weight: 500;
	}

	.scroll-box {
		height: 330px;
		overflow-y: auto;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #fffdf8;
		padding: 0.9rem;
		scrollbar-width: thin;
	}

	.scroll-intro {
		display: flex;
		min-height: 96px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.intro-title {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 800;
	}

	.intro-copy {
		color: var(--color-muted);
		font-size: 0.75rem;
	}

	.reveal-card {
		display: flex;
		align-items: flex-start;
		gap: 0.8rem;
		margin-bottom: 0.9rem;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #fffdf8;
		padding: 1rem;
		box-shadow: 3px 3px 0 var(--color-ink);
	}

	.card-icon {
		display: flex;
		width: 42px;
		height: 42px;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--color-ink);
		border-radius: 0.7rem;
		font-size: 1.25rem;
	}

	.reveal-card h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 800;
	}

	.reveal-card p {
		margin: 0.15rem 0 0;
		color: var(--color-muted);
		font-size: 0.82rem;
		line-height: 1.5;
	}

	.scroll-end {
		display: flex;
		min-height: 150px;
		align-items: center;
		justify-content: center;
		padding: 1.25rem;
		color: var(--color-muted);
		font-size: 0.78rem;
		line-height: 1.5;
		text-align: center;
	}

	.scroll-progress {
		height: 9px;
		margin-top: 0.6rem;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
	}

	.scroll-progress-fill {
		height: 100%;
		background-color: var(--color-brand);
	}
</style>
