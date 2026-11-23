export type LessonLevel = 'Starter' | 'Core' | 'Advanced' | 'Boss';

import type { Path } from '$app/types';

export type Phase = {
	number: number;
	title: string;
	tagline: string;
	color: string;
	softColor: string;
};

export type Lesson = {
	number: number;
	slug: string;
	title: string;
	summary: string;
	goals: string[];
	minutes: number;
	level: LessonLevel;
	phase: number;
};

export const phases: Phase[] = [
	{
		number: 1,
		title: 'Foundations',
		tagline: 'Tweens, targets, eases, and staggers.',
		color: '#0ae448',
		softColor: '#d8ffe2'
	},
	{
		number: 2,
		title: 'Timelines',
		tagline: 'Put many tweens in order and control the playhead.',
		color: '#ffb800',
		softColor: '#fff2c7'
	},
	{
		number: 3,
		title: 'Scroll',
		tagline: 'Let the scrollbar drive the story.',
		color: '#00b3ff',
		softColor: '#d8f3ff'
	},
	{
		number: 4,
		title: 'Text and SVG',
		tagline: 'Make words, lines, and shapes move.',
		color: '#ff5c7c',
		softColor: '#ffe1e7'
	},
	{
		number: 5,
		title: 'Interaction',
		tagline: 'Flip layouts, drag items, and follow the pointer.',
		color: '#8b5cf6',
		softColor: '#efe7ff'
	},
	{
		number: 6,
		title: 'Boss level',
		tagline: 'Combine the pieces in one launch sequence.',
		color: '#171717',
		softColor: '#e8e4da'
	}
];

export const lessons: Lesson[] = [
	{
		number: 1,
		slug: '01-first-tween',
		title: 'Your first tween',
		summary: 'Move one element with gsap.to(). Learn duration, repeat, and yoyo.',
		goals: [
			'Read the three parts of gsap.to()',
			'Use duration in seconds',
			'Loop an animation with repeat and yoyo'
		],
		minutes: 6,
		level: 'Starter',
		phase: 1
	},
	{
		number: 2,
		slug: '02-from-and-fromto',
		title: 'From and fromTo',
		summary: 'Create enter animations. Compare gsap.from() with gsap.fromTo().',
		goals: [
			'Animate from a start value to the current value',
			'Set both start and end values',
			'Choose the right method for the job'
		],
		minutes: 7,
		level: 'Starter',
		phase: 1
	},
	{
		number: 3,
		slug: '03-targets-and-properties',
		title: 'Targets and properties',
		summary: 'Select elements and animate transforms, colors, and visibility.',
		goals: [
			'Target one element, many elements, or a list',
			'Use x and y instead of left and top',
			'Animate opacity, colors, and border radius'
		],
		minutes: 7,
		level: 'Starter',
		phase: 1
	},
	{
		number: 4,
		slug: '04-eases',
		title: 'Eases',
		summary: 'Control the speed curve. Make motion feel natural, snappy, or silly.',
		goals: [
			'Understand what an ease does',
			'Compare power, back, elastic, bounce, and steps',
			'Change the strength of an ease'
		],
		minutes: 8,
		level: 'Starter',
		phase: 1
	},
	{
		number: 5,
		slug: '05-stagger',
		title: 'Stagger',
		summary: 'Animate many elements with a small delay between each one.',
		goals: [
			'Use the simple stagger number',
			'Start from the center or random order',
			'Build a grid wave with the advanced object'
		],
		minutes: 8,
		level: 'Starter',
		phase: 1
	},
	{
		number: 6,
		slug: '06-timelines',
		title: 'Timelines',
		summary: 'Put tweens in order and control them as one unit.',
		goals: ['Create a timeline', 'Add tweens in sequence', 'Set defaults for every child tween'],
		minutes: 8,
		level: 'Core',
		phase: 2
	},
	{
		number: 7,
		slug: '07-position-parameter',
		title: 'The position parameter',
		summary: 'Place tweens at exact times, labels, or overlaps.',
		goals: [
			'Place a tween at an absolute time',
			'Use a label as a position',
			'Overlap tweens with the < and > pointers'
		],
		minutes: 9,
		level: 'Core',
		phase: 2
	},
	{
		number: 8,
		slug: '08-timeline-controls',
		title: 'Timeline controls',
		summary: 'Play, pause, reverse, seek, and change the speed.',
		goals: [
			'Start, stop, and reverse a timeline',
			'Jump to a point with seek or progress',
			'Change speed with timeScale'
		],
		minutes: 8,
		level: 'Core',
		phase: 2
	},
	{
		number: 9,
		slug: '09-callbacks-and-keyframes',
		title: 'Callbacks and keyframes',
		summary: 'Run code at exact moments and build multi-step tweens.',
		goals: [
			'Run code with onStart and onComplete',
			'Read progress with onUpdate',
			'Build a keyframe sequence in one tween'
		],
		minutes: 9,
		level: 'Core',
		phase: 2
	},
	{
		number: 10,
		slug: '10-responsive-and-cleanup',
		title: 'Responsive and cleanup',
		summary: 'Use matchMedia and gsap.context(). Stop animations when a page leaves.',
		goals: [
			'Change animation settings at a breakpoint',
			'Respect reduced motion',
			'Revert every animation on unmount'
		],
		minutes: 10,
		level: 'Core',
		phase: 2
	},
	{
		number: 11,
		slug: '11-scrolltrigger-basics',
		title: 'ScrollTrigger basics',
		summary: 'Start animations when elements enter the viewport.',
		goals: [
			'Register the ScrollTrigger plugin',
			'Set trigger, start, and end',
			'Choose toggleActions for enter and leave'
		],
		minutes: 10,
		level: 'Core',
		phase: 3
	},
	{
		number: 12,
		slug: '12-scrub-and-pin',
		title: 'Scrub and pin',
		summary: 'Tie animation progress to scroll. Pin a scene in place.',
		goals: [
			'Link progress to the scrollbar with scrub',
			'Hold a scene with pin',
			'Control the distance with end'
		],
		minutes: 10,
		level: 'Advanced',
		phase: 3
	},
	{
		number: 13,
		slug: '13-scrolltrigger-pro',
		title: 'ScrollTrigger pro',
		summary: 'Snap to chapters and read scroll progress with callbacks.',
		goals: [
			'Snap the scroll to timeline labels',
			'Read progress with onUpdate',
			'Update the page from scroll callbacks'
		],
		minutes: 12,
		level: 'Advanced',
		phase: 3
	},
	{
		number: 14,
		slug: '14-split-text',
		title: 'SplitText',
		summary: 'Split a headline into lines, words, or chars and animate them.',
		goals: [
			'Create a SplitText instance',
			'Animate chars or lines with a stagger',
			'Revert the split on cleanup'
		],
		minutes: 9,
		level: 'Advanced',
		phase: 4
	},
	{
		number: 15,
		slug: '15-draw-svg',
		title: 'DrawSVG',
		summary: 'Draw SVG strokes as if you use a pen.',
		goals: [
			'Register DrawSVGPlugin',
			'Draw a path from 0 to 100 percent',
			'Draw a segment of a stroke'
		],
		minutes: 8,
		level: 'Advanced',
		phase: 4
	},
	{
		number: 16,
		slug: '16-morph-svg',
		title: 'MorphSVG',
		summary: 'Morph one SVG shape into another.',
		goals: ['Register MorphSVGPlugin', 'Morph to another path element', 'Morph to raw path data'],
		minutes: 9,
		level: 'Advanced',
		phase: 4
	},
	{
		number: 17,
		slug: '17-motion-path',
		title: 'MotionPath',
		summary: 'Send an element along a curved SVG path.',
		goals: [
			'Register MotionPathPlugin',
			'Animate along a path element',
			'Use autoRotate for direction'
		],
		minutes: 10,
		level: 'Advanced',
		phase: 4
	},
	{
		number: 18,
		slug: '18-flip',
		title: 'Flip',
		summary: 'Animate layout changes with the FLIP technique.',
		goals: [
			'Capture a state with Flip.getState()',
			'Change the layout',
			'Animate with Flip.from()'
		],
		minutes: 10,
		level: 'Advanced',
		phase: 5
	},
	{
		number: 19,
		slug: '19-draggable',
		title: 'Draggable',
		summary: 'Drag elements with bounds, momentum, and snapping.',
		goals: [
			'Create a Draggable instance',
			'Limit movement with bounds',
			'Add momentum with InertiaPlugin'
		],
		minutes: 9,
		level: 'Advanced',
		phase: 5
	},
	{
		number: 20,
		slug: '20-observer',
		title: 'Observer',
		summary: 'Read wheel, touch, and pointer gestures with one API.',
		goals: [
			'Create an Observer instance',
			'React to onUp and onDown',
			'Move a slide track with a tween'
		],
		minutes: 9,
		level: 'Advanced',
		phase: 5
	},
	{
		number: 21,
		slug: '21-quick-to-and-utils',
		title: 'quickTo and utils',
		summary: 'Make fast pointer effects and use GSAP math helpers.',
		goals: [
			'Reuse a tween with gsap.quickTo()',
			'Map a pointer position to rotation',
			'Round a value with gsap.utils'
		],
		minutes: 10,
		level: 'Advanced',
		phase: 5
	},
	{
		number: 22,
		slug: '22-capstone',
		title: 'Capstone: launch sequence',
		summary: 'Combine timelines, SplitText, staggers, and callbacks in one project.',
		goals: [
			'Plan a sequence before you code',
			'Combine three plugins in one timeline',
			'Add a replay path that resets cleanly'
		],
		minutes: 15,
		level: 'Boss',
		phase: 6
	}
];

export function getLesson(slug: string): Lesson {
	const match = lessons.find(function (lesson) {
		return lesson.slug === slug;
	});

	if (match === undefined) {
		throw new Error('Unknown lesson: ' + slug);
	}

	return match;
}

export function getPhase(phaseNumber: number): Phase {
	const match = phases.find(function (phase) {
		return phase.number === phaseNumber;
	});

	if (match === undefined) {
		throw new Error('Unknown phase: ' + phaseNumber);
	}

	return match;
}

export function getPhaseLessons(phaseNumber: number): Lesson[] {
	return lessons.filter(function (lesson) {
		return lesson.phase === phaseNumber;
	});
}

export function getPreviousLesson(slug: string): Lesson | null {
	const currentIndex = lessons.findIndex(function (lesson) {
		return lesson.slug === slug;
	});

	if (currentIndex <= 0) {
		return null;
	}

	return lessons[currentIndex - 1];
}

export function getNextLesson(slug: string): Lesson | null {
	const currentIndex = lessons.findIndex(function (lesson) {
		return lesson.slug === slug;
	});

	if (currentIndex === -1 || currentIndex === lessons.length - 1) {
		return null;
	}

	return lessons[currentIndex + 1];
}

export function getLessonHref(slug: string): Path {
	return ('/lessons/' + slug) as Path;
}

export function getTotalMinutes(): number {
	let total = 0;

	for (const lesson of lessons) {
		total = total + lesson.minutes;
	}

	return total;
}
