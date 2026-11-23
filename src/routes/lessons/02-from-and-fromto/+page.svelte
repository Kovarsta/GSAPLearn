<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('02-from-and-fromto');

	let stage = $state<HTMLDivElement | null>(null);
	let animation: gsap.core.Tween | null = null;

	onMount(() => {
		playFrom();

		return () => {
			if (stage !== null) {
				gsap.killTweensOf(stage.querySelectorAll('.card-item'));
			}
		};
	});

	function playFrom(): void {
		if (stage === null) {
			return;
		}

		const cards = gsap.utils.toArray<HTMLElement>('.card-item', stage);

		if (animation !== null) {
			animation.kill();
		}

		gsap.set(cards, { backgroundColor: '#fffdf8', color: '#171717' });

		animation = gsap.from(cards, {
			y: 56,
			opacity: 0,
			duration: 0.7,
			stagger: 0.1,
			ease: 'power2.out'
		});
	}

	function playFromTo(): void {
		if (stage === null) {
			return;
		}

		const cards = gsap.utils.toArray<HTMLElement>('.card-item', stage);

		if (animation !== null) {
			animation.kill();
		}

		animation = gsap.fromTo(
			cards,
			{
				y: 40,
				scale: 0.75,
				rotation: -8,
				backgroundColor: '#fffdf8',
				color: '#171717'
			},
			{
				y: 0,
				scale: 1,
				rotation: 0,
				backgroundColor: '#0ae448',
				color: '#171717',
				duration: 0.7,
				stagger: 0.1,
				ease: 'back.out(1.6)'
			}
		);
	}

	const snippet = `
const cards = gsap.utils.toArray('.card-item');

// from: start at these values, end at the current state
gsap.from(cards, {
  y: 56,
  opacity: 0,
  duration: 0.7,
  stagger: 0.1,
  ease: 'power2.out'
});

// fromTo: set both the start and the end
gsap.fromTo(cards,
  { y: 40, scale: 0.75, rotation: -8 },
  {
    y: 0,
    scale: 1,
    rotation: 0,
    backgroundColor: '#0ae448',
    duration: 0.7,
    stagger: 0.1
  }
);
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Run both buttons and compare the start values.">
		<div class="demo-wrap">
			<div class="controls">
				<button class="btn btn-primary btn-sm" type="button" onclick={playFrom}>
					gsap.from()
				</button>
				<button class="btn btn-sm" type="button" onclick={playFromTo}>gsap.fromTo()</button>
			</div>

			<div class="card-row" bind:this={stage}>
				<div class="card-item">
					<span class="emoji">🌱</span>
					<span class="label">Start</span>
				</div>
				<div class="card-item">
					<span class="emoji">🚀</span>
					<span class="label">Move</span>
				</div>
				<div class="card-item">
					<span class="emoji">✨</span>
					<span class="label">Shine</span>
				</div>
			</div>
		</div>
	</DemoStage>

	<h2>Two directions, two methods</h2>
	<p>
		<code>gsap.to()</code> uses the current value as the start. <code>gsap.from()</code> does the opposite.
		It uses the current value as the end and animates from the values that you give it.
	</p>

	<p>
		<code>gsap.fromTo()</code> is the explicit version. You give the start values and the end values.
		Use it when the current state is not the state that you want to end on.
	</p>

	<CodeBlock code={snippet} title="from vs fromTo" />

	<h2>When to use each one</h2>
	<ul>
		<li>
			Use <code>gsap.from()</code> for a quick entrance. The element is already in its natural place.
		</li>
		<li>
			Use <code>gsap.fromTo()</code> when you need a known start state. For example, a card may already
			be green from an earlier animation.
		</li>
		<li>Use <code>gsap.to()</code> for the normal case. You know where the element must go.</li>
	</ul>

	<div class="callout callout-warn">
		<span class="callout-title">Watch the current state</span>
		<p>
			A <code>from()</code> tween ends at the current value. If another animation changed that
			value, <code>from()</code> uses the new value. <code>fromTo()</code> does not guess.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Make a new button with <code>fromTo()</code>. Move the cards from <code>x: -120</code> to
			<code>x: 0</code>. Add <code>opacity: 0</code> at the start and <code>opacity: 1</code> at the end.
		</p>
	</div>
</LessonShell>

<style>
	.demo-wrap {
		min-height: 250px;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.card-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
	}

	.card-item {
		display: flex;
		width: 110px;
		height: 140px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #fffdf8;
		box-shadow: 4px 4px 0 var(--color-ink);
	}

	.emoji {
		font-size: 2rem;
		line-height: 1;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
