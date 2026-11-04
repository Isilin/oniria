# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One private group playing Oniria, a French tabletop RPG.

- **Players (joueur·euses).** Sessions run on Discord. Each player keeps the app open next to the call to check and update their own character sheet (fiche) as play goes on: Santé, Équilibre, Éclat, Maï, inventory and notes. They also spend the experience the MJ awards them. Players can read everyone else's sheets but can't edit them; a sheet that belongs to someone else says "lecture seule".
- **The MJ (game master)**, the app's `ADMIN` role. More than one account can hold it. The MJ can read and edit every sheet and has the final say on experience:
  - awards XP to a sheet or a whole table;
  - gifts purchases;
  - lowers or removes validated elements, refunding the XP or declaring it lost;
  - grants resets.

  The MJ also manages the whitelist of allowed Google accounts and the Tables de jeu.

Each player picks their own screen setup, and the product doesn't target any device in particular.

## Product Purpose

Oniria is the group's web companion for character sheets. It replaces paper sheets and the group's reference spreadsheet, "Lunes d'Oniria - Fiches de personnages":

- **Built-in formulas.** The game's formulas and costs are built in, so derived values and XP costs calculate themselves.
- **Rules at hand.** The rules text sits next to the stat it describes.
- **Live, shared sheets.** The whole table sees every sheet live.
- **Tracked experience.** XP is attributed, spent and recorded in an auditable history.
- **Kept between sessions.** Notes, inventory and progress are saved from one session to the next.

Success means a session never stops so someone can do maths, look up a rule, ask another player for their numbers, or argue about how much XP is left.

## Positioning

The app isn't a generic sheet builder or a public product. It implements Oniria as the group's spreadsheet does, with the same formulas, the same XP costs, the same catalogues of skills and potentials, and Noème's rules text. It also adds what the spreadsheet couldn't: per-player permissions, a creation-then-validation workflow, and a ledger of every XP movement.

## Operating Context

- **Where play happens.** On Discord, on the group's server, "Les Lunes d'Oniria". The app runs in a browser beside the call, not inside Discord.
- **Editing during play.** Players change live values as play goes on. A field saves when the player presses Enter or leaves it; Escape cancels. A toast confirms each save.
- **Sheet lifecycle.**
  1. A new sheet is **en création**: everything can be changed freely. The MJ awards the creation XP (shortcut: "Création : 700 Vivre").
  2. The player or MJ then **validates** the sheet, which pays its cost and locks it.
  3. After validation, every improvement is a **purchase**. A dialog proposes a split across the allowed XP categories, and the player can change it.
- **Between sessions.** The MJ distributes session XP to a sheet or to a whole table.
- **Sign-in.** Google-only, limited to a whitelist the MJ manages. Vercel preview deployments also offer test accounts (MJ de test, Joueuse de test, Joueur de test) and fictional characters, which are never available in production.

## Capabilities and Constraints

**Sheet (5 tabs)**

- **Caractéristiques:**
  - a character plate: portrait (or the name's initial on a tinted moon), name, player and table, Âge, Aspect, Devenir;
  - a band pinned to the top of every tab: the Existences (La Santé, L'Équilibre, L'Éclat, each with a maximum and a Seuil) and the Maï, each changed with −/+;
  - Caractères (Le Corps, L'Esprit, L'Âme, four stats each; the XP invested per group shows on hover);
  - Facultés (La Chair, La Pensée, Le Lien, with margins and Corpus bonuses);
  - Combat (Dégâts, Initiative, Impact, Impulsion, Conduction, Protection, Encombrement);
  - Expérience (Éprouver, Apprendre, Vivre).
  - From 1200px wide, Caractères, Facultés and Combat sit side by side, so everything used in play fits on one screen.
- **Traits:** innate traits, each with a balance (the total must come to 0), and acquired traits (after-effects, renown, divine favours, notable objects gained during play).
- **Schémas & Compétences:**
  - the Corpus (typed aspects with an optional bonus on a stat or on Santé);
  - La Spyrée (potentials ranked I to V);
  - L'Âmée;
  - Compétences Générales, Spyrales and Martiales, as a tree (Base → Principe → Maîtrise or Technique, plus Enchaînement), with prerequisites;
  - Sortilèges;
  - Golems.
- **Inventaire:** melee weapons, ranged weapons, armour (with properties, prerequisites and quality, and a "porté" toggle that feeds Protection and Encombrement), and objects. The MJ can add new equipment properties from this tab.
- **Notes:** a markdown editor, loaded only when the tab opens, that saves when the player leaves it.

**Experience**

- **Categories.** Éprouver pays for Corps and Âme, martial and general skills, and the Corpus. Apprendre pays for Esprit and Âme, spyral and general skills, and the Spyrée. Vivre pays for everything.
- **Costs.** The costs of stats, skills, Corpus aspects and Spyrée ranks follow the spreadsheet.
- **Lifecycle.** A sheet goes through creation, validation, then purchases. The MJ can gift a purchase, refund an element or declare its XP lost, and grant a full or partial reset (Corps, Esprit, Âme, each skill type, Corpus, Spyrée).
- **History.** Every movement is recorded per sheet: Attribution, Dépense, Remboursement, XP perdue, Offert.
- **Consistency check.** The sheet flags it when the recorded XP and the value of its validated parts disagree ("écart").
- **Older sheets.** Sheets created before the XP system are kept as they were and treated as validated ("XP reprise", "Dépenses antérieures").

**Tables de jeu (MJ)**

- Add characters to a table, remove them, and rename the table.
- An overview table shows each character's Santé, Équilibre, Éclat, Maï, Initiative, Protection, Encombrement, Dégâts and remaining XP. It also shows status chips: "à valider", "en création" and "écart".
- The MJ can distribute XP to several characters at once.

**Personalisation**

- Each character has a moon tint chosen by its owner or the MJ, from eight tints made for Oniria (field `tint`). The tint gets stronger as the Devenir rises: the base scale runs from 0 to 100, and a Devenir above 100 marks the character's transcendance.
- The sheet tells apart what the player writes (handwritten, blue ink) and what the rules compute (typed). Both themes are the same paper: Jour, and Nuit lit by a candle.
- Each account keeps its own display settings: theme (Nuit, Jour, Système), density (confort or compacte) and collapsed sections of the sheet (field `preferences`, route `/api/me/preferences`). They follow the player from one device to another.

**Permissions**

- The owner and any `ADMIN` can edit a sheet; everyone else can only read it. The server filters which fields can be changed.
- The whole API requires a session. The whitelist and the tables are reserved for the MJ.

**Constraints**

- Stack: Node 26, Next.js 16 App Router, React 19, MUI 9, Prisma 7 with PostgreSQL (Neon, eu-central-1), Auth.js v5 (Google), SWR, Vitest.
- Deployed on Vercel in the `fra1` region, next to the database.
- The schema changes through Prisma migrations, and a Vercel build never modifies the database unless explicitly asked.
- Versioning follows SemVer with a French Keep-a-Changelog `CHANGELOG.md`. Version 1.0.0 is not yet released to `main`.
- The interface, the docs and the commit messages are in French. Code identifiers are in English, with the French game term in comments.

## Brand Commitments

- **Oniria** is the name of the game's universe. The home page title is "ONIRIA".
- **Les Lunes d'Oniria** is the group's Discord server. The same name is also used:
  - for the reference spreadsheet ("Lunes d'Oniria - Fiches de personnages");
  - in the README title ("Lunes d'Oniria — fiches de personnages");
  - in the browser tab title.
- **Open decision:** whether the app has a name of its own.
- **Noème** wrote the game and its rules text. The footer credits them ("Oniria - par Noème"). The project owner builds the app but did not write the game.
- **Voice:** French and inclusive writing ("Joueur·euse", "chacun·e", "la·au propriétaire"). The game's own vocabulary keeps its capitalised articles (Le Corps, L'Âme, La Chair, La Santé, L'Éclat). Confirmations are short past-tense sentences ("Notes sauvegardées.").

## Evidence on Hand

- **Rules:** `src/lib/rules/index.ts` holds the formulas and the stat and Faculté descriptions; `src/lib/rules/xp.ts` holds the XP rules. Both are tested against real sheets from the spreadsheet (`rules.test.ts`, `xp.test.ts`). Some Facultés still have only a formula and no description (Discrétion, for example).
- **Catalogues:** `prisma/seeds/` holds the Corpus types, the Spyrée potentials (category › type › potential), and the general, spyral and martial skills with their descriptions and prerequisites. The MJ adds equipment properties in the app.
- **Documentation:** the `README.md` is the reference for the rules and XP tables, the deployment and the migrations; `CHANGELOG.md` records the releases.
- **Test data:** for previews, Lyse and Corwin (validated, with XP to spend), Le Colosse (an NPC still in creation) and "Table de test" (`prisma/seed-test.ts`, `src/lib/server/test-data.ts`).
- **Assets:** placeholder avatar `public/default.png`, app icon `src/app/icon.png`.
- **Missing:** the rulebook itself and the descriptions not yet in the catalogues. Future work must not invent rules text, formulas, costs or game content. Ask for them instead.

## Product Principles

1. **Play doesn't stop.** Anything a player needs mid-session (a value, its maximum, the rule behind it, the XP left) is one glance or one click away, and changing a live value takes no ceremony.
2. **The app does the maths.** Derived values and XP costs are never typed in by hand. If Oniria or the spreadsheet defines a formula, the app applies it, and tests hold it to the spreadsheet.
3. **The rules belong to Noème.** Formulas and rules text come from the game as written. The app implements them and never paraphrases, rebalances or fills gaps on its own.
4. **Experience is accountable.** Every XP movement is recorded and can be explained. Spending is final, and only the MJ can undo, always with a recorded refund or loss.
5. **One table, shared trust.** Everyone sees every sheet, only the owner and the MJ edit, and the MJ has full control.
