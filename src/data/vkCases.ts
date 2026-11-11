// Their thumbnails: a recording on a painted backdrop
export const VK_CARDS: Record<string, { meta: string; result: string; poster: string; video: string; width?: number; height?: number; thumbVideo?: boolean }> = {
  ingrid: {
    meta: "Product · Autonomous machinery",
    result: "Onboarding cut from an hour to eight minutes, saving $1.5M a year in licensing fees.",
    poster: "/images/work/ingrid-intro-poster.webp",
    video: "/videos/ingrid-intro",
    width: 1560,
    height: 986,
  },
  watchson: {
    meta: "Platform · Internal tooling",
    result: "Fewer than 10% of 75 collaborators updated their skills form, so we turned it into a game leaders could plan with.",
    poster: "/images/work/watchson-intro-poster.webp",
    video: "/videos/watchson-intro",
    // Its thumbnail plays the recording too
    thumbVideo: true,
    width: 1556,
    height: 986,
  },
};
