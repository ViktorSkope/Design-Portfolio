export type ProjectCategory = "Current Work" | "Side Quests" | "Featured Work";

export interface CaseStudySection {
  title: string;
  body: string;
  imageLayout?: "single" | "double";
  imageMeta?: string; // short descriptor shown inside placeholder
}

export interface OutcomeStat {
  value: string;
  label: string;
}

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
  // Extended case study fields
  platform?: string;
  duration?: string;
  challenge?: string;
  approach?: string;
  sections?: CaseStudySection[];
  outcome?: string;
  outcomeStats?: OutcomeStat[];
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
    platform: "Web Dashboard",
    duration: "6 months",
    overview:
      "Ingrid translates large volumes of field and map data into practical decision support for rural operations. I worked on making surveillance insights easier to interpret, helping teams spot issues faster and respond with confidence.",
    coverImage: "/img-ingrid.png",
    coverImageAlt: "Dashboard interface displayed on a floating laptop.",
    images: [],
    tags: ["Data Visualization", "Mapping", "Agritech"],
    challenge:
      "Field operations managers were making critical decisions based on raw alert lists with no spatial context. Monitoring dozens of measurement points across thousands of hectares meant every minute of delay could translate to crop loss or equipment failure. The existing system buried critical information inside tables, making triage slow and error-prone. The goal was simple to state but hard to execute: help teams answer one question quickly—where do I need to go right now?",
    approach:
      "I began by visiting two farms in Mato Grosso to observe how field teams actually interacted with the current system. Those sessions revealed a fundamental mismatch: the tool was built around data completeness, but users needed spatial relevance. I restructured the entire information hierarchy around the map as the primary canvas, treating tabular data as supplemental detail that appeared only when needed.",
    sections: [
      {
        title: "Research & Discovery",
        body: "Two weeks of field observation and interviews with farm managers, agronomists, and equipment operators revealed that most alert responses started with someone calling someone else. The digital tool was rarely the first source of action. Users needed confidence, not completeness. I documented the full decision-making journey—from sensor trigger to on-site response—and identified five moments where the current design created friction.",
        imageLayout: "single",
        imageMeta: "User journey map — Ingrid field research",
      },
      {
        title: "Information Architecture",
        body: "Previous iterations organized data by sensor type. Interviews showed that operators thought in terms of location and urgency, not data category. I reorganized the IA around spatial clusters and severity tiers, then ran card-sorting sessions with four farm managers to validate the new groupings. The revised structure reduced the number of screens needed to triage a critical alert from seven to two.",
        imageLayout: "double",
        imageMeta: "IA diagram — before vs. after",
      },
      {
        title: "Map-First Interface",
        body: "The redesigned interface opens on a full-screen map with alert pins layered by severity. Tapping a pin expands a compact card with the most actionable information first: what happened, how long ago, and what the recommended next step is. All additional data is progressive—accessible but not intrusive. I worked closely with the engineering team to optimize tile-loading performance for low-bandwidth field connections.",
        imageLayout: "single",
        imageMeta: "High-fidelity map interface — Ingrid dashboard",
      },
      {
        title: "Alert System Redesign",
        body: "Alerts were previously all-or-nothing: everything triggered the same notification regardless of severity. I designed a three-tier system—watch, warning, and critical—with distinct visual treatments and different delivery channels for each. Critical alerts bypass the dashboard entirely and push directly to the field manager's phone. Usability testing showed users could distinguish severity at a glance without reading any labels.",
        imageLayout: "double",
        imageMeta: "Alert system states — three severity tiers",
      },
    ],
    outcome:
      "Piloting across three large-scale farms showed a reduction in average alert-to-action time from roughly 40 minutes to 12 minutes. Operations managers described the new interface as \"the first tool that actually shows me where to go.\" The product was adopted across five additional properties within six months of launch, and the map-first model became the baseline for the next version of the platform.",
    outcomeStats: [
      { value: "70%", label: "Faster response time" },
      { value: "5×", label: "Farm adoption growth" },
      { value: "12 min", label: "Alert-to-action avg." },
    ],
  },
  {
    slug: "whirl",
    name: "Whirl",
    tagline: "A location-based app to discover people and places nearby.",
    year: "2022",
    category: "Featured Work",
    role: "Product Designer",
    platform: "iOS & Android",
    duration: "4 months",
    overview:
      "Whirl is designed around serendipity and local discovery. I focused on reducing onboarding friction while making recommendations feel personally relevant, resulting in clearer moments of value for new users.",
    coverImage: "/img-whirl.png",
    coverImageAlt: "Two smartphone mockups showcasing Whirl interface.",
    images: [],
    tags: ["Consumer Mobile", "Discovery", "Interaction Design"],
    challenge:
      "Early retention data told a clear story: most users never returned after their first session. The onboarding flow required too many upfront decisions—interests, location permissions, account creation—before delivering any value. The discovery feed defaulted to the same popular places for everyone, stripping away any sense of personal relevance. The product had real potential, but first impressions were consistently failing to communicate it.",
    approach:
      "I partnered with the data team to map exactly where users dropped off during onboarding, then ran moderated sessions with ten new users to understand the gap between what they expected and what they experienced. The central insight was consistent: users needed to feel a sense of discovery within the first two minutes. I redesigned onboarding as a progressive flow that delivered value before asking for any commitment.",
    sections: [
      {
        title: "Understanding Drop-off",
        body: "Funnel analysis showed that 68% of users abandoned the onboarding flow before granting location access—the step required to unlock any meaningful functionality. Exit interviews revealed the issue wasn't distrust of the app; users simply couldn't see what they were unlocking. I reframed the ask: instead of requesting location permission in an abstract settings screen, we showed a preview of what the discovery feed would look like in their neighborhood.",
        imageLayout: "single",
        imageMeta: "Onboarding funnel — drop-off analysis",
      },
      {
        title: "Rethinking Onboarding",
        body: "The revised onboarding introduces the app's core value—a personalized map of nearby discoveries—before asking users to create an account. Interest selection became optional and progressive, surfacing as a refining tool after the initial feed was generated. I prototyped three onboarding sequences and tested each with eight participants, measuring time-to-first-discovery and emotional response at each step.",
        imageLayout: "double",
        imageMeta: "Onboarding screens — revised flow (prototype)",
      },
      {
        title: "Discovery Feed Design",
        body: "The original feed was a ranked list with no visual hierarchy. I redesigned it as a card-based map interface where proximity, recency, and personal relevance each influenced placement. Cards expanded on tap to reveal fuller context—reviews, photos, check-in patterns—without navigating away. I defined clear interaction states for saved, visited, and recommended places, giving users a sense of progress as they explored.",
        imageLayout: "double",
        imageMeta: "Discovery feed — card components & states",
      },
      {
        title: "Interaction Details",
        body: "Small interaction decisions carried a lot of the emotional weight. I designed custom transitions for map-to-card and card-to-detail flows, ensuring the spatial relationship between the map and the content was never lost. Haptic feedback patterns were specified for key moments: discovering a new place, saving a recommendation, and checking in. These details collectively made the experience feel responsive and alive.",
        imageLayout: "single",
        imageMeta: "Interaction spec — transitions & haptics",
      },
    ],
    outcome:
      "The redesigned onboarding increased completion rates by 34%. Day-7 retention improved by 22 percentage points across the first two months post-launch. Users who experienced the new flow spent significantly more time in the discovery feed, and the add-a-place feature saw three times the engagement compared to the previous version. The changes also reduced support requests related to onboarding confusion by over half.",
    outcomeStats: [
      { value: "+34%", label: "Onboarding completion" },
      { value: "+22pt", label: "Day-7 retention" },
      { value: "3×", label: "Feature engagement" },
    ],
  },
  {
    slug: "watchson",
    name: "Watchson",
    tagline: "A gamified planning and resourcing experience for HR and development.",
    year: "2022",
    category: "Featured Work",
    role: "Product Designer",
    platform: "Web App",
    duration: "5 months",
    overview:
      "Watchson rethinks internal team allocation with a more engaging, game-like approach. I worked on balancing playful mechanics with professional clarity so stakeholders could plan resources efficiently.",
    coverImage: "/img-watchson.png",
    coverImageAlt: "Illustrated branding composition with product typography.",
    images: [],
    tags: ["HR Tech", "Gamification", "Service Design"],
    challenge:
      "Resource planning at growing companies was painfully manual—spreadsheets, calendar comparisons, and hours of back-and-forth between managers. Existing planning tools were clinical and treated allocation like an accounting exercise. People avoided them because they felt like overhead rather than help. The company needed a tool that could make complex team planning legible and even motivating for both managers and individual contributors.",
    approach:
      "I studied engagement patterns from games—progression systems, visual feedback loops, and clear completion states—and explored how those mechanics might apply to a planning context without feeling frivolous or out of place professionally. The core insight: people don't avoid planning because it's hard, they avoid it because nothing makes progress feel real. Making contribution visible was the design lever.",
    sections: [
      {
        title: "Problem Framing",
        body: "Early discovery sessions with HR managers and team leads revealed two distinct pain points: managers struggled to see the full picture of who was available and when, while contributors had no clear sense of how their capacity was being perceived. I mapped these perspectives into a shared problem statement and used it to align stakeholders before any design work began. This framing became the anchor for every subsequent decision.",
        imageLayout: "single",
        imageMeta: "Problem framing workshop — dual-perspective map",
      },
      {
        title: "Game Mechanics Research",
        body: "I analyzed three categories of game mechanics for potential application: resource allocation games (SimCity, Factorio), progression and achievement systems, and visual feedback patterns. The goal wasn't to make work feel like a game—it was to borrow specific mechanisms that reduce cognitive load and make completion satisfying. I documented six patterns and stress-tested each against real planning scenarios with four managers.",
        imageLayout: "double",
        imageMeta: "Mechanics audit — applicable game patterns",
      },
      {
        title: "Core Planning Flow",
        body: "The central interface is a team board where capacity is visualized as fillable slots rather than calendar blocks. Assigning someone to a project is a drag-and-drop action that immediately shows how it affects their availability and the team's overall coverage. Conflicts surface in real time with suggested resolutions. I ran three rounds of usability testing with actual planning sessions to validate that the visual model matched users' mental models.",
        imageLayout: "double",
        imageMeta: "Planning board — slot-fill interaction",
      },
      {
        title: "Team View & Stakeholder Modes",
        body: "Senior stakeholders needed a different level of abstraction from day-to-day managers. I designed two modes: a planning mode for tactical allocation and an overview mode for strategic review. The overview mode surfaces utilization trends, upcoming gaps, and team health signals—all without requiring data entry. Switching between modes uses the same dataset, so there's no duplication of effort.",
        imageLayout: "single",
        imageMeta: "Stakeholder overview — strategic mode",
      },
    ],
    outcome:
      "Two internal teams piloted Watchson over eight weeks. Average planning session duration dropped from just over three hours to 45 minutes. Managers reported the tool made it significantly easier to spot capacity conflicts early, and three additional departments requested access before the pilot ended. Post-pilot surveys scored confidence in planning decisions 4.4 out of 5, up from 2.8 with the previous spreadsheet-based process.",
    outcomeStats: [
      { value: "75%", label: "Planning time saved" },
      { value: "3h → 45m", label: "Session duration" },
      { value: "4.4 / 5", label: "Confidence score" },
    ],
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
