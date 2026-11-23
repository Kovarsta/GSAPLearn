<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { Observer } from 'gsap/Observer';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(Observer);

	const lesson = getLesson('20-observer');

	const slides = [
		{ emoji: '🌊', title: 'Wheel down', text: 'Go to the next slide.', color: '#00b3ff' },
		{
			emoji: '👆',
			title: 'Swipe up',
			text: 'The same gesture on a touch screen.',
			color: '#0ae448'
		},
		{
			emoji: '🎯',
			title: 'One API',
			text: 'Observer normalizes wheel, touch, and pointer input.',
			color: '#ffb800'
		}
	];

	let deck = $state<HTMLDivElement | null>(null);
	let track = $state<HTMLDivElement | null>(null);
	let observer: Observer | null = null;
	let index = $state(0);
	let isAnimating = false;

	onMount(() => {
		if (deck === null) {
			return;
		}

		observer = Observer.create({
			target: deck,
			type: 'wheel,touch',
			onDown: nextSlide,
			onUp: previousSlide,
			tolerance: 10,
			preventDefault: true,
			wheelSpeed: 1
		});

		return () => {
			if (observer !== null) {
				observer.kill();
			}
		};
	});

	function goTo(nextIndex: number): void {
		if (track === null || isAnimating) {
			return;
		}

		let targetIndex = nextIndex;

		if (targetIndex < 0) {
			targetIndex = slides.length - 1;
		}

		if (targetIndex >= slides.length) {
			targetIndex = 0;
		}

		index = targetIndex;
		isAnimating = true;

		gsap.to(track, {
			xPercent: -100 * targetIndex,
			duration: 0.6,
			ease: 'power2.out',
			onComplete: function () {
				isAnimating = false;
			}
		});
	}

	function nextSlide(): void {
		goTo(index + 1);
	}

	function previousSlide(): void {
		goTo(index - 1);
	}

	const snippet = `
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

const observer = Observer.create({
  target: '.deck',
  type: 'wheel,touch',
  onDown: nextSlide,
  onUp: previousSlide,
  tolerance: 10,
  preventDefault: true
});

function goTo(nextIndex) {
  gsap.to('.track', {
    xPercent: -100 * nextIndex,
    duration: 0.6,
    ease: 'power2.out'
  });
}

// On cleanup:
// observer.kill();
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Scroll or swipe inside the deck. The arrow buttons also work.">
		<div class="observer-wrap">
			<div class="deck" bind:this={deck}>
				<div class="track" bind:this={track}>
					{#each slides as slide, slideIndex (slide.title)}
						<section class="slide" style={`background: ${slide.color}`}>
							<span class="slide-emoji">{slide.emoji}</span>
							<p class="slide-number">0{slideIndex + 1}</p>
							<h3>{slide.title}</h3>
							<p>{slide.text}</p>
						</section>
					{/each}
				</div>
			</div>

			<div class="deck-controls">
				<button
					class="btn btn-sm"
					type="button"
					onclick={previousSlide}
					aria-label="Previous slide"
				>
					←
				</button>

				<div class="dots">
					{#each slides as slide, slideIndex (slide.title)}
						<span class="dot" class:dot-active={index === slideIndex} title={slide.title}></span>
					{/each}
				</div>

				<button class="btn btn-sm" type="button" onclick={nextSlide} aria-label="Next slide">
					→
				</button>
			</div>
		</div>
	</DemoStage>

	<h2>One listener for every gesture</h2>
	<p>
		A wheel event and a touch swipe produce different data. Observer normalizes them. You get
		<code>onUp</code>, <code>onDown</code>, <code>onLeft</code>, and <code>onRight</code> without writing
		separate handlers.
	</p>

	<CodeBlock code={snippet} title="A slide deck with Observer" />

	<h2>The settings</h2>
	<ul>
		<li><code>target</code> is the element that listens for input.</li>
		<li>
			<code>type: 'wheel,touch'</code> selects the events. Add <code>pointer</code> for mouse drags.
		</li>
		<li>
			<code>onDown</code> fires when the user scrolls down or swipes down. <code>onUp</code> is the opposite.
		</li>
		<li>
			<code>tolerance</code> ignores small movements, so a tiny wheel tick does not change the slide.
		</li>
		<li>
			<code>preventDefault: true</code> stops the page from scrolling while the user interacts with the
			target.
		</li>
		<li>
			<code>lockAxis: true</code> locks to the first movement direction on touch and pointer input.
		</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: add a lock</span>
		<p>
			This demo ignores new input while a slide is moving. Without that guard, a fast wheel can skip
			several slides at once.
		</p>
	</div>

	<div class="callout callout-warn">
		<span class="callout-title">Think about the page</span>
		<p>
			If you prevent default on wheel, the user cannot scroll the page from that element. Use this
			pattern for a full-screen experience, not for normal article content.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change <code>type</code> to <code>'wheel,touch,pointer'</code>. Add
			<code>lockAxis: true</code> and use <code>onLeft</code> and <code>onRight</code> to move the deck
			sideways. Then add a fourth slide.
		</p>
	</div>
</LessonShell>

<style>
	.observer-wrap {
		display: flex;
		min-height: 370px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.85rem;
	}

	.deck {
		width: 100%;
		max-width: 560px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		box-shadow: 5px 5px 0 var(--color-ink);
		touch-action: none;
	}

	.track {
		display: flex;
		will-change: transform;
	}

	.slide {
		display: flex;
		min-width: 100%;
		height: 280px;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 1.5rem;
	}

	.slide-emoji {
		font-size: 2.6rem;
		line-height: 1;
	}

	.slide-number {
		margin-top: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
	}

	.slide h3 {
		margin: 0.15rem 0 0;
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 800;
		line-height: 1;
	}

	.slide p {
		max-width: 320px;
		margin-top: 0.4rem;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.deck-controls {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.dots {
		display: flex;
		gap: 0.35rem;
	}

	.dot {
		width: 9px;
		height: 9px;
		border: 1.5px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
	}

	.dot-active {
		background-color: var(--color-brand);
		transform: scale(1.2);
	}
</style>
