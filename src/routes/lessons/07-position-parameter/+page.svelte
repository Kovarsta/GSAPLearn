<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('07-position-parameter');

	let stage = $state<HTMLDivElement | null>(null);
	let timeline: gsap.core.Timeline | null = null;

	onMount(() => {
		if (stage === null) {
			return;
		}

		const context = gsap.context(() => {
			const lanes = gsap.utils.toArray<HTMLElement>('.lane', stage);
			const boxes = gsap.utils.toArray<HTMLElement>('.box', stage);
			const distance = lanes[0].clientWidth - boxes[0].offsetWidth - 8;

			timeline = gsap.timeline();

			// A label gives a position a name.
			timeline.addLabel('middle', 0.5);

			// Box A starts at 0 seconds.
			timeline.to(boxes[0], { x: distance, duration: 1, ease: 'power2.inOut' }, 0);

			// Box B starts at the label "middle".
			timeline.to(boxes[1], { x: distance, duration: 1, ease: 'power2.inOut' }, 'middle');

			// Box C starts at the same time as box B.
			timeline.to(boxes[2], { x: distance, duration: 1, ease: 'power2.inOut' }, '<');
		}, stage);

		if (timeline !== null) {
			timeline.play();
		}

		return () => context.revert();
	});

	function replay(): void {
		if (timeline === null) {
			return;
		}

		timeline.restart();
	}

	const snippet = `
const timeline = gsap.timeline();

// Give the 0.5 second point a name.
timeline.addLabel('middle', 0.5);

// Start at 0 seconds.
timeline.to('.box-a', { x: 240, duration: 1 }, 0);

// Start at the label "middle".
timeline.to('.box-b', { x: 240, duration: 1 }, 'middle');

// "<" means the start of the previous tween.
timeline.to('.box-c', { x: 240, duration: 1 }, '<');
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Watch box B and box C. They start together.">
		<div class="position-wrap">
			<div class="tracks" bind:this={stage}>
				<div class="track-row">
					<div class="track-info">
						<strong>Box A</strong>
						<span>position: 0</span>
					</div>
					<div class="lane">
						<div class="box box-a"></div>
					</div>
				</div>

				<div class="track-row">
					<div class="track-info">
						<strong>Box B</strong>
						<span>position: 'middle'</span>
					</div>
					<div class="lane">
						<div class="box box-b"></div>
					</div>
				</div>

				<div class="track-row">
					<div class="track-info">
						<strong>Box C</strong>
						<span>position: '&lt;'</span>
					</div>
					<div class="lane">
						<div class="box box-c"></div>
					</div>
				</div>
			</div>

			<button class="btn btn-primary btn-sm" type="button" onclick={replay}>Replay</button>
		</div>
	</DemoStage>

	<h2>The third argument is the position</h2>
	<p>
		Every timeline method takes an optional position after the vars object. It tells the timeline
		where to put the tween. If you do not give a position, the tween goes at the end of the
		timeline.
	</p>

	<CodeBlock code={snippet} title="Three positions" />

	<h2>The position options</h2>
	<ul>
		<li>
			<code>0</code> is an absolute time in seconds. <code>1.5</code> starts 1.5 seconds from the start.
		</li>
		<li>
			<code>'middle'</code> is a label. Create it with <code>addLabel()</code>. If the label does
			not exist, GSAP adds it to the end.
		</li>
		<li>
			<code>'&lt;'</code> starts at the start of the most recent tween. <code>'&gt;'</code> starts at
			its end.
		</li>
		<li>
			<code>'+=0.4'</code> starts 0.4 seconds after the current end of the timeline.
			<code>'-=0.4'</code> overlaps the end by 0.4 seconds.
		</li>
		<li><code>'&lt;+=0.2'</code> starts 0.2 seconds after the start of the previous tween.</li>
		<li><code>'middle+=0.3'</code> starts 0.3 seconds after the label.</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: the pointer idea</span>
		<p>
			Think of <code>'&lt;'</code> and <code>'&gt;'</code> as pointers. They point to the start or the
			end of the most recent tween. This makes overlaps easy to read.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change box C to start with <code>'&gt;-0.3'</code>. That starts it 0.3 seconds before the end
			of box B. Then add a fourth box that starts at <code>'middle+=0.2'</code>.
		</p>
	</div>
</LessonShell>

<style>
	.position-wrap {
		display: flex;
		min-height: 300px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
	}

	.tracks {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 0.8rem;
	}

	.track-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.track-info {
		display: flex;
		width: 118px;
		flex-shrink: 0;
		flex-direction: column;
		line-height: 1.3;
	}

	.track-info strong {
		font-size: 0.8rem;
	}

	.track-info span {
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.58rem;
	}

	.lane {
		position: relative;
		height: 36px;
		flex: 1;
		border: 2px solid var(--color-ink);
		border-radius: 0.65rem;
		background-color: #fffdf8;
	}

	.box {
		position: absolute;
		top: 4px;
		left: 4px;
		width: 24px;
		height: 24px;
		border: 2px solid var(--color-ink);
		border-radius: 0.35rem;
	}

	.box-a {
		background-color: var(--color-brand);
	}

	.box-b {
		background-color: var(--color-sun);
	}

	.box-c {
		background-color: var(--color-pink);
	}

	@media (max-width: 520px) {
		.track-info {
			width: 86px;
		}

		.track-info span {
			font-size: 0.5rem;
		}
	}
</style>
