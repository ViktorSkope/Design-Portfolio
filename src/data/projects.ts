export type ProjectCategory = "Current Work" | "Hackathon Project" | "Featured Work";

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

// ─── Project page (the shared case study template) ───────────────────────────

export interface PageImage {
  src: string;
  alt: string;
  // Which part of the image stays in view when it is cropped to the frame
  position?: "top" | "center";
}

export interface PageItem {
  // Left out until the real image arrives; a placeholder is shown instead
  image?: PageImage;
  caption: string;
}

export interface PageSection {
  label: string;
  items: PageItem[];
}

export interface ProjectPage {
  problem: string;
  myRole: string;
  sections: PageSection[];
  // Only the Athos page has a before / after slider
  beforeAfter?: {
    before: string;
    after: string;
    beforeAlt: string;
    afterAlt: string;
  };
}

export interface Project {
  // Backdrop of the cover card on the project page and in its side previews
  coverBackground?: string;
  // A transparent version of the cover used on the landing page carousel, when it
  // differs from the cover shown on the project page
  carouselImage?: string;
  // Fill the whole cover card (cropping a little) instead of fitting inside it
  coverFill?: boolean;
  // Case study content in the shared page template; derived from the older
  // fields below when it is not set
  page?: ProjectPage;
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
    // Optional line illustration shown above the label
    illustration?: { src: string; alt: string };
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
    tagline: "Helping hundreds of long-time users perform better in a new system redesign.",
    year: "2023-2026",
    category: "Current Work",
    role: "Lead Product Designer",
    overview:
      "Athos Commerce is in early access, and it is where most of my time goes right now. Hundreds of shoppers already use the platform daily, so every design decision has to respect what they know and how they work. As Lead Product Designer, I untangle the more complex interaction patterns, find where familiarity ends and friction begins, and carry that into a new console. I like this kind of problem: not starting from scratch, but making something better without losing what people already trust.",
    coverImage: "/athos/cover-4.png",
    coverImageAlt: "Redesigned Athos Commerce dashboard in a device frame, showing quick links, search performance, catalog sync and category performance.",
    coverBackground: "linear-gradient(180deg, #eef2fb 0%, #c7ccd8 100%)",
    images: [],
    tags: ["Enterprise", "Product Design", "Design Systems"],
    page: {
      problem:
        "Shoppers and agencies work hard to personalize their merchandising to their own customers’ habits. Most SaaS on the market makes that harder, often requiring deep knowledge of code implementation. To make it intuitive and configurable, I had to start from the day-to-day.",
      myRole:
        "I led the platform’s design from the ground up, contributing individually and with an assistant. Together with engineers and front-end developers, we reshaped a 20+ year old service from the inside out: mapping journeys, documenting old and new decisions, and keeping pace with the stakeholders’ roadmap.",
      sections: [
        {
          label: "Approach",
          items: [
            {
              image: {
                src: "/athos/flows.png",
                alt: "Sitemap of the Athos console mapping every menu, feature and flow.",
              },
              caption:
                "At the start, most of the information was scattered across teams. I mapped the entire structure to build a wiki of each feature, and partnered with a Product Manager (now a good friend) to explore how each feature was used and why.",
            },
            {
              image: {
                src: "/athos/variables.png",
                alt: "Variables in the Athos design kit, showing collections, names and the Athos Light mode values.",
              },
              caption:
                "To secure initial board approval, we had to show we could avoid the technical debt and bottlenecks of the past. So I built our framework on top of MUI’s, keeping design and development speaking the same language. From there, custom variables and components came from changing MUI’s base configuration.",
            },
          ],
        },
        {
          label: "Process and long term vision",
          items: [
            {
              image: {
                src: "/athos/manage-features.webp",
                alt: "Manage Features settings page with grouped feature toggles.",
              },
              caption:
                "Once at full speed, the product team and I prioritized the work with the most impact and the fewest changes. It felt like repairing a moving car: we couldn’t go for the wheel until we were sure the windows worked.",
            },
            {
              image: {
                src: "/athos/recommendations.webp",
                alt: "Recommendations profile editor with a live preview of recommended products.",
              },
              caption:
                "Once components were in thorough use, developers and managers had more freedom to experiment, and we started tackling the big features our users relied on. We engaged beta customers and went through countless recordings from our customer success team, looking for opportunities.",
            },
          ],
        },
        {
          label: "Findings",
          items: [
            {
              image: {
                src: "/athos/create-synonym.png",
                alt: "The Create Synonym modal, with Grouped and One-Way synonym types and the searching-for and also-returns fields.",
              },
              caption:
                "Interviews and recorded sessions showed beta testers performing better on the new platform, but many traditional customers complained about relearning it. We weighed our decisions against our solid revenue base, creating some redundant actions that new customers ignored, to serve clients already working quickly in the old platform.",
            },
            {
              image: {
                src: "/athos/color-aliases.png",
                alt: "Colour mapping boards comparing Athos and IR palettes and proposing aliases for background, stroke and text colours.",
              },
              caption:
                "We are now shifting the platform’s focus from adding features to making the customer journey well rounded across the features people already know and trust. As Athos acquired other companies, the design system let us communicate seamlessly across teams, so designers, marketers and product managers could experiment and build safely.",
            },
          ],
        },
      ],
      beforeAfter: {
        before: "/athos/editor-before.webp",
        after: "/athos/editor-after.webp",
        beforeAlt: "Original Edit Visual Merchandising Campaign page with a floating boosting rules panel over the product grid and two stacked navigation bars.",
        afterAlt: "Redesigned Campaign Editor with a single icon navigation, a docked Product Boosting Rules panel and a compact product grid.",
      },
    },
  },
  {
    slug: "blindspot",
    name: "Blindspot",
    tagline: "An AI notetaker app for quick memory snapshots.",
    year: "2025",
    category: "Hackathon Project",
    role: "Founder",
    overview:
      "Blindspot turned your personal notes into a wikipedia about you, so you could quickly retrieve the context behind an idea, before a meeting for example.",
    coverBackground: "linear-gradient(180deg, #f4ffd0 0%, #eaf9b8 100%)",
    coverFill: true,
    carouselImage: "/blindspot/carousel-3.webp",
    coverImage: "/blindspot/cover.webp",
    coverImageAlt: "Blindspot on the desktop: a notes window behind a search and chat panel that recalls context with @ for people and / for projects.",
    images: [],
    tags: ["Founder", "Mobile App", "Brand", "AI Tools"],
    page: {
      problem:
        "The problem was context. Adding notes was easy, but retrieving them in the right context was hard. Blindspot turned your personal notes into a wikipedia about you, so you could quickly pull up a specific detail or the general context of an idea, before a meeting for example.",
      myRole:
        "I was the founder, working with an engineer to design, market and gather user insights for the product.",
      sections: [
        {
          label: "Approach",
          items: [
            {
              image: {
                src: "/blindspot/popup-notes.webp",
                alt: "Blindspot’s quick note pop-up on the desktop, opened over a notes window with a search and a chat for recalling context using @ for people and / for projects.",
              },
              caption:
                "I had my own notes app integrated with ChatGPT, but it lost context after a long session and struggled with similar names, projects and ambiguity. So I drew Blindspot as the simplest notetaker I could: no organizing, no lists, just pick it up and write. You only need two tools: @ to mention and / to mention a project.",
            },
            {
              image: {
                src: "/blindspot/website.png",
                alt: "Blindspot’s website: “Out of sight, but never #out of mind” with a Get the Demo button and hand-drawn mascots.",
              },
              caption:
                "I experimented with AI tools to see if I could build something in a weekend. At the same time I started a waitlist with friends in the area, demoed a prototype and gathered pivoting insights on usage across channels, messaging app integrations, and import and export.",
            },
          ],
        },
        {
          label: "Visual identity and outcome",
          items: [
            {
              image: {
                src: "/blindspot/mascots.webp",
                alt: "Four Blindspot mascots on lilac, dark, white and lime backgrounds next to the logo.",
                position: "center",
              },
              caption:
                "I designed the mascots, the branding and the visual experience to feel like doodles on an empty white sheet.",
            },
            {
              image: {
                src: "/blindspot/expanded-view.webp",
                alt: "Blindspot’s expanded view: a sidebar with the account and My Network, and a clean page for writing context notes.",
              },
              caption:
                "We later sold the product to an insurance company, which made it their internal tool for prospecting clients.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "ingrid",
    name: "Ingrid",
    tagline: "Redesigning a platform that helps technicians keep autonomous harvesters running.",
    year: "2022",
    category: "Featured Work",
    role: "Product Design Lead",
    overview:
      "Ingrid builds autonomous harvesting equipment and needed a platform for field technicians to monitor and control combines remotely. The software existed, but it was rough. I was brought in to redesign it from the ground up, so people could use it without a manual in hand.",
    coverBackground: "linear-gradient(180deg, #dfe0e4 0%, #bcbec6 100%)",
    coverImage: "/ingrid/cover-4.webp",
    coverImageAlt: "Ingrid production map: a list of harvesters with cargo and signal levels, a production chart, and a satellite map with a warning card for combine D10 about low rear tire pressure.",
    coverCaption:
      "Ingrid builds autonomous harvesters and needed a platform for field technicians to monitor and control combines remotely. The existing software was hard to use without a manual in hand, so the product was designed again from the ground up. The product name and branding were changed under NDA.",
    images: [],
    tags: ["Product Design", "Agritech", "Dashboard", "UX Research"],
    myRole: {
      summary:
        "Ingrid had working software but no product design behind it. As Product Design Lead, I took the platform from discovery to a validated concept and styleguide:",
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
    page: {
      problem:
        "We were asked to build software on top of existing proprietary hardware for autonomous machinery. The current solution was highly technical and demanded programming expertise, which cost field technicians development time and left error handling far from ideal.",
      myRole:
        "As the product designer responsible, I partnered with a researcher and two field technicians to understand how they were onboarded and how they monitored the machines day to day. I also led a two-week visual identity sprint that gave the team a styleguide and UI kit, so the tool could be shown at conferences and expositions under an established brand.",
      sections: [
        {
          label: "Approach",
          items: [
            {
              image: {
                src: "/ingrid/workshop-board.webp",
                alt: "The discovery workshop board: an agenda and the business impacts and blockers mapped on sticky notes, then the user journey drawn as a map.",
              },
              caption:
                "We mapped the user journeys in a four-week discovery, to understand the team’s challenges and how they affected the company.",
            },
            {
              image: {
                src: "/ingrid/flows.webp",
                alt: "Wireframe flows for the platform, from login and home through the interactive map to equipment data, action warnings and the emergency stop.",
              },
              caption:
                "We then tested prototypes with the technical team, checking the flows against the decisions they make in real work.",
            },
          ],
        },
        {
          label: "Insights and reframing",
          items: [
            {
              image: {
                src: "/ingrid/time-to-reaction.png",
                alt: "Time to reaction: a code log splits into error, monitoring and health signals, which lead to danger, warning and position states.",
              },
              caption:
                "Technicians read signals from the machinery and had seconds to decide whether to shut down the operation or fix the issue once the machine returned. Understanding a problem meant reading the full log. Errors arrived as codes to memorize or look up on a cheat sheet, and sometimes an error was just a signal issue with no real situation behind it.",
            },
            {
              image: {
                src: "/ingrid/danger-warning.webp",
                alt: "A danger warning over the production map for combine D10: low rear tire pressure, shutting down in 45 seconds, with a Cancel Shutdown button.",
              },
              caption:
                "Instead of only improving onboarding, we asked: what if technicians approached the product through reaction rather than action? Emergency and high-alert warnings now start a countdown to shutoff, and the user dismisses the warning to keep operating, instead of decoding an error and deciding whether to shut down. Simple recurring errors stay on screen, while major errors flagged as auto-shutdown let users postpone the shutdown until they know more, or follow the automatic response.",
            },
          ],
        },
        {
          label: "Impact",
          items: [
            {
              image: {
                src: "/ingrid/vehicles-equipment.webp",
                alt: "The Vehicles and Equipment screen, with a guided panel on how to proceed with warning or emergency signs.",
              },
              caption:
                "We cut onboarding from an hour-long code workshop to an eight-minute prototype covering every warning case. Controlled studies showed 100% adoption within two sessions at most, and usually after one. Thanks to our MVP, the company saves 1.5 million USD a year in licensing fees for other training and monitoring software.",
            },
            {
              image: {
                src: "/ingrid/identity-board.webp",
                alt: "The visual identity workshop board: style direction, reference photography and brand marks gathered for the Ingrid styleguide.",
              },
              caption:
                "The two-week visual identity sprint produced a styleguide and UI kit, giving the product an established brand for conferences and expositions.",
            },
          ],
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
    overview:
      "Whirl started as a personal itch. Me and a group of friends were constantly trying to figure out what was happening around our city and always ended up defaulting to the same spots. We first sketched the idea in 2016 and properly redesigned it in 2020. The concept is an AI assistant that learns your tastes and suggests restaurants, activities, and local experiences worth trying nearby. It is also a case study for mobile UI design and some early thinking on what AI chat interaction could look like.",
    coverBackground: "linear-gradient(180deg, #f3f8cf 0%, #dceaae 100%)",
    coverImage: "/whirl/cover-4.webp",
    coverImageAlt: "Three Whirl app screens on a lime gradient: the sign-up screen, a discovery home with nearby places, and a venue page with a reservation button.",
    coverCaption:
      "Whirl started with a group of friends who kept ending up at the same spots. It's an AI assistant that learns your tastes and suggests restaurants, activities and local experiences nearby. First sketched in 2016 and redesigned in 2020, it became a case study in mobile UI and early AI chat interaction.",
    images: [],
    page: {
      problem:
        "Star Sales wanted to bridge the gap between new restaurants and the people of their city. Their idea was a coupon partner program that connects the two through discounts.",
      myRole:
        "I created Whirl as a concept for a company case study, to show how AI could improve a customer journey through conversational patterns. I did the discovery work, the visual identity and the visual design.",
      sections: [
        {
          label: "Approach",
          items: [
            {
              image: {
                src: "/whirl/sorting-home.webp",
                alt: "Whirl home screen with an Around you carousel and card sorting categories, surrounded by tilted City Tour, Gallery, Coffee Place and Outdoors Restaurant cards.",
              },
              caption:
                "I used a simple card sorting model to help people choose where to eat: they eliminate the places they don’t want, and the app learns their preferences from what is left.",
            },
            {
              image: {
                src: "/whirl/logo-identity.webp",
                alt: "Whirl logo construction, with a handwritten spiral sketch and proportions, shown as an app icon in the App Store and on an iPhone home screen.",
                position: "center",
              },
              caption:
                "For the identity, I handwrote the Whirl logo to look like it is spiraling, and carried it into an app icon that sits naturally in the App Store and on the home screen.",
            },
          ],
        },
        {
          label: "AI assistant",
          items: [
            {
              image: {
                src: "/whirl/chat-screens.webp",
                alt: "Two Whirl chat screens: suggested prompts, and a pet-friendly restaurant recommendation with a reservation prompt.",
              },
              caption:
                "I also designed an AI assistant concept with live information on dietary restrictions, pet-friendly places and other personal requests. The app also features short videos of places to go and things to see, so restaurant owners can upload their own content there.",
            },
            {
              image: {
                src: "/whirl/coffee-chat.webp",
                alt: "A Whirl chat suggesting a nearby coffee shop, with pet friendly and parking tags and a prompt to see the online menu.",
              },
              caption:
                "Asking in plain language replaces filters: the assistant suggests a place that matches your preferences and offers a useful next step, like seeing the menu before you go.",
            },
          ],
        },
      ],
    },
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
    overview:
      "Watchson started as an internal problem we had at the agency. We needed a better way to understand how our developers and designers were being allocated across client projects, what skills each person had or was trying to build, and how to bring the HR team closer to the reality of what the dev team actually did day to day. It was also an opportunity to involve junior developers in a real product from the start, giving them a place to contribute ideas and learn what it feels like to ship something fast.",
    coverBackground: "linear-gradient(180deg, #ece4f7 0%, #d3c4ec 100%)",
    coverImage: "/watchson/cover-4.png",
    coverImageAlt: "Watchson new simulation screen on a pink and purple gradient, with an employee fit table and a radar chart comparing project requirements with team skills.",
    coverCaption:
      "Watchson started as an internal problem at a design agency: seeing how developers and designers were allocated across client projects, what skills each person had or wanted to build, and bringing HR closer to the dev team's daily work. It also gave junior developers a real product to ship.",
    images: [],
    page: {
      problem:
        "Our developers had to fill in a form every six months with their skills, areas of focus and project mood. They never did, so managers lacked the allocation information they needed for agency projects. The company CTO and I had an idea.",
      myRole:
        "I was the sole Product Designer, working with the CTO and a lead developer. I ran interviews and insight gathering, and designed the concept around a gamified skill scoring system.",
      sections: [
        {
          label: "Approach",
          items: [
            {
              image: {
                src: "/watchson/skills-flow.png",
                alt: "An early flow draft that asks how skilled you are in English, Front End and Back End, with a sleepy emoji beside it.",
              },
              caption:
                "I ran gaming sessions with our developers, mostly card games, and brainstormed ideas with them. A few of them had already gamified many aspects of their work and life, which gave me the insight I needed.",
            },
            {
              image: {
                src: "/watchson/welcome-email.webp",
                alt: "The Welcome to Watchson email, with a space-duck illustration and a Vamos começar button.",
                position: "top",
              },
              caption:
                "The first touchpoint is a welcome email that invites each developer to create an account, whether to log their skills, track them, or get a nudge to improve them.",
            },
          ],
        },
        {
          label: "Concept",
          items: [
            {
              image: {
                src: "/watchson/new-simulation.webp",
                alt: "The New Simulation screen, a table ranking employees by level and fit for a project, next to a radar chart of project requirements against team skills.",
              },
              caption:
                "The concept borrows from football manager games, where chemistry, skill level and motivation drive the player cards you build before a match. Here, a match is a client’s project, and each person gets a fit score for it.",
            },
            {
              image: {
                src: "/watchson/people-dashboard.webp",
                alt: "The Watchson People dashboard, with total, billable and surplus hours, an employee list with skills, and a panel with an employee’s mood and notes.",
              },
              caption:
                "Managers get a live view of their workforce: hours, projects, skills and each person’s mood in one place, so allocation stops being guesswork.",
            },
          ],
        },
        {
          label: "Findings",
          items: [
            {
              image: {
                src: "/watchson/simulation-employee.webp",
                alt: "Two side panels: a project simulation with a skills radar chart, and an employee profile with skill ratings, a mood selector and notes.",
              },
              caption:
                "If we gamified skills and turned the form’s data into a team-building card game, managers could better see their workforce move, and developers would be driven to adjust their skills to fit a team in a ranking-style system.",
            },
            {
              image: {
                src: "/watchson/choose-skills.webp",
                alt: "The Choose Skills step of a new simulation, with skill tags grouped into Front End, Back End and Other, and a purple duck illustration.",
              },
              caption:
                "By bringing different team leaders in as peers on this project, we also set clear expectations for how the product would succeed. That depended on their ability to manage, update and help developers find their matching skills.",
            },
          ],
        },
        {
          label: "Gamification ideas",
          items: [
            {
              image: {
                src: "/watchson/ducks.webp",
                alt: "A flock of purple duck mascots, including a builder duck and a wizard duck with a star on its hat.",
                position: "center",
              },
              caption:
                "We played with many gamification concepts that made sense for the people using the platform: achievements, avatars, improvements, and the addition of ducks. Too many ducks…",
            },
          ],
        },
      ],
    },
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
  {
    slug: "rho-studio",
    name: "Rho Studio",
    tagline: "Designing how writers and AI agents build stories together, for an a16z-backed AI game engine.",
    year: "2023",
    category: "Featured Work",
    role: "Sole Product Designer",
    overview:
      "Series AI is building Rho Engine, an AI-native platform for game development. I designed the multiplayer workspace where writers, producers and AI agents build a story together.",
    coverBackground: "linear-gradient(180deg, #dcd7dc 0%, #b9b2ba 100%)",
    coverImage: "/rho/cover-4.webp",
    coverImageAlt: "Rho Studio home screen in dark mode, framed on a warm background, with agent shortcuts and a feed of AI-generated images.",
    coverCaption:
      "Series AI, backed by a16z, Bitkraft and F4 Fund, is building Rho Engine: an AI-native game development platform unveiled at GDC 2024, built so small teams can create worlds that once needed a full studio. Its users are game writers, producers and directors. Great storytellers, but most weren't AI-savvy. They needed one place to shape a story together, document it, and generate assets like concept art to back up their ideas.",
    images: [],
    tags: ["AI Agents", "Interaction Design", "Game Development", "Prototyping"],
    myRole: {
      summary:
        "I was the only product designer on this work, hired on a fractional basis. I reported to the Founder and Creative Director and worked day to day with the front-end team. I:",
      points: [
        "Interviewed the Founder and Creative Director on their vision, their users and what investors needed to see",
        "Mapped the full multichat flow, from building an agent to bringing it into a shared channel",
        "Designed the multichat, the plan/execute workflow and the output window",
        "Validated mockups with engineering and presented the final vision as a prototyped flow",
      ],
    },
    pitch: [
      {
        label: "The Challenge",
        headline: "Design a workspace where writers and AI agents build a story together, before AI patterns existed.",
        points: [
          "Only chat models and basic agents existed, so there was no playbook for multiplayer AI collaboration.",
          "With several humans and agents in one conversation, users needed to know who was speaking and trust what agents produced.",
          "A story world is a web of connected facts. Change one detail and agents can quietly contradict the rest.",
        ],
      },
      {
        label: "The Approach",
        headline: "Meet writers where they already work, and keep them in control.",
        points: [
          "A group chat, like a Slack channel. Agents are built and tested in a private 1:1 chat, then brought into a shared channel.",
          "Every agent is labeled and only acts when called: @mention brings in one agent, /prt invites all of them to contribute.",
          "Stories are organized like a wiki, and an output window shows what each agent is working on and which chapter, character or place it references.",
        ],
      },
      {
        label: "The Solution",
        headline: "Plan before agents act, and protect the story's continuity.",
        points: [
          "A plan/execute split: agents plan with high effort, then run a low-effort execution once users approve the plan. LangChain benchmarks estimate this cuts token usage by 40–70%.",
          "A continuity system based on atomic design. When a story element changes, everything that depends on it is flagged for the writer.",
          "Per-agent progress signals, added after testing with engineers showed that waiting without feedback felt broken.",
        ],
      },
    ],
    outcome:
      "My V1 vision shipped and gave the founders a working experience to show investors instead of an idea on a slide. The multichat, plan/execute workflow and output window were built on the platform, and the feature became a core part of the company's growth plan. The atomic worldbuilding model shaped how the Founder approached keeping AI-generated worlds consistent.",
    outcomeStats: [
      { value: "V1", label: "Vision shipped on the platform" },
      { value: "40–70%", label: "Estimated token savings from plan/execute" },
    ],
    mosaic: {
      label: "Visual Results",
      items: [
        {
          src: "/rho/home.webp",
          title: "Home",
          alt: "Rho Studio home screen with quick actions for AI agents, a Following feed and an AI image generator result.",
        },
        {
          src: "/rho/chapter.png",
          title: "Chapter & Plan",
          alt: "Rho Studio chapter view with generated farming tool images, a team conversation with an AI Director, and a plan panel listing tasks.",
        },
      ],
    },
  },
  {
    // Placeholder details: add My Role, Challenge / Approach / Solution, Outcome and images when ready
    slug: "liliworld",
    name: "The LiliWorld",
    tagline: "A cozy educational game for kids and parents to learn about nutrition.",
    year: "2022",
    category: "Featured Work",
    role: "Game Concept Designer, Product Designer",
    overview: "A cozy educational game for kids and parents to learn about nutrition.",
    coverBackground: "linear-gradient(180deg, #fdeaf1 0%, #f4cfe0 100%)",
    coverImage: "/liliworld/cover-4.webp",
    coverImageAlt: "The LiliWorld game screen: a top-down village with shops, a pond and a dock, with a coin counter and a star counter in the corners.",
    coverCaption: "A cozy educational game for kids and parents to learn about nutrition.",
    images: [],
    tags: ["Game Design", "Education", "Nutrition"],
  },
  {
    // Placeholder details: add My Role, Challenge / Approach / Solution, Outcome and images when ready
    slug: "pewee-diary",
    name: "Pewee Diary",
    tagline: "A diary for nurses to connect with hospital kids about their digestive health.",
    year: "2021",
    category: "Featured Work",
    role: "Illustrator and Product Designer",
    overview: "A diary for nurses to connect with hospital kids about their digestive health.",
    coverBackground: "linear-gradient(180deg, #f8e9ef 0%, #efcdda 100%)",
    coverImage: "/pewee/cover-4.png",
    coverImageAlt: "Three Pewee Diary screens on a soft pink background: tracking pee color and volume, three character guides, and a story screen with a play button.",
    coverCaption: "A diary for nurses to connect with hospital kids about their digestive health.",
    images: [],
    tags: ["Illustration", "Healthcare", "Mobile"],
  },
  {
    // Placeholder details: add My Role, Challenge / Approach / Solution, Outcome and images when ready
    slug: "plywood",
    name: "Plywood",
    tagline: "A webmarket for sustainable construction products.",
    year: "2019",
    category: "Featured Work",
    role: "Web Designer",
    overview: "A webmarket for sustainable construction products.",
    coverBackground: "linear-gradient(180deg, #46463f 0%, #26261f 100%)",
    coverImage: "/plywood/cover-4.png",
    coverImageAlt: "Plywood menu on a dark screen: product links, a news card, and an isometric house map with numbered product hotspots.",
    coverCaption: "A webmarket for sustainable construction products.",
    images: [],
    tags: ["Marketplace", "Sustainability", "Construction"],
  },
];

export const projectCategories: ProjectCategory[] = [
  "Current Work",
  "Hackathon Project",
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

export function getPreviousProject(currentSlug: string): Project {
  const index = projects.findIndex((project) => project.slug === currentSlug);
  if (index <= 0) {
    return projects[projects.length - 1];
  }
  return projects[index - 1];
}

// Backdrop behind a project's cover image, on its page and in the previews
export const DEFAULT_COVER_BACKGROUND = "linear-gradient(180deg, #eeeae6 0%, #d3cdc6 100%)";

export function getCoverBackground(project: Project): string {
  return project.coverBackground ?? DEFAULT_COVER_BACKGROUND;
}
