-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('UNIT', 'GEAR', 'SPELL', 'RUNE', 'CHAMPION_LEGEND', 'BATTLEFIELD');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'MYTHIC');

-- CreateEnum
CREATE TYPE "DeckSection" AS ENUM ('MAIN', 'RUNE', 'CHAMPION');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_definitions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "energyCost" INTEGER NOT NULL,
    "powerCosts" JSONB NOT NULL DEFAULT '[]',
    "description" TEXT NOT NULL,
    "flavorText" TEXT,
    "might" INTEGER,
    "subtypes" JSONB NOT NULL DEFAULT '[]',
    "domains" JSONB NOT NULL DEFAULT '[]',
    "keywords" JSONB NOT NULL DEFAULT '[]',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "scriptPath" TEXT,
    "hasScript" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "artist" TEXT,
    "cardNumber" TEXT,
    "setCode" TEXT,
    "setName" TEXT,
    "isSignature" BOOLEAN NOT NULL DEFAULT false,
    "isBasicRune" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "championLegendId" TEXT NOT NULL,
    "chosenChampionId" TEXT NOT NULL,
    "battlefieldIds" JSONB NOT NULL DEFAULT '[]',
    "isValid" BOOLEAN NOT NULL DEFAULT false,
    "totalCards" INTEGER NOT NULL DEFAULT 0,
    "format" TEXT NOT NULL DEFAULT 'standard',
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "winCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck_cards" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "section" "DeckSection" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "deck_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player1DeckId" TEXT,
    "player2Id" TEXT NOT NULL,
    "player2DeckId" TEXT,
    "status" "MatchStatus" NOT NULL,
    "winnerId" TEXT,
    "winCondition" TEXT,
    "currentRound" INTEGER NOT NULL DEFAULT 1,
    "currentPhase" TEXT,
    "gameState" JSONB,
    "format" TEXT NOT NULL DEFAULT 'standard',
    "isRanked" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_events" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "phase" TEXT,
    "playerId" TEXT,
    "data" JSONB NOT NULL,
    "sequence" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_collections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "foil" BOOLEAN NOT NULL DEFAULT false,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "card_definitions_cardType_idx" ON "card_definitions"("cardType");

-- CreateIndex
CREATE INDEX "card_definitions_rarity_idx" ON "card_definitions"("rarity");

-- CreateIndex
CREATE INDEX "card_definitions_setCode_idx" ON "card_definitions"("setCode");

-- CreateIndex
CREATE INDEX "decks_userId_idx" ON "decks"("userId");

-- CreateIndex
CREATE INDEX "deck_cards_deckId_idx" ON "deck_cards"("deckId");

-- CreateIndex
CREATE UNIQUE INDEX "deck_cards_deckId_cardId_section_key" ON "deck_cards"("deckId", "cardId", "section");

-- CreateIndex
CREATE INDEX "matches_player1Id_idx" ON "matches"("player1Id");

-- CreateIndex
CREATE INDEX "matches_player2Id_idx" ON "matches"("player2Id");

-- CreateIndex
CREATE INDEX "matches_status_idx" ON "matches"("status");

-- CreateIndex
CREATE INDEX "matches_createdAt_idx" ON "matches"("createdAt");

-- CreateIndex
CREATE INDEX "match_events_matchId_sequence_idx" ON "match_events"("matchId", "sequence");

-- CreateIndex
CREATE INDEX "match_events_matchId_type_idx" ON "match_events"("matchId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "game_sessions_matchId_key" ON "game_sessions"("matchId");

-- CreateIndex
CREATE INDEX "game_sessions_expiresAt_idx" ON "game_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "game_sessions_isActive_idx" ON "game_sessions"("isActive");

-- CreateIndex
CREATE INDEX "user_collections_userId_idx" ON "user_collections"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_collections_userId_cardId_foil_key" ON "user_collections"("userId", "cardId", "foil");

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
