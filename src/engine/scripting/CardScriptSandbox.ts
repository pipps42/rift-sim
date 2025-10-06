/**
 * Card Script Sandbox
 *
 * Provides a secure, isolated execution environment for card scripts using isolated-vm.
 * Implements timeout protection, memory limits, and controlled API access.
 *
 * Architecture:
 * - Each script runs in a separate V8 isolate
 * - API access is mediated through context injection
 * - No access to Node.js globals, file system, or network
 * - Deterministic execution for replay consistency
 */

import ivm from 'isolated-vm';
import type {
  CardScript,
  CardContext,
  BattlefieldAPI,
  ChainAPI,
  RandomAPI,
  LogAPI,
  SafeGameState,
} from './types/CardScriptTypes';

// ============================================================================
// Configuration
// ============================================================================

export interface SandboxConfig {
  /** Maximum execution time in milliseconds */
  timeout: number;

  /** Memory limit in MB */
  memoryLimit: number;

  /** Enable debug logging */
  debug: boolean;

  /** Allow async operations */
  allowAsync: boolean;
}

export const DEFAULT_SANDBOX_CONFIG: SandboxConfig = {
  timeout: 1000, // 1 second
  memoryLimit: 128, // 128 MB
  debug: false,
  allowAsync: true,
};

// ============================================================================
// Sandbox Class
// ============================================================================

export class CardScriptSandbox {
  private isolate: ivm.Isolate;
  private context: ivm.Context;
  private config: SandboxConfig;
  private isInitialized: boolean = false;

  constructor(config: Partial<SandboxConfig> = {}) {
    this.config = { ...DEFAULT_SANDBOX_CONFIG, ...config };

    // Create isolated V8 instance with memory limit
    this.isolate = new ivm.Isolate({
      memoryLimit: this.config.memoryLimit,
    });

    // Create context within isolate
    this.context = this.isolate.createContextSync();

    this.log('Sandbox created', { config: this.config });
  }

  /**
   * Initialize sandbox with safe globals and utilities.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const jail = this.context.global;
    await jail.set('global', jail.derefInto());

    // Inject safe console for logging (filtered through LogAPI)
    await jail.set('_log', new ivm.Reference((level: string, message: string, data?: any) => {
      this.log(message, data, level as any);
    }));

    await this.context.eval(`
      globalThis.console = {
        log: (...args) => _log.applySync(undefined, ['info', args.join(' ')]),
        warn: (...args) => _log.applySync(undefined, ['warn', args.join(' ')]),
        error: (...args) => _log.applySync(undefined, ['error', args.join(' ')]),
        debug: (...args) => _log.applySync(undefined, ['debug', args.join(' ')]),
      };
    `);

    // Inject safe JSON (cannot clone native JSON object, recreate manually)
    await this.context.eval(`
      globalThis.JSON = {
        parse: JSON.parse.bind(JSON),
        stringify: JSON.stringify.bind(JSON)
      };
    `);

    // Inject safe Object/Array methods
    await this.context.eval(`
      globalThis.Object = {
        keys: Object.keys,
        values: Object.values,
        entries: Object.entries,
        assign: Object.assign,
      };
      globalThis.Array = {
        isArray: Array.isArray,
        from: Array.from,
      };
    `);

    this.isInitialized = true;
    this.log('Sandbox initialized');
  }

  /**
   * Execute a card script within the sandbox.
   *
   * Key Design: The script and its functions STAY inside the isolate.
   * We only pass data in/out, never clone functions.
   */
  async executeScript(
    scriptCode: string,
    context: CardContext,
    handlerName: keyof CardScript,
    args: any[] = []
  ): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Inject context APIs
      await this.injectContext(context);

      // Wrap script code to expose cardScript to global context
      // The script uses 'const cardScript = {...}' which creates a local variable
      // We wrap it to assign it to the global context
      const wrappedCode = `
        ${scriptCode}
        globalThis.cardScript = cardScript;
      `;

      // Compile and run wrapped script
      const script = await this.isolate.compileScript(wrappedCode);
      await script.run(this.context, { timeout: this.config.timeout });

      // Check if cardScript exists
      const cardScriptRef = await this.context.global.get('cardScript');
      if (!cardScriptRef) {
        throw new Error('Script must export a "cardScript" object');
      }

      // Check if handler exists (using eval to avoid copying)
      // We execute the check and call inside the isolate
      const handlerExists = await this.context.eval(
        `typeof cardScript["${handlerName}"] === 'function'`
      );

      if (!handlerExists) {
        // Handler not defined, return undefined
        cardScriptRef.release();
        return undefined;
      }

      // Execute handler INSIDE the isolate using eval
      let result;
      try {
        // Inject args into isolate
        for (let i = 0; i < args.length; i++) {
          await this.context.global.set(
            `_arg${i}`,
            new ivm.ExternalCopy(args[i]).copyInto()
          );
        }

        // Build args array string
        const argsStr = args.map((_, i) => `_arg${i}`).join(', ');

        // Execute handler and get result
        const resultRef = await this.context.eval(
          `cardScript["${handlerName}"](${argsStr})`,
          { timeout: this.config.timeout, promise: this.config.allowAsync, copy: true }
        );

        // Result is already copied due to copy: true option
        result = resultRef;

        // Clean up args
        for (let i = 0; i < args.length; i++) {
          await this.context.global.delete(`_arg${i}`);
        }
      } catch (evalError: any) {
        // Clean up args on error
        for (let i = 0; i < args.length; i++) {
          try {
            await this.context.global.delete(`_arg${i}`);
          } catch {}
        }

        cardScriptRef.release();

        // Check if it's a cloning error (result contains functions)
        if (evalError.message?.includes('could not be cloned')) {
          this.log('Handler returned non-clonable value (likely contains functions)', {}, 'debug');
          return undefined;
        } else {
          throw evalError;
        }
      }

      // Release references
      cardScriptRef.release();

      return result;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Inject CardContext APIs into the sandbox.
   */
  private async injectContext(context: CardContext): Promise<void> {
    const jail = this.context.global;

    // Inject read-only game state
    await jail.set(
      'gameState',
      new ivm.ExternalCopy(this.serializeGameState(context.game)).copyInto()
    );

    // Inject self card
    await jail.set(
      'self',
      new ivm.ExternalCopy(context.self).copyInto()
    );

    // Inject owner
    await jail.set(
      'owner',
      new ivm.ExternalCopy(context.owner).copyInto()
    );

    // Inject targets
    if (context.targets) {
      await jail.set(
        'targets',
        new ivm.ExternalCopy(context.targets).copyInto()
      );
    }

    // Inject event data
    if (context.eventData) {
      await jail.set(
        'eventData',
        new ivm.ExternalCopy(context.eventData).copyInto()
      );
    }

    // Inject Battlefield API
    await this.injectBattlefieldAPI(context.battlefield);

    // Inject Chain API
    await this.injectChainAPI(context.chain);

    // Inject Random API
    await this.injectRandomAPI(context.random);

    // Inject Log API
    await this.injectLogAPI(context.log);
  }

  /**
   * Inject Battlefield API methods.
   */
  private async injectBattlefieldAPI(api: BattlefieldAPI): Promise<void> {
    const jail = this.context.global;

    // Wrap each API method
    await jail.set('_bf_getEntity', new ivm.Reference((id: string) => {
      const entity = api.getEntity(id);
      return new ivm.ExternalCopy(entity).copyInto();
    }));

    await jail.set('_bf_getEntities', new ivm.Reference((filter?: any) => {
      const entities = api.getEntities(filter);
      return new ivm.ExternalCopy(entities).copyInto();
    }));

    await jail.set('_bf_dealDamage', new ivm.Reference((target: string, amount: number, source?: string) => {
      api.dealDamage(target, amount, source);
    }));

    await jail.set('_bf_heal', new ivm.Reference((target: string, amount: number) => {
      api.heal(target, amount);
    }));

    await jail.set('_bf_destroy', new ivm.Reference((target: string) => {
      api.destroy(target);
    }));

    await jail.set('_bf_move', new ivm.Reference((entity: string, position: any) => {
      api.move(entity, position);
    }));

    await jail.set('_bf_addStatus', new ivm.Reference((target: string, status: string, duration?: number) => {
      api.addStatus(target, status, duration);
    }));

    await jail.set('_bf_removeStatus', new ivm.Reference((target: string, status: string) => {
      api.removeStatus(target, status);
    }));

    await jail.set('_bf_modifyStats', new ivm.Reference((target: string, stats: any) => {
      api.modifyStats(target, stats);
    }));

    await jail.set('_bf_summon', new ivm.Reference((cardId: string, position: any, owner: string) => {
      api.summon(cardId, position, owner);
    }));

    await jail.set('_bf_transform', new ivm.Reference((entity: string, newCardId: string) => {
      api.transform(entity, newCardId);
    }));

    await jail.set('_bf_getEntitiesInArea', new ivm.Reference((area: any) => {
      const entities = api.getEntitiesInArea(area);
      return new ivm.ExternalCopy(entities).copyInto();
    }));

    // Create battlefield object in sandbox
    await this.context.eval(`
      globalThis.battlefield = {
        getEntity: (id) => _bf_getEntity.applySync(undefined, [id]),
        getEntities: (filter) => _bf_getEntities.applySync(undefined, [filter]),
        getEntitiesInArea: (area) => _bf_getEntitiesInArea.applySync(undefined, [area]),
        dealDamage: (target, amount, source) => _bf_dealDamage.applySync(undefined, [target, amount, source]),
        heal: (target, amount) => _bf_heal.applySync(undefined, [target, amount]),
        destroy: (target) => _bf_destroy.applySync(undefined, [target]),
        move: (entity, position) => _bf_move.applySync(undefined, [entity, position]),
        addStatus: (target, status, duration) => _bf_addStatus.applySync(undefined, [target, status, duration]),
        removeStatus: (target, status) => _bf_removeStatus.applySync(undefined, [target, status]),
        modifyStats: (target, stats) => _bf_modifyStats.applySync(undefined, [target, stats]),
        summon: (cardId, position, owner) => _bf_summon.applySync(undefined, [cardId, position, owner]),
        transform: (entity, newCardId) => _bf_transform.applySync(undefined, [entity, newCardId]),
      };
    `);
  }

  /**
   * Inject Chain API methods.
   */
  private async injectChainAPI(api: ChainAPI): Promise<void> {
    const jail = this.context.global;

    await jail.set('_chain_addEffect', new ivm.Reference((effect: any) => {
      api.addEffect(effect);
    }));

    await jail.set('_chain_counter', new ivm.Reference(() => {
      api.counter();
    }));

    await jail.set('_chain_getChainLength', new ivm.Reference(() => {
      return api.getChainLength();
    }));

    await jail.set('_chain_isEmpty', new ivm.Reference(() => {
      return api.isEmpty();
    }));

    await this.context.eval(`
      globalThis.chain = {
        addEffect: (effect) => _chain_addEffect.applySync(undefined, [effect]),
        counter: () => _chain_counter.applySync(undefined, []),
        getChainLength: () => _chain_getChainLength.applySync(undefined, []),
        isEmpty: () => _chain_isEmpty.applySync(undefined, []),
      };
    `);
  }

  /**
   * Inject Random API methods.
   */
  private async injectRandomAPI(api: RandomAPI): Promise<void> {
    const jail = this.context.global;

    await jail.set('_random_int', new ivm.Reference((min: number, max: number) => {
      return api.int(min, max);
    }));

    await jail.set('_random_float', new ivm.Reference(() => {
      return api.float();
    }));

    await jail.set('_random_pick', new ivm.Reference((array: any[]) => {
      return new ivm.ExternalCopy(api.pick(array)).copyInto();
    }));

    await jail.set('_random_shuffle', new ivm.Reference((array: any[]) => {
      return new ivm.ExternalCopy(api.shuffle(array)).copyInto();
    }));

    await jail.set('_random_chance', new ivm.Reference((probability: number) => {
      return api.chance(probability);
    }));

    await this.context.eval(`
      globalThis.random = {
        int: (min, max) => _random_int.applySync(undefined, [min, max]),
        float: () => _random_float.applySync(undefined, []),
        pick: (array) => _random_pick.applySync(undefined, [array]),
        shuffle: (array) => _random_shuffle.applySync(undefined, [array]),
        chance: (probability) => _random_chance.applySync(undefined, [probability]),
      };
    `);
  }

  /**
   * Inject Log API methods.
   */
  private async injectLogAPI(api: LogAPI): Promise<void> {
    const jail = this.context.global;

    await jail.set('_log_info', new ivm.Reference((message: string, data?: any) => {
      api.info(message, data);
    }));

    await jail.set('_log_warn', new ivm.Reference((message: string, data?: any) => {
      api.warn(message, data);
    }));

    await jail.set('_log_error', new ivm.Reference((message: string, data?: any) => {
      api.error(message, data);
    }));

    await jail.set('_log_debug', new ivm.Reference((message: string, data?: any) => {
      api.debug(message, data);
    }));

    await this.context.eval(`
      globalThis.log = {
        info: (message, data) => _log_info.applySync(undefined, [message, data]),
        warn: (message, data) => _log_warn.applySync(undefined, [message, data]),
        error: (message, data) => _log_error.applySync(undefined, [message, data]),
        debug: (message, data) => _log_debug.applySync(undefined, [message, data]),
      };
    `);
  }

  /**
   * Serialize game state for injection (remove circular references).
   */
  private serializeGameState(state: SafeGameState): any {
    return {
      turn: state.turn,
      phase: state.phase,
      activePlayer: state.activePlayer,
      players: state.players,
      battlefield: state.battlefield,
    };
  }

  /**
   * Handle execution errors.
   */
  private handleError(error: any): void {
    if (error.message?.includes('Script execution timed out')) {
      this.log('Script timeout exceeded', { timeout: this.config.timeout }, 'error');
    } else if (error.message?.includes('memory limit')) {
      this.log('Memory limit exceeded', { limit: this.config.memoryLimit }, 'error');
    } else {
      this.log('Script execution error', { error: error.message }, 'error');
    }
  }

  /**
   * Internal logging.
   */
  private log(message: string, data?: any, level: 'info' | 'warn' | 'error' | 'debug' = 'info'): void {
    if (!this.config.debug && level === 'debug') {
      return;
    }

    const prefix = '[CardScriptSandbox]';
    if (data) {
      console[level](`${prefix} ${message}`, data);
    } else {
      console[level](`${prefix} ${message}`);
    }
  }

  /**
   * Dispose of isolate and free resources.
   * Idempotent - safe to call multiple times.
   */
  dispose(): void {
    if (this.isolate.isDisposed) {
      return; // Already disposed
    }

    try {
      this.context.release();
    } catch (error) {
      // Context might already be released, ignore
    }

    try {
      this.isolate.dispose();
    } catch (error) {
      // Isolate might already be disposed, ignore
    }

    this.log('Sandbox disposed');
  }
}

// ============================================================================
// Sandbox Pool (for reuse)
// ============================================================================

export class SandboxPool {
  private pool: CardScriptSandbox[] = [];
  private config: Partial<SandboxConfig>;
  private maxSize: number;

  constructor(maxSize: number = 10, config: Partial<SandboxConfig> = {}) {
    this.maxSize = maxSize;
    this.config = config;
  }

  /**
   * Acquire a sandbox from the pool.
   */
  async acquire(): Promise<CardScriptSandbox> {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }

    const sandbox = new CardScriptSandbox(this.config);
    await sandbox.initialize();
    return sandbox;
  }

  /**
   * Release a sandbox back to the pool.
   */
  release(sandbox: CardScriptSandbox): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(sandbox);
    } else {
      sandbox.dispose();
    }
  }

  /**
   * Dispose all sandboxes in pool.
   */
  dispose(): void {
    for (const sandbox of this.pool) {
      sandbox.dispose();
    }
    this.pool = [];
  }
}
