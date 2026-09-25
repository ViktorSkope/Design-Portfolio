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
    // Shown under the slider; replaces the overview paragraph when set
    caption?: string;
  };
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
      caption:
        "Athos Commerce is in early access, and hundreds of shoppers already use it every day. The redesign has to respect how they work: untangle complex interactions, find where familiarity turns into friction, and carry that into a new console without losing what people already trust.",
    },
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
    images: [],
    tags: ["Product Design", "Agritech", "Dashboard", "UX Research"],
    challenge:
      "Most of the people using this platform were hired from rural areas with little background in software. They needed to respond fast when a machine threw a warning, but the interface gave them almost nothing to go on. There was no clear path to action, no sense of urgency in how alerts were shown, and no onboarding to speak of. When things went wrong, technicians had to call someone rather than solve it themselves. On top of that, getting new staff trained was expensive, so every rough onboarding experience had a direct cost.",
    approach:
      "We spent two weeks talking to stakeholders and the technical team before touching any design. Those conversations shaped two clear bets: if we made onboarding actually usable, could we bring down the cost of training new staff? And if we redesigned how warnings were shown, could we stop technicians from missing things that turn into bigger problems? Those two questions guided everything that followed.",
    sections: [
      {
        title: "Discovery Workshop",
        body: "The first two weeks were entirely about listening. We ran sessions with stakeholders and the technical team to understand what they expected from this redesign and what was making the current product painful to work with. By the end we had a clear picture of where the real problems were, and a shared sense of what success would look like.",
        imageLayout: "single",
        imageMeta: "Discovery workshop — stakeholder sessions",
        image: "/ingrid/discovery-workshop.png",
      },
      {
        title: "Impact & Challenges",
        body: "The sessions surfaced things that mattered to the business and things that were making daily work harder for users. Keeping both sides visible helped us avoid designing for one while ignoring the other.",
        cardColumns: [
          {
            label: "Impact",
            variant: "positive",
            items: [
              "Reduce $7M in subscription costs from a competitor's product",
              "Improve user relationship with the software and decrease training times by at least 50%",
              "Stimulate preventive maintenance from site-level managers by giving them predictive data insights",
              "Increase company presence and value perception in international meet-ups",
            ],
          },
          {
            label: "Challenges",
            variant: "negative",
            items: [
              "Collaborators are hired from remote countryside areas and are not tech-savvy with terminal configurations",
              "Acquisition costs to move people from city areas to the countryside to train staff is high",
              "Users have trouble with recommended actions during warnings about the machine's health",
              "Lack of preventive maintenance drives repair costs high",
            ],
          },
        ],
      },
      {
        title: "Main User Journeys",
        body: "Discovery gave us the three things technicians actually needed the software to do: keep an eye on machine health, stay on top of routes and equipment, and pull production data when they needed it. Simple on paper, but the existing product made all three harder than they should have been. These became the backbone of every screen we designed.",
        imageLayout: "single",
        imageMeta: "Main journeys — user stories and interface overview",
        image: "/ingrid/main-journeys.png",
      },
      {
        title: "Wireframes & Hypothesis Testing",
        body: "Low-fidelity wireframes let us test the logic before committing to anything visual. We put them in front of real technicians and watched where they got stuck.",
        imageLayout: "single",
        imageMeta: "Low-fidelity wireframes — operational team testing",
        image: "/ingrid/wireframes-testing.png",
      },
      {
        title: "Design Bets",
        body: "The tests pointed us toward two clear directions. A longer onboarding with built-in support and a FAQ helped people who had never used anything like this before actually find their footing. For warnings, we stopped treating everything as equally urgent. Different severities got different flows, so a technician facing a critical failure knew exactly what to do without having to call anyone.",
        imageLayout: "single",
        imageMeta: "Design bets — validated hypotheses",
        image: "/ingrid/design-bets.png",
      },
      {
        title: "User Flow & Feature Planning",
        body: "Once we knew what worked, we mapped out every screen and how they connected. Each one was documented with the features it needed and the paths a user could take from it. Design and engineering used that map to build a shared delivery sheet, so both teams knew what was coming and in what order.",
        imageLayout: "single",
        imageMeta: "User flow — turning tasks into features",
        image: "/ingrid/user-flow.png",
      },
      {
        title: "Visual Identity",
        body: "The company needed a visual identity that matched where the product was going. In one week, we ran a workshop with stakeholders, gathered visual references, aligned on a direction, and put together a full styleguide with components, typography, and a UI kit. Quick, but intentional.",
        imageLayout: "single",
        imageMeta: "Visual identity workshops — styleguide creation",
        image: "/ingrid/visual-identity.png",
      },
      {
        title: "Visual Design",
        body: "The final product opens on a map with every active combine in view. Machine health and alerts read instantly at a glance. Warning states are color-coded by severity so technicians know what needs attention right now versus what can wait. It looks like a modern piece of software, because it finally is one.",
        imageLayout: "single",
        imageMeta: "High-fidelity visual design — Ingrid platform",
        image: "/ingrid/visual-design.png",
      },
    ],
    outcome:
      "At the end of the project we presented the full product concept and styleguide to the client. Going back through the original list of challenges, we could show how each one had been addressed. Tiered warning flows replaced guesswork with clear courses of action. Onboarding went from nonexistent to structured and supported. The new visual language made the product feel credible at international level. One number stood out: the onboarding call, which normally ran over an hour and often needed a follow-up, came down to 25 minutes. New technicians were able to follow the guided steps, work through warning scenarios, and act on recommendations entirely within the mockup. All of it pointing toward the $7M cost reduction target the business had set at the start.",
    outcomeStats: [
      { value: "$7M", label: "Target subscription cost reduction" },
      { value: "75%", label: "Increase in onboarding speed" },
      { value: "1 week", label: "Visual identity sprint" },
    ],
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
    images: [],
    tags: ["Consumer Mobile", "AI", "Interaction Design", "Passion Project"],
    challenge:
      "Most recommendation apps give you the same popular places everyone already knows. They feel generic because they are. We wanted something that actually reflected your tastes and where you were at that moment, not a ranked list of tourist favorites. The other side of the problem was for small and newer businesses that rarely showed up in those lists at all. A better discovery experience could mean real visibility for places that deserved attention but had no way to compete for it.",
    approach:
      "We focused on two things: making the recommendation feel personal from the first interaction, and making the experience of choosing something fun rather than overwhelming. Natural language was a big part of that. Instead of filtering menus and dropdowns, we explored what it would feel like to just describe what you were in the mood for and let the app figure out the rest. That shaped the whole product direction.",
    sections: [
      {
        title: "The Core Idea",
        body: "The app uses a mix of natural language processing, location data, and machine learning to understand what a user actually wants at a given moment. You tell Whirl what you are in the mood for in plain language and it comes back with options that fit. Over time it gets better at understanding your preferences without you having to spell them out every time.",
        imageLayout: "single",
        imageMeta: "Core concept — AI chat and recommendation flow",
        image: "/whirl/ai-chat.png",
      },
      {
        title: "Sorting Cards",
        body: "One of the features I spent the most time on was sorting cards. The idea was to let users compare options side by side in a way that felt more like flipping through possibilities than scanning a list. You see two options at once, pick the one that appeals more, and the one you dismissed disappears. It is a simple mechanic but it makes the act of choosing feel lighter and more decisive.",
        imageLayout: "single",
        imageMeta: "Sorting cards — comparison interaction",
        image: "/whirl/sorting-cards.png",
      },
      {
        title: "Short Video Discovery",
        body: "We also added short video clips tied to specific dishes or activities, ordered by how relevant they were to your location and past behavior. The thinking was that a ten-second video of a meal tells you more than any description ever could. It also gave local businesses a way to show up in a format that actually attracted attention.",
        imageLayout: "single",
        imageMeta: "Video discovery — location-sorted feed",
        image: "/whirl/video-discovery.png",
      },
      {
        title: "Supporting Local Businesses",
        body: "One thing we cared about from the start was giving smaller and newer venues a fair shot. Whirl is not just a tool for users. It is also a surface where a restaurant that opened six months ago can get seen by someone a few blocks away who would have never found them otherwise. The recommendation logic was designed with that in mind, not just surfacing what was already popular.",
        imageLayout: "single",
        imageMeta: "Business discovery — emerging venue exposure",
        image: "/whirl/local-businesses.png",
      },
      {
        title: "Mobile UI Design",
        body: "Since this was a passion project with no client constraints, it became a space to experiment. I explored navigation patterns, card interactions, and conversational UI in ways that a typical client brief would not allow. The 2020 redesign brought the visual language together into something cohesive, building on early sketches from 2016 with a cleaner sense of structure and interaction.",
        imageLayout: "single",
        imageMeta: "Mobile UI — screens and interaction patterns",
        image: "/whirl/app-screens.png",
      },
      {
        title: "Visual Identity",
        body: "The logo was designed to look handwritten and spiraling, referencing the name and the idea of wandering through a city. The color system kept things fresh and approachable: lime, sunrise yellow, mint green, and grassy green. The iOS icon and home screen presence were part of the design too, because how an app looks on your phone before you open it still matters.",
        imageLayout: "single",
        imageMeta: "Visual identity — logo, color system, and iOS presence",
        image: "/whirl/brand.png",
      },
    ],
    outcome:
      "Whirl never shipped as a commercial product, and that was never really the goal. What it gave me was a long-form design problem to work through on my own terms. It pushed me to think seriously about conversational UI and AI-assisted experiences well before those became mainstream topics in product design. The sorting card mechanic and the short video feed are both ideas I still think about when working on recommendation and discovery problems.",
    outcomeStats: [
      { value: "2016", label: "Original concept" },
      { value: "2020", label: "Full redesign" },
      { value: "5", label: "Core interaction patterns explored" },
    ],
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
    images: [],
    tags: ["HR Tech", "Gamification", "Internal Tooling", "Agency"],
    challenge:
      "The core problem was not the allocation itself. The problem was getting people to actually open the tool. Developers and team leads would use it once, get reminded, use it again, and then forget about it entirely. No amount of Slack messages was going to fix that. We needed the platform to be something people wanted to come back to, not something they felt obligated to update.",
    approach:
      "Me and a lead developer started spending time with the dev team outside of work meetings. Most of those conversations happened over gaming sessions. Our developers were deep into strategy games, deckbuilders, and FIFA. That told us something. If we could bring even a fraction of what made those games compelling into Watchson, we might actually solve the engagement problem. So we asked: what if this was a football manager?",
    sections: [
      {
        title: "Building Your Dream Team",
        body: "The main feature for team leaders was the simulation. You would pick a client project, see who was available, filter by skills and desire to work on that specific type of project, and assemble your team. Once built, you could run a simulation to see how well the team's skills matched what the project actually required. The radar chart made skill gaps visible at a glance, so there was no guessing about whether a team could realistically deliver.",
        imageLayout: "single",
        imageMeta: "Team simulation — employee overview and skill radar",
        image: "/watchson/dream-team.png",
      },
      {
        title: "Player Scores & Skill Profiles",
        body: "Each person on the team had their own profile where they could edit their skills and rate themselves. Those ratings fed into an overall score, similar to a player card in a football game. You could also flag skills you were actively trying to learn, which gave the HR team visibility into where people wanted to grow rather than just where they already were. The duck mascot showed up throughout the platform as a friendly presence, keeping the tone light without making it feel like a toy.",
        imageLayout: "single",
        imageMeta: "Skill selection screen — player profile and scoring",
        image: "/watchson/skills.png",
      },
      {
        title: "The Duck",
        body: "Every good internal tool needs a mascot. Ours came from my lead developer's favourite animal: the duck. Ducks are famously versatile, calm on the surface and working hard underneath, which felt like a pretty accurate description of a good developer. The star-shaped logo represented individual skill ratings, and the duck showed up in different roles and costumes throughout the app depending on context. We spent an unreasonable amount of time designing purple ducks. No regrets.",
        imageLayout: "single",
        imageMeta: "Watchson mascot — illustrated duck character set",
        image: "/watchson/ducks.png",
      },
    ],
    outcome:
      "Watchson became something the team actually talked about. The gamification angle worked because it came from the team themselves rather than being imposed on them. Junior developers shipped real features and had opinions on the product direction. Team leaders had a clearer picture of capacity and skill distribution than they had ever had before. And we finally had a reason to stop sending reminder messages about updating availability.",
    outcomeStats: [
      { value: "100%", label: "Internal adoption" },
      { value: "3", label: "Junior devs who shipped features" },
      { value: "∞", label: "Ducks illustrated" },
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
