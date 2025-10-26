/**
 * GameAction System - Public API
 *
 * This module exports all public components of the V3 GameAction system:
 * - Base classes (GameAction, ActionModifier, ActionTrigger)
 * - Core infrastructure (ActionExecutor, Registries)
 * - Utility functions
 *
 * @module engine/actions
 */

// Base classes
export { GameAction, NullAction, generateActionId } from './base/GameAction';
export { ActionModifier, generateModifierId } from './base/ActionModifier';
export { ActionTrigger, generateTriggerId } from './base/ActionTrigger';

// Core infrastructure
export { ActionExecutor } from './ActionExecutor';
export { ModifierRegistry } from './ModifierRegistry';
export { TriggerRegistry } from './TriggerRegistry';

// Types are exported from types/actions.ts
export type {
  GameActionType,
  ActionValidationResult,
  ActionExecutionResult,
  ActionModifier as IActionModifier,
  ActionTrigger as IActionTrigger,
  CardTiming,
  TurnState,
  ModifierPriority,
  TriggerPriority,
  TimingLayer,
} from '../../types/actions';
