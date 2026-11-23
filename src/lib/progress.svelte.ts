const STORAGE_KEY = 'gsap-lab-progress';

// One shared state object. Every component that reads it updates automatically.
export const progress = $state({
	completedSlugs: [] as string[],
	loaded: false
});

export function loadProgress(): void {
	if (progress.loaded) {
		return;
	}

	if (typeof window === 'undefined') {
		return;
	}

	const savedValue = window.localStorage.getItem(STORAGE_KEY);

	if (savedValue !== null) {
		try {
			const parsedValue: unknown = JSON.parse(savedValue);

			if (Array.isArray(parsedValue)) {
				progress.completedSlugs = parsedValue.filter(function (item) {
					return typeof item === 'string';
				});
			}
		} catch {
			// Bad data stays out of the way. The course still works.
		}
	}

	progress.loaded = true;
}

export function isLessonComplete(slug: string): boolean {
	return progress.completedSlugs.includes(slug);
}

export function toggleLessonComplete(slug: string): void {
	if (isLessonComplete(slug)) {
		progress.completedSlugs = progress.completedSlugs.filter(function (item) {
			return item !== slug;
		});
	} else {
		progress.completedSlugs = [...progress.completedSlugs, slug];
	}

	saveProgress();
}

export function resetProgress(): void {
	progress.completedSlugs = [];
	saveProgress();
}

function saveProgress(): void {
	if (typeof window === 'undefined') {
		return;
	}

	const value = JSON.stringify(progress.completedSlugs);
	window.localStorage.setItem(STORAGE_KEY, value);
}
