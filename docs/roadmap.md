# GSAP Lab roadmap

This roadmap takes you from your first tween to advanced scroll, SVG, and interaction
work. The full course has 22 lessons in 6 phases. Most lessons take 6 to 12 minutes.

## What you will be able to do

By the end, you can:

- Animate CSS transforms, colors, and visibility with tweens.
- Control speed curves with eases.
- Sequence many tweens with timelines and the position parameter.
- Run code at exact moments with callbacks.
- Build responsive animation and clean it up on page changes.
- Create scroll-driven reveals, pinned scenes, and snap points.
- Split text, draw and morph SVG, and move elements along paths.
- Animate layout changes with Flip.
- Build drag, swipe, and pointer interactions.
- Combine the pieces in one planned sequence.

## How to use the course

1. Open the lesson in the app.
2. Play with the demo first. Click every button.
3. Read the explanation. Stop at the code block and read it line by line.
4. Try the challenge. Change one value and run it again.
5. Mark the lesson complete when you can explain the main idea in your own words.

Do not copy every demo into a separate project. Change the demo in place. Small
experiments are the fastest way to learn.

## Phase 1: Foundations

Goal: make one element move with control.

| #   | Lesson                 | Route                                | You learn                                  | Time  |
| --- | ---------------------- | ------------------------------------ | ------------------------------------------ | ----- |
| 01  | Your first tween       | `/lessons/01-first-tween`            | `gsap.to()`, duration, repeat, yoyo        | 6 min |
| 02  | From and fromTo        | `/lessons/02-from-and-fromto`        | `from()`, `fromTo()`, current state        | 7 min |
| 03  | Targets and properties | `/lessons/03-targets-and-properties` | selectors, transforms, `autoAlpha`, colors | 7 min |
| 04  | Eases                  | `/lessons/04-eases`                  | speed curves and ease settings             | 8 min |
| 05  | Stagger                | `/lessons/05-stagger`                | `stagger`, `from`, `grid`, `axis`          | 8 min |

**Checkpoint:** animate a row of five elements with a center-out stagger and a calm
ease. Add a replay button.

## Phase 2: Timelines

Goal: direct many tweens like a small scene.

| #   | Lesson                  | Route                                 | You learn                                              | Time   |
| --- | ----------------------- | ------------------------------------- | ------------------------------------------------------ | ------ |
| 06  | Timelines               | `/lessons/06-timelines`               | sequence, defaults, one playhead                       | 8 min  |
| 07  | The position parameter  | `/lessons/07-position-parameter`      | absolute time, labels, `<`, `>`, offsets               | 9 min  |
| 08  | Timeline controls       | `/lessons/08-timeline-controls`       | play, pause, reverse, seek, `timeScale`                | 8 min  |
| 09  | Callbacks and keyframes | `/lessons/09-callbacks-and-keyframes` | `onStart`, `onUpdate`, `onComplete`, `call`, keyframes | 9 min  |
| 10  | Responsive and cleanup  | `/lessons/10-responsive-and-cleanup`  | `matchMedia`, `context`, `revert`                      | 10 min |

**Checkpoint:** build a 3-beat sequence with a label, a callback that changes text, and a
cleanup function. Test it at a narrow and a wide viewport.

## Phase 3: Scroll

Goal: let the scrollbar drive the story.

| #   | Lesson               | Route                              | You learn                          | Time   |
| --- | -------------------- | ---------------------------------- | ---------------------------------- | ------ |
| 11  | ScrollTrigger basics | `/lessons/11-scrolltrigger-basics` | trigger, start, end, toggleActions | 10 min |
| 12  | Scrub and pin        | `/lessons/12-scrub-and-pin`        | scrub, pin, `end`, linear ease     | 10 min |
| 13  | ScrollTrigger pro    | `/lessons/13-scrolltrigger-pro`    | snap, labels, progress callbacks   | 12 min |

**Checkpoint:** build a short page with three reveal cards and one pinned panel. Add a
progress bar driven by `onUpdate`.

## Phase 4: Text and SVG

Goal: animate the parts that normal CSS cannot reach.

| #   | Lesson     | Route                     | You learn                               | Time   |
| --- | ---------- | ------------------------- | --------------------------------------- | ------ |
| 14  | SplitText  | `/lessons/14-split-text`  | split lines, words, chars; mask; revert | 9 min  |
| 15  | DrawSVG    | `/lessons/15-draw-svg`    | draw a stroke, segments, percentages    | 8 min  |
| 16  | MorphSVG   | `/lessons/16-morph-svg`   | morph to a path, raw data, point order  | 9 min  |
| 17  | MotionPath | `/lessons/17-motion-path` | follow a path, align, autoRotate        | 10 min |

**Checkpoint:** make a headline split into chars, draw a line under it, and send a small
shape along that line.

## Phase 5: Interaction

Goal: react to the user without writing an event system.

| #   | Lesson            | Route                            | You learn                                     | Time   |
| --- | ----------------- | -------------------------------- | --------------------------------------------- | ------ |
| 18  | Flip              | `/lessons/18-flip`               | First, Last, Invert, Play; `getState`, `from` | 10 min |
| 19  | Draggable         | `/lessons/19-draggable`          | drag types, bounds, inertia, cleanup          | 9 min  |
| 20  | Observer          | `/lessons/20-observer`           | wheel, touch, pointer; direction callbacks    | 9 min  |
| 21  | quickTo and utils | `/lessons/21-quick-to-and-utils` | fast pointer updates, math helpers            | 10 min |

**Checkpoint:** build a card grid that flips between two layouts and a draggable token
inside a bounded tray.

## Phase 6: Boss level

Goal: plan and finish a complete sequence.

| #   | Lesson                    | Route                  | You learn                                                  | Time   |
| --- | ------------------------- | ---------------------- | ---------------------------------------------------------- | ------ |
| 22  | Capstone: launch sequence | `/lessons/22-capstone` | planning, timeline, SplitText, stagger, callbacks, cleanup | 15 min |

**Final challenge:** build your own 20-second sequence. It must use at least one
timeline, one callback, one stagger, and one cleanup path. Add a replay button that
returns every element to its start state.

## Study plans

### Three-day sprint

- Day 1: phases 1 and 2.
- Day 2: phase 3 and the first two lessons of phase 4.
- Day 3: the rest of phase 4, phase 5, and the capstone.

### One week

- Day 1: lessons 01 to 03.
- Day 2: lessons 04 to 06.
- Day 3: lessons 07 to 09.
- Day 4: lesson 10 and 11.
- Day 5: lessons 12 to 14.
- Day 6: lessons 15 to 18.
- Day 7: lessons 19 to 22.

### Slow and steady

Do one lesson each day. Rebuild the demo from memory before you open the next lesson.
That habit is worth more than speed.

## Bonus topics

These topics are not in the core path. Use them after the capstone.

- **CustomEase**: draw your own ease curve.
- **ScrollSmoother**: smooth scrolling with a wrapper structure.
- **ScrollTo**: animate the scroll position.
- **Observer + ScrollTrigger**: full-screen step experiences.
- **MotionPathHelper**: edit a path in the browser.
- **GSDevTools**: scrub and slow down any timeline.
- **Flip.batch()**: coordinate many Flip changes.
- **Physics2D**: simple 2D physics for playful interfaces.
- **PixiPlugin**: animate PixiJS objects with the GSAP API.
- **useGSAP**: the official React hook. Svelte uses `onMount` and `gsap.context()`.

## Completion checklist

- [ ] I can write a tween without looking at a reference.
- [ ] I can explain the difference between `to`, `from`, and `fromTo`.
- [ ] I can build a timeline and place a tween on a label.
- [ ] I can pause, reverse, and seek a timeline.
- [ ] I can clean up every animation in a component.
- [ ] I can build a scroll reveal and a pinned scrub scene.
- [ ] I can split text and revert it.
- [ ] I can draw and morph an SVG path.
- [ ] I can animate a layout change with Flip.
- [ ] I can build a drag or swipe interaction.
- [ ] I finished a planned sequence with a replay path.

## Reference

- [Lesson blueprint](lesson-blueprint.md): how each lesson is built.
- [Cheatsheet](cheatsheet.md): a compact API reminder.
- Official docs: <https://gsap.com/docs/v3/>
