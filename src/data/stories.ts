// Every project page tells its story the same way: a one-line title, the facts,
// then short sections. Each section leads with a headline that makes its point,
// so reading only the headlines still tells the whole project.

export interface StoryImage {
  src: string;
  alt: string;
  // An illustration: shown small on the page background, with no zoom
  plain?: boolean;
  caption?: string;
}

export interface StoryRecording {
  // A product recording on a painted stage (see .media-stage in the styles)
  stage: string;
  video: string;
  poster: string;
  width: number;
  height: number;
  label: string;
  caption?: string;
}

export type StoryMedia = StoryImage | StoryRecording;

export interface StoryBlock {
  // The short label above the headline, also used in the side contents
  label: string;
  headline: string;
  text?: string;
  points?: string[];
  media?: StoryMedia[];
  // Text beside the media instead of above it
  split?: boolean;
  // With split: the media on the left, so consecutive splits alternate
  reverse?: boolean;
  // A single statement set larger, for the one line the project turns on
  emphasis?: boolean;
  // Two short columns compared side by side, like before and after
  versus?: { label: string; text: string }[];
  // Two images side by side
  pair?: boolean;
  stats?: { value: string; label: string }[];
  compare?: { before: string; after: string; beforeAlt: string; afterAlt: string; caption?: string };
}

export interface Story {
  title: string;
  summary: string;
  facts: { label: string; value: string }[];
  link?: { href: string; label: string };
  // A recording shown in place of the cover image
  cover?: StoryRecording;
  blocks: StoryBlock[];
}

const rec = (
  stage: string,
  name: string,
  poster: string,
  width: number,
  height: number,
  label: string,
  caption?: string,
): StoryRecording => ({ stage, video: `/videos/${name}`, poster: `/images/work/${poster}`, width, height, label, caption });

export const STORIES: Record<string, Story> = {
  watchson: {
    title: "Gamifying an HR form into a complete people management system",
    summary:
      "Watchson turned a skills form nobody filled in into a game collaborators play and a source of truth leaders plan with.",
    facts: [
      { label: "Role", value: "Product Designer" },
      { label: "Collaborator", value: "Lauri Jr." },
      { label: "Client", value: "ateliware" },
      { label: "Scope", value: "Product Design" },
      { label: "Year", value: "2022" },
    ],
    cover: rec(
      "watchson",
      "watchson-team",
      "watchson-team-poster.webp",
      1280,
      664,
      "Watchson in use: a project team table with cost, billing and fit scores, beside a radar chart comparing the team with the project baseline",
    ),
    blocks: [
      {
        label: "Overview",
        headline: "Every six months, ateliware's leaders decided who works where",
        text: "They managed collaborators' skills and positions with a form. Less than 10% of their 75 collaborators kept it updated, so team leaders did a lot of guesswork during those meetings.",
        split: true,
        media: [{ src: "/watchson/form-illustration.png", alt: "", plain: true }],
      },
      {
        label: "Challenge",
        headline: "Have a consistent way to keep collaborators' skills updated and in one place.",
        text: "The challenge was to deliver a process that would not only engage ateliware's collaborators, but also become the source of truth for the bi-annual meetings.",
        split: true,
        media: [rec("watchson-panel", "watchson-panel", "watchson-panel-poster.webp", 650, 582, "Watchson in use: a project's team table beside the star skills panel")],
      },
    ],
  },

  ingrid: {
    title: "Turning machine error codes into warnings technicians can act on",
    summary:
      "Ingrid lets field technicians monitor autonomous harvesters remotely. I redesigned it so they could use it without a manual.",
    facts: [
      { label: "Role", value: "Product Design Lead" },
      { label: "Team", value: "A researcher, two field technicians and me" },
      { label: "Scope", value: "Product design, UX research, visual identity" },
      { label: "Discovery", value: "4 weeks" },
      { label: "Year", value: "2022" },
    ],
    link: { href: "https://ingrid-eight.vercel.app/", label: "Open the live product" },
    cover: rec(
      "ingrid",
      "ingrid-fleet",
      "ingrid-poster.webp",
      1280,
      664,
      "Ingrid in use: a fleet list beside a satellite map, with a truck's route, status and warnings",
    ),
    blocks: [
      {
        label: "Problem",
        headline: "Technicians had seconds to react, but errors arrived as codes.",
        points: [
          "Understanding a problem meant reading the full log",
          "Codes had to be memorised or looked up on a cheat sheet",
          "Some errors were only signal noise, with nothing really wrong",
        ],
        media: [{ src: "/ingrid/time-to-reaction.png", alt: "Time to reaction: a code log splits into error, monitoring and health signals, which lead to danger, warning and position states.", caption: "One code log hid three different kinds of signal" }],
      },
      {
        label: "Research",
        headline: "We watched how technicians actually monitor the machines.",
        text: "A four-week discovery mapped their day, then we tested prototypes against the decisions they make in the field.",
        pair: true,
        media: [
          { src: "/ingrid/workshop-board.webp", alt: "The discovery workshop board: an agenda and the business impacts and blockers on sticky notes, then the user journey drawn as a map.", caption: "Discovery workshop" },
          { src: "/ingrid/flows.webp", alt: "Wireframe flows for the platform, from login and home through the interactive map to equipment data, warnings and the emergency stop.", caption: "Flows tested with technicians" },
        ],
      },
      {
        label: "Key decision",
        headline: "Design for reaction, not decoding.",
        text: "Instead of asking technicians to read an error and decide, the product acts by default, and they step in when they know more.",
        media: [{ src: "/ingrid/danger-warning.webp", alt: "A danger warning over the production map for combine D10: low rear tire pressure, shutting down in 45 seconds, with a Cancel Shutdown button.", caption: "A countdown to shutdown that the technician can cancel" }],
      },
      {
        label: "Solution",
        headline: "Every warning is tiered by how urgent it is.",
        points: [
          "Emergencies start a countdown to shutoff; dismissing it keeps the machine running",
          "Major errors can be postponed until the technician knows more",
          "Simple recurring errors stay on screen without interrupting work",
        ],
        split: true,
        media: [rec("fill", "ingrid-truck-card", "ingrid-truck-card-poster.webp", 946, 430, "Ingrid in use: a truck's status card over a satellite map, showing its speed, payload and arrival time")],
      },
      {
        label: "Outcome",
        headline: "Onboarding went from an hour-long workshop to eight minutes.",
        text: "Controlled studies showed full adoption within two sessions, usually one. The MVP also replaced other training and monitoring software.",
        stats: [
          { value: "8 min", label: "Onboarding, down from an hour" },
          { value: "100%", label: "Adoption within two sessions" },
          { value: "$1.5M", label: "Saved each year in licensing fees" },
        ],
        media: [rec("ingrid", "ingrid-onboarding", "ingrid-onboarding-poster.webp", 1280, 664, "Ingrid's guided onboarding: a step-by-step panel explains the fleet cards and their status dots beside the map", "The guided onboarding")],
      },
      {
        label: "Brand",
        headline: "A two-week sprint gave Ingrid a brand to show at conferences.",
        media: [{ src: "/ingrid/identity-board.webp", alt: "The visual identity workshop board: style direction, reference photography and brand marks gathered for the Ingrid styleguide.", caption: "The styleguide and UI kit came out of this board" }],
      },
    ],
  },

  "athos-commerce": {
    title: "Rebuilding a 20-year-old merchandising console without losing its users",
    summary:
      "Athos Commerce helps online shops tune search and merchandising. Hundreds of people use it daily, so the redesign had to respect how they already work.",
    facts: [
      { label: "Role", value: "Lead Product Designer" },
      { label: "Team", value: "PM, engineers, a design assistant and me" },
      { label: "Status", value: "Early access" },
      { label: "Timeline", value: "2023–2026" },
    ],
    blocks: [
      {
        label: "Problem",
        headline: "Personalising a shop shouldn't need code, but most tools demand it.",
        text: "Shops and agencies want results tuned to their customers' habits. And no one had a full picture of what the old console did.",
        media: [{ src: "/athos/flows.png", alt: "Sitemap of the Athos console mapping every menu, feature and flow.", caption: "I mapped every feature into a wiki before designing anything" }],
      },
      {
        label: "Foundation",
        headline: "Design and engineering had to speak the same language.",
        text: "To win board approval we had to avoid the old technical debt. I built the design system on MUI, the framework engineering already used.",
        media: [{ src: "/athos/variables.png", alt: "Variables in the Athos design kit, showing collections, names and the Athos Light mode values.", caption: "Variables layered on top of MUI's base" }],
      },
      {
        label: "Approach",
        headline: "Highest impact, fewest changes first.",
        text: "Like repairing a moving car. Once the components held up, we took on the big features, guided by beta customers and support recordings.",
        pair: true,
        media: [
          { src: "/athos/manage-features.webp", alt: "Manage Features settings page with grouped feature toggles.", caption: "Feature settings" },
          { src: "/athos/recommendations.webp", alt: "Recommendations profile editor with a live preview of recommended products.", caption: "Recommendations editor" },
        ],
      },
      {
        label: "Before / after",
        headline: "The campaign editor, from two navigation bars to one.",
        compare: {
          before: "/athos/editor-before.webp",
          after: "/athos/editor-after.webp",
          beforeAlt: "Original Edit Visual Merchandising Campaign page with a floating boosting rules panel over the product grid and two stacked navigation bars.",
          afterAlt: "Redesigned Campaign Editor with a single icon navigation, a docked Product Boosting Rules panel and a compact product grid.",
          caption: "Drag to compare. The boosting rules now dock beside the grid",
        },
      },
      {
        label: "Trade-off",
        headline: "New users got faster. Long-time users didn't want to relearn.",
        text: "So we kept some redundant actions for existing customers. New customers simply ignore them.",
        media: [{ src: "/athos/create-synonym.png", alt: "The Create Synonym modal, with Grouped and One-Way synonym types and the searching-for and also-returns fields." }],
      },
      {
        label: "Now",
        headline: "From adding features to smoothing the journey across them.",
        text: "As Athos acquired other companies, the design system let designers, marketers and PMs across teams build safely.",
        media: [{ src: "/athos/color-aliases.png", alt: "Colour mapping boards comparing Athos and IR palettes and proposing aliases for background, stroke and text colours.", caption: "Aliasing two brands' colours into one system" }],
      },
    ],
  },

  blindspot: {
    title: "A notetaker that remembers the context for you",
    summary: "Blindspot turns your notes into a personal wiki, so you can pull up the context of an idea before a meeting.",
    facts: [
      { label: "Role", value: "Founder" },
      { label: "Team", value: "An engineer and me" },
      { label: "Scope", value: "Product, brand, marketing" },
      { label: "Year", value: "2025" },
    ],
    blocks: [
      {
        label: "Problem",
        headline: "Writing notes is easy. Finding them in the right context isn't.",
        text: "My own notes app with ChatGPT lost track in long sessions and mixed up similar names and projects.",
      },
      {
        label: "Solution",
        headline: "Just write. Type @ for people and / for projects.",
        text: "No folders, no lists. Those two tools give every note enough context to be found later.",
        media: [{ src: "/blindspot/popup-notes.webp", alt: "Blindspot's quick note pop-up on the desktop, over a notes window with a search and a chat for recalling context using @ for people and / for projects." }],
      },
      {
        label: "Validation",
        headline: "A weekend prototype, then a waitlist.",
        text: "I demoed it to friends and learned what to change next: more channels, messaging app integrations, import and export.",
        media: [{ src: "/blindspot/website.png", alt: "Blindspot's website: Out of sight, but never out of mind, with a Get the Demo button and hand-drawn mascots." }],
      },
      {
        label: "Brand",
        headline: "Doodles on an empty white sheet.",
        media: [{ src: "/blindspot/mascots.webp", alt: "Four Blindspot mascots on lilac, dark, white and lime backgrounds next to the logo." }],
      },
      {
        label: "Outcome",
        headline: "An insurance company bought it to prospect clients.",
        media: [{ src: "/blindspot/expanded-view.webp", alt: "Blindspot's expanded view: a sidebar with the account and My Network, and a clean page for writing context notes." }],
      },
    ],
  },

  whirl: {
    title: "An AI assistant for finding where to eat and what to do",
    summary: "A concept for connecting new restaurants with the people of their city, through conversation instead of filters.",
    facts: [
      { label: "Role", value: "Product Designer" },
      { label: "Type", value: "Concept" },
      { label: "Scope", value: "Discovery, identity, visual design" },
      { label: "Year", value: "2020" },
    ],
    blocks: [
      {
        label: "Problem",
        headline: "New restaurants struggle to reach people nearby.",
        text: "Star Sales wanted a coupon partner program to connect them. I designed Whirl to show how AI could make that journey better.",
      },
      {
        label: "Decision",
        headline: "Choose by elimination.",
        text: "Cards show places; you discard what you don't want, and the app learns your taste from what's left.",
        media: [{ src: "/whirl/sorting-home.webp", alt: "Whirl home screen with an Around you carousel and card sorting categories, surrounded by tilted City Tour, Gallery, Coffee Place and Outdoors Restaurant cards." }],
      },
      {
        label: "Solution",
        headline: "Ask in plain language instead of setting filters.",
        text: "Dietary needs, pets, parking: the assistant suggests a match and a next step, like seeing the menu before you go.",
        pair: true,
        media: [
          { src: "/whirl/chat-screens.webp", alt: "Two Whirl chat screens: suggested prompts, and a pet-friendly restaurant recommendation with a reservation prompt." },
          { src: "/whirl/coffee-chat.webp", alt: "A Whirl chat suggesting a nearby coffee shop, with pet friendly and parking tags and a prompt to see the online menu." },
        ],
      },
      {
        label: "Brand",
        headline: "A handwritten spiral, carried into the app icon.",
        media: [{ src: "/whirl/logo-identity.webp", alt: "Whirl logo construction, with a handwritten spiral sketch and proportions, shown as an app icon in the App Store and on an iPhone home screen." }],
      },
    ],
  },

  "rho-studio": {
    title: "A shared workspace where writers and AI agents build stories",
    summary:
      "Rho Engine, from a16z-backed Series AI, lets small teams build game worlds. I designed where writers and AI agents work together.",
    facts: [
      { label: "Role", value: "Sole Product Designer" },
      { label: "Team", value: "Founder, Creative Director, front-end team" },
      { label: "Client", value: "Series AI" },
      { label: "Year", value: "2023" },
    ],
    blocks: [
      {
        label: "Problem",
        headline: "There was no playbook for people and AI agents in one chat.",
        points: [
          "Users had to know who was speaking, a person or an agent",
          "They had to trust what agents produced",
          "Change one fact in a story, and agents could quietly contradict the rest",
        ],
      },
      {
        label: "Decision 1",
        headline: "Agents only act when called.",
        text: "The workspace is a group chat, like Slack. Build an agent in a private chat, then bring it into the shared one with an @mention.",
        media: [{ src: "/rho/thread.png", alt: "A Cozy Farm thread beside the home screen, with messages from the team, an AI Director's plan and an AI Image Generator result.", caption: "Every agent is labelled and waits to be called" }],
      },
      {
        label: "Decision 2",
        headline: "Agents plan first, and act once you approve.",
        text: "A high-effort plan, then a low-effort run, estimated to cut token use by 40–70%. Testing showed silent waiting felt broken, so each agent shows its progress.",
        media: [{ src: "/rho/chapter-plan.png", alt: "A Cozy Farm chapter with generated farming tool images, a team conversation with an AI Director, and a plan panel listing running tasks.", caption: "The plan panel lists what each agent is doing" }],
      },
      {
        label: "Decision 3",
        headline: "Change a story fact, and everything that depends on it is flagged.",
        text: "A continuity system based on atomic design keeps characters, places and chapters consistent.",
      },
      {
        label: "Outcome",
        headline: "V1 shipped and became core to the company's growth plan.",
        text: "The founders could show investors a working product instead of a slide.",
        stats: [
          { value: "V1", label: "Shipped on the platform" },
          { value: "40–70%", label: "Estimated token savings" },
        ],
        media: [{ src: "/rho/export.webp", alt: "An export dialog for 24 selected files, with Game File, File type and Export destination fields.", caption: "Generated assets export in bulk to game files" }],
      },
    ],
  },

  liliworld: {
    title: "A cozy island game that teaches families about nutrition",
    summary: "A life-sim concept for a children's clothing brand entering family nutrition.",
    facts: [
      { label: "Role", value: "Lead Product Designer, game design" },
      { label: "Team", value: "A mid-level designer and me, at an agency" },
      { label: "Timeline", value: "4 months" },
      { label: "Year", value: "2022" },
    ],
    blocks: [
      {
        label: "Problem",
        headline: "The brand's consultants pitched a metaverse with tokens. Families needed something safer.",
        text: "Children's eating habits are worsening and parents want to be more involved. Web3 carried privacy and regulation risks for a young audience.",
      },
      {
        label: "Idea",
        headline: "Care for an island, and learn how to care for your body.",
        text: "A cozy 2D life-sim. Players keep the island balanced by growing and cooking nutritious food for its islanders.",
        pair: true,
        media: [
          { src: "/liliworld/island.webp", alt: "The LiliWorld island seen from above, with an observatory, a clothing shop, a furniture store, a greenhouse, a dock and the island's characters.", caption: "The island" },
          { src: "/liliworld/tiles.webp", alt: "Four stages of the island's terrain tiles, from dry reeds to lush grass with trees, mushrooms and flowers.", caption: "The land heals as players eat well" },
        ],
      },
      {
        label: "What failed",
        headline: "Rewarding kids for eating healthy backfired.",
        text: "Kids tried to game the coins. Teachers and psychologists pointed to curiosity instead, so the core became a multitool that recharges with the foods a child just learned about.",
        media: [{ src: "/liliworld/gameplay.webp", alt: "The LiliWorld gameplay screen: a player character and a hovering drone on a patchy field, with an item bar, a coin counter and a star counter." }],
      },
      {
        label: "Pitch",
        headline: "Every mechanic had to justify its business value.",
        text: "I pitched the first 10 minutes of gameplay to a six-person board, tying each feature to market value and its risks.",
        media: [{ src: "/liliworld/characters.webp", alt: "A sheet of LiliWorld characters: a koala in pink overalls, a scientist with goggles, a wizard, a straw-hat fisher, a toucan, a sheep and a drone." }],
      },
      {
        label: "Outcome",
        headline: "The board approved about $1M, and the concept sold for $180K.",
        text: "An external studio produced assets from my designs. Development later paused when costs rose, and the client kept the IP.",
        stats: [
          { value: "~$1M", label: "Approved by the board" },
          { value: "$180K", label: "Paid for the concept and story" },
        ],
        media: [{ src: "/liliworld/home-room.webp", alt: "The koala character's home on the island: a small room with a bed, a chest, a coat stand, a rug and potted plants." }],
      },
    ],
  },

  "pewee-diary": {
    title: "A diary that helps nurses talk with kids about their digestive health",
    summary: "Characters and stories that make tracking easier for children in hospital.",
    facts: [
      { label: "Role", value: "Illustrator and Product Designer" },
      { label: "Platform", value: "Mobile" },
      { label: "Year", value: "2021" },
    ],
    blocks: [],
  },

  plywood: {
    title: "A web market for sustainable construction products",
    summary: "Browse a house, and find the sustainable products for each part of it.",
    facts: [
      { label: "Role", value: "Web Designer" },
      { label: "Type", value: "Marketplace" },
      { label: "Year", value: "2019" },
    ],
    blocks: [],
  },
};
