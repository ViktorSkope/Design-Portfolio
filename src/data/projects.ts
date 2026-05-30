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
    coverImage: "/img-athos.png",
    coverImageAlt: "Athos Commerce dashboard home screen showing search performance and category data.",
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
      "At the end of the project we presented the full product concept and styleguide to the client. Going back through the original list of challenges, we could show how each one had been addressed. Tiered warning flows replaced guesswork with clear courses of action. Onboarding went from nonexistent to structured and supported. The new visual language made the product feel credible at international level. All of it pointing toward the $7M cost reduction target the business had set at the start.",
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
      },
      {
        title: "Sorting Cards",
        body: "One of the features I spent the most time on was sorting cards. The idea was to let users compare options side by side in a way that felt more like flipping through possibilities than scanning a list. You see two options at once, pick the one that appeals more, and the one you dismissed disappears. It is a simple mechanic but it makes the act of choosing feel lighter and more decisive.",
        imageLayout: "double",
        imageMeta: "Sorting cards — comparison interaction",
      },
      {
        title: "Short Video Discovery",
        body: "We also added short video clips tied to specific dishes or activities, ordered by how relevant they were to your location and past behavior. The thinking was that a ten-second video of a meal tells you more than any description ever could. It also gave local businesses a way to show up in a format that actually attracted attention.",
        imageLayout: "single",
        imageMeta: "Video discovery — location-sorted feed",
      },
      {
        title: "Supporting Local Businesses",
        body: "One thing we cared about from the start was giving smaller and newer venues a fair shot. Whirl is not just a tool for users. It is also a surface where a restaurant that opened six months ago can get seen by someone a few blocks away who would have never found them otherwise. The recommendation logic was designed with that in mind, not just surfacing what was already popular.",
        imageLayout: "single",
        imageMeta: "Business discovery — emerging venue exposure",
      },
      {
        title: "Mobile UI Design",
        body: "Since this was a passion project with no client constraints, it became a space to experiment. I explored navigation patterns, card interactions, and conversational UI in ways that a typical client brief would not allow. The 2020 redesign brought the visual language together into something cohesive, building on early sketches from 2016 with a cleaner sense of structure and interaction.",
        imageLayout: "double",
        imageMeta: "Mobile UI — screens and interaction patterns",
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
