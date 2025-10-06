/**
 * Battlefield API Implementation
 *
 * Provides card scripts with controlled access to battlefield operations.
 * All operations are queued and executed through the game engine.
 */

import type {
  BattlefieldAPI,
  EntityFilter,
  Area,
  Position,
  StatModification,
  SafeEntity,
} from '../types/CardScriptTypes';
import type { Game, GameCard, Battlefield } from '../../../types/game';

/**
 * Implementation of BattlefieldAPI that operates on game state.
 */
export class BattlefieldAPIImpl implements BattlefieldAPI {
  private game: Game;
  private pendingOperations: PendingOperation[] = [];

  constructor(game: Game) {
    this.game = game;
  }

  /**
   * Get entity by ID.
   */
  getEntity(entityId: string): SafeEntity | undefined {
    // Search all battlefields
    for (const battlefield of this.game.battlefields) {
      const unit = battlefield.units.find((u) => u.instanceId === entityId);
      if (unit) {
        return this.toSafeEntity(unit, battlefield);
      }
    }
    return undefined;
  }

  /**
   * Get all entities matching filter.
   */
  getEntities(filter?: EntityFilter): SafeEntity[] {
    const entities: SafeEntity[] = [];

    for (const battlefield of this.game.battlefields) {
      for (const unit of battlefield.units) {
        const safeEntity = this.toSafeEntity(unit, battlefield);
        if (!filter || this.matchesFilter(safeEntity, filter)) {
          entities.push(safeEntity);
        }
      }
    }

    return entities;
  }

  /**
   * Get entities in specific area.
   */
  getEntitiesInArea(area: Area): SafeEntity[] {
    // TODO: Implement area-based search when grid system is implemented
    console.warn('BattlefieldAPI.getEntitiesInArea not fully implemented');
    return [];
  }

  /**
   * Deal damage to target.
   */
  dealDamage(target: string | GameCard, amount: number, source?: string): void {
    const targetId = typeof target === 'string' ? target : target.instanceId;

    const op: DealDamageOp = {
      type: 'DEAL_DAMAGE',
      targetId,
      amount,
    };

    if (source !== undefined) {
      op.sourceId = source;
    }

    this.queueOperation(op);
  }

  /**
   * Heal target.
   */
  heal(target: string | GameCard, amount: number): void {
    const targetId = typeof target === 'string' ? target : target.instanceId;

    this.queueOperation({
      type: 'HEAL',
      targetId,
      amount,
    });
  }

  /**
   * Destroy entity.
   */
  destroy(target: string | GameCard): void {
    const targetId = typeof target === 'string' ? target : target.instanceId;

    this.queueOperation({
      type: 'DESTROY',
      targetId,
    });
  }

  /**
   * Move entity to position.
   */
  move(entity: string | GameCard, position: Position): void {
    const entityId = typeof entity === 'string' ? entity : entity.instanceId;

    this.queueOperation({
      type: 'MOVE',
      entityId,
      position,
    });
  }

  /**
   * Add status effect to entity.
   */
  addStatus(target: string | GameCard, status: string, duration?: number): void {
    const targetId = typeof target === 'string' ? target : target.instanceId;

    const op: AddStatusOp = {
      type: 'ADD_STATUS',
      targetId,
      status,
    };

    if (duration !== undefined) {
      op.duration = duration;
    }

    this.queueOperation(op);
  }

  /**
   * Remove status effect from entity.
   */
  removeStatus(target: string | GameCard, status: string): void {
    const targetId = typeof target === 'string' ? target : target.instanceId;

    this.queueOperation({
      type: 'REMOVE_STATUS',
      targetId,
      status,
    });
  }

  /**
   * Modify entity stats.
   */
  modifyStats(target: string | GameCard, stats: StatModification): void {
    const targetId = typeof target === 'string' ? target : target.instanceId;

    this.queueOperation({
      type: 'MODIFY_STATS',
      targetId,
      stats,
    });
  }

  /**
   * Summon new entity.
   */
  summon(cardId: string, position: Position, owner: string): void {
    this.queueOperation({
      type: 'SUMMON',
      cardId,
      position,
      ownerId: owner,
    });
  }

  /**
   * Transform entity into another card.
   */
  transform(entity: string | GameCard, newCardId: string): void {
    const entityId = typeof entity === 'string' ? entity : entity.instanceId;

    this.queueOperation({
      type: 'TRANSFORM',
      entityId,
      newCardId,
    });
  }

  /**
   * Get pending operations (for game engine to execute).
   */
  getPendingOperations(): PendingOperation[] {
    return [...this.pendingOperations];
  }

  /**
   * Clear pending operations.
   */
  clearPendingOperations(): void {
    this.pendingOperations = [];
  }

  /**
   * Queue an operation for later execution.
   */
  private queueOperation(operation: PendingOperation): void {
    this.pendingOperations.push(operation);
  }

  /**
   * Convert GameCard to SafeEntity.
   */
  private toSafeEntity(unit: GameCard, battlefield: Battlefield): SafeEntity {
    return {
      id: unit.instanceId,
      cardId: unit.cardId,
      name: 'Unit', // TODO: Get from card definition
      type: 'unit',
      owner: unit.ownerId,
      attack: 0, // TODO: Calculate from card + modifiers
      health: 0, // TODO: Calculate from card - damage
      maxHealth: 0, // TODO: Get from card definition
      position: { row: 0, col: 0 }, // TODO: Implement grid positioning
      status: [], // TODO: Extract from modifiers
      keywords: [], // TODO: Get from card definition
      canMove: unit.ready,
      canAttack: unit.ready,
      hasAttacked: false, // TODO: Track attack state
    };
  }

  /**
   * Check if entity matches filter.
   */
  private matchesFilter(entity: SafeEntity, filter: EntityFilter): boolean {
    if (filter.type && entity.type !== filter.type) {
      return false;
    }

    if (filter.owner) {
      // TODO: Implement owner filtering (need current player context)
    }

    if (filter.keywords) {
      const hasAllKeywords = filter.keywords.every((k) => entity.keywords.includes(k));
      if (!hasAllKeywords) {
        return false;
      }
    }

    if (filter.minAttack !== undefined && entity.attack < filter.minAttack) {
      return false;
    }

    if (filter.maxAttack !== undefined && entity.attack > filter.maxAttack) {
      return false;
    }

    if (filter.minHealth !== undefined && entity.health < filter.minHealth) {
      return false;
    }

    if (filter.maxHealth !== undefined && entity.health > filter.maxHealth) {
      return false;
    }

    if (filter.status) {
      const hasAllStatus = filter.status.every((s) => entity.status.includes(s));
      if (!hasAllStatus) {
        return false;
      }
    }

    if (filter.custom) {
      return filter.custom(entity);
    }

    return true;
  }
}

// ============================================================================
// Pending Operations
// ============================================================================

export type PendingOperation =
  | DealDamageOp
  | HealOp
  | DestroyOp
  | MoveOp
  | AddStatusOp
  | RemoveStatusOp
  | ModifyStatsOp
  | SummonOp
  | TransformOp;

interface DealDamageOp {
  type: 'DEAL_DAMAGE';
  targetId: string;
  amount: number;
  sourceId?: string;
}

interface HealOp {
  type: 'HEAL';
  targetId: string;
  amount: number;
}

interface DestroyOp {
  type: 'DESTROY';
  targetId: string;
}

interface MoveOp {
  type: 'MOVE';
  entityId: string;
  position: Position;
}

interface AddStatusOp {
  type: 'ADD_STATUS';
  targetId: string;
  status: string;
  duration?: number;
}

interface RemoveStatusOp {
  type: 'REMOVE_STATUS';
  targetId: string;
  status: string;
}

interface ModifyStatsOp {
  type: 'MODIFY_STATS';
  targetId: string;
  stats: StatModification;
}

interface SummonOp {
  type: 'SUMMON';
  cardId: string;
  position: Position;
  ownerId: string;
}

interface TransformOp {
  type: 'TRANSFORM';
  entityId: string;
  newCardId: string;
}
