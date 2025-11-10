/*
  Warnings:

  - The values [CHAMPION_LEGEND] on the enum `CardType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CardType_new" AS ENUM ('UNIT', 'CHAMPION', 'GEAR', 'SPELL', 'RUNE', 'LEGEND', 'BATTLEFIELD', 'SIGNATURE', 'TOKEN');
ALTER TABLE "card_definitions" ALTER COLUMN "cardType" TYPE "CardType_new" USING ("cardType"::text::"CardType_new");
ALTER TYPE "CardType" RENAME TO "CardType_old";
ALTER TYPE "CardType_new" RENAME TO "CardType";
DROP TYPE "public"."CardType_old";
COMMIT;
