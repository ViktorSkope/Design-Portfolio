import type { CSSProperties } from "react";

// The dark UI under the header: the work section on the landing page and the
// project pages. Shared text components read these, and fall back to the light
// page's tones where they are not set.
export const DARK_TONES = {
  "--bg": "#141414",
  "--ink": "#F0EDEB",
  "--muted": "#8F8B86",
  "--hair": "#2C2C2C",
  "--impact": "#6BD49A",
} as CSSProperties;
