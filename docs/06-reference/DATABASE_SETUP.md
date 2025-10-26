# Database Setup Guide

This guide explains how to set up the PostgreSQL database for Riftbound Simulator.

## Quick Start (Docker)

The easiest way to run the database locally is using Docker:

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify containers are running
docker ps

# Check logs
docker-compose logs -f postgres
```

## Manual Setup Steps

### 1. Install Dependencies

Dependencies are already installed via npm:
- `@prisma/client` - Prisma ORM client
- `prisma` - Prisma CLI (dev dependency)
- `pg` - PostgreSQL driver
- `ioredis` - Redis client

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://riftbound:password@localhost:5432/riftbound_dev?schema=public"
```

### 3. Generate Prisma Client

Generate TypeScript types from schema:

```bash
npm run db:generate
```

This creates `src/generated/prisma/` with typed client.

### 4. Run Migrations

Create database tables:

```bash
npm run db:migrate
```

This will:
- Create `riftbound_dev` database (if not exists)
- Run all migrations in `prisma/migrations/`
- Generate Prisma Client

### 5. Seed Database

Populate with example cards and test data:

```bash
npm run db:seed
```

This adds:
- 11 base cards (Fire Warrior, Lightning Bolt, Phoenix, Archmage, etc.)
- 4 basic runes
- 3 battlefield cards
- 2 test users

## Database Schema

### Core Models

#### User
- Authentication and profile
- Stats (games played, won, rating)
- Relations to decks and matches

#### CardDefinition
- Static card metadata (name, cost, description)
- **scriptPath** - Link to TypeScript script file
- Domains, keywords, tags (JSON)
- Unit stats (might, subtypes)

#### Deck
- Player deck lists
- Champion Legend + Chosen Champion
- Card composition (main deck, rune deck)
- Validation status

#### Match
- Game state tracking
- Player references
- Win conditions
- Event history for replay

#### MatchEvent
- Complete event log for replay
- Sequenced events
- Anti-cheat validation

#### GameSession
- Active game state (in-memory alternative to Redis)
- Session management
- Expiration tracking

## NPM Scripts

```bash
# Generate Prisma Client
npm run db:generate

# Create new migration
npm run db:migrate

# Run seed script
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio

# Reset database (WARNING: deletes all data)
npm run db:reset
```

## Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

Opens at: http://localhost:5555

## Production Setup

### PostgreSQL

```bash
# Create production database
createdb riftbound_prod

# Set DATABASE_URL in production .env
DATABASE_URL="postgresql://user:pass@hostname:5432/riftbound_prod"

# Run migrations
npx prisma migrate deploy
```

### Redis (Optional)

For production, replace `GameSession` model with actual Redis:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Store game state
await redis.set(`game:${matchId}`, JSON.stringify(gameState), 'EX', 3600);

// Retrieve game state
const state = await redis.get(`game:${matchId}`);
```

## Migrations

### Create New Migration

```bash
# After schema changes
npm run db:migrate
```

Prisma will:
1. Detect schema changes
2. Generate SQL migration
3. Apply to database
4. Update Prisma Client

### View Migration History

```bash
# List all migrations
npx prisma migrate status
```

### Rollback (Development Only)

```bash
# Reset to specific migration
npx prisma migrate reset
```

## Troubleshooting

### Connection Refused

```bash
# Check Docker containers
docker-compose ps

# Restart database
docker-compose restart postgres
```

### Schema Out of Sync

```bash
# Regenerate client
npm run db:generate

# Reset and re-migrate
npm run db:reset
```

### Seed Errors

```bash
# Check Prisma Client is generated
npm run db:generate

# Verify database is running
psql postgresql://riftbound:password@localhost:5432/riftbound_dev

# Clear and re-seed
npm run db:reset
```

## Card Scripting Integration

Cards in the database have a `scriptPath` field:

```typescript
// Database
{
  id: 'FIRE_WARRIOR_001',
  name: 'Fire Warrior',
  scriptPath: 'examples/FireWarrior.ts',
  hasScript: true,
  // ... other metadata
}

// Script file: scripts/cards/examples/FireWarrior.ts
export const cardScript = {
  id: 'FIRE_WARRIOR_001',
  onPlay: (context) => {
    battlefield.dealDamage(targets[0], 2);
  }
};
```

**CardFactory** merges:
- Static data (DB) → Card metadata
- Dynamic behavior (Scripts) → Card logic

## Backup & Restore

### Backup

```bash
# Export database
pg_dump postgresql://riftbound:password@localhost:5432/riftbound_dev > backup.sql

# Export with Docker
docker exec riftbound-postgres pg_dump -U riftbound riftbound_dev > backup.sql
```

### Restore

```bash
# Import database
psql postgresql://riftbound:password@localhost:5432/riftbound_dev < backup.sql

# Import with Docker
docker exec -i riftbound-postgres psql -U riftbound riftbound_dev < backup.sql
```

## Next Steps

1. Start database: `docker-compose up -d`
2. Generate client: `npm run db:generate`
3. Run migrations: `npm run db:migrate`
4. Seed data: `npm run db:seed`
5. Explore data: `npm run db:studio`

The database is now ready for use with the Card Scripting System!
