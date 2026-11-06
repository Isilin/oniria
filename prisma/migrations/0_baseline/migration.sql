-- Schéma de la production avant ce projet (branche main, créé par
-- `prisma db push` avec Prisma 5). Sur une base existante, cette migration
-- est seulement marquée comme appliquée (« baseline »).

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('GENERAL', 'SPYRAL', 'MARTIAL');

-- CreateEnum
CREATE TYPE "SkillDegree" AS ENUM ('BASE', 'PRINCIPLE', 'MASTERY', 'TECHNIQUE', 'SEQUENCE');

-- CreateEnum
CREATE TYPE "ArmorType" AS ENUM ('LOW', 'PARTIAL', 'FULL');

-- CreateTable
CREATE TABLE "accounts" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "age" INTEGER,
    "current_mai" INTEGER,
    "aspect" TEXT,
    "become" TEXT,
    "strength" INTEGER DEFAULT 25,
    "agility" INTEGER DEFAULT 25,
    "vivacity" INTEGER DEFAULT 25,
    "vigour" INTEGER DEFAULT 25,
    "thinking" INTEGER DEFAULT 25,
    "perception" INTEGER DEFAULT 25,
    "concentration" INTEGER DEFAULT 25,
    "understanding" INTEGER DEFAULT 25,
    "charisma" INTEGER DEFAULT 25,
    "empathy" INTEGER DEFAULT 25,
    "ego" INTEGER DEFAULT 25,
    "will" INTEGER DEFAULT 25,
    "current_health" INTEGER,
    "current_stability" INTEGER,
    "current_radiance" INTEGER,
    "feel_xp" INTEGER DEFAULT 0,
    "to_spend_feel_xp" INTEGER DEFAULT 0,
    "learn_xp" INTEGER DEFAULT 0,
    "to_spend_learn_xp" INTEGER DEFAULT 0,
    "live_xp" INTEGER DEFAULT 0,
    "to_spend_live_xp" INTEGER DEFAULT 0,
    "notes" TEXT DEFAULT '',

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Whitelist" (
    "id" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corpus" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "stat" TEXT,
    "bonus" INTEGER,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "Corpus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Potential" (
    "id" TEXT NOT NULL,
    "category" TEXT,
    "name" TEXT,
    "description" TEXT,

    CONSTRAINT "Potential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spyree" (
    "id" TEXT NOT NULL,
    "level" INTEGER,
    "sheet_id" TEXT NOT NULL,
    "potential_id" TEXT NOT NULL,

    CONSTRAINT "Spyree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "Amee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trait" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "balance" INTEGER,
    "inborn" BOOLEAN NOT NULL,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "SkillType" NOT NULL,
    "category" TEXT NOT NULL,
    "degree" "SkillDegree" NOT NULL,
    "prerequisite_id" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spell" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "incantation" TEXT,
    "targeting" TEXT,
    "duration" TEXT,
    "effect" TEXT,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "Spell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Golem" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "artefact" TEXT,
    "symbiosis" TEXT,
    "heart" TEXT,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "Golem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Armor" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "protection" INTEGER,
    "current_protection" INTEGER,
    "index" INTEGER,
    "type" "ArmorType" NOT NULL,
    "bulk" INTEGER,
    "strength" INTEGER,
    "prerequisite_stat" TEXT,
    "prerequisite_value" INTEGER,
    "quality" INTEGER,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "Armor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeleeWeapon" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "damage" INTEGER,
    "extend" INTEGER,
    "bulk" INTEGER,
    "strength" INTEGER,
    "prerequisite_stat" TEXT,
    "prerequisite_value" INTEGER,
    "quality" INTEGER,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "MeleeWeapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RangeWeapon" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "damage" INTEGER,
    "penetration_damage" INTEGER,
    "velocity" INTEGER,
    "rate" INTEGER,
    "reload_rate" INTEGER,
    "range" TEXT,
    "low_range" INTEGER,
    "medium_range" INTEGER,
    "long_range" INTEGER,
    "bulk" INTEGER,
    "strength" INTEGER,
    "prerequisite_stat" TEXT,
    "prerequisite_value" INTEGER,
    "quality" INTEGER,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "RangeWeapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "quantity" INTEGER,
    "sheet_id" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SheetToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SheetToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PropertyToRangeWeapon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArmorToProperty" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MeleeWeaponToProperty" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_email_key" ON "Whitelist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SheetToTeam_AB_unique" ON "_SheetToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_SheetToTeam_B_index" ON "_SheetToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SheetToSkill_AB_unique" ON "_SheetToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_SheetToSkill_B_index" ON "_SheetToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PropertyToRangeWeapon_AB_unique" ON "_PropertyToRangeWeapon"("A", "B");

-- CreateIndex
CREATE INDEX "_PropertyToRangeWeapon_B_index" ON "_PropertyToRangeWeapon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArmorToProperty_AB_unique" ON "_ArmorToProperty"("A", "B");

-- CreateIndex
CREATE INDEX "_ArmorToProperty_B_index" ON "_ArmorToProperty"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MeleeWeaponToProperty_AB_unique" ON "_MeleeWeaponToProperty"("A", "B");

-- CreateIndex
CREATE INDEX "_MeleeWeaponToProperty_B_index" ON "_MeleeWeaponToProperty"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corpus" ADD CONSTRAINT "Corpus_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spyree" ADD CONSTRAINT "Spyree_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spyree" ADD CONSTRAINT "Spyree_potential_id_fkey" FOREIGN KEY ("potential_id") REFERENCES "Potential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amee" ADD CONSTRAINT "Amee_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_prerequisite_id_fkey" FOREIGN KEY ("prerequisite_id") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spell" ADD CONSTRAINT "Spell_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Golem" ADD CONSTRAINT "Golem_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeleeWeapon" ADD CONSTRAINT "MeleeWeapon_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangeWeapon" ADD CONSTRAINT "RangeWeapon_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SheetToTeam" ADD CONSTRAINT "_SheetToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SheetToTeam" ADD CONSTRAINT "_SheetToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SheetToSkill" ADD CONSTRAINT "_SheetToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SheetToSkill" ADD CONSTRAINT "_SheetToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyToRangeWeapon" ADD CONSTRAINT "_PropertyToRangeWeapon_A_fkey" FOREIGN KEY ("A") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyToRangeWeapon" ADD CONSTRAINT "_PropertyToRangeWeapon_B_fkey" FOREIGN KEY ("B") REFERENCES "RangeWeapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmorToProperty" ADD CONSTRAINT "_ArmorToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "Armor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmorToProperty" ADD CONSTRAINT "_ArmorToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeleeWeaponToProperty" ADD CONSTRAINT "_MeleeWeaponToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "MeleeWeapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeleeWeaponToProperty" ADD CONSTRAINT "_MeleeWeaponToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

