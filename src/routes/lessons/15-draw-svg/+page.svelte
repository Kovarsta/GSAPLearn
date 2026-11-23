<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(DrawSVGPlugin);

	const lesson = getLesson('15-draw-svg');

	let board = $state<SVGSVGElement | null>(null);
	let animation: gsap.core.Tween | gsap.core.Timeline | null = null;

	onMount(() => {
		drawAll();

		return () => {
			if (animation !== null) {
				animation.kill();
			}
		};
	});

	function getPaths(): SVGPathElement[] {
		if (board === null) {
			return [];
		}

		return gsap.utils.toArray<SVGPathElement>('.draw-path', board);
	}

	function drawAll(): void {
		const paths = getPaths();

		if (animation !== null) {
			animation.kill();
		}

		animation = gsap.fromTo(
			paths,
			{ drawSVG: '0%' },
			{
				drawSVG: '100%',
				duration: 1.2,
				stagger: 0.25,
				ease: 'power2.inOut'
			}
		);
	}

	function drawFromCenter(): void {
		const paths = getPaths();

		if (animation !== null) {
			animation.kill();
		}

		animation = gsap.fromTo(
			paths,
			{ drawSVG: '50% 50%' },
			{
				drawSVG: '0% 100%',
				duration: 1.2,
				stagger: 0.25,
				ease: 'power2.inOut'
			}
		);
	}

	const snippet = `
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

const paths = gsap.utils.toArray('.draw-path');

gsap.fromTo(paths,
  { drawSVG: '0%' },
  {
    drawSVG: '100%',
    duration: 1.2,
    stagger: 0.25,
    ease: 'power2.inOut'
  }
);

// Draw a segment from the middle outward:
gsap.fromTo(paths,
  { drawSVG: '50% 50%' },
  { drawSVG: '0% 100%', duration: 1.2 }
);
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="DrawSVG changes the stroke, not the fill.">
		<div class="draw-wrap">
			<svg
				class="board"
				bind:this={board}
				viewBox="0 0 420 240"
				role="img"
				aria-label="A hand-drawn star, wave, and underline"
			>
				<path
					class="draw-path"
					d="M206 30 L226 92 L292 92 L239 130 L258 194 L206 157 L154 194 L173 130 L120 92 L186 92 Z"
					fill="none"
					stroke="#0ae448"
					stroke-width="5"
					stroke-linejoin="round"
					stroke-linecap="round"
				/>
				<path
					class="draw-path"
					d="M48 210 C88 168 128 168 168 198 S248 238 288 198 S348 158 382 190"
					fill="none"
					stroke="#ffb800"
					stroke-width="5"
					stroke-linecap="round"
				/>
				<path
					class="draw-path"
					d="M136 74 C152 52 178 44 206 52"
					fill="none"
					stroke="#ff5c7c"
					stroke-width="5"
					stroke-linecap="round"
				/>
			</svg>

			<div class="buttons">
				<button class="btn btn-primary btn-sm" type="button" onclick={drawAll}>Draw all</button>
				<button class="btn btn-sm" type="button" onclick={drawFromCenter}>From center</button>
			</div>
		</div>
	</DemoStage>

	<h2>Animate the stroke</h2>
	<p>
		DrawSVGPlugin reveals or hides the stroke of an SVG shape. It works with paths, lines, circles,
		rectangles, polygons, and polylines. It does not animate the fill.
	</p>

	<p>
		The <code>drawSVG</code> value describes the part of the stroke that should be visible at the
		end of the tween. <code>'0%'</code> is hidden. <code>'100%'</code> is the full path.
		<code>'20% 80%'</code> is the middle section.
	</p>

	<CodeBlock code={snippet} title="Draw a path" />

	<h2>Percentages and segments</h2>
	<ul>
		<li><code>drawSVG: '0%'</code> hides the stroke.</li>
		<li>
			<code>drawSVG: '100%'</code> shows the full stroke. <code>'true'</code> is the same value.
		</li>
		<li><code>drawSVG: '25% 75%'</code> shows only the part between 25 percent and 75 percent.</li>
		<li>
			<code>drawSVG: '50% 50%'</code> starts as a point in the middle. Animate to
			<code>'0% 100%'</code> to draw outward.
		</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: use a round line cap</span>
		<p>
			Set <code>stroke-linecap="round"</code> and <code>stroke-linejoin="round"</code> on the path. The
			ends and corners look much better while the line draws.
		</p>
	</div>

	<div class="callout callout-warn">
		<span class="callout-title">The path needs a stroke</span>
		<p>
			DrawSVG controls <code>stroke-dasharray</code> and <code>stroke-dashoffset</code>. If the path
			has no <code>stroke</code> color, you will not see the animation.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add a fourth path, a check mark. Animate all paths with
			<code>drawSVG: '20% 80%'</code>. Then animate the check mark from
			<code>'0% 0%'</code> to <code>'0% 100%'</code> after the others.
		</p>
	</div>
</LessonShell>

<style>
	.draw-wrap {
		display: flex;
		min-height: 320px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.board {
		width: min(100%, 520px);
		height: auto;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #151715;
		background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
		background-size: 18px 18px;
		box-shadow: 5px 5px 0 var(--color-ink);
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
	}
</style>
