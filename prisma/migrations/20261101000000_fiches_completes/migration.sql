-- Passage du schéma de main au schéma des fiches complètes : catalogues de
-- règles (types de Corpus, potentiels, compétences avec prérequis),
-- compétences propres à chaque fiche, suppressions en cascade, dates de
-- création.
--
-- Garde-fou : les tables transformées en profondeur doivent être vides
-- (c'est le cas en production). Sinon, la migration s'arrête ici et
-- rien n'est modifié.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Corpus")
     OR EXISTS (SELECT 1 FROM "Potential")
     OR EXISTS (SELECT 1 FROM "Spyree")
     OR EXISTS (SELECT 1 FROM "Skill")
     OR EXISTS (SELECT 1 FROM "_SheetToSkill") THEN
    RAISE EXCEPTION 'Corpus, potentiels ou compétences déjà présents : une migration de conversion est nécessaire. Rien n''a été modifié.';
  END IF;
  IF EXISTS (SELECT 1 FROM "Whitelist" WHERE "email" IS NULL) THEN
    RAISE EXCEPTION 'Une entrée de whitelist n''a pas d''email : à corriger avant la migration. Rien n''a été modifié.';
  END IF;
END $$;

-- Tables de liaison : index unique (Prisma 5) → clé primaire (Prisma 7).
ALTER TABLE "_SheetToTeam" ADD CONSTRAINT "_SheetToTeam_AB_pkey" PRIMARY KEY ("A", "B");
DROP INDEX "_SheetToTeam_AB_unique";
ALTER TABLE "_PropertyToRangeWeapon" ADD CONSTRAINT "_PropertyToRangeWeapon_AB_pkey" PRIMARY KEY ("A", "B");
DROP INDEX "_PropertyToRangeWeapon_AB_unique";
ALTER TABLE "_ArmorToProperty" ADD CONSTRAINT "_ArmorToProperty_AB_pkey" PRIMARY KEY ("A", "B");
DROP INDEX "_ArmorToProperty_AB_unique";
ALTER TABLE "_MeleeWeaponToProperty" ADD CONSTRAINT "_MeleeWeaponToProperty_AB_pkey" PRIMARY KEY ("A", "B");
DROP INDEX "_MeleeWeaponToProperty_AB_unique";

-- DropForeignKey
ALTER TABLE "Corpus" DROP CONSTRAINT "Corpus_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Spyree" DROP CONSTRAINT "Spyree_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Amee" DROP CONSTRAINT "Amee_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Trait" DROP CONSTRAINT "Trait_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_prerequisite_id_fkey";

-- DropForeignKey
ALTER TABLE "Spell" DROP CONSTRAINT "Spell_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Golem" DROP CONSTRAINT "Golem_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Armor" DROP CONSTRAINT "Armor_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "MeleeWeapon" DROP CONSTRAINT "MeleeWeapon_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "RangeWeapon" DROP CONSTRAINT "RangeWeapon_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "_SheetToSkill" DROP CONSTRAINT "_SheetToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_SheetToSkill" DROP CONSTRAINT "_SheetToSkill_B_fkey";

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "aspect" SET DEFAULT 'Type',
ALTER COLUMN "become" SET DEFAULT '10';

-- AlterTable
ALTER TABLE "Whitelist" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Corpus" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Potential" DROP COLUMN "category",
ADD COLUMN     "type_id" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Spyree" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "level" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Amee" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trait" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "inborn" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "prerequisite_id";

-- AlterTable
ALTER TABLE "Spell" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Golem" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Armor" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "equipped" SET DEFAULT true;

-- AlterTable
ALTER TABLE "MeleeWeapon" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "equipped" SET DEFAULT true;

-- AlterTable
ALTER TABLE "RangeWeapon" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "equipped" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- DropTable
DROP TABLE "_SheetToSkill";

-- CreateTable
CREATE TABLE "CorpusType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CorpusType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotentialCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PotentialCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotentialType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "PotentialType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetSkill" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suffixe" TEXT,
    "prerequisite_id" TEXT,
    "skill_id" TEXT NOT NULL,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "SheetSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SkillDependencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SkillDependencies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CorpusType_name_key" ON "CorpusType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PotentialCategory_name_key" ON "PotentialCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PotentialType_name_key" ON "PotentialType"("name");

-- CreateIndex
CREATE INDEX "_SkillDependencies_B_index" ON "_SkillDependencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Potential_name_key" ON "Potential"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_category_key" ON "Skill"("name", "category");

-- AddForeignKey
ALTER TABLE "PotentialType" ADD CONSTRAINT "PotentialType_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "PotentialCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Potential" ADD CONSTRAINT "Potential_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "PotentialType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corpus" ADD CONSTRAINT "Corpus_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "CorpusType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corpus" ADD CONSTRAINT "Corpus_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spyree" ADD CONSTRAINT "Spyree_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amee" ADD CONSTRAINT "Amee_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetSkill" ADD CONSTRAINT "SheetSkill_prerequisite_id_fkey" FOREIGN KEY ("prerequisite_id") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetSkill" ADD CONSTRAINT "SheetSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetSkill" ADD CONSTRAINT "SheetSkill_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spell" ADD CONSTRAINT "Spell_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Golem" ADD CONSTRAINT "Golem_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeleeWeapon" ADD CONSTRAINT "MeleeWeapon_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangeWeapon" ADD CONSTRAINT "RangeWeapon_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillDependencies" ADD CONSTRAINT "_SkillDependencies_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillDependencies" ADD CONSTRAINT "_SkillDependencies_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

