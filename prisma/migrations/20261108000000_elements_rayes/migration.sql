-- Éléments rayés : le MJ peut rayer un élément de la fiche (trait, aspect du
-- Corpus, potentiel, compétence, équipement…) au lieu de le supprimer. Il
-- reste sur la fiche, barré et sans effet ; l'XP payée pour lui est perdue
-- (`lost_xp`, consignée au journal). Les points de caractéristique rayés sont
-- gardés par caractéristique (`lost_points`).
-- Colonnes facultatives : aucune donnée existante n'est modifiée.

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN "lost_points" JSONB;

-- AlterTable
ALTER TABLE "Corpus" ADD COLUMN "lost_at" TIMESTAMP(3),
ADD COLUMN "lost_xp" INTEGER;

-- AlterTable
ALTER TABLE "Spyree" ADD COLUMN "lost_at" TIMESTAMP(3),
ADD COLUMN "lost_xp" INTEGER;

-- AlterTable
ALTER TABLE "SheetSkill" ADD COLUMN "lost_at" TIMESTAMP(3),
ADD COLUMN "lost_xp" INTEGER;

-- AlterTable
ALTER TABLE "Amee" ADD COLUMN "lost_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Trait" ADD COLUMN "lost_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Spell" ADD COLUMN "lost_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Golem" ADD COLUMN "lost_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Armor" ADD COLUMN "lost_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MeleeWeapon" ADD COLUMN "lost_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RangeWeapon" ADD COLUMN "lost_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Item" ADD COLUMN "lost_at" TIMESTAMP(3);
