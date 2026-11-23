<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('21-quick-to-and-utils');

	let stage = $state<HTMLDivElement | null>(null);
	let follower = $state<HTMLDivElement | null>(null);
	let moveX: gsap.QuickToFunc | null = null;
	let moveY: gsap.QuickToFunc | null = null;
	let spin: gsap.QuickToFunc | null = null;
	let pointerRotation = $state(0);

	onMount(() => {
		if (stage === null || follower === null) {
			return;
		}

		// quickTo creates one reusable tween for each property.
		moveX = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power2.out' });
		moveY = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power2.out' });
		spin = gsap.quickTo(follower, 'rotation', { duration: 0.5, ease: 'power2.out' });

		gsap.set(follower, {
			xPercent: -50,
			yPercent: -50,
			x: stage.clientWidth / 2,
			y: stage.clientHeight / 2
		});

		return () => {
			if (moveX !== null) {
				moveX.tween.kill();
			}

			if (moveY !== null) {
				moveY.tween.kill();
			}

			if (spin !== null) {
				spin.tween.kill();
			}
		};
	});

	function handlePointerMove(event: PointerEvent): void {
		if (stage === null || moveX === null || moveY === null || spin === null) {
			return;
		}

		const rect = stage.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const rawRotation = gsap.utils.mapRange(0, rect.width, -30, 30, x);
		const rotation = gsap.utils.clamp(-30, 30, rawRotation);

		moveX(x);
		moveY(y);
		spin(rotation);
		pointerRotation = rotation;
	}

	function handlePointerLeave(): void {
		if (stage === null || moveX === null || moveY === null || spin === null) {
			return;
		}

		moveX(stage.clientWidth / 2);
		moveY(stage.clientHeight / 2);
		spin(0);
		pointerRotation = 0;
	}

	function pulse(): void {
		if (follower === null) {
			return;
		}

		gsap.fromTo(
			follower,
			{ scale: 0.82 },
			{
				scale: 1,
				duration: 0.5,
				ease: 'elastic.out(1, 0.4)'
			}
		);
	}

	const snippet = `
const moveX = gsap.quickTo('.follower', 'x', {
  duration: 0.35,
  ease: 'power2.out'
});

const moveY = gsap.quickTo('.follower', 'y', {
  duration: 0.35,
  ease: 'power2.out'
});

const spin = gsap.quickTo('.follower', 'rotation', {
  duration: 0.5,
  ease: 'power2.out'
});

function handlePointerMove(event) {
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  moveX(x);
  moveY(y);

  const rawRotation = gsap.utils.mapRange(0, rect.width, -30, 30, x);
  const rotation = gsap.utils.clamp(-30, 30, rawRotation);

  spin(rotation);
}
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Move your pointer inside the panel. Click to make the blob pulse.">
		<div
			class="pointer-stage"
			bind:this={stage}
			onpointermove={handlePointerMove}
			onpointerleave={handlePointerLeave}
			onclick={pulse}
			role="presentation"
		>
			<div class="pointer-hint">Move your pointer here</div>
			<div class="follower" bind:this={follower} aria-hidden="true">
				<span class="eye eye-left"></span>
				<span class="eye eye-right"></span>
			</div>
			<div class="readout">
				<span>rotation</span>
				<strong>{Math.round(pointerRotation)}°</strong>
			</div>
		</div>
	</DemoStage>

	<h2>Reuse one tween for fast input</h2>
	<p>
		A pointer can move many times each second. Do not create a new tween for every move.
		<code>gsap.quickTo()</code> creates one tween and returns a function. Call the function with the new
		value, and GSAP sends the existing tween to that value.
	</p>

	<CodeBlock code={snippet} title="Pointer follower" />

	<h2>quickTo vs quickSetter</h2>
	<ul>
		<li>
			<code>gsap.quickTo()</code> smooths the change with a tween. Use it for a follower, a cursor, or
			a value that should catch up.
		</li>
		<li>
			<code>gsap.quickSetter()</code> sets the value immediately with no tween. Use it for scroll-linked
			values or a canvas draw call.
		</li>
		<li>Both avoid the cost of creating a new tween on every event.</li>
	</ul>

	<h2>A few utility helpers</h2>
	<ul>
		<li><code>gsap.utils.mapRange(0, 100, 0, 360, value)</code> maps one range to another.</li>
		<li><code>gsap.utils.clamp(-30, 30, value)</code> keeps a value inside a range.</li>
		<li><code>gsap.utils.random(-100, 100, 5)</code> returns a random number, rounded to 5.</li>
		<li>
			<code>gsap.utils.distribute(&#123; base: 0, amount: 1 &#125;)</code> spreads values across targets.
			It is useful for staggers and grids.
		</li>
		<li><code>gsap.utils.wrap(0, 10, 12)</code> wraps a value: 12 becomes 2.</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: keep state out of the frame loop</span>
		<p>
			<code>quickTo</code> moves the element directly. Do not update a large Svelte state tree on every
			pointer event. Update only the small readout that needs it.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add a second follower with a longer duration and a smaller size. It will trail behind the
			first one. Then use <code>gsap.utils.random</code> on click to pick a new background color for the
			follower.
		</p>
	</div>
</LessonShell>

<style>
	.pointer-stage {
		position: relative;
		min-height: 330px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #151715;
		background-image: radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px);
		background-size: 18px 18px;
		cursor: crosshair;
		touch-action: none;
	}

	.pointer-hint {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		color: #7d8a7b;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-align: center;
		text-transform: uppercase;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.follower {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		width: 78px;
		height: 78px;
		align-items: center;
		justify-content: center;
		border: 2px solid #171717;
		border-radius: 999px;
		background: radial-gradient(circle at 34% 28%, #d8ffe2, #0ae448 58%, #05a832);
		box-shadow: 0 0 0 10px rgba(10, 228, 72, 0.12);
		pointer-events: none;
		will-change: transform;
	}

	.eye {
		position: absolute;
		top: 28px;
		width: 7px;
		height: 11px;
		border-radius: 999px;
		background-color: #171717;
	}

	.eye-left {
		left: 24px;
	}

	.eye-right {
		right: 24px;
	}

	.readout {
		position: absolute;
		right: 0.8rem;
		bottom: 0.8rem;
		border: 1px solid #343a33;
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
		color: #a7b3a5;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
	}

	.readout strong {
		margin-left: 0.3rem;
		color: #dcffdf;
	}
</style>
