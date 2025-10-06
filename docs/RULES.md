# Riftbound - Regole Base (Formato 1v1)

## Introduzione

Riftbound è un Trading Card Game in cui i giocatori competono per controllare battlefield e accumulare punti. Il primo giocatore a raggiungere 8 punti vince la partita.

## Costruzione del Mazzo

Per giocare servono:

- **1 Champion Legend**: va nella Legend Zone, determina la Domain Identity del mazzo
- **Main Deck** (minimo 40 carte):
  - 1 Chosen Champion (un'unità champion con tag corrispondente alla Legend)
  - Unità, Gear e Spell
  - Massimo 3 copie per carta con lo stesso nome
  - Massimo 3 Signature cards totali (con tag del Champion)
- **Rune Deck** (esattamente 12 carte): deve rispettare la Domain Identity
- **3 Battlefields**: ne viene scelto 1 casualmente durante il setup

### Domain Identity

Le carte devono rispettare i domain della Champion Legend:
- Se una carta ha un solo domain, può stare in un deck con quel domain
- Se ha più domain, può stare solo in deck che contengono TUTTI quei domain

## Setup Iniziale

1. Ogni giocatore posiziona la Champion Legend nella Legend Zone
2. Ogni giocatore posiziona il Chosen Champion nella Champion Zone
3. Ogni giocatore sceglie casualmente 1 dei 3 Battlefield (gli altri 2 vengono rimossi)
4. I Battlefield scelti vengono posizionati nella Battlefield Zone
5. Shuffle dei Main Deck e Rune Deck, posizionamento nelle rispettive zone
6. Determinazione casuale del Turn Order (primo giocatore)
7. Ogni giocatore pesca 4 carte
8. Mulligan (in ordine di turno):
   - Si possono scartare fino a 2 carte
   - Si pescano tante carte quante scartate
   - Le carte scartate vengono riciclate (Recycle)
9. Il primo giocatore inizia il proprio turno

**Modifica primo turno**: Il secondo giocatore channela 1 runa extra durante la sua prima Channel Phase.

## Anatomia delle Carte

### Elementi Comuni

- **Cost** (angolo alto sinistra): Energy cost (numero) + Power cost (simboli domain)
- **Name**: nome univoco della carta
- **Domain**: simbolo/i nell'angolo basso destro
- **Rules Text**: abilità, istruzioni, keywords
- **Category**: Unit, Gear, Spell, Rune, Battlefield, Legend

### Unit

- **Tag**: rappresentano champion, regioni, fazioni o specie
- **Might** (valore di combattimento): determina il danno in combat e quando l'unità muore
- Entrano sul board exhauste (a meno di Accelerate)
- Possono muoversi tra location (Standard Move)
- Muoiono quando subiscono danno ≥ Might

### Gear

- Entrano sul board ready
- Possono essere giocati solo alla propria Base
- Se finiscono a un battlefield, vengono richiamati alla Base

### Spell

- Creano effetti quando giocati, poi vanno nel Trash
- Non rimangono sul board
- Possono avere keywords Action o Reaction che ne modificano il timing

### Rune

- Producono Energy e Power per pagare i costi
- **Basic Runes** hanno due abilità:
  - `[T]: Add [1]` (add 1 Energy)
  - `Recycle this: Add [C]` (add 1 Power del domain della runa)
- Non sono Main Deck cards (non sono Permanents)

## Zone di Gioco

### Board Zones

- **Base**: location personale di ogni giocatore, sempre controllata
- **Battlefield Zone**: contiene i battlefield in gioco
- **Facedown Zone**: ogni battlefield ha una zona facedown (max 1 carta) per carte Hidden
- **Legend Zone**: contiene la Champion Legend (non può essere mossa/rimossa)

### Non-Board Zones

- **Hand**: carte private del giocatore
- **Main Deck Zone**: deck principale face-down
- **Rune Deck Zone**: rune deck face-down
- **Champion Zone**: contiene il Chosen Champion all'inizio
- **Trash**: carte usate/distrutte (pubbliche, non ordinate)
- **Banishment**: carte rimosse temporaneamente o permanentemente (pubbliche, non ordinate)

**Importante**: Quando un Game Object cambia tra Board Zone e Non-Board Zone, perde tutte le modifiche temporanee (danni, buff, keywords temporanei, etc.)

## Struttura del Turno

### 1. Start of Turn

#### Awaken Phase
- Il Turn Player rende ready tutti i Game Objects che controlla

#### Beginning Phase
- **Beginning Step**: effetti "at the start"
- **Scoring Step**: si verifica Holding (vedi Scoring)
- **Channel Phase**: 
  - Il Turn Player channela 2 rune dal Rune Deck
  - Le rune entrano ready sul board alla Base
- **Draw Phase**: 
  - Il Turn Player pesca 1 carta
  - Se il Main Deck è vuoto, si verifica Burn Out
  - Alla fine, il Rune Pool si svuota

### 2. Action Phase

Fase aperta dove il Turn Player può compiere Discretionary Actions:
- Giocare carte
- Attivare abilità
- Muovere unità (Standard Move)
- Nascondere carte (Hide action con keyword Hidden)

La fase continua finché il giocatore non passa.

Durante l'Action Phase possono verificarsi:
- **Showdowns**: quando unità si muovono verso battlefield vuoti o contestati
- **Combat**: quando unità di giocatori opposti si trovano sullo stesso battlefield

### 3. End of Turn

#### Ending Step
- Effetti "at the end of turn"

#### Expiration Step
- Si rimuove tutto il danno dalle unità
- Tutti gli effetti "this turn" scadono
- Il Rune Pool si svuota

#### Cleanup Step
- Si esegue una Cleanup (vedi sezione Cleanup)
- Se ci sono nuovi effetti da risolvere, si ritorna all'Expiration Step

Poi passa il turno al giocatore successivo.

## Stati del Turno

Il turno è sempre in uno di questi 4 stati:

### Neutral vs Showdown
- **Neutral State**: non c'è showdown in corso
- **Showdown State**: showdown in corso (solo carte/abilità con Action/Reaction)

### Open vs Closed
- **Open State**: nessuna Chain attiva
- **Closed State**: esiste una Chain (solo carte/abilità con Reaction)

### Combinazioni
1. **Neutral Open**: default, si possono giocare carte normalmente (solo nel proprio turno)
2. **Neutral Closed**: Chain attiva fuori da showdown
3. **Showdown Open**: showdown senza chain
4. **Showdown Closed**: showdown con chain attiva

## Priority e Focus

### Priority
- Permesso di compiere Discretionary Actions
- Si ottiene:
  - Durante la propria Action Phase (Neutral Open)
  - Durante Showdown quando si ha Focus
  - Durante Closed State se si controlla il prossimo item sulla Chain
  - Durante Closed State se si è il prossimo Relevant Player dopo un pass

### Focus
- Permesso speciale durante Showdown Open
- Chi ha Focus ha anche Priority
- Passare Priority mantiene Focus
- Focus passa al prossimo Relevant Player quando si passa

## Chain e Risoluzione

### La Chain

La Chain è una zona temporanea che contiene spell e abilità in attesa di risoluzione. Funziona come uno stack (LIFO - Last In, First Out).

**Timing delle Carte:**
- **Default**: giocabili solo durante Neutral Open nel proprio turno
- **Action**: giocabili anche durante Showdowns
- **Reaction**: giocabili sempre (anche durante Closed State)

### Processo di Risoluzione

1. Una carta viene giocata o un'abilità attivata → si crea una Chain
2. Il giocatore attivo può:
   - Giocare spell con timing appropriato
   - Attivare abilità
   - Invitare un altro giocatore
   - Passare
3. Se tutti i Relevant Players passano in sequenza → la Chain si risolve
4. L'ultimo item aggiunto si risolve per primo
5. Dopo ogni risoluzione si esegue una Cleanup
6. Si ripete finché la Chain è vuota

**Nota sui Permanents**: quando si gioca un permanent (Unit/Gear), non si riceve priority prima della sua risoluzione.

### Triggered Abilities

Le Triggered Abilities ("When...", "At...") si aggiungono alla Chain quando la loro condizione è soddisfatta:
- Possono triggare durante Open o Closed State
- Si aggiungono come item più recente sulla Chain
- Se più abilità triggano simultaneamente, il controller sceglie l'ordine
- Se più giocatori hanno abilità triggered, si ordinano seguendo Turn Order

## Showdowns

### Quando Inizia uno Showdown

1. Quando unità si muovono a un battlefield vuoto non controllato (senza Combat)
2. Durante Combat (come sub-fase)

### Struttura

1. Si stabilisce chi ha Focus iniziale (chi ha applicato Contested status)
2. Si definiscono i Relevant Players
3. Se c'è Combat, si crea Initial Chain con trigger "When I attack"/"When I defend"
4. I giocatori possono giocare spell/attivare abilità con Action/Reaction a turno
5. Quando si risolve l'ultimo item su una chain, Focus passa
6. Continua finché tutti i Relevant Players passano in sequenza
7. Si esegue Cleanup finale

## Combat

### Quando Avviene

Combat si verifica quando, dopo una Cleanup durante Neutral Open State, ci sono unità di due giocatori opposti sullo stesso battlefield.

**Importante**: Combat può avvenire solo tra esattamente 2 giocatori.

### Steps del Combat

#### 1. Showdown Step
- Si stabiliscono Attacker (chi ha mosso le unità) e Defender
- Le unità attacking con Assault ottengono il bonus
- Le unità defending con Shield ottengono il bonus
- Si crea Initial Chain con trigger "When I attack"/"When I defend"
- Lo Showdown procede normalmente

#### 2. Combat Damage Step
- Si somma il Might di tutte le unità attacking
- Si somma il Might di tutte le unità defending
- A partire dall'Attacker, ogni giocatore distribuisce il danno tra le unità avversarie:
  - Unità con Tank devono ricevere danno letale prima delle altre
  - Ogni unità deve ricevere danno letale prima di passare alla successiva
  - Danno letale = danno ≥ Might dell'unità

#### 3. Resolution Step
- Si rimuovono unità con danno letale
- Se rimangono sia attacking che defending, le attacking vengono richiamate
- Se rimangono solo attacking → si verifica Conquer
- Si rimuove status Contested
- Si rimuove tutto il danno da tutte le unità

#### 4. Cleanup
Si esegue una Cleanup finale.

## Movement

### Standard Move

Ogni unità ha un'azione inherente di movimento:
- **Cost**: exhaustare l'unità
- **Quando**: durante Action Phase, fuori da Closed State e Showdown
- **Destinazioni permesse**:
  - Dalla Base a un Battlefield
  - Da un Battlefield alla Base
  - Con Ganking: da Battlefield a Battlefield

**Restrizione**: non si può muovere a battlefield con unità di altri 2 giocatori già presenti.

### Move da Spell/Abilità

Spell e abilità possono causare movement. Le stesse restrizioni si applicano.

### Dopo un Move

Quando un move è completo, si esegue una Cleanup. Questo può innescare:
- Showdown (se il battlefield diventa Contested mentre è vuoto)
- Combat (se il battlefield ha unità di 2 giocatori opposti)

## Rune Pool e Costi

### Rune Pool

Collezione concettuale di Energy e Power disponibili per pagare costi:
- **Energy**: numero generico, nessun domain
- **Power**: ha un domain specifico (o Universal)
- Si svuota alla fine della Draw Phase e alla fine del turno

### Pagare Costi

Per giocare una carta:
1. Si determina il Total Cost (base + addizionali + aumenti - sconti)
2. Si paga l'Energy cost e il Power cost
3. Si pagano eventuali costi non-standard (es. "kill a friendly unit")

**Add Reactions**: abilità che aggiungono risorse possono essere attivate durante il passo di pagamento costi.

## Scoring e Vittoria

### Metodi di Score

**Hold**: controllare un battlefield durante la propria Beginning Phase (Scoring Step)

**Conquer**: ottenere controllo di un battlefield che non si controllava durante la Beginning Phase

### Limiti
- Si può scorare ogni battlefield solo 1 volta per turno
- Non si può scorare lo stesso battlefield sia con Hold che con Conquer nello stesso turno

### Guadagnare Punti

Quando si scora, si guadagna 1 punto, TRANNE per il Final Point:

**Final Point** (quando si è a 7 punti):
- **Hold**: si guadagna il punto finale
- **Conquer**: 
  - Se si sono scorati TUTTI i battlefield questo turno → si guadagna il punto finale
  - Altrimenti → si pesca 1 carta invece di guadagnare il punto

### Vittoria

Quando un giocatore raggiunge 8 punti, vince immediatamente.

## Controllo dei Battlefield

- **Controllo**: stato binario, determinato dalla presenza di unità
- **Contested**: status temporaneo quando unità di un giocatore arrivano a battlefield controllato da avversario
- Si ottiene controllo se si hanno unità a un battlefield e l'avversario no
- Controllo cambia immediatamente dopo Combat se vincono unità diverse da prima

## Cleanup

Una Cleanup si esegue:
- Dopo risoluzione item su Chain
- Dopo un Move
- Dopo uno Showdown
- Dopo Combat

**Durante Cleanup:**
1. Unità con danno ≥ Might vengono killed
2. Si rimuove status Attacker/Defender da unità non più in Combat
3. Si attivano effetti state-based ("While...", "As long as...")
4. Si rimuovono carte Hidden da battlefield senza unità del controller
5. Si marca Combat come Pending dove necessario
6. Se Neutral Open e battlefield Contested senza controller → inizia Showdown
7. Se Neutral Open e Combat Pending → inizia Combat

## Azioni Principali

### Discretionary Actions
Azioni che il giocatore può scegliere liberamente durante Action Phase:
- **Play**: giocare carte
- **Standard Move**: muovere unità
- **Hide**: nascondere carte con Hidden
- **Attivare abilità**: delle carte sul board

### Limited Actions
Azioni eseguibili solo quando istruito:
- **Draw**: pescare carte
- **Discard**: scartare carte
- **Recycle**: mettere carte in fondo al deck
- **Channel**: mettere rune sul board dal Rune Deck
- **Exhaust/Ready**: exhaustare o rendere ready
- **Kill**: mandare permanent nel Trash
- **Stun**: stunnare unità (non contribuiscono danno in combat)
- **Buff**: aggiungere buff counter a unità
- **Banish**: mandare carte in Banishment
- **Reveal**: rivelare carte da zone private
- **Counter**: annullare spell/abilità sulla Chain
- **Add**: aggiungere Energy/Power al Rune Pool

## Burn Out

Se si cerca di pescare/guardare/scartare dal Main Deck quando è vuoto:
1. Si shuffla il Trash nel Main Deck
2. Si sceglie un avversario che guadagna 1 punto
3. Si esegue l'azione originale

Se anche il Trash è vuoto, Burn Out si ripete ogni volta causando point all'avversario.

## Keywords

Il gioco include vari keywords che sono shorthand per abilità specifiche. I keywords principali sono:

**Unit Keywords**: Accelerate, Assault, Deflect, Ganking, Shield, Tank, Temporary, Vision

**Spell/Ability Keywords**: Action, Reaction, Legion

**Permanent Keywords**: Deathknell, Hidden

I dettagli di ogni keyword sono documentati separatamente.

## Note Importanti

### Privacy delle Informazioni
- **Public**: tutti possono vedere (board, trash, banishment)
- **Private**: solo il controller (hand, facedown cards)
- **Secret**: nessuno può vedere (carte nei deck)

### Ownership vs Control
- **Owner**: chi ha portato la carta in gioco
- **Controller**: chi prende decisioni per il Game Object

### Relevant Players
Durante Chain e Showdown, solo i Relevant Players possono agire:
- Giocatori coinvolti in Combat corrente
- Giocatori invitati esplicitamente
- Altrimenti, tutti i giocatori (se non c'è Combat)

### Targeting
- Quando una carta "sceglie" Game Object specifici, quelli sono Targeted
- Se i target diventano illegali prima della risoluzione, l'istruzione non si esegue
- "Split damage" permette di dividere danno tra più target scelti al momento del play