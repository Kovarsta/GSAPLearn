<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { SplitText } from 'gsap/SplitText';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	gsap.registerPlugin(SplitText);

	const lesson = getLesson('14-split-text');

	let headline = $state<HTMLHeadingElement | null>(null);
	let split: SplitText | null = null;
	let context: gsap.Context | null = null;

	onMount(() => {
		if (headline === null) {
			return;
		}

		context = gsap.context(() => {
			split = SplitText.create(headline, {
				type: 'chars,words,lines',
				mask: 'lines',
				linesClass: 'split-line'
			});

			gsap.from(split.chars, {
				yPercent: 120,
				opacity: 0,
				rotation: 8,
				duration: 0.7,
				ease: 'back.out(1.7)',
				stagger: {
					each: 0.025,
					from: 'center'
				}
			});
		}, headline);

		return () => {
			if (split !== null) {
				split.revert();
			}

			if (context !== null) {
				context.revert();
			}
		};
	});

	function replay(): void {
		if (split === null) {
			return;
		}

		gsap.from(split.chars, {
			yPercent: 120,
			opacity: 0,
			rotation: 8,
			duration: 0.7,
			ease: 'back.out(1.7)',
			stagger: {
				each: 0.025,
				from: 'center'
			}
		});
	}

	const snippet = `
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const split = SplitText.create('.headline', {
  type: 'chars,words,lines',
  mask: 'lines',
  linesClass: 'split-line'
});

gsap.from(split.chars, {
  yPercent: 120,
  opacity: 0,
  rotation: 8,
  duration: 0.7,
  ease: 'back.out(1.7)',
  stagger: {
    each: 0.025,
    from: 'center'
  }
});

// On cleanup:
// split.revert();
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="SplitText creates real elements for each line, word, and char.">
		<div class="split-wrap">
			<h2 class="headline" bind:this={headline}>Make words dance.</h2>
			<p class="subline">A small headline with a center-out character stagger.</p>
			<button class="btn btn-primary btn-sm" type="button" onclick={replay}>Replay</button>
		</div>
	</DemoStage>

	<h2>Split text into parts</h2>
	<p>
		SplitText breaks a text element into smaller elements. You can split by lines, words,
		characters, or a mix. Then you can animate each part with GSAP.
	</p>

	<p>
		The plugin returns an object with a <code>chars</code> array, a <code>words</code> array, and a
		<code>lines</code> array. Use the array that fits your effect.
	</p>

	<CodeBlock code={snippet} title="Split, then stagger" />

	<h2>The useful options</h2>
	<ul>
		<li>
			<code>type: 'chars,words,lines'</code> creates all three levels. Use fewer levels when you do not
			need them.
		</li>
		<li>
			<code>mask: 'lines'</code> adds a clipping wrapper around each line. Characters can rise from behind
			the line.
		</li>
		<li>
			<code>linesClass</code>, <code>wordsClass</code>, and <code>charsClass</code> add your own class
			names.
		</li>
		<li>
			<code>aria: 'auto'</code> is the default. It helps screen readers read the original text.
		</li>
		<li>
			<code>autoSplit: true</code> re-splits when fonts load or the width changes. Combine it with
			<code>onSplit</code> for responsive text.
		</li>
	</ul>

	<div class="callout callout-warn">
		<span class="callout-title">Always revert</span>
		<p>
			SplitText changes the DOM. Call <code>split.revert()</code> when the component unmounts. That puts
			the original text back and removes the wrapper elements.
		</p>
	</div>

	<div class="callout callout-tip">
		<span class="callout-title">Tip: wait for fonts</span>
		<p>
			Line breaks can change after a web font loads. For a production page, split after
			<code>document.fonts.ready</code> or use <code>autoSplit: true</code>.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change <code>split.chars</code> to <code>split.lines</code>. Then change the stagger to
			<code>&#123; each: 0.12, from: 'start' &#125;</code> and set <code>y: 80</code> instead of
			<code>yPercent</code>.
		</p>
	</div>
</LessonShell>

<style>
	.split-wrap {
		display: flex;
		min-height: 300px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
		text-align: center;
	}

	.headline {
		max-width: 620px;
		color: var(--color-ink);
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 8vw, 4.6rem);
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.04em;
	}

	.subline {
		color: var(--color-muted);
		font-size: 0.8rem;
	}

	:global(.split-line) {
		padding-bottom: 0.06em;
	}
</style>
