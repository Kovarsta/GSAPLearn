# GSAP Lab

A small, hands-on GSAP course. You learn by playing with a live demo, reading a short
piece of code, and changing one value at a time.

The course starts at `gsap.to()` and ends at scroll-driven scenes, SVG plugins, Flip,
Draggable, and a launch-sequence capstone.

## Run the app

```sh
pnpm install
pnpm dev
```

Open the local URL that Vite prints. The home page is the course map.

Useful commands:

```sh
pnpm run check
pnpm run lint
pnpm run build
pnpm run format
```

## What is in this repository

```text
docs/                         Written course material
docs/roadmap.md               The full learning path
docs/lesson-blueprint.md      How a lesson is built
docs/cheatsheet.md            GSAP quick reference

src/lib/course.ts             Lesson and phase metadata
src/lib/progress.svelte.ts    Progress saved in localStorage
src/lib/lesson-kit/           Shared lesson components
src/lib/components/Sidebar.svelte

src/routes/+page.svelte       Course home and roadmap
src/routes/lessons/01-.../    One folder per lesson
src/routes/lessons/22-.../
```

## How a lesson works

Each lesson follows the same shape:

1. A short goal list.
2. A live demo that you can touch.
3. A short explanation in small steps.
4. The code that runs the demo.
5. A challenge that changes one idea.

Every lesson folder is self-contained. The page file holds the demo markup, the GSAP
code, the explanation, and the page styles. This keeps a lesson easy to read from top
to bottom.

## Course rules

- One lesson teaches one idea.
- Code uses clear names and explicit `if` statements.
- No clever shorthand and no deep nesting.
- Every animation has a cleanup path.
- Every demo works with a mouse and a touch screen.
- Every lesson is short enough for one sitting.

## Tech

- Svelte 5 with runes
- SvelteKit 3
- Tailwind CSS 4
- GSAP 3.15.1
- TypeScript

## Start here

Read [roadmap.md](roadmap.md). Then open lesson 01 in the app.
