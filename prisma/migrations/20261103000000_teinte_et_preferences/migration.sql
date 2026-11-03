-- Personnalisation : teinte de lune propre à chaque fiche, et réglages de
-- l'interface propres à chaque compte (thème, densité, sections repliées).
-- Deux colonnes facultatives : aucune donnée existante n'est modifiée.

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN "tint" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "preferences" JSONB;
