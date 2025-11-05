# CLI Changelog

## Version 0.2 - Enhanced Interactivity (2025-11-05)

### 🎯 New Features

#### 1. Interactive Targeting System
- When playing a spell or card that can target, the CLI now prompts for target selection
- Shows numbered list of available targets with their current state (damage/might)
- Option to cancel without playing the card
- Works both in normal play and on the chain

**Implementation:**
- `CLIInputHandler.selectTarget()` - Shows target list and gets user selection
- `CLIInputHandler.selectMultipleTargets()` - For cards that target multiple units
- `GameCLI.cardNeedsTarget()` - Determines if card requires targeting
- `GameCLI.getAvailableTargets()` - Finds valid targets for a card

#### 2. Interactive Chain Resolution
- When a card goes on the chain (stack), players are prompted to respond
- Each player can play spell/ability in response or pass
- Chain resolves automatically when all players pass consecutively
- Full targeting support for spells played on the chain

**Implementation:**
- `CLIInputHandler.promptForChainResponse()` - Asks if player wants to respond
- `GameCLI.handleChainResolution()` - Manages priority passing and chain resolution
- Integrates with existing `ChainSystem` from engine

#### 3. Detailed Combat Visualization
- Shows combat state when units engage
- Displays attackers vs defenders with total might
- Highlights keywords (ASSAULT, SHIELD, TANK) in color
- Shows automatic damage distribution with lethal damage indicators
- Clear combat flow visualization

**Implementation:**
- `CLIRenderer.renderCombatState()` - Renders combat participants and totals
- `CLIRenderer.renderDamageDistribution()` - Shows how damage is distributed
- `GameCLI.gameLoop()` - Checks for active combat and renders it

### 📝 Updated Files

**New Methods:**
- `src/cli/CLIInputHandler.ts`:
  - `selectTarget()` - Interactive target selection
  - `selectMultipleTargets()` - Select multiple targets
  - `promptForChainResponse()` - Ask if player wants to respond to chain
  - `distributeDamage()` - Manual damage distribution (for future use)
  - `confirm()` - Yes/no confirmation prompts

- `src/cli/CLIRenderer.ts`:
  - `renderCombatState()` - Display combat participants
  - `renderDamageDistribution()` - Display damage assignments

- `src/cli/GameCLI.ts`:
  - `cardNeedsTarget()` - Check if card can target
  - `getAvailableTargets()` - Get valid targets for card
  - `handleChainResolution()` - Manage interactive chain resolution
  - Updated `handlePlayCard()` - Integrated targeting
  - Updated `gameLoop()` - Added combat visualization

**Documentation:**
- `CLI-GUIDE.md` - Updated with new features, examples, and usage

**Bug Fixes:**
- Fixed import error in `src/engine/scripting/V3ScriptAPI.ts` (MoveCardAction → MoveUnitAction)

### 🎮 User Experience Improvements

**Before:**
- Cards played without targeting
- Chain resolved automatically without player input
- Combat happened "behind the scenes"

**After:**
- Interactive target selection with clear options
- Players can respond to spells/abilities on the chain
- Combat state clearly visible with color-coded participants
- Damage distribution shown step by step

### ⚠️ Known Limitations

These features are planned but not yet implemented:
- **Manual Damage Distribution** - Currently automatic (Tank first, lethal damage required)
- **Activated Abilities** - Can't activate abilities from battlefield/base yet
- **Showdown Interactivity** - Showdowns happen automatically

### 🚀 Next Steps

Potential improvements for v0.3:
1. Manual damage distribution during combat
2. Activated abilities from battlefield
3. Better error messages and help text
4. Command history (arrow up/down)
5. Auto-complete for commands
6. Undo last action

---

## Version 0.1 - Initial Release (2025-11-05)

### Features
- Basic hot-seat game loop
- 8 game phases (Awaken → Cleanup)
- Play cards from hand
- Move units to battlefield
- Pass priority/end turn
- Game state visualization
- Battlefield display
- Player info (score, energy, hand size)

### Commands
- `help` - Show commands
- `hand` - View hand
- `base` - View base
- `play <index>` - Play card
- `move <unit> <battlefield>` - Move unit
- `pass` - End phase/pass priority
- `quit` - Exit game

---

## Version History

- **v0.2** (2025-11-05) - Added targeting, chain resolution, combat visualization
- **v0.1** (2025-11-05) - Initial CLI implementation
