# GSAP Lab

A hands-on GSAP course built with Svelte 5 and SvelteKit. Learn animation from your
first tween to ScrollTrigger, SplitText, Flip, Draggable, and a launch-sequence
capstone.

The written roadmap is in [docs/roadmap.md](docs/roadmap.md).

## Run it

```sh
pnpm install
pnpm dev
```

Open the URL that Vite prints.

```sh
pnpm run check
pnpm run lint
pnpm run build
```

## Course layout

- 6 phases, 22 lessons, about 3 hours in total.
- Each lesson has a live demo, a short explanation, a code block, and a challenge.
- Each lesson is a separate route under `src/routes/lessons/`.
- Shared lesson components live in `src/lib/lesson-kit/`.
- Lesson metadata lives in `src/lib/course.ts`.
- Progress is saved in the browser with `localStorage`.
- Free practice lives at `/sandbox`. Each lesson stays untouched.

## Docs

- [Roadmap](docs/roadmap.md)
- [Lesson blueprint](docs/lesson-blueprint.md)
- [Cheatsheet](docs/cheatsheet.md)
- [Learning log](docs/learning-log.md) (blank notebook for your own study notes)

## Stack

Svelte 5, SvelteKit 3, Tailwind CSS 4, TypeScript, GSAP 3.15.1.
