/**
 * Concrete Action Triggers
 *
 * This module exports all concrete trigger implementations.
 * Triggers listen for actions and generate new actions in response.
 */

export { OnDamageDealtTrigger } from './OnDamageDealtTrigger';
export type { OnDamageDealtTriggerConfig } from './OnDamageDealtTrigger';

export { OnCardPlayedTrigger } from './OnCardPlayedTrigger';
export type { OnCardPlayedTriggerConfig } from './OnCardPlayedTrigger';

export { OnUnitDeathTrigger } from './OnUnitDeathTrigger';
export type { OnUnitDeathTriggerConfig } from './OnUnitDeathTrigger';

export { OnUnitEnteredPlayTrigger } from './OnUnitEnteredPlayTrigger';
export type { OnUnitEnteredPlayTriggerConfig } from './OnUnitEnteredPlayTrigger';

export { OnScoringTrigger } from './OnScoringTrigger';
export type { OnScoringTriggerConfig, ScoringData, ScoringMethod } from './OnScoringTrigger';

export { OnPhaseChangeTrigger } from './OnPhaseChangeTrigger';
export type { OnPhaseChangeTriggerConfig, PhaseChangeData, PhaseTiming } from './OnPhaseChangeTrigger';

// New combat/gameplay triggers
export { OnCombatStartTrigger } from './OnCombatStartTrigger';
export type { OnCombatStartTriggerConfig, CombatStartData } from './OnCombatStartTrigger';

export { OnMoveCompleteTrigger } from './OnMoveCompleteTrigger';
export type { OnMoveCompleteTriggerConfig, MoveCompleteData } from './OnMoveCompleteTrigger';

export { OnStunnedTrigger } from './OnStunnedTrigger';
export type { OnStunnedTriggerConfig, StunnedData } from './OnStunnedTrigger';
