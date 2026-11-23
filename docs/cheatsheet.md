# GSAP cheatsheet

A compact reference for the course. For full details, use the official docs:
<https://gsap.com/docs/v3/>.

## Install and register

```sh
pnpm add gsap
```

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

Register a plugin once in the module that uses it.

## The three tween methods

```ts
// Animate from the current state to the given state.
gsap.to('.box', { x: 100, duration: 1 });

// Animate from the given state to the current state.
gsap.from('.box', { y: 40, autoAlpha: 0, duration: 1 });

// Set both the start and the end.
gsap.fromTo('.box', { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1 });

// Set values immediately, with no tween.
gsap.set('.box', { x: 0, y: 0, rotation: 0 });
```

## Common special properties

| Property          | Meaning                           |
| ----------------- | --------------------------------- |
| `duration`        | Length in seconds. Default `0.5`  |
| `delay`           | Wait before the tween starts      |
| `ease`            | Speed curve. Default `power1.out` |
| `repeat`          | Repeat count. `-1` is infinite    |
| `repeatDelay`     | Wait before each repeat           |
| `yoyo`            | Play back on repeat               |
| `stagger`         | Delay between multiple targets    |
| `paused`          | Create the tween paused           |
| `immediateRender` | Render the start state at once    |
| `onStart`         | Callback when the tween starts    |
| `onUpdate`        | Callback on each frame            |
| `onComplete`      | Callback when the tween ends      |

## Transform aliases

Use these instead of `left`, `top`, `width`, and `height` for motion:

```ts
gsap.to('.box', {
	x: 100, // translateX in pixels
	y: -20, // translateY in pixels
	xPercent: 50, // translateX by 50% of the element width
	yPercent: -100, // translateY by 100% of the element height
	rotation: 45, // degrees
	scale: 1.2,
	scaleX: 2,
	skewX: 10,
	transformOrigin: '50% 50%'
});
```

Use `autoAlpha: 0` to fade out and set `visibility: hidden`. Use `autoAlpha: 1` to show
and fade in.

## Eases

```ts
ease: 'none'; // linear
ease: 'power2.out'; // smooth, default style
ease: 'back.out(1.7)'; // overshoot
ease: 'elastic.out(1, 0.4)';
ease: 'bounce.out';
ease: 'steps(6)';
```

Families: `power1` to `power4`, `sine`, `expo`, `circ`, `back`, `elastic`, `bounce`.
Variants: `.in`, `.out`, `.inOut`. The default variant is `.out`.

## Stagger

```ts
// Simple
gsap.to('.item', { y: -20, stagger: 0.08 });

// Advanced
gsap.to('.item', {
	y: -20,
	stagger: {
		each: 0.05,
		from: 'center', // start, center, end, edges, random, or an index
		grid: 'auto', // or [columns, rows]
		axis: 'x', // x or y
		ease: 'power2.inOut'
	}
});
```

A top-level `repeat` repeats the whole group. A `repeat` inside the stagger object
repeats each target on its own.

## Timelines

```ts
const timeline = gsap.timeline({
	defaults: {
		duration: 0.6,
		ease: 'power2.out'
	}
});

timeline.from('.a', { y: 40, autoAlpha: 0 });
timeline.to('.b', { x: 100 });
timeline.to('.c', { rotation: 180 });
```

A timeline is a container. New tweens go at the end by default. The timeline has one
playhead.

## Position parameter

The position is the third argument of timeline methods:

```ts
timeline.to('.a', { x: 100 }, 0); // absolute time in seconds
timeline.to('.b', { x: 100 }, 'label'); // at a label
timeline.to('.c', { x: 100 }, '<'); // start of the previous tween
timeline.to('.d', { x: 100 }, '>'); // end of the previous tween
timeline.to('.e', { x: 100 }, '+=0.4'); // 0.4s past the timeline end
timeline.to('.f', { x: 100 }, '-=0.2'); // overlap the timeline end by 0.2s
timeline.to('.g', { x: 100 }, '<+=0.2'); // 0.2s past the previous start
timeline.to('.h', { x: 100 }, 'label+=1'); // 1s past a label
```

```ts
timeline.addLabel('middle', 0.5);
```

## Timeline controls

```ts
timeline.play();
timeline.pause();
timeline.resume();
timeline.reverse();
timeline.restart();
timeline.seek(1.2);
timeline.progress(0.5); // 0 to 1
timeline.timeScale(2); // double speed
timeline.timeScale(0.5); // half speed
timeline.duration(); // total seconds
timeline.time(); // current seconds
timeline.progress(); // current progress
```

## Callbacks and keyframes

```ts
const timeline = gsap.timeline({
	onStart: function () {
		status = 'Started';
	},
	onUpdate: function () {
		progress = timeline.progress();
	},
	onComplete: function () {
		status = 'Done';
	}
});

timeline.call(
	function () {
		status = 'Middle';
	},
	[],
	0.8
);

gsap.to('.flame', {
	keyframes: [
		{ scaleY: 0.8, duration: 0.2 },
		{ scaleY: 1.2, duration: 0.2 },
		{ scaleY: 0.9, duration: 0.2 }
	],
	repeat: -1
});
```

## Cleanup

```ts
import { onMount } from 'svelte';

let stage: HTMLDivElement;

onMount(() => {
	const context = gsap.context(() => {
		gsap.to('.box', { x: 100, repeat: -1 });
	}, stage);

	return () => context.revert();
});
```

`gsap.context()` collects tweens, timelines, and ScrollTriggers. `revert()` kills them
and removes the inline styles.

If you use SplitText, revert it too:

```ts
return () => {
	split.revert();
	context.revert();
};
```

If you use Draggable or Observer, call `kill()` on each instance.

## matchMedia

```ts
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

		let duration = 0.8;

		if (conditions.reduceMotion === true) {
			duration = 0;
		}

		let x = 40;

		if (conditions.isDesktop === true) {
			x = 130;
		}

		gsap.to('.box', {
			x: x,
			duration: duration
		});
	},
	stage
);

// On cleanup:
// media.revert();
```

The handler runs when any condition matches. GSAP reverts the handler's animations when
the conditions stop matching.

## ScrollTrigger

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.from('.card', {
	y: 40,
	autoAlpha: 0,
	scrollTrigger: {
		trigger: '.card',
		start: 'top 85%',
		end: 'top 40%',
		toggleActions: 'play none none reverse',
		markers: true
	}
});
```

### Key settings

| Setting         | Meaning                                                |
| --------------- | ------------------------------------------------------ |
| `trigger`       | Element to watch                                       |
| `scroller`      | Scroll container. Default is the window                |
| `start`         | Start position, for example `'top 80%'`                |
| `end`           | End position, for example `'bottom top'` or `'+=500'`  |
| `scrub`         | Link progress to scroll. A number smooths the catch-up |
| `pin`           | Hold the trigger in place                              |
| `snap`          | Snap to points, labels, or numbers                     |
| `toggleActions` | Enter, leave, enter back, leave back                   |
| `once`          | Run once, then kill the trigger                        |
| `markers`       | Show debug lines                                       |

`toggleActions: 'play pause resume reset'` maps to enter, leave, enter back, leave back.
Allowed actions: `play`, `pause`, `resume`, `reset`, `restart`, `complete`, `reverse`,
`none`.

### Scrub and pin

```ts
const timeline = gsap.timeline({
	scrollTrigger: {
		trigger: '.pin-section',
		start: 'top top',
		end: '+=600',
		scrub: 1,
		pin: true
	}
});

timeline.to('.box', {
	x: 300,
	rotation: 180,
	ease: 'none'
});
```

Use `ease: 'none'` for scrubbed motion. Add space before and after a pinned section.

### Snap

```ts
snap: {
  snapTo: 'labels',
  duration: { min: 0.2, max: 0.7 },
  delay: 0.1,
  ease: 'power1.inOut'
}
```

Labels must exist on the timeline. `snapTo` also accepts numbers, arrays, and functions.

### Refresh

```ts
ScrollTrigger.refresh();
```

Call this after fonts, images, or layout changes that move the trigger positions.

## Plugins used in this course

| Plugin             | Use                                 | Register                                |
| ------------------ | ----------------------------------- | --------------------------------------- |
| `ScrollTrigger`    | Scroll-driven animation             | `gsap.registerPlugin(ScrollTrigger)`    |
| `SplitText`        | Split text into lines, words, chars | `gsap.registerPlugin(SplitText)`        |
| `DrawSVGPlugin`    | Draw SVG strokes                    | `gsap.registerPlugin(DrawSVGPlugin)`    |
| `MorphSVGPlugin`   | Morph one path into another         | `gsap.registerPlugin(MorphSVGPlugin)`   |
| `MotionPathPlugin` | Move along a path                   | `gsap.registerPlugin(MotionPathPlugin)` |
| `Flip`             | Animate layout changes              | `gsap.registerPlugin(Flip)`             |
| `Draggable`        | Drag with mouse and touch           | `gsap.registerPlugin(Draggable)`        |
| `InertiaPlugin`    | Momentum for Draggable              | `gsap.registerPlugin(InertiaPlugin)`    |
| `Observer`         | Normalize wheel, touch, pointer     | `gsap.registerPlugin(Observer)`         |

## SplitText

```ts
const split = SplitText.create('.headline', {
	type: 'chars,words,lines',
	mask: 'lines',
	linesClass: 'split-line'
});

gsap.from(split.chars, {
	yPercent: 120,
	autoAlpha: 0,
	stagger: 0.03,
	duration: 0.6
});

// On cleanup:
// split.revert();
```

## DrawSVG

```ts
gsap.fromTo('.path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, stagger: 0.2 });
```

`'20% 80%'` shows only that segment. `'50% 50%'` starts as a point in the middle.

## MorphSVG

```ts
gsap.to('#shape', {
	morphSVG: '#star',
	duration: 0.8,
	ease: 'power2.inOut'
});
```

The target can be a selector, an element, raw path data, or a point list.

## MotionPath

```ts
gsap.to('#rocket', {
	motionPath: {
		path: '#flight-path',
		align: '#flight-path',
		alignOrigin: [0.5, 0.5],
		autoRotate: true
	},
	duration: 3,
	ease: 'power1.inOut'
});
```

## Flip

```ts
import { tick } from 'svelte';

const state = Flip.getState(cards);
layout = 'list';
await tick();

Flip.from(state, {
	duration: 0.6,
	ease: 'power2.inOut',
	absolute: true,
	stagger: 0.04
});
```

## Draggable

```ts
const draggables = Draggable.create('.token', {
	type: 'x,y',
	bounds: '.tray',
	inertia: true,
	edgeResistance: 0.75
});

// On cleanup:
// for (const item of draggables) {
//   item.kill();
// }
```

## Observer

```ts
const observer = Observer.create({
	target: '.deck',
	type: 'wheel,touch',
	onDown: nextSlide,
	onUp: previousSlide,
	tolerance: 10,
	preventDefault: true
});

// On cleanup:
// observer.kill();
```

## fast updates: quickTo and quickSetter

```ts
const moveX = gsap.quickTo('.follower', 'x', {
	duration: 0.35,
	ease: 'power2.out'
});

moveX(240);
```

`quickTo` smooths with one reusable tween. `quickSetter` sets a value with no tween.

## Utility methods

```ts
gsap.utils.toArray('.item');
gsap.utils.random(-100, 100);
gsap.utils.random(-100, 100, 5); // round to 5
gsap.utils.mapRange(0, 100, 0, 360, 25); // 90
gsap.utils.clamp(-30, 30, 90); // 30
gsap.utils.wrap(0, 10, 12); // 2
gsap.utils.shuffle([1, 2, 3]);
gsap.utils.distribute({ base: 0, amount: 1 });
gsap.utils.interpolate(0, 100, 0.5); // 50
```

## Common mistakes

| Mistake                                   | Fix                                                    |
| ----------------------------------------- | ------------------------------------------------------ |
| `duration: 500`                           | Use seconds: `0.5`                                     |
| Animate `left` and `top`                  | Use `x` and `y`                                        |
| `opacity: 0` but the element still clicks | Use `autoAlpha: 0`                                     |
| New tween on every pointer move           | Use `quickTo()`                                        |
| No cleanup                                | Return `() => context.revert()`                        |
| ScrollTrigger positions are wrong         | Call `ScrollTrigger.refresh()`                         |
| Pin looks stuck                           | Add scroll space before and after                      |
| Flip jumps                                | Pass `absolute: true` and wait for `tick()`            |
| SplitText leaves wrappers                 | Call `split.revert()`                                  |
| `from()` ends at the wrong value          | Use `fromTo()` or check the current state              |
| `stagger` repeats the group               | Put `repeat` inside the stagger object for each target |
| Selector hits the wrong element           | Scope with `gsap.context(callback, parent)`            |
