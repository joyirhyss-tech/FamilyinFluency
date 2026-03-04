import React from "react";

// =============================================================================
// Hand-drawn style SVG icon components for Fluency language learning app.
// All icons use stroke rendering with slightly irregular paths to achieve
// an analog / notebook sketch aesthetic.
// =============================================================================

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const HAND_DRAWN_DEFAULTS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** Standard wrapper for 24x24 icons. */
const Svg24 = ({ size = 24, className, children, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    {...HAND_DRAWN_DEFAULTS}
    {...rest}
  >
    {children}
  </svg>
);

/** Wrapper for 48x48 decorative tiles and badges. */
const Svg48 = ({ size = 48, className, children, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    {...HAND_DRAWN_DEFAULTS}
    {...rest}
  >
    {children}
  </svg>
);

// =============================================================================
// LANGUAGE TILES  (48x48, larger decorative tiles)
// =============================================================================

/**
 * MexicoTile - Papel picado banner with "MX" hand-lettered below.
 * Warm red/orange palette.
 */
export const MexicoTile = ({ size = 48, className }) => (
  <Svg48 size={size} className={className}>
    {/* Hanging string */}
    <path
      d="M6 6.5 C6 6.5 12 5.8 24 6 C36 6.2 42 6.5 42 6.5"
      stroke="var(--color-mexico-string, #c0392b)"
      strokeWidth={1.2}
    />
    {/* Papel picado banner shape - scalloped bottom */}
    <path
      d="M9 6.5 L9 24 C9.5 23 11 21.5 12.5 24 C14 21.5 15.5 23 16 24
         C16.5 23 18 21.5 19.5 24 C21 21.5 22.5 23 23 24
         C23.5 23 25 21.5 26.5 24 C28 21.5 29.5 23 30 24
         C30.5 23 32 21.5 33.5 24 C35 21.5 36.5 23 37 24
         C37.5 23 39 21.2 39 24 L39 6.5"
      stroke="var(--color-mexico-primary, #e74c3c)"
      strokeWidth={1.8}
    />
    {/* Cut-out diamond pattern inside banner */}
    <path
      d="M18 11 L20.5 14 L18 17 L15.5 14 Z"
      stroke="var(--color-mexico-accent, #e67e22)"
      strokeWidth={1.2}
    />
    <path
      d="M27 10.5 L29.5 13.5 L27 16.5 L24.5 13.5 Z"
      stroke="var(--color-mexico-accent, #e67e22)"
      strokeWidth={1.2}
    />
    {/* Small decorative circles */}
    <circle cx="13" cy="13" r="1.5" stroke="var(--color-mexico-accent, #e67e22)" strokeWidth={1} />
    <circle cx="34" cy="13.5" r="1.5" stroke="var(--color-mexico-accent, #e67e22)" strokeWidth={1} />
    {/* "MX" hand-lettered below */}
    <path
      d="M15 30 L15 39 L19.5 34 L24 39 L24 30"
      stroke="var(--color-mexico-primary, #e74c3c)"
      strokeWidth={2}
      fill="none"
    />
    <path
      d="M27.5 30 L33.5 39 M33.5 30 L27.5 39"
      stroke="var(--color-mexico-primary, #e74c3c)"
      strokeWidth={2}
    />
  </Svg48>
);

/**
 * JapanTile - Simple torii gate sketch with "JP" below.
 * Red and dark strokes.
 */
export const JapanTile = ({ size = 48, className }) => (
  <Svg48 size={size} className={className}>
    {/* Top roof beam - slightly curved with overhang */}
    <path
      d="M5 10 C10 8.5 38 8.5 43 10"
      stroke="var(--color-japan-primary, #c0392b)"
      strokeWidth={2.5}
    />
    {/* Second beam */}
    <path
      d="M10 14.5 C16 13.8 32 13.8 38 14.5"
      stroke="var(--color-japan-primary, #c0392b)"
      strokeWidth={2}
    />
    {/* Left pillar */}
    <path
      d="M14 14.5 L13.5 30"
      stroke="var(--color-japan-secondary, #2c3e50)"
      strokeWidth={2.2}
    />
    {/* Right pillar */}
    <path
      d="M34 14.5 L34.5 30"
      stroke="var(--color-japan-secondary, #2c3e50)"
      strokeWidth={2.2}
    />
    {/* Pillar base marks */}
    <path d="M11 30 L16 30" stroke="var(--color-japan-secondary, #2c3e50)" strokeWidth={1.5} />
    <path d="M32 30 L37 30" stroke="var(--color-japan-secondary, #2c3e50)" strokeWidth={1.5} />
    {/* "JP" hand-lettered below */}
    {/* J: top serif + vertical + bottom hook left */}
    <path
      d="M13 35 L21 35"
      stroke="var(--color-japan-primary, #c0392b)"
      strokeWidth={1.8}
    />
    <path
      d="M17 35 L17 42 C17 45 12 45 11 42.5"
      stroke="var(--color-japan-primary, #c0392b)"
      strokeWidth={2}
      fill="none"
    />
    {/* P: vertical + bump */}
    <path
      d="M26 35 L26 45 M26 35 C26 35 33 34.5 33 37.5 C33 40.5 26 40 26 40"
      stroke="var(--color-japan-primary, #c0392b)"
      strokeWidth={2}
      fill="none"
    />
  </Svg48>
);

/**
 * KoreaTile - Hanok roof curve with "KR" below.
 * Blue/teal palette.
 */
export const KoreaTile = ({ size = 48, className }) => (
  <Svg48 size={size} className={className}>
    {/* Hanok curved roof - the signature upswept eaves */}
    <path
      d="M4 18 C8 20 14 14 24 10 C34 14 40 20 44 18"
      stroke="var(--color-korea-primary, #2980b9)"
      strokeWidth={2.5}
      fill="none"
    />
    {/* Roof ridge detail */}
    <path
      d="M10 17 C15 13.5 20 11 24 10.5 C28 11 33 13.5 38 17"
      stroke="var(--color-korea-accent, #16a085)"
      strokeWidth={1.2}
    />
    {/* Building body */}
    <path
      d="M12 18 L12 30 L36 30 L36 18"
      stroke="var(--color-korea-secondary, #2c3e50)"
      strokeWidth={1.5}
    />
    {/* Door */}
    <path
      d="M20 30 L20 22 C20 21 21 20.5 24 20.5 C27 20.5 28 21 28 22 L28 30"
      stroke="var(--color-korea-primary, #2980b9)"
      strokeWidth={1.5}
      fill="none"
    />
    {/* Door center line */}
    <path d="M24 20.5 L24 30" stroke="var(--color-korea-primary, #2980b9)" strokeWidth={1} />
    {/* "KR" hand-lettered below */}
    <path
      d="M14 34 L14 44 M14 39 L20 34 M14 39 L20 44"
      stroke="var(--color-korea-primary, #2980b9)"
      strokeWidth={2}
    />
    <path
      d="M25 34 L25 44 M25 34 C25 34 32 33.5 32 37 C32 40 25 39.5 25 39.5
         L32 44"
      stroke="var(--color-korea-primary, #2980b9)"
      strokeWidth={2}
      fill="none"
    />
  </Svg48>
);

// =============================================================================
// PATH ICONS  (24x24)
// =============================================================================

/**
 * MedicalIcon - Stethoscope with a small heart at the chest piece.
 */
export const MedicalIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Earpieces */}
    <path d="M8.5 2.5 L8.5 5.5" />
    <path d="M15.5 2.5 L15.5 5.5" />
    {/* Tubing - left side curving down */}
    <path
      d="M8.5 5.5 C8.5 9 7 12 7 15 C7 18.5 9.5 20.5 12 20.5"
      fill="none"
    />
    {/* Tubing - right side curving down */}
    <path
      d="M15.5 5.5 C15.5 9 17 12 17 15 C17 18.5 14.5 20.5 12 20.5"
      fill="none"
    />
    {/* Chest piece circle */}
    <circle cx="12" cy="20.5" r="2" />
    {/* Small heart at chest piece */}
    <path
      d="M11 19.8 C10.5 19.2 9.8 19.3 9.8 19.8 C9.8 20.3 11 21.2 11 21.2
         C11 21.2 12.2 20.3 12.2 19.8 C12.2 19.3 11.5 19.2 11 19.8Z"
      fill="currentColor"
      stroke="none"
    />
  </Svg24>
);

/**
 * TravelIcon - Suitcase with travel stickers.
 */
export const TravelIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Handle */}
    <path d="M9.2 6 L9.2 4.5 C9.2 3.5 10 3 12 3 C14 3 14.8 3.5 14.8 4.5 L14.8 6" />
    {/* Main suitcase body - slightly irregular rectangle */}
    <path
      d="M4.5 6.2 L19.5 6 C19.8 6 20 6.3 20 6.5 L20.2 19
         C20.2 19.5 19.8 19.8 19.5 19.8 L4.5 20
         C4.2 20 3.8 19.6 3.8 19.2 L4 6.5 C4 6.3 4.2 6.2 4.5 6.2Z"
    />
    {/* Middle strap */}
    <path d="M4 12.8 L20 12.5" strokeWidth={1.2} />
    {/* Sticker 1 - small circle */}
    <circle cx="8" cy="9.5" r="1.8" strokeWidth={1} />
    <path d="M7 9.5 L9 9.5" strokeWidth={0.8} />
    {/* Sticker 2 - small rectangle/stamp */}
    <rect x="13" y="14.5" width="4" height="3" rx="0.5" strokeWidth={1} />
    <path d="M14 16 L16 16" strokeWidth={0.7} />
    {/* Sticker 3 - small triangle */}
    <path d="M7 15.5 L9 18 L5 18 Z" strokeWidth={1} />
    {/* Wheels */}
    <circle cx="8" cy="21.5" r="1" strokeWidth={1} />
    <circle cx="16" cy="21.5" r="1" strokeWidth={1} />
  </Svg24>
);

/**
 * BarrioIcon - Row of small buildings / storefronts.
 */
export const BarrioIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Ground line */}
    <path d="M1.5 20.5 L22.5 20.5" strokeWidth={1.2} />
    {/* Building 1 - tallest, left */}
    <path d="M3 20.5 L3 8.5 L7.5 8.5 L7.5 20.5" />
    <path d="M4 11 L6.5 11" strokeWidth={0.8} />
    <path d="M4 13.5 L6.5 13.5" strokeWidth={0.8} />
    {/* Door on building 1 */}
    <path d="M4.5 20.5 L4.5 17 C4.5 16.5 5 16.2 5.3 16.2 C5.6 16.2 6 16.5 6 17 L6 20.5" />
    {/* Building 2 - medium, center */}
    <path d="M7.5 20.5 L7.5 11.5 L13 11.5 L13 20.5" />
    {/* Awning */}
    <path d="M7.5 14 L13 14 L13 15.5 L7.5 15.5" strokeWidth={1} />
    <path d="M8.5 14 L8.5 15.5" strokeWidth={0.6} />
    <path d="M10.2 14 L10.2 15.5" strokeWidth={0.6} />
    <path d="M12 14 L12 15.5" strokeWidth={0.6} />
    {/* Window */}
    <rect x="9" y="12" width="2.5" height="1.5" rx="0.3" strokeWidth={0.8} />
    {/* Door */}
    <path d="M9 20.5 L9 17.5 L11.5 17.5 L11.5 20.5" />
    {/* Building 3 - short, right */}
    <path d="M13 20.5 L13 13 L14.5 11 L16 11 L17.5 13 L17.5 20.5" />
    {/* Window */}
    <circle cx="15.2" cy="14.5" r="1" strokeWidth={0.8} />
    {/* Door */}
    <path d="M14.2 20.5 L14.2 18 L16.2 18 L16.2 20.5" />
    {/* Building 4 - far right */}
    <path d="M17.5 20.5 L17.5 12 L21 12 L21 20.5" />
    <rect x="18.3" y="13.5" width="2" height="1.5" rx="0.2" strokeWidth={0.8} />
    <rect x="18.3" y="16" width="2" height="1.5" rx="0.2" strokeWidth={0.8} />
    <path d="M18.8 20.5 L18.8 19 L20 19 L20 20.5" />
  </Svg24>
);

/**
 * SoCalIcon - Palm tree with wavy ocean line.
 */
export const SoCalIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Palm trunk - slightly curved */}
    <path d="M12.5 21 C12.2 18 11.8 14 12 10.5" strokeWidth={2} />
    {/* Fronds */}
    <path d="M12 10.5 C10 8 5 7.5 3.5 8.5" fill="none" />
    <path d="M12 10.5 C10.5 9 7 10 5.5 11.5" fill="none" />
    <path d="M12 10.5 C13 7.5 17 5.5 20 6" fill="none" />
    <path d="M12 10.5 C14 8.5 18 8 20.5 9" fill="none" />
    <path d="M12 10.5 C12.5 7 14 4 16 3" fill="none" />
    {/* Coconuts */}
    <circle cx="11.5" cy="11" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="12.8" cy="11.2" r="0.7" fill="currentColor" stroke="none" />
    {/* Wavy ocean */}
    <path
      d="M2 19 C4 17.5 6 19 8 17.5 C10 19 12 17.5 14 19 C16 17.5 18 19 20 17.5 C22 19 23 18 23 18"
      strokeWidth={1.5}
    />
    {/* Second wave line */}
    <path
      d="M1 21.5 C3 20.2 5 21.5 7 20.2 C9 21.5 11 20.2 13 21.5 C15 20.2 17 21.5 19 20.2 C21 21.5 23 20.5 23 20.5"
      strokeWidth={1}
      opacity={0.5}
    />
  </Svg24>
);

/**
 * ProfessionalIcon - Briefcase with a pen sticking out.
 */
export const ProfessionalIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Handle */}
    <path d="M9 7 L9 5.5 C9 4.2 10 3.5 12 3.5 C14 3.5 15 4.2 15 5.5 L15 7" />
    {/* Briefcase body */}
    <path
      d="M3.5 7.2 L20.5 7 C21 7 21.2 7.3 21.2 7.8 L21 19.5
         C21 20 20.6 20.3 20.2 20.3 L3.8 20.5
         C3.3 20.5 3 20.1 3 19.7 L3.2 7.8 C3.2 7.3 3.3 7.2 3.5 7.2Z"
    />
    {/* Middle flap/strap */}
    <path d="M3 12.5 L10 12.5 L10 14 L14 14 L14 12.5 L21 12.5" />
    {/* Pen sticking out at an angle from the top */}
    <path d="M16.5 7 L19.5 2" strokeWidth={1.5} />
    <path d="M19.5 2 L20.2 1" strokeWidth={1} />
    {/* Pen clip */}
    <path d="M18 3.5 L18.8 4.8" strokeWidth={0.8} />
  </Svg24>
);

/**
 * BookIcon - Open book with pencil.
 */
export const BookIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Book spine */}
    <path d="M12 5.5 L12 20" strokeWidth={1.2} />
    {/* Left page */}
    <path
      d="M12 5.5 C10 5 5 4.5 3 5.5 L3 19.5 C5 18.5 10 19 12 20"
      fill="none"
    />
    {/* Right page */}
    <path
      d="M12 5.5 C14 5 19 4.5 21 5.5 L21 19.5 C19 18.5 14 19 12 20"
      fill="none"
    />
    {/* Left page lines */}
    <path d="M5.5 9 L10 9.2" strokeWidth={0.7} />
    <path d="M5.5 11.5 L10 11.7" strokeWidth={0.7} />
    <path d="M5.5 14 L9 14.1" strokeWidth={0.7} />
    {/* Right page lines */}
    <path d="M14 9.2 L18.5 9" strokeWidth={0.7} />
    <path d="M14 11.7 L18.5 11.5" strokeWidth={0.7} />
    {/* Pencil across the right page */}
    <path d="M15 17.5 L20.5 13" strokeWidth={1.5} />
    <path d="M14.5 18 L15 17.5 L15.3 17.8" strokeWidth={1} />
    <path d="M20.5 13 L21.2 12.5" strokeWidth={0.8} />
  </Svg24>
);

// =============================================================================
// ACTIVITY ICONS  (24x24)
// =============================================================================

/**
 * DrillIcon - Lightning bolt inside a page outline.
 */
export const DrillIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Page outline - slightly wobbly */}
    <path
      d="M5.5 2.5 L15.5 2.5 L18.5 5.5 L18.5 21.5 L5.5 21.5 Z"
      fill="none"
    />
    {/* Dog-ear fold */}
    <path d="M15.5 2.5 L15.5 5.5 L18.5 5.5" fill="none" strokeWidth={1.2} />
    {/* Lightning bolt - hand-drawn */}
    <path
      d="M13.5 7.5 L10 13 L13 13 L10.5 18.5"
      strokeWidth={2}
      fill="none"
    />
  </Svg24>
);

/**
 * SpeakIcon - Microphone with sound wave arcs.
 */
export const SpeakIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Mic head */}
    <path
      d="M9 5.5 C9 3 10 2 12 2 C14 2 15 3 15 5.5 L15 10.5 C15 12.5 14 13.5 12 13.5 C10 13.5 9 12.5 9 10.5 Z"
      fill="none"
    />
    {/* Mic stand */}
    <path d="M12 13.5 L12 17.5" />
    <path d="M9 17.5 L15 17.5" />
    {/* Mic body arc */}
    <path d="M7 9 C7 14 9 16 12 16 C15 16 17 14 17 9" fill="none" strokeWidth={1.2} />
    {/* Sound wave arcs */}
    <path d="M18.5 7.5 C20 9 20 12 18.5 13.5" fill="none" strokeWidth={1.2} />
    <path d="M20.5 5.5 C23 8.5 23 13 20.5 16" fill="none" strokeWidth={1.2} />
  </Svg24>
);

/**
 * FamilyIcon - Two overlapping speech bubbles.
 */
export const FamilyIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* First speech bubble - slightly larger, behind */}
    <path
      d="M2.5 4.5 C2.5 3.5 3.5 2.5 5 2.5 L14 2.5 C15.5 2.5 16.5 3.5 16.5 4.5
         L16.5 10.5 C16.5 11.5 15.5 12.5 14 12.5 L8 12.5 L5 15.5 L5.5 12.5
         L5 12.5 C3.5 12.5 2.5 11.5 2.5 10.5 Z"
      fill="none"
    />
    {/* Second speech bubble - overlapping, in front */}
    <path
      d="M8.5 8 C8.5 7 9.5 6 11 6 L20 6 C21.5 6 22.5 7 22.5 8
         L22.5 14 C22.5 15 21.5 16 20 16 L19.5 16 L19 18.5 L16 16
         L11 16 C9.5 16 8.5 15 8.5 14 Z"
      fill="none"
    />
    {/* Dots in first bubble */}
    <circle cx="7" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
    {/* Dots in second bubble */}
    <circle cx="13" cy="11" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="11" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="18" cy="11" r="0.6" fill="currentColor" stroke="none" />
  </Svg24>
);

/**
 * NotebookIcon - Spiral notebook with a bookmark ribbon.
 */
export const NotebookIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Notebook body */}
    <path
      d="M6.5 2.5 L20 2.5 C20.3 2.5 20.5 2.8 20.5 3 L20.5 21
         C20.5 21.3 20.3 21.5 20 21.5 L6.5 21.5
         C6.2 21.5 6 21.3 6 21 L6 3 C6 2.8 6.2 2.5 6.5 2.5Z"
      fill="none"
    />
    {/* Spiral rings */}
    <path d="M4 5 C3 5 3 6.5 4 6.5 L6 6.5" strokeWidth={1.3} fill="none" />
    <path d="M4 8.5 C3 8.5 3 10 4 10 L6 10" strokeWidth={1.3} fill="none" />
    <path d="M4 12 C3 12 3 13.5 4 13.5 L6 13.5" strokeWidth={1.3} fill="none" />
    <path d="M4 15.5 C3 15.5 3 17 4 17 L6 17" strokeWidth={1.3} fill="none" />
    <path d="M4 19 C3 19 3 20.5 4 20.5 L6 20.5" strokeWidth={1.3} fill="none" />
    {/* Page lines */}
    <path d="M9 6.5 L17.5 6.5" strokeWidth={0.7} />
    <path d="M9 9.5 L17.5 9.5" strokeWidth={0.7} />
    <path d="M9 12.5 L15 12.5" strokeWidth={0.7} />
    <path d="M9 15.5 L17.5 15.5" strokeWidth={0.7} />
    <path d="M9 18.5 L13 18.5" strokeWidth={0.7} />
    {/* Bookmark ribbon */}
    <path
      d="M16 2.5 L16 8 L17.5 6.8 L19 8 L19 2.5"
      fill="none"
      stroke="var(--color-bookmark, currentColor)"
      strokeWidth={1.2}
    />
  </Svg24>
);

// =============================================================================
// FEEDBACK / STATUS ICONS  (24x24)
// =============================================================================

/**
 * CheckIcon - Hand-drawn teacher's green checkmark.
 * The path has className "draw-check" for CSS animation hooks.
 */
export const CheckIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    <path
      className="draw-check"
      d="M4.5 13 C5 13 8 17 9.5 18.5 C11 16 15 9 20 5"
      strokeWidth={2.5}
      stroke="var(--color-check, #27ae60)"
    />
  </Svg24>
);

/**
 * CrossIcon - Hand-drawn X mark (teacher's red X).
 */
export const CrossIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    <path
      d="M6 6 C8 8 16 16.5 18.5 18.5"
      strokeWidth={2.5}
      stroke="var(--color-cross, #e74c3c)"
    />
    <path
      d="M18.5 6 C16 8.5 8 16 6 18.5"
      strokeWidth={2.5}
      stroke="var(--color-cross, #e74c3c)"
    />
  </Svg24>
);

/**
 * StarStamp - Star with double outline (ink stamp look).
 */
export const StarStamp = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Outer star */}
    <path
      d="M12 2.5 L14.5 8.5 L21 9.5 L16.5 14 L17.5 20.5 L12 17.5 L6.5 20.5 L7.5 14 L3 9.5 L9.5 8.5 Z"
      strokeWidth={1.5}
    />
    {/* Inner star - slightly offset for stamp look */}
    <path
      d="M12 5 L13.8 9.5 L18.5 10.2 L15.2 13.5 L15.8 18.2 L12 16 L8.2 18.2 L8.8 13.5 L5.5 10.2 L10.2 9.5 Z"
      strokeWidth={1}
    />
  </Svg24>
);

/**
 * FlameIcon - Gentle candle flame on a small candlestick (not fire emoji).
 */
export const FlameIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Candle body */}
    <path d="M10 14.5 L10 20 L14 20 L14 14.5" strokeWidth={1.5} />
    {/* Candle base/holder */}
    <path d="M8.5 20 L15.5 20" strokeWidth={1.5} />
    <path d="M9 20 L8 22 L16 22 L15 20" strokeWidth={1.2} />
    {/* Wick */}
    <path d="M12 14.5 L12 12.5" strokeWidth={0.8} />
    {/* Flame - gentle teardrop shape */}
    <path
      d="M12 4 C12 4 9.5 8 9.5 10 C9.5 11.5 10.5 12.5 12 12.5
         C13.5 12.5 14.5 11.5 14.5 10 C14.5 8 12 4 12 4Z"
      fill="none"
      stroke="var(--color-flame, currentColor)"
      strokeWidth={1.5}
    />
    {/* Inner flame glow */}
    <path
      d="M12 7.5 C12 7.5 10.8 9.5 10.8 10.3 C10.8 11 11.3 11.5 12 11.5
         C12.7 11.5 13.2 11 13.2 10.3 C13.2 9.5 12 7.5 12 7.5Z"
      fill="none"
      strokeWidth={0.8}
    />
  </Svg24>
);

/**
 * InkSplat - Small ink splatter / drop shape.
 */
export const InkSplat = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Main splat blob */}
    <path
      d="M12 4 C12 4 14 6 15.5 8.5 C17 11 18 12 17.5 14
         C18.5 14 19.5 15 19 16.5 C18.5 18 17 17.5 16.5 17.5
         C16.5 19 15.5 20.5 13.5 20 C13 21 11.5 21.5 10 20.5
         C9 21 7.5 20.5 7 19 C5.5 19.5 4.5 18 5 16.5
         C4 16 4 14.5 5 13.5 C5 12 6 10.5 7.5 10
         C7 8.5 8 6 9.5 5 C10.5 4 11.5 4 12 4Z"
      strokeWidth={1.5}
    />
    {/* Small satellite drops */}
    <circle cx="20" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="4" cy="10" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="18" cy="20" r="0.7" fill="currentColor" stroke="none" />
  </Svg24>
);

/**
 * SpeakerIcon - Speaker with sound waves.
 */
export const SpeakerIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Speaker body */}
    <path
      d="M3.5 9 L7 9 L12 5 L12 19 L7 15 L3.5 15 Z"
      fill="none"
    />
    {/* Sound wave 1 (close) */}
    <path d="M15 9.5 C16.5 10.5 16.5 13.5 15 14.5" fill="none" strokeWidth={1.5} />
    {/* Sound wave 2 (mid) */}
    <path d="M17 7 C19.5 9.5 19.5 14.5 17 17" fill="none" strokeWidth={1.5} />
    {/* Sound wave 3 (far) */}
    <path d="M19 5 C22.5 8 22.5 16 19 19" fill="none" strokeWidth={1.2} />
  </Svg24>
);

/**
 * BackArrow - Left-pointing arrow, slightly curved.
 */
export const BackArrow = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    <path
      d="M10 5 L3.5 12 L10 19"
      fill="none"
      strokeWidth={2}
    />
    <path
      d="M3.5 12 C8 12.2 14 12.5 20.5 12"
      fill="none"
      strokeWidth={2}
    />
  </Svg24>
);

/**
 * ForwardArrow - Right-pointing arrow, slightly curved.
 */
export const ForwardArrow = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    <path
      d="M14 5 L20.5 12 L14 19"
      fill="none"
      strokeWidth={2}
    />
    <path
      d="M20.5 12 C16 12.2 10 12.5 3.5 12"
      fill="none"
      strokeWidth={2}
    />
  </Svg24>
);

/**
 * SendIcon - Folded paper airplane.
 */
export const SendIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Paper airplane body */}
    <path
      d="M3 12.5 L21 3.5 L14 21 L11.5 14 Z"
      fill="none"
    />
    {/* Fold crease */}
    <path d="M21 3.5 L11.5 14" strokeWidth={1.2} />
    {/* Wing fold line */}
    <path d="M11.5 14 L8.5 11" strokeWidth={0.8} />
  </Svg24>
);

/**
 * PlusIcon - Hand-drawn plus sign.
 */
export const PlusIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    <path d="M12 5.5 C12 5.5 12.2 11 12 18.5" strokeWidth={2} />
    <path d="M5.5 12 C5.5 12 11 12.2 18.5 12" strokeWidth={2} />
  </Svg24>
);

/**
 * GlobeIcon - Simple globe with latitude/longitude lines.
 */
export const GlobeIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Main circle */}
    <circle cx="12" cy="12" r="9.5" strokeWidth={1.5} />
    {/* Vertical ellipse (longitude) */}
    <ellipse cx="12" cy="12" rx="4" ry="9.5" strokeWidth={1} />
    {/* Horizontal line (equator) - slightly curved for sphere feel */}
    <path d="M2.5 12 C6 12.3 18 12.3 21.5 12" strokeWidth={1} />
    {/* Upper latitude line */}
    <path d="M4 7.5 C7 8 17 8 20 7.5" strokeWidth={0.8} />
    {/* Lower latitude line */}
    <path d="M4 16.5 C7 16 17 16 20 16.5" strokeWidth={0.8} />
  </Svg24>
);

/**
 * FingerHeartIcon - Korean finger heart (손가락 하트).
 * Pencil doodle: thumb and index finger make a heart shape,
 * other fingers curled into a fist below.
 */
export const FingerHeartIcon = ({ size = 80, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 80"
    width={size}
    height={size * 80 / 72}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Heart at the fingertips */}
    <path
      d="M36 14 C36 11 33 8.5 30.5 8.5 C27.5 8.5 26 11 26 13 C26 17 30 21 36 25.5 C42 21 46 17 46 13 C46 11 44.5 8.5 41.5 8.5 C39 8.5 36 11 36 14Z"
      strokeWidth={1.8}
    />

    {/* Thumb — from fist left, angles up-right to heart's left */}
    <path
      d="M15 52 C13 47 11 41 12.5 36 C14 31 18 27 23 24 C26.5 22 29 21.5 30.5 21"
      strokeWidth={2.5}
    />
    {/* Thumb right edge */}
    <path
      d="M24 52 C22 48 20 43 20.5 38.5 C21 34 24 30 28 27.5 C30.5 26 32.5 25.5 33.5 25"
      strokeWidth={1.8}
      opacity={0.5}
    />

    {/* Index finger — from fist right, angles up-left to heart's right */}
    <path
      d="M57 52 C59 47 61 41 59.5 36 C58 31 54 27 49 24 C45.5 22 43 21.5 41.5 21"
      strokeWidth={2.5}
    />
    {/* Index left edge */}
    <path
      d="M48 52 C50 48 52 43 51.5 38.5 C51 34 48 30 44 27.5 C41.5 26 39.5 25.5 38.5 25"
      strokeWidth={1.8}
      opacity={0.5}
    />

    {/* Fist — rounded bottom connecting the two fingers */}
    <path
      d="M15 52 C15 56 17 60 21 63 C25 66 31 67 36 67 C41 67 47 66 51 63 C55 60 57 56 57 52"
      strokeWidth={2.2}
    />

    {/* Curled finger lines inside fist */}
    <path d="M22 55 C24 58 27 60 30 59" strokeWidth={1.4} opacity={0.35} />
    <path d="M31 56 C33 59.5 37 60 39 59" strokeWidth={1.3} opacity={0.3} />
    <path d="M41 55 C43 58 46 58.5 48 57" strokeWidth={1.3} opacity={0.3} />

    {/* Wrist */}
    <path d="M23 65 C23 69 24 73 25 75" strokeWidth={1.8} />
    <path d="M49 65 C49 69 48 73 47 75" strokeWidth={1.8} />
    <path d="M25 75 C30 77 42 77 47 75" strokeWidth={1.5} />
  </svg>
);

/**
 * TrophyIcon - Trophy cup.
 */
export const TrophyIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Cup body */}
    <path
      d="M7 4 L7 10 C7 14 9 16 12 16 C15 16 17 14 17 10 L17 4"
      fill="none"
    />
    {/* Cup rim */}
    <path d="M6.5 4 L17.5 4" strokeWidth={1.5} />
    {/* Left handle */}
    <path d="M7 6.5 C4.5 6.5 3 8 3 10 C3 12 4.5 13 7 12.5" fill="none" strokeWidth={1.3} />
    {/* Right handle */}
    <path d="M17 6.5 C19.5 6.5 21 8 21 10 C21 12 19.5 13 17 12.5" fill="none" strokeWidth={1.3} />
    {/* Stem */}
    <path d="M12 16 L12 19" strokeWidth={1.5} />
    {/* Base */}
    <path d="M8.5 19 C8.5 19 9 21 12 21 C15 21 15.5 19 15.5 19" strokeWidth={1.5} />
  </Svg24>
);

/**
 * MicIcon - Simple microphone for mic button.
 */
export const MicIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Mic head */}
    <path
      d="M9.5 5 C9.5 3 10.5 2 12 2 C13.5 2 14.5 3 14.5 5 L14.5 11
         C14.5 13 13.5 14 12 14 C10.5 14 9.5 13 9.5 11 Z"
      fill="none"
    />
    {/* Holder arc */}
    <path d="M7 10 C7 15 9 17 12 17 C15 17 17 15 17 10" fill="none" strokeWidth={1.3} />
    {/* Stand */}
    <path d="M12 17 L12 21" />
    {/* Base */}
    <path d="M9 21 L15 21" />
  </Svg24>
);

/**
 * HeartIcon - Sketchy heart shape (not perfect).
 */
export const HeartIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    <path
      d="M12 6.5 C10 3 6 2.5 4.5 5 C3 7.5 3 10 5 13
         C7 16 10 18.5 12 21 C14 18.5 17 16 19 13
         C21 10 21 7.5 19.5 5 C18 2.5 14 3 12 6.5Z"
      fill="none"
      strokeWidth={1.8}
    />
  </Svg24>
);

/**
 * SettingsIcon - Gear / cog wheel.
 */
export const SettingsIcon = ({ size = 24, className }) => (
  <Svg24 size={size} className={className}>
    {/* Center circle */}
    <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
    {/* Gear teeth - 8 teeth positioned around the circle */}
    <path
      d="M10.5 2.5 L13.5 2.5 L14 5 C14.5 5 15.2 5.3 15.7 5.7
         L18 4.5 L20 6.5 L18.5 8.5 C18.8 9 19 9.8 19 10.2
         L21.5 10.5 L21.5 13.5 L19 14 C19 14.5 18.7 15.2 18.3 15.7
         L19.5 18 L17.5 20 L15.5 18.5 C15 18.8 14.2 19 13.8 19
         L13.5 21.5 L10.5 21.5 L10 19 C9.5 19 8.8 18.7 8.3 18.3
         L6 19.5 L4 17.5 L5.5 15.5 C5.2 15 5 14.2 5 13.8
         L2.5 13.5 L2.5 10.5 L5 10 C5 9.5 5.3 8.8 5.7 8.3
         L4.5 6 L6.5 4 L8.5 5.5 C9 5.2 9.8 5 10.2 5 Z"
      fill="none"
      strokeWidth={1.3}
    />
  </Svg24>
);

// =============================================================================
// BADGE
// =============================================================================

/**
 * WaxSeal - Circular seal with scalloped/wavy edges and centered level number.
 * Looks like an embossed wax seal.
 *
 * @param {number} level   - Level number displayed in the center.
 * @param {string} color   - Stroke/fill colour for the seal (default "currentColor").
 * @param {number} size    - Overall size in px (default 48).
 * @param {string} className
 */
export const WaxSeal = ({ level = 1, color = "currentColor", size = 48, className }) => {
  // Generate the scalloped edge path from 16 points around a circle.
  const cx = 24;
  const cy = 24;
  const outerR = 20;
  const innerR = 16.5;
  const points = 16;
  const segments = [];

  for (let i = 0; i < points; i++) {
    const angle1 = (Math.PI * 2 * i) / points - Math.PI / 2;
    const angle2 = (Math.PI * 2 * (i + 0.5)) / points - Math.PI / 2;
    const ox = cx + outerR * Math.cos(angle1);
    const oy = cy + outerR * Math.sin(angle1);
    const ix = cx + innerR * Math.cos(angle2);
    const iy = cy + innerR * Math.sin(angle2);
    if (i === 0) {
      segments.push(`M${ox.toFixed(1)},${oy.toFixed(1)}`);
    }
    segments.push(`Q${ix.toFixed(1)},${iy.toFixed(1)}`);
    const nextAngle = (Math.PI * 2 * (i + 1)) / points - Math.PI / 2;
    const nx = cx + outerR * Math.cos(nextAngle);
    const ny = cy + outerR * Math.sin(nextAngle);
    segments.push(`${nx.toFixed(1)},${ny.toFixed(1)}`);
  }

  const sealPath = segments.join(" ") + "Z";

  return (
    <Svg48 size={size} className={className} stroke={color}>
      {/* Outer scalloped edge */}
      <path d={sealPath} strokeWidth={2} fill="none" />
      {/* Inner circle for embossed ring */}
      <circle cx={cx} cy={cy} r={12} strokeWidth={1.5} fill="none" />
      {/* Innermost ring */}
      <circle cx={cx} cy={cy} r={10} strokeWidth={0.8} fill="none" />
      {/* Level number */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        stroke="none"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        {level}
      </text>
    </Svg48>
  );
};
