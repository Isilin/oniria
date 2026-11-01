-- DropForeignKey
ALTER TABLE "Corpus" DROP CONSTRAINT "Corpus_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Spyree" DROP CONSTRAINT "Spyree_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Amee" DROP CONSTRAINT "Amee_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "Trait" DROP CONSTRAINT "Trait_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "SheetSkill" DROP CONSTRAINT "SheetSkill_sheet_id_fkey";

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

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "current_health" DROP DEFAULT,
ALTER COLUMN "current_stability" DROP DEFAULT,
ALTER COLUMN "current_radiance" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Corpus" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

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
ALTER TABLE "SheetSkill" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Spell" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Golem" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Armor" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- AddForeignKey
ALTER TABLE "Corpus" ADD CONSTRAINT "Corpus_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spyree" ADD CONSTRAINT "Spyree_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amee" ADD CONSTRAINT "Amee_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

