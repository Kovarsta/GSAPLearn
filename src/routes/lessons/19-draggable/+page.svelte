<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { Draggable } from 'gsap/Draggable';
	import { InertiaPlugin } from 'gsap/InertiaPlugin';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(Draggable, InertiaPlugin);

	const lesson = getLesson('19-draggable');

	const tokens = [
		{ emoji: '🦊', label: 'fox', color: '#ff5c7c' },
		{ emoji: '🪐', label: 'planet', color: '#00b3ff' },
		{ emoji: '🍀', label: 'clover', color: '#0ae448' }
	];

	let dragArea = $state<HTMLDivElement | null>(null);
	let draggables: Draggable[] = [];

	onMount(() => {
		if (dragArea === null) {
			return;
		}

		draggables = Draggable.create(dragArea.querySelectorAll<HTMLElement>('.token'), {
			type: 'x,y',
			bounds: dragArea,
			inertia: true,
			edgeResistance: 0.75,
			cursor: 'grab',
			activeCursor: 'grabbing'
		});

		return () => {
			for (const draggable of draggables) {
				draggable.kill();
			}
		};
	});

	function resetTokens(): void {
		if (dragArea === null) {
			return;
		}

		const tokenElements = dragArea.querySelectorAll<HTMLElement>('.token');

		gsap.killTweensOf(tokenElements);
		gsap.to(tokenElements, {
			x: 0,
			y: 0,
			rotation: 0,
			duration: 0.6,
			ease: 'elastic.out(1, 0.5)'
		});
	}

	const snippet = `
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

const draggables = Draggable.create('.token', {
  type: 'x,y',
  bounds: '.drag-area',
  inertia: true,
  edgeResistance: 0.75
});

// On cleanup:
// for (const item of draggables) {
//   item.kill();
// }
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Drag a token and throw it. The bounds keep it inside the tray.">
		<div class="drag-wrap">
			<div class="drag-area" bind:this={dragArea}>
				<div class="drag-hint">Drag inside this tray</div>

				{#each tokens as token (token.label)}
					<div class="token" style={`background: ${token.color}`}>
						<span>{token.emoji}</span>
						<small>{token.label}</small>
					</div>
				{/each}
			</div>

			<button class="btn btn-primary btn-sm" type="button" onclick={resetTokens}>
				Reset tokens
			</button>
		</div>
	</DemoStage>

	<h2>Make an element draggable</h2>
	<p>
		Draggable turns mouse and touch drags into x and y values. It respects the element transform, so
		it works well with GSAP tweens.
	</p>

	<CodeBlock code={snippet} title="Drag, bounds, and inertia" />

	<h2>The main settings</h2>
	<ul>
		<li>
			<code>type: 'x,y'</code> allows movement on both axes. Use <code>'x'</code>, <code>'y'</code>,
			or <code>'rotation'</code> for one axis.
		</li>
		<li><code>bounds</code> limits the element to a parent or a set of coordinates.</li>
		<li>
			<code>inertia: true</code> adds momentum after the user lets go. It needs InertiaPlugin.
		</li>
		<li>
			<code>edgeResistance</code> controls how hard it is to drag past the bounds. <code>1</code> stops
			at the edge.
		</li>
		<li>
			<code>cursor</code> and <code>activeCursor</code> change the pointer while the user drags.
		</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: kill Draggable on cleanup</span>
		<p>
			<code>Draggable.create()</code> returns an array. Call <code>kill()</code> on each item when the
			component unmounts. That removes the event listeners.
		</p>
	</div>

	<div class="callout callout-warn">
		<span class="callout-title">Inertia is a plugin</span>
		<p>
			Register <code>InertiaPlugin</code> before you use <code>inertia: true</code>. Without it, the
			drag still works, but the element stops as soon as you release it.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change <code>type</code> to <code>'x'</code>. Then add <code>snap: &#123; x: 80 &#125;</code>
			to the Draggable settings. Throw a token and watch it land on the grid. Add a rotation dial with
			<code>type: 'rotation'</code>.
		</p>
	</div>
</LessonShell>

<style>
	.drag-wrap {
		display: flex;
		min-height: 340px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.drag-area {
		position: relative;
		display: flex;
		width: 100%;
		min-height: 230px;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		overflow: hidden;
		border: 2px dashed var(--color-ink);
		border-radius: 1rem;
		background-color: rgba(255, 253, 248, 0.7);
		touch-action: none;
	}

	.drag-hint {
		position: absolute;
		top: 0.65rem;
		left: 0;
		right: 0;
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.58rem;
		letter-spacing: 0.08em;
		text-align: center;
		text-transform: uppercase;
		pointer-events: none;
	}

	.token {
		display: flex;
		width: 96px;
		height: 96px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.2rem;
		border: 2px solid var(--color-ink);
		border-radius: 1.1rem;
		box-shadow: 4px 4px 0 var(--color-ink);
		cursor: grab;
		will-change: transform;
	}

	.token:active {
		cursor: grabbing;
	}

	.token span {
		font-size: 2.2rem;
		line-height: 1;
	}

	.token small {
		font-family: var(--font-mono);
		font-size: 0.55rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
