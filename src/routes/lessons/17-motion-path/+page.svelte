<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(MotionPathPlugin);

	const lesson = getLesson('17-motion-path');

	let rocket = $state<SVGGElement | null>(null);
	let flight: gsap.core.Tween | null = null;

	onMount(() => {
		if (rocket === null) {
			return;
		}

		flight = gsap.to(rocket, {
			motionPath: {
				path: '#flight-path',
				align: '#flight-path',
				alignOrigin: [0.5, 0.5],
				autoRotate: true
			},
			duration: 3.4,
			ease: 'power1.inOut',
			repeat: -1,
			repeatDelay: 0.35
		});

		return () => {
			if (flight !== null) {
				flight.kill();
			}
		};
	});

	function flyAgain(): void {
		if (flight === null) {
			return;
		}

		flight.restart();
	}

	const snippet = `
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

gsap.to('#rocket', {
  motionPath: {
    path: '#flight-path',
    align: '#flight-path',
    alignOrigin: [0.5, 0.5],
    autoRotate: true
  },
  duration: 3.4,
  ease: 'power1.inOut',
  repeat: -1,
  repeatDelay: 0.35
});
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="The rocket follows the dashed path and turns to face the direction.">
		<div class="path-wrap">
			<svg class="board" viewBox="0 0 520 300" role="img" aria-label="A rocket that follows a path">
				<path
					id="flight-path"
					d="M42,238 C90,60 190,38 250,140 C300,226 390,248 470,78"
					fill="none"
					stroke="#0ae448"
					stroke-width="3"
					stroke-dasharray="10 12"
					stroke-linecap="round"
				/>

				<circle cx="42" cy="238" r="6" fill="#ffb800" stroke="#171717" stroke-width="2" />
				<circle cx="470" cy="78" r="8" fill="#ff5c7c" stroke="#171717" stroke-width="2" />

				<g id="rocket" bind:this={rocket}>
					<text
						x="0"
						y="0"
						text-anchor="middle"
						dominant-baseline="central"
						font-size="34"
						transform="rotate(-90)"
					>
						🚀
					</text>
				</g>
			</svg>

			<button class="btn btn-primary btn-sm" type="button" onclick={flyAgain}>Fly again</button>
		</div>
	</DemoStage>

	<h2>Follow a path</h2>
	<p>
		MotionPathPlugin sends an element along a path. The path can be an SVG path element, raw path
		data, or an array of points. The element can be an SVG element or a normal HTML element.
	</p>

	<CodeBlock code={snippet} title="A looping flight" />

	<h2>The motionPath settings</h2>
	<ul>
		<li>
			<code>path</code> is the path to follow. A selector such as <code>'#flight-path'</code> is enough.
		</li>
		<li>
			<code>align</code> places the element on the path at the start.
			<code>alignOrigin: [0.5, 0.5]</code> uses the center of the element.
		</li>
		<li><code>autoRotate: true</code> turns the element to face the path direction.</li>
		<li>
			<code>start</code> and <code>end</code> use a 0 to 1 progress range. <code>start: 0.25</code> starts
			a quarter of the way along the path.
		</li>
		<li>
			<code>curviness</code> applies when the path is an array of points. It controls how round the curve
			is.
		</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: rotate the art, not the path</span>
		<p>
			If the art points the wrong way, rotate the element inside the SVG. The
			<code>autoRotate</code> value follows the path direction, not the art direction.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add <code>start: 0.2</code> and <code>end: 0.8</code> to the motionPath object. Then add a second
			rocket and use a raw path string with an array of points. Which version is easier to control?
		</p>
	</div>
</LessonShell>

<style>
	.path-wrap {
		display: flex;
		min-height: 340px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.board {
		width: min(100%, 560px);
		height: auto;
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background-color: #151715;
		background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
		background-size: 18px 18px;
		box-shadow: 5px 5px 0 var(--color-ink);
	}

	#flight-path {
		filter: drop-shadow(0 0 6px rgba(10, 228, 72, 0.45));
	}

	#rocket {
		filter: drop-shadow(0 8px 4px rgba(0, 0, 0, 0.35));
	}
</style>
