---
name: Oniria
description: "Éphémérides des Lunes": character sheets for the Oniria tabletop RPG, read like a page of lunar almanac tables.
colors:
  encre-de-nuit: "#11131c"
  nuit-voilee: "#161925"
  nuit-relevee: "#1d2130"
  os: "#e8e2d3"
  argent: "#a9b1c2"
  filet-nuit: "rgba(232, 226, 211, 0.12)"
  or-de-lampe: "#d9a441"
  meche: "#1a1406"
  lilas: "#b49ad9"
  braise: "#e06a5a"
  cuivre: "#e8894a"
  bleu-de-veille: "#8fb3d9"
  sauge: "#7fb38a"
  papier-os: "#f4efe3"
  papier: "#faf7ef"
  velin: "#fffdf7"
  encre: "#1d1f2b"
  ardoise: "#555b6b"
  filet-jour: "rgba(29, 31, 43, 0.14)"
  or-bruni: "#8a5a12"
  violet-encre: "#6a4fa3"
  vermillon: "#b23a2a"
  rouille: "#b0561c"
  bleu-ardoise: "#3d6a99"
  mousse: "#3f7a4f"
  sante-nuit: "#d97a6c"
  equilibre-nuit: "#8fb3d9"
  eclat-nuit: "#e9cf7a"
  mai-nuit: "#c9b8e8"
  sante-jour: "#a8432f"
  equilibre-jour: "#3d6a99"
  eclat-jour: "#8a6a10"
  mai-jour: "#6a55a0"
  lune-argent-nuit: "#b9c3d6"
  lune-argent-jour: "#5d6b85"
  lune-ambre-nuit: "#e0b25a"
  lune-ambre-jour: "#94640f"
  lune-rousse-nuit: "#d9825f"
  lune-rousse-jour: "#a24a28"
  lune-jade-nuit: "#78c0a3"
  lune-jade-jour: "#2e7a5c"
  lune-azur-nuit: "#82aee0"
  lune-azur-jour: "#2f6299"
  lune-amethyste-nuit: "#ad94e0"
  lune-amethyste-jour: "#6747a6"
  lune-corail-nuit: "#e88e92"
  lune-corail-jour: "#ab3f47"
  lune-nacre-nuit: "#e6dcc8"
  lune-nacre-jour: "#7a6a4a"
typography:
  display:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "4rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "2.75rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.005em"
  headline-sm:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.15
  title:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
  section:
    fontFamily: "Alegreya Sans SC, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
  label:
    fontFamily: "Alegreya Sans SC, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  label-table:
    fontFamily: "Alegreya Sans SC, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.06em"
  body:
    fontFamily: "Alegreya Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Alegreya Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  caption:
    fontFamily: "Alegreya Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  button:
    fontFamily: "Alegreya Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    letterSpacing: "0.01em"
  numeral:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "lnum, tnum"
  numeral-group:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "lnum, tnum"
  numeral-stat:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "lnum, tnum"
  numeral-combat:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "lnum, tnum"
  dialog-title:
    fontFamily: "Alegreya Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
rounded:
  sm: "2px"
  full: "50%"
spacing:
  unit: "8px"
  unit-compact: "6px"
  card-pad: "20px"
  card-pad-compact: "12px"
  stack: "24px"
  page-gutter: "32px"
  page-gutter-mobile: "12px"
components:
  button-primary:
    backgroundColor: "{colors.or-de-lampe}"
    textColor: "{colors.meche}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "6px 16px"
  button-text:
    textColor: "{colors.or-de-lampe}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "6px 8px"
  tab:
    textColor: "{colors.argent}"
    typography: "{typography.button}"
    height: "44px"
    padding: "0 14px"
  tab-active:
    textColor: "{colors.or-de-lampe}"
  card:
    backgroundColor: "{colors.nuit-voilee}"
    rounded: "{rounded.sm}"
    padding: "{spacing.card-pad}"
  card-compact:
    padding: "{spacing.card-pad-compact}"
  tooltip:
    backgroundColor: "{colors.nuit-relevee}"
    textColor: "{colors.os}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    width: "380px"
  stepper-half:
    textColor: "{colors.argent}"
    width: "34px"
    height: "32px"
  stepper-half-hover:
    textColor: "{colors.or-de-lampe}"
  character-plate:
    backgroundColor: "{colors.nuit-voilee}"
    rounded: "{rounded.sm}"
    padding: "14px 20px"
  ephemeris-band:
    backgroundColor: "{colors.nuit-voilee}"
    padding: "8px 16px"
  moon-gauge:
    size: "60px"
  moon-gauge-phone:
    size: "34px"
  portrait:
    rounded: "{rounded.full}"
    size: "88px"
  portrait-phone:
    rounded: "{rounded.full}"
    size: "56px"
  stat-row:
    textColor: "{colors.argent}"
    typography: "{typography.body-sm}"
    padding: "4px 0"
  header-bar:
    height: "52px"
---

# Design System: Oniria

## Overview

**Creative North Star: "La Fiche Immersive"**

The world is **Éphémérides des Lunes**: every sheet reads like a page of a lunar almanac. Values stand in columns drawn with a ruler, headed by spaced small capitals, numbers set in tabular serif figures, columns separated by one-pixel rules. The four Existences (Santé, Équilibre, Éclat, Maï) are drawn as phases of the moon, each ringed by an arc of strokes, one stroke per point. Each character carries its own moon tint, and that tint grows stronger as the character's Devenir rises. The feel is muted and immersive, with a dose of the living and responsive: values slide to their new phase, hover reveals the rule behind a number, and nothing else moves.

The system is tuned for long evening sessions next to Discord. Night ("Nuit") is ink-dark navy with bone text and lamp gold for interaction. Day ("Jour") is bone paper with navy ink. Both are calm, low-chroma grounds, so the only saturated color on screen belongs to the game itself (Existences, the character's moon) or to the thing you can press. Density is a per-account preference (Confort / Compact), and the layout keeps everything used in play visible without scrolling, down to a half-width window beside Discord.

The system rejects the generic tool look of identical boxed cards with centered titles, stock Material blue, and anything that tires the eyes or betrays the game's own vocabulary.

**Key Characteristics:**
- Almanac tables: small-caps headings, running hairline rules, values right-aligned in tabular serif figures.
- Flat at rest: depth comes from three tonal steps of ground, never from shadow.
- One interaction color (lamp gold); game colors stay with game meaning.
- A personal moon tint per character, with intensity driven by Devenir.
- Two themes (Nuit / Jour) and two densities (Confort / Compact), all chosen by the player.

## Colors

A near-monochrome ink-and-bone ground carries a single warm lamp-gold accent, four Existence hues, and eight personal moon tints.

### Primary
- **Or de lampe** (night) / **Or bruni** (day): the only interaction color. Used for contained buttons, the active tab label and its 2px indicator, the focus outline, stepper hover, the back arrow, text selection (32% alpha), and the spent part of XP bars. Text on it is **Mèche** at night and **Vélin** by day.

### Secondary
- **Lilas** (night) / **Violet d'encre** (day): a quiet secondary for category chips (principles, gifted XP) and a loading button. It never competes with gold for interaction.

### Tertiary
- **Existences**: **Santé** (warm coral at night, brick by day), **Équilibre** (watch blue, slate blue), **Éclat** (pale gold, dark ochre), **Maï** (pale mauve, dusk violet). They live only in the moon gauges, where they fill the phase disc, the stroke arc, and a 10% wash with a 45% outline.
- **Lunes (moon tints)**: eight per-character tints, each with a night and a day value: Lune d'argent (default), d'ambre, rousse, de jade, d'azur, d'améthyste, de corail, de nacre. Set by the player or the GM.
- **Status**: Braise / Vermillon (error), Cuivre / Rouille (warning), Bleu de veille / Bleu ardoise (info), Sauge / Mousse (success). Alerts, chips, and the negative XP balance only.

### Neutral
- **Encre de nuit** / **Papier os**: the page ground.
- **Nuit voilée** / **Papier**: paper surfaces (the plate, the ephemeris band, cards).
- **Nuit relevée** / **Vélin**: raised surfaces (tooltips, menus, popovers, dialogs, the portrait's camera button).
- **Os** / **Encre**: primary text and numerals.
- **Argent** / **Ardoise**: secondary text, labels, stat-row captions, small-caps column heads.
- **Filet de nuit** / **Filet du jour**: every one-pixel rule, divider, card border, and empty arc track (bone at 12% / ink at 14%).

### Named Rules
**The Lampe Rule.** Gold means "you can act here". Nothing decorative is gold, and no other hue marks interaction.

**The Couleur du Jeu Rule.** Existence colors appear only in moon gauges, and moon tints only in a character's own identity (plate wash, top rule, portrait ring, sheet-card top rule, tint button). Neither becomes a UI accent.

**The Lune Personnelle Rule.** Tint intensity follows Devenir on a 0–100 scale: the plate wash runs from 6% to 18% tint, and the top rule and portrait ring from 35% to 100%. Above 100 (transcendance), a second ring detaches from the portrait with a 3px gap of paper color. A missing Devenir sits at mid intensity.

## Typography

**Display Font:** Spectral (with Iowan Old Style, Georgia, serif)
**Body Font:** Alegreya Sans (with Segoe UI, system-ui, sans-serif)
**Label Font:** Alegreya Sans SC (with Segoe UI, system-ui, sans-serif)

**Character:** Spectral gives names and numbers a printed, almanac-table gravity. Alegreya Sans comes from the same humanist calligraphic family, so the interface stays warm without becoming decorative. Its small-caps cut supplies true small capitals for every heading and label.

### Hierarchy
- **Display** (Spectral 400, 4rem, 1.05, +0.04em): the ONIRIA wordmark on the home page and top-level page titles.
- **Headline** (Spectral 500, 2.75rem, 1.1): the character's name on the plate, set at 1.625rem on phone and 2.5rem from md.
- **Headline small** (Spectral 500, 2rem, 1.15): secondary page titles (tables, whitelist).
- **Title** (Spectral 500, 1.25rem, 1.3): characteristic-group names (Le Corps, L'Esprit, L'Âme), XP pool names, and sheet-card names.
- **Section** (Alegreya Sans SC 700, 0.9375rem, +0.08em): sheet section headings, always followed by a running rule.
- **Label** (Alegreya Sans SC 500, 0.8125rem, +0.08em, no uppercase transform): column captions, gauge labels, plate facts (Âge, Aspect, Devenir), popover field labels. In the header it becomes the ONIRIA wordmark at +0.24em.
- **Body** (Alegreya Sans 400, 1rem, 1.5) and **Body small** (0.9375rem, 1.45): interface text, stat-row labels.
- **Caption** (0.8125rem, 1.4): thresholds ("seuil 6"), margins (+6), XP descriptions.
- **Numeral** (Spectral 500, lining tabular figures, 1.2): every game value. Size follows importance: 1.75rem italic for group totals, 1.375rem for characteristics and the XP left, 1.0625rem for combat, 1rem for faculties, and 1.25rem to 1.625rem in gauges.

### Named Rules
**The Chiffre Tabulaire Rule.** Every number on a sheet is Spectral with `lining-nums tabular-nums` (the body defaults to tabular figures too), right-aligned in its column so values line up like a table.

**The Petites Capitales Rule.** Headings and labels use the real small-caps face (Alegreya Sans SC) with letter spacing. Never use `text-transform: uppercase`. Buttons and tabs stay in sentence case.

## Layout

The sheet is a single column up to 1400px wide, centered, with a 32px page gutter (12px below 600px) and a 24px vertical stack (16px on phone). The spacing unit is 8px in Confort and 6px in Compact. Compact also tightens card padding from 20px to 12px and shrinks buttons and icon buttons to small.

The order is fixed: a thin 52px header bar (back, ONIRIA, display settings, ⋯ page actions injected through slots), then the character plate, then the ephemeris band, which is sticky to the top on every tab. Tabs follow, stretched full width so their rule runs under the whole page. The Caractéristiques tab is a ruled table grid:
- **xs:** one column (Caractères, Facultés, Combat, Expérience).
- **md (900px):** Caractères and Facultés on the left, Combat in a fixed 260px column on the right.
- **lg (1200px):** three columns (1.1fr / 1fr / 236px) with Expérience full width below.

Columns are separated by a 1px rule with 24px inner padding, not by gaps between boxes.

**520px is the key breakpoint** (a half screen beside Discord). From there the plate fits on one line (portrait, name, facts), the band shows all four moons on one row (three Existences at 3fr each, Maï at 2.4fr) with shared captions, and characteristic and faculty groups stay in three fixed columns. Below 520px groups go to two columns, the three Existences share a row, and Maï drops under a rule. From 1200px, gauge steppers move inline after the value.

## Elevation & Depth

Flat at rest. Depth comes from three tonal steps (ground, then paper, then raised) and one-pixel rules. Cards, the plate, and the band carry a hairline border, never a shadow (`elevation: 0`, no background-image overlay). Raised surfaces (tooltip, menu, popover) are lighter tones with a hairline border. Only modal dialogs cast a shadow.

### Shadow Vocabulary
- **Dialog** (`box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.5)`): modal dialogs only, on the raised surface.

### Named Rules
**The Sans Ombre Rule.** Nothing casts a shadow at rest. To lift something, step its surface tone and give it a rule. The transcendance second ring and the XP "remaining" outline use `box-shadow` as a stroke, not as elevation.

## Shapes

Corners are nearly square (2px) everywhere: cards, buttons, chips, alerts, tooltips, the plate, the stepper, and XP bars. Progress lines are square (3px high, 0 radius). The only round forms are the moon: portraits, moon discs, tint swatches (36px), and the arc of strokes (270° open at the bottom, 3px stroke, 6px maximum gap between strokes; above 24 points it becomes a continuous arc).

Rules come in three weights:
- **Hairline:** 1px rule color. Rows, columns, borders.
- **Group rule:** 1px in secondary text color, under characteristic-group headings.
- **Tint rule:** 2px in the moon tint, across the top of the plate and sheet cards.

Section headings and band captions extend into a running rule (`::after`, flex 1, 1px) to the column edge.

## Components

### Buttons
Quiet and typographic.
- **Shape:** near-square (2px).
- **Primary (contained):** lamp gold with Mèche/Vélin text, no elevation, sentence case, Alegreya Sans 500.
- **Text / icon buttons:** gold or inherited color. Icon buttons sit at medium size in Confort and small in Compact.
- **Focus:** a 2px gold outline offset by 2px, applied globally through `:focus-visible`.

### Chips
- **Style:** 2px radius, MUI filled. Status meaning comes only from status colors (Validée default, En création warning) or the secondary lilac for categories.

### Cards / Containers
- **Sheet sections are not cards.** They sit on the ground: a small-caps section heading with a running rule, an optional adornment (lock, status), and a collapse chevron that rotates -90° in 160ms. Collapse state is saved on the account.
- **Cards** (sheet list, add-sheet): paper background, 1px rule border, 2px radius, 20px/12px padding. The sheet card is 250px wide with a 2px tint top rule and a 56px portrait ringed in the tint. The add card is dashed and transparent, with a gold label.
- **Tab panels** are transparent and borderless.

### Inputs / Fields
- **Editable values read as text.** At rest a value looks like plain text. On hover or focus a 1px dashed underline and a small pencil (11px, 70% opacity) appear in 120ms. On touch there is no pencil, only a dotted underline at 40% secondary. Enter or click opens a standard (underline) text field; Escape cancels, blur commits.
- **Labels with rules** are focusable and show the formula in a tooltip, with `cursor: help`.

### Navigation
- **Header bar:** 52px, bottom hairline, no background. ONIRIA in small caps at +0.24em in secondary text, brightening to primary text (not gold) on hover. Page controls are portaled into start and end slots, so there is only ever one bar.
- **Tabs:** 44px, sentence case, Alegreya Sans 500 at 0.9375rem, 14px inline padding, 2px gold indicator over a full-width bottom rule. Scrollable on phone.
- **Display settings:** a popover on the raised surface with toggle groups Nuit / Jour / Système and Confort / Compact, under small-caps labels.

### Moon Gauge (signature)
An Existence as a lunar phase:
- **Disc:** 17/64 of the box. The lit part grows as a crescent from the right, then gibbous, then full.
- **Arc:** a 270° arc of strokes, one stroke per point, colored up to the current value. The empty track uses the rule color.
- **Size:** 60px from md, 34px on phone. Maï is drawn smaller inside the same box so values stay on one baseline.
- **Text:** small-caps label, numeral value, "/ max" in secondary, "seuil N" caption.
- **Stepper:** a joined −|+ (two 34×32 halves split by a 1px rule, 2px-radius frame). Secondary at rest; gold with a 10% gold wash on hover or focus in 120ms.
- **Motion:** the phase and strokes glide in 260ms `cubic-bezier(0.22, 1, 0.36, 1)` (stroke color in 200ms). Disabled under `prefers-reduced-motion`.

### Character Plate (signature)
The almanac header of a sheet: portrait (88px / 56px) ringed in the moon tint, the name in headline Spectral with a tint-colored palette button, and the player and table in secondary text. Âge, Aspect, and Devenir are three right-aligned almanac columns, each a small-caps label above its value. The paper surface is washed with the tint and topped by a 2px tint rule (see the Lune Personnelle Rule). The tint picker is a 4×2 grid of 36px swatches; the selected swatch gets a 2px primary-text ring. Without an image, the portrait is a tinted moon carrying the initial in Spectral.

### Ephemeris Band (signature)
A sticky paper strip ruled top and bottom. A small-caps caption with a running rule spans "Existences", and a second spans "Maï". The four gauges sit in columns separated by 1px rules.

### Stat Row
One almanac line: a body-small label in secondary on the left (tooltip with the rule, brightening to primary on hover) and a right-aligned numeral on the right, with an optional caption margin. A 1px rule sits under each row except the last; rows have 4px vertical padding.

### XP Bar
A 16px segmented bar: spent (solid gold), pending (45° gold stripes), remaining (14% gold with a 1.5px inset gold outline), negative (error). Each segment shows its value on hover or focus. A legend sits beneath it.

## Do's and Don'ts

### Do:
- **Do** set every game value as a Spectral tabular numeral, right-aligned in its column.
- **Do** separate columns and rows with 1px rule-color lines; use the stronger group rule only under characteristic-group headings.
- **Do** head sections with Alegreya Sans SC small caps followed by a running rule to the column edge.
- **Do** keep gold for interaction only: buttons, active tab, focus outline, stepper hover.
- **Do** step surface tone (ground, paper, raised) plus a hairline border to show depth.
- **Do** derive a character's identity color from its moon tint, scaled by Devenir, through the `--tint` variable with its night and day values.
- **Do** keep everything used in play visible without scrolling at 520px (half screen beside Discord) and wider.
- **Do** honor both densities (8px / 6px unit) and both themes for every new surface.
- **Do** disable gauge and phase transitions under `prefers-reduced-motion`.

### Don't:
- **Don't** wrap sheet sections in identical boxed cards with centered titles.
- **Don't** cast shadows on resting surfaces; the dialog is the only shadow.
- **Don't** use `text-transform: uppercase`; small caps come from Alegreya Sans SC.
- **Don't** use Existence colors or moon tints as general UI accents, or gold as decoration.
- **Don't** round corners beyond 2px on rectangles; round forms are reserved for moons and portraits.
- **Don't** reintroduce stock Material blue or pure black/white grounds; they tire the eyes over a long session.
- **Don't** let anything move on a value change except the gauge that changed.
