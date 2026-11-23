<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getLessonHref, getPhaseLessons, lessons, phases } from '#lib/course.ts';
	import { isLessonComplete, loadProgress, progress, resetProgress } from '#lib/progress.svelte.ts';

	let menuOpen = $state(false);

	onMount(loadProgress);

	const pathname = $derived(page.url.pathname);
	const completedCount = $derived(progress.completedSlugs.length);
	const percent = $derived(
		Math.min(100, Math.round((progress.completedSlugs.length / lessons.length) * 100))
	);

	function closeMenu(): void {
		menuOpen = false;
	}
</script>

<div class="sidebar-slot">
	<header
		class="mobile-header sticky top-0 items-center justify-between border-b-2 border-ink bg-paper px-4 py-3"
	>
		<a
			class="font-display text-xl font-extrabold tracking-tight"
			href={resolve('/')}
			onclick={closeMenu}
		>
			GSAP<span class="text-brand">·</span>Lab
		</a>
		<button
			class="btn btn-sm"
			type="button"
			aria-expanded={menuOpen}
			aria-controls="course-navigation"
			onclick={() => (menuOpen = !menuOpen)}
		>
			{menuOpen ? 'Close' : 'Lessons'}
		</button>
	</header>

	{#if menuOpen}
		<button
			class="menu-backdrop"
			type="button"
			aria-label="Close the lesson menu"
			onclick={closeMenu}
		></button>
	{/if}

	<aside
		id="course-navigation"
		class="sidebar flex flex-col overflow-y-auto border-r-2 border-ink bg-[#fffdf8]"
		class:is-open={menuOpen}
	>
		<div class="flex items-center justify-between border-b-2 border-ink px-5 py-4">
			<a
				class="font-display text-2xl font-extrabold tracking-tight"
				href={resolve('/')}
				onclick={closeMenu}
			>
				GSAP<span class="text-brand">·</span>Lab
			</a>
			<button
				class="btn btn-sm min-[900px]:hidden"
				type="button"
				onclick={closeMenu}
				aria-label="Close the lesson menu"
			>
				Close
			</button>
		</div>

		<div class="border-b-2 border-line px-5 py-5">
			<div class="mb-2 flex items-baseline justify-between gap-3">
				<span class="font-mono text-[0.65rem] font-bold tracking-widest text-muted uppercase">
					Your progress
				</span>
				<span class="font-mono text-xs font-bold">{completedCount} / {lessons.length}</span>
			</div>
			<div class="h-3 overflow-hidden rounded-full border-2 border-ink bg-white">
				<div
					class="h-full rounded-full bg-brand transition-[width] duration-300"
					style={`width: ${percent}%`}
				></div>
			</div>
			<p class="mt-2 text-xs leading-relaxed text-muted">
				{percent}% complete. Progress stays in this browser.
			</p>
		</div>

		<nav class="flex-1 px-3 py-4" aria-label="Course lessons">
			{#each phases as phase (phase.number)}
				{@const phaseLessons = getPhaseLessons(phase.number)}
				<div class="mb-6">
					<div class="mb-2 flex items-center gap-2 px-2">
						<span
							class="h-2.5 w-2.5 rounded-full border border-ink"
							style={`background: ${phase.color}`}
							aria-hidden="true"
						></span>
						<span class="font-mono text-[0.64rem] font-bold tracking-widest text-muted uppercase">
							{phase.title}
						</span>
					</div>

					<ul class="space-y-1">
						{#each phaseLessons as lesson (lesson.slug)}
							{@const href = resolve(getLessonHref(lesson.slug))}
							{@const active = pathname === href}
							{@const done = isLessonComplete(lesson.slug)}
							<li>
								<a
									class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm leading-snug transition hover:bg-paper-deep"
									class:bg-brand={active}
									class:font-bold={active}
									{href}
									onclick={closeMenu}
									aria-current={active ? 'page' : undefined}
								>
									<span class="w-5 shrink-0 font-mono text-[0.65rem] text-muted">
										{String(lesson.number).padStart(2, '0')}
									</span>
									<span class="flex-1">{lesson.title}</span>
									{#if done}
										<span
											class="rounded-full border border-ink bg-white px-1.5 py-0.5 text-[0.6rem] font-bold"
											aria-label="Completed"
										>
											✓
										</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>

		<div class="border-t-2 border-line px-5 py-4">
			{#if completedCount > 0}
				<button
					class="text-xs font-bold text-muted underline decoration-2 underline-offset-4 hover:text-ink"
					type="button"
					onclick={resetProgress}
				>
					Reset progress
				</button>
			{:else}
				<p class="text-xs leading-relaxed text-muted">Pick lesson 01 and make something move.</p>
			{/if}
		</div>
	</aside>
</div>
