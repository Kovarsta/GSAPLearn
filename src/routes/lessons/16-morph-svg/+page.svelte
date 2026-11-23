<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(MorphSVGPlugin);

	const lesson = getLesson('16-morph-svg');

	const shapes = [
		{ id: 'blob', label: 'Blob', color: '#0ae448' },
		{ id: 'star', label: 'Star', color: '#ffb800' },
		{ id: 'heart', label: 'Heart', color: '#ff5c7c' },
		{ id: 'bolt', label: 'Bolt', color: '#00b3ff' }
	];

	let shape = $state<SVGPathElement | null>(null);
	let currentShape = $state('blob');
	let animation: gsap.core.Tween | null = null;

	onMount(() => {
		return () => {
			if (animation !== null) {
				animation.kill();
			}
		};
	});

	function morphTo(nextShape: string, color: string): void {
		if (shape === null) {
			return;
		}

		if (animation !== null) {
			animation.kill();
		}

		currentShape = nextShape;

		animation = gsap.to(shape, {
			morphSVG: '#' + nextShape,
			fill: color,
			duration: 0.8,
			ease: 'power2.inOut'
		});
	}

	const snippet = `
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

gsap.to('#shape', {
  morphSVG: '#star',
  fill: '#ffb800',
  duration: 0.8,
  ease: 'power2.inOut'
});

// You can also morph to raw path data:
// gsap.to('#shape', { morphSVG: 'M20,20 L200,20 L110,200 Z' });
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Each button morphs the same path into a different shape.">
		<div class="morph-wrap">
			<svg class="board" viewBox="0 0 400 260" role="img" aria-label="A shape that morphs">
				<defs>
					<path
						id="star"
						d="M200,30 L225,100 L300,100 L240,145 L262,220 L200,175 L138,220 L160,145 L100,100 L175,100 Z"
					/>
					<path
						id="heart"
						d="M200,220 C120,160 70,120 70,80 C70,45 110,30 145,50 C170,64 190,85 200,100 C210,85 230,64 255,50 C290,30 330,45 330,80 C330,120 280,160 200,220 Z"
					/>
					<path id="bolt" d="M225,20 L120,150 L190,150 L160,240 L280,105 L210,105 Z" />
				</defs>

				<path
					class="morph-shape"
					bind:this={shape}
					d="M200,40 C280,30 350,90 330,160 C310,230 220,240 150,210 C80,180 70,100 120,60 C145,40 170,45 200,40 Z"
					fill="#0ae448"
					stroke="#171717"
					stroke-width="4"
					stroke-linejoin="round"
				/>
			</svg>

			<div class="buttons">
				{#each shapes as item (item.id)}
					<button
						class="btn btn-sm"
						class:btn-primary={currentShape === item.id}
						type="button"
						onclick={() => morphTo(item.id, item.color)}
					>
						{item.label}
					</button>
				{/each}
			</div>
		</div>
	</DemoStage>

	<h2>Change the path data</h2>
	<p>
		MorphSVGPlugin changes one SVG path into another. It reads the <code>d</code> attribute from each
		path and animates the points in between. The two paths can have different numbers of points.
	</p>

	<CodeBlock code={snippet} title="Morph to another path" />

	<h2>What you can morph to</h2>
	<ul>
		<li>A selector that points to another path, such as <code>'#star'</code>.</li>
		<li>A direct SVG element reference.</li>
		<li>Raw path data, such as <code>'M20,20 L200,20 L110,200 Z'</code>.</li>
		<li>A list of points for a polygon or polyline.</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: keep the artboards equal</span>
		<p>
			Both paths should use the same coordinate space. If one shape was drawn on a different canvas,
			the morph can jump or stretch.
		</p>
	</div>

	<div class="callout callout-warn">
		<span class="callout-title">Odd twists?</span>
		<p>
			MorphSVG must match the start point and direction of each path. If a morph twists, try
			<code>shapeIndex: 'auto'</code> or <code>shapeIndex: 1</code> to rotate the point order.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add a fifth shape to the <code>defs</code>, such as a diamond. Then morph to raw path data
			instead of an element. Add <code>rotate: 10</code> to the tween for a playful twist.
		</p>
	</div>
</LessonShell>

<style>
	.morph-wrap {
		display: flex;
		min-height: 340px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.1rem;
	}

	.board {
		width: min(100%, 440px);
		height: auto;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #151715;
		background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
		background-size: 18px 18px;
		box-shadow: 5px 5px 0 var(--color-ink);
	}

	.morph-shape {
		filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.25));
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem;
	}
</style>
