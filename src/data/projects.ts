export type ProjectCategory = "Current Work" | "Side Quests" | "Featured Work";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  category: ProjectCategory;
  role: string;
  overview: string;
  coverImage: string;
  coverImageAlt: string;
  images: string[];
  tags: string[];
}

export const projects: Project[] = [
  {
    slug: "athos-commerce",
    name: "Athos Commerce",
    tagline: "Making enterprise commerce workflows more intuitive and scalable.",
    year: "2026",
    category: "Current Work",
    role: "Lead Product Designer",
    overview:
      "Athos Commerce is my current focus: improving how large teams handle complex buying journeys. I lead the product design direction, collaborating with engineering and product to simplify high-friction flows without sacrificing flexibility.",
    coverImage: "/img-ingrid.png",
    coverImageAlt: "Dark dashboard interface shown on a laptop screen.",
    images: [],
    tags: ["Enterprise", "Product Design", "Design Systems"],
  },
  {
    slug: "blindspot",
    name: "Blindspot",
    tagline: "A personal knowledge space for busy and distracted minds.",
    year: "2023",
    category: "Side Quests",
    role: "Product Designer",
    overview:
      "Blindspot explores how note-taking can feel less rigid and more human. The product helps people capture ideas quickly and revisit them with context, especially when attention is limited or fragmented.",
    coverImage: "/img-watchson.png",
    coverImageAlt: "Brand-forward product campaign with lilac background.",
    images: [],
    tags: ["Mobile App", "Brand", "UX Writing"],
  },
  {
    slug: "ingrid",
    name: "Ingrid",
    tagline: "Automated surveillance map for agriculture operations in Brazil.",
    year: "2022",
    category: "Featured Work",
    role: "Product Designer",
    overview:
      "Ingrid translates large volumes of field and map data into practical decision support for rural operations. I worked on making surveillance insights easier to interpret, helping teams spot issues faster and respond with confidence.",
    coverImage: "/img-ingrid.png",
    coverImageAlt: "Dashboard interface displayed on a floating laptop.",
    images: [],
    tags: ["Data Visualization", "Mapping", "Agritech"],
  },
  {
    slug: "whirl",
    name: "Whirl",
    tagline: "A location-based app to discover people and places nearby.",
    year: "2022",
    category: "Featured Work",
    role: "Product Designer",
    overview:
      "Whirl is designed around serendipity and local discovery. I focused on reducing onboarding friction while making recommendations feel personally relevant, resulting in clearer moments of value for new users.",
    coverImage: "/img-whirl.png",
    coverImageAlt: "Two smartphone mockups showcasing Whirl interface.",
    images: [],
    tags: ["Consumer Mobile", "Discovery", "Interaction Design"],
  },
  {
    slug: "watchson",
    name: "Watchson",
    tagline: "A gamified planning and resourcing experience for HR and development.",
    year: "2022",
    category: "Featured Work",
    role: "Product Designer",
    overview:
      "Watchson rethinks internal team allocation with a more engaging, game-like approach. I worked on balancing playful mechanics with professional clarity so stakeholders could plan resources efficiently.",
    coverImage: "/img-watchson.png",
    coverImageAlt: "Illustrated branding composition with product typography.",
    images: [],
    tags: ["HR Tech", "Gamification", "Service Design"],
  },
];

export const projectCategories: ProjectCategory[] = [
  "Current Work",
  "Side Quests",
  "Featured Work",
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((project) => project.category === category);
}

export function getNextProject(currentSlug: string): Project {
  const index = projects.findIndex((project) => project.slug === currentSlug);
  if (index === -1 || index === projects.length - 1) {
    return projects[0];
  }
  return projects[index + 1];
}
