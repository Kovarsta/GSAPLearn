<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('03-targets-and-properties');

	let stage = $state<HTMLDivElement | null>(null);

	onMount(() => {
		return () => {
			if (stage !== null) {
				gsap.killTweensOf(stage.querySelectorAll('.target'));
			}
		};
	});

	function getTargets(): HTMLElement[] {
		if (stage === null) {
			return [];
		}

		return gsap.utils.toArray<HTMLElement>('.target', stage);
	}

	function moveOne(): void {
		const targets = getTargets();

		if (targets.length === 0) {
			return;
		}

		gsap.to(targets[0], { x: 64, duration: 0.5, ease: 'power2.out' });
	}

	function moveAll(): void {
		const targets = getTargets();

		gsap.to(targets, {
			y: -28,
			rotation: 8,
			duration: 0.45,
			stagger: 0.08,
			yoyo: true,
			repeat: 1,
			ease: 'power2.inOut'
		});
	}

	function styleAll(): void {
		const targets = getTargets();

		gsap.to(targets, {
			backgroundColor: '#0ae448',
			borderRadius: '2rem',
			scale: 0.9,
			duration: 0.5,
			stagger: 0.06,
			ease: 'back.out(1.5)'
		});
	}

	function blinkAll(): void {
		const targets = getTargets();

		gsap.to(targets, {
			autoAlpha: 0.2,
			duration: 0.3,
			stagger: 0.08,
			yoyo: true,
			repeat: 1
		});
	}

	function resetAll(): void {
		const targets = getTargets();

		gsap.to(targets, {
			x: 0,
			y: 0,
			rotation: 0,
			scale: 1,
			autoAlpha: 1,
			backgroundColor: '#fffdf8',
			borderRadius: '1rem',
			duration: 0.5,
			ease: 'power2.out'
		});
	}

	const snippet = `
const targets = gsap.utils.toArray('.target');

gsap.to(targets, {
  x: 64,
  y: -28,
  rotation: 8,
  scale: 0.9,
  autoAlpha: 1,
  backgroundColor: '#0ae448',
  borderRadius: '2rem',
  duration: 0.6,
  stagger: 0.08
});
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Each button uses a different target or property set.">
		<div class="demo-wrap" bind:this={stage}>
			<div class="target-row">
				<div class="target">
					<span class="emoji">🎈</span>
					<span class="name">one</span>
				</div>
				<div class="target">
					<span class="emoji">🎲</span>
					<span class="name">two</span>
				</div>
				<div class="target">
					<span class="emoji">🧩</span>
					<span class="name">three</span>
				</div>
			</div>

			<div class="controls">
				<button class="btn btn-sm" type="button" onclick={moveOne}>Move one</button>
				<button class="btn btn-sm" type="button" onclick={moveAll}>Move all</button>
				<button class="btn btn-sm" type="button" onclick={styleAll}>Style all</button>
				<button class="btn btn-sm" type="button" onclick={blinkAll}>Blink</button>
				<button class="btn btn-sm btn-primary" type="button" onclick={resetAll}>Reset</button>
			</div>
		</div>
	</DemoStage>

	<h2>Pick a target</h2>
	<p>
		The first argument of a tween is the target. GSAP accepts a selector string, a DOM element, an
		array of elements, or a list of elements from the DOM.
	</p>

	<ul>
		<li>
			<code>'.target'</code> selects every matching element. GSAP uses
			<code>querySelectorAll()</code>.
		</li>
		<li><code>element</code> animates one element that you already have.</li>
		<li><code>[elementA, elementB]</code> animates a list in order.</li>
		<li>
			<code>gsap.utils.toArray('.target', stage)</code> returns a clean array and limits the search to
			one parent.
		</li>
	</ul>

	<h2>Animate the transform, not the layout</h2>
	<p>
		GSAP maps <code>x</code>, <code>y</code>, <code>rotation</code>, <code>scale</code>, and
		<code>skew</code> to CSS transforms. Transforms are fast. They do not push other elements around the
		page.
	</p>

	<p>
		Use <code>x</code> and <code>y</code> instead of <code>left</code> and <code>top</code>. Use
		<code>autoAlpha</code> instead of <code>opacity</code> when an element must also become
		<code>visibility: hidden</code> at zero opacity.
	</p>

	<CodeBlock code={snippet} title="Many targets, many properties" />

	<h2>Property names in GSAP</h2>
	<ul>
		<li><code>backgroundColor</code> uses camelCase, not <code>background-color</code>.</li>
		<li><code>borderRadius</code> is the same idea. Most CSS properties use camelCase.</li>
		<li>
			<code>x: 64</code> moves 64 pixels to the right. <code>xPercent: 50</code> moves by 50 percent of
			the element width.
		</li>
		<li>
			<code>autoAlpha: 0</code> fades out and hides. <code>autoAlpha: 1</code> shows and fades in.
		</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: scoped selectors</span>
		<p>
			Selector strings search the whole document. In a component, pass a parent to
			<code>gsap.utils.toArray()</code> or use <code>gsap.context()</code> with a scope. Lesson 10 shows
			the full pattern.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add a button that moves only the middle target with <code>xPercent: -50</code>. Then add a
			second property that changes its <code>rotation</code> to <code>360</code>.
		</p>
	</div>
</LessonShell>

<style>
	.demo-wrap {
		display: flex;
		min-height: 280px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
	}

	.target-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}

	.target {
		display: flex;
		width: 104px;
		height: 116px;
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
		font-size: 2.1rem;
		line-height: 1;
	}

	.name {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
	}
</style>
