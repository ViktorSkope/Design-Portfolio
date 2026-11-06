// The highlighted words in the hero double as filters for the project carousel.
// Clicking one tells the carousel which group of projects to bring forward.

export const WORK_GROUPS = {
  multidisciplinary: { label: "Multidisciplinary", slugs: ["whirl", "pewee-diary", "liliworld", "blindspot"] },
  saas: { label: "B2B SaaS", slugs: ["athos-commerce", "watchson", "ingrid"] },
  startups: { label: "Startups", slugs: ["rho-studio", "blindspot", "plywood"] },
  games: { label: "Games", slugs: ["liliworld", "rho-studio"] },
} as const;

export type WorkGroup = keyof typeof WORK_GROUPS;

const EVENT = "work-filter";

/** Shows only one group of projects in the carousel, or all of them with `null`. */
export function setWorkFilter(group: WorkGroup | null) {
  window.dispatchEvent(new CustomEvent<WorkGroup | null>(EVENT, { detail: group }));
}

export function onWorkFilter(listener: (group: WorkGroup | null) => void) {
  const handler = (e: Event) => listener((e as CustomEvent<WorkGroup | null>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

export function inWorkGroup(group: WorkGroup, slug: string) {
  return (WORK_GROUPS[group].slugs as readonly string[]).includes(slug);
}
