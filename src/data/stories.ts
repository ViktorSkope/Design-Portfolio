// Every project page tells its story the same way: a one-line title, the facts,
// then short sections. Each section leads with a headline that makes its point,
// so reading only the headlines still tells the whole project.

export interface StoryImage {
  src: string;
  alt: string;
  // An illustration: shown small on the page background, with no zoom
  plain?: boolean;
  // A painting the screenshot sits on, like the recordings' stages
  backdrop?: string;
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
  // The short label above the headline; left out on the headlines that continue a section
  label?: string;
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
  // A short notice set apart under the summary, like an NDA
  note?: string;
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
      {
        label: "Solution",
        headline: "Every collaborator got a character sheet worth keeping up to date",
        text: "Skills became levels, XP and a five-point star scored against what their project expects. Collaborators see how they help their party and where it needs a hand, and leaders plan the next six months with the same numbers.",
        media: [
          {
            src: "/watchson/player-profile.webp",
            alt: "A collaborator's Watchson profile: level and XP, their current project and party, how they help the team, and a star chart against the project baseline",
            backdrop: "/images/work/field-backdrop.webp",
          },
        ],
      },
      {
        label: "Planning",
        headline: "Leaders walked into the meeting knowing what every team costs",
        text: "The same data rolled up into budgets per project and the cost of everyone on the bench, with the open seats each person could fill. Deciding who works where became a matter of reading the numbers, not guessing.",
        media: [
          {
            src: "/watchson/costs.gif",
            alt: "Watchson's costs view: total, billable and bench cost, each project's budget used, and the people on the bench with the projects they could join",
            backdrop: "/images/work/sky-backdrop.webp",
          },
        ],
      },
    ],
  },

  ingrid: {
    title: "Turning machine error codes into warnings technicians can act on",
    summary:
      "Ingrid lets field technicians monitor autonomous harvesters remotely. I redesigned it so they could use it without a manual.",
    note: "This is an NDA protected project. Names and brands have been changed to preserve the real product.",
    facts: [
      { label: "Role", value: "Product Design Lead" },
      { label: "Scope", value: "Product design, UX research, visual identity" },
    ],
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
        label: "Overview",
        headline: "Mistakes are costly in the mining industry",
        text: "A 50k USD flat tire in one of these giant haulers is very cheap to fix if you compare with the production time that it costs the company to deal with a non-productive truck.",
      },
      {
        headline: "Preventive maintenance meant to watch for signals and know when to do pit-stops",
        text: "For Ingrid, that meant knowing when to stop and when to keep the machines running to maximize production and avoid critical errors that could impact production.",
      },
      {
        headline: "But there was too much noise in the information technicians were receiving",
        text: "Every problem reached them as an error code. Understanding one meant reading the full log or a cheat sheet, and some codes were only signal noise.",
        media: [{ src: "/ingrid/time-to-reaction.png", alt: "Time to reaction: a code log splits into error, monitoring and health signals, which lead to danger, warning and position states." }],
      },
      {
        label: "Setup",
        headline: "Help technicians react to a problem without decoding it first.",
        text: "We made prototypes in Figma and tested them with their users in a 4-week discovery process, to discover which triggers were important for technicians in the field, and remotely, to verify before making a decision.",
        media: [{ src: "/ingrid/workshop-board.webp", alt: "The discovery workshop board: an agenda and the business impacts and blockers on sticky notes, then the user journey drawn as a map." }],
      },
      {
        label: "Hypothesis",
        headline: "The higher the warning, the less required decisions.",
        text: "Emergencies start a countdown to shutdown that the technician can cancel. Major errors can wait until they know more, and recurring ones stay on screen without interrupting work.",
        media: [rec("native", "ingrid-truck-card", "ingrid-truck-card-poster.webp", 946, 430, "Ingrid in use: a truck's status card over a satellite map, showing its speed, payload and arrival time")],
      },
      {
        label: "Outcome",
        headline: "Onboarding went from an hour-long workshop to eight minutes",
        text: "Controlled studies showed full adoption within two sessions, and the MVP replaced other training and monitoring software.",
        media: [rec("ingrid", "ingrid-onboarding", "ingrid-onboarding-poster.webp", 1280, 664, "Ingrid's guided onboarding: a step-by-step panel explains the fleet cards and their status dots beside the map")],
      },
      {
        headline: "1.5 M USD each year saved in licensing fees",
        text: "Creating their proprietary product helped them save costs in third-party programs that we were able to incorporate into their product.",
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
        label: "Overview",
        headline: "Hundreds of shops tuned their search in a console nobody fully understood",
        text: "Athos Commerce's console was 20 years old. Its users knew it by heart, but no one on the team had a full picture of what it did.",
        split: true,
        media: [{ src: "/athos/walrus-challenge.svg", alt: "", plain: true }],
      },
      {
        label: "Challenge",
        headline: "Rebuild the console without making its daily users relearn their work.",
        text: "I mapped every feature into a wiki before designing anything, and built the design system on MUI, the framework engineering already used, so we wouldn't carry the old technical debt.",
        split: true,
        media: [{ src: "/athos/flows.png", alt: "Sitemap of the Athos console mapping every menu, feature and flow." }],
      },
      {
        label: "Solution",
        headline: "Highest impact, fewest changes first",
        text: "Like repairing a moving car. The campaign editor went from two navigation bars to one, with the boosting rules docked beside the grid, and we kept some redundant actions so long-time users didn't have to relearn.",
        compare: {
          before: "/athos/editor-before.webp",
          after: "/athos/editor-after.webp",
          beforeAlt: "Original Edit Visual Merchandising Campaign page with a floating boosting rules panel over the product grid and two stacked navigation bars.",
          afterAlt: "Redesigned Campaign Editor with a single icon navigation, a docked Product Boosting Rules panel and a compact product grid.",
          caption: "Drag to compare",
        },
      },
      {
        label: "Outcome",
        headline: "Teams across acquired companies now build on the same system",
        text: "As Athos acquired other companies, the design system let designers, marketers and PMs build safely, and the work moved from adding features to smoothing the journey across them.",
        media: [
          {
            src: "/athos/recommendations.webp",
            alt: "Recommendations profile editor with a live preview of recommended products.",
            backdrop: "/images/work/lake-backdrop.webp",
          },
        ],
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
        label: "Overview",
        headline: "Writing notes is easy. Finding them in the right context isn't",
        text: "My own notes app with ChatGPT lost track in long sessions and mixed up similar names and projects.",
        split: true,
        media: [{ src: "/blindspot/mascots.webp", alt: "Four Blindspot mascots on lilac, dark, white and lime backgrounds next to the logo." }],
      },
      {
        label: "Challenge",
        headline: "Give every note enough context to be found later, without folders or lists.",
        text: "An engineer and I built a prototype in a weekend, demoed it to friends and opened a waitlist.",
        split: true,
        media: [{ src: "/blindspot/website.png", alt: "Blindspot's website: Out of sight, but never out of mind, with a Get the Demo button and hand-drawn mascots." }],
      },
      {
        label: "Solution",
        headline: "Just write. Type @ for people and / for projects",
        text: "Those two tools link each note to who and what it's about, so you can recall the context of an idea before a meeting.",
        media: [
          {
            src: "/blindspot/popup-notes.webp",
            alt: "Blindspot's quick note pop-up on the desktop, over a notes window with a search and a chat for recalling context using @ for people and / for projects.",
            backdrop: "/images/work/field-backdrop.webp",
          },
        ],
      },
      {
        label: "Outcome",
        headline: "An insurance company bought it to prospect clients",
        text: "The waitlist told us what to build next: more channels, messaging app integrations, import and export.",
        media: [
          {
            src: "/blindspot/expanded-view.webp",
            alt: "Blindspot's expanded view: a sidebar with the account and My Network, and a clean page for writing context notes.",
            backdrop: "/images/work/sky-backdrop.webp",
          },
        ],
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
        label: "Overview",
        headline: "New restaurants struggle to reach the people nearby",
        text: "Star Sales wanted a coupon partner program to connect them. Whirl is my concept for how AI could make that journey better.",
        split: true,
        media: [{ src: "/whirl/logo-identity.webp", alt: "Whirl logo construction, with a handwritten spiral sketch and proportions, shown as an app icon in the App Store and on an iPhone home screen." }],
      },
      {
        label: "Challenge",
        headline: "Make choosing a place feel lighter than setting filters.",
        text: "Cards show places, you discard what you don't want, and the app learns your taste from what's left.",
        split: true,
        media: [{ src: "/whirl/sorting-home.webp", alt: "Whirl home screen with an Around you carousel and card sorting categories, surrounded by tilted City Tour, Gallery, Coffee Place and Outdoors Restaurant cards." }],
      },
      {
        label: "Solution",
        headline: "Ask in plain language, and get a match with a next step",
        text: "Dietary needs, pets, parking: the assistant suggests a place and what to do next, like seeing the menu before you go.",
        media: [
          {
            src: "/whirl/chat-screens.webp",
            alt: "Two Whirl chat screens: suggested prompts, and a pet-friendly restaurant recommendation with a reservation prompt.",
            backdrop: "/images/work/sky-backdrop.webp",
          },
        ],
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
        label: "Overview",
        headline: "Writers and AI agents build game worlds together in one chat",
        text: "There was no playbook for people and agents sharing a workspace. Users had to know who was speaking, and trust what agents produced.",
        split: true,
        media: [{ src: "/rho/home-agents.webp", alt: "Rho Engine's home screen: suggested agent tasks, and a feed of the team's chapter edits and an AI Image Generator's results." }],
      },
      {
        label: "Challenge",
        headline: "Keep the story consistent when people and agents change it at once.",
        text: "Change one fact in a story, and agents could quietly contradict the rest.",
        split: true,
        media: [{ src: "/rho/thread.png", alt: "A Cozy Farm thread beside the home screen, with messages from the team, an AI Director's plan and an AI Image Generator result." }],
      },
      {
        label: "Solution",
        headline: "Agents only act when called, and plan before they run",
        text: "Bring an agent into the shared chat with an @mention. It proposes a plan, runs once you approve and shows its progress. Change a story fact, and everything that depends on it is flagged.",
        media: [
          {
            src: "/rho/chapter-plan.png",
            alt: "A Cozy Farm chapter with generated farming tool images, a team conversation with an AI Director, and a plan panel listing running tasks.",
            backdrop: "/images/work/field-backdrop.webp",
          },
        ],
      },
      {
        label: "Outcome",
        headline: "V1 shipped and became core to the company's growth plan",
        text: "The founders could show investors a working product instead of a slide, and planning before running is estimated to cut token use by 40–70%.",
        stats: [
          { value: "V1", label: "Shipped on the platform" },
          { value: "40–70%", label: "Estimated token savings" },
        ],
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
        label: "Overview",
        headline: "A children's clothing brand wanted to help families eat better",
        text: "Its consultants pitched a metaverse with tokens, but Web3 carried privacy and regulation risks for a young audience.",
        split: true,
        media: [{ src: "/liliworld/characters.webp", alt: "A sheet of LiliWorld characters: a koala in pink overalls, a scientist with goggles, a wizard, a straw-hat fisher, a toucan, a sheep and a drone." }],
      },
      {
        label: "Challenge",
        headline: "Teach kids about nutrition without turning food into a reward.",
        text: "Our first prototype paid coins for eating healthy, and kids tried to game them. Teachers and psychologists pointed us to curiosity instead.",
        split: true,
        media: [{ src: "/liliworld/gameplay.webp", alt: "The LiliWorld gameplay screen: a player character and a hovering drone on a patchy field, with an item bar, a coin counter and a star counter." }],
      },
      {
        label: "Solution",
        headline: "Care for an island, and learn how to care for your body",
        text: "Players grow and cook food for the islanders, and their multitool recharges with the foods they just learned about. The land heals as they eat well.",
        pair: true,
        media: [
          { src: "/liliworld/island.webp", alt: "The LiliWorld island seen from above, with an observatory, a clothing shop, a furniture store, a greenhouse, a dock and the island's characters." },
          { src: "/liliworld/tiles.webp", alt: "Four stages of the island's terrain tiles, from dry reeds to lush grass with trees, mushrooms and flowers." },
        ],
      },
      {
        label: "Outcome",
        headline: "The board approved about $1M, and the concept sold for $180K",
        text: "I pitched the first 10 minutes of gameplay, tying each mechanic to its business value. Development later paused when costs rose, and the client kept the IP.",
        stats: [
          { value: "~$1M", label: "Approved by the board" },
          { value: "$180K", label: "Paid for the concept and story" },
        ],
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
