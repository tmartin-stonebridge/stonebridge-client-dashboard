// Brand tokens from the Stonebridge Canva Brand Kit.
// Neutrals (page/line/muted/*Bg) are DERIVED — not in the kit. Swap if your
// brand guide specifies neutrals.
export const T = {
  navy: "#264469",    // brand — primary
  slate: "#3F4B5C",   // brand — body ink
  olive: "#838E59",   // brand — accent / positive
  blue: "#699CC6",    // brand — data
  orange: "#F79B2E",  // brand — data
  coral: "#E45D50",   // brand — attention (Needs you) ONLY
  white: "#FFFFFF",   // brand — card
  page: "#F4F6F8",    // DERIVED neutral canvas
  line: "#E4E7EB",    // DERIVED hairline
  muted: "#8A9099",   // DERIVED caption grey
  oliveBg: "#EEF0E6", // DERIVED olive tint (pills)
  coralBg: "#FBECEA", // DERIVED coral tint (alert card)
} as const;

// CSS variables defined in globals.css. Gotham is licensed — self-host it and
// it takes over automatically (it's first in the --font-display stack).
export const fonts = {
  display: "var(--font-display)",
  body: "var(--font-body)",
} as const;
