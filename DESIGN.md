---
name: Oniria
description: "« Le carnet d'Oniria » : character sheets for the Oniria tabletop RPG, kept as a printed sheet filled in by hand, lit by day or by candle."
colors:
  table-jour: "#e4dcc8"
  papier-jour: "#efe6cf"
  papier-releve-jour: "#f6efdc"
  encre-imprimee-jour: "#3b3328"
  encre-pale-jour: "#665c4b"
  encre-bleue-jour: "#23336b"
  sanguine-jour: "#9a4a2a"
  ligne-guide-jour: "rgba(62, 79, 140, 0.12)"
  marge-jour: "rgba(178, 70, 52, 0.32)"
  succes-jour: "#2f6640"
  avertissement-jour: "#924716"
  erreur-jour: "#a63a2a"
  info-jour: "#355d8a"
  table-bougie: "#0d0906"
  papier-bougie: "#cfbc96"
  papier-releve-bougie: "#d9c8a3"
  encre-imprimee-bougie: "#3a2a1a"
  encre-pale-bougie: "#4a3824"
  encre-bleue-bougie: "#22305a"
  sanguine-bougie: "#77321a"
  ligne-guide-bougie: "rgba(90, 52, 20, 0.13)"
  marge-bougie: "rgba(150, 60, 30, 0.34)"
  succes-bougie: "#22542f"
  avertissement-bougie: "#78380e"
  erreur-bougie: "#842a1c"
  info-bougie: "#254a73"
  lueur-bougie: "rgba(255, 168, 76, 0.3)"
  sante-jour: "#a8432f"
  equilibre-jour: "#3d6a99"
  eclat-jour: "#9a7414"
  mai-jour: "#6a55a0"
  sante-bougie: "#9a3a28"
  equilibre-bougie: "#2f5a85"
  eclat-bougie: "#86640c"
  mai-bougie: "#5a4690"
  lune-argent: "#5d6b85"
  lune-ambre: "#94640f"
  lune-rousse: "#a24a28"
  lune-jade: "#2e7a5c"
  lune-azur: "#2f6299"
  lune-amethyste: "#6747a6"
  lune-corail: "#ab3f47"
  lune-nacre: "#7a6a4a"
typography:
  display:
    fontFamily: "Special Elite, Courier Prime, monospace"
    fontSize: "3.5rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.3em"
  name:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1
  page-title:
    fontFamily: "Special Elite, Courier Prime, monospace"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.22em"
  section:
    fontFamily: "Special Elite, Courier Prime, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.22em"
  group:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.04em"
  label:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  body:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  row-label:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.02em"
  numeral:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "lnum, tnum"
  numeral-total:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "lnum, tnum"
  dialog-title:
    fontFamily: "Special Elite, Courier Prime, monospace"
    fontSize: "1.0625rem"
    fontWeight: 400
    letterSpacing: "0.12em"
  hand:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.05
  hand-value:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 0.9
  hand-existence:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "2.375rem"
    fontWeight: 700
    lineHeight: 0.95
  hand-existence-phone:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 0.95
  note:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: "30px"
  note-title:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: "30px"
  note-heading:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: "30px"
rounded:
  none: "0px"
  sm: "2px"
  full: "50%"
spacing:
  unit: "8px"
  unit-compact: "6px"
  guide-line: "30px"
  leaf-gutter-left: "68px"
  leaf-gutter-left-wide: "60px"
  leaf-gutter-phone: "16px"
  frame-outer: "10px"
  frame-inner: "16px"
components:
  button-primary:
    backgroundColor: "{colors.encre-bleue-jour}"
    textColor: "{colors.papier-releve-jour}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "6px 16px"
  button-text:
    textColor: "{colors.encre-bleue-jour}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "6px 8px"
  tab:
    textColor: "{colors.encre-pale-jour}"
    typography: "{typography.button}"
    height: "44px"
    padding: "0 14px"
  tab-active:
    textColor: "{colors.encre-bleue-jour}"
  printed-box:
    rounded: "{rounded.none}"
    padding: "16px 20px"
  card:
    backgroundColor: "{colors.papier-releve-jour}"
    rounded: "{rounded.sm}"
    padding: "12px"
  tooltip:
    backgroundColor: "{colors.papier-releve-jour}"
    textColor: "{colors.encre-imprimee-jour}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    width: "calc(46ch + 24px)"
  stepper-cell:
    textColor: "{colors.encre-pale-jour}"
    width: "34px"
    height: "32px"
  stepper-cell-sm:
    textColor: "{colors.encre-pale-jour}"
    width: "24px"
    height: "24px"
  stepper-cell-hover:
    textColor: "{colors.encre-bleue-jour}"
  planet:
    size: "64px"
  planet-phone:
    size: "40px"
  portrait-frame:
    rounded: "{rounded.none}"
    width: "96px"
    height: "108px"
  stat-row:
    textColor: "{colors.encre-pale-jour}"
    typography: "{typography.row-label}"
    padding: "4px 0"
  handwritten-value:
    textColor: "{colors.encre-bleue-jour}"
    typography: "{typography.hand-value}"
  typed-value:
    textColor: "{colors.encre-imprimee-jour}"
    typography: "{typography.numeral}"
  preview-up:
    textColor: "{colors.succes-jour}"
  preview-down:
    textColor: "{colors.avertissement-jour}"
  points-bar:
    backgroundColor: "{colors.papier-releve-jour}"
    rounded: "{rounded.sm}"
    padding: "12px"
  header-band:
    height: "52px"
---

# Design System: Oniria

## Overview

**Creative North Star: "La Fiche Immersive"**

The world is **Le carnet d'Oniria**. Every page is a character sheet printed on cream paper and filled in by hand, the way a sheet lives on the table across many evenings. A double printed frame runs around the page, and a title band carries a frieze of moon phases between two fleurons. The paper has its own grain, faint blue guide lines and a red margin. Over it sit pale atlas geometries (planets on their orbit, armillary spheres, constellations), soft watercolour washes and a few pen doodles. Oniria is a multiverse of moons (medieval, alien, steampunk worlds…), so the sheet belongs to no single genre: it speaks of moons, travel between worlds, and a story written game after game.

The system rests on one rule of writing. What the player writes is handwritten in blue ink (Caveat): the name, age, Aspect, Devenir, current Existences, characteristics, traits, items, notes. What the rules print or compute is typed (Courier Prime), with page and section titles stamped (Special Elite): labels, totals, maximums, thresholds, Facultés, combat values. Reading the sheet tells you at a glance what is yours and what the game derives.

There are two lights for the same paper. **Jour** is a sheet on a pale table. **Nuit** is the same sheet lit by a candle: warmer, muted paper, an amber glow from the top left, and brown shadow at the edges only, so the reading area keeps its contrast. Density is a per-account preference (Confort / Compact), and the layout keeps everything used in play visible without scrolling at 1440px and wider.

Motion has one signature: **writing**. A value the player writes, or that changes (a saved field, a −/+ on an Existence, a point added), traces itself left to right like a pen stroke (420ms, steady `cubic-bezier(0.45, 0.05, 0.35, 1)`). A validated preview dries: its colour fades back to ink over 600ms. Everything else is quiet continuity or feedback, played once, never on load:
- **Turning page:** a tab opens like a page of the notebook, sliding in from the side of the tab chosen (16px and a fade, 220ms); the first tab shown settles with a short fade and rise.
- **The blow:** a point lost on an Existence sends one ink ripple out of its planet, in the Existence's watercolour (560ms); at 0 a second, slower ripple follows. It only answers a loss, never the threshold, whose role the rules in this repository do not state.
- **The stamp:** "Validée" comes down like a rubber stamp, slightly large and tilted, then settles (300ms), when the sheet is validated and at each validated purchase.
- **Ink filling:** XP received fills the remaining part of its bar from left to right at the pen's pace (420ms).
- **Slips and cards:**
  - a toast arrives as a slip of paper pushed onto the sheet, tilted −1.5°, then straightens (280ms, leaves in 160ms);
  - a dialog is laid on the sheet, dropping 10px with a 0.6° tilt that straightens (260ms, leaves in 160ms).
- **Bars and light:**
  - the points bar slides up from the bottom (280ms) and leaves faster (160ms); the phone's Existences band slides down the same way;
  - the candle lights in 700ms, then holds still: a flame that flickers in a loop would recomposite the whole page on every frame for as long as the sheet stays open beside Discord;
  - Jour ↔ bougie crossfades the whole page (View Transitions, 450ms);
  - buttons press like a stamp (1px down), with no Material ripple.

Nothing moves on load except the plate's wash, which blooms in, and nothing loops on a sheet at rest: once a movement has played, the page stays still until something changes. Under `prefers-reduced-motion`, tracing, sliding, rising and tilting stop; fades and colour changes that carry state remain:
- pages, slips, dialogs, the stamp and the XP fill fade;
- the blow's ripple lights up and goes out in place, without growing.

The system rejects the clean "tool" look (identical boxed cards, a sterile interface type, stock Material colours) and anything that tires the eyes over a long evening.

**Key Characteristics:**
- A printed sheet on paper: double frame, title band with moon phases, grain, guide lines and margin.
- Handwritten blue ink for everything the player writes; typewriter for everything the rules print.
- Existences as small atlas planets: printed orbit, watercolour phase, one pen-filled dot per point.
- A personal moon tint per character, laid as a watercolour wash whose strength follows Devenir.
- Two lights (Jour, bougie) on the same light paper, and two densities, chosen by the player.
- One motion signature: values write themselves like a pen stroke, and previews dry into ink.

## Colors

Cream paper, brown printing ink, blue fountain-pen ink, four Existence watercolours, eight moon tints. Both themes are light paper; the candle theme is warmer and darker paper, not a dark mode.

### Primary
- **Encre bleue** (jour / bougie): the pen. It writes every value the player owns, and it is the only interaction colour: contained buttons (paper text on ink), text buttons, the active tab and its 2px indicator, the focus ring, stepper hover, XP spent. Writing and acting are the same gesture on a sheet.

### Secondary
- **Sanguine** (jour / bougie): a red-chalk accent for rare secondary actions ("Accorder un reset") and category chips. Never for interaction in general.

### Tertiary
- **Existences**: **Santé** (brick), **Équilibre** (slate blue), **Éclat** (ochre), **Maï** (dusk violet), each with a deeper candle value. They appear only as watercolour inside the planets.
- **Lunes**: eight per-character tints with one value each (the paper is light in both themes): argent (default), ambre, rousse, jade, azur, améthyste, corail, nacre.
- **États**: succès, avertissement, erreur, info, each darkened to reach at least 4.5:1 on its paper. They mark alerts, the negative XP balance, and pending points (succès up, avertissement down, erreur when XP is missing).

### Neutral
- **Table** (jour / bougie): the surface around the sheet.
- **Papier** (jour / bougie): the sheet itself, with grain, fibres and guide lines.
- **Papier relevé**: things laid on the sheet (cards, tooltips, menus, popovers, dialogs, toasts, the points bar).
- **Encre imprimée**: frames, rules, titles, typed text and typed values.
- **Encre pâle**: labels, captions, secondary typed text.
- **Ligne-guide** and **Marge**: the notebook guide lines (every 30px) and the red margin line.
- **Lueur de bougie**: the amber glow of the night overlay, never a UI colour.

### Named Rules
**The Plume Rule.** What the player writes is handwritten in blue ink; what the rules print or compute is typed in printing ink. A value never changes script when it changes state: an editable value is handwritten when read and when typed into.

**The Encre Bleue Rule.** Blue ink means "written by the player" or "you can act here". No other hue marks interaction, and nothing decorative is blue except pen doodles.

**The Couleur du Jeu Rule.** Existence colours appear only in the planets' watercolour, and moon tints only in a character's own identity (the plate wash, the portrait planet, the tint button). Neither becomes a UI accent.

**The Lune Personnelle Rule.** The plate's tint wash runs from 14% to 34% opacity as Devenir goes from 0 to 100. Above 100 (transcendance), the portrait gets a second frame in the tint, 4px outside the first. A missing Devenir sits at mid strength.

**The Aperçu Rule.** A value changed by pending points is a preview, not a fact: it turns semibold in succès (rising) or avertissement (falling), its saved value stays struck through before it, and "Avant : N" waits in a tooltip. Nothing returns to ink until the points are validated or cancelled.

## Typography

**Hand:** Caveat (with Segoe Print, cursive)
**Type:** Courier Prime (with Courier New, monospace)
**Stamp:** Special Elite (with Courier Prime, monospace)

**Character:** a typewriter for the game's printed form, a fountain pen for the player's hand, and a worn rubber stamp for titles. Caveat stays legible at numeral sizes and covers every French accent.

### Hierarchy
- **Display** (Special Elite, 3.5rem, +0.3em): ONIRIA on the home page.
- **Name** (Caveat 600, 3rem; 2rem on phone): the character's name, written on a printed field line. Team names use the same hand.
- **Page title** (Special Elite, 1.5rem, +0.22em, uppercase): Tables de jeu, Whitelist.
- **Section** (Special Elite, 0.9375rem, +0.22em, uppercase): section headings, preceded by an armillary sphere and followed by a printed rule. Also the title band.
- **Group** (Courier Prime 700, 0.9375rem, +0.04em, uppercase): LE CORPS, L'ESPRIT, VUE D'ENSEMBLE.
- **Dialog title** (Special Elite, 1.0625rem, +0.12em): dialog headings.
- **Label** (Courier Prime, 0.75rem, +0.14em, uppercase): field labels (NOM, ÂGE, LA SANTÉ), table heads, column captions. Never smaller: where a column is narrow (three planets per row on phone), the tracking tightens to +0.06em instead. Table heads never wrap; the table scrolls.
- **Body** (Courier Prime, 0.9375rem, 1.55) and **Body small** (0.875rem): interface text, player and table names, descriptions.
- **Row label** (Courier Prime, 0.75rem): stat-row labels. The typewriter is wide; 12px keeps "Concentration" beside its value.
- **Numeral** (Courier Prime 700, tabular, 0.9375rem): every computed value on a row (Facultés, combat); **Numeral total** (1.375rem) for group totals and the XP left. One size per role, so Facultés and Combat read as one column of figures.
- **Hand** (Caveat 600, 1.375rem) for written text, **Hand value** (Caveat 700, 1.625rem) for characteristics, **Hand existence** (Caveat 700, 2.375rem; 1.75rem below 900px) for current Existences. Each is a theme variant (`hand`, `handValue`, `handExistence`), never sizes set by hand.
- **Note** (Caveat 500, 1.375rem on 30px lines): the notes. **Note title** (Caveat 700, 2rem) and **Note heading** (1.625rem) stay on the 30px line; smaller headings keep the text size, underlined with the pen.

### Line breaks and measure
- Headings balance their lines (`text-wrap: balance`); body text avoids a lone last word (`pretty`).
- Rules text in tooltips runs at 46 characters per line; notes at 75 at most (34rem), while tables and images keep the full width.
- An amount stays glued to its category, and the middle dot never starts a line ("Éprouver 30 · Apprendre 10", with non-breaking spaces). The same goes for French double punctuation: a non-breaking space before ":", ";" and "!", written `\u00a0` in the code so it stays visible. In tables, a value comes first and its threshold sits under it as a caption ("6/6", "seuil 10").
- A word with no end (a pasted address, a name with no space) wraps instead of overflowing: `overflow-wrap: break-word` on written values and notes, so a table keeps its columns and scrolls; `anywhere` on names that head a card or a page (sheet, table).

### Named Rules
**The Machine à écrire Rule.** Printed text is typewriter, never a system sans. Titles are stamped, never set in a display serif.

**The Pas d'italique Rule.** Hierarchy comes from the three scripts, size and weight. Typed text has no italics; the hand carries its own slant. Courier Prime is served in roman only (400, 700), so no italic file is ever preloaded.

## Layout

The sheet is one column, up to 1400px wide, centred on the table. The page gutter is 24px (16px from 900px; none on phone, where the sheet fills the screen). Inside the sheet the content starts after the red margin: 68px on the left and 40px on the right, 60px and 32px from 900px, and 16px on phone. The spacing unit is 8px in Confort and 6px in Compact.

Order, top to bottom: the title band (back, page title, moon phases, ONIRIA, display settings, ⋯), the character plate, the Existences box, which sticks to the top on every tab, then the tabs and their content. The Caractéristiques tab is a ruled grid:
- **xs:** one column (Caractères, Facultés, Combat, Expérience).
- **md (900px):** Caractères and Facultés stacked on the left, Combat in a 210px column on the right, Expérience below.
- **From 1440px:** three columns (1.2fr / 1fr / 210px), so Caractères, Facultés and Combat sit on one screen with the Existences box.

Columns are separated by a 1px printed rule with 24px inner padding.

The other tabs follow the same structure: sections on the paper, one after the other, 32px apart (4 spacing units), each under its stamped heading. Inside a section, groups (Le Corpus, La Spyrée, Générales…) sit under a typed group title, 4 units apart, and the table, list or tree follows tightly.
- **Traits:** Traits innés, then Traits acquis (the line explaining acquired traits sits under its heading).
- **Schémas & Compétences:** Schémas (Corpus beside Spyrée and Âmée from lg), Compétences (one column, two from 900px, three from 1200px, so a skill tree never runs on 240px), then Sortilèges and Golem side by side from lg.
- **Inventaire:** a typed line with what the worn equipment gives to combat (Dégâts, Protection, Encombrement), then Armes de mêlée, Armes de tir, Armures, Objets.

Tables keep a handwritten name readable: the name column never narrows below 9rem, so a name takes two lines at most; when columns run out of room, the table scrolls sideways instead. In a skill tree, the degree chip leads and the bin stays at the end of the line; only the name and its précision wrap.

### Phone, touch and wide screens
The sheet is used beside Discord on a computer and on its own on a phone, so it adapts to the screen and to the finger, not only to the width.
- **Existences on a small screen** (below 600px wide, or below 500px tall in landscape): the full box scrolls with the sheet instead of sticking, since it would take a quarter to a third of the screen. When it leaves the screen, a 44px band slides down in its place: a small planet, the handwritten value and "/ max" for each Existence, and a chevron. A tap unfolds the full box with its −|+ over the page ("Replier" folds it); scrolling back to the top folds it too.
- **Touch** (`pointer: coarse`), whatever the width:
  - steppers, icon buttons and buttons have a 44px target (a stepper cell is 44×44);
  - an editable value keeps its size but gets an invisible 44px touch area, so "31" or "38" can be tapped without aiming;
  - below 520px, characteristic groups go one per row so that label, value and the larger −|+ sit side by side;
  - a rule tooltip opens on a tap, not a long press, and stays 5 seconds.
- **Tables on a phone** (below 600px): each row becomes a block on the paper, with no box around it. The check boxes (Porté) and the handwritten name lead, the bin is at the end of the line, and the other columns follow as typed labels over their values, two per line; descriptions take the full line. Nothing scrolls sideways.
- **Tabs on a phone** have no arrows: they scroll under the finger, and the tab cut at the edge shows there is more.
- **Wide screens** (from 1800px): the sheet widens from 1400px to 1680px, so the inventory tables (fifteen columns for a ranged weapon) fit without scrolling.

The lists outside the sheet (Mes fiches, Autres fiches, Tables de jeu) are rows of 250px cards aligned to the left margin of the content, 32px apart, ending with a dashed card that creates a new one ("Nouvelle fiche", "Nouvelle table de jeu").

Key widths:
- **Characteristic groups:** three side by side from 640px, two below.
- **Faculty columns:** same rule.
- **Plate:** portrait, name and facts on one line from 760px; below that, Âge, Aspect and Devenir go under the name.
- **Existences:** all four planets on one row from 520px. Below 520px the three Existences share a row, and Maï drops under a rule; there, "seuil N" takes its own line under the planet, since it cannot fit beside it. Labels sit above the planets below 900px and beside them from 900px, so "L'Équilibre" is never cut.
- **Planet steppers:** move inline after the value from 1200px; the label then runs over the value and the stepper.

## Elevation & Depth

The sheet is a paper object. It casts one soft shadow onto the table (`0 14px 34px -14px rgba(0,0,0,0.4)`); on phone it fills the screen and casts none. Inside the sheet, depth comes from printed frames and from paper laid on paper: cards, tooltips, menus, popovers, the points bar and toasts use the lighter raised paper with a 1px printing-ink border. Only modal dialogs and toasts cast a shadow of their own.

### Shadow Vocabulary
- **Feuille** (`box-shadow: 0 14px 34px -14px rgba(0, 0, 0, 0.4)`): the sheet on the table.
- **Dialog** (`box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.45)`): modal dialogs, which also carry a double printed frame (1.5px border, 1px outline 6px inside).
- **Billet** (`box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.45)`): toasts.

### Named Rules
**The Papier Rule.** Nothing inside the sheet floats on a shadow. To lift something, lay raised paper on the sheet and give it a printed border.

**The Bougie Rule.** At night the candle is an overlay above the page and below modals (z-index 1250, no pointer events): an amber glow in soft-light at the top left, and a brown shadow that starts at 55% of the radius and stays under 12% opacity until 80%. Every ink keeps at least 4.5:1 where text sits. Under `prefers-contrast: more`, the candle is removed.

## Shapes

Printed boxes are square: the plate, the Existences box, the portrait frame, the notes box and the page frame have no radius. Things laid on the sheet (cards, buttons, the stepper frame, chips, tooltips, menus, dialogs) have a near-square 2px corner. The only round forms belong to the sky: planets and their orbits, the tint swatches (36px), the moon-phase frieze, the armillary sphere, the constellations.

Rules come in three weights:
- **Frame:** 2px printing ink, plus a 1px inner line 6px inside (the page), or 1.5px on the plate, Existences box and portrait.
- **Group rule:** 1.5px printing ink under characteristic groups, faculty columns and table heads.
- **Hairline:** 1px printing ink at 24% for rows, and the faint guide lines of the paper.

## Components

### Buttons
- **Shape:** near-square (2px).
- **Primary (contained):** blue ink with raised-paper text, typewriter bold, sentence case, no elevation.
- **Text:** blue ink; sanguine for rare secondary actions.
- **Focus:** a 2px blue-ink outline offset by 2px, applied globally.
- **Busy** (`BusyButton`): while its action waits for the server, a button keeps its width and its own ink; only the label gives way to a small fixed-arc spinner (18px) in the same place. It is disabled, so neither a second click nor Enter in its form sends again, and it keeps its accessible name (`aria-busy`). Busy is not unavailable: it never takes the greyed disabled look.

### Chips
- **Style:** outlined by default, 2px radius, typewriter bold. Status colour comes only from the état inks.

### Cards / Containers
- **Sheet sections are not cards,** on any tab. Each sits on the paper under a stamped heading with an armillary sphere and a running printed rule (`SectionCard`). The sections of the Caractéristiques tab also have a collapse chevron saved on the account.
- **Printed boxes** (plate, Existences): square, 1.5px printing-ink border. The Existences box is opaque paper with grain, so it can stick above the scrolling sheet.
- **Cards** (sheet list, add-sheet, teams): raised paper, 1px printing-ink border, 2px radius. A sheet card shows a square portrait frame, the name handwritten, and the player or Aspect typed; a sheet waiting for its creation XP or its validation adds the overview's warning chip ("en création", "à valider"). The add card is dashed.

### Inputs / Fields
- **Handwritten fields.** An editable value reads as handwriting on a printed field line. On hover or focus, a dashed underline and a small pencil appear. On touch there is no pencil, only a dotted underline. Enter or a click opens a standard text field in the same hand, at the same place. Escape cancels; blur commits.
- **Inputs everywhere** (dialogs, whitelist, selects) are handwritten in blue ink, with a printing-ink underline (55% at rest, full on hover). Outlined inputs use a 45% printing-ink border.
- **Limits.** A field stops at what the server keeps: 200 characters for a short field (name, Aspect, label), 100 000 for a text (notes, descriptions), 2048 for the portrait's address, 254 for an email. Short fields lose their surrounding spaces; a sheet name made of spaces becomes "Sans nom", and a table cannot be renamed to nothing.

### Navigation
- **Title band:** sits inside the frame at the top of the sheet, with back on the left and display settings and ⋯ on the right. In the centre, between two fleurons: the stamped page title (from md), the moon-phase frieze (from lg) and ONIRIA. On home, only the frieze shows, since ONIRIA is already the display title.
- **Tabs:** 44px, typewriter bold, a 2px blue-ink indicator over a 1px printed rule.
- **Display settings:** a popover of raised paper with toggle groups Nuit / Jour / Système and Confort / Compact.

### Planet (signature)
An Existence as a small atlas planet:
- **Orbit:** a dashed printed ellipse, tilted −16°.
- **Disc:** a printed circle.
- **Phase:** the lit part is painted in watercolour, waxing as a crescent from the right, then gibbous, then full, over a faint wash of the same colour.
- **Points:** one printed ring per point on a 270° arc open at the bottom, filled with a pen dot up to the current value. Above 24 points, the arc becomes a continuous pen stroke.
- **Text:**
  - the label is typed (placed above the planet below 900px);
  - the current value is handwritten;
  - "/ max" and "seuil N" are typed.
- **Size:** 64px from md, 40px on phone. Maï is drawn smaller in the same box.
- **Motion:**
  - the watercolour phase glides to its new value in 260ms;
  - a gained point lands like an ink drop, growing from its centre in 280ms;
  - the handwritten value rewrites itself.

  Under `prefers-reduced-motion`, dots only fade and the phase jumps.

### Character Plate (signature)
The head of the sheet, as printed fields:
- **Portrait:** a square printed frame (96×108px; 64×72px on phone) labelled PORTRAIT. It holds the image, or a tint planet with the initial written in blue. An image that fails to load (dead link) gives way to the tint planet, never a broken-image icon. The initial is the name's first grapheme, so an emoji or a composed letter stays whole.
- **Name:** written large on a field line, with the tint button beside it.
- **Joueur·euse and Table:** typed under their labels.
- **Âge, Aspect and Devenir:** handwritten on field lines.
- **Tint wash:** spills from the portrait (see the Lune Personnelle Rule).
- **Doodle (from lg):** a pen-sketched moon and a dotted travel path fill the blank under the facts.
- **Motion:** the wash blooms in over 700ms on arrival and changes colour softly (500ms) when the tint changes. Crossing Devenir 100 detaches the second frame (outline offset 0 → 4px, 600ms).

### Existences Box (signature)
A sticky, opaque printed box (on a small screen, it scrolls and a one-line band takes over; see Layout). Typed captions "Existences" and "Maï" run into printed rules, and the four planets sit in columns separated by 1px printed rules.

### Stat Row
One printed line: a typed 12px label on the left (tooltip with the rule) and the value on the right. The value is handwritten if the player sets it, typed if the rules compute it. A hairline sits under each row.

### Stepper
A joined −|+ in a printed frame (1px rule, 2px corners). It has two sizes:
- **md**, on planets: 34×32 cells;
- **sm**, on characteristic rows: 24×24 cells, the 2.5.8 minimum.

On a touch screen, both sizes become 44×44 cells.

Cells are pale ink at rest. On hover or focus they turn blue ink over a 10% ink wash in 120ms, and the focus ring is drawn inside the frame. Characteristic steppers always show both cells, so values stay in a column. "−" is disabled while nothing can be removed. A click steps 1 point, Shift+click steps 5, and holding repeats from 400ms down to 40ms. Pressed cells and buttons sink by 1px for 80ms; there is no ripple.

### Preview Value
The Aperçu Rule as a component. An unchanged value renders normally. A changed one turns semibold in succès or avertissement, becomes focusable, and shows "Avant : N" in a tooltip. On characteristic rows, the saved value is struck through before the new one, in faded ink. The strike is drawn left to right as the pending points arrive. The preview colour comes in fast (120ms) and dries slowly back to ink on validation or cancel (600ms).

### Points Bar
Sticky at the bottom while points are pending: a raised-paper strip with a 1px succès border (erreur when XP is missing).
- **Left:** the changes in bold type, with the cost below them.
- **Right:** "Annuler" (text) and "Valider" (contained blue ink).
- **Motion:** slides up from the bottom (280ms, `cubic-bezier(0.16, 1, 0.3, 1)`) and leaves faster (160ms), keeping its last content while it goes. Under reduced motion it fades.

### XP Bar
A 16px segmented bar:
- spent: solid blue ink;
- due at validation: blue-ink stripes;
- pending points: succès stripes;
- remaining: 14% blue ink with a 1.5px inset blue outline;
- negative: erreur.

### Creation Steps
A sheet in creation shows its three steps in the Expérience section, inside an info note: receive the creation XP from the MJ, distribute the points, validate the sheet.
- **Markers:** a 24px printed ring per step with its typed number: 1.5px printing ink for the current step, faint for the steps to come. A step done gets a blue pen tick in its ring, traced like a written value (`Written`) when it is ticked.
- **Text:** typed; the current step is bold in printing ink, the steps to come in pale ink. Under the current step sit what it needs: the MJ's "Attribuer l'XP de création" or "En attente du MJ.", the missing XP in avertissement ink, then the cost and the "Valider la fiche" contained button.
- **No alarm before the XP arrives:** the note stays info; only the missing amount is coloured.
- **Reminder:** while the sheet is in creation, an info line under the Existences box gives the step ("étape 1 sur 3 : …") and a text button "Voir les étapes" that opens Caractéristiques and scrolls to them, stopping under the sticky box (or the phone band). The button sits at the right of the line and drops under the sentence on phone.

### Errors and failed reads
Something that failed says what is missing, why, and the one action that helps. Never a blank page, a spinner that turns forever, or an empty list that is really a failed read.
- **A page that cannot show** (unknown address, deleted sheet or table, server error) sits on the sheet like any page: a pale constellation, the stamped page title ("Page introuvable", "La page n'a pas pu s'afficher"), one typed sentence in pale ink, then "Réessayer" (contained) and "Retour à l'accueil" (text), or only the return when retrying cannot help. A server error adds "Référence : …" as a caption, to pass on to the MJ. When the layout itself fails, the same notice sits under ONIRIA on a bare sheet ("Le carnet n'a pas pu s'ouvrir").
- **A failed read inside a page** (sheet list, a sheet, tables, whitelist, skills catalogue) is an error alert: what could not be read as its title, the reason below, then one action: "Réessayer", "Retour à l'accueil" for a missing sheet, or "Se reconnecter" for an expired session. As in the creation reminder, the action follows the reason on one line and drops under it, at the right, when the line runs out (phone); its label never wraps.
- **A failed write** comes back as an error slip that stays until it is closed (other slips leave after 2 seconds), and the screen returns to the saved value. Messages say what to do: "Connexion perdue : la modification n'est pas enregistrée. Vérifie ta connexion, puis réessaie." An expired session adds "Se reconnecter" to the slip.
- **Actions in flight** keep their button busy until the server answers (see Buttons): creating a sheet, a table or an address, awarding XP, granting a reset, validating, deleting a sheet or table, signing in with Google, and "Réessayer" on an error page while the server prepares it again.
- **One sentence per failure.** The server not answering always reads "Le serveur n'a pas répondu. Réessaie dans un instant ; si ça recommence, préviens le MJ." (slips and pages alike). A lost connection says what to do without repeating the title: "Connexion perdue : vérifie ta connexion, puis réessaie."
- **Semantics.** An error that just happened (an error page, a failed read) is announced as an alert; "Page introuvable" is a page like any other, carried by its title.

### Ornaments
All ornaments are decorative and `aria-hidden`:
- **Printed** (ink): the armillary sphere at section heads, fleurons and the moon-phase frieze in the title band, a pale constellation under the combat column (from md) and above an error notice.
- **Pen** (blue): the sketched moon and dotted path in the plate (from lg).

### Notes
The notes editor always uses its light theme. It has a printed toolbar with a printing-ink rule, typed like the rest of the print (its menus too), with its labels in French. An empty page shows an invitation in the same hand but in pale ink, so it never passes for a note already written. The text is handwritten in blue at 1.375rem on 30px lines, like a page of a notebook:
- every block, headings included, stays on the 30px line, with one blank line between blocks and one above a heading;
- lines run to 75 characters at most; tables and images keep the full width;
- a quote is the same hand with a 1px pen stroke in the margin;
- inline code is typed (Courier Prime) at 0.75em, inside the line.

## Do's and Don'ts

### Do:
- **Do** write every value the player sets in Caveat, in blue ink, on a printed field line or row; type every computed value in Courier Prime.
- **Do** stamp page and section titles in Special Elite, uppercase, with an armillary sphere and a running printed rule for sections.
- **Do** frame printed areas (plate, Existences, portrait) as square boxes in printing ink; lay cards, menus and dialogs on the sheet as raised paper with a 1px border.
- **Do** read colours through the theme's CSS variables (`var(--mui-palette-…)`, `theme.vars`, `color-mix()` for alpha); both themes are light paper, and the candle has its own inks.
- **Do** keep every text ink at 4.5:1 or more on its paper, including near the candle's shadowed edges.
- **Do** keep everything used in play visible without scrolling from 1440px; below that, keep Combat beside Caractères and Facultés.
- **Do** keep doodles and constellations in blank areas, pale and `aria-hidden`, and never under a value.
- **Do** show pending points as a preview across the whole sheet: semibold succès or avertissement, the saved value struck before, "Avant : N" in a tooltip.
- **Do** keep loaded data on screen while it is re-read; show a spinner only when nothing has loaded yet, and when that first read fails, say so with "Réessayer" (`LoadError`).
- **Do** keep a button blocked while its action is in flight, so a double click never sends twice.
- **Do** honour both densities and both lights for every new surface.
- **Do** animate a written value with the shared `.oniria-write` stroke (the `Written` atom), keep feedback under 300ms, and give every animation a reduced-motion path that keeps fades and colour changes.

### Don't:
- **Don't** use a system sans or a display serif: printed text is a typewriter, titles are a stamp, and the player's words are a hand.
- **Don't** handwrite something the rules compute, or type something the player wrote.
- **Don't** use blue ink for decoration, or any other hue for interaction.
- **Don't** use Existence colours or moon tints outside the planets and the character's identity.
- **Don't** add shadows inside the sheet; lift things with raised paper and a printed border.
- **Don't** reintroduce a dark ground for the night: the candle warms and dims the same paper.
- **Don't** add another −/+ style; steppers share one printed frame in two sizes.
- **Don't** bind the sheet to one genre (parchment, chrome, neon): Oniria's moons are many worlds.
- **Don't** add load choreography, scroll reveals, staggers or Material ripples; the sheet moves only when something is written, changes state or needs continuity.
