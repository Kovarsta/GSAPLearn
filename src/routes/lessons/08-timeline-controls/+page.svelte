<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('08-timeline-controls');

	let stage = $state<HTMLDivElement | null>(null);
	let timeline: gsap.core.Timeline | null = null;
	let progressValue = $state(0);
	let timeValue = $state(0);
	let durationValue = $state(0);
	let speed = $state(1);

	onMount(() => {
		if (stage === null) {
			return;
		}

		const context = gsap.context(() => {
			timeline = gsap.timeline({
				onUpdate: updateReadout
			});

			timeline.to('.shape-a', { x: 150, rotation: 90, duration: 0.8 }, 0);
			timeline.to('.shape-b', { y: -54, scale: 1.2, duration: 0.8 }, 0.4);
			timeline.to('.shape-c', { x: -130, rotation: -90, duration: 0.8 }, 0.9);
			timeline.to(
				'.shape-a',
				{ backgroundColor: '#ff5c7c', borderRadius: '50%', duration: 0.6 },
				1.4
			);
			timeline.to('.shape-b', { x: 110, duration: 0.7 }, 1.7);
			timeline.to('.shape-c', { y: 42, duration: 0.7 }, 2);
		}, stage);

		if (timeline !== null) {
			durationValue = timeline.duration();
			timeValue = timeline.time();
			progressValue = timeline.progress();
			timeline.play();
		}

		return () => context.revert();
	});

	function updateReadout(): void {
		if (timeline === null) {
			return;
		}

		progressValue = timeline.progress();
		timeValue = timeline.time();
	}

	function play(): void {
		if (timeline === null) {
			return;
		}

		timeline.play();
	}

	function pause(): void {
		if (timeline === null) {
			return;
		}

		timeline.pause();
	}

	function reverse(): void {
		if (timeline === null) {
			return;
		}

		timeline.reverse();
	}

	function restart(): void {
		if (timeline === null) {
			return;
		}

		timeline.restart();
	}

	function jumpToStart(): void {
		if (timeline === null) {
			return;
		}

		timeline.pause();
		timeline.progress(0);
	}

	function jumpToEnd(): void {
		if (timeline === null) {
			return;
		}

		timeline.pause();
		timeline.progress(1);
	}

	function scrub(event: Event): void {
		if (timeline === null) {
			return;
		}

		const input = event.currentTarget as HTMLInputElement;
		const nextProgress = Number(input.value) / 100;

		timeline.pause();
		timeline.progress(nextProgress);
		progressValue = nextProgress;
	}

	function setSpeed(nextSpeed: number): void {
		if (timeline === null) {
			return;
		}

		speed = nextSpeed;
		timeline.timeScale(nextSpeed);
	}

	const snippet = `
const timeline = gsap.timeline();

timeline.to('.a', { x: 150, duration: 0.8 });
timeline.to('.b', { y: -54, duration: 0.8 }, 0.4);

// Playback
timeline.play();
timeline.pause();
timeline.reverse();
timeline.restart();

// Speed: 1 is normal, 2 is double, 0.5 is half
timeline.timeScale(2);

// Jump to a point. progress() uses 0 to 1.
timeline.progress(0.5);
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Drag the slider. Then change the speed.">
		<div class="controls-wrap" bind:this={stage}>
			<div class="shapes">
				<div class="shape shape-a">A</div>
				<div class="shape shape-b">B</div>
				<div class="shape shape-c">C</div>
			</div>

			<div class="readout">
				<span>{timeValue.toFixed(1)}s</span>
				<span>{durationValue.toFixed(1)}s total</span>
				<span>{speed}× speed</span>
			</div>

			<div class="scrubber">
				<input
					class="w-full"
					type="range"
					min="0"
					max="100"
					step="1"
					value={Math.round(progressValue * 100)}
					oninput={scrub}
					aria-label="Timeline progress"
				/>
				<div class="progress-track" aria-hidden="true">
					<div class="progress-fill" style={`width: ${progressValue * 100}%`}></div>
				</div>
			</div>

			<div class="buttons">
				<button class="btn btn-sm" type="button" onclick={play}>Play</button>
				<button class="btn btn-sm" type="button" onclick={pause}>Pause</button>
				<button class="btn btn-sm" type="button" onclick={reverse}>Reverse</button>
				<button class="btn btn-sm" type="button" onclick={restart}>Restart</button>
				<button class="btn btn-sm" type="button" onclick={jumpToStart}>Start</button>
				<button class="btn btn-sm" type="button" onclick={jumpToEnd}>End</button>
			</div>

			<div class="buttons">
				<span class="speed-label">Speed</span>
				<button
					class="btn btn-sm"
					class:btn-primary={speed === 0.5}
					type="button"
					onclick={() => setSpeed(0.5)}
				>
					0.5×
				</button>
				<button
					class="btn btn-sm"
					class:btn-primary={speed === 1}
					type="button"
					onclick={() => setSpeed(1)}
				>
					1×
				</button>
				<button
					class="btn btn-sm"
					class:btn-primary={speed === 2}
					type="button"
					onclick={() => setSpeed(2)}
				>
					2×
				</button>
			</div>
		</div>
	</DemoStage>

	<h2>The timeline is a playhead</h2>
	<p>
		A timeline has a playhead. The playhead moves from 0 to the end of the timeline. All control
		methods move that playhead or change its speed.
	</p>

	<CodeBlock code={snippet} title="Playback controls" />

	<h2>The methods that you will use most</h2>
	<ul>
		<li><code>play()</code> moves forward from the current position.</li>
		<li><code>pause()</code> stops the playhead.</li>
		<li><code>reverse()</code> moves backward from the current position.</li>
		<li><code>restart()</code> jumps to 0 and plays forward.</li>
		<li><code>progress(0.5)</code> jumps to the middle. The value runs from 0 to 1.</li>
		<li><code>time(1.2)</code> jumps to 1.2 seconds.</li>
		<li>
			<code>timeScale(2)</code> makes the timeline run twice as fast. <code>0.5</code> makes it half speed.
		</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: read the state</span>
		<p>
			Use <code>timeline.progress()</code>, <code>timeline.time()</code>, and
			<code>timeline.duration()</code> to update a progress bar or a time label. This demo uses an
			<code>onUpdate</code> callback.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Add a button that calls <code>timeline.timeScale(4)</code>. Then add a button that calls
			<code>timeline.progress(0.25)</code> and pauses the timeline.
		</p>
	</div>
</LessonShell>

<style>
	.controls-wrap {
		display: flex;
		min-height: 320px;
		flex-direction: column;
		justify-content: center;
		gap: 1.1rem;
	}

	.shapes {
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: 0.75rem;
		padding-block: 1rem;
	}

	.shape {
		display: flex;
		width: 58px;
		height: 58px;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--color-ink);
		border-radius: 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 500;
		box-shadow: 3px 3px 0 var(--color-ink);
	}

	.shape-a {
		background-color: var(--color-brand);
	}

	.shape-b {
		background-color: var(--color-sun);
	}

	.shape-c {
		background-color: var(--color-sky);
	}

	.readout {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.scrubber {
		position: relative;
	}

	.scrubber input {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 28px;
		cursor: pointer;
		opacity: 0.001;
	}

	.progress-track {
		position: absolute;
		top: 50%;
		right: 0;
		left: 0;
		height: 12px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background-color: #fffdf8;
		transform: translateY(-50%);
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-ink);
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	.speed-label {
		margin-right: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
