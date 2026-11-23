<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';
	import Spinner from './Spinner.svelte';

	const lesson = getLesson('10-responsive-and-cleanup');

	let stage = $state<HTMLDivElement | null>(null);
	let media: gsap.MatchMedia | null = null;
	let showSpinner = $state(true);
	let viewportWidth = $state(0);

	const layoutLabel = $derived.by(function () {
		if (viewportWidth >= 700) {
			return 'Desktop layout';
		}

		return 'Mobile layout';
	});

	onMount(() => {
		updateViewportWidth();
		window.addEventListener('resize', updateViewportWidth);

		setupResponsiveAnimation();

		return () => {
			window.removeEventListener('resize', updateViewportWidth);

			if (media !== null) {
				media.revert();
			}
		};
	});

	function updateViewportWidth(): void {
		viewportWidth = window.innerWidth;
	}

	function setupResponsiveAnimation(): void {
		if (stage === null) {
			return;
		}

		gsap.set('.responsive-box', { x: 0, rotation: 0 });

		if (media !== null) {
			media.revert();
		}

		media = gsap.matchMedia();

		media.add(
			{
				isDesktop: '(min-width: 700px)',
				isMobile: '(max-width: 699px)',
				reduceMotion: '(prefers-reduced-motion: reduce)'
			},
			function (context) {
				const conditions = context.conditions;

				if (conditions === undefined) {
					return;
				}

				let distance = 42;
				let rotation = 0;
				let duration = 0.8;

				if (conditions.isDesktop === true) {
					distance = 130;
					rotation = 90;
				}

				if (conditions.isMobile === true) {
					distance = 42;
					rotation = 0;
				}

				if (conditions.reduceMotion === true) {
					duration = 0;
				}

				gsap.to('.responsive-box', {
					x: distance,
					rotation: rotation,
					duration: duration,
					ease: 'power2.out'
				});
			},
			stage
		);
	}

	function toggleSpinner(): void {
		showSpinner = !showSpinner;
	}

	const snippet = `
onMount(() => {
  const context = gsap.context(() => {
    gsap.to('.spinner', {
      rotation: 360,
      duration: 1.2,
      repeat: -1,
      ease: 'none'
    });
  }, stage);

  // Svelte runs this when the component unmounts.
  return () => context.revert();
});

const media = gsap.matchMedia();

media.add(
  {
    isDesktop: '(min-width: 700px)',
    isMobile: '(max-width: 699px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  },
  function (context) {
    const conditions = context.conditions;

    if (conditions === undefined) {
      return;
    }

    let distance = 42;
    let rotation = 0;
    let duration = 0.8;

    if (conditions.isDesktop === true) {
      distance = 130;
      rotation = 90;
    }

    if (conditions.reduceMotion === true) {
      duration = 0;
    }

    gsap.to('.box', {
      x: distance,
      rotation: rotation,
      duration: duration,
      ease: 'power2.out'
    });
  },
  stage
);

// On unmount:
// media.revert();
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="Resize the browser window to cross the 700px line.">
		<div class="cleanup-demo" bind:this={stage}>
			<section class="demo-block">
				<div class="demo-head">
					<span>matchMedia</span>
					<span class="badge">{layoutLabel} · {viewportWidth}px</span>
				</div>

				<div class="responsive-stage">
					<div class="responsive-box">→</div>
				</div>

				<button class="btn btn-sm" type="button" onclick={setupResponsiveAnimation}>
					Run again
				</button>
			</section>

			<section class="demo-block">
				<div class="demo-head">
					<span>context cleanup</span>
					<span class="badge">{showSpinner ? 'mounted' : 'unmounted'}</span>
				</div>

				<div class="spinner-stage">
					{#if showSpinner}
						<Spinner />
					{:else}
						<p class="empty-state">The tween is gone. No leak.</p>
					{/if}
				</div>

				<button class="btn btn-sm" type="button" onclick={toggleSpinner}>
					{showSpinner ? 'Unmount spinner' : 'Mount spinner'}
				</button>
			</section>
		</div>
	</DemoStage>

	<h2>Two jobs, one pattern</h2>
	<p>
		Responsive animation and cleanup use the same idea. Put animation code in a function. GSAP
		collects what that function creates. Then you can remove all of it at once.
	</p>

	<h2>Match the viewport</h2>
	<p>
		<code>gsap.matchMedia()</code> runs a function only when a media query matches. It also reverts the
		animations when the query stops matching. That makes breakpoint changes safe.
	</p>

	<p>
		The <code>reduceMotion</code> condition checks the user setting for reduced motion. This demo sets
		the duration to 0, so the box jumps to the end. A real site can use a smaller movement instead.
	</p>

	<h2>Clean up on unmount</h2>
	<p>
		Svelte's <code>onMount</code> can return a cleanup function. Use it to call
		<code>context.revert()</code>. GSAP kills the tweens, kills the ScrollTriggers, and removes the
		inline styles that it added.
	</p>

	<CodeBlock code={snippet} title="Responsive animation and cleanup" />

	<div class="callout callout-warn">
		<span class="callout-title">Do not skip cleanup</span>
		<p>
			A repeating tween keeps running after the element leaves the page. One tween is small. Many
			route changes can add up. Use <code>gsap.context()</code> in every component that creates an animation.
		</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>
			Change the mobile distance to <code>-42</code>. Then add a third condition for
			<code>(min-width: 1100px)</code> that sets the distance to <code>190</code>. Resize the
			browser to test all three.
		</p>
	</div>
</LessonShell>

<style>
	.cleanup-demo {
		display: grid;
		min-height: 340px;
		gap: 1rem;
	}

	@media (min-width: 760px) {
		.cleanup-demo {
			grid-template-columns: 1fr 1fr;
		}
	}

	.demo-block {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		border: 2px solid var(--color-line);
		border-radius: 1rem;
		background-color: #fffdf8;
		padding: 0.9rem;
	}

	.demo-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.badge {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		padding: 0.15rem 0.45rem;
		color: var(--color-muted);
		font-size: 0.55rem;
	}

	.responsive-stage {
		position: relative;
		display: flex;
		min-height: 150px;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 1.5px dashed var(--color-line);
		border-radius: 0.75rem;
	}

	.responsive-box {
		display: flex;
		width: 46px;
		height: 46px;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--color-ink);
		border-radius: 0.65rem;
		background-color: var(--color-brand);
		font-size: 1.2rem;
		font-weight: 700;
		box-shadow: 3px 3px 0 var(--color-ink);
	}

	.spinner-stage {
		display: flex;
		min-height: 150px;
		align-items: center;
		justify-content: center;
		border: 1.5px dashed var(--color-line);
		border-radius: 0.75rem;
	}

	.empty-state {
		color: var(--color-muted);
		font-family: var(--font-mono);
		font-size: 0.65rem;
		text-align: center;
	}
</style>
