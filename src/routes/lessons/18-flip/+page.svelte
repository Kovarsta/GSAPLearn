<script lang="ts">
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import { Flip } from 'gsap/Flip';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(Flip);

	const lesson = getLesson('18-flip');

	const items = [
		{ emoji: '🌱', title: 'Sprout', tag: 'grow' },
		{ emoji: '🛸', title: 'UFO', tag: 'fly' },
		{ emoji: '🍄', title: 'Mushroom', tag: 'pop' },
		{ emoji: '🪐', title: 'Planet', tag: 'spin' },
		{ emoji: '🦊', title: 'Fox', tag: 'sneak' },
		{ emoji: '⚡', title: 'Bolt', tag: 'zap' }
	];

	let cardsContainer = $state<HTMLDivElement | null>(null);
	let layout = $state('grid');
	let flipAnimation: gsap.core.Timeline | null = null;

	onMount(() => {
		return () => {
			if (flipAnimation !== null) {
				flipAnimation.kill();
			}
		};
	});

	async function toggleLayout(): Promise<void> {
		if (cardsContainer === null) {
			return;
		}

		const cards = cardsContainer.querySelectorAll<HTMLElement>('.flip-card');
		const state = Flip.getState(cards);

		if (layout === 'grid') {
			layout = 'list';
		} else {
			layout = 'grid';
		}

		await tick();

		flipAnimation = Flip.from(state, {
			duration: 0.6,
			ease: 'power2.inOut',
			absolute: true,
			stagger: 0.04
		});
	}

	const snippet = `
import { tick } from 'svelte';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

async function toggleLayout() {
  const cards = document.querySelectorAll('.flip-card');

  // First: save where every card is now.
  const state = Flip.getState(cards);

  // Last: change the layout.
  if (layout === 'grid') {
    layout = 'list';
  } else {
    layout = 'grid';
  }

  await tick();

  // Invert and Play: animate from the old state to the new state.
  Flip.from(state, {
    duration: 0.6,
    ease: 'power2.inOut',
    absolute: true,
    stagger: 0.04
  });
}
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="The DOM changes in one step. Flip animates between the old and new positions.">
		<div class="flip-wrap">
			<button class="btn btn-primary btn-sm" type="button" onclick={toggleLayout}>
				{layout === 'grid' ? 'Switch to list' : 'Switch to grid'}
			</button>

			<div
				class="cards"
				class:is-grid={layout === 'grid'}
				class:is-list={layout === 'list'}
				bind:this={cardsContainer}
			>
				{#each items as item (item.title)}
					<article class="flip-card">
						<span class="flip-emoji">{item.emoji}</span>
						<span class="flip-copy">
							<strong>{item.title}</strong>
							<small>{item.tag}</small>
						</span>
					</article>
				{/each}
			</div>
		</div>
	</DemoStage>

	<h2>FLIP in four words</h2>
	<p>
		FLIP means <strong>First, Last, Invert, Play</strong>. Save the current positions. Change the
		layout. Measure the new positions. Then animate from the old positions to the new ones.
	</p>

	<p>
		The Flip plugin does the hard math. You call <code>Flip.getState()</code> before the change and
		<code>Flip.from()</code> after the change.
	</p>

	<CodeBlock code={snippet} title="Grid to list" />

	<h2>The steps</h2>
	<ol>
		<li>
			<code>Flip.getState(cards)</code> records the position, size, rotation, and opacity of each card.
		</li>
		<li>
			Change the DOM or the CSS. In Svelte, change the state and wait for <code>tick()</code>.
		</li>
		<li>
			<code>Flip.from(state, vars)</code> animates each card from the old state to the new state.
		</li>
	</ol>

	<h2>Useful Flip settings</h2>
	<ul>
		<li>
			<code>absolute: true</code> takes the cards out of the normal flow during the animation. This prevents
			jumps.
		</li>
		<li><code>stagger: 0.04</code> starts each card a little later.</li>
		<li><code>duration</code> and <code>ease</code> work like any other tween.</li>
		<li><code>nested: true</code> helps when a parent element also changes size or position.</li>
	</ul>

	<div class="callout callout-warn">
		<span class="callout-title">Wait for the DOM</span>
		<p>
			In Svelte, the DOM changes after the state update. Use <code>await tick()</code> before
			<code>Flip.from()</code>. Without it, Flip measures the old layout.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add a "Shuffle" button. Save the state, reorder the items array with
			<code>items.sort(() =&gt; Math.random() - 0.5)</code>, wait for <code>tick()</code>, then call
			<code>Flip.from()</code>. Keep the cards in place during the sort.
		</p>
	</div>
</LessonShell>

<style>
	.flip-wrap {
		display: flex;
		min-height: 330px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.1rem;
	}

	.cards {
		position: relative;
		width: 100%;
	}

	.cards.is-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem;
	}

	.cards.is-list {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.flip-card {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		border: 2px solid var(--color-ink);
		border-radius: 0.9rem;
		background-color: #fffdf8;
		padding: 0.7rem;
		box-shadow: 3px 3px 0 var(--color-ink);
	}

	.is-grid .flip-card {
		flex-direction: column;
		align-items: flex-start;
		min-height: 118px;
	}

	.flip-emoji {
		font-size: 1.7rem;
		line-height: 1;
	}

	.flip-copy {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.flip-copy strong {
		font-family: var(--font-display);
		font-size: 0.95rem;
	}

	.flip-copy small {
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.55rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	@media (min-width: 520px) {
		.is-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
