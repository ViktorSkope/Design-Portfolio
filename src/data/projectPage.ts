import type { PageSection, Project, ProjectPage } from "./projects";

const sentence = (text: string) => (/[.!?:]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`);

const join = (parts: string[]) => parts.map(sentence).join(" ");

const COMING_SOON = "Details coming soon.";

// The case study every project page is built from. A project with its own
// `page` uses it as written; the others are assembled from the content they
// already have, with placeholders where an image or text has not arrived yet.
export function getProjectPage(project: Project): ProjectPage {
  if (project.page) return project.page;

  const pitch = project.pitch ?? [];

  const problem = pitch[0]
    ? join([pitch[0].headline, ...pitch[0].points])
    : (project.challenge ?? project.overview);

  const myRole = project.myRole
    ? join([project.myRole.summary.replace(/:\s*$/, "."), ...project.myRole.points])
    : sentence(project.role);

  const sections: PageSection[] = [];

  if (pitch.length > 1) {
    sections.push({
      label: "Approach",
      items: pitch.slice(1).map((block) => ({ caption: join([block.headline, ...block.points]) })),
    });
  } else if (project.approach) {
    sections.push({ label: "Approach", items: [{ caption: project.approach }] });
  }

  if (project.sections?.length) {
    sections.push({
      label: "Process",
      items: project.sections.map((section) => ({
        image: section.image ? { src: section.image, alt: section.title } : undefined,
        caption: join([section.title, section.body]),
      })),
    });
  }

  if (project.mosaic) {
    sections.push({
      label: project.mosaic.label,
      items: project.mosaic.items.map((item) => ({
        image: { src: item.src, alt: item.alt },
        caption: item.title,
      })),
    });
  }

  if (project.gallery) {
    sections.push({
      label: project.gallery.label,
      items: project.gallery.items.map((item) => ({
        image: { src: item.src, alt: item.alt },
        caption: item.caption,
      })),
    });
  }

  if (project.outcome) {
    const stats = project.outcomeStats?.map((stat) => `${stat.value} ${stat.label.toLowerCase()}`).join(" · ");
    sections.push({
      label: "Findings",
      items: [{ caption: stats ? `${sentence(project.outcome)} ${stats}.` : project.outcome }],
    });
  }

  // Nothing written yet: show the template's usual blocks as placeholders
  if (sections.length === 0) {
    sections.push(
      { label: "Approach", items: [{ caption: COMING_SOON }, { caption: COMING_SOON }] },
      { label: "Process and long term vision", items: [{ caption: COMING_SOON }, { caption: COMING_SOON }] },
      { label: "Findings", items: [{ caption: COMING_SOON }, { caption: COMING_SOON }] },
    );
  }

  return { problem, myRole, sections };
}
