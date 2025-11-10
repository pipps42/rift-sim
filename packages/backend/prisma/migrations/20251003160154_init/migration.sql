/*
  Warnings:

  - You are about to drop the column `battlefieldIds` on the `decks` table. All the data in the column will be lost.
  - You are about to drop the `deck_cards` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `battlefieldId` to the `decks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."deck_cards" DROP CONSTRAINT "deck_cards_cardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."deck_cards" DROP CONSTRAINT "deck_cards_deckId_fkey";

-- AlterTable
ALTER TABLE "decks" DROP COLUMN "battlefieldIds",
ADD COLUMN     "battlefieldId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."deck_cards";

-- DropEnum
DROP TYPE "public"."DeckSection";

-- CreateTable
CREATE TABLE "main_deck_cards" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "main_deck_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rune_deck_cards" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "rune_deck_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "main_deck_cards_deckId_idx" ON "main_deck_cards"("deckId");

-- CreateIndex
CREATE UNIQUE INDEX "main_deck_cards_deckId_cardId_key" ON "main_deck_cards"("deckId", "cardId");

-- CreateIndex
CREATE INDEX "rune_deck_cards_deckId_idx" ON "rune_deck_cards"("deckId");

-- CreateIndex
CREATE UNIQUE INDEX "rune_deck_cards_deckId_cardId_key" ON "rune_deck_cards"("deckId", "cardId");

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_championLegendId_fkey" FOREIGN KEY ("championLegendId") REFERENCES "card_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_chosenChampionId_fkey" FOREIGN KEY ("chosenChampionId") REFERENCES "card_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_battlefieldId_fkey" FOREIGN KEY ("battlefieldId") REFERENCES "card_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main_deck_cards" ADD CONSTRAINT "main_deck_cards_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main_deck_cards" ADD CONSTRAINT "main_deck_cards_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rune_deck_cards" ADD CONSTRAINT "rune_deck_cards_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rune_deck_cards" ADD CONSTRAINT "rune_deck_cards_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
