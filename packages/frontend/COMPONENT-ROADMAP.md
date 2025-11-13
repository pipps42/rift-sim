# Riftbound TCG - Component Roadmap (UPDATED)

## Overview
Roadmap aggiornata basata sulle UI Design Specifications. Focus su immagini statiche con overlay per modifiche.

---

## FASE 1: Componenti Primitivi (Base)

### 1.1 Layout & Structure
- [ ] **Container** - Contenitore responsive con max-width
- [ ] **Flex** - Container flex con props (direction, justify, align, gap)
- [ ] **Stack** - Layout verticale/orizzontale con spacing uniforme
- [ ] **Grid** - Sistema griglia (per modali zone viewer)

### 1.2 Typography
- [ ] **Text** - Testo con varianti (body, caption, label, display)
- [ ] **Heading** - Titoli H1-H6

### 1.3 Inputs & Actions
- [ ] **Button** - Pulsante con varianti (primary, secondary, danger, ghost)
- [ ] **IconButton** - Pulsante solo icona

### 1.4 Feedback & Overlays
- [ ] **Badge** - Badge numerici o di stato (per keywords, modifiche)
- [ ] **Tag** - Tag colorati per categorie
- [ ] **Tooltip** - Tooltip con posizionamento (per card modifications)
- [ ] **Modal** - Modale con overlay (per zone viewers)
- [ ] **Spinner** - Loader animato

### 1.5 Display & Visual
- [ ] **Icon** - Wrapper per icone (lucide-react consigliato)
- [ ] **Image** - Immagine con lazy loading e fallback
- [ ] **Skeleton** - Placeholder per loading states
- [ ] **Divider** - Separatore visuale

---

## FASE 2: Componenti di Dominio (Game-Specific)

### 2.1 Card System (Priorità ALTA) ⭐

#### Core Card Components
- [ ] **CardImage** - Render immagine carta WebP con stati
  - Props: `imageUrl`, `isExhausted` (desaturate + rotate), `isRevealed`
  - Lazy loading
  - Fallback per immagini mancanti

- [ ] **CardBack** - Retro carta (per decks, opponent hand)
  - Immagine statica card back

- [ ] **CardOverlay** - Overlay per costo/might modificati
  - Props: `originalCost`, `modifiedCost`, `originalMight`, `modifiedMight`
  - Rendering sovrimposto in alto-sinistra (cost) / alto-destra (might)

- [ ] **CardBadge** - Badge laterale per keywords aggiunti
  - Props: `keywords[]`, `position` (right/left)
  - Rendering a destra della carta

- [ ] **CardTooltip** - Tooltip dettagliato modifiche
  - Props: `modifications[]` (con source info)
  - Trigger: hover sulla carta

- [ ] **GameCard** - Carta completa giocabile
  - Combina: CardImage + CardOverlay + CardBadge
  - Gestisce hover → magnify + tooltip
  - Props: `card` object, `isPlayable`, `isTargeted`, `isSelected`

- [ ] **MiniCard** - Versione ridotta (80x112px)
  - Per chain stack, deck lists

### 2.2 Zone Components (Priorità ALTA) ⭐

#### Counters & Indicators
- [ ] **ZoneCounter** - Counter per deck/trash con icona
  - Props: `count`, `icon`, `label`
  - Click handler

#### Rune System
- [ ] **RunePoolIcon** - Singola icona pool (energy o power domain)
  - Props: `type` (energy/fury/calm/etc), `count`
  - Rendering icona colorata + numero

- [ ] **RunePool** - Container pool completo
  - Props: `energy`, `powerCosts[]`
  - Combina più RunePoolIcon
  - Layout: icone in fila orizzontale

- [ ] **RuneZone** - Grid rune in gioco
  - Props: `runes[]` (raggruppate per domain)
  - Layout: overlap parziale, ready vs exhausted
  - Gestisce ready (vert) vs exhausted (horiz + desat)

#### Player Info
- [ ] **PlayerInfo** - Info giocatore
  - Props: `name`, `avatar?`, `score`
  - Layout: compact con avatar + nome + score

#### Zones Layout
- [ ] **Hand** - Mano di carte
  - Props: `cards[]`, `onCardClick`, `isOpponent`
  - Layout: orizzontale, scrollabile
  - Rendering: carte visibili (player) o card backs (opponent)

- [ ] **DeckZone** - Zona deck (main o rune)
  - Props: `count`, `type` (main/rune), `onClick`
  - Rendering: card back + counter

- [ ] **TrashZone** - Zona trash
  - Props: `cards[]`, `onClick`
  - Rendering: ultima carta aggiunta + counter

- [ ] **GearZone** - Zona gear (permanenti non-unit/rune)
  - Props: `gears[]`
  - Layout: orizzontale identico a PlayerBase

- [ ] **PlayerBase** - Zona units del giocatore
  - Props: `units[]`
  - Layout: orizzontale, overlap se >6 units

- [ ] **LegendChampionZone** - Zone leggenda + champion
  - Props: `legend`, `chosenChampion`
  - Layout: 2 carte affiancate, sempre visibili

### 2.3 Battlefield (Priorità ALTA) ⭐

- [ ] **BattlefieldCard** - Carta battlefield (orizzontale)
  - Props: `battlefieldCard`
  - Layout: orizzontale al centro della zona

- [ ] **BattlefieldUnits** - Container units su battlefield
  - Props: `units[]`, `side` (player/opponent)
  - Layout: orizzontale sopra/sotto BF card

- [ ] **BattlefieldZone** - Zona battlefield completa
  - Props: `battlefield`, `playerUnits[]`, `opponentUnits[]`
  - Combina: BattlefieldCard + 2x BattlefieldUnits
  - Contested indicator

### 2.4 Game State (Priorità MEDIA)

- [ ] **PhaseIndicator** - Indicatore fase corrente
  - Props: `currentPhase` (8 fasi)
  - Visual: nome fase + icona

- [ ] **TurnIndicator** - Indicatore turno
  - Props: `turnNumber`
  - Visual: "Turn X"

- [ ] **RoundCounter** - Contatore round
  - Props: `roundNumber`
  - Visual: "Round X"

- [ ] **PriorityIndicator** - Indicatore priorità
  - Props: `playerId`, `playerName`
  - Visual: "Priority: Player Name"

- [ ] **ScoreDisplay** - Display punteggio
  - Props: `player1Score`, `player2Score`
  - Visual: "3 - 5"

- [ ] **GameInfoPanel** - Pannello info completo
  - Combina: Score, Phase, Turn, Round, Priority
  - Layout verticale compatto

### 2.5 Chain & Actions (Priorità MEDIA)

- [ ] **ChainStack** - Stack spell/abilità
  - Props: `chainItems[]`
  - Layout: verticale, mini cards
  - Ordine risoluzione: bottom → top

- [ ] **ActionButton** - Pulsante azione specifica
  - Props: `action` (play/move/activate/pass), `disabled`, `onClick`
  - Varianti colorate per tipo azione

---

## FASE 3: Componenti Compositi (Complex)

### 3.1 Player Areas (Priorità ALTA) ⭐

- [ ] **PlayerZones** - Tutte le zone del giocatore (no hand)
  - Props: `player`, `isOpponent`
  - Combina: Deck, RuneDeck, RuneZone+Pool, Gear, Trash, Legend+Champion, Base
  - Layout: riga orizzontale con zone affiancate

- [ ] **PlayerArea** - Area completa giocatore
  - Props: `player`, `isOpponent`
  - Combina: Hand + PlayerZones
  - Layout: stacked (hand in basso per player, in alto per opponent)

### 3.2 Battlefield Center (Priorità ALTA) ⭐

- [ ] **BattlefieldCenter** - Area centrale con 2 battlefields
  - Props: `battlefields[]` (2), `gameInfo`
  - Layout: 2 BF affiancati + GameInfoPanel a lato

### 3.3 Game Board (Priorità ALTA) ⭐

- [ ] **GameBoard** - Board completo
  - Props: `game`, `currentPlayerId`
  - Combina: PlayerArea (opponent) + BattlefieldCenter + PlayerArea (current)
  - Gestisce stato globale e interazioni

---

## FASE 4: Modali Zone Viewers

### 4.1 Deck Viewers (Priorità MEDIA)
- [ ] **DeckViewerModal** - Modal viewer per deck/rune deck
  - Props: `cards[]`, `revealedIndices[]`, `title`
  - Grid di card backs + immagini per rivelate

- [ ] **TrashViewerModal** - Modal viewer per trash
  - Props: `cards[]`, `title`
  - Grid di carte visibili (tutte)

- [ ] **ZoneViewerModal** - Modal generico per zone
  - Props: `cards[]`, `title`, `showCardBacks`
  - Riutilizzabile per Gear/Base se necessario

---

## FASE 5: Views (Screens)

### 5.1 Core Views (Priorità ALTA)
- [ ] **HomePage** - Landing page
  - Menu: New Game, Join Game, Profile, Settings

- [ ] **LobbyView** - Lobby games
  - Lista games attivi
  - Pulsanti Create/Join

- [ ] **GameView** - Vista game principale
  - Usa GameBoard
  - Header con menu (Settings, Concede, Exit)

---

## FASE 6: Advanced Features (Priorità BASSA)

### 6.1 Interattività Avanzata
- [ ] **DragDropZone** - Zone drop per drag-and-drop carte
- [ ] **TargetSelector** - UI selezione target
- [ ] **ContextMenu** - Menu contestuale right-click

### 6.2 Animations
- [ ] **CardPlayAnimation** - Animazione gioco carta
- [ ] **DamageAnimation** - Animazione danno
- [ ] **DrawAnimation** - Animazione pesca

### 6.3 Accessibility
- [ ] **KeyboardNavigation** - Navigazione tastiera
- [ ] **HighContrastMode** - Modalità alto contrasto

---

## Priorità di Implementazione

### Sprint 1 (Immediato) - Componenti Base ⭐
**Obiettivo:** Componenti primitivi + card rendering

1. **Primitivi Layout** (30 min)
   - Container, Flex, Stack

2. **Primitivi UI** (45 min)
   - Button, Badge, Text, Heading, Icon

3. **Card System** (2h)
   - CardImage (con stati exhausted)
   - CardOverlay (cost/might modificati)
   - CardBadge (keywords)
   - CardTooltip (modifiche dettagliate)
   - GameCard (combina tutto)
   - CardBack
   - MiniCard

4. **Zone Counters** (30 min)
   - ZoneCounter (per deck/trash)

**Deliverable:** Card rendering completo con tutti gli stati visivi

---

### Sprint 2 - Player Zones ⭐
**Obiettivo:** Visualizzare tutte le zone del giocatore

1. **Rune System** (1.5h)
   - RunePoolIcon
   - RunePool
   - RuneZone

2. **Player Zones** (2h)
   - PlayerInfo
   - Hand
   - DeckZone, TrashZone
   - GearZone, PlayerBase
   - LegendChampionZone

3. **PlayerZones Composite** (1h)
   - PlayerZones (combina tutte le zone)

**Deliverable:** Area giocatore completa (senza battlefield)

---

### Sprint 3 - Battlefield & Game State ⭐
**Obiettivo:** Battlefield + info di gioco

1. **Battlefield** (2h)
   - BattlefieldCard
   - BattlefieldUnits
   - BattlefieldZone

2. **Game State** (1.5h)
   - PhaseIndicator, TurnIndicator, RoundCounter
   - PriorityIndicator, ScoreDisplay
   - GameInfoPanel

3. **Chain Stack** (1h)
   - ChainStack

4. **BattlefieldCenter** (1h)
   - Combina 2 battlefields + GameInfoPanel

**Deliverable:** Centro battlefield con info gioco

---

### Sprint 4 - Game Board Completo ⭐
**Obiettivo:** Board giocabile

1. **PlayerArea** (1h)
   - Combina Hand + PlayerZones

2. **GameBoard** (2h)
   - Layout completo
   - Gestione stato

3. **Action Buttons** (1h)
   - ActionButton (play, pass, move, activate)

4. **GameView** (1h)
   - Vista schermo completo

**Deliverable:** Game board funzionante

---

### Sprint 5 - Modali & Polish
**Obiettivo:** Zone viewers + rifinitura

1. **Modali** (2h)
   - DeckViewerModal
   - TrashViewerModal
   - ZoneViewerModal

2. **Lobby & Home** (1.5h)
   - HomePage
   - LobbyView

**Deliverable:** Navigazione completa + zone viewers

---

### Sprint 6+ - Advanced Features
**Obiettivo:** Drag-and-drop, animazioni, accessibility

1. Drag-and-drop
2. Animazioni
3. Accessibility
4. Performance optimization

---

## Note Tecniche

### Dependencies da Installare
```bash
pnpm add lucide-react          # Icone
pnpm add clsx                  # Utility per className condizionali
pnpm add @headlessui/react     # Modal/Dialog accessibili
```

### Struttura Cartelle Proposta
```
src/
├── components/
│   ├── primitives/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Container.tsx
│   │   ├── Flex.tsx
│   │   ├── Stack.tsx
│   │   ├── Text.tsx
│   │   ├── Heading.tsx
│   │   ├── Icon.tsx
│   │   ├── Image.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Modal.tsx
│   │   └── Spinner.tsx
│   ├── card/
│   │   ├── CardImage.tsx
│   │   ├── CardBack.tsx
│   │   ├── CardOverlay.tsx
│   │   ├── CardBadge.tsx
│   │   ├── CardTooltip.tsx
│   │   ├── GameCard.tsx
│   │   └── MiniCard.tsx
│   ├── zones/
│   │   ├── ZoneCounter.tsx
│   │   ├── Hand.tsx
│   │   ├── DeckZone.tsx
│   │   ├── TrashZone.tsx
│   │   ├── GearZone.tsx
│   │   ├── PlayerBase.tsx
│   │   ├── LegendChampionZone.tsx
│   │   ├── RunePoolIcon.tsx
│   │   ├── RunePool.tsx
│   │   └── RuneZone.tsx
│   ├── battlefield/
│   │   ├── BattlefieldCard.tsx
│   │   ├── BattlefieldUnits.tsx
│   │   ├── BattlefieldZone.tsx
│   │   └── BattlefieldCenter.tsx
│   ├── game/
│   │   ├── PhaseIndicator.tsx
│   │   ├── TurnIndicator.tsx
│   │   ├── RoundCounter.tsx
│   │   ├── PriorityIndicator.tsx
│   │   ├── ScoreDisplay.tsx
│   │   ├── GameInfoPanel.tsx
│   │   ├── ChainStack.tsx
│   │   ├── PlayerInfo.tsx
│   │   └── ActionButton.tsx
│   ├── composite/
│   │   ├── PlayerZones.tsx
│   │   ├── PlayerArea.tsx
│   │   └── GameBoard.tsx
│   ├── modals/
│   │   ├── DeckViewerModal.tsx
│   │   ├── TrashViewerModal.tsx
│   │   └── ZoneViewerModal.tsx
│   └── views/
│       ├── HomePage.tsx
│       ├── LobbyView.tsx
│       └── GameView.tsx
├── hooks/
│   ├── useGame.ts
│   ├── useGameActions.ts
│   └── useCardInteraction.ts
└── utils/
    ├── cardHelpers.ts
    └── domainColors.ts
```

---

## Best Practices

1. **TypeScript Strict**: Tutti i componenti con interfacce props esplicite
2. **React.memo**: Per GameCard, BattlefieldZone (componenti pesanti)
3. **Composition**: Preferire composizione vs inheritance
4. **Props Drilling**: Evitare - usare context per game state se necessario
5. **Image Loading**: Lazy loading per carte fuori viewport
6. **CSS**: Tailwind utilities + custom classes in index.css
7. **Accessibility**: aria-labels, keyboard nav, focus management

---

## Conclusioni

Questa roadmap aggiornata riflette:
- Design realistico con immagini statiche + overlay
- Componenti specifici per Riftbound (RunePool, BattlefieldZone, etc.)
- Priorità corretta: Card rendering → Player zones → Battlefield → Board completo
- Sprint ben definiti con stime temporali

**Totale stimato Sprint 1-4:** ~15-18 ore per game board funzionante
