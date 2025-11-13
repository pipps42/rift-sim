# Riftbound TCG - UI Design Specification

## Overview
Questo documento definisce le scelte di design dell'interfaccia utente per il frontend di Riftbound TCG.

---

## 1. Card Rendering System

### 1.1 Immagine Base
- **Formato**: WebP
- **Ogni carta** nel database deve avere un riferimento all'immagine (`imageUrl`)
- **Card Back**: Immagine speciale per carte non rivelate (opponent hand, decks)

### 1.2 Stati Visivi delle Carte

#### Ready (Pronta)
- Immagine a colori, verticale

#### Exhausted (Tappata)
- **Immagine desaturata** (grayscale/ridotta saturazione)
- **Tilt orizzontale** (rotazione 90°)
- Applica a: **TUTTE le tipologie di carte** (units, runes, gear, ecc.)

### 1.3 Visualizzazione Modifiche (Mutazioni)

#### Costo Modificato
- **Posizione**: Alto a sinistra (dove si trova il costo base)
- **Rendering**: Sovrimpressione del nuovo valore sull'immagine
- **Esempio**: Se costa 3E ma ridotto a 2E, mostrare "2" in sovrimpressione

#### Might Modificata (Unit)
- **Posizione**: Alto a destra (dove si trova la might base)
- **Rendering**: Sovrimpressione del nuovo valore sull'immagine
- **Esempio**: Se might 4 ma buffata a 6, mostrare "6" in sovrimpressione

#### Keywords Aggiunti/Rimossi
- **Posizione**: Badge alla **destra** della carta
- **Rendering**: Piccoli badge con icona/testo keyword
- **Esempio**: Badge "SHIELD" se aggiunto Shield keyword

### 1.4 Interattività - Hover & Tooltip

#### Hover Effect
- **Magnify**: Ingrandimento dell'immagine carta (zoom 1.2x-1.5x)
- **Z-index**: Porta la carta in primo piano

#### Tooltip Dettagliato
Mostra alterazioni temporanee con source:
```
┌─────────────────────────────────┐
│ Modifiche Attive:               │
│                                  │
│ • Cost -1E this turn             │
│   Source: [Mana Dork]            │
│                                  │
│ • +2 Might                       │
│   Source: [Battle Cry]           │
│                                  │
│ • Keyword: SHIELD                │
│   Source: [Divine Protection]    │
└─────────────────────────────────┘
```

---

## 2. Zone Layout & Organization

### 2.1 Layout Generale (Bottom → Top per Player)

```
┌──────────────────────────────────────────────────────────┐
│                     OPPONENT AREA                        │
├──────────────────────────────────────────────────────────┤
│ Hand (nascosta - card backs)                             │
│ [Deck] [Rune Deck] [Rune Zone + Pool] [Gear] [Trash]   │
│ [Legend] [Chosen Champion]                               │
│ Player Base: [Unit] [Unit] [Unit] ...                   │
├──────────────────────────────────────────────────────────┤
│                  BATTLEFIELD CENTER                      │
│ ┌─BF1──────────┐  ┌─BF2──────────┐  ┌─GAME INFO──────┐ │
│ │ Opp Units   │  │ Opp Units   │  │ Score: 3 - 5   │ │
│ │ [BF Card]   │  │ [BF Card]   │  │                 │ │
│ │ Plr Units   │  │ Plr Units   │  │ Phase: Action  │ │
│ └─────────────┘  └─────────────┘  │ Turn: 3        │ │
│                                    │ Round: 2       │ │
│                  CHAIN STACK       │                 │ │
│                  [Spell 1]         │ Priority: P1   │ │
│                  [Ability 2]       └────────────────┘ │
├──────────────────────────────────────────────────────────┤
│                      PLAYER AREA                         │
├──────────────────────────────────────────────────────────┤
│ Player Base: [Unit] [Unit] [Unit] ...                   │
│ [Legend] [Chosen Champion]                               │
│ [Deck] [Rune Deck] [Rune Zone + Pool] [Gear] [Trash]   │
│ Hand: [Card] [Card] [Card] [Card] [Card]               │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Zone Dettagliate (Player - dal basso verso l'alto)

#### 1. Hand (Mano)
- **Layout**: Orizzontale
- **Posizione**: Bottom dello schermo
- **Rendering**: Carte visibili (full image)
- **Interazione**: Click per giocare, drag-and-drop (futuro)

#### 2. Deck & Support Zones
**Ordine da sinistra a destra:**

1. **Rune Deck**
   - Card back + counter
   - Click → Modal grid (card back per carte nascoste, immagine reale per rivelate)

2. **Rune Zone**
   - **Layout**: Carte raggruppate per dominio
   - **Ready**: Verticale
   - **Exhausted**: Orizzontale/tilted + desaturata
   - **Overlap**: Parziale per risparmiare spazio
   - **Sopra la Rune Zone: Rune Pool UI**
     - Icone con contatori
     - ⚪ Cerchio bianco = Energy (es: ⚪ x5)
     - 🔴 Icona rossa = Fury power (es: 🔴 x2)
     - 🔵 Icona blu = Calm power
     - 🟣 Icona viola = Mind power
     - 🟢 Icona verde = Body power
     - 🟠 Icona arancione = Chaos power
     - 🟡 Icona gialla = Order power
     - ⚫ Icona grigia = Universal power

3. **Gear Zone**
   - **Layout**: Orizzontale (identico a Player Base)
   - **Contenuto**: Permanenti non-unit e non-rune (come artefatti MTG)
   - **Rendering**: Carte dritte (ready) o tilted (exhausted)

4. **Main Deck**
   - Card back + counter
   - Click → Modal grid (card back per nascoste, immagine per rivelate)

5. **Trash Zone**
   - **Rendering**: Immagine ultima carta aggiunta
   - Click → Modal grid con tutte le carte

#### 3. Legend & Champion Zone
- **Posizione**: Sopra deck zones, sotto player base
- **Layout**: Orizzontale, 2 carte affiancate
- **[Legend]** → **[Chosen Champion]**

**Comportamento:**
- **Legend**: Sempre visibile, non giocabile, solo effetti passivi/abilità
- **Chosen Champion**: Sempre visibile, **giocabile** come unit (può spostarsi in base/battlefield)

#### 4. Player Base
- **Layout**: Orizzontale
- **Contenuto**: Unit appena giocate o non su battlefield
- **Rendering**: Carte verticali (ready) o tilted (exhausted)

### 2.3 Battlefield Center

#### Layout Battlefield (x2)
Ogni battlefield è composto da:
```
┌─────────────────────┐
│  [Opp Unit] [Unit] │  ← Opponent units (sopra BF)
│                     │
│  [Battlefield Card] │  ← Carta battlefield (orizzontale)
│                     │
│  [Plr Unit] [Unit] │  ← Player units (sotto BF)
└─────────────────────┘
```

- **Battlefield Card**: Layout orizzontale al centro
- **Units sopra**: Appartengono all'opponent
- **Units sotto**: Appartengono al player

#### Chain Stack
- **Posizione**: Area centrale (tra i 2 battlefields o a lato)
- **Layout**: Verticale (stack dal basso verso l'alto)
- **Rendering**: Mini card preview
- **Contenuto**: Spell/abilità in chain, ordine di risoluzione

#### Game Info Panel
- **Posizione**: Centro-sinistra o centro-destra dello schermo
- **Contenuto**:
  - **Score**: Player 1 vs Player 2 (es: "3 - 5")
  - **Phase**: Fase corrente (es: "Action Phase")
  - **Turn**: Numero turno (es: "Turn 3")
  - **Round**: Numero round (es: "Round 2")
  - **Priority**: Chi ha la priorità (es: "Priority: Player 1")

---

## 3. Modali Zone Viewer

### 3.1 Deck Viewer Modal
**Trigger**: Click su main deck

**Contenuto**:
- Griglia di card backs per carte nascoste
- Immagini reali per carte rivelate (es: top/bottom deck se rivelate da effetto)

### 3.2 Rune Deck Viewer Modal
**Trigger**: Click su rune deck

**Contenuto**: Identico a Deck Viewer

### 3.3 Trash Viewer Modal
**Trigger**: Click su trash zone

**Contenuto**:
- Griglia di tutte le carte nella trash
- Tutte visibili (full image)
- Ordine cronologico (più recente in alto/in fondo)

### 3.4 Gear Zone Viewer Modal (opzionale)
Se le carte in Gear Zone sono troppe per il layout, click → modal grid

### 3.5 Player Base Viewer Modal (opzionale)
Se le unit in base sono troppe, click → modal grid

---

## 4. Visual Design System

### 4.1 Card Dimensions

#### Standard Card (in-game)
- **Aspect Ratio**: 5:7
- **Size**: ~200x280px (desktop), scalabile per tablet/mobile

#### Mini Card (deck list, modals, chain stack)
- **Aspect Ratio**: 5:7
- **Size**: ~80x112px

#### Magnified Card (hover)
- **Scale**: 1.2x-1.5x della card standard

### 4.2 Card States Visual

| State       | Saturation | Rotation | Border/Glow        |
|-------------|------------|----------|--------------------|
| Ready       | 100%       | 0° (vert)| Normal             |
| Exhausted   | 30-50%     | 90° (hor)| None               |
| Playable    | 100%       | 0°       | Green glow         |
| Targeted    | 100%       | 0°       | Blue glow          |
| Selected    | 100%       | 0°       | Yellow/gold border |
| Hovered     | 110%       | 0°       | Slight elevation   |

### 4.3 Domain Colors (già in tailwind.config.js)
- **Fury**: `#ef4444` (Rosso)
- **Calm**: `#3b82f6` (Blu)
- **Mind**: `#8b5cf6` (Viola)
- **Body**: `#10b981` (Verde)
- **Chaos**: `#f97316` (Arancione)
- **Order**: `#eab308` (Giallo)
- **Universal**: `#6b7280` (Grigio)

### 4.4 Rune Pool Icons
Usare icone colorate per i domini:
- Energy: ⚪ Cerchio bianco (o icona custom)
- Fury: 🔥 o 🔴
- Calm: 💧 o 🔵
- Mind: 🧠 o 🟣
- Body: 💪 o 🟢
- Chaos: ⚡ o 🟠
- Order: ⚖️ o 🟡
- Universal: ⭐ o ⚫

---

## 5. Interazioni Utente

### 5.1 Click Actions

| Element           | Click Action                                  |
|-------------------|-----------------------------------------------|
| Card in Hand      | Seleziona per giocare (mostra targets se serve)|
| Unit in Play      | Seleziona per azione (move, attack, ability)  |
| Deck              | Apri Deck Viewer Modal                        |
| Rune Deck         | Apri Rune Deck Viewer Modal                   |
| Trash             | Apri Trash Viewer Modal                       |
| Battlefield       | Seleziona per move unit (se azione attiva)    |
| Legend            | Mostra abilità disponibili                    |
| Chosen Champion   | Seleziona per giocare (se in mano/zone)       |

### 5.2 Hover Actions
- **Card**: Magnify + tooltip con modifiche
- **Zone**: Highlight per indicare interactivity
- **Button**: Visual feedback (elevation, color change)

### 5.3 Drag-and-Drop (Fase 2)
- **Hand → Battlefield/Base**: Gioca carta
- **Unit → Battlefield**: Move unit tra battlefield

---

## 6. Responsive Design

### 6.1 Breakpoints
- **Desktop**: `>= 1280px` - Full layout come descritto
- **Tablet**: `768px - 1279px` - Scaling + scroll zone laterali
- **Mobile**: `< 768px` - Stacked layout, zone collapsibili

### 6.2 Mobile Adaptations
- Hand: Scrollabile orizzontalmente
- Battlefield: Vista singola con tab switch
- Zone: Collassabili con header tap-to-expand
- Modals: Full-screen invece di centered

---

## 7. Accessibility

### 7.1 Keyboard Navigation
- **Tab**: Naviga tra elementi interattivi
- **Enter/Space**: Seleziona/attiva elemento
- **Arrow keys**: Naviga in griglia/hand
- **Escape**: Chiudi modal/deseleziona

### 7.2 Screen Reader Support
- Tutte le carte con `aria-label` descrittivo
- Zone con `aria-labelledby`
- Modals con `role="dialog"`

### 7.3 Color Contrast
- Testo sempre con contrast ratio >= 4.5:1
- Badge/icone con outline per visibilità

---

## 8. Performance Considerations

### 8.1 Image Loading
- **Lazy loading** per carte fuori viewport
- **Preload** per hand e battlefield visibili
- **WebP** con fallback PNG/JPG

### 8.2 Rendering Optimization
- **React.memo** per card components
- **Virtualization** per modal grid se >50 carte
- **CSS transforms** per exhausted rotation (hardware-accelerated)

### 8.3 Animation Budget
- Massimo 60fps
- Smooth transitions per card play/move (max 300ms)
- Ridurre motion se `prefers-reduced-motion`

---

## 9. Future Enhancements

### 9.1 Animations
- Card play: Slide from hand → destination
- Damage: Shake + red flash
- Draw: Slide from deck → hand
- Death: Fade out → trash

### 9.2 Sound Effects
- Card play
- Attack/damage
- Draw card
- Phase change

### 9.3 Visual Effects
- Particle effects per spell cast
- Glow pulse per playable cards
- Battlefield contested indicator (pulsing border)

---

## 10. Component Architecture Summary

### Primitive Components
1. **CardImage** - Render immagine carta con stati (ready/exhausted)
2. **CardBadge** - Badge per modifiche/keywords
3. **CardTooltip** - Tooltip dettagliato modifiche
4. **ZoneCounter** - Counter per deck/trash

### Domain Components
1. **GameCard** - Carta completa con overlay modifiche
2. **RunePool** - UI pool con icone + contatori
3. **RuneZone** - Grid di rune raggruppate per domain
4. **PlayerBase** - Layout orizzontale units
5. **GearZone** - Layout orizzontale gear
6. **BattlefieldZone** - BF card + units sopra/sotto
7. **ChainStack** - Stack verticale spell/abilities
8. **GameInfoPanel** - Score, phase, turn, round, priority

### Composite Components
1. **PlayerArea** - Area completa giocatore (hand, zones, base, legend)
2. **BattlefieldCenter** - 2 battlefields + game info
3. **GameBoard** - Board completo

### Modals
1. **DeckViewerModal** - Grid deck con card back/revealed
2. **TrashViewerModal** - Grid trash

---

## Conclusioni

Questo design specification definisce un'interfaccia:
- **Chiara**: Ogni zona ha scopo e posizione definiti
- **Informativa**: Modifiche visibili con tooltips dettagliati
- **Performante**: Immagini WebP, lazy loading, React.memo
- **Accessibile**: Keyboard nav, screen readers, high contrast
- **Scalabile**: Layout responsive per desktop/tablet/mobile

Il focus è su **semplicità** (immagini statiche + overlay) e **chiarezza** (zone ben separate, feedback visivo immediato).
