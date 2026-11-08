-- Système d'expérience : journal des XP de chaque fiche (attribuées par le
-- MJ, dépensées, remboursées, perdues, offertes) et parties de la fiche
-- encore modifiables librement (création, reset du MJ).
--
-- Les fiches existantes sont reprises telles quelles et considérées comme
-- validées : leur XP gagnée devient une attribution « XP reprise de
-- l'ancienne fiche » et la différence avec l'XP restante une dépense
-- « Dépenses antérieures », non détaillée. L'XP restante de chaque
-- catégorie est donc inchangée.

-- CreateEnum
CREATE TYPE "XpKind" AS ENUM ('GAIN', 'SPEND', 'REFUND', 'LOSS', 'GIFT');

-- CreateTable
CREATE TABLE "XpEntry" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sheet_id" TEXT NOT NULL,
    "author_id" TEXT,
    "kind" "XpKind" NOT NULL,
    "feel" INTEGER NOT NULL DEFAULT 0,
    "learn" INTEGER NOT NULL DEFAULT 0,
    "live" INTEGER NOT NULL DEFAULT 0,
    "offered" INTEGER NOT NULL DEFAULT 0,
    "target" TEXT,
    "scope" TEXT,
    "label" TEXT NOT NULL,
    "batch" TEXT,

    CONSTRAINT "XpEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "XpEntry_sheet_id_idx" ON "XpEntry"("sheet_id");

-- AddForeignKey
ALTER TABLE "XpEntry" ADD CONSTRAINT "XpEntry_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpEntry" ADD CONSTRAINT "XpEntry_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Fiches existantes : validées (rien de débloqué). Nouvelles fiches : tout
-- est débloqué jusqu'à la validation de la création.
ALTER TABLE "Sheet" ADD COLUMN "xp_unlocked" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Sheet" ALTER COLUMN "xp_unlocked" SET DEFAULT ARRAY['body', 'spirit', 'soul', 'general', 'spyral', 'martial', 'corpus', 'spyree']::TEXT[];

-- Reprise des XP saisies à la main. Si la restante dépassait la gagnée, on
-- prend la restante comme gagnée (sans dépense) pour la conserver.
INSERT INTO "XpEntry" ("id", "sheet_id", "kind", "feel", "learn", "live", "label", "batch")
SELECT
    'legacy-gain-' || "id",
    "id",
    'GAIN',
    GREATEST(COALESCE("feel_xp", 0), COALESCE("to_spend_feel_xp", 0)),
    GREATEST(COALESCE("learn_xp", 0), COALESCE("to_spend_learn_xp", 0)),
    GREATEST(COALESCE("live_xp", 0), COALESCE("to_spend_live_xp", 0)),
    'XP reprise de l''ancienne fiche',
    'legacy-' || "id"
FROM "Sheet"
WHERE COALESCE("feel_xp", 0) <> 0 OR COALESCE("to_spend_feel_xp", 0) <> 0
   OR COALESCE("learn_xp", 0) <> 0 OR COALESCE("to_spend_learn_xp", 0) <> 0
   OR COALESCE("live_xp", 0) <> 0 OR COALESCE("to_spend_live_xp", 0) <> 0;

INSERT INTO "XpEntry" ("id", "sheet_id", "kind", "feel", "learn", "live", "target", "label", "batch")
SELECT
    'legacy-spend-' || "id",
    "id",
    'SPEND',
    GREATEST(0, COALESCE("feel_xp", 0) - COALESCE("to_spend_feel_xp", 0)),
    GREATEST(0, COALESCE("learn_xp", 0) - COALESCE("to_spend_learn_xp", 0)),
    GREATEST(0, COALESCE("live_xp", 0) - COALESCE("to_spend_live_xp", 0)),
    'legacy',
    'Dépenses antérieures (ancienne fiche)',
    'legacy-' || "id"
FROM "Sheet"
WHERE GREATEST(0, COALESCE("feel_xp", 0) - COALESCE("to_spend_feel_xp", 0))
    + GREATEST(0, COALESCE("learn_xp", 0) - COALESCE("to_spend_learn_xp", 0))
    + GREATEST(0, COALESCE("live_xp", 0) - COALESCE("to_spend_live_xp", 0)) > 0;

-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "feel_xp",
DROP COLUMN "learn_xp",
DROP COLUMN "live_xp",
DROP COLUMN "to_spend_feel_xp",
DROP COLUMN "to_spend_learn_xp",
DROP COLUMN "to_spend_live_xp";
