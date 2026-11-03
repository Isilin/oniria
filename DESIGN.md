---
name: Oniria
description: The group's character sheets for the Oniria tabletop RPG, on a provisional stock-MUI base.
colors:
  primary: "#90caf9"
  primary-clair: "#1976d2"
  secondary: "#ce93d8"
  secondary-clair: "#9c27b0"
  success: "#66bb6a"
  success-clair: "#2e7d32"
  info: "#29b6f6"
  info-clair: "#0288d1"
  warning: "#ffa726"
  warning-clair: "#ed6c02"
  error: "#f44336"
  error-clair: "#d32f2f"
  on-primary: "rgba(0, 0, 0, 0.87)"
  background: "#121212"
  surface-raised: "#1e1e1e"
  surface-dialog: "#393939"
  background-clair: "#ffffff"
  text-primary: "#ffffff"
  text-secondary: "rgba(255, 255, 255, 0.7)"
  text-disabled: "rgba(255, 255, 255, 0.5)"
  action-disabled: "rgba(255, 255, 255, 0.3)"
  divider: "rgba(255, 255, 255, 0.12)"
  table-rule: "#515151"
  input-outline: "rgba(255, 255, 255, 0.23)"
  chip-fill: "rgba(255, 255, 255, 0.16)"
  xp-left: "rgba(144, 202, 249, 0.22)"
  alert-success-bg: "#0c130d"
  alert-success-text: "#cce8cd"
  text-primary-clair: "rgba(0, 0, 0, 0.87)"
  text-secondary-clair: "rgba(0, 0, 0, 0.6)"
  divider-clair: "rgba(0, 0, 0, 0.12)"
  tooltip-bg: "rgba(97, 97, 97, 0.92)"
  on-dark-surface: "#ffffff"
  snackbar-info: "#2196f3"
typography:
  display:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "6rem"
    fontWeight: 300
    lineHeight: 1.167
    letterSpacing: "-0.01562em"
  display-sheet:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 300
    lineHeight: 1.167
    letterSpacing: "-0.01562em"
  headline:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.167
    letterSpacing: "0em"
  title:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 400
    lineHeight: 1.235
    letterSpacing: "0.00735em"
  subtitle:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.334
    letterSpacing: "0em"
  dialog-title:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.0075em"
  byline:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0.00938em"
  body:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.00938em"
  body-small:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "0.01071em"
  table-head:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: "0.01071em"
  label:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: "0.02857em"
  label-small:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: "0.02857em"
  caption:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.66
    letterSpacing: "0.03333em"
  tooltip:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "4px"
  chip: "16px"
spacing:
  "0.5": "4px"
  "1": "8px"
  "1.5": "12px"
  "2": "16px"
  "3": "24px"
  "4": "32px"
  "5": "40px"
components:
  card:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.sm}"
    padding: "16px 16px 24px"
  card-title:
    typography: "{typography.title}"
    textColor: "{colors.text-primary}"
  section-title:
    typography: "{typography.subtitle}"
    textColor: "{colors.text-primary}"
  sheet-field-label:
    typography: "{typography.body}"
    textColor: "{colors.text-primary}"
  sheet-field-value-editable:
    typography: "{typography.body}"
    textColor: "{colors.text-primary}"
  sheet-field-value-empty:
    typography: "{typography.body}"
    textColor: "{colors.text-secondary}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 8px"
  button-text-small:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-small}"
    rounded: "{rounded.sm}"
    padding: "4px 5px"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "5px 15px"
  button-contained:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 16px"
  button-destructive:
    backgroundColor: "transparent"
    textColor: "{colors.error}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 8px"
  button-caution:
    backgroundColor: "transparent"
    textColor: "{colors.warning}"
    typography: "{typography.label-small}"
    rounded: "{rounded.sm}"
    padding: "4px 5px"
  tab:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    padding: "12px 16px"
    height: "48px"
  tab-active:
    textColor: "{colors.primary}"
  tooltip:
    backgroundColor: "{colors.tooltip-bg}"
    textColor: "{colors.on-dark-surface}"
    typography: "{typography.tooltip}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  input-standard:
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    padding: "4px 0 5px"
  input-outlined:
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    height: "40px"
  table-cell:
    typography: "{typography.body-small}"
    textColor: "{colors.text-primary}"
    padding: "6px 16px"
  table-head-cell:
    typography: "{typography.table-head}"
    textColor: "{colors.text-primary}"
    padding: "6px 16px"
  chip-status:
    backgroundColor: "{colors.chip-fill}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.chip}"
    height: "24px"
  chip-degree:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.chip}"
    height: "24px"
  existence-gauge:
    backgroundColor: "{colors.error}"
    height: "4px"
  xp-bar:
    backgroundColor: "{colors.xp-left}"
    rounded: "{rounded.sm}"
    height: "16px"
  xp-bar-spent:
    backgroundColor: "{colors.primary}"
  alert-success:
    backgroundColor: "{colors.alert-success-bg}"
    textColor: "{colors.alert-success-text}"
    rounded: "{rounded.sm}"
    padding: "6px 16px"
  dialog:
    backgroundColor: "{colors.surface-dialog}"
    rounded: "{rounded.sm}"
    padding: "16px 24px"
  snackbar-info:
    backgroundColor: "{colors.snackbar-info}"
    textColor: "{colors.on-dark-surface}"
    typography: "{typography.body-small}"
    rounded: "{rounded.sm}"
    padding: "6px 16px"
---

# Design System: Oniria

## Overview

**Creative North Star: "La Fiche Immersive"**

The sheet should be immersive, customisable and alive. It should feel like being inside the character, not like filling in a form. Everything visible today is a **provisional base**: Material UI v9 with its default theme, dark by default. It's documented here so that new screens stay consistent until Oniria gets its own identity. When that identity arrives, it goes through the theme (`createTheme` in `src/app/providers.tsx`), not through one-off overrides scattered across components.

The confirmed feel is **feutré et immersif, avec une dose de vivant et réactif** (muted and immersive, with a touch of lively and reactive). Surfaces stay calm, dark and low-contrast at rest. The liveliness shows up when you interact:
- each segment of an XP bar brightens on hover and gives its value in a tooltip;
- a lock tells you whether a part of the sheet is frozen or still free;
- editable values reveal a dashed underline;
- every save is answered with a toast.

The game's structure organises the screen. Computed groups (Caractères, Facultés, Existences, Expérience) are cards with a large centred title. Inside them, the game's triads (Corps / Esprit / Âme, Chair / Pensée / Lien, Santé / Équilibre / Éclat, Éprouver / Apprendre / Vivre) sit in three columns. Lists the player maintains (traits, Corpus, weapons, objects) are compact tables with a left-aligned title and an "Ajouter…" button underneath. Game meanings are carried by MUI's six semantic palette roles, never by custom colours.

**Key Characteristics:**
- Stock MUI v9 theme with CSS variables; dark ("Sombre") by default, plus "Clair" and "Système" modes chosen by the player.
- Single centred column up to 1400px wide. Tab panels stack below 900px and sit side by side above it.
- Typographic hierarchy that mirrors the game: section card → triad group or list → stat line.
- Quiet editing: values look like plain text with a faint pencil, are saved on Enter or blur, and cancelled with Escape.
- Game states expressed through the palette roles (error, info, warning, success, secondary) and the lock.
- Depth in dark mode comes from MUI's white overlays, not from shadows.

## Colors

A neutral, untouched MUI palette: one light blue as the voice of interaction on a near-black background. The five semantic roles are repurposed to carry game meaning.

### Primary
- **Bleu Primaire** (`primary`; `primary-clair` in light mode): every interactive affordance, and the spent part of an XP bar. It covers text, outlined and contained buttons, the active tab and its indicator, the focused input, "Ajouter…" buttons, links, the back arrow, the "Base" skill chip and the "Dépense" history chip. The remaining XP is the same blue at 22% (`xp-left`).

### Secondary
- **Mauve Secondaire** (`secondary`; `secondary-clair`): the "Principe" skill degree and the "Offert" history entry. Nothing else.

### Semantic roles (game meanings)
- **Rouge Erreur** (`error`, `error-clair`):
  - the **Santé** gauge;
  - destructive actions ("Supprimer", "Supprimer la table", confirming a deletion);
  - a negative XP balance;
  - the "écart" chip (XP accounts that don't match);
  - error alerts.
- **Bleu Info** (`info`, `info-clair`): the **Équilibre** gauge, the "Remboursement" history entry, and informational alerts in the XP dialogs.
- **Orange Avertissement** (`warning`, `warning-clair`):
  - the **Éclat** gauge;
  - anything still **free or unvalidated**: the open lock, the "En création" / "Reset en cours" chip, the "à valider" / "en création" table chips;
  - "Accorder un reset";
  - "XP perdue";
  - a trait balance that isn't 0;
  - the "Enchaînement" degree;
  - the preview-only test-login banner.
- **Vert Succès** (`success`, `success-clair`): the "Maîtrise" and "Technique" degrees, the "Attribution" history entry, and a trait balance of exactly 0.

### Neutral
- **Fond Sombre** (`background`): page background and the base of every surface in dark mode.
- **Surface Relevée** (`surface-raised`): the effective colour of a card in dark mode, which is `Fond Sombre` plus the elevation-1 overlay.
- **Surface Dialogue** (`surface-dialog`): the effective colour of a dialog in dark mode (elevation 24).
- **Texte Principal / Secondaire / Désactivé** (`text-primary`, `text-secondary`, `text-disabled`):
  - Principal: labels and values.
  - Secondaire: captions (the "Exp. : 95" lines, the XP category descriptions, the legend), inactive tabs, the empty "-" placeholder.
  - Désactivé: empty-state lines.
- **Action Désactivée** (`action-disabled`): disabled buttons ("Ajouter (10 XP)" before a choice is made) and the closed lock.
- **Séparateur / Filet de table / Contour de champ / Fond de puce** (`divider`, `table-rule`, `input-outline`, `chip-fill`): structure lines and quiet fills.
- **Fond Infobulle** (`tooltip-bg`), **Info Notistack** (`snackbar-info`, from notistack's own palette rather than the theme).
- The `-clair` tokens are the light-mode counterparts. Light mode uses white backgrounds and black text at 87%, 60% and 12% alpha.

### Named Rules
**The Palette-Role Rule.** Game meanings use only the theme's semantic roles (`error`, `info`, `warning`, `success`, `secondary`, `primary`), written as `color="warning"` or `'error.main'`, never as a hex value. This is what keeps Santé, Équilibre and Éclat correct in Clair mode (`#d32f2f`, `#0288d1`, `#ed6c02`) without extra code.

**The Warning-Means-Unsettled Rule.** Apart from the Éclat gauge, orange always means "not settled yet": free to change, waiting for validation, or about to cost something irreversible. A validated, settled state is neutral grey (the closed lock, the "Validée" chip).

## Typography

**Display / Body Font:** Roboto (with Helvetica, Arial, sans-serif), through MUI `Typography`.
**Page font:** Inter, loaded by `next/font` on `<body>`. It only reaches text that is not wrapped in a MUI component.

**Character:** neutral Material sans with no personality of its own. Hierarchy comes from size, and italics are reserved for derived group values ("Le Corps *(18)*").

**Known gap:** Roboto is never shipped. The project doesn't load it anywhere, so MUI text renders in Roboto only on machines that have it installed, and in Helvetica or Arial elsewhere. Meanwhile, Inter is downloaded and barely used. Fix this in the theme before relying on any font's metrics.

### Hierarchy
- **Display** (300, 6rem): "ONIRIA" on the home and admin pages.
- **Display sheet** (300, 3.75rem from 900px, 2.25rem below): the character name and the table name.
- **Headline** (400, 3rem): admin page titles ("Tables de jeu").
- **Title** (400, 2.125rem, centred): titles of computed cards (Visage, Caractères, Facultés, Existences, Expérience, Schémas, Compétences), plus "Mes fiches" and "Autres fiches".
- **Subtitle** (400, 1.5rem): two jobs.
  - Triad group headings (Le Corps, La Chair, Le Soi, Éprouver, Générales). The derived value sits next to the heading in italics, followed by the lock.
  - Left-aligned titles of list cards (Traits innés, Le Corpus, La Spyrée, Armes de mêlée, Objets, Vue d'ensemble).
- **Dialog title** (500, 1.25rem): XP and creation dialogs.
- **Byline** (400, 1rem, centred): "Joueur·euse : … · Table : … · lecture seule" under the name.
- **Body** (400, 1rem): stat lines (`Label : valeur / max`) and skill-tree entries.
- **Body small** (400, 0.875rem): table cells and toasts. **Table head** (700, 0.875rem): column headers.
- **Label** (500, 0.875rem, uppercase): buttons and tabs. **Label small** (500, 0.8125rem): small buttons ("Attribuer de l'XP", "Ajouter un objet", "Changer l'image").
- **Caption** (400, 0.75rem, Texte Secondaire):
  - the "Exp. : 95" lines under each Caractère group;
  - the XP category descriptions;
  - the legend;
  - helper lines ("Séquelles, renommée, faveurs divines…");
  - the unsaved-notes indicator.
- **Tooltip** (500, 0.6875rem): rules text and formulas. Formulas use the `[Agi / Vig]` notation and the short stat names of the spreadsheet.

### Named Rules
**The Game Hierarchy Rule.** Typographic roles follow the game, not the page:
- A centred Title = a computed section of the sheet.
- A Subtitle = a triad group, or a list the player maintains.
- Body = one stat.

Don't use Title or Subtitle for anything else.

## Layout

The page is a centred grid (`page.module.css`):
- Padding `10px 40px 40px`, falling to `8px 12px 80px` at 600px and below.
- The main column is 100% wide with a 1400px maximum, flex column, items centred, with a 24px gap.
- The theme switch sits top right, 56px tall. The footer is a centred credit line.

**Sheet page:**
- The top row holds the back arrow (an icon button) on the left and "Supprimer" (error) on the right, both hidden in read-only view.
- Below it: the name, the byline, and centred tabs (Caractéristiques, Traits, Schémas & Compétences, Inventaire, Notes). The tab index is mirrored in the URL hash, and only the open tab is rendered.
- Each tab panel is an un-elevated, borderless Paper with an 8px gap: a column below 900px, a row from 900px up.
- On Caractéristiques, a 300px left column (full width on mobile) holds the avatar and Visage. The right column stacks Caractères, Facultés, Existences and Expérience.
- Inventaire opens with a centred summary strip (Dégâts (Force), Protection, Encombrement), followed by one card per list.

**Inside cards:**
- Triad columns use `justify-content: space-evenly` with `flex-wrap: wrap`, a 32px gap and full-height vertical dividers. On narrow screens the columns wrap one under another, and the dividers stay vertical, so the columns end up staggered.
- Secondary values (Dégâts, Initiative…) sit under a horizontal divider. XP categories sit three to a row from 600px up and stack below (Grid `size={{ xs: 12, sm: 4 }}`).

**Tables:** small density, filling the card width. Wide tables (ranged weapons, armour, the table overview) scroll horizontally inside their card instead of overflowing the page.

**Home:** fixed 250px sheet cards (150px avatar) in a wrapping grid. Own sheets come first, then a divider, then other players' sheets. The "+" card for adding a sheet ends the first row.

**Spacing** uses MUI's 8px unit. Observed steps: 4, 6, 8, 12, 16, 24, 32 and 40px.

## Elevation & Depth

Hybrid, and controlled entirely by MUI.

In **Sombre**, depth is tonal. Each elevation adds a white overlay gradient (`--mui-overlays-N`) on top of `Fond Sombre`:
- cards (elevation 1, 5% white) become `surface-raised`;
- dialogs (elevation 24, 16.5% white) become `surface-dialog`.

Shadows exist but are barely visible on near-black. In **Clair**, the same elevations render as Material shadows on white. Tab panels are flat (outlined variant, border removed). Alerts are flat (elevation 0) and tinted.

### Shadow Vocabulary
- **Elevation 1** (`box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)`): cards and sheet cards.
- **Elevation 24**: dialogs (MUI default).

### Named Rules
**The Overlay-Not-Shadow Rule.** In dark mode, convey depth through elevation (which drives the overlay), never through custom shadows or hand-picked greys. A hard-coded `#1e1e1e` card is correct in Sombre and wrong in Clair.

## Shapes

Gently softened corners everywhere (4px, `theme.shape.borderRadius`): cards, buttons, inputs, tooltips, dialogs, alerts, snackbars, XP bars. The only fully rounded forms are chips (16px), radios and spinners.

Existence gauges are square-ended 4px lines. XP bars are 16px tall, rounded, and clip their segments. Inline-edit inputs are "standard" (underline only); pickers and dialog fields are "outlined" (a 1px box, 40px tall).

Avatars are full-bleed images cropped from the top on sheet cards. Unknown avatars fall back to `public/default.png`.

## Components

Muted at rest and responsive under the cursor. Every component is a stock MUI component configured through props and `sx`. There is no wrapper library.

### Buttons
- **Shape:** 4px corners; labels in uppercase.
- **Text (default):** Bleu Primaire, no background. Used for dialog actions (Annuler) and "Historique (n)", which has a history icon.
- **Small text with an icon:** "+ Ajouter un trait inné", "+ Ajouter un aspect (20 XP)", "Attribuer de l'XP", "Changer l'image". When an addition costs XP, the cost goes in the label.
- **Outlined:** Google sign-in and sign-out, "Distribuer de l'XP", test-login accounts.
- **Contained (Bleu Primaire on near-black text):** the submit action of an XP dialog ("Attribuer"). It is disabled (grey) until the form is valid.
- **Error text:** "Supprimer", "Supprimer la table", and confirming a deletion.
- **Warning text:** "Accorder un reset".
- **Icon buttons:** the back arrow (primary, 40px); delete rows with an outlined trash can (30px, Texte Principal).
- **Hover / Focus:** MUI's default 8%-alpha tint and ripple.

### Cards / Containers
- **Computed card:** a Card with CardContent and a centred Title, holding triad columns.
- **List card:** a Card with CardContent and a left-aligned Subtitle, holding a table and an add button. Optionally a caption hint underneath.
- **Corner Style:** 4px.
- **Background:** `surface-raised` in Sombre, white plus elevation-1 shadow in Clair.
- **Border:** none.
- **Internal Padding:** 16px, with 24px at the bottom.
- **Sheet card** (home): a whole-card link with a header (name, plus the player in "Autres fiches") and an avatar cropped from the top. The add card holds a large "+".

### Sheet Field (signature component)
`SheetField` is one stat line: `Label :` value `/ max`, with an optional `/ +n` margin on Facultés.
- **Label:** Body style. With rules text or a formula, the label gets a dotted underline and a tooltip with an arrow.
- **Value (editable, for the owner or an ADMIN):** the value in Texte Principal with a 10px pencil at 60% opacity. An empty value shows "-" in Texte Secondaire.
  - On hover, a 1px dashed underline appears in Texte Secondaire.
  - Clicking or focusing swaps the value for a "standard" TextField.
  - Enter saves, Escape cancels; in multi-line fields, Ctrl+Enter saves.
- **Value (read-only):** plain text, no pencil.
- **Validated sheets:** on a validated sheet, changing a paid value goes through the purchase dialog.

### Scope Lock
A 1em lock after each group heading (Le Corps, Le Corpus, Générales…), with a tooltip explaining the rule.
- **Closed and grey** (`action-disabled`): validated. Each improvement is a purchase, and only the MJ can lower or remove it.
- **Open and orange** (`warning`): free to change, and paid at validation.

The Expérience card repeats this as a small chip: "Validée" (grey fill, closed lock) or "En création" / "Reset en cours" (warning, open lock).

### Existence Gauge
A 4px determinate LinearProgress under each Existence value, showing the current value against the maximum. Santé uses `error`, Équilibre `info`, Éclat `warning`. The track is the same colour at about half lightness.

### XP Bar
One per category (Éprouver, Apprendre, Vivre):
- **Heading row:** a Subtitle heading and "Total : **n**" in Body; the total turns error when the balance is negative.
- **Description:** a caption saying what the category pays for.
- **Bar:** 16px tall and rounded, made of segments:
  - Dépensée: `primary`;
  - À payer à la validation: `primary` hatched at 45°, alternating 100% and 40%;
  - Restante: `xp-left`;
  - Solde négatif: `error`.
- **Interaction:** each segment is focusable, brightens to 125% on hover or focus, and shows its value in a tooltip.
- **Legend:** a centred legend lists only the segment types that are present.

### Chips
- **Status** (small, filled, 24px): "Validée" uses the neutral `chip-fill`. Warning chips mark unsettled states, and outlined error chips mark "écart" in the table overview.
- **Skill degree** (small, outlined, with a 70%-alpha border): Base `primary`, Principe `secondary`, Maîtrise and Technique `success`, Enchaînement `warning`. In the skill tree, each child skill is indented under its parent, behind a ↳ arrow.
- **Shortcut** (filled, clickable): "Création : 700 Vivre" in the XP award dialog.
- **Property** (small, filled): equipment properties in the inventory.

### Inputs / Fields
- **Inline edit:** MUI "standard" variant. The underline is 70% white (42% black in Clair) and thickens to 2px Bleu Primaire on focus.
- **Pickers and dialog fields:** MUI "outlined" variant, 40px tall, with a 1px `input-outline` box and a floating label. Examples: "Potentiel à ajouter", "Compétence générale", "Ajouter un personnage", Libellé, Éprouver, Apprendre, Vivre.
- **In-cell selects:** "standard" selects inside table cells (Type, Bonus, Prérequis).
- **Checkboxes:** used for "Porté" in inventory tables (primary when checked).

### Tables
- **Collection tables** (`CollectionTable`): small MUI Tables.
  - Headers use the Table head style; some carry a dotted underline and a tooltip for an abbreviation ("Enc. (%)", "Recharg.").
  - Cells are inline-edit fields and the last column is a delete icon.
  - Rows are separated by `table-rule` lines.
  - Empty tables show one line ("Aucun sortilège.", "Aucune arme de tir.").
  - A small "+ Ajouter…" text button closes the card.
- **Table overview** (MJ): one row per character, with a link name and a caption showing the player. Rows highlight on hover. Wide columns scroll horizontally.

### Alerts
MUI "standard" alerts, flat, 4px corners, 6px 16px padding, tinted with the role colour:
- success or warning for the innate-trait balance;
- info, warning or error inside the XP dialogs, explaining the split, a shortfall or an error;
- warning for the test-login banner;
- error for a sheet or table that can't be found.

### Navigation
- **Tabs:** centred.
  - Labels use the Label style (uppercase) in Texte Secondaire.
  - The active tab is Bleu Primaire, with a 2px indicator.
- **Back:** a primary arrow icon button at top left.
- **Admin links:** text links "Whitelist" and "Tables de jeu" on the home page, shown to the MJ only.
- **Theme switch:** a row of radios ("Thème : Système / Clair / Sombre") at top right of every page.

### Dialogs and Feedback
- **Dialogs** (`surface-dialog`, Dialog title, 16px 24px padding) are used for:
  - creating something (sheet, table, whitelist entry);
  - **XP transactions**: awarding, purchasing (with an editable split), resetting and removing;
  - confirming an irreversible deletion.
- **Dialog layout:** the actions sit at the bottom right. Annuler is a text button; the confirming action is contained, or error when it destroys something.
- **History:** "Historique (n)" opens the sheet's XP ledger. Each kind of entry is a coloured chip (Attribution, Dépense, Remboursement, XP perdue, Offert).
- **Snackbars (notistack):**
  - bottom-left, at most 5, no duplicates, auto-hide after 2s, with a close button;
  - every save, creation and deletion gets one, in French, using the info variant.
- **Loading:** a CircularProgress where the content will appear.

### Notes Editor
MDXEditor with a toolbar:
- undo/redo, block type, bold/italic/underline, lists and checklists, rule, table, image, link, code;
- the unsaved-changes caption.

It follows the theme mode through `light-theme` / `dark-theme` classes. Its content uses its own prose styles (bold headings), not MUI Typography.

## Do's and Don'ts

### Do:
- **Do** take every colour, radius and space from the MUI theme (`theme.vars.palette.*`, `theme.spacing`, `shape.borderRadius` 4px). The base is provisional, so the theme is the single place where Oniria's identity will be set.
- **Do** reuse the established game mappings: Santé `error`, Équilibre `info`, Éclat `warning`; skill degrees Base `primary`, Principe `secondary`, Maîtrise and Technique `success`, Enchaînement `warning`; history entries Attribution `success`, Dépense `primary`, Remboursement `info`, XP perdue `warning`, Offert `secondary`.
- **Do** mark anything unsettled (free to change, waiting for validation, about to cost XP irreversibly) with `warning`, and settled states with neutral grey.
- **Do** check every new screen in Sombre, Clair and Système, and at mobile width, where tab panels stack and triads wrap.
- **Do** keep the `Label : valeur / max` stat line, attach rules text and formulas as a tooltip on a dotted-underlined label, and show the XP cost in the label of any button that spends it.
- **Do** build new lists with `CollectionTable` (small table, inline-edit cells, delete icon, "+ Ajouter…" underneath, a one-line empty state), and let wide tables scroll inside their card.
- **Do** keep surfaces calm at rest and put the liveliness in interaction: hover, focus, edit, save, and tooltips that reveal values.

### Don't:
- **Don't** treat stock MUI as Oniria's identity, and don't polish it piece by piece. It is a confirmed provisional base, and the identity will be defined as a whole, in the theme.
- **Don't** hard-code `white`, `black`, `rgba(255,255,255,…)` or hex values in components. They break Clair mode. `LoadingButton` still does this.
- **Don't** introduce a new colour for a game meaning. Map it to an existing palette role, or wait for the theme-level identity.
- **Don't** let a player spend or lose XP without a dialog that shows the split, or delete anything without a confirmation that names the consequence.
- **Don't** rely on Roboto's or Inter's metrics until the font stack is fixed in the theme.
