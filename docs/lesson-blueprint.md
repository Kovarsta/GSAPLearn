# Lesson blueprint

Every lesson uses the same structure. This keeps the course predictable. A reader always
knows where to look.

## The shared kit

The shared parts live in `src/lib/lesson-kit/`.

| File                 | Job                                                     |
| -------------------- | ------------------------------------------------------- |
| `LessonShell.svelte` | Page frame, goals, progress button, previous/next links |
| `DemoStage.svelte`   | The framed area for the live demo                       |
| `CodeBlock.svelte`   | Dark code panel with a copy button                      |

Course data lives in `src/lib/course.ts`. Progress lives in
`src/lib/progress.svelte.ts`.

## The lesson folder

Each lesson has one numbered folder:

```text
src/routes/lessons/01-first-tween/
└── +page.svelte
```

A lesson can hold a small local component when the demo needs its own mount and unmount
cycle. Lesson 10 uses this pattern:

```text
src/routes/lessons/10-responsive-and-cleanup/
├── +page.svelte
└── Spinner.svelte
```

Keep the page in one file when you can. Split a file only when a child component makes
the demo easier to understand.

## Add a lesson in six steps

1. Add the lesson metadata to `src/lib/course.ts`.
2. Create the folder `src/routes/lessons/<number>-<slug>/`.
3. Copy the page template below into `+page.svelte`.
4. Change `getLesson('<number>-<slug>')`.
5. Build the demo, run it, and add the snippet.
6. Run `pnpm run check` and `pnpm run lint`.

The lesson number in the folder name, the `number` field, and the `slug` field must
match. The sidebar uses the metadata. The route uses the folder name.

## Page template

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CodeBlock from '#lib/lesson-kit/CodeBlock.svelte';
	import DemoStage from '#lib/lesson-kit/DemoStage.svelte';
	import LessonShell from '#lib/lesson-kit/LessonShell.svelte';
	import { getLesson } from '#lib/course.ts';

	const lesson = getLesson('01-first-tween');

	let stage = $state<HTMLDivElement | null>(null);

	onMount(() => {
		if (stage === null) {
			return;
		}

		const context = gsap.context(() => {
			gsap.from('.demo-item', {
				y: 40,
				autoAlpha: 0,
				duration: 0.6,
				ease: 'power2.out'
			});
		}, stage);

		return () => context.revert();
	});

	const snippet = `
gsap.from('.demo-item', {
  y: 40,
  autoAlpha: 0,
  duration: 0.6,
  ease: 'power2.out'
});
`;
</script>

<LessonShell {lesson}>
	<DemoStage hint="One short instruction for the reader.">
		<div class="stage" bind:this={stage}>
			<div class="demo-item">Hello</div>
			<button class="btn btn-primary btn-sm" type="button" onclick={replay}>Replay</button>
		</div>
	</DemoStage>

	<h2>The idea</h2>
	<p>Explain the idea in a few short sentences.</p>

	<CodeBlock code={snippet} title="A short title" />

	<h2>The details</h2>
	<ul>
		<li>Explain one setting.</li>
		<li>Explain another setting.</li>
	</ul>

	<div class="callout callout-tip">
		<span class="callout-title">Tip</span>
		<p>Add one useful tip.</p>
	</div>

	<div class="callout callout-challenge">
		<span class="callout-title">Challenge</span>
		<p>Ask the reader to change one value.</p>
	</div>
</LessonShell>

<style>
	.stage {
		display: flex;
		min-height: 240px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.demo-item {
		border: 2px solid var(--color-ink);
		border-radius: 1rem;
		background: var(--color-brand);
		padding: 1rem;
	}
</style>
```

The template calls `replay` in the button but does not define it. Add the function when
you build the demo.

## Code rules

This course uses code that a junior developer can read without help.

- Use one idea per function.
- Use clear names such as `launchTimeline`, `moveToken`, or `handlePointerMove`.
- Use `const` by default. Use `let` only for values that change.
- Write full `if` statements. Avoid nested ternaries.
- Avoid optional chaining in lesson code when a simple `if` is clearer.
- Keep functions short. If a function needs a scroll, split it.
- Add a comment for each block that does one job.
- Do not hide GSAP calls behind a custom wrapper. Readers must see the real API.
- Do not use `$effect` to start animations. Use `onMount` for setup.
- Return a cleanup function from `onMount`.
- Use `gsap.context()` or `gsap.matchMedia()` for cleanup.
- Register a plugin at the top of the page that uses it.
- Use `autoAlpha` instead of `opacity` when visibility matters.
- Prefer transforms (`x`, `y`, `scale`, `rotation`) over layout properties.
- Keep the demo inside the stage. Use a scoped selector or element references.

## Cleanup pattern

Use this pattern for every page:

```ts
onMount(() => {
	if (stage === null) {
		return;
	}

	const context = gsap.context(() => {
		// Create tweens, timelines, ScrollTriggers, and Draggables here.
	}, stage);

	return () => {
		context.revert();
	};
});
```

If you create a `SplitText` instance, revert it too:

```ts
return () => {
	if (split !== null) {
		split.revert();
	}

	context.revert();
};
```

If you create a `Draggable`, call `kill()` on every item. If you create a raw
`Observer`, call `kill()`.

## Demo design checklist

- The demo starts without a click.
- The replay button returns the demo to a clean start.
- The demo works with a mouse and with touch.
- The stage has a fixed minimum height, so the page does not jump.
- The main action is visible without scrolling inside the page.
- Controls use real buttons, not clickable `div` elements.
- The control labels say what happens, not "Click here".
- The demo does not trap page scroll unless that is the point of the lesson.
- The code snippet matches the real code closely.
- The challenge changes one idea, not five.

## Documentation checklist

- The lesson has three goals in `course.ts`.
- The summary is one sentence.
- The explanation uses short sentences.
- The code block shows only the code that matters.
- One tip callout and one challenge callout are enough.
- The lesson ends with a replayable state or a clear next step.

## Common mistakes

| Mistake                              | Result                                     | Fix                               |
| ------------------------------------ | ------------------------------------------ | --------------------------------- |
| Selector text without a scope        | Animation hits another page element        | Pass a parent to `gsap.context()` |
| No cleanup                           | Repeating tweens run after the page leaves | Return `() => context.revert()`   |
| New tween on every pointer move      | Too many tweens and jank                   | Use `gsap.quickTo()`              |
| `duration: 500`                      | A 500 second animation                     | Use seconds: `0.5`                |
| `left` and `top` for motion          | Layout work on every frame                 | Use `x` and `y`                   |
| `opacity: 0` alone                   | The element still catches clicks           | Use `autoAlpha: 0`                |
| ScrollTrigger before layout is ready | Wrong start and end values                 | Call `ScrollTrigger.refresh()`    |
| `Flip.from()` before the DOM updates | Flip measures the old layout               | `await tick()`                    |
| Pin without scroll space             | The scene looks stuck                      | Add content before and after      |
| SplitText without `revert()`         | Wrapper elements stay in the DOM           | Call `split.revert()`             |

## Add the route to the sidebar

The sidebar reads `lessons` from `course.ts`. You do not edit the sidebar for each
lesson. Add the metadata and the route appears in the correct phase.
