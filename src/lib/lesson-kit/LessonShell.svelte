<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import {
		getLessonHref,
		getNextLesson,
		getPhase,
		getPreviousLesson,
		type Lesson
	} from '#lib/course.ts';
	import { isLessonComplete, toggleLessonComplete } from '#lib/progress.svelte.ts';

	type Props = {
		lesson: Lesson;
		children: Snippet;
	};

	let { lesson, children }: Props = $props();

	const phase = $derived(getPhase(lesson.phase));
	const previousLesson = $derived(getPreviousLesson(lesson.slug));
	const nextLesson = $derived(getNextLesson(lesson.slug));
	const lessonNumber = $derived(String(lesson.number).padStart(2, '0'));

	let completed = $derived(isLessonComplete(lesson.slug));
</script>

<svelte:head>
	<title>{lesson.title} · GSAP Lab</title>
	<meta name="description" content={lesson.summary} />
</svelte:head>

<article class="lesson-shell">
	<header>
		<a
			class="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink"
			href={resolve('/')}
		>
			<span aria-hidden="true">←</span>
			Roadmap
		</a>

		<div class="mb-4 flex flex-wrap items-center gap-2">
			<span class="pill" style={`background: ${phase.softColor}`}>
				Phase {phase.number} · {phase.title}
			</span>
			<span class="pill bg-white">{lesson.level}</span>
			<span class="pill bg-white">{lesson.minutes} min</span>
		</div>

		<p class="mb-2 font-mono text-xs font-bold tracking-widest text-muted uppercase">
			Lesson {lessonNumber}
		</p>
		<h1 class="font-display text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-5xl">
			{lesson.title}
		</h1>
		<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{lesson.summary}</p>

		<div class="card-flat mt-6 p-4 sm:p-5">
			<p class="mb-2 font-mono text-[0.68rem] font-bold tracking-widest text-muted uppercase">
				You will learn
			</p>
			<ul class="grid gap-2 sm:grid-cols-3">
				{#each lesson.goals as goal (goal)}
					<li class="flex gap-2 text-sm leading-snug">
						<span class="mt-0.5 text-brand" aria-hidden="true">◆</span>
						<span>{goal}</span>
					</li>
				{/each}
			</ul>
		</div>
	</header>

	<div class="lesson-body mt-8">
		{@render children()}
	</div>

	<footer class="mt-12 border-t-2 border-line pt-6">
		<button
			class="btn"
			class:btn-primary={!completed}
			class:btn-ink={completed}
			type="button"
			aria-pressed={completed}
			onclick={() => toggleLessonComplete(lesson.slug)}
		>
			{#if completed}
				<span aria-hidden="true">✓</span>
				Completed
			{:else}
				Mark this lesson complete
			{/if}
		</button>

		<nav class="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Lesson navigation">
			{#if previousLesson !== null}
				<a
					class="card-flat group p-4 transition hover:-translate-y-0.5"
					href={resolve(getLessonHref(previousLesson.slug))}
				>
					<span class="text-xs font-bold tracking-wide text-muted uppercase">← Previous</span>
					<span class="mt-1 block font-display text-lg font-bold group-hover:underline">
						{previousLesson.title}
					</span>
				</a>
			{:else}
				<a class="card-flat group p-4 transition hover:-translate-y-0.5" href={resolve('/')}>
					<span class="text-xs font-bold tracking-wide text-muted uppercase">← Back to</span>
					<span class="mt-1 block font-display text-lg font-bold group-hover:underline">
						Roadmap
					</span>
				</a>
			{/if}

			{#if nextLesson !== null}
				<a
					class="card-flat group p-4 text-right transition hover:-translate-y-0.5"
					href={resolve(getLessonHref(nextLesson.slug))}
				>
					<span class="text-xs font-bold tracking-wide text-muted uppercase">Next →</span>
					<span class="mt-1 block font-display text-lg font-bold group-hover:underline">
						{nextLesson.title}
					</span>
				</a>
			{:else}
				<a
					class="card-flat group p-4 text-right transition hover:-translate-y-0.5"
					href={resolve('/')}
				>
					<span class="text-xs font-bold tracking-wide text-muted uppercase">
						Course complete →
					</span>
					<span class="mt-1 block font-display text-lg font-bold group-hover:underline">
						Back to the roadmap
					</span>
				</a>
			{/if}
		</nav>
	</footer>
</article>
