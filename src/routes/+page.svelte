<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { resolve } from '$app/paths';
	import {
		getLessonHref,
		getPhaseLessons,
		getTotalMinutes,
		lessons,
		phases,
		type Lesson
	} from '#lib/course.ts';
	import { isLessonComplete, progress } from '#lib/progress.svelte.ts';

	let hero = $state<HTMLElement | null>(null);

	const firstLesson = lessons[0];
	const courseHours = Math.round(getTotalMinutes() / 60);
	const completedCount = $derived(progress.completedSlugs.length);
	const percent = $derived(
		Math.min(100, Math.round((progress.completedSlugs.length / lessons.length) * 100))
	);
	const nextLesson = $derived.by(function () {
		const remainingLesson = lessons.find(function (lesson) {
			return !isLessonComplete(lesson.slug);
		});

		if (remainingLesson === undefined) {
			return null;
		}

		return remainingLesson;
	});

	onMount(() => {
		if (hero === null) {
			return;
		}

		const context = gsap.context(() => {
			gsap.from('.hero-line', {
				yPercent: 110,
				opacity: 0,
				duration: 0.9,
				stagger: 0.08,
				ease: 'power3.out'
			});

			gsap.from('.hero-chip', {
				scale: 0,
				rotation: -20,
				opacity: 0,
				duration: 0.65,
				stagger: 0.1,
				delay: 0.2,
				ease: 'back.out(1.7)'
			});

			gsap.to('.hero-orb', {
				scale: 1.06,
				duration: 1.8,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});

			gsap.to('.hero-chip-1', {
				y: -12,
				rotation: -4,
				duration: 2.2,
				delay: 1.2,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});

			gsap.to('.hero-chip-2', {
				y: 9,
				rotation: 3,
				duration: 2.8,
				delay: 1.3,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});

			gsap.to('.hero-chip-3', {
				y: -7,
				rotation: -2,
				duration: 2.4,
				delay: 1.4,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});
		}, hero);

		return () => context.revert();
	});

	function lessonIsDone(lesson: Lesson): boolean {
		return isLessonComplete(lesson.slug);
	}
</script>

<svelte:head>
	<title>GSAP Lab · Learn animation by playing</title>
	<meta
		name="description"
		content="A small, hands-on GSAP course with live demos. Learn tweens, timelines, ScrollTrigger, SplitText, Flip, and more."
	/>
</svelte:head>

<main class="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
	<section
		class="grid items-center gap-10 pt-10 pb-14 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
		bind:this={hero}
	>
		<div>
			<p class="mb-4 flex flex-wrap items-center gap-2">
				<span class="pill bg-brand">Free course</span>
				<span class="pill bg-white">{lessons.length} bite-sized lessons</span>
			</p>

			<h1
				class="font-display text-[3.2rem] leading-[0.92] font-extrabold tracking-[-0.04em] sm:text-7xl"
			>
				<span class="block overflow-hidden pb-1">
					<span class="hero-line block">Make the</span>
				</span>
				<span class="block overflow-hidden pb-1">
					<span class="hero-line block text-brand [text-shadow:3px_3px_0_#171717]">web move.</span>
				</span>
			</h1>

			<p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
				A hands-on GSAP course for people who learn by playing. Start with one tween. Finish with
				scroll-driven scenes, SVG morphs, and draggable interfaces.
			</p>

			<div class="mt-8 flex flex-wrap gap-3">
				<a class="btn btn-primary" href={resolve(getLessonHref(firstLesson.slug))}>
					Start lesson 01 <span aria-hidden="true">→</span>
				</a>
				<a class="btn" href="#roadmap">See the roadmap</a>
			</div>

			<dl class="mt-10 grid max-w-lg grid-cols-3 gap-3">
				<div class="card-flat px-3 py-3">
					<dt class="font-mono text-[0.6rem] font-bold tracking-widest text-muted uppercase">
						Lessons
					</dt>
					<dd class="font-display text-2xl font-extrabold">{lessons.length}</dd>
				</div>
				<div class="card-flat px-3 py-3">
					<dt class="font-mono text-[0.6rem] font-bold tracking-widest text-muted uppercase">
						Phases
					</dt>
					<dd class="font-display text-2xl font-extrabold">{phases.length}</dd>
				</div>
				<div class="card-flat px-3 py-3">
					<dt class="font-mono text-[0.6rem] font-bold tracking-widest text-muted uppercase">
						Time
					</dt>
					<dd class="font-display text-2xl font-extrabold">~{courseHours}h</dd>
				</div>
			</dl>
		</div>

		<div class="hero-board" aria-hidden="true">
			<div class="hero-board-grid"></div>

			<div class="hero-orb"></div>
			<div class="hero-chip hero-chip-1">gsap.to()</div>
			<div class="hero-chip hero-chip-2">timeline()</div>
			<div class="hero-chip hero-chip-3">ScrollTrigger</div>
			<div class="hero-spark hero-spark-1">✦</div>
			<div class="hero-spark hero-spark-2">✦</div>

			<div class="hero-board-label">
				<span class="h-2 w-2 rounded-full bg-brand"></span>
				playground.js
			</div>
		</div>
	</section>

	{#if completedCount > 0}
		<section class="mb-14">
			<div
				class="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
			>
				<div class="min-w-0 flex-1">
					<p class="font-mono text-[0.65rem] font-bold tracking-widest text-muted uppercase">
						Your progress
					</p>
					<p class="mt-1 font-display text-2xl font-extrabold">
						{completedCount} of {lessons.length} lessons done
					</p>
					<div class="mt-3 h-3 max-w-md overflow-hidden rounded-full border-2 border-ink bg-white">
						<div class="h-full rounded-full bg-brand" style={`width: ${percent}%`}></div>
					</div>
				</div>

				{#if nextLesson !== null}
					<a class="btn btn-primary shrink-0" href={resolve(getLessonHref(nextLesson.slug))}>
						Continue: {nextLesson.title}
					</a>
				{:else}
					<a class="btn btn-primary shrink-0" href="#roadmap">Course complete. Review the map.</a>
				{/if}
			</div>
		</section>
	{/if}

	<section id="roadmap" class="scroll-mt-8">
		<div class="mb-8 flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="font-mono text-xs font-bold tracking-widest text-muted uppercase">The roadmap</p>
				<h2 class="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
					Six phases. Small steps.
				</h2>
			</div>
			<p class="max-w-sm text-sm leading-relaxed text-muted">
				Each lesson takes 6 to 15 minutes. Play with the demo first. Then read the code. Then try
				the challenge.
			</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			{#each phases as phase (phase.number)}
				{@const phaseLessons = getPhaseLessons(phase.number)}
				<article class="card overflow-hidden">
					<div class="h-2.5 border-b-2 border-ink" style={`background: ${phase.color}`}></div>

					<div class="border-b-2 border-line px-5 py-4">
						<div class="flex items-start justify-between gap-3">
							<div>
								<p class="font-mono text-[0.62rem] font-bold tracking-widest text-muted uppercase">
									Phase {phase.number}
								</p>
								<h3 class="font-display text-2xl font-extrabold">{phase.title}</h3>
							</div>
							<span class="pill bg-white">{phaseLessons.length} lessons</span>
						</div>
						<p class="mt-1 text-sm leading-relaxed text-muted">{phase.tagline}</p>
					</div>

					<ul class="divide-y divide-line">
						{#each phaseLessons as lesson (lesson.slug)}
							{@const done = lessonIsDone(lesson)}
							<li>
								<a
									class="group flex items-center gap-3 px-4 py-3 transition hover:bg-paper"
									href={resolve(getLessonHref(lesson.slug))}
								>
									<span
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink font-mono text-[0.65rem] font-bold"
										class:bg-brand={done}
										class:bg-white={!done}
									>
										{#if done}
											✓
										{:else}
											{String(lesson.number).padStart(2, '0')}
										{/if}
									</span>

									<span class="min-w-0 flex-1">
										<span class="block truncate text-sm font-bold group-hover:underline">
											{lesson.title}
										</span>
										<span class="mt-0.5 block truncate text-xs text-muted">{lesson.summary}</span>
									</span>

									<span class="shrink-0 font-mono text-[0.65rem] text-muted">
										{lesson.minutes}m
									</span>
								</a>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section class="mt-16">
		<div class="mb-6">
			<p class="font-mono text-xs font-bold tracking-widest text-muted uppercase">How it works</p>
			<h2 class="mt-1 font-display text-4xl font-extrabold tracking-tight">Play. Read. Build.</h2>
		</div>

		<div class="grid gap-5 sm:grid-cols-3">
			<div class="card-flat p-5">
				<span
					class="font-display text-4xl font-extrabold text-brand [text-shadow:2px_2px_0_#171717]"
				>
					01
				</span>
				<h3 class="mt-3 font-display text-xl font-extrabold">Play with the demo</h3>
				<p class="mt-1 text-sm leading-relaxed text-muted">
					Click the buttons. Move your pointer. Scroll the demo box. See what changes.
				</p>
			</div>
			<div class="card-flat p-5">
				<span class="font-display text-4xl font-extrabold text-sun [text-shadow:2px_2px_0_#171717]">
					02
				</span>
				<h3 class="mt-3 font-display text-xl font-extrabold">Read the short code</h3>
				<p class="mt-1 text-sm leading-relaxed text-muted">
					Every lesson shows only the code that matters. No hidden magic. Copy it into your own
					project.
				</p>
			</div>
			<div class="card-flat p-5">
				<span
					class="font-display text-4xl font-extrabold text-pink [text-shadow:2px_2px_0_#171717]"
				>
					03
				</span>
				<h3 class="mt-3 font-display text-xl font-extrabold">Try the challenge</h3>
				<p class="mt-1 text-sm leading-relaxed text-muted">
					Change one value. Break it. Fix it. A small experiment teaches more than a long chapter.
				</p>
			</div>
		</div>
	</section>

	<footer class="mt-16 border-t-2 border-ink pt-6 text-sm text-muted">
		<p>
			Built with Svelte 5, Tailwind CSS 4, and GSAP 3.15. The written roadmap lives in
			<code class="rounded border border-line bg-white px-1.5 py-0.5 font-mono text-xs">
				docs/roadmap.md
			</code>.
		</p>
	</footer>
</main>

<style>
	.hero-board {
		position: relative;
		min-height: 420px;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		border-radius: 1.5rem;
		background-color: #171717;
		box-shadow: 8px 8px 0 var(--color-ink);
	}

	.hero-board-grid {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px);
		background-size: 22px 22px;
	}

	.hero-board-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-top: 1px solid #343a33;
		padding: 0.75rem 1rem;
		color: #b9c6b7;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
	}

	.hero-orb {
		position: absolute;
		top: 46%;
		left: 50%;
		width: 116px;
		height: 116px;
		border: 3px solid #171717;
		border-radius: 999px;
		background: radial-gradient(circle at 34% 30%, #c9ffd6, #0ae448 55%, #05a832);
		box-shadow:
			0 0 0 12px rgba(10, 228, 72, 0.14),
			0 0 60px rgba(10, 228, 72, 0.45);
		transform: translate(-50%, -50%);
	}

	.hero-chip {
		position: absolute;
		border: 2px solid #171717;
		border-radius: 0.75rem;
		background-color: #fffdf8;
		padding: 0.55rem 0.8rem;
		color: #171717;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		box-shadow: 4px 4px 0 #0ae448;
		white-space: nowrap;
	}

	.hero-chip-1 {
		top: 16%;
		left: 10%;
		transform: rotate(-6deg);
	}

	.hero-chip-2 {
		top: 24%;
		right: 8%;
		transform: rotate(5deg);
		box-shadow: 4px 4px 0 #ffb800;
	}

	.hero-chip-3 {
		bottom: 26%;
		left: 12%;
		transform: rotate(3deg);
		box-shadow: 4px 4px 0 #00b3ff;
	}

	.hero-spark {
		position: absolute;
		color: #ffb800;
		font-size: 1.5rem;
	}

	.hero-spark-1 {
		top: 12%;
		right: 18%;
	}

	.hero-spark-2 {
		bottom: 30%;
		right: 16%;
		color: #ff5c7c;
	}

	@media (max-width: 640px) {
		.hero-board {
			min-height: 340px;
		}

		.hero-orb {
			width: 92px;
			height: 92px;
		}

		.hero-chip {
			font-size: 0.65rem;
		}
	}
</style>
