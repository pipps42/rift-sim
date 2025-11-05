# Riftbound Simulator - CLI Game Guide

## Quick Start

```bash
npm run play
```

Questo avvierà un gioco interattivo da terminale in modalità **hot-seat** (controlli entrambi i giocatori).

## Come Funziona

### Setup Iniziale
1. Inserisci i nomi dei due giocatori
2. Il gioco viene inizializzato automaticamente con mazzi di test
3. Viene eseguito il mulligan automatico (4 carte per giocatore)

### Struttura del Turno

Il gioco segue le 8 fasi del turno di Riftbound:

1. **AWAKEN** - Automatica: ready di tutte le carte
2. **BEGINNING** - Automatica: scoring step (Hold)
3. **CHANNEL** - Automatica: channela 2 rune (attualmente da 3 energia temporanea)
4. **DRAW** - Automatica: pesca 1 carta
5. **ACTION** - Interattiva: puoi giocare carte e muovere unità
6. **ENDING** - Automatica: effetti end of turn
7. **EXPIRATION** - Automatica: rimuove danno, svuota rune pool
8. **CLEANUP** - Automatica: processDeaths e state-based actions

### Comandi Durante la Action Phase

Durante la fase ACTION, puoi inserire questi comandi:

#### Comandi Informativi
- `help` - Mostra la lista dei comandi disponibili
- `hand` - Visualizza le carte nella tua mano
- `base` - Visualizza le carte nella tua base
- `runes` - Visualizza le tue rune e il rune pool (energia e power)

#### Comandi di Gioco
- `play <index>` - Gioca una carta dalla mano
  - Esempio: `play 1` gioca la prima carta in mano
  - Paga automaticamente il costo in energia e power

- `move <unit_index> <battlefield_index>` - Muovi un'unità dalla base a un battlefield
  - Esempio: `move 1 1` muove la prima unità al primo battlefield
  - L'unità deve essere ready (non exhausted)

- `tap <rune_index>` - Tap una runa per generare 1 energia
  - Esempio: `tap 1` tappa la prima runa
  - La runa deve essere ready (non exhausted)
  - Genera +1 energia al rune pool

- `pass` - Termina la Action Phase e passa al turno successivo

- `quit` - Esci dal gioco

### Schermata di Gioco

La schermata mostra:
- **Header**: Turno corrente, giocatore attivo, fase, stato
- **Info Giocatori**: Nome, score, energy, power, rune (ready/total), dimensione mano, carte in base
  - Il giocatore attivo è contrassegnato da `►`
  - Esempio: `Energy: 3 | Power: 2F 1C | Runes: 2/4` (2 rune ready su 4 totali)
- **Battlefield Zone**: Tutti i battlefield con le unità presenti
  - Mostra il controller di ogni battlefield
  - Elenca le unità di ogni giocatore per battlefield
- **Chain**: Se attiva, mostra lo stack di spell/abilità

### Formato Carte

Le carte sono mostrate nel formato:
```
<Nome> [<Energia>E] <Danno>/<Might> <Ready>
```

Esempio:
```
Test Unit 1 [2E] 0/3 ✓    → Ready
Test Unit 2 [3E] 1/4 ✗    → Exhausted
```

## Esempio di Partita (con Rune System)

```
Turn 1 - Alice's turn
Phase: CHANNEL
State: NEUTRAL_OPEN

ℹ CHANNEL PHASE - Channeling 2 runes from Rune Deck...

ℹ Runes in deck: 12

✓ Channeled 2 runes!

Newly channeled runes:
  [1] Universal Rune 0 - universal
  [2] Universal Rune 1 - universal

Press Enter to continue...

Turn 1 - Alice's turn
Phase: ACTION
State: NEUTRAL_OPEN

► Alice | Score: 0/8 | Energy: 0 | Power: none | Runes: 2/2 | Hand: 5 | Base: 0
  Bob | Score: 0/8 | Energy: 0 | Power: none | Runes: 0/0 | Hand: 4 | Base: 0

═══════════════════════════════════════════════════════════════════════
BATTLEFIELD ZONE
═══════════════════════════════════════════════════════════════════════
[1] Battlefield 1 - Uncontrolled
    Empty

[2] Battlefield 2 - Uncontrolled
    Empty

Available Actions:
  help - Show available commands
  hand - View your hand
  base - View your base
  runes - View your runes
  play <index> - Play card from hand
  move <unit_index> <battlefield_index> - Move unit to battlefield
  tap <rune_index> - Tap rune for energy
  pass - End Action Phase

Action: runes

Your Runes:
Current Energy Pool: 0
Current Power Pool: none

Runes on Board:
  [1] Universal Rune 0 [U] - Ready
  [2] Universal Rune 1 [U] - Ready

Tip: Use "tap <index>" to tap a ready rune for +1 energy

Action: tap 1

✓ Tapped Universal Rune 0 for 1 energy! Current energy: 1

Action: tap 2

✓ Tapped Universal Rune 1 for 1 energy! Current energy: 2

Action: hand

Your Hand:
  [1] Test Unit 0 [2E] 0/2 ✗
  [2] Test Unit 1 [3E] 0/3 ✗
  [3] Test Unit 2 [4E] 0/4 ✗
  [4] Test Unit 3 [2E] 0/2 ✗
  [5] Test Unit 4 [3E] 0/3 ✗

Action: play 1

This card can target. Select target? (y/n): y

Select target for Test Spell:
  [1] Test Unit 0 0/3 (player-2)
  [2] Test Unit 1 0/4 (player-2)
  [0] Cancel
Target: 1

✓ Played Test Spell!

ℹ Chain is active! Players can respond...

Bob, respond to chain? (y/n): n
Alice, respond to chain? (y/n): n

ℹ All players passed - resolving chain...

✓ Chain resolved!

Action: pass

ℹ Passing - ending Action Phase...
```

## Funzionalità Implementate

### ✅ Completamente Funzionanti
- **Setup del gioco** - Inizializzazione con 2 giocatori, deck, battlefields
- **Flusso delle 8 fasi del turno** - Awaken → Beginning → Channel → Draw → Action → Ending → Expiration → Cleanup
- **Giocare carte dalla mano** - Con supporto per targeting
- **Muovere unità ai battlefield** - Standard move con validazione
- **Visualizzazione stato del gioco** - Battlefield, mani, chain, combat
- **Hot-seat** - Controllo di entrambi i giocatori

### ✨ Nuove Funzionalità (v0.2)
- **Targeting Interattivo** ⭐
  - Quando giochi una spell/carta che richiede target, la CLI ti chiede di selezionare
  - Mostra lista di target disponibili numerati
  - Puoi cancellare senza giocare la carta

- **Chain Resolution Interattiva** ⭐
  - Quando viene creata una chain, ogni giocatore può rispondere
  - Gioca spell/abilità in risposta
  - Targeting supportato anche sulla chain
  - La chain si risolve quando tutti passano

- **Visualizzazione Combat Dettagliata** ⭐
  - Mostra attaccanti vs difensori
  - Total Might per ogni lato
  - Keywords evidenziati (ASSAULT, SHIELD, TANK)
  - Damage distribution automatica secondo regole
  - Indica danno letale

### ✨ Nuove Funzionalità (v0.3)
- **Sistema Rune Completo** ⭐
  - Channeling automatico durante CHANNEL phase (2 rune, 3 per secondo giocatore al primo turno)
  - Visualizzazione rune channelate con domini
  - Comando `runes` per vedere rune pool e rune in gioco
  - Comando `tap <index>` per tappare rune e generare energia
  - Energy pool e Power pool gestiti correttamente
  - Ready/Exhaust state per le rune
  - Rune count nella schermata giocatori (ready/total)

### ⚠️ Non Ancora Implementato
- **Damage Distribution Manuale** - Per ora automatica (Tank first, lethal damage)
- **Scoring automatico** - Hold/Conquer non ancora collegati
- **Recycling Rune** - Recycle rune per generare power (al posto di tappare)
- **Showdowns** - Non gestiti interattivamente
- **Abilità attivate da battlefield** - Solo da mano
- **Burn Out** - Quando finisce il mazzo

### Workarounds Temporanei
- **Card Scripts**: Le carte di test non hanno script, quindi non eseguono effetti reali
- **Damage Distribution**: Automatica secondo regole (Tank → lethal damage → next unit)
- **Rune Recycling**: Solo tap per energia disponibile, recycling per power non implementato in CLI

## Testing della CLI

Per testare la CLI:

1. Avvia il gioco: `npm run play`
2. Inserisci nomi giocatori (o premi Enter per Alice/Bob)
3. Premi Enter per avanzare le fasi automatiche
4. Prova i comandi durante la Action Phase:
   - `hand` per vedere la mano
   - `play 1` per giocare una carta
   - `base` per vedere le unità in base
   - `move 1 1` per muovere un'unità (dopo che entra ready)
   - `pass` per passare
5. Continua finché un giocatore raggiunge 8 punti

## Prossimi Passi

1. **Implementare carte con script V3** - Aggiungere carte reali dal gioco
2. **Targeting system** - Permettere selezione target per spell
3. **Combat completo** - Attacker/defender, damage distribution
4. **Scoring system** - Hold e Conquer automatici
5. **Chain resolution** - Permettere giocare spell/abilità in risposta
6. **Keywords** - Assault, Shield, Ganking, etc.

## Troubleshooting

**Errore: "Script file not found"**
- Alcune carte nel gioco di test cercano script che non esistono
- Ignora questo warning - sono carte temporanee di test

**Errore: "moveCard not yet implemented"**
- Questa è un'action V3 non ancora implementata
- Non dovrebbe essere chiamata dalla CLI

**Il gioco si blocca**
- Premi Ctrl+C per uscire
- Riavvia con `npm run play`

## Debug

Per vedere i log dettagliati:
- Il GameManager logga tutte le operazioni
- I log appaiono tra i prompt della CLI
- Usa `console.log` per debugging custom

## Feedback

Se trovi bug o hai suggerimenti, annota:
- Cosa stavi facendo
- Comandi inseriti
- Errore visualizzato
