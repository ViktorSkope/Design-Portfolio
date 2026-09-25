export type ProjectCategory = "Current Work" | "Side Quests" | "Featured Work";

export interface CardColumn {
  label: string;
  variant: "positive" | "negative";
  items: string[];
}

export interface CaseStudySection {
  title: string;
  body: string;
  imageLayout?: "single" | "double";
  imageMeta?: string; // short descriptor shown inside placeholder
  image?: string; // real image path; when set, rendered instead of placeholder
  image2?: string; // second image for double layout
  cardColumns?: CardColumn[]; // when set, renders a card grid instead of an image
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
  // Optional "My Role" section: a short intro followed by scannable points
  myRole?: {
    summary: string;
    points: string[];
  };
  // Optional extra before/after sliders shown after the role section
  comparisons?: {
    label: string;
    before: string;
    after: string;
    beforeAlt: string;
    afterAlt: string;
    caption: string;
  }[];
  // Optional challenge / approach / solution summary shown as columns
  pitch?: {
    label: string;
    headline: string;
    points: string[];
  }[];
  // Optional image mosaic; the first item is shown largest
  mosaic?: {
    label: string;
    items: { src: string; alt: string; title: string }[];
  };
  // Optional secondary image carousel shown at the end of the page
  gallery?: {
    label: string;
    description: string;
    items: { src: string; alt: string; caption: string }[];
  };
  // Optional before/after slider shown in place of the cover image
  coverComparison?: {
    before: string;
    after: string;
    beforeAlt: string;
    afterAlt: string;
  };
  // Shown under the cover image or slider; replaces the overview paragraph when set
  coverCaption?: string;
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
    tagline: "Redesigning a commerce console built around the habits of hundreds of active shoppers.",
    year: "2026",
    category: "Current Work",
    role: "Lead Product Designer",
    overview:
      "Athos Commerce is currently in early access and this is where most of my time goes right now. The platform already has hundreds of shoppers using it daily, which means the design decisions I make have to respect what people already know and how they already work. My role as Lead Product Designer is to untangle the more complex interaction patterns, understand where familiarity ends and friction begins, and carry that knowledge into a new and revised console that is currently in the works. It is the kind of problem I find genuinely interesting: not starting from scratch, but making something better without losing what people already trust.",
    coverImage: "/athos/thumbnail.webp",
    coverImageAlt: "Redesigned Athos Commerce dashboard in a device frame, showing quick links, search performance, catalog sync and category performance.",
    images: [],
    tags: ["Enterprise", "Product Design", "Design Systems"],
    myRole: {
      summary:
        "Athos had a robust but complex platform that needed a full overhaul. I was hired as Lead Designer to start the design team and lead the redesign. Over the last 3 years I have:",
      points: [
        "Designed the new UI end to end",
        "Defined design principles based on the product team's strategy",
        "Built and documented a design system with guidelines, tokens and variables",
        "Scaled that system through new themed features, company acquisitions and a full rebrand",
      ],
    },
    comparisons: [
      {
        label: "Campaign Editor",
        before: "/athos/editor-before.webp",
        after: "/athos/editor-after.webp",
        beforeAlt: "Original Edit Visual Merchandising Campaign page with a floating boosting rules panel over the product grid and two stacked navigation bars.",
        afterAlt: "Redesigned Campaign Editor with a single icon navigation, a docked Product Boosting Rules panel and a compact product grid.",
        caption:
          "This change reflected years of customer support tickets on navigational queries made by the users, culminating in one single navigation profile solution, tested and backed by the users.",
      },
    ],
    pitch: [
      {
        label: "The Challenge",
        headline: "Redesign a product hundreds of companies already work in, without adding friction.",
        points: [
          "Every change had to improve usability for teams with years of habits in the old console.",
        ],
      },
      {
        label: "The Approach",
        headline: "Keep navigation familiar and make setup linear.",
        points: [
          "Users are seasoned marketers who want to spend as little time in the platform as possible, so the navigation stayed recognizable.",
          "Setup tasks scattered across the system became linear wizards that show what's configured and what's missing.",
        ],
      },
      {
        label: "The Solution",
        headline: "Redesign at the component level to ship fast.",
        points: [
          "Instead of rebuilding screens one by one, we changed core components, so engineers knew exactly what changed and where it applied.",
          "Matching our library to MUI gave developers a head start while we researched and mapped bottlenecks.",
        ],
      },
    ],
    mosaic: {
      label: "Visual Results",
      items: [
        {
          src: "/athos/dashboard.webp",
          title: "Dashboard",
          alt: "Redesigned Athos Commerce dashboard with quick links, search performance, catalog sync status and category performance.",
        },
        {
          src: "/athos/manage-features.webp",
          title: "Manage Features",
          alt: "Manage Features settings page with grouped feature toggles for search, merchandising and personalization.",
        },
        {
          src: "/athos/hybrid-search.webp",
          title: "Hybrid Search",
          alt: "Hybrid Search overview page explaining AI-powered keyword and vector search, with an Enable on Storefront button.",
        },
        {
          src: "/athos/recommendations.webp",
          title: "Recommendation Profile Editor",
          alt: "Recommendation profile editor with a precision slider on the left and a live recommended products preview on the right.",
        },
      ],
    },
    gallery: {
      label: "Behind the Work",
      description:
        "The redesign started from zero, so the groundwork mattered as much as the screens: documented components, variables that support theming, and flows organized for handoff.",
      items: [
        {
          src: "/athos/ds-notification.png",
          alt: "Athos design system documentation for the Notification component, showing snackbar variants and actionable savebars.",
          caption:
            "Component documentation. Each pattern lists its variants, when to use it and how it behaves, like these snackbars and savebars.",
        },
        {
          src: "/athos/variables.png",
          alt: "Athos Design Kit variables in Figma, showing palette tokens across Athos Light and Athos FM themes.",
          caption:
            "Variables in the Athos Design Kit. Color, spacing, shape and type tokens with theme modes, so new brands and a full rebrand didn't mean redrawing screens.",
        },
        {
          src: "/athos/flows.png",
          alt: "Figma canvas with Context feature flows grouped by Pages, Segment and Location, marked ready for dev.",
          caption:
            "Feature flows grouped by context and marked ready for dev, so engineering always knew which screens were final.",
        },
      ],
    },
    coverComparison: {
      before: "/athos/before.webp",
      after: "/athos/after.webp",
      beforeAlt: "Original Personalization Settings page with a dense, gray table layout and nested side navigation.",
      afterAlt: "Redesigned Personalization Settings page with tabbed rules, a cleaner Boosted Products table and Contextual Groups editor.",
    },
    coverCaption:
      "Athos Commerce is in early access, and hundreds of shoppers already use it every day. The redesign has to respect how they work: untangle complex interactions, find where familiarity turns into friction, and carry that into a new console without losing what people already trust.",
  },
  {
    slug: "blindspot",
    name: "Blindspot",
    tagline: "A personal knowledge space for busy and distracted minds.",
    year: "2025",
    category: "Side Quests",
    role: "Product Designer",
    overview:
      "Blindspot explores how note-taking can feel less rigid and more human. The product helps people capture ideas quickly and revisit them with context, especially when attention is limited or fragmented.",
    coverImage: "/img-blindspot.png",
    coverImageAlt: "Blindspot brand identity and product screens collage.",
    images: [],
    tags: ["Mobile App", "Brand", "UX Writing"],
  },
  {
    slug: "ingrid",
    name: "Ingrid",
    tagline: "Redesigning a platform that helps technicians keep autonomous harvesters running.",
    year: "2022",
    category: "Featured Work",
    role: "Product Design Lead",
    platform: "Software Design",
    duration: "3 months",
    overview:
      "Ingrid builds autonomous harvesting equipment and needed a platform where field technicians could monitor and control combines from a distance. The software existed, but it was rough. I was brought in to redesign it from the ground up, making it something people could actually use without a manual in hand.",
    coverImage: "/ingrid/cover.png",
    coverImageAlt: "Ingrid platform dashboard on a tablet held by a hand.",
    coverCaption:
      "Ingrid builds autonomous harvesters and needed a platform for field technicians to monitor and control combines remotely. The existing software was hard to use without a manual in hand, so the product was designed again from the ground up. The product name and branding were changed under NDA.",
    images: [],
    tags: ["Product Design", "Agritech", "Dashboard", "UX Research"],
    myRole: {
      summary:
        "Ingrid had working software but no product design behind it. As Product Design Lead, I took the platform from discovery to a validated concept and styleguide in 3 months:",
      points: [
        "Ran a two-week discovery with stakeholders and the technical team",
        "Mapped the core user journeys and tested wireframes with real technicians",
        "Defined tiered warning flows and a guided onboarding",
        "Led a one-week visual identity sprint that produced a full styleguide and UI kit",
      ],
    },
    pitch: [
      {
        label: "The Challenge",
        headline: "Give field workers with little software experience a tool they can use without calling for help.",
        points: [
          "Most technicians were hired from rural areas, and training new staff there was expensive.",
          "Warnings gave no sense of urgency or next step, so small issues turned into costly repairs.",
        ],
      },
      {
        label: "The Approach",
        headline: "Listen first, then place two testable bets.",
        points: [
          "Two weeks of stakeholder and technical sessions came before any design work.",
          "Bet one: usable onboarding lowers training costs. Bet two: clearer warnings stop technicians from missing critical failures.",
          "Low-fidelity wireframes went in front of real technicians to find where they got stuck.",
        ],
      },
      {
        label: "The Solution",
        headline: "Guided onboarding and warnings tiered by severity.",
        points: [
          "A longer onboarding with built-in support and a FAQ helped first-time users find their way.",
          "Each warning level got its own flow, so technicians knew what to do in a critical failure without waiting for assistance.",
          "A map-first home screen shows every active combine and its health at a glance.",
        ],
      },
    ],
    outcome:
      "The onboarding call dropped from over an hour, often with a follow-up, to 25 minutes. New technicians followed the guided steps and worked through warning scenarios on their own, moving the business toward its $7M cost reduction target.",
    outcomeStats: [
      { value: "$7M", label: "Target subscription cost reduction" },
      { value: "58%", label: "Less time in onboarding calls" },
      { value: "1 week", label: "Visual identity sprint" },
    ],
    mosaic: {
      label: "Visual Results",
      items: [
        {
          src: "/ingrid/visual-design.png",
          title: "Map & Onboarding",
          alt: "Ingrid platform screens: a map view with active combines and a warning card, and a home screen with a guided setup panel.",
        },
        {
          src: "/ingrid/visual-identity.png",
          title: "Visual Identity",
          alt: "Visual identity workshop board with reference collages used to build the Ingrid styleguide.",
        },
      ],
    },
    gallery: {
      label: "Behind the Work",
      description:
        "Each step narrowed the problem before any visual design started, from discovery sessions to a delivery plan shared with engineering.",
      items: [
        {
          src: "/ingrid/discovery-workshop.png",
          alt: "Discovery workshop board from stakeholder sessions.",
          caption: "Discovery workshop. Two weeks of sessions with stakeholders and the technical team to agree on what success looked like.",
        },
        {
          src: "/ingrid/impact-challenges.png",
          alt: "Workshop takeaways on sticky notes, split into Impact and Challenges.",
          caption: "Workshop takeaways, split into business impact and user challenges so neither was designed for at the expense of the other.",
        },
        {
          src: "/ingrid/main-journeys.png",
          alt: "Main user journeys with user stories and interface overview.",
          caption: "Three core journeys: monitor machine health, manage routes and equipment, and pull production data.",
        },
        {
          src: "/ingrid/wireframes-testing.png",
          alt: "Low-fidelity wireframes used in tests with the operational team.",
          caption: "Low-fidelity wireframes tested with technicians to check the logic before any visual design.",
        },
        {
          src: "/ingrid/design-bets.png",
          alt: "Design bets slide showing the onboarding and warning hypotheses with their results.",
          caption: "The two bets that came out of testing: guided onboarding and warning flows based on severity.",
        },
        {
          src: "/ingrid/user-flow.png",
          alt: "User flow mapping every screen and its features.",
          caption: "Screen-by-screen user flow, used by design and engineering to build a shared delivery plan.",
        },
      ],
    },
  },
  {
    slug: "whirl",
    name: "Whirl",
    tagline: "An AI assistant that helps you find what to do and where to eat in your city.",
    year: "2020",
    category: "Featured Work",
    role: "Product Designer",
    platform: "iOS & Android",
    duration: "4 months",
    overview:
      "Whirl started as a personal itch. Me and a group of friends were constantly trying to figure out what was happening around our city and always ended up defaulting to the same spots. We first sketched the idea in 2016 and properly redesigned it in 2020. The concept is an AI assistant that learns your tastes and suggests restaurants, activities, and local experiences worth trying nearby. It is also a case study for mobile UI design and some early thinking on what AI chat interaction could look like.",
    coverImage: "/img-whirl.png",
    coverImageAlt: "Two smartphone mockups showcasing Whirl interface.",
    coverCaption:
      "Whirl started with a group of friends who kept ending up at the same spots. It's an AI assistant that learns your tastes and suggests restaurants, activities and local experiences nearby. First sketched in 2016 and redesigned in 2020, it became a case study in mobile UI and early AI chat interaction.",
    images: [],
    tags: ["Consumer Mobile", "AI", "Interaction Design", "Passion Project"],
    myRole: {
      summary:
        "A passion project with no client brief, which made it a place to experiment. As Product Designer, I:",
      points: [
        "Took the concept from 2016 sketches to a full 2020 redesign",
        "Designed the conversational AI flow and the core interaction patterns",
        "Built the mobile UI across discovery, comparison and venue screens",
        "Created the visual identity: logo, color system and iOS presence",
      ],
    },
    pitch: [
      {
        label: "The Challenge",
        headline: "Recommendations that reflect your taste, not a list of the usual favorites.",
        points: [
          "Most apps surface the same popular places everyone already knows.",
          "Small and newer venues rarely show up at all, with no way to compete for attention.",
        ],
      },
      {
        label: "The Approach",
        headline: "Make it personal from the first interaction, and make choosing fun.",
        points: [
          "Natural language replaces filters: describe what you're in the mood for and let the app figure out the rest.",
          "Location and past behavior sharpen suggestions over time, so users don't have to repeat themselves.",
        ],
      },
      {
        label: "The Solution",
        headline: "An AI assistant with lightweight ways to decide.",
        points: [
          "Sorting cards show two options at once. Pick one and the other disappears.",
          "Short videos of dishes and activities, ordered by relevance to where you are.",
          "Recommendation logic that gives newer local businesses a fair shot, not just the popular spots.",
        ],
      },
    ],
    outcome:
      "Whirl never shipped commercially, and that wasn't the goal. It was a long-form design problem that pushed me into conversational UI and AI-assisted experiences before they were mainstream. The sorting cards and short video feed still shape how I approach recommendation and discovery problems.",
    outcomeStats: [
      { value: "2016", label: "Original concept" },
      { value: "2020", label: "Full redesign" },
      { value: "5", label: "Core interaction patterns explored" },
    ],
    mosaic: {
      label: "Visual Results",
      items: [
        {
          src: "/whirl/app-screens.png",
          title: "Onboarding & Discovery",
          alt: "Three Whirl screens: onboarding, the discovery home with nearby places, and a venue page with a reservation button.",
        },
        {
          src: "/whirl/ai-chat.png",
          title: "AI Chat",
          alt: "Whirl AI chat screens where a user asks for a pet-friendly place and gets a restaurant suggestion.",
        },
        {
          src: "/whirl/sorting-cards.png",
          title: "Sorting Cards",
          alt: "Whirl sorting cards for categories like City Tour, Gallery, Coffee Place and Outdoors Restaurant.",
        },
        {
          src: "/whirl/video-discovery.png",
          title: "Video Discovery",
          alt: "Whirl short video feed of dishes and activities sorted by location.",
        },
        {
          src: "/whirl/local-businesses.png",
          title: "Local Businesses",
          alt: "Whirl screens highlighting newer local venues to nearby users.",
        },
        {
          src: "/whirl/brand.png",
          title: "Visual Identity",
          alt: "Whirl visual identity: handwritten spiral logo, iOS app icon and a color system of lime, sunrise yellow, mint green and grassy green.",
        },
      ],
    },
  },
  {
    slug: "watchson",
    name: "Watchson",
    tagline: "A football manager-style HR tool built inside a design agency, by the team, for the team.",
    year: "2022",
    category: "Featured Work",
    role: "Product Designer",
    platform: "Web App",
    duration: "5 months",
    overview:
      "Watchson started as an internal problem we had at the agency. We needed a better way to understand how our developers and designers were being allocated across client projects, what skills each person had or was trying to build, and how to bring the HR team closer to the reality of what the dev team actually did day to day. It was also an opportunity to involve junior developers in a real product from the start, giving them a place to contribute ideas and learn what it feels like to ship something fast.",
    coverImage: "/img-watchson.png",
    coverImageAlt: "Watchson simulation interface displayed on a floating laptop against a dark background.",
    coverCaption:
      "Watchson started as an internal problem at a design agency: seeing how developers and designers were allocated across client projects, what skills each person had or wanted to build, and bringing HR closer to the dev team's daily work. It also gave junior developers a real product to ship.",
    images: [],
    tags: ["HR Tech", "Gamification", "Internal Tooling", "Agency"],
    myRole: {
      summary:
        "An internal product built with the team it served. As Product Designer, working alongside a lead developer, I:",
      points: [
        "Ran informal research with the dev team, much of it over gaming sessions",
        "Turned the football manager idea into team simulations and player profiles",
        "Designed the skill scoring system and growth tracking for HR",
        "Created the duck mascot and the product's visual tone",
      ],
    },
    pitch: [
      {
        label: "The Challenge",
        headline: "Get people to open an allocation tool without being reminded.",
        points: [
          "Developers and leads used it once, got reminded, used it again, then forgot about it.",
          "More Slack reminders weren't going to fix it. The tool had to be something people wanted to come back to.",
        ],
      },
      {
        label: "The Approach",
        headline: "Borrow from the games the team already loved.",
        points: [
          "Research happened outside meetings, mostly over strategy games, deckbuilders and FIFA.",
          "That led to one question: what if allocation worked like a football manager?",
        ],
      },
      {
        label: "The Solution",
        headline: "Team building as a game, backed by real skill data.",
        points: [
          "Leads assemble a team for a client project and run a simulation. A radar chart shows skill gaps at a glance.",
          "Everyone keeps a player card with self-rated skills and the skills they're learning, so HR can see where people want to grow.",
          "A duck mascot keeps the tone light without making the tool feel like a toy.",
        ],
      },
    ],
    outcome:
      "Watchson became something the team talked about. The game angle came from the team rather than a mandate, so it stuck. Junior developers shipped real features, team leads saw capacity and skills clearly for the first time, and the reminder messages stopped.",
    outcomeStats: [
      { value: "100%", label: "Internal adoption" },
      { value: "3", label: "Junior devs who shipped features" },
      { value: "∞", label: "Ducks illustrated" },
    ],
    mosaic: {
      label: "Visual Results",
      items: [
        {
          src: "/watchson/dream-team.png",
          title: "Team Simulation",
          alt: "Watchson simulation screen with an employee list and a radar chart comparing project requirements with team skills.",
        },
        {
          src: "/watchson/dream-team-1.png",
          title: "Skill Selection",
          alt: "Watchson new simulation step for choosing the skills a project needs, with the duck mascot in the side panel.",
        },
        {
          src: "/watchson/skills.png",
          title: "Player Profile",
          alt: "Watchson skill selection screen where each person rates their skills to build a player score.",
        },
        {
          src: "/watchson/ducks.png",
          title: "The Duck",
          alt: "Set of illustrated purple duck mascots in different roles and costumes.",
        },
      ],
    },
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

// The top project of each category, shown in the home page list.
export function getHighlightedProject(category: ProjectCategory): Project | undefined {
  return getProjectsByCategory(category)[0];
}

// "More Work" thumbnails: every project not highlighted in the list, followed
// by the highlighted Featured Work project so it also gets a thumbnail.
export function getMoreWorkProjects(): Project[] {
  const highlighted = new Set(
    projectCategories.map((category) => getHighlightedProject(category)?.slug),
  );
  const featured = getHighlightedProject("Featured Work");
  const rest = projects.filter((project) => !highlighted.has(project.slug));
  return featured ? [...rest, featured] : rest;
}

export function getNextProject(currentSlug: string): Project {
  const index = projects.findIndex((project) => project.slug === currentSlug);
  if (index === -1 || index === projects.length - 1) {
    return projects[0];
  }
  return projects[index + 1];
}
