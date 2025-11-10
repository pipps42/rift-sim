
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model CardDefinition
 * 
 */
export type CardDefinition = $Result.DefaultSelection<Prisma.$CardDefinitionPayload>
/**
 * Model Deck
 * 
 */
export type Deck = $Result.DefaultSelection<Prisma.$DeckPayload>
/**
 * Model MainDeckCard
 * 
 */
export type MainDeckCard = $Result.DefaultSelection<Prisma.$MainDeckCardPayload>
/**
 * Model RuneDeckCard
 * 
 */
export type RuneDeckCard = $Result.DefaultSelection<Prisma.$RuneDeckCardPayload>
/**
 * Model Match
 * 
 */
export type Match = $Result.DefaultSelection<Prisma.$MatchPayload>
/**
 * Model MatchEvent
 * 
 */
export type MatchEvent = $Result.DefaultSelection<Prisma.$MatchEventPayload>
/**
 * Model GameSession
 * 
 */
export type GameSession = $Result.DefaultSelection<Prisma.$GameSessionPayload>
/**
 * Model UserCollection
 * 
 */
export type UserCollection = $Result.DefaultSelection<Prisma.$UserCollectionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const CardType: {
  UNIT: 'UNIT',
  CHAMPION: 'CHAMPION',
  GEAR: 'GEAR',
  SPELL: 'SPELL',
  RUNE: 'RUNE',
  LEGEND: 'LEGEND',
  BATTLEFIELD: 'BATTLEFIELD',
  SIGNATURE: 'SIGNATURE',
  TOKEN: 'TOKEN'
};

export type CardType = (typeof CardType)[keyof typeof CardType]


export const Rarity: {
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  MYTHIC: 'MYTHIC'
};

export type Rarity = (typeof Rarity)[keyof typeof Rarity]


export const MatchStatus: {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ABANDONED: 'ABANDONED'
};

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus]

}

export type CardType = $Enums.CardType

export const CardType: typeof $Enums.CardType

export type Rarity = $Enums.Rarity

export const Rarity: typeof $Enums.Rarity

export type MatchStatus = $Enums.MatchStatus

export const MatchStatus: typeof $Enums.MatchStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cardDefinition`: Exposes CRUD operations for the **CardDefinition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CardDefinitions
    * const cardDefinitions = await prisma.cardDefinition.findMany()
    * ```
    */
  get cardDefinition(): Prisma.CardDefinitionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deck`: Exposes CRUD operations for the **Deck** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Decks
    * const decks = await prisma.deck.findMany()
    * ```
    */
  get deck(): Prisma.DeckDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mainDeckCard`: Exposes CRUD operations for the **MainDeckCard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MainDeckCards
    * const mainDeckCards = await prisma.mainDeckCard.findMany()
    * ```
    */
  get mainDeckCard(): Prisma.MainDeckCardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.runeDeckCard`: Exposes CRUD operations for the **RuneDeckCard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RuneDeckCards
    * const runeDeckCards = await prisma.runeDeckCard.findMany()
    * ```
    */
  get runeDeckCard(): Prisma.RuneDeckCardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.match`: Exposes CRUD operations for the **Match** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matches
    * const matches = await prisma.match.findMany()
    * ```
    */
  get match(): Prisma.MatchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matchEvent`: Exposes CRUD operations for the **MatchEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MatchEvents
    * const matchEvents = await prisma.matchEvent.findMany()
    * ```
    */
  get matchEvent(): Prisma.MatchEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameSession`: Exposes CRUD operations for the **GameSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameSessions
    * const gameSessions = await prisma.gameSession.findMany()
    * ```
    */
  get gameSession(): Prisma.GameSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userCollection`: Exposes CRUD operations for the **UserCollection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserCollections
    * const userCollections = await prisma.userCollection.findMany()
    * ```
    */
  get userCollection(): Prisma.UserCollectionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    CardDefinition: 'CardDefinition',
    Deck: 'Deck',
    MainDeckCard: 'MainDeckCard',
    RuneDeckCard: 'RuneDeckCard',
    Match: 'Match',
    MatchEvent: 'MatchEvent',
    GameSession: 'GameSession',
    UserCollection: 'UserCollection'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "cardDefinition" | "deck" | "mainDeckCard" | "runeDeckCard" | "match" | "matchEvent" | "gameSession" | "userCollection"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      CardDefinition: {
        payload: Prisma.$CardDefinitionPayload<ExtArgs>
        fields: Prisma.CardDefinitionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CardDefinitionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CardDefinitionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>
          }
          findFirst: {
            args: Prisma.CardDefinitionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CardDefinitionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>
          }
          findMany: {
            args: Prisma.CardDefinitionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>[]
          }
          create: {
            args: Prisma.CardDefinitionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>
          }
          createMany: {
            args: Prisma.CardDefinitionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CardDefinitionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>[]
          }
          delete: {
            args: Prisma.CardDefinitionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>
          }
          update: {
            args: Prisma.CardDefinitionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>
          }
          deleteMany: {
            args: Prisma.CardDefinitionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CardDefinitionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CardDefinitionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>[]
          }
          upsert: {
            args: Prisma.CardDefinitionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardDefinitionPayload>
          }
          aggregate: {
            args: Prisma.CardDefinitionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCardDefinition>
          }
          groupBy: {
            args: Prisma.CardDefinitionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CardDefinitionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CardDefinitionCountArgs<ExtArgs>
            result: $Utils.Optional<CardDefinitionCountAggregateOutputType> | number
          }
        }
      }
      Deck: {
        payload: Prisma.$DeckPayload<ExtArgs>
        fields: Prisma.DeckFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeckFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeckFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>
          }
          findFirst: {
            args: Prisma.DeckFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeckFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>
          }
          findMany: {
            args: Prisma.DeckFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>[]
          }
          create: {
            args: Prisma.DeckCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>
          }
          createMany: {
            args: Prisma.DeckCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeckCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>[]
          }
          delete: {
            args: Prisma.DeckDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>
          }
          update: {
            args: Prisma.DeckUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>
          }
          deleteMany: {
            args: Prisma.DeckDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeckUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeckUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>[]
          }
          upsert: {
            args: Prisma.DeckUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckPayload>
          }
          aggregate: {
            args: Prisma.DeckAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeck>
          }
          groupBy: {
            args: Prisma.DeckGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeckGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeckCountArgs<ExtArgs>
            result: $Utils.Optional<DeckCountAggregateOutputType> | number
          }
        }
      }
      MainDeckCard: {
        payload: Prisma.$MainDeckCardPayload<ExtArgs>
        fields: Prisma.MainDeckCardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MainDeckCardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MainDeckCardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>
          }
          findFirst: {
            args: Prisma.MainDeckCardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MainDeckCardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>
          }
          findMany: {
            args: Prisma.MainDeckCardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>[]
          }
          create: {
            args: Prisma.MainDeckCardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>
          }
          createMany: {
            args: Prisma.MainDeckCardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MainDeckCardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>[]
          }
          delete: {
            args: Prisma.MainDeckCardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>
          }
          update: {
            args: Prisma.MainDeckCardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>
          }
          deleteMany: {
            args: Prisma.MainDeckCardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MainDeckCardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MainDeckCardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>[]
          }
          upsert: {
            args: Prisma.MainDeckCardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MainDeckCardPayload>
          }
          aggregate: {
            args: Prisma.MainDeckCardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMainDeckCard>
          }
          groupBy: {
            args: Prisma.MainDeckCardGroupByArgs<ExtArgs>
            result: $Utils.Optional<MainDeckCardGroupByOutputType>[]
          }
          count: {
            args: Prisma.MainDeckCardCountArgs<ExtArgs>
            result: $Utils.Optional<MainDeckCardCountAggregateOutputType> | number
          }
        }
      }
      RuneDeckCard: {
        payload: Prisma.$RuneDeckCardPayload<ExtArgs>
        fields: Prisma.RuneDeckCardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RuneDeckCardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RuneDeckCardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>
          }
          findFirst: {
            args: Prisma.RuneDeckCardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RuneDeckCardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>
          }
          findMany: {
            args: Prisma.RuneDeckCardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>[]
          }
          create: {
            args: Prisma.RuneDeckCardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>
          }
          createMany: {
            args: Prisma.RuneDeckCardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RuneDeckCardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>[]
          }
          delete: {
            args: Prisma.RuneDeckCardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>
          }
          update: {
            args: Prisma.RuneDeckCardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>
          }
          deleteMany: {
            args: Prisma.RuneDeckCardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RuneDeckCardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RuneDeckCardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>[]
          }
          upsert: {
            args: Prisma.RuneDeckCardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RuneDeckCardPayload>
          }
          aggregate: {
            args: Prisma.RuneDeckCardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRuneDeckCard>
          }
          groupBy: {
            args: Prisma.RuneDeckCardGroupByArgs<ExtArgs>
            result: $Utils.Optional<RuneDeckCardGroupByOutputType>[]
          }
          count: {
            args: Prisma.RuneDeckCardCountArgs<ExtArgs>
            result: $Utils.Optional<RuneDeckCardCountAggregateOutputType> | number
          }
        }
      }
      Match: {
        payload: Prisma.$MatchPayload<ExtArgs>
        fields: Prisma.MatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findFirst: {
            args: Prisma.MatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findMany: {
            args: Prisma.MatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          create: {
            args: Prisma.MatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          createMany: {
            args: Prisma.MatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          delete: {
            args: Prisma.MatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          update: {
            args: Prisma.MatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          deleteMany: {
            args: Prisma.MatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          upsert: {
            args: Prisma.MatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          aggregate: {
            args: Prisma.MatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatch>
          }
          groupBy: {
            args: Prisma.MatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCountAggregateOutputType> | number
          }
        }
      }
      MatchEvent: {
        payload: Prisma.$MatchEventPayload<ExtArgs>
        fields: Prisma.MatchEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>
          }
          findFirst: {
            args: Prisma.MatchEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>
          }
          findMany: {
            args: Prisma.MatchEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>[]
          }
          create: {
            args: Prisma.MatchEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>
          }
          createMany: {
            args: Prisma.MatchEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>[]
          }
          delete: {
            args: Prisma.MatchEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>
          }
          update: {
            args: Prisma.MatchEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>
          }
          deleteMany: {
            args: Prisma.MatchEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>[]
          }
          upsert: {
            args: Prisma.MatchEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchEventPayload>
          }
          aggregate: {
            args: Prisma.MatchEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatchEvent>
          }
          groupBy: {
            args: Prisma.MatchEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchEventCountArgs<ExtArgs>
            result: $Utils.Optional<MatchEventCountAggregateOutputType> | number
          }
        }
      }
      GameSession: {
        payload: Prisma.$GameSessionPayload<ExtArgs>
        fields: Prisma.GameSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          findFirst: {
            args: Prisma.GameSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          findMany: {
            args: Prisma.GameSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          create: {
            args: Prisma.GameSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          createMany: {
            args: Prisma.GameSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          delete: {
            args: Prisma.GameSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          update: {
            args: Prisma.GameSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          deleteMany: {
            args: Prisma.GameSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          upsert: {
            args: Prisma.GameSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          aggregate: {
            args: Prisma.GameSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameSession>
          }
          groupBy: {
            args: Prisma.GameSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameSessionCountArgs<ExtArgs>
            result: $Utils.Optional<GameSessionCountAggregateOutputType> | number
          }
        }
      }
      UserCollection: {
        payload: Prisma.$UserCollectionPayload<ExtArgs>
        fields: Prisma.UserCollectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserCollectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserCollectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>
          }
          findFirst: {
            args: Prisma.UserCollectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserCollectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>
          }
          findMany: {
            args: Prisma.UserCollectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>[]
          }
          create: {
            args: Prisma.UserCollectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>
          }
          createMany: {
            args: Prisma.UserCollectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCollectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>[]
          }
          delete: {
            args: Prisma.UserCollectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>
          }
          update: {
            args: Prisma.UserCollectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>
          }
          deleteMany: {
            args: Prisma.UserCollectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserCollectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserCollectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>[]
          }
          upsert: {
            args: Prisma.UserCollectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCollectionPayload>
          }
          aggregate: {
            args: Prisma.UserCollectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserCollection>
          }
          groupBy: {
            args: Prisma.UserCollectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserCollectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCollectionCountArgs<ExtArgs>
            result: $Utils.Optional<UserCollectionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    cardDefinition?: CardDefinitionOmit
    deck?: DeckOmit
    mainDeckCard?: MainDeckCardOmit
    runeDeckCard?: RuneDeckCardOmit
    match?: MatchOmit
    matchEvent?: MatchEventOmit
    gameSession?: GameSessionOmit
    userCollection?: UserCollectionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    decks: number
    gamesAsPlayer1: number
    gamesAsPlayer2: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    decks?: boolean | UserCountOutputTypeCountDecksArgs
    gamesAsPlayer1?: boolean | UserCountOutputTypeCountGamesAsPlayer1Args
    gamesAsPlayer2?: boolean | UserCountOutputTypeCountGamesAsPlayer2Args
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDecksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeckWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGamesAsPlayer1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGamesAsPlayer2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }


  /**
   * Count Type CardDefinitionCountOutputType
   */

  export type CardDefinitionCountOutputType = {
    decksAsLegend: number
    decksAsChampion: number
    decksAsBattlefield: number
    mainDeckCards: number
    runeDeckCards: number
  }

  export type CardDefinitionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    decksAsLegend?: boolean | CardDefinitionCountOutputTypeCountDecksAsLegendArgs
    decksAsChampion?: boolean | CardDefinitionCountOutputTypeCountDecksAsChampionArgs
    decksAsBattlefield?: boolean | CardDefinitionCountOutputTypeCountDecksAsBattlefieldArgs
    mainDeckCards?: boolean | CardDefinitionCountOutputTypeCountMainDeckCardsArgs
    runeDeckCards?: boolean | CardDefinitionCountOutputTypeCountRuneDeckCardsArgs
  }

  // Custom InputTypes
  /**
   * CardDefinitionCountOutputType without action
   */
  export type CardDefinitionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinitionCountOutputType
     */
    select?: CardDefinitionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CardDefinitionCountOutputType without action
   */
  export type CardDefinitionCountOutputTypeCountDecksAsLegendArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeckWhereInput
  }

  /**
   * CardDefinitionCountOutputType without action
   */
  export type CardDefinitionCountOutputTypeCountDecksAsChampionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeckWhereInput
  }

  /**
   * CardDefinitionCountOutputType without action
   */
  export type CardDefinitionCountOutputTypeCountDecksAsBattlefieldArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeckWhereInput
  }

  /**
   * CardDefinitionCountOutputType without action
   */
  export type CardDefinitionCountOutputTypeCountMainDeckCardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MainDeckCardWhereInput
  }

  /**
   * CardDefinitionCountOutputType without action
   */
  export type CardDefinitionCountOutputTypeCountRuneDeckCardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RuneDeckCardWhereInput
  }


  /**
   * Count Type DeckCountOutputType
   */

  export type DeckCountOutputType = {
    mainDeck: number
    runeDeck: number
  }

  export type DeckCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mainDeck?: boolean | DeckCountOutputTypeCountMainDeckArgs
    runeDeck?: boolean | DeckCountOutputTypeCountRuneDeckArgs
  }

  // Custom InputTypes
  /**
   * DeckCountOutputType without action
   */
  export type DeckCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckCountOutputType
     */
    select?: DeckCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DeckCountOutputType without action
   */
  export type DeckCountOutputTypeCountMainDeckArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MainDeckCardWhereInput
  }

  /**
   * DeckCountOutputType without action
   */
  export type DeckCountOutputTypeCountRuneDeckArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RuneDeckCardWhereInput
  }


  /**
   * Count Type MatchCountOutputType
   */

  export type MatchCountOutputType = {
    events: number
  }

  export type MatchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | MatchCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCountOutputType
     */
    select?: MatchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    gamesPlayed: number | null
    gamesWon: number | null
    rating: number | null
  }

  export type UserSumAggregateOutputType = {
    gamesPlayed: number | null
    gamesWon: number | null
    rating: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    displayName: string | null
    avatarUrl: string | null
    gamesPlayed: number | null
    gamesWon: number | null
    rating: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    displayName: string | null
    avatarUrl: string | null
    gamesPlayed: number | null
    gamesWon: number | null
    rating: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    passwordHash: number
    displayName: number
    avatarUrl: number
    gamesPlayed: number
    gamesWon: number
    rating: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    gamesPlayed?: true
    gamesWon?: true
    rating?: true
  }

  export type UserSumAggregateInputType = {
    gamesPlayed?: true
    gamesWon?: true
    rating?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    displayName?: true
    avatarUrl?: true
    gamesPlayed?: true
    gamesWon?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    displayName?: true
    avatarUrl?: true
    gamesPlayed?: true
    gamesWon?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    displayName?: true
    avatarUrl?: true
    gamesPlayed?: true
    gamesWon?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    passwordHash: string
    displayName: string | null
    avatarUrl: string | null
    gamesPlayed: number
    gamesWon: number
    rating: number
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    displayName?: boolean
    avatarUrl?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    decks?: boolean | User$decksArgs<ExtArgs>
    gamesAsPlayer1?: boolean | User$gamesAsPlayer1Args<ExtArgs>
    gamesAsPlayer2?: boolean | User$gamesAsPlayer2Args<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    displayName?: boolean
    avatarUrl?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    displayName?: boolean
    avatarUrl?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    displayName?: boolean
    avatarUrl?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "passwordHash" | "displayName" | "avatarUrl" | "gamesPlayed" | "gamesWon" | "rating" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    decks?: boolean | User$decksArgs<ExtArgs>
    gamesAsPlayer1?: boolean | User$gamesAsPlayer1Args<ExtArgs>
    gamesAsPlayer2?: boolean | User$gamesAsPlayer2Args<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      decks: Prisma.$DeckPayload<ExtArgs>[]
      gamesAsPlayer1: Prisma.$MatchPayload<ExtArgs>[]
      gamesAsPlayer2: Prisma.$MatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      passwordHash: string
      displayName: string | null
      avatarUrl: string | null
      gamesPlayed: number
      gamesWon: number
      rating: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    decks<T extends User$decksArgs<ExtArgs> = {}>(args?: Subset<T, User$decksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gamesAsPlayer1<T extends User$gamesAsPlayer1Args<ExtArgs> = {}>(args?: Subset<T, User$gamesAsPlayer1Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gamesAsPlayer2<T extends User$gamesAsPlayer2Args<ExtArgs> = {}>(args?: Subset<T, User$gamesAsPlayer2Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly displayName: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly gamesPlayed: FieldRef<"User", 'Int'>
    readonly gamesWon: FieldRef<"User", 'Int'>
    readonly rating: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.decks
   */
  export type User$decksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    where?: DeckWhereInput
    orderBy?: DeckOrderByWithRelationInput | DeckOrderByWithRelationInput[]
    cursor?: DeckWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeckScalarFieldEnum | DeckScalarFieldEnum[]
  }

  /**
   * User.gamesAsPlayer1
   */
  export type User$gamesAsPlayer1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * User.gamesAsPlayer2
   */
  export type User$gamesAsPlayer2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model CardDefinition
   */

  export type AggregateCardDefinition = {
    _count: CardDefinitionCountAggregateOutputType | null
    _avg: CardDefinitionAvgAggregateOutputType | null
    _sum: CardDefinitionSumAggregateOutputType | null
    _min: CardDefinitionMinAggregateOutputType | null
    _max: CardDefinitionMaxAggregateOutputType | null
  }

  export type CardDefinitionAvgAggregateOutputType = {
    energyCost: number | null
    might: number | null
  }

  export type CardDefinitionSumAggregateOutputType = {
    energyCost: number | null
    might: number | null
  }

  export type CardDefinitionMinAggregateOutputType = {
    id: string | null
    name: string | null
    cardType: $Enums.CardType | null
    rarity: $Enums.Rarity | null
    energyCost: number | null
    description: string | null
    flavorText: string | null
    might: number | null
    scriptPath: string | null
    hasScript: boolean | null
    imageUrl: string | null
    artist: string | null
    cardNumber: string | null
    setCode: string | null
    setName: string | null
    isSignature: boolean | null
    isBasicRune: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CardDefinitionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    cardType: $Enums.CardType | null
    rarity: $Enums.Rarity | null
    energyCost: number | null
    description: string | null
    flavorText: string | null
    might: number | null
    scriptPath: string | null
    hasScript: boolean | null
    imageUrl: string | null
    artist: string | null
    cardNumber: string | null
    setCode: string | null
    setName: string | null
    isSignature: boolean | null
    isBasicRune: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CardDefinitionCountAggregateOutputType = {
    id: number
    name: number
    cardType: number
    rarity: number
    energyCost: number
    powerCosts: number
    description: number
    flavorText: number
    might: number
    subtypes: number
    domains: number
    keywords: number
    tags: number
    scriptPath: number
    hasScript: number
    imageUrl: number
    artist: number
    cardNumber: number
    setCode: number
    setName: number
    isSignature: number
    isBasicRune: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CardDefinitionAvgAggregateInputType = {
    energyCost?: true
    might?: true
  }

  export type CardDefinitionSumAggregateInputType = {
    energyCost?: true
    might?: true
  }

  export type CardDefinitionMinAggregateInputType = {
    id?: true
    name?: true
    cardType?: true
    rarity?: true
    energyCost?: true
    description?: true
    flavorText?: true
    might?: true
    scriptPath?: true
    hasScript?: true
    imageUrl?: true
    artist?: true
    cardNumber?: true
    setCode?: true
    setName?: true
    isSignature?: true
    isBasicRune?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CardDefinitionMaxAggregateInputType = {
    id?: true
    name?: true
    cardType?: true
    rarity?: true
    energyCost?: true
    description?: true
    flavorText?: true
    might?: true
    scriptPath?: true
    hasScript?: true
    imageUrl?: true
    artist?: true
    cardNumber?: true
    setCode?: true
    setName?: true
    isSignature?: true
    isBasicRune?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CardDefinitionCountAggregateInputType = {
    id?: true
    name?: true
    cardType?: true
    rarity?: true
    energyCost?: true
    powerCosts?: true
    description?: true
    flavorText?: true
    might?: true
    subtypes?: true
    domains?: true
    keywords?: true
    tags?: true
    scriptPath?: true
    hasScript?: true
    imageUrl?: true
    artist?: true
    cardNumber?: true
    setCode?: true
    setName?: true
    isSignature?: true
    isBasicRune?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CardDefinitionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CardDefinition to aggregate.
     */
    where?: CardDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardDefinitions to fetch.
     */
    orderBy?: CardDefinitionOrderByWithRelationInput | CardDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CardDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CardDefinitions
    **/
    _count?: true | CardDefinitionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CardDefinitionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CardDefinitionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CardDefinitionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CardDefinitionMaxAggregateInputType
  }

  export type GetCardDefinitionAggregateType<T extends CardDefinitionAggregateArgs> = {
        [P in keyof T & keyof AggregateCardDefinition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCardDefinition[P]>
      : GetScalarType<T[P], AggregateCardDefinition[P]>
  }




  export type CardDefinitionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CardDefinitionWhereInput
    orderBy?: CardDefinitionOrderByWithAggregationInput | CardDefinitionOrderByWithAggregationInput[]
    by: CardDefinitionScalarFieldEnum[] | CardDefinitionScalarFieldEnum
    having?: CardDefinitionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CardDefinitionCountAggregateInputType | true
    _avg?: CardDefinitionAvgAggregateInputType
    _sum?: CardDefinitionSumAggregateInputType
    _min?: CardDefinitionMinAggregateInputType
    _max?: CardDefinitionMaxAggregateInputType
  }

  export type CardDefinitionGroupByOutputType = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts: JsonValue
    description: string
    flavorText: string | null
    might: number | null
    subtypes: JsonValue
    domains: JsonValue
    keywords: JsonValue
    tags: JsonValue
    scriptPath: string | null
    hasScript: boolean
    imageUrl: string | null
    artist: string | null
    cardNumber: string | null
    setCode: string | null
    setName: string | null
    isSignature: boolean
    isBasicRune: boolean
    createdAt: Date
    updatedAt: Date
    _count: CardDefinitionCountAggregateOutputType | null
    _avg: CardDefinitionAvgAggregateOutputType | null
    _sum: CardDefinitionSumAggregateOutputType | null
    _min: CardDefinitionMinAggregateOutputType | null
    _max: CardDefinitionMaxAggregateOutputType | null
  }

  type GetCardDefinitionGroupByPayload<T extends CardDefinitionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CardDefinitionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CardDefinitionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CardDefinitionGroupByOutputType[P]>
            : GetScalarType<T[P], CardDefinitionGroupByOutputType[P]>
        }
      >
    >


  export type CardDefinitionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    cardType?: boolean
    rarity?: boolean
    energyCost?: boolean
    powerCosts?: boolean
    description?: boolean
    flavorText?: boolean
    might?: boolean
    subtypes?: boolean
    domains?: boolean
    keywords?: boolean
    tags?: boolean
    scriptPath?: boolean
    hasScript?: boolean
    imageUrl?: boolean
    artist?: boolean
    cardNumber?: boolean
    setCode?: boolean
    setName?: boolean
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    decksAsLegend?: boolean | CardDefinition$decksAsLegendArgs<ExtArgs>
    decksAsChampion?: boolean | CardDefinition$decksAsChampionArgs<ExtArgs>
    decksAsBattlefield?: boolean | CardDefinition$decksAsBattlefieldArgs<ExtArgs>
    mainDeckCards?: boolean | CardDefinition$mainDeckCardsArgs<ExtArgs>
    runeDeckCards?: boolean | CardDefinition$runeDeckCardsArgs<ExtArgs>
    _count?: boolean | CardDefinitionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cardDefinition"]>

  export type CardDefinitionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    cardType?: boolean
    rarity?: boolean
    energyCost?: boolean
    powerCosts?: boolean
    description?: boolean
    flavorText?: boolean
    might?: boolean
    subtypes?: boolean
    domains?: boolean
    keywords?: boolean
    tags?: boolean
    scriptPath?: boolean
    hasScript?: boolean
    imageUrl?: boolean
    artist?: boolean
    cardNumber?: boolean
    setCode?: boolean
    setName?: boolean
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cardDefinition"]>

  export type CardDefinitionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    cardType?: boolean
    rarity?: boolean
    energyCost?: boolean
    powerCosts?: boolean
    description?: boolean
    flavorText?: boolean
    might?: boolean
    subtypes?: boolean
    domains?: boolean
    keywords?: boolean
    tags?: boolean
    scriptPath?: boolean
    hasScript?: boolean
    imageUrl?: boolean
    artist?: boolean
    cardNumber?: boolean
    setCode?: boolean
    setName?: boolean
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cardDefinition"]>

  export type CardDefinitionSelectScalar = {
    id?: boolean
    name?: boolean
    cardType?: boolean
    rarity?: boolean
    energyCost?: boolean
    powerCosts?: boolean
    description?: boolean
    flavorText?: boolean
    might?: boolean
    subtypes?: boolean
    domains?: boolean
    keywords?: boolean
    tags?: boolean
    scriptPath?: boolean
    hasScript?: boolean
    imageUrl?: boolean
    artist?: boolean
    cardNumber?: boolean
    setCode?: boolean
    setName?: boolean
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CardDefinitionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "cardType" | "rarity" | "energyCost" | "powerCosts" | "description" | "flavorText" | "might" | "subtypes" | "domains" | "keywords" | "tags" | "scriptPath" | "hasScript" | "imageUrl" | "artist" | "cardNumber" | "setCode" | "setName" | "isSignature" | "isBasicRune" | "createdAt" | "updatedAt", ExtArgs["result"]["cardDefinition"]>
  export type CardDefinitionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    decksAsLegend?: boolean | CardDefinition$decksAsLegendArgs<ExtArgs>
    decksAsChampion?: boolean | CardDefinition$decksAsChampionArgs<ExtArgs>
    decksAsBattlefield?: boolean | CardDefinition$decksAsBattlefieldArgs<ExtArgs>
    mainDeckCards?: boolean | CardDefinition$mainDeckCardsArgs<ExtArgs>
    runeDeckCards?: boolean | CardDefinition$runeDeckCardsArgs<ExtArgs>
    _count?: boolean | CardDefinitionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CardDefinitionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CardDefinitionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CardDefinitionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CardDefinition"
    objects: {
      decksAsLegend: Prisma.$DeckPayload<ExtArgs>[]
      decksAsChampion: Prisma.$DeckPayload<ExtArgs>[]
      decksAsBattlefield: Prisma.$DeckPayload<ExtArgs>[]
      mainDeckCards: Prisma.$MainDeckCardPayload<ExtArgs>[]
      runeDeckCards: Prisma.$RuneDeckCardPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      cardType: $Enums.CardType
      rarity: $Enums.Rarity
      energyCost: number
      powerCosts: Prisma.JsonValue
      description: string
      flavorText: string | null
      might: number | null
      subtypes: Prisma.JsonValue
      domains: Prisma.JsonValue
      keywords: Prisma.JsonValue
      tags: Prisma.JsonValue
      scriptPath: string | null
      hasScript: boolean
      imageUrl: string | null
      artist: string | null
      cardNumber: string | null
      setCode: string | null
      setName: string | null
      isSignature: boolean
      isBasicRune: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cardDefinition"]>
    composites: {}
  }

  type CardDefinitionGetPayload<S extends boolean | null | undefined | CardDefinitionDefaultArgs> = $Result.GetResult<Prisma.$CardDefinitionPayload, S>

  type CardDefinitionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CardDefinitionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CardDefinitionCountAggregateInputType | true
    }

  export interface CardDefinitionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CardDefinition'], meta: { name: 'CardDefinition' } }
    /**
     * Find zero or one CardDefinition that matches the filter.
     * @param {CardDefinitionFindUniqueArgs} args - Arguments to find a CardDefinition
     * @example
     * // Get one CardDefinition
     * const cardDefinition = await prisma.cardDefinition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CardDefinitionFindUniqueArgs>(args: SelectSubset<T, CardDefinitionFindUniqueArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CardDefinition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CardDefinitionFindUniqueOrThrowArgs} args - Arguments to find a CardDefinition
     * @example
     * // Get one CardDefinition
     * const cardDefinition = await prisma.cardDefinition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CardDefinitionFindUniqueOrThrowArgs>(args: SelectSubset<T, CardDefinitionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CardDefinition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardDefinitionFindFirstArgs} args - Arguments to find a CardDefinition
     * @example
     * // Get one CardDefinition
     * const cardDefinition = await prisma.cardDefinition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CardDefinitionFindFirstArgs>(args?: SelectSubset<T, CardDefinitionFindFirstArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CardDefinition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardDefinitionFindFirstOrThrowArgs} args - Arguments to find a CardDefinition
     * @example
     * // Get one CardDefinition
     * const cardDefinition = await prisma.cardDefinition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CardDefinitionFindFirstOrThrowArgs>(args?: SelectSubset<T, CardDefinitionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CardDefinitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardDefinitionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CardDefinitions
     * const cardDefinitions = await prisma.cardDefinition.findMany()
     * 
     * // Get first 10 CardDefinitions
     * const cardDefinitions = await prisma.cardDefinition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cardDefinitionWithIdOnly = await prisma.cardDefinition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CardDefinitionFindManyArgs>(args?: SelectSubset<T, CardDefinitionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CardDefinition.
     * @param {CardDefinitionCreateArgs} args - Arguments to create a CardDefinition.
     * @example
     * // Create one CardDefinition
     * const CardDefinition = await prisma.cardDefinition.create({
     *   data: {
     *     // ... data to create a CardDefinition
     *   }
     * })
     * 
     */
    create<T extends CardDefinitionCreateArgs>(args: SelectSubset<T, CardDefinitionCreateArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CardDefinitions.
     * @param {CardDefinitionCreateManyArgs} args - Arguments to create many CardDefinitions.
     * @example
     * // Create many CardDefinitions
     * const cardDefinition = await prisma.cardDefinition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CardDefinitionCreateManyArgs>(args?: SelectSubset<T, CardDefinitionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CardDefinitions and returns the data saved in the database.
     * @param {CardDefinitionCreateManyAndReturnArgs} args - Arguments to create many CardDefinitions.
     * @example
     * // Create many CardDefinitions
     * const cardDefinition = await prisma.cardDefinition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CardDefinitions and only return the `id`
     * const cardDefinitionWithIdOnly = await prisma.cardDefinition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CardDefinitionCreateManyAndReturnArgs>(args?: SelectSubset<T, CardDefinitionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CardDefinition.
     * @param {CardDefinitionDeleteArgs} args - Arguments to delete one CardDefinition.
     * @example
     * // Delete one CardDefinition
     * const CardDefinition = await prisma.cardDefinition.delete({
     *   where: {
     *     // ... filter to delete one CardDefinition
     *   }
     * })
     * 
     */
    delete<T extends CardDefinitionDeleteArgs>(args: SelectSubset<T, CardDefinitionDeleteArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CardDefinition.
     * @param {CardDefinitionUpdateArgs} args - Arguments to update one CardDefinition.
     * @example
     * // Update one CardDefinition
     * const cardDefinition = await prisma.cardDefinition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CardDefinitionUpdateArgs>(args: SelectSubset<T, CardDefinitionUpdateArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CardDefinitions.
     * @param {CardDefinitionDeleteManyArgs} args - Arguments to filter CardDefinitions to delete.
     * @example
     * // Delete a few CardDefinitions
     * const { count } = await prisma.cardDefinition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CardDefinitionDeleteManyArgs>(args?: SelectSubset<T, CardDefinitionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CardDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardDefinitionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CardDefinitions
     * const cardDefinition = await prisma.cardDefinition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CardDefinitionUpdateManyArgs>(args: SelectSubset<T, CardDefinitionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CardDefinitions and returns the data updated in the database.
     * @param {CardDefinitionUpdateManyAndReturnArgs} args - Arguments to update many CardDefinitions.
     * @example
     * // Update many CardDefinitions
     * const cardDefinition = await prisma.cardDefinition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CardDefinitions and only return the `id`
     * const cardDefinitionWithIdOnly = await prisma.cardDefinition.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CardDefinitionUpdateManyAndReturnArgs>(args: SelectSubset<T, CardDefinitionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CardDefinition.
     * @param {CardDefinitionUpsertArgs} args - Arguments to update or create a CardDefinition.
     * @example
     * // Update or create a CardDefinition
     * const cardDefinition = await prisma.cardDefinition.upsert({
     *   create: {
     *     // ... data to create a CardDefinition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CardDefinition we want to update
     *   }
     * })
     */
    upsert<T extends CardDefinitionUpsertArgs>(args: SelectSubset<T, CardDefinitionUpsertArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CardDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardDefinitionCountArgs} args - Arguments to filter CardDefinitions to count.
     * @example
     * // Count the number of CardDefinitions
     * const count = await prisma.cardDefinition.count({
     *   where: {
     *     // ... the filter for the CardDefinitions we want to count
     *   }
     * })
    **/
    count<T extends CardDefinitionCountArgs>(
      args?: Subset<T, CardDefinitionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CardDefinitionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CardDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardDefinitionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CardDefinitionAggregateArgs>(args: Subset<T, CardDefinitionAggregateArgs>): Prisma.PrismaPromise<GetCardDefinitionAggregateType<T>>

    /**
     * Group by CardDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardDefinitionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CardDefinitionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CardDefinitionGroupByArgs['orderBy'] }
        : { orderBy?: CardDefinitionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CardDefinitionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCardDefinitionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CardDefinition model
   */
  readonly fields: CardDefinitionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CardDefinition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CardDefinitionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    decksAsLegend<T extends CardDefinition$decksAsLegendArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinition$decksAsLegendArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    decksAsChampion<T extends CardDefinition$decksAsChampionArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinition$decksAsChampionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    decksAsBattlefield<T extends CardDefinition$decksAsBattlefieldArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinition$decksAsBattlefieldArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    mainDeckCards<T extends CardDefinition$mainDeckCardsArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinition$mainDeckCardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    runeDeckCards<T extends CardDefinition$runeDeckCardsArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinition$runeDeckCardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CardDefinition model
   */
  interface CardDefinitionFieldRefs {
    readonly id: FieldRef<"CardDefinition", 'String'>
    readonly name: FieldRef<"CardDefinition", 'String'>
    readonly cardType: FieldRef<"CardDefinition", 'CardType'>
    readonly rarity: FieldRef<"CardDefinition", 'Rarity'>
    readonly energyCost: FieldRef<"CardDefinition", 'Int'>
    readonly powerCosts: FieldRef<"CardDefinition", 'Json'>
    readonly description: FieldRef<"CardDefinition", 'String'>
    readonly flavorText: FieldRef<"CardDefinition", 'String'>
    readonly might: FieldRef<"CardDefinition", 'Int'>
    readonly subtypes: FieldRef<"CardDefinition", 'Json'>
    readonly domains: FieldRef<"CardDefinition", 'Json'>
    readonly keywords: FieldRef<"CardDefinition", 'Json'>
    readonly tags: FieldRef<"CardDefinition", 'Json'>
    readonly scriptPath: FieldRef<"CardDefinition", 'String'>
    readonly hasScript: FieldRef<"CardDefinition", 'Boolean'>
    readonly imageUrl: FieldRef<"CardDefinition", 'String'>
    readonly artist: FieldRef<"CardDefinition", 'String'>
    readonly cardNumber: FieldRef<"CardDefinition", 'String'>
    readonly setCode: FieldRef<"CardDefinition", 'String'>
    readonly setName: FieldRef<"CardDefinition", 'String'>
    readonly isSignature: FieldRef<"CardDefinition", 'Boolean'>
    readonly isBasicRune: FieldRef<"CardDefinition", 'Boolean'>
    readonly createdAt: FieldRef<"CardDefinition", 'DateTime'>
    readonly updatedAt: FieldRef<"CardDefinition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CardDefinition findUnique
   */
  export type CardDefinitionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which CardDefinition to fetch.
     */
    where: CardDefinitionWhereUniqueInput
  }

  /**
   * CardDefinition findUniqueOrThrow
   */
  export type CardDefinitionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which CardDefinition to fetch.
     */
    where: CardDefinitionWhereUniqueInput
  }

  /**
   * CardDefinition findFirst
   */
  export type CardDefinitionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which CardDefinition to fetch.
     */
    where?: CardDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardDefinitions to fetch.
     */
    orderBy?: CardDefinitionOrderByWithRelationInput | CardDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CardDefinitions.
     */
    cursor?: CardDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CardDefinitions.
     */
    distinct?: CardDefinitionScalarFieldEnum | CardDefinitionScalarFieldEnum[]
  }

  /**
   * CardDefinition findFirstOrThrow
   */
  export type CardDefinitionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which CardDefinition to fetch.
     */
    where?: CardDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardDefinitions to fetch.
     */
    orderBy?: CardDefinitionOrderByWithRelationInput | CardDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CardDefinitions.
     */
    cursor?: CardDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CardDefinitions.
     */
    distinct?: CardDefinitionScalarFieldEnum | CardDefinitionScalarFieldEnum[]
  }

  /**
   * CardDefinition findMany
   */
  export type CardDefinitionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which CardDefinitions to fetch.
     */
    where?: CardDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardDefinitions to fetch.
     */
    orderBy?: CardDefinitionOrderByWithRelationInput | CardDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CardDefinitions.
     */
    cursor?: CardDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardDefinitions.
     */
    skip?: number
    distinct?: CardDefinitionScalarFieldEnum | CardDefinitionScalarFieldEnum[]
  }

  /**
   * CardDefinition create
   */
  export type CardDefinitionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * The data needed to create a CardDefinition.
     */
    data: XOR<CardDefinitionCreateInput, CardDefinitionUncheckedCreateInput>
  }

  /**
   * CardDefinition createMany
   */
  export type CardDefinitionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CardDefinitions.
     */
    data: CardDefinitionCreateManyInput | CardDefinitionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CardDefinition createManyAndReturn
   */
  export type CardDefinitionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * The data used to create many CardDefinitions.
     */
    data: CardDefinitionCreateManyInput | CardDefinitionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CardDefinition update
   */
  export type CardDefinitionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * The data needed to update a CardDefinition.
     */
    data: XOR<CardDefinitionUpdateInput, CardDefinitionUncheckedUpdateInput>
    /**
     * Choose, which CardDefinition to update.
     */
    where: CardDefinitionWhereUniqueInput
  }

  /**
   * CardDefinition updateMany
   */
  export type CardDefinitionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CardDefinitions.
     */
    data: XOR<CardDefinitionUpdateManyMutationInput, CardDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which CardDefinitions to update
     */
    where?: CardDefinitionWhereInput
    /**
     * Limit how many CardDefinitions to update.
     */
    limit?: number
  }

  /**
   * CardDefinition updateManyAndReturn
   */
  export type CardDefinitionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * The data used to update CardDefinitions.
     */
    data: XOR<CardDefinitionUpdateManyMutationInput, CardDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which CardDefinitions to update
     */
    where?: CardDefinitionWhereInput
    /**
     * Limit how many CardDefinitions to update.
     */
    limit?: number
  }

  /**
   * CardDefinition upsert
   */
  export type CardDefinitionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * The filter to search for the CardDefinition to update in case it exists.
     */
    where: CardDefinitionWhereUniqueInput
    /**
     * In case the CardDefinition found by the `where` argument doesn't exist, create a new CardDefinition with this data.
     */
    create: XOR<CardDefinitionCreateInput, CardDefinitionUncheckedCreateInput>
    /**
     * In case the CardDefinition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CardDefinitionUpdateInput, CardDefinitionUncheckedUpdateInput>
  }

  /**
   * CardDefinition delete
   */
  export type CardDefinitionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
    /**
     * Filter which CardDefinition to delete.
     */
    where: CardDefinitionWhereUniqueInput
  }

  /**
   * CardDefinition deleteMany
   */
  export type CardDefinitionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CardDefinitions to delete
     */
    where?: CardDefinitionWhereInput
    /**
     * Limit how many CardDefinitions to delete.
     */
    limit?: number
  }

  /**
   * CardDefinition.decksAsLegend
   */
  export type CardDefinition$decksAsLegendArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    where?: DeckWhereInput
    orderBy?: DeckOrderByWithRelationInput | DeckOrderByWithRelationInput[]
    cursor?: DeckWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeckScalarFieldEnum | DeckScalarFieldEnum[]
  }

  /**
   * CardDefinition.decksAsChampion
   */
  export type CardDefinition$decksAsChampionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    where?: DeckWhereInput
    orderBy?: DeckOrderByWithRelationInput | DeckOrderByWithRelationInput[]
    cursor?: DeckWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeckScalarFieldEnum | DeckScalarFieldEnum[]
  }

  /**
   * CardDefinition.decksAsBattlefield
   */
  export type CardDefinition$decksAsBattlefieldArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    where?: DeckWhereInput
    orderBy?: DeckOrderByWithRelationInput | DeckOrderByWithRelationInput[]
    cursor?: DeckWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeckScalarFieldEnum | DeckScalarFieldEnum[]
  }

  /**
   * CardDefinition.mainDeckCards
   */
  export type CardDefinition$mainDeckCardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    where?: MainDeckCardWhereInput
    orderBy?: MainDeckCardOrderByWithRelationInput | MainDeckCardOrderByWithRelationInput[]
    cursor?: MainDeckCardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MainDeckCardScalarFieldEnum | MainDeckCardScalarFieldEnum[]
  }

  /**
   * CardDefinition.runeDeckCards
   */
  export type CardDefinition$runeDeckCardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    where?: RuneDeckCardWhereInput
    orderBy?: RuneDeckCardOrderByWithRelationInput | RuneDeckCardOrderByWithRelationInput[]
    cursor?: RuneDeckCardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RuneDeckCardScalarFieldEnum | RuneDeckCardScalarFieldEnum[]
  }

  /**
   * CardDefinition without action
   */
  export type CardDefinitionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardDefinition
     */
    select?: CardDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardDefinition
     */
    omit?: CardDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardDefinitionInclude<ExtArgs> | null
  }


  /**
   * Model Deck
   */

  export type AggregateDeck = {
    _count: DeckCountAggregateOutputType | null
    _avg: DeckAvgAggregateOutputType | null
    _sum: DeckSumAggregateOutputType | null
    _min: DeckMinAggregateOutputType | null
    _max: DeckMaxAggregateOutputType | null
  }

  export type DeckAvgAggregateOutputType = {
    totalCards: number | null
    playCount: number | null
    winCount: number | null
  }

  export type DeckSumAggregateOutputType = {
    totalCards: number | null
    playCount: number | null
    winCount: number | null
  }

  export type DeckMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    userId: string | null
    championLegendId: string | null
    chosenChampionId: string | null
    battlefieldId: string | null
    isValid: boolean | null
    totalCards: number | null
    format: string | null
    playCount: number | null
    winCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeckMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    userId: string | null
    championLegendId: string | null
    chosenChampionId: string | null
    battlefieldId: string | null
    isValid: boolean | null
    totalCards: number | null
    format: string | null
    playCount: number | null
    winCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeckCountAggregateOutputType = {
    id: number
    name: number
    description: number
    userId: number
    championLegendId: number
    chosenChampionId: number
    battlefieldId: number
    isValid: number
    totalCards: number
    format: number
    playCount: number
    winCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DeckAvgAggregateInputType = {
    totalCards?: true
    playCount?: true
    winCount?: true
  }

  export type DeckSumAggregateInputType = {
    totalCards?: true
    playCount?: true
    winCount?: true
  }

  export type DeckMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    userId?: true
    championLegendId?: true
    chosenChampionId?: true
    battlefieldId?: true
    isValid?: true
    totalCards?: true
    format?: true
    playCount?: true
    winCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeckMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    userId?: true
    championLegendId?: true
    chosenChampionId?: true
    battlefieldId?: true
    isValid?: true
    totalCards?: true
    format?: true
    playCount?: true
    winCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeckCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    userId?: true
    championLegendId?: true
    chosenChampionId?: true
    battlefieldId?: true
    isValid?: true
    totalCards?: true
    format?: true
    playCount?: true
    winCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DeckAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deck to aggregate.
     */
    where?: DeckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Decks to fetch.
     */
    orderBy?: DeckOrderByWithRelationInput | DeckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Decks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Decks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Decks
    **/
    _count?: true | DeckCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeckAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeckSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeckMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeckMaxAggregateInputType
  }

  export type GetDeckAggregateType<T extends DeckAggregateArgs> = {
        [P in keyof T & keyof AggregateDeck]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeck[P]>
      : GetScalarType<T[P], AggregateDeck[P]>
  }




  export type DeckGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeckWhereInput
    orderBy?: DeckOrderByWithAggregationInput | DeckOrderByWithAggregationInput[]
    by: DeckScalarFieldEnum[] | DeckScalarFieldEnum
    having?: DeckScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeckCountAggregateInputType | true
    _avg?: DeckAvgAggregateInputType
    _sum?: DeckSumAggregateInputType
    _min?: DeckMinAggregateInputType
    _max?: DeckMaxAggregateInputType
  }

  export type DeckGroupByOutputType = {
    id: string
    name: string
    description: string | null
    userId: string
    championLegendId: string
    chosenChampionId: string
    battlefieldId: string
    isValid: boolean
    totalCards: number
    format: string
    playCount: number
    winCount: number
    createdAt: Date
    updatedAt: Date
    _count: DeckCountAggregateOutputType | null
    _avg: DeckAvgAggregateOutputType | null
    _sum: DeckSumAggregateOutputType | null
    _min: DeckMinAggregateOutputType | null
    _max: DeckMaxAggregateOutputType | null
  }

  type GetDeckGroupByPayload<T extends DeckGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeckGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeckGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeckGroupByOutputType[P]>
            : GetScalarType<T[P], DeckGroupByOutputType[P]>
        }
      >
    >


  export type DeckSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    userId?: boolean
    championLegendId?: boolean
    chosenChampionId?: boolean
    battlefieldId?: boolean
    isValid?: boolean
    totalCards?: boolean
    format?: boolean
    playCount?: boolean
    winCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    championLegend?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    chosenChampion?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    battlefield?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    mainDeck?: boolean | Deck$mainDeckArgs<ExtArgs>
    runeDeck?: boolean | Deck$runeDeckArgs<ExtArgs>
    _count?: boolean | DeckCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deck"]>

  export type DeckSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    userId?: boolean
    championLegendId?: boolean
    chosenChampionId?: boolean
    battlefieldId?: boolean
    isValid?: boolean
    totalCards?: boolean
    format?: boolean
    playCount?: boolean
    winCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    championLegend?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    chosenChampion?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    battlefield?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deck"]>

  export type DeckSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    userId?: boolean
    championLegendId?: boolean
    chosenChampionId?: boolean
    battlefieldId?: boolean
    isValid?: boolean
    totalCards?: boolean
    format?: boolean
    playCount?: boolean
    winCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    championLegend?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    chosenChampion?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    battlefield?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deck"]>

  export type DeckSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    userId?: boolean
    championLegendId?: boolean
    chosenChampionId?: boolean
    battlefieldId?: boolean
    isValid?: boolean
    totalCards?: boolean
    format?: boolean
    playCount?: boolean
    winCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DeckOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "userId" | "championLegendId" | "chosenChampionId" | "battlefieldId" | "isValid" | "totalCards" | "format" | "playCount" | "winCount" | "createdAt" | "updatedAt", ExtArgs["result"]["deck"]>
  export type DeckInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    championLegend?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    chosenChampion?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    battlefield?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    mainDeck?: boolean | Deck$mainDeckArgs<ExtArgs>
    runeDeck?: boolean | Deck$runeDeckArgs<ExtArgs>
    _count?: boolean | DeckCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DeckIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    championLegend?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    chosenChampion?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    battlefield?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }
  export type DeckIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    championLegend?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    chosenChampion?: boolean | CardDefinitionDefaultArgs<ExtArgs>
    battlefield?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }

  export type $DeckPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Deck"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      championLegend: Prisma.$CardDefinitionPayload<ExtArgs>
      chosenChampion: Prisma.$CardDefinitionPayload<ExtArgs>
      battlefield: Prisma.$CardDefinitionPayload<ExtArgs>
      mainDeck: Prisma.$MainDeckCardPayload<ExtArgs>[]
      runeDeck: Prisma.$RuneDeckCardPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      userId: string
      championLegendId: string
      chosenChampionId: string
      battlefieldId: string
      isValid: boolean
      totalCards: number
      format: string
      playCount: number
      winCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["deck"]>
    composites: {}
  }

  type DeckGetPayload<S extends boolean | null | undefined | DeckDefaultArgs> = $Result.GetResult<Prisma.$DeckPayload, S>

  type DeckCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeckFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeckCountAggregateInputType | true
    }

  export interface DeckDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Deck'], meta: { name: 'Deck' } }
    /**
     * Find zero or one Deck that matches the filter.
     * @param {DeckFindUniqueArgs} args - Arguments to find a Deck
     * @example
     * // Get one Deck
     * const deck = await prisma.deck.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeckFindUniqueArgs>(args: SelectSubset<T, DeckFindUniqueArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Deck that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeckFindUniqueOrThrowArgs} args - Arguments to find a Deck
     * @example
     * // Get one Deck
     * const deck = await prisma.deck.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeckFindUniqueOrThrowArgs>(args: SelectSubset<T, DeckFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Deck that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckFindFirstArgs} args - Arguments to find a Deck
     * @example
     * // Get one Deck
     * const deck = await prisma.deck.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeckFindFirstArgs>(args?: SelectSubset<T, DeckFindFirstArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Deck that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckFindFirstOrThrowArgs} args - Arguments to find a Deck
     * @example
     * // Get one Deck
     * const deck = await prisma.deck.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeckFindFirstOrThrowArgs>(args?: SelectSubset<T, DeckFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Decks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Decks
     * const decks = await prisma.deck.findMany()
     * 
     * // Get first 10 Decks
     * const decks = await prisma.deck.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deckWithIdOnly = await prisma.deck.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeckFindManyArgs>(args?: SelectSubset<T, DeckFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Deck.
     * @param {DeckCreateArgs} args - Arguments to create a Deck.
     * @example
     * // Create one Deck
     * const Deck = await prisma.deck.create({
     *   data: {
     *     // ... data to create a Deck
     *   }
     * })
     * 
     */
    create<T extends DeckCreateArgs>(args: SelectSubset<T, DeckCreateArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Decks.
     * @param {DeckCreateManyArgs} args - Arguments to create many Decks.
     * @example
     * // Create many Decks
     * const deck = await prisma.deck.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeckCreateManyArgs>(args?: SelectSubset<T, DeckCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Decks and returns the data saved in the database.
     * @param {DeckCreateManyAndReturnArgs} args - Arguments to create many Decks.
     * @example
     * // Create many Decks
     * const deck = await prisma.deck.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Decks and only return the `id`
     * const deckWithIdOnly = await prisma.deck.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeckCreateManyAndReturnArgs>(args?: SelectSubset<T, DeckCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Deck.
     * @param {DeckDeleteArgs} args - Arguments to delete one Deck.
     * @example
     * // Delete one Deck
     * const Deck = await prisma.deck.delete({
     *   where: {
     *     // ... filter to delete one Deck
     *   }
     * })
     * 
     */
    delete<T extends DeckDeleteArgs>(args: SelectSubset<T, DeckDeleteArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Deck.
     * @param {DeckUpdateArgs} args - Arguments to update one Deck.
     * @example
     * // Update one Deck
     * const deck = await prisma.deck.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeckUpdateArgs>(args: SelectSubset<T, DeckUpdateArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Decks.
     * @param {DeckDeleteManyArgs} args - Arguments to filter Decks to delete.
     * @example
     * // Delete a few Decks
     * const { count } = await prisma.deck.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeckDeleteManyArgs>(args?: SelectSubset<T, DeckDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Decks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Decks
     * const deck = await prisma.deck.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeckUpdateManyArgs>(args: SelectSubset<T, DeckUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Decks and returns the data updated in the database.
     * @param {DeckUpdateManyAndReturnArgs} args - Arguments to update many Decks.
     * @example
     * // Update many Decks
     * const deck = await prisma.deck.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Decks and only return the `id`
     * const deckWithIdOnly = await prisma.deck.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeckUpdateManyAndReturnArgs>(args: SelectSubset<T, DeckUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Deck.
     * @param {DeckUpsertArgs} args - Arguments to update or create a Deck.
     * @example
     * // Update or create a Deck
     * const deck = await prisma.deck.upsert({
     *   create: {
     *     // ... data to create a Deck
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Deck we want to update
     *   }
     * })
     */
    upsert<T extends DeckUpsertArgs>(args: SelectSubset<T, DeckUpsertArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Decks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckCountArgs} args - Arguments to filter Decks to count.
     * @example
     * // Count the number of Decks
     * const count = await prisma.deck.count({
     *   where: {
     *     // ... the filter for the Decks we want to count
     *   }
     * })
    **/
    count<T extends DeckCountArgs>(
      args?: Subset<T, DeckCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeckCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Deck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeckAggregateArgs>(args: Subset<T, DeckAggregateArgs>): Prisma.PrismaPromise<GetDeckAggregateType<T>>

    /**
     * Group by Deck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeckGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeckGroupByArgs['orderBy'] }
        : { orderBy?: DeckGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeckGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeckGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Deck model
   */
  readonly fields: DeckFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Deck.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeckClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    championLegend<T extends CardDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinitionDefaultArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    chosenChampion<T extends CardDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinitionDefaultArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    battlefield<T extends CardDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinitionDefaultArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    mainDeck<T extends Deck$mainDeckArgs<ExtArgs> = {}>(args?: Subset<T, Deck$mainDeckArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    runeDeck<T extends Deck$runeDeckArgs<ExtArgs> = {}>(args?: Subset<T, Deck$runeDeckArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Deck model
   */
  interface DeckFieldRefs {
    readonly id: FieldRef<"Deck", 'String'>
    readonly name: FieldRef<"Deck", 'String'>
    readonly description: FieldRef<"Deck", 'String'>
    readonly userId: FieldRef<"Deck", 'String'>
    readonly championLegendId: FieldRef<"Deck", 'String'>
    readonly chosenChampionId: FieldRef<"Deck", 'String'>
    readonly battlefieldId: FieldRef<"Deck", 'String'>
    readonly isValid: FieldRef<"Deck", 'Boolean'>
    readonly totalCards: FieldRef<"Deck", 'Int'>
    readonly format: FieldRef<"Deck", 'String'>
    readonly playCount: FieldRef<"Deck", 'Int'>
    readonly winCount: FieldRef<"Deck", 'Int'>
    readonly createdAt: FieldRef<"Deck", 'DateTime'>
    readonly updatedAt: FieldRef<"Deck", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Deck findUnique
   */
  export type DeckFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * Filter, which Deck to fetch.
     */
    where: DeckWhereUniqueInput
  }

  /**
   * Deck findUniqueOrThrow
   */
  export type DeckFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * Filter, which Deck to fetch.
     */
    where: DeckWhereUniqueInput
  }

  /**
   * Deck findFirst
   */
  export type DeckFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * Filter, which Deck to fetch.
     */
    where?: DeckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Decks to fetch.
     */
    orderBy?: DeckOrderByWithRelationInput | DeckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Decks.
     */
    cursor?: DeckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Decks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Decks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Decks.
     */
    distinct?: DeckScalarFieldEnum | DeckScalarFieldEnum[]
  }

  /**
   * Deck findFirstOrThrow
   */
  export type DeckFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * Filter, which Deck to fetch.
     */
    where?: DeckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Decks to fetch.
     */
    orderBy?: DeckOrderByWithRelationInput | DeckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Decks.
     */
    cursor?: DeckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Decks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Decks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Decks.
     */
    distinct?: DeckScalarFieldEnum | DeckScalarFieldEnum[]
  }

  /**
   * Deck findMany
   */
  export type DeckFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * Filter, which Decks to fetch.
     */
    where?: DeckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Decks to fetch.
     */
    orderBy?: DeckOrderByWithRelationInput | DeckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Decks.
     */
    cursor?: DeckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Decks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Decks.
     */
    skip?: number
    distinct?: DeckScalarFieldEnum | DeckScalarFieldEnum[]
  }

  /**
   * Deck create
   */
  export type DeckCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * The data needed to create a Deck.
     */
    data: XOR<DeckCreateInput, DeckUncheckedCreateInput>
  }

  /**
   * Deck createMany
   */
  export type DeckCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Decks.
     */
    data: DeckCreateManyInput | DeckCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Deck createManyAndReturn
   */
  export type DeckCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * The data used to create many Decks.
     */
    data: DeckCreateManyInput | DeckCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Deck update
   */
  export type DeckUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * The data needed to update a Deck.
     */
    data: XOR<DeckUpdateInput, DeckUncheckedUpdateInput>
    /**
     * Choose, which Deck to update.
     */
    where: DeckWhereUniqueInput
  }

  /**
   * Deck updateMany
   */
  export type DeckUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Decks.
     */
    data: XOR<DeckUpdateManyMutationInput, DeckUncheckedUpdateManyInput>
    /**
     * Filter which Decks to update
     */
    where?: DeckWhereInput
    /**
     * Limit how many Decks to update.
     */
    limit?: number
  }

  /**
   * Deck updateManyAndReturn
   */
  export type DeckUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * The data used to update Decks.
     */
    data: XOR<DeckUpdateManyMutationInput, DeckUncheckedUpdateManyInput>
    /**
     * Filter which Decks to update
     */
    where?: DeckWhereInput
    /**
     * Limit how many Decks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Deck upsert
   */
  export type DeckUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * The filter to search for the Deck to update in case it exists.
     */
    where: DeckWhereUniqueInput
    /**
     * In case the Deck found by the `where` argument doesn't exist, create a new Deck with this data.
     */
    create: XOR<DeckCreateInput, DeckUncheckedCreateInput>
    /**
     * In case the Deck was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeckUpdateInput, DeckUncheckedUpdateInput>
  }

  /**
   * Deck delete
   */
  export type DeckDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
    /**
     * Filter which Deck to delete.
     */
    where: DeckWhereUniqueInput
  }

  /**
   * Deck deleteMany
   */
  export type DeckDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Decks to delete
     */
    where?: DeckWhereInput
    /**
     * Limit how many Decks to delete.
     */
    limit?: number
  }

  /**
   * Deck.mainDeck
   */
  export type Deck$mainDeckArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    where?: MainDeckCardWhereInput
    orderBy?: MainDeckCardOrderByWithRelationInput | MainDeckCardOrderByWithRelationInput[]
    cursor?: MainDeckCardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MainDeckCardScalarFieldEnum | MainDeckCardScalarFieldEnum[]
  }

  /**
   * Deck.runeDeck
   */
  export type Deck$runeDeckArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    where?: RuneDeckCardWhereInput
    orderBy?: RuneDeckCardOrderByWithRelationInput | RuneDeckCardOrderByWithRelationInput[]
    cursor?: RuneDeckCardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RuneDeckCardScalarFieldEnum | RuneDeckCardScalarFieldEnum[]
  }

  /**
   * Deck without action
   */
  export type DeckDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deck
     */
    select?: DeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deck
     */
    omit?: DeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckInclude<ExtArgs> | null
  }


  /**
   * Model MainDeckCard
   */

  export type AggregateMainDeckCard = {
    _count: MainDeckCardCountAggregateOutputType | null
    _avg: MainDeckCardAvgAggregateOutputType | null
    _sum: MainDeckCardSumAggregateOutputType | null
    _min: MainDeckCardMinAggregateOutputType | null
    _max: MainDeckCardMaxAggregateOutputType | null
  }

  export type MainDeckCardAvgAggregateOutputType = {
    quantity: number | null
  }

  export type MainDeckCardSumAggregateOutputType = {
    quantity: number | null
  }

  export type MainDeckCardMinAggregateOutputType = {
    id: string | null
    deckId: string | null
    cardId: string | null
    quantity: number | null
  }

  export type MainDeckCardMaxAggregateOutputType = {
    id: string | null
    deckId: string | null
    cardId: string | null
    quantity: number | null
  }

  export type MainDeckCardCountAggregateOutputType = {
    id: number
    deckId: number
    cardId: number
    quantity: number
    _all: number
  }


  export type MainDeckCardAvgAggregateInputType = {
    quantity?: true
  }

  export type MainDeckCardSumAggregateInputType = {
    quantity?: true
  }

  export type MainDeckCardMinAggregateInputType = {
    id?: true
    deckId?: true
    cardId?: true
    quantity?: true
  }

  export type MainDeckCardMaxAggregateInputType = {
    id?: true
    deckId?: true
    cardId?: true
    quantity?: true
  }

  export type MainDeckCardCountAggregateInputType = {
    id?: true
    deckId?: true
    cardId?: true
    quantity?: true
    _all?: true
  }

  export type MainDeckCardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MainDeckCard to aggregate.
     */
    where?: MainDeckCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MainDeckCards to fetch.
     */
    orderBy?: MainDeckCardOrderByWithRelationInput | MainDeckCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MainDeckCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MainDeckCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MainDeckCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MainDeckCards
    **/
    _count?: true | MainDeckCardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MainDeckCardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MainDeckCardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MainDeckCardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MainDeckCardMaxAggregateInputType
  }

  export type GetMainDeckCardAggregateType<T extends MainDeckCardAggregateArgs> = {
        [P in keyof T & keyof AggregateMainDeckCard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMainDeckCard[P]>
      : GetScalarType<T[P], AggregateMainDeckCard[P]>
  }




  export type MainDeckCardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MainDeckCardWhereInput
    orderBy?: MainDeckCardOrderByWithAggregationInput | MainDeckCardOrderByWithAggregationInput[]
    by: MainDeckCardScalarFieldEnum[] | MainDeckCardScalarFieldEnum
    having?: MainDeckCardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MainDeckCardCountAggregateInputType | true
    _avg?: MainDeckCardAvgAggregateInputType
    _sum?: MainDeckCardSumAggregateInputType
    _min?: MainDeckCardMinAggregateInputType
    _max?: MainDeckCardMaxAggregateInputType
  }

  export type MainDeckCardGroupByOutputType = {
    id: string
    deckId: string
    cardId: string
    quantity: number
    _count: MainDeckCardCountAggregateOutputType | null
    _avg: MainDeckCardAvgAggregateOutputType | null
    _sum: MainDeckCardSumAggregateOutputType | null
    _min: MainDeckCardMinAggregateOutputType | null
    _max: MainDeckCardMaxAggregateOutputType | null
  }

  type GetMainDeckCardGroupByPayload<T extends MainDeckCardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MainDeckCardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MainDeckCardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MainDeckCardGroupByOutputType[P]>
            : GetScalarType<T[P], MainDeckCardGroupByOutputType[P]>
        }
      >
    >


  export type MainDeckCardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deckId?: boolean
    cardId?: boolean
    quantity?: boolean
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mainDeckCard"]>

  export type MainDeckCardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deckId?: boolean
    cardId?: boolean
    quantity?: boolean
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mainDeckCard"]>

  export type MainDeckCardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deckId?: boolean
    cardId?: boolean
    quantity?: boolean
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mainDeckCard"]>

  export type MainDeckCardSelectScalar = {
    id?: boolean
    deckId?: boolean
    cardId?: boolean
    quantity?: boolean
  }

  export type MainDeckCardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deckId" | "cardId" | "quantity", ExtArgs["result"]["mainDeckCard"]>
  export type MainDeckCardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }
  export type MainDeckCardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }
  export type MainDeckCardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }

  export type $MainDeckCardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MainDeckCard"
    objects: {
      deck: Prisma.$DeckPayload<ExtArgs>
      card: Prisma.$CardDefinitionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      deckId: string
      cardId: string
      quantity: number
    }, ExtArgs["result"]["mainDeckCard"]>
    composites: {}
  }

  type MainDeckCardGetPayload<S extends boolean | null | undefined | MainDeckCardDefaultArgs> = $Result.GetResult<Prisma.$MainDeckCardPayload, S>

  type MainDeckCardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MainDeckCardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MainDeckCardCountAggregateInputType | true
    }

  export interface MainDeckCardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MainDeckCard'], meta: { name: 'MainDeckCard' } }
    /**
     * Find zero or one MainDeckCard that matches the filter.
     * @param {MainDeckCardFindUniqueArgs} args - Arguments to find a MainDeckCard
     * @example
     * // Get one MainDeckCard
     * const mainDeckCard = await prisma.mainDeckCard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MainDeckCardFindUniqueArgs>(args: SelectSubset<T, MainDeckCardFindUniqueArgs<ExtArgs>>): Prisma__MainDeckCardClient<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MainDeckCard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MainDeckCardFindUniqueOrThrowArgs} args - Arguments to find a MainDeckCard
     * @example
     * // Get one MainDeckCard
     * const mainDeckCard = await prisma.mainDeckCard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MainDeckCardFindUniqueOrThrowArgs>(args: SelectSubset<T, MainDeckCardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MainDeckCardClient<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MainDeckCard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MainDeckCardFindFirstArgs} args - Arguments to find a MainDeckCard
     * @example
     * // Get one MainDeckCard
     * const mainDeckCard = await prisma.mainDeckCard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MainDeckCardFindFirstArgs>(args?: SelectSubset<T, MainDeckCardFindFirstArgs<ExtArgs>>): Prisma__MainDeckCardClient<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MainDeckCard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MainDeckCardFindFirstOrThrowArgs} args - Arguments to find a MainDeckCard
     * @example
     * // Get one MainDeckCard
     * const mainDeckCard = await prisma.mainDeckCard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MainDeckCardFindFirstOrThrowArgs>(args?: SelectSubset<T, MainDeckCardFindFirstOrThrowArgs<ExtArgs>>): Prisma__MainDeckCardClient<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MainDeckCards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MainDeckCardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MainDeckCards
     * const mainDeckCards = await prisma.mainDeckCard.findMany()
     * 
     * // Get first 10 MainDeckCards
     * const mainDeckCards = await prisma.mainDeckCard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mainDeckCardWithIdOnly = await prisma.mainDeckCard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MainDeckCardFindManyArgs>(args?: SelectSubset<T, MainDeckCardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MainDeckCard.
     * @param {MainDeckCardCreateArgs} args - Arguments to create a MainDeckCard.
     * @example
     * // Create one MainDeckCard
     * const MainDeckCard = await prisma.mainDeckCard.create({
     *   data: {
     *     // ... data to create a MainDeckCard
     *   }
     * })
     * 
     */
    create<T extends MainDeckCardCreateArgs>(args: SelectSubset<T, MainDeckCardCreateArgs<ExtArgs>>): Prisma__MainDeckCardClient<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MainDeckCards.
     * @param {MainDeckCardCreateManyArgs} args - Arguments to create many MainDeckCards.
     * @example
     * // Create many MainDeckCards
     * const mainDeckCard = await prisma.mainDeckCard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MainDeckCardCreateManyArgs>(args?: SelectSubset<T, MainDeckCardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MainDeckCards and returns the data saved in the database.
     * @param {MainDeckCardCreateManyAndReturnArgs} args - Arguments to create many MainDeckCards.
     * @example
     * // Create many MainDeckCards
     * const mainDeckCard = await prisma.mainDeckCard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MainDeckCards and only return the `id`
     * const mainDeckCardWithIdOnly = await prisma.mainDeckCard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MainDeckCardCreateManyAndReturnArgs>(args?: SelectSubset<T, MainDeckCardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MainDeckCard.
     * @param {MainDeckCardDeleteArgs} args - Arguments to delete one MainDeckCard.
     * @example
     * // Delete one MainDeckCard
     * const MainDeckCard = await prisma.mainDeckCard.delete({
     *   where: {
     *     // ... filter to delete one MainDeckCard
     *   }
     * })
     * 
     */
    delete<T extends MainDeckCardDeleteArgs>(args: SelectSubset<T, MainDeckCardDeleteArgs<ExtArgs>>): Prisma__MainDeckCardClient<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MainDeckCard.
     * @param {MainDeckCardUpdateArgs} args - Arguments to update one MainDeckCard.
     * @example
     * // Update one MainDeckCard
     * const mainDeckCard = await prisma.mainDeckCard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MainDeckCardUpdateArgs>(args: SelectSubset<T, MainDeckCardUpdateArgs<ExtArgs>>): Prisma__MainDeckCardClient<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MainDeckCards.
     * @param {MainDeckCardDeleteManyArgs} args - Arguments to filter MainDeckCards to delete.
     * @example
     * // Delete a few MainDeckCards
     * const { count } = await prisma.mainDeckCard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MainDeckCardDeleteManyArgs>(args?: SelectSubset<T, MainDeckCardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MainDeckCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MainDeckCardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MainDeckCards
     * const mainDeckCard = await prisma.mainDeckCard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MainDeckCardUpdateManyArgs>(args: SelectSubset<T, MainDeckCardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MainDeckCards and returns the data updated in the database.
     * @param {MainDeckCardUpdateManyAndReturnArgs} args - Arguments to update many MainDeckCards.
     * @example
     * // Update many MainDeckCards
     * const mainDeckCard = await prisma.mainDeckCard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MainDeckCards and only return the `id`
     * const mainDeckCardWithIdOnly = await prisma.mainDeckCard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MainDeckCardUpdateManyAndReturnArgs>(args: SelectSubset<T, MainDeckCardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MainDeckCard.
     * @param {MainDeckCardUpsertArgs} args - Arguments to update or create a MainDeckCard.
     * @example
     * // Update or create a MainDeckCard
     * const mainDeckCard = await prisma.mainDeckCard.upsert({
     *   create: {
     *     // ... data to create a MainDeckCard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MainDeckCard we want to update
     *   }
     * })
     */
    upsert<T extends MainDeckCardUpsertArgs>(args: SelectSubset<T, MainDeckCardUpsertArgs<ExtArgs>>): Prisma__MainDeckCardClient<$Result.GetResult<Prisma.$MainDeckCardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MainDeckCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MainDeckCardCountArgs} args - Arguments to filter MainDeckCards to count.
     * @example
     * // Count the number of MainDeckCards
     * const count = await prisma.mainDeckCard.count({
     *   where: {
     *     // ... the filter for the MainDeckCards we want to count
     *   }
     * })
    **/
    count<T extends MainDeckCardCountArgs>(
      args?: Subset<T, MainDeckCardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MainDeckCardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MainDeckCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MainDeckCardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MainDeckCardAggregateArgs>(args: Subset<T, MainDeckCardAggregateArgs>): Prisma.PrismaPromise<GetMainDeckCardAggregateType<T>>

    /**
     * Group by MainDeckCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MainDeckCardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MainDeckCardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MainDeckCardGroupByArgs['orderBy'] }
        : { orderBy?: MainDeckCardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MainDeckCardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMainDeckCardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MainDeckCard model
   */
  readonly fields: MainDeckCardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MainDeckCard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MainDeckCardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deck<T extends DeckDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DeckDefaultArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    card<T extends CardDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinitionDefaultArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MainDeckCard model
   */
  interface MainDeckCardFieldRefs {
    readonly id: FieldRef<"MainDeckCard", 'String'>
    readonly deckId: FieldRef<"MainDeckCard", 'String'>
    readonly cardId: FieldRef<"MainDeckCard", 'String'>
    readonly quantity: FieldRef<"MainDeckCard", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * MainDeckCard findUnique
   */
  export type MainDeckCardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which MainDeckCard to fetch.
     */
    where: MainDeckCardWhereUniqueInput
  }

  /**
   * MainDeckCard findUniqueOrThrow
   */
  export type MainDeckCardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which MainDeckCard to fetch.
     */
    where: MainDeckCardWhereUniqueInput
  }

  /**
   * MainDeckCard findFirst
   */
  export type MainDeckCardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which MainDeckCard to fetch.
     */
    where?: MainDeckCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MainDeckCards to fetch.
     */
    orderBy?: MainDeckCardOrderByWithRelationInput | MainDeckCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MainDeckCards.
     */
    cursor?: MainDeckCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MainDeckCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MainDeckCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MainDeckCards.
     */
    distinct?: MainDeckCardScalarFieldEnum | MainDeckCardScalarFieldEnum[]
  }

  /**
   * MainDeckCard findFirstOrThrow
   */
  export type MainDeckCardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which MainDeckCard to fetch.
     */
    where?: MainDeckCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MainDeckCards to fetch.
     */
    orderBy?: MainDeckCardOrderByWithRelationInput | MainDeckCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MainDeckCards.
     */
    cursor?: MainDeckCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MainDeckCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MainDeckCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MainDeckCards.
     */
    distinct?: MainDeckCardScalarFieldEnum | MainDeckCardScalarFieldEnum[]
  }

  /**
   * MainDeckCard findMany
   */
  export type MainDeckCardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which MainDeckCards to fetch.
     */
    where?: MainDeckCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MainDeckCards to fetch.
     */
    orderBy?: MainDeckCardOrderByWithRelationInput | MainDeckCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MainDeckCards.
     */
    cursor?: MainDeckCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MainDeckCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MainDeckCards.
     */
    skip?: number
    distinct?: MainDeckCardScalarFieldEnum | MainDeckCardScalarFieldEnum[]
  }

  /**
   * MainDeckCard create
   */
  export type MainDeckCardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * The data needed to create a MainDeckCard.
     */
    data: XOR<MainDeckCardCreateInput, MainDeckCardUncheckedCreateInput>
  }

  /**
   * MainDeckCard createMany
   */
  export type MainDeckCardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MainDeckCards.
     */
    data: MainDeckCardCreateManyInput | MainDeckCardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MainDeckCard createManyAndReturn
   */
  export type MainDeckCardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * The data used to create many MainDeckCards.
     */
    data: MainDeckCardCreateManyInput | MainDeckCardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MainDeckCard update
   */
  export type MainDeckCardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * The data needed to update a MainDeckCard.
     */
    data: XOR<MainDeckCardUpdateInput, MainDeckCardUncheckedUpdateInput>
    /**
     * Choose, which MainDeckCard to update.
     */
    where: MainDeckCardWhereUniqueInput
  }

  /**
   * MainDeckCard updateMany
   */
  export type MainDeckCardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MainDeckCards.
     */
    data: XOR<MainDeckCardUpdateManyMutationInput, MainDeckCardUncheckedUpdateManyInput>
    /**
     * Filter which MainDeckCards to update
     */
    where?: MainDeckCardWhereInput
    /**
     * Limit how many MainDeckCards to update.
     */
    limit?: number
  }

  /**
   * MainDeckCard updateManyAndReturn
   */
  export type MainDeckCardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * The data used to update MainDeckCards.
     */
    data: XOR<MainDeckCardUpdateManyMutationInput, MainDeckCardUncheckedUpdateManyInput>
    /**
     * Filter which MainDeckCards to update
     */
    where?: MainDeckCardWhereInput
    /**
     * Limit how many MainDeckCards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MainDeckCard upsert
   */
  export type MainDeckCardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * The filter to search for the MainDeckCard to update in case it exists.
     */
    where: MainDeckCardWhereUniqueInput
    /**
     * In case the MainDeckCard found by the `where` argument doesn't exist, create a new MainDeckCard with this data.
     */
    create: XOR<MainDeckCardCreateInput, MainDeckCardUncheckedCreateInput>
    /**
     * In case the MainDeckCard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MainDeckCardUpdateInput, MainDeckCardUncheckedUpdateInput>
  }

  /**
   * MainDeckCard delete
   */
  export type MainDeckCardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
    /**
     * Filter which MainDeckCard to delete.
     */
    where: MainDeckCardWhereUniqueInput
  }

  /**
   * MainDeckCard deleteMany
   */
  export type MainDeckCardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MainDeckCards to delete
     */
    where?: MainDeckCardWhereInput
    /**
     * Limit how many MainDeckCards to delete.
     */
    limit?: number
  }

  /**
   * MainDeckCard without action
   */
  export type MainDeckCardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MainDeckCard
     */
    select?: MainDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MainDeckCard
     */
    omit?: MainDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MainDeckCardInclude<ExtArgs> | null
  }


  /**
   * Model RuneDeckCard
   */

  export type AggregateRuneDeckCard = {
    _count: RuneDeckCardCountAggregateOutputType | null
    _avg: RuneDeckCardAvgAggregateOutputType | null
    _sum: RuneDeckCardSumAggregateOutputType | null
    _min: RuneDeckCardMinAggregateOutputType | null
    _max: RuneDeckCardMaxAggregateOutputType | null
  }

  export type RuneDeckCardAvgAggregateOutputType = {
    quantity: number | null
  }

  export type RuneDeckCardSumAggregateOutputType = {
    quantity: number | null
  }

  export type RuneDeckCardMinAggregateOutputType = {
    id: string | null
    deckId: string | null
    cardId: string | null
    quantity: number | null
  }

  export type RuneDeckCardMaxAggregateOutputType = {
    id: string | null
    deckId: string | null
    cardId: string | null
    quantity: number | null
  }

  export type RuneDeckCardCountAggregateOutputType = {
    id: number
    deckId: number
    cardId: number
    quantity: number
    _all: number
  }


  export type RuneDeckCardAvgAggregateInputType = {
    quantity?: true
  }

  export type RuneDeckCardSumAggregateInputType = {
    quantity?: true
  }

  export type RuneDeckCardMinAggregateInputType = {
    id?: true
    deckId?: true
    cardId?: true
    quantity?: true
  }

  export type RuneDeckCardMaxAggregateInputType = {
    id?: true
    deckId?: true
    cardId?: true
    quantity?: true
  }

  export type RuneDeckCardCountAggregateInputType = {
    id?: true
    deckId?: true
    cardId?: true
    quantity?: true
    _all?: true
  }

  export type RuneDeckCardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RuneDeckCard to aggregate.
     */
    where?: RuneDeckCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RuneDeckCards to fetch.
     */
    orderBy?: RuneDeckCardOrderByWithRelationInput | RuneDeckCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RuneDeckCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RuneDeckCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RuneDeckCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RuneDeckCards
    **/
    _count?: true | RuneDeckCardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RuneDeckCardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RuneDeckCardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RuneDeckCardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RuneDeckCardMaxAggregateInputType
  }

  export type GetRuneDeckCardAggregateType<T extends RuneDeckCardAggregateArgs> = {
        [P in keyof T & keyof AggregateRuneDeckCard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRuneDeckCard[P]>
      : GetScalarType<T[P], AggregateRuneDeckCard[P]>
  }




  export type RuneDeckCardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RuneDeckCardWhereInput
    orderBy?: RuneDeckCardOrderByWithAggregationInput | RuneDeckCardOrderByWithAggregationInput[]
    by: RuneDeckCardScalarFieldEnum[] | RuneDeckCardScalarFieldEnum
    having?: RuneDeckCardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RuneDeckCardCountAggregateInputType | true
    _avg?: RuneDeckCardAvgAggregateInputType
    _sum?: RuneDeckCardSumAggregateInputType
    _min?: RuneDeckCardMinAggregateInputType
    _max?: RuneDeckCardMaxAggregateInputType
  }

  export type RuneDeckCardGroupByOutputType = {
    id: string
    deckId: string
    cardId: string
    quantity: number
    _count: RuneDeckCardCountAggregateOutputType | null
    _avg: RuneDeckCardAvgAggregateOutputType | null
    _sum: RuneDeckCardSumAggregateOutputType | null
    _min: RuneDeckCardMinAggregateOutputType | null
    _max: RuneDeckCardMaxAggregateOutputType | null
  }

  type GetRuneDeckCardGroupByPayload<T extends RuneDeckCardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RuneDeckCardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RuneDeckCardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RuneDeckCardGroupByOutputType[P]>
            : GetScalarType<T[P], RuneDeckCardGroupByOutputType[P]>
        }
      >
    >


  export type RuneDeckCardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deckId?: boolean
    cardId?: boolean
    quantity?: boolean
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runeDeckCard"]>

  export type RuneDeckCardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deckId?: boolean
    cardId?: boolean
    quantity?: boolean
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runeDeckCard"]>

  export type RuneDeckCardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deckId?: boolean
    cardId?: boolean
    quantity?: boolean
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runeDeckCard"]>

  export type RuneDeckCardSelectScalar = {
    id?: boolean
    deckId?: boolean
    cardId?: boolean
    quantity?: boolean
  }

  export type RuneDeckCardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deckId" | "cardId" | "quantity", ExtArgs["result"]["runeDeckCard"]>
  export type RuneDeckCardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }
  export type RuneDeckCardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }
  export type RuneDeckCardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | DeckDefaultArgs<ExtArgs>
    card?: boolean | CardDefinitionDefaultArgs<ExtArgs>
  }

  export type $RuneDeckCardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RuneDeckCard"
    objects: {
      deck: Prisma.$DeckPayload<ExtArgs>
      card: Prisma.$CardDefinitionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      deckId: string
      cardId: string
      quantity: number
    }, ExtArgs["result"]["runeDeckCard"]>
    composites: {}
  }

  type RuneDeckCardGetPayload<S extends boolean | null | undefined | RuneDeckCardDefaultArgs> = $Result.GetResult<Prisma.$RuneDeckCardPayload, S>

  type RuneDeckCardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RuneDeckCardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RuneDeckCardCountAggregateInputType | true
    }

  export interface RuneDeckCardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RuneDeckCard'], meta: { name: 'RuneDeckCard' } }
    /**
     * Find zero or one RuneDeckCard that matches the filter.
     * @param {RuneDeckCardFindUniqueArgs} args - Arguments to find a RuneDeckCard
     * @example
     * // Get one RuneDeckCard
     * const runeDeckCard = await prisma.runeDeckCard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RuneDeckCardFindUniqueArgs>(args: SelectSubset<T, RuneDeckCardFindUniqueArgs<ExtArgs>>): Prisma__RuneDeckCardClient<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RuneDeckCard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RuneDeckCardFindUniqueOrThrowArgs} args - Arguments to find a RuneDeckCard
     * @example
     * // Get one RuneDeckCard
     * const runeDeckCard = await prisma.runeDeckCard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RuneDeckCardFindUniqueOrThrowArgs>(args: SelectSubset<T, RuneDeckCardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RuneDeckCardClient<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RuneDeckCard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RuneDeckCardFindFirstArgs} args - Arguments to find a RuneDeckCard
     * @example
     * // Get one RuneDeckCard
     * const runeDeckCard = await prisma.runeDeckCard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RuneDeckCardFindFirstArgs>(args?: SelectSubset<T, RuneDeckCardFindFirstArgs<ExtArgs>>): Prisma__RuneDeckCardClient<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RuneDeckCard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RuneDeckCardFindFirstOrThrowArgs} args - Arguments to find a RuneDeckCard
     * @example
     * // Get one RuneDeckCard
     * const runeDeckCard = await prisma.runeDeckCard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RuneDeckCardFindFirstOrThrowArgs>(args?: SelectSubset<T, RuneDeckCardFindFirstOrThrowArgs<ExtArgs>>): Prisma__RuneDeckCardClient<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RuneDeckCards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RuneDeckCardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RuneDeckCards
     * const runeDeckCards = await prisma.runeDeckCard.findMany()
     * 
     * // Get first 10 RuneDeckCards
     * const runeDeckCards = await prisma.runeDeckCard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const runeDeckCardWithIdOnly = await prisma.runeDeckCard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RuneDeckCardFindManyArgs>(args?: SelectSubset<T, RuneDeckCardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RuneDeckCard.
     * @param {RuneDeckCardCreateArgs} args - Arguments to create a RuneDeckCard.
     * @example
     * // Create one RuneDeckCard
     * const RuneDeckCard = await prisma.runeDeckCard.create({
     *   data: {
     *     // ... data to create a RuneDeckCard
     *   }
     * })
     * 
     */
    create<T extends RuneDeckCardCreateArgs>(args: SelectSubset<T, RuneDeckCardCreateArgs<ExtArgs>>): Prisma__RuneDeckCardClient<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RuneDeckCards.
     * @param {RuneDeckCardCreateManyArgs} args - Arguments to create many RuneDeckCards.
     * @example
     * // Create many RuneDeckCards
     * const runeDeckCard = await prisma.runeDeckCard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RuneDeckCardCreateManyArgs>(args?: SelectSubset<T, RuneDeckCardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RuneDeckCards and returns the data saved in the database.
     * @param {RuneDeckCardCreateManyAndReturnArgs} args - Arguments to create many RuneDeckCards.
     * @example
     * // Create many RuneDeckCards
     * const runeDeckCard = await prisma.runeDeckCard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RuneDeckCards and only return the `id`
     * const runeDeckCardWithIdOnly = await prisma.runeDeckCard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RuneDeckCardCreateManyAndReturnArgs>(args?: SelectSubset<T, RuneDeckCardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RuneDeckCard.
     * @param {RuneDeckCardDeleteArgs} args - Arguments to delete one RuneDeckCard.
     * @example
     * // Delete one RuneDeckCard
     * const RuneDeckCard = await prisma.runeDeckCard.delete({
     *   where: {
     *     // ... filter to delete one RuneDeckCard
     *   }
     * })
     * 
     */
    delete<T extends RuneDeckCardDeleteArgs>(args: SelectSubset<T, RuneDeckCardDeleteArgs<ExtArgs>>): Prisma__RuneDeckCardClient<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RuneDeckCard.
     * @param {RuneDeckCardUpdateArgs} args - Arguments to update one RuneDeckCard.
     * @example
     * // Update one RuneDeckCard
     * const runeDeckCard = await prisma.runeDeckCard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RuneDeckCardUpdateArgs>(args: SelectSubset<T, RuneDeckCardUpdateArgs<ExtArgs>>): Prisma__RuneDeckCardClient<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RuneDeckCards.
     * @param {RuneDeckCardDeleteManyArgs} args - Arguments to filter RuneDeckCards to delete.
     * @example
     * // Delete a few RuneDeckCards
     * const { count } = await prisma.runeDeckCard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RuneDeckCardDeleteManyArgs>(args?: SelectSubset<T, RuneDeckCardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RuneDeckCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RuneDeckCardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RuneDeckCards
     * const runeDeckCard = await prisma.runeDeckCard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RuneDeckCardUpdateManyArgs>(args: SelectSubset<T, RuneDeckCardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RuneDeckCards and returns the data updated in the database.
     * @param {RuneDeckCardUpdateManyAndReturnArgs} args - Arguments to update many RuneDeckCards.
     * @example
     * // Update many RuneDeckCards
     * const runeDeckCard = await prisma.runeDeckCard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RuneDeckCards and only return the `id`
     * const runeDeckCardWithIdOnly = await prisma.runeDeckCard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RuneDeckCardUpdateManyAndReturnArgs>(args: SelectSubset<T, RuneDeckCardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RuneDeckCard.
     * @param {RuneDeckCardUpsertArgs} args - Arguments to update or create a RuneDeckCard.
     * @example
     * // Update or create a RuneDeckCard
     * const runeDeckCard = await prisma.runeDeckCard.upsert({
     *   create: {
     *     // ... data to create a RuneDeckCard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RuneDeckCard we want to update
     *   }
     * })
     */
    upsert<T extends RuneDeckCardUpsertArgs>(args: SelectSubset<T, RuneDeckCardUpsertArgs<ExtArgs>>): Prisma__RuneDeckCardClient<$Result.GetResult<Prisma.$RuneDeckCardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RuneDeckCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RuneDeckCardCountArgs} args - Arguments to filter RuneDeckCards to count.
     * @example
     * // Count the number of RuneDeckCards
     * const count = await prisma.runeDeckCard.count({
     *   where: {
     *     // ... the filter for the RuneDeckCards we want to count
     *   }
     * })
    **/
    count<T extends RuneDeckCardCountArgs>(
      args?: Subset<T, RuneDeckCardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RuneDeckCardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RuneDeckCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RuneDeckCardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RuneDeckCardAggregateArgs>(args: Subset<T, RuneDeckCardAggregateArgs>): Prisma.PrismaPromise<GetRuneDeckCardAggregateType<T>>

    /**
     * Group by RuneDeckCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RuneDeckCardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RuneDeckCardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RuneDeckCardGroupByArgs['orderBy'] }
        : { orderBy?: RuneDeckCardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RuneDeckCardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRuneDeckCardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RuneDeckCard model
   */
  readonly fields: RuneDeckCardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RuneDeckCard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RuneDeckCardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deck<T extends DeckDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DeckDefaultArgs<ExtArgs>>): Prisma__DeckClient<$Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    card<T extends CardDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CardDefinitionDefaultArgs<ExtArgs>>): Prisma__CardDefinitionClient<$Result.GetResult<Prisma.$CardDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RuneDeckCard model
   */
  interface RuneDeckCardFieldRefs {
    readonly id: FieldRef<"RuneDeckCard", 'String'>
    readonly deckId: FieldRef<"RuneDeckCard", 'String'>
    readonly cardId: FieldRef<"RuneDeckCard", 'String'>
    readonly quantity: FieldRef<"RuneDeckCard", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * RuneDeckCard findUnique
   */
  export type RuneDeckCardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which RuneDeckCard to fetch.
     */
    where: RuneDeckCardWhereUniqueInput
  }

  /**
   * RuneDeckCard findUniqueOrThrow
   */
  export type RuneDeckCardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which RuneDeckCard to fetch.
     */
    where: RuneDeckCardWhereUniqueInput
  }

  /**
   * RuneDeckCard findFirst
   */
  export type RuneDeckCardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which RuneDeckCard to fetch.
     */
    where?: RuneDeckCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RuneDeckCards to fetch.
     */
    orderBy?: RuneDeckCardOrderByWithRelationInput | RuneDeckCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RuneDeckCards.
     */
    cursor?: RuneDeckCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RuneDeckCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RuneDeckCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RuneDeckCards.
     */
    distinct?: RuneDeckCardScalarFieldEnum | RuneDeckCardScalarFieldEnum[]
  }

  /**
   * RuneDeckCard findFirstOrThrow
   */
  export type RuneDeckCardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which RuneDeckCard to fetch.
     */
    where?: RuneDeckCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RuneDeckCards to fetch.
     */
    orderBy?: RuneDeckCardOrderByWithRelationInput | RuneDeckCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RuneDeckCards.
     */
    cursor?: RuneDeckCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RuneDeckCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RuneDeckCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RuneDeckCards.
     */
    distinct?: RuneDeckCardScalarFieldEnum | RuneDeckCardScalarFieldEnum[]
  }

  /**
   * RuneDeckCard findMany
   */
  export type RuneDeckCardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * Filter, which RuneDeckCards to fetch.
     */
    where?: RuneDeckCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RuneDeckCards to fetch.
     */
    orderBy?: RuneDeckCardOrderByWithRelationInput | RuneDeckCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RuneDeckCards.
     */
    cursor?: RuneDeckCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RuneDeckCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RuneDeckCards.
     */
    skip?: number
    distinct?: RuneDeckCardScalarFieldEnum | RuneDeckCardScalarFieldEnum[]
  }

  /**
   * RuneDeckCard create
   */
  export type RuneDeckCardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * The data needed to create a RuneDeckCard.
     */
    data: XOR<RuneDeckCardCreateInput, RuneDeckCardUncheckedCreateInput>
  }

  /**
   * RuneDeckCard createMany
   */
  export type RuneDeckCardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RuneDeckCards.
     */
    data: RuneDeckCardCreateManyInput | RuneDeckCardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RuneDeckCard createManyAndReturn
   */
  export type RuneDeckCardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * The data used to create many RuneDeckCards.
     */
    data: RuneDeckCardCreateManyInput | RuneDeckCardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RuneDeckCard update
   */
  export type RuneDeckCardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * The data needed to update a RuneDeckCard.
     */
    data: XOR<RuneDeckCardUpdateInput, RuneDeckCardUncheckedUpdateInput>
    /**
     * Choose, which RuneDeckCard to update.
     */
    where: RuneDeckCardWhereUniqueInput
  }

  /**
   * RuneDeckCard updateMany
   */
  export type RuneDeckCardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RuneDeckCards.
     */
    data: XOR<RuneDeckCardUpdateManyMutationInput, RuneDeckCardUncheckedUpdateManyInput>
    /**
     * Filter which RuneDeckCards to update
     */
    where?: RuneDeckCardWhereInput
    /**
     * Limit how many RuneDeckCards to update.
     */
    limit?: number
  }

  /**
   * RuneDeckCard updateManyAndReturn
   */
  export type RuneDeckCardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * The data used to update RuneDeckCards.
     */
    data: XOR<RuneDeckCardUpdateManyMutationInput, RuneDeckCardUncheckedUpdateManyInput>
    /**
     * Filter which RuneDeckCards to update
     */
    where?: RuneDeckCardWhereInput
    /**
     * Limit how many RuneDeckCards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RuneDeckCard upsert
   */
  export type RuneDeckCardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * The filter to search for the RuneDeckCard to update in case it exists.
     */
    where: RuneDeckCardWhereUniqueInput
    /**
     * In case the RuneDeckCard found by the `where` argument doesn't exist, create a new RuneDeckCard with this data.
     */
    create: XOR<RuneDeckCardCreateInput, RuneDeckCardUncheckedCreateInput>
    /**
     * In case the RuneDeckCard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RuneDeckCardUpdateInput, RuneDeckCardUncheckedUpdateInput>
  }

  /**
   * RuneDeckCard delete
   */
  export type RuneDeckCardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
    /**
     * Filter which RuneDeckCard to delete.
     */
    where: RuneDeckCardWhereUniqueInput
  }

  /**
   * RuneDeckCard deleteMany
   */
  export type RuneDeckCardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RuneDeckCards to delete
     */
    where?: RuneDeckCardWhereInput
    /**
     * Limit how many RuneDeckCards to delete.
     */
    limit?: number
  }

  /**
   * RuneDeckCard without action
   */
  export type RuneDeckCardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RuneDeckCard
     */
    select?: RuneDeckCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RuneDeckCard
     */
    omit?: RuneDeckCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RuneDeckCardInclude<ExtArgs> | null
  }


  /**
   * Model Match
   */

  export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  export type MatchAvgAggregateOutputType = {
    currentRound: number | null
    duration: number | null
  }

  export type MatchSumAggregateOutputType = {
    currentRound: number | null
    duration: number | null
  }

  export type MatchMinAggregateOutputType = {
    id: string | null
    player1Id: string | null
    player1DeckId: string | null
    player2Id: string | null
    player2DeckId: string | null
    status: $Enums.MatchStatus | null
    winnerId: string | null
    winCondition: string | null
    currentRound: number | null
    currentPhase: string | null
    format: string | null
    isRanked: boolean | null
    startedAt: Date | null
    endedAt: Date | null
    duration: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MatchMaxAggregateOutputType = {
    id: string | null
    player1Id: string | null
    player1DeckId: string | null
    player2Id: string | null
    player2DeckId: string | null
    status: $Enums.MatchStatus | null
    winnerId: string | null
    winCondition: string | null
    currentRound: number | null
    currentPhase: string | null
    format: string | null
    isRanked: boolean | null
    startedAt: Date | null
    endedAt: Date | null
    duration: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MatchCountAggregateOutputType = {
    id: number
    player1Id: number
    player1DeckId: number
    player2Id: number
    player2DeckId: number
    status: number
    winnerId: number
    winCondition: number
    currentRound: number
    currentPhase: number
    gameState: number
    format: number
    isRanked: number
    startedAt: number
    endedAt: number
    duration: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MatchAvgAggregateInputType = {
    currentRound?: true
    duration?: true
  }

  export type MatchSumAggregateInputType = {
    currentRound?: true
    duration?: true
  }

  export type MatchMinAggregateInputType = {
    id?: true
    player1Id?: true
    player1DeckId?: true
    player2Id?: true
    player2DeckId?: true
    status?: true
    winnerId?: true
    winCondition?: true
    currentRound?: true
    currentPhase?: true
    format?: true
    isRanked?: true
    startedAt?: true
    endedAt?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MatchMaxAggregateInputType = {
    id?: true
    player1Id?: true
    player1DeckId?: true
    player2Id?: true
    player2DeckId?: true
    status?: true
    winnerId?: true
    winCondition?: true
    currentRound?: true
    currentPhase?: true
    format?: true
    isRanked?: true
    startedAt?: true
    endedAt?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MatchCountAggregateInputType = {
    id?: true
    player1Id?: true
    player1DeckId?: true
    player2Id?: true
    player2DeckId?: true
    status?: true
    winnerId?: true
    winCondition?: true
    currentRound?: true
    currentPhase?: true
    gameState?: true
    format?: true
    isRanked?: true
    startedAt?: true
    endedAt?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType
  }

  export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
        [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatch[P]>
      : GetScalarType<T[P], AggregateMatch[P]>
  }




  export type MatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithAggregationInput | MatchOrderByWithAggregationInput[]
    by: MatchScalarFieldEnum[] | MatchScalarFieldEnum
    having?: MatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCountAggregateInputType | true
    _avg?: MatchAvgAggregateInputType
    _sum?: MatchSumAggregateInputType
    _min?: MatchMinAggregateInputType
    _max?: MatchMaxAggregateInputType
  }

  export type MatchGroupByOutputType = {
    id: string
    player1Id: string
    player1DeckId: string | null
    player2Id: string
    player2DeckId: string | null
    status: $Enums.MatchStatus
    winnerId: string | null
    winCondition: string | null
    currentRound: number
    currentPhase: string | null
    gameState: JsonValue | null
    format: string
    isRanked: boolean
    startedAt: Date | null
    endedAt: Date | null
    duration: number | null
    createdAt: Date
    updatedAt: Date
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchGroupByOutputType[P]>
            : GetScalarType<T[P], MatchGroupByOutputType[P]>
        }
      >
    >


  export type MatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    player1Id?: boolean
    player1DeckId?: boolean
    player2Id?: boolean
    player2DeckId?: boolean
    status?: boolean
    winnerId?: boolean
    winCondition?: boolean
    currentRound?: boolean
    currentPhase?: boolean
    gameState?: boolean
    format?: boolean
    isRanked?: boolean
    startedAt?: boolean
    endedAt?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    player1?: boolean | UserDefaultArgs<ExtArgs>
    player2?: boolean | UserDefaultArgs<ExtArgs>
    events?: boolean | Match$eventsArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    player1Id?: boolean
    player1DeckId?: boolean
    player2Id?: boolean
    player2DeckId?: boolean
    status?: boolean
    winnerId?: boolean
    winCondition?: boolean
    currentRound?: boolean
    currentPhase?: boolean
    gameState?: boolean
    format?: boolean
    isRanked?: boolean
    startedAt?: boolean
    endedAt?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    player1?: boolean | UserDefaultArgs<ExtArgs>
    player2?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    player1Id?: boolean
    player1DeckId?: boolean
    player2Id?: boolean
    player2DeckId?: boolean
    status?: boolean
    winnerId?: boolean
    winCondition?: boolean
    currentRound?: boolean
    currentPhase?: boolean
    gameState?: boolean
    format?: boolean
    isRanked?: boolean
    startedAt?: boolean
    endedAt?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    player1?: boolean | UserDefaultArgs<ExtArgs>
    player2?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectScalar = {
    id?: boolean
    player1Id?: boolean
    player1DeckId?: boolean
    player2Id?: boolean
    player2DeckId?: boolean
    status?: boolean
    winnerId?: boolean
    winCondition?: boolean
    currentRound?: boolean
    currentPhase?: boolean
    gameState?: boolean
    format?: boolean
    isRanked?: boolean
    startedAt?: boolean
    endedAt?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "player1Id" | "player1DeckId" | "player2Id" | "player2DeckId" | "status" | "winnerId" | "winCondition" | "currentRound" | "currentPhase" | "gameState" | "format" | "isRanked" | "startedAt" | "endedAt" | "duration" | "createdAt" | "updatedAt", ExtArgs["result"]["match"]>
  export type MatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player1?: boolean | UserDefaultArgs<ExtArgs>
    player2?: boolean | UserDefaultArgs<ExtArgs>
    events?: boolean | Match$eventsArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player1?: boolean | UserDefaultArgs<ExtArgs>
    player2?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player1?: boolean | UserDefaultArgs<ExtArgs>
    player2?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Match"
    objects: {
      player1: Prisma.$UserPayload<ExtArgs>
      player2: Prisma.$UserPayload<ExtArgs>
      events: Prisma.$MatchEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      player1Id: string
      player1DeckId: string | null
      player2Id: string
      player2DeckId: string | null
      status: $Enums.MatchStatus
      winnerId: string | null
      winCondition: string | null
      currentRound: number
      currentPhase: string | null
      gameState: Prisma.JsonValue | null
      format: string
      isRanked: boolean
      startedAt: Date | null
      endedAt: Date | null
      duration: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["match"]>
    composites: {}
  }

  type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = $Result.GetResult<Prisma.$MatchPayload, S>

  type MatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchCountAggregateInputType | true
    }

  export interface MatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Match'], meta: { name: 'Match' } }
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     * 
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchFindManyArgs>(args?: SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     * 
     */
    create<T extends MatchCreateArgs>(args: SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCreateManyArgs>(args?: SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matches and returns the data saved in the database.
     * @param {MatchCreateManyAndReturnArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     * 
     */
    delete<T extends MatchDeleteArgs>(args: SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchUpdateArgs>(args: SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchUpdateManyArgs>(args: SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches and returns the data updated in the database.
     * @param {MatchUpdateManyAndReturnArgs} args - Arguments to update many Matches.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(
      args?: Subset<T, MatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchAggregateArgs>(args: Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>

    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchGroupByArgs['orderBy'] }
        : { orderBy?: MatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Match model
   */
  readonly fields: MatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Match.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    player1<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    player2<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    events<T extends Match$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Match$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Match model
   */
  interface MatchFieldRefs {
    readonly id: FieldRef<"Match", 'String'>
    readonly player1Id: FieldRef<"Match", 'String'>
    readonly player1DeckId: FieldRef<"Match", 'String'>
    readonly player2Id: FieldRef<"Match", 'String'>
    readonly player2DeckId: FieldRef<"Match", 'String'>
    readonly status: FieldRef<"Match", 'MatchStatus'>
    readonly winnerId: FieldRef<"Match", 'String'>
    readonly winCondition: FieldRef<"Match", 'String'>
    readonly currentRound: FieldRef<"Match", 'Int'>
    readonly currentPhase: FieldRef<"Match", 'String'>
    readonly gameState: FieldRef<"Match", 'Json'>
    readonly format: FieldRef<"Match", 'String'>
    readonly isRanked: FieldRef<"Match", 'Boolean'>
    readonly startedAt: FieldRef<"Match", 'DateTime'>
    readonly endedAt: FieldRef<"Match", 'DateTime'>
    readonly duration: FieldRef<"Match", 'Int'>
    readonly createdAt: FieldRef<"Match", 'DateTime'>
    readonly updatedAt: FieldRef<"Match", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Match findUnique
   */
  export type MatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findUniqueOrThrow
   */
  export type MatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findFirst
   */
  export type MatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findFirstOrThrow
   */
  export type MatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findMany
   */
  export type MatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Matches to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match create
   */
  export type MatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to create a Match.
     */
    data: XOR<MatchCreateInput, MatchUncheckedCreateInput>
  }

  /**
   * Match createMany
   */
  export type MatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Match createManyAndReturn
   */
  export type MatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match update
   */
  export type MatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to update a Match.
     */
    data: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
    /**
     * Choose, which Match to update.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match updateMany
   */
  export type MatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
  }

  /**
   * Match updateManyAndReturn
   */
  export type MatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match upsert
   */
  export type MatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: MatchWhereUniqueInput
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: XOR<MatchCreateInput, MatchUncheckedCreateInput>
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
  }

  /**
   * Match delete
   */
  export type MatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter which Match to delete.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match deleteMany
   */
  export type MatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to delete.
     */
    limit?: number
  }

  /**
   * Match.events
   */
  export type Match$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    where?: MatchEventWhereInput
    orderBy?: MatchEventOrderByWithRelationInput | MatchEventOrderByWithRelationInput[]
    cursor?: MatchEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchEventScalarFieldEnum | MatchEventScalarFieldEnum[]
  }

  /**
   * Match without action
   */
  export type MatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
  }


  /**
   * Model MatchEvent
   */

  export type AggregateMatchEvent = {
    _count: MatchEventCountAggregateOutputType | null
    _avg: MatchEventAvgAggregateOutputType | null
    _sum: MatchEventSumAggregateOutputType | null
    _min: MatchEventMinAggregateOutputType | null
    _max: MatchEventMaxAggregateOutputType | null
  }

  export type MatchEventAvgAggregateOutputType = {
    round: number | null
    sequence: number | null
  }

  export type MatchEventSumAggregateOutputType = {
    round: number | null
    sequence: number | null
  }

  export type MatchEventMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    type: string | null
    round: number | null
    phase: string | null
    playerId: string | null
    sequence: number | null
    timestamp: Date | null
  }

  export type MatchEventMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    type: string | null
    round: number | null
    phase: string | null
    playerId: string | null
    sequence: number | null
    timestamp: Date | null
  }

  export type MatchEventCountAggregateOutputType = {
    id: number
    matchId: number
    type: number
    round: number
    phase: number
    playerId: number
    data: number
    sequence: number
    timestamp: number
    _all: number
  }


  export type MatchEventAvgAggregateInputType = {
    round?: true
    sequence?: true
  }

  export type MatchEventSumAggregateInputType = {
    round?: true
    sequence?: true
  }

  export type MatchEventMinAggregateInputType = {
    id?: true
    matchId?: true
    type?: true
    round?: true
    phase?: true
    playerId?: true
    sequence?: true
    timestamp?: true
  }

  export type MatchEventMaxAggregateInputType = {
    id?: true
    matchId?: true
    type?: true
    round?: true
    phase?: true
    playerId?: true
    sequence?: true
    timestamp?: true
  }

  export type MatchEventCountAggregateInputType = {
    id?: true
    matchId?: true
    type?: true
    round?: true
    phase?: true
    playerId?: true
    data?: true
    sequence?: true
    timestamp?: true
    _all?: true
  }

  export type MatchEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchEvent to aggregate.
     */
    where?: MatchEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchEvents to fetch.
     */
    orderBy?: MatchEventOrderByWithRelationInput | MatchEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MatchEvents
    **/
    _count?: true | MatchEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchEventMaxAggregateInputType
  }

  export type GetMatchEventAggregateType<T extends MatchEventAggregateArgs> = {
        [P in keyof T & keyof AggregateMatchEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatchEvent[P]>
      : GetScalarType<T[P], AggregateMatchEvent[P]>
  }




  export type MatchEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchEventWhereInput
    orderBy?: MatchEventOrderByWithAggregationInput | MatchEventOrderByWithAggregationInput[]
    by: MatchEventScalarFieldEnum[] | MatchEventScalarFieldEnum
    having?: MatchEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchEventCountAggregateInputType | true
    _avg?: MatchEventAvgAggregateInputType
    _sum?: MatchEventSumAggregateInputType
    _min?: MatchEventMinAggregateInputType
    _max?: MatchEventMaxAggregateInputType
  }

  export type MatchEventGroupByOutputType = {
    id: string
    matchId: string
    type: string
    round: number
    phase: string | null
    playerId: string | null
    data: JsonValue
    sequence: number
    timestamp: Date
    _count: MatchEventCountAggregateOutputType | null
    _avg: MatchEventAvgAggregateOutputType | null
    _sum: MatchEventSumAggregateOutputType | null
    _min: MatchEventMinAggregateOutputType | null
    _max: MatchEventMaxAggregateOutputType | null
  }

  type GetMatchEventGroupByPayload<T extends MatchEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchEventGroupByOutputType[P]>
            : GetScalarType<T[P], MatchEventGroupByOutputType[P]>
        }
      >
    >


  export type MatchEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    type?: boolean
    round?: boolean
    phase?: boolean
    playerId?: boolean
    data?: boolean
    sequence?: boolean
    timestamp?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchEvent"]>

  export type MatchEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    type?: boolean
    round?: boolean
    phase?: boolean
    playerId?: boolean
    data?: boolean
    sequence?: boolean
    timestamp?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchEvent"]>

  export type MatchEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    type?: boolean
    round?: boolean
    phase?: boolean
    playerId?: boolean
    data?: boolean
    sequence?: boolean
    timestamp?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchEvent"]>

  export type MatchEventSelectScalar = {
    id?: boolean
    matchId?: boolean
    type?: boolean
    round?: boolean
    phase?: boolean
    playerId?: boolean
    data?: boolean
    sequence?: boolean
    timestamp?: boolean
  }

  export type MatchEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "type" | "round" | "phase" | "playerId" | "data" | "sequence" | "timestamp", ExtArgs["result"]["matchEvent"]>
  export type MatchEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }
  export type MatchEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }
  export type MatchEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }

  export type $MatchEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MatchEvent"
    objects: {
      match: Prisma.$MatchPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      type: string
      round: number
      phase: string | null
      playerId: string | null
      data: Prisma.JsonValue
      sequence: number
      timestamp: Date
    }, ExtArgs["result"]["matchEvent"]>
    composites: {}
  }

  type MatchEventGetPayload<S extends boolean | null | undefined | MatchEventDefaultArgs> = $Result.GetResult<Prisma.$MatchEventPayload, S>

  type MatchEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchEventCountAggregateInputType | true
    }

  export interface MatchEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MatchEvent'], meta: { name: 'MatchEvent' } }
    /**
     * Find zero or one MatchEvent that matches the filter.
     * @param {MatchEventFindUniqueArgs} args - Arguments to find a MatchEvent
     * @example
     * // Get one MatchEvent
     * const matchEvent = await prisma.matchEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchEventFindUniqueArgs>(args: SelectSubset<T, MatchEventFindUniqueArgs<ExtArgs>>): Prisma__MatchEventClient<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MatchEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchEventFindUniqueOrThrowArgs} args - Arguments to find a MatchEvent
     * @example
     * // Get one MatchEvent
     * const matchEvent = await prisma.matchEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchEventFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchEventClient<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventFindFirstArgs} args - Arguments to find a MatchEvent
     * @example
     * // Get one MatchEvent
     * const matchEvent = await prisma.matchEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchEventFindFirstArgs>(args?: SelectSubset<T, MatchEventFindFirstArgs<ExtArgs>>): Prisma__MatchEventClient<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventFindFirstOrThrowArgs} args - Arguments to find a MatchEvent
     * @example
     * // Get one MatchEvent
     * const matchEvent = await prisma.matchEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchEventFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchEventClient<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MatchEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchEvents
     * const matchEvents = await prisma.matchEvent.findMany()
     * 
     * // Get first 10 MatchEvents
     * const matchEvents = await prisma.matchEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchEventWithIdOnly = await prisma.matchEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchEventFindManyArgs>(args?: SelectSubset<T, MatchEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MatchEvent.
     * @param {MatchEventCreateArgs} args - Arguments to create a MatchEvent.
     * @example
     * // Create one MatchEvent
     * const MatchEvent = await prisma.matchEvent.create({
     *   data: {
     *     // ... data to create a MatchEvent
     *   }
     * })
     * 
     */
    create<T extends MatchEventCreateArgs>(args: SelectSubset<T, MatchEventCreateArgs<ExtArgs>>): Prisma__MatchEventClient<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MatchEvents.
     * @param {MatchEventCreateManyArgs} args - Arguments to create many MatchEvents.
     * @example
     * // Create many MatchEvents
     * const matchEvent = await prisma.matchEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchEventCreateManyArgs>(args?: SelectSubset<T, MatchEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MatchEvents and returns the data saved in the database.
     * @param {MatchEventCreateManyAndReturnArgs} args - Arguments to create many MatchEvents.
     * @example
     * // Create many MatchEvents
     * const matchEvent = await prisma.matchEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MatchEvents and only return the `id`
     * const matchEventWithIdOnly = await prisma.matchEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchEventCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MatchEvent.
     * @param {MatchEventDeleteArgs} args - Arguments to delete one MatchEvent.
     * @example
     * // Delete one MatchEvent
     * const MatchEvent = await prisma.matchEvent.delete({
     *   where: {
     *     // ... filter to delete one MatchEvent
     *   }
     * })
     * 
     */
    delete<T extends MatchEventDeleteArgs>(args: SelectSubset<T, MatchEventDeleteArgs<ExtArgs>>): Prisma__MatchEventClient<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MatchEvent.
     * @param {MatchEventUpdateArgs} args - Arguments to update one MatchEvent.
     * @example
     * // Update one MatchEvent
     * const matchEvent = await prisma.matchEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchEventUpdateArgs>(args: SelectSubset<T, MatchEventUpdateArgs<ExtArgs>>): Prisma__MatchEventClient<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MatchEvents.
     * @param {MatchEventDeleteManyArgs} args - Arguments to filter MatchEvents to delete.
     * @example
     * // Delete a few MatchEvents
     * const { count } = await prisma.matchEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchEventDeleteManyArgs>(args?: SelectSubset<T, MatchEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchEvents
     * const matchEvent = await prisma.matchEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchEventUpdateManyArgs>(args: SelectSubset<T, MatchEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchEvents and returns the data updated in the database.
     * @param {MatchEventUpdateManyAndReturnArgs} args - Arguments to update many MatchEvents.
     * @example
     * // Update many MatchEvents
     * const matchEvent = await prisma.matchEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MatchEvents and only return the `id`
     * const matchEventWithIdOnly = await prisma.matchEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchEventUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MatchEvent.
     * @param {MatchEventUpsertArgs} args - Arguments to update or create a MatchEvent.
     * @example
     * // Update or create a MatchEvent
     * const matchEvent = await prisma.matchEvent.upsert({
     *   create: {
     *     // ... data to create a MatchEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchEvent we want to update
     *   }
     * })
     */
    upsert<T extends MatchEventUpsertArgs>(args: SelectSubset<T, MatchEventUpsertArgs<ExtArgs>>): Prisma__MatchEventClient<$Result.GetResult<Prisma.$MatchEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MatchEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventCountArgs} args - Arguments to filter MatchEvents to count.
     * @example
     * // Count the number of MatchEvents
     * const count = await prisma.matchEvent.count({
     *   where: {
     *     // ... the filter for the MatchEvents we want to count
     *   }
     * })
    **/
    count<T extends MatchEventCountArgs>(
      args?: Subset<T, MatchEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MatchEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchEventAggregateArgs>(args: Subset<T, MatchEventAggregateArgs>): Prisma.PrismaPromise<GetMatchEventAggregateType<T>>

    /**
     * Group by MatchEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchEventGroupByArgs['orderBy'] }
        : { orderBy?: MatchEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MatchEvent model
   */
  readonly fields: MatchEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MatchEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends MatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchDefaultArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MatchEvent model
   */
  interface MatchEventFieldRefs {
    readonly id: FieldRef<"MatchEvent", 'String'>
    readonly matchId: FieldRef<"MatchEvent", 'String'>
    readonly type: FieldRef<"MatchEvent", 'String'>
    readonly round: FieldRef<"MatchEvent", 'Int'>
    readonly phase: FieldRef<"MatchEvent", 'String'>
    readonly playerId: FieldRef<"MatchEvent", 'String'>
    readonly data: FieldRef<"MatchEvent", 'Json'>
    readonly sequence: FieldRef<"MatchEvent", 'Int'>
    readonly timestamp: FieldRef<"MatchEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MatchEvent findUnique
   */
  export type MatchEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * Filter, which MatchEvent to fetch.
     */
    where: MatchEventWhereUniqueInput
  }

  /**
   * MatchEvent findUniqueOrThrow
   */
  export type MatchEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * Filter, which MatchEvent to fetch.
     */
    where: MatchEventWhereUniqueInput
  }

  /**
   * MatchEvent findFirst
   */
  export type MatchEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * Filter, which MatchEvent to fetch.
     */
    where?: MatchEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchEvents to fetch.
     */
    orderBy?: MatchEventOrderByWithRelationInput | MatchEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchEvents.
     */
    cursor?: MatchEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchEvents.
     */
    distinct?: MatchEventScalarFieldEnum | MatchEventScalarFieldEnum[]
  }

  /**
   * MatchEvent findFirstOrThrow
   */
  export type MatchEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * Filter, which MatchEvent to fetch.
     */
    where?: MatchEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchEvents to fetch.
     */
    orderBy?: MatchEventOrderByWithRelationInput | MatchEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchEvents.
     */
    cursor?: MatchEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchEvents.
     */
    distinct?: MatchEventScalarFieldEnum | MatchEventScalarFieldEnum[]
  }

  /**
   * MatchEvent findMany
   */
  export type MatchEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * Filter, which MatchEvents to fetch.
     */
    where?: MatchEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchEvents to fetch.
     */
    orderBy?: MatchEventOrderByWithRelationInput | MatchEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MatchEvents.
     */
    cursor?: MatchEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchEvents.
     */
    skip?: number
    distinct?: MatchEventScalarFieldEnum | MatchEventScalarFieldEnum[]
  }

  /**
   * MatchEvent create
   */
  export type MatchEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * The data needed to create a MatchEvent.
     */
    data: XOR<MatchEventCreateInput, MatchEventUncheckedCreateInput>
  }

  /**
   * MatchEvent createMany
   */
  export type MatchEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchEvents.
     */
    data: MatchEventCreateManyInput | MatchEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MatchEvent createManyAndReturn
   */
  export type MatchEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * The data used to create many MatchEvents.
     */
    data: MatchEventCreateManyInput | MatchEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchEvent update
   */
  export type MatchEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * The data needed to update a MatchEvent.
     */
    data: XOR<MatchEventUpdateInput, MatchEventUncheckedUpdateInput>
    /**
     * Choose, which MatchEvent to update.
     */
    where: MatchEventWhereUniqueInput
  }

  /**
   * MatchEvent updateMany
   */
  export type MatchEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchEvents.
     */
    data: XOR<MatchEventUpdateManyMutationInput, MatchEventUncheckedUpdateManyInput>
    /**
     * Filter which MatchEvents to update
     */
    where?: MatchEventWhereInput
    /**
     * Limit how many MatchEvents to update.
     */
    limit?: number
  }

  /**
   * MatchEvent updateManyAndReturn
   */
  export type MatchEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * The data used to update MatchEvents.
     */
    data: XOR<MatchEventUpdateManyMutationInput, MatchEventUncheckedUpdateManyInput>
    /**
     * Filter which MatchEvents to update
     */
    where?: MatchEventWhereInput
    /**
     * Limit how many MatchEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchEvent upsert
   */
  export type MatchEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * The filter to search for the MatchEvent to update in case it exists.
     */
    where: MatchEventWhereUniqueInput
    /**
     * In case the MatchEvent found by the `where` argument doesn't exist, create a new MatchEvent with this data.
     */
    create: XOR<MatchEventCreateInput, MatchEventUncheckedCreateInput>
    /**
     * In case the MatchEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchEventUpdateInput, MatchEventUncheckedUpdateInput>
  }

  /**
   * MatchEvent delete
   */
  export type MatchEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
    /**
     * Filter which MatchEvent to delete.
     */
    where: MatchEventWhereUniqueInput
  }

  /**
   * MatchEvent deleteMany
   */
  export type MatchEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchEvents to delete
     */
    where?: MatchEventWhereInput
    /**
     * Limit how many MatchEvents to delete.
     */
    limit?: number
  }

  /**
   * MatchEvent without action
   */
  export type MatchEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchEvent
     */
    select?: MatchEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchEvent
     */
    omit?: MatchEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchEventInclude<ExtArgs> | null
  }


  /**
   * Model GameSession
   */

  export type AggregateGameSession = {
    _count: GameSessionCountAggregateOutputType | null
    _min: GameSessionMinAggregateOutputType | null
    _max: GameSessionMaxAggregateOutputType | null
  }

  export type GameSessionMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    lastActivity: Date | null
    expiresAt: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GameSessionMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    lastActivity: Date | null
    expiresAt: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GameSessionCountAggregateOutputType = {
    id: number
    matchId: number
    state: number
    lastActivity: number
    expiresAt: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GameSessionMinAggregateInputType = {
    id?: true
    matchId?: true
    lastActivity?: true
    expiresAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GameSessionMaxAggregateInputType = {
    id?: true
    matchId?: true
    lastActivity?: true
    expiresAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GameSessionCountAggregateInputType = {
    id?: true
    matchId?: true
    state?: true
    lastActivity?: true
    expiresAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GameSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSession to aggregate.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameSessions
    **/
    _count?: true | GameSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameSessionMaxAggregateInputType
  }

  export type GetGameSessionAggregateType<T extends GameSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateGameSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameSession[P]>
      : GetScalarType<T[P], AggregateGameSession[P]>
  }




  export type GameSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameSessionWhereInput
    orderBy?: GameSessionOrderByWithAggregationInput | GameSessionOrderByWithAggregationInput[]
    by: GameSessionScalarFieldEnum[] | GameSessionScalarFieldEnum
    having?: GameSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameSessionCountAggregateInputType | true
    _min?: GameSessionMinAggregateInputType
    _max?: GameSessionMaxAggregateInputType
  }

  export type GameSessionGroupByOutputType = {
    id: string
    matchId: string
    state: JsonValue
    lastActivity: Date
    expiresAt: Date
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: GameSessionCountAggregateOutputType | null
    _min: GameSessionMinAggregateOutputType | null
    _max: GameSessionMaxAggregateOutputType | null
  }

  type GetGameSessionGroupByPayload<T extends GameSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameSessionGroupByOutputType[P]>
            : GetScalarType<T[P], GameSessionGroupByOutputType[P]>
        }
      >
    >


  export type GameSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    state?: boolean
    lastActivity?: boolean
    expiresAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    state?: boolean
    lastActivity?: boolean
    expiresAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    state?: boolean
    lastActivity?: boolean
    expiresAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectScalar = {
    id?: boolean
    matchId?: boolean
    state?: boolean
    lastActivity?: boolean
    expiresAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GameSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "state" | "lastActivity" | "expiresAt" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["gameSession"]>

  export type $GameSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      state: Prisma.JsonValue
      lastActivity: Date
      expiresAt: Date
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["gameSession"]>
    composites: {}
  }

  type GameSessionGetPayload<S extends boolean | null | undefined | GameSessionDefaultArgs> = $Result.GetResult<Prisma.$GameSessionPayload, S>

  type GameSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameSessionCountAggregateInputType | true
    }

  export interface GameSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameSession'], meta: { name: 'GameSession' } }
    /**
     * Find zero or one GameSession that matches the filter.
     * @param {GameSessionFindUniqueArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameSessionFindUniqueArgs>(args: SelectSubset<T, GameSessionFindUniqueArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameSessionFindUniqueOrThrowArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, GameSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindFirstArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameSessionFindFirstArgs>(args?: SelectSubset<T, GameSessionFindFirstArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindFirstOrThrowArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, GameSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameSessions
     * const gameSessions = await prisma.gameSession.findMany()
     * 
     * // Get first 10 GameSessions
     * const gameSessions = await prisma.gameSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameSessionFindManyArgs>(args?: SelectSubset<T, GameSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameSession.
     * @param {GameSessionCreateArgs} args - Arguments to create a GameSession.
     * @example
     * // Create one GameSession
     * const GameSession = await prisma.gameSession.create({
     *   data: {
     *     // ... data to create a GameSession
     *   }
     * })
     * 
     */
    create<T extends GameSessionCreateArgs>(args: SelectSubset<T, GameSessionCreateArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameSessions.
     * @param {GameSessionCreateManyArgs} args - Arguments to create many GameSessions.
     * @example
     * // Create many GameSessions
     * const gameSession = await prisma.gameSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameSessionCreateManyArgs>(args?: SelectSubset<T, GameSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameSessions and returns the data saved in the database.
     * @param {GameSessionCreateManyAndReturnArgs} args - Arguments to create many GameSessions.
     * @example
     * // Create many GameSessions
     * const gameSession = await prisma.gameSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameSessions and only return the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, GameSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameSession.
     * @param {GameSessionDeleteArgs} args - Arguments to delete one GameSession.
     * @example
     * // Delete one GameSession
     * const GameSession = await prisma.gameSession.delete({
     *   where: {
     *     // ... filter to delete one GameSession
     *   }
     * })
     * 
     */
    delete<T extends GameSessionDeleteArgs>(args: SelectSubset<T, GameSessionDeleteArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameSession.
     * @param {GameSessionUpdateArgs} args - Arguments to update one GameSession.
     * @example
     * // Update one GameSession
     * const gameSession = await prisma.gameSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameSessionUpdateArgs>(args: SelectSubset<T, GameSessionUpdateArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameSessions.
     * @param {GameSessionDeleteManyArgs} args - Arguments to filter GameSessions to delete.
     * @example
     * // Delete a few GameSessions
     * const { count } = await prisma.gameSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameSessionDeleteManyArgs>(args?: SelectSubset<T, GameSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameSessions
     * const gameSession = await prisma.gameSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameSessionUpdateManyArgs>(args: SelectSubset<T, GameSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessions and returns the data updated in the database.
     * @param {GameSessionUpdateManyAndReturnArgs} args - Arguments to update many GameSessions.
     * @example
     * // Update many GameSessions
     * const gameSession = await prisma.gameSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameSessions and only return the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, GameSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameSession.
     * @param {GameSessionUpsertArgs} args - Arguments to update or create a GameSession.
     * @example
     * // Update or create a GameSession
     * const gameSession = await prisma.gameSession.upsert({
     *   create: {
     *     // ... data to create a GameSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameSession we want to update
     *   }
     * })
     */
    upsert<T extends GameSessionUpsertArgs>(args: SelectSubset<T, GameSessionUpsertArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionCountArgs} args - Arguments to filter GameSessions to count.
     * @example
     * // Count the number of GameSessions
     * const count = await prisma.gameSession.count({
     *   where: {
     *     // ... the filter for the GameSessions we want to count
     *   }
     * })
    **/
    count<T extends GameSessionCountArgs>(
      args?: Subset<T, GameSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameSessionAggregateArgs>(args: Subset<T, GameSessionAggregateArgs>): Prisma.PrismaPromise<GetGameSessionAggregateType<T>>

    /**
     * Group by GameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameSessionGroupByArgs['orderBy'] }
        : { orderBy?: GameSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameSession model
   */
  readonly fields: GameSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameSession model
   */
  interface GameSessionFieldRefs {
    readonly id: FieldRef<"GameSession", 'String'>
    readonly matchId: FieldRef<"GameSession", 'String'>
    readonly state: FieldRef<"GameSession", 'Json'>
    readonly lastActivity: FieldRef<"GameSession", 'DateTime'>
    readonly expiresAt: FieldRef<"GameSession", 'DateTime'>
    readonly isActive: FieldRef<"GameSession", 'Boolean'>
    readonly createdAt: FieldRef<"GameSession", 'DateTime'>
    readonly updatedAt: FieldRef<"GameSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameSession findUnique
   */
  export type GameSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession findUniqueOrThrow
   */
  export type GameSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession findFirst
   */
  export type GameSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession findFirstOrThrow
   */
  export type GameSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession findMany
   */
  export type GameSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Filter, which GameSessions to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession create
   */
  export type GameSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a GameSession.
     */
    data: XOR<GameSessionCreateInput, GameSessionUncheckedCreateInput>
  }

  /**
   * GameSession createMany
   */
  export type GameSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameSessions.
     */
    data: GameSessionCreateManyInput | GameSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameSession createManyAndReturn
   */
  export type GameSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The data used to create many GameSessions.
     */
    data: GameSessionCreateManyInput | GameSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameSession update
   */
  export type GameSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a GameSession.
     */
    data: XOR<GameSessionUpdateInput, GameSessionUncheckedUpdateInput>
    /**
     * Choose, which GameSession to update.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession updateMany
   */
  export type GameSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameSessions.
     */
    data: XOR<GameSessionUpdateManyMutationInput, GameSessionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessions to update
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to update.
     */
    limit?: number
  }

  /**
   * GameSession updateManyAndReturn
   */
  export type GameSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The data used to update GameSessions.
     */
    data: XOR<GameSessionUpdateManyMutationInput, GameSessionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessions to update
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to update.
     */
    limit?: number
  }

  /**
   * GameSession upsert
   */
  export type GameSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the GameSession to update in case it exists.
     */
    where: GameSessionWhereUniqueInput
    /**
     * In case the GameSession found by the `where` argument doesn't exist, create a new GameSession with this data.
     */
    create: XOR<GameSessionCreateInput, GameSessionUncheckedCreateInput>
    /**
     * In case the GameSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameSessionUpdateInput, GameSessionUncheckedUpdateInput>
  }

  /**
   * GameSession delete
   */
  export type GameSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Filter which GameSession to delete.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession deleteMany
   */
  export type GameSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSessions to delete
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to delete.
     */
    limit?: number
  }

  /**
   * GameSession without action
   */
  export type GameSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
  }


  /**
   * Model UserCollection
   */

  export type AggregateUserCollection = {
    _count: UserCollectionCountAggregateOutputType | null
    _avg: UserCollectionAvgAggregateOutputType | null
    _sum: UserCollectionSumAggregateOutputType | null
    _min: UserCollectionMinAggregateOutputType | null
    _max: UserCollectionMaxAggregateOutputType | null
  }

  export type UserCollectionAvgAggregateOutputType = {
    quantity: number | null
  }

  export type UserCollectionSumAggregateOutputType = {
    quantity: number | null
  }

  export type UserCollectionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    cardId: string | null
    quantity: number | null
    foil: boolean | null
    acquiredAt: Date | null
  }

  export type UserCollectionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    cardId: string | null
    quantity: number | null
    foil: boolean | null
    acquiredAt: Date | null
  }

  export type UserCollectionCountAggregateOutputType = {
    id: number
    userId: number
    cardId: number
    quantity: number
    foil: number
    acquiredAt: number
    _all: number
  }


  export type UserCollectionAvgAggregateInputType = {
    quantity?: true
  }

  export type UserCollectionSumAggregateInputType = {
    quantity?: true
  }

  export type UserCollectionMinAggregateInputType = {
    id?: true
    userId?: true
    cardId?: true
    quantity?: true
    foil?: true
    acquiredAt?: true
  }

  export type UserCollectionMaxAggregateInputType = {
    id?: true
    userId?: true
    cardId?: true
    quantity?: true
    foil?: true
    acquiredAt?: true
  }

  export type UserCollectionCountAggregateInputType = {
    id?: true
    userId?: true
    cardId?: true
    quantity?: true
    foil?: true
    acquiredAt?: true
    _all?: true
  }

  export type UserCollectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserCollection to aggregate.
     */
    where?: UserCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCollections to fetch.
     */
    orderBy?: UserCollectionOrderByWithRelationInput | UserCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserCollections
    **/
    _count?: true | UserCollectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserCollectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserCollectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserCollectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserCollectionMaxAggregateInputType
  }

  export type GetUserCollectionAggregateType<T extends UserCollectionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserCollection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserCollection[P]>
      : GetScalarType<T[P], AggregateUserCollection[P]>
  }




  export type UserCollectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserCollectionWhereInput
    orderBy?: UserCollectionOrderByWithAggregationInput | UserCollectionOrderByWithAggregationInput[]
    by: UserCollectionScalarFieldEnum[] | UserCollectionScalarFieldEnum
    having?: UserCollectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCollectionCountAggregateInputType | true
    _avg?: UserCollectionAvgAggregateInputType
    _sum?: UserCollectionSumAggregateInputType
    _min?: UserCollectionMinAggregateInputType
    _max?: UserCollectionMaxAggregateInputType
  }

  export type UserCollectionGroupByOutputType = {
    id: string
    userId: string
    cardId: string
    quantity: number
    foil: boolean
    acquiredAt: Date
    _count: UserCollectionCountAggregateOutputType | null
    _avg: UserCollectionAvgAggregateOutputType | null
    _sum: UserCollectionSumAggregateOutputType | null
    _min: UserCollectionMinAggregateOutputType | null
    _max: UserCollectionMaxAggregateOutputType | null
  }

  type GetUserCollectionGroupByPayload<T extends UserCollectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserCollectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserCollectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserCollectionGroupByOutputType[P]>
            : GetScalarType<T[P], UserCollectionGroupByOutputType[P]>
        }
      >
    >


  export type UserCollectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    cardId?: boolean
    quantity?: boolean
    foil?: boolean
    acquiredAt?: boolean
  }, ExtArgs["result"]["userCollection"]>

  export type UserCollectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    cardId?: boolean
    quantity?: boolean
    foil?: boolean
    acquiredAt?: boolean
  }, ExtArgs["result"]["userCollection"]>

  export type UserCollectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    cardId?: boolean
    quantity?: boolean
    foil?: boolean
    acquiredAt?: boolean
  }, ExtArgs["result"]["userCollection"]>

  export type UserCollectionSelectScalar = {
    id?: boolean
    userId?: boolean
    cardId?: boolean
    quantity?: boolean
    foil?: boolean
    acquiredAt?: boolean
  }

  export type UserCollectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "cardId" | "quantity" | "foil" | "acquiredAt", ExtArgs["result"]["userCollection"]>

  export type $UserCollectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserCollection"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      cardId: string
      quantity: number
      foil: boolean
      acquiredAt: Date
    }, ExtArgs["result"]["userCollection"]>
    composites: {}
  }

  type UserCollectionGetPayload<S extends boolean | null | undefined | UserCollectionDefaultArgs> = $Result.GetResult<Prisma.$UserCollectionPayload, S>

  type UserCollectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserCollectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCollectionCountAggregateInputType | true
    }

  export interface UserCollectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserCollection'], meta: { name: 'UserCollection' } }
    /**
     * Find zero or one UserCollection that matches the filter.
     * @param {UserCollectionFindUniqueArgs} args - Arguments to find a UserCollection
     * @example
     * // Get one UserCollection
     * const userCollection = await prisma.userCollection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserCollectionFindUniqueArgs>(args: SelectSubset<T, UserCollectionFindUniqueArgs<ExtArgs>>): Prisma__UserCollectionClient<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserCollection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserCollectionFindUniqueOrThrowArgs} args - Arguments to find a UserCollection
     * @example
     * // Get one UserCollection
     * const userCollection = await prisma.userCollection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserCollectionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserCollectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserCollectionClient<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCollection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCollectionFindFirstArgs} args - Arguments to find a UserCollection
     * @example
     * // Get one UserCollection
     * const userCollection = await prisma.userCollection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserCollectionFindFirstArgs>(args?: SelectSubset<T, UserCollectionFindFirstArgs<ExtArgs>>): Prisma__UserCollectionClient<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCollection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCollectionFindFirstOrThrowArgs} args - Arguments to find a UserCollection
     * @example
     * // Get one UserCollection
     * const userCollection = await prisma.userCollection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserCollectionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserCollectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserCollectionClient<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserCollections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCollectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserCollections
     * const userCollections = await prisma.userCollection.findMany()
     * 
     * // Get first 10 UserCollections
     * const userCollections = await prisma.userCollection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userCollectionWithIdOnly = await prisma.userCollection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserCollectionFindManyArgs>(args?: SelectSubset<T, UserCollectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserCollection.
     * @param {UserCollectionCreateArgs} args - Arguments to create a UserCollection.
     * @example
     * // Create one UserCollection
     * const UserCollection = await prisma.userCollection.create({
     *   data: {
     *     // ... data to create a UserCollection
     *   }
     * })
     * 
     */
    create<T extends UserCollectionCreateArgs>(args: SelectSubset<T, UserCollectionCreateArgs<ExtArgs>>): Prisma__UserCollectionClient<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserCollections.
     * @param {UserCollectionCreateManyArgs} args - Arguments to create many UserCollections.
     * @example
     * // Create many UserCollections
     * const userCollection = await prisma.userCollection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCollectionCreateManyArgs>(args?: SelectSubset<T, UserCollectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserCollections and returns the data saved in the database.
     * @param {UserCollectionCreateManyAndReturnArgs} args - Arguments to create many UserCollections.
     * @example
     * // Create many UserCollections
     * const userCollection = await prisma.userCollection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserCollections and only return the `id`
     * const userCollectionWithIdOnly = await prisma.userCollection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCollectionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCollectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserCollection.
     * @param {UserCollectionDeleteArgs} args - Arguments to delete one UserCollection.
     * @example
     * // Delete one UserCollection
     * const UserCollection = await prisma.userCollection.delete({
     *   where: {
     *     // ... filter to delete one UserCollection
     *   }
     * })
     * 
     */
    delete<T extends UserCollectionDeleteArgs>(args: SelectSubset<T, UserCollectionDeleteArgs<ExtArgs>>): Prisma__UserCollectionClient<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserCollection.
     * @param {UserCollectionUpdateArgs} args - Arguments to update one UserCollection.
     * @example
     * // Update one UserCollection
     * const userCollection = await prisma.userCollection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserCollectionUpdateArgs>(args: SelectSubset<T, UserCollectionUpdateArgs<ExtArgs>>): Prisma__UserCollectionClient<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserCollections.
     * @param {UserCollectionDeleteManyArgs} args - Arguments to filter UserCollections to delete.
     * @example
     * // Delete a few UserCollections
     * const { count } = await prisma.userCollection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserCollectionDeleteManyArgs>(args?: SelectSubset<T, UserCollectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCollections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCollectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserCollections
     * const userCollection = await prisma.userCollection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserCollectionUpdateManyArgs>(args: SelectSubset<T, UserCollectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCollections and returns the data updated in the database.
     * @param {UserCollectionUpdateManyAndReturnArgs} args - Arguments to update many UserCollections.
     * @example
     * // Update many UserCollections
     * const userCollection = await prisma.userCollection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserCollections and only return the `id`
     * const userCollectionWithIdOnly = await prisma.userCollection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserCollectionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserCollectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserCollection.
     * @param {UserCollectionUpsertArgs} args - Arguments to update or create a UserCollection.
     * @example
     * // Update or create a UserCollection
     * const userCollection = await prisma.userCollection.upsert({
     *   create: {
     *     // ... data to create a UserCollection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserCollection we want to update
     *   }
     * })
     */
    upsert<T extends UserCollectionUpsertArgs>(args: SelectSubset<T, UserCollectionUpsertArgs<ExtArgs>>): Prisma__UserCollectionClient<$Result.GetResult<Prisma.$UserCollectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserCollections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCollectionCountArgs} args - Arguments to filter UserCollections to count.
     * @example
     * // Count the number of UserCollections
     * const count = await prisma.userCollection.count({
     *   where: {
     *     // ... the filter for the UserCollections we want to count
     *   }
     * })
    **/
    count<T extends UserCollectionCountArgs>(
      args?: Subset<T, UserCollectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCollectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserCollection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCollectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserCollectionAggregateArgs>(args: Subset<T, UserCollectionAggregateArgs>): Prisma.PrismaPromise<GetUserCollectionAggregateType<T>>

    /**
     * Group by UserCollection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCollectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserCollectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserCollectionGroupByArgs['orderBy'] }
        : { orderBy?: UserCollectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserCollectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCollectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserCollection model
   */
  readonly fields: UserCollectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserCollection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserCollectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserCollection model
   */
  interface UserCollectionFieldRefs {
    readonly id: FieldRef<"UserCollection", 'String'>
    readonly userId: FieldRef<"UserCollection", 'String'>
    readonly cardId: FieldRef<"UserCollection", 'String'>
    readonly quantity: FieldRef<"UserCollection", 'Int'>
    readonly foil: FieldRef<"UserCollection", 'Boolean'>
    readonly acquiredAt: FieldRef<"UserCollection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserCollection findUnique
   */
  export type UserCollectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * Filter, which UserCollection to fetch.
     */
    where: UserCollectionWhereUniqueInput
  }

  /**
   * UserCollection findUniqueOrThrow
   */
  export type UserCollectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * Filter, which UserCollection to fetch.
     */
    where: UserCollectionWhereUniqueInput
  }

  /**
   * UserCollection findFirst
   */
  export type UserCollectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * Filter, which UserCollection to fetch.
     */
    where?: UserCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCollections to fetch.
     */
    orderBy?: UserCollectionOrderByWithRelationInput | UserCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCollections.
     */
    cursor?: UserCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCollections.
     */
    distinct?: UserCollectionScalarFieldEnum | UserCollectionScalarFieldEnum[]
  }

  /**
   * UserCollection findFirstOrThrow
   */
  export type UserCollectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * Filter, which UserCollection to fetch.
     */
    where?: UserCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCollections to fetch.
     */
    orderBy?: UserCollectionOrderByWithRelationInput | UserCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCollections.
     */
    cursor?: UserCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCollections.
     */
    distinct?: UserCollectionScalarFieldEnum | UserCollectionScalarFieldEnum[]
  }

  /**
   * UserCollection findMany
   */
  export type UserCollectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * Filter, which UserCollections to fetch.
     */
    where?: UserCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCollections to fetch.
     */
    orderBy?: UserCollectionOrderByWithRelationInput | UserCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserCollections.
     */
    cursor?: UserCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCollections.
     */
    skip?: number
    distinct?: UserCollectionScalarFieldEnum | UserCollectionScalarFieldEnum[]
  }

  /**
   * UserCollection create
   */
  export type UserCollectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * The data needed to create a UserCollection.
     */
    data: XOR<UserCollectionCreateInput, UserCollectionUncheckedCreateInput>
  }

  /**
   * UserCollection createMany
   */
  export type UserCollectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserCollections.
     */
    data: UserCollectionCreateManyInput | UserCollectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserCollection createManyAndReturn
   */
  export type UserCollectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * The data used to create many UserCollections.
     */
    data: UserCollectionCreateManyInput | UserCollectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserCollection update
   */
  export type UserCollectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * The data needed to update a UserCollection.
     */
    data: XOR<UserCollectionUpdateInput, UserCollectionUncheckedUpdateInput>
    /**
     * Choose, which UserCollection to update.
     */
    where: UserCollectionWhereUniqueInput
  }

  /**
   * UserCollection updateMany
   */
  export type UserCollectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserCollections.
     */
    data: XOR<UserCollectionUpdateManyMutationInput, UserCollectionUncheckedUpdateManyInput>
    /**
     * Filter which UserCollections to update
     */
    where?: UserCollectionWhereInput
    /**
     * Limit how many UserCollections to update.
     */
    limit?: number
  }

  /**
   * UserCollection updateManyAndReturn
   */
  export type UserCollectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * The data used to update UserCollections.
     */
    data: XOR<UserCollectionUpdateManyMutationInput, UserCollectionUncheckedUpdateManyInput>
    /**
     * Filter which UserCollections to update
     */
    where?: UserCollectionWhereInput
    /**
     * Limit how many UserCollections to update.
     */
    limit?: number
  }

  /**
   * UserCollection upsert
   */
  export type UserCollectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * The filter to search for the UserCollection to update in case it exists.
     */
    where: UserCollectionWhereUniqueInput
    /**
     * In case the UserCollection found by the `where` argument doesn't exist, create a new UserCollection with this data.
     */
    create: XOR<UserCollectionCreateInput, UserCollectionUncheckedCreateInput>
    /**
     * In case the UserCollection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserCollectionUpdateInput, UserCollectionUncheckedUpdateInput>
  }

  /**
   * UserCollection delete
   */
  export type UserCollectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
    /**
     * Filter which UserCollection to delete.
     */
    where: UserCollectionWhereUniqueInput
  }

  /**
   * UserCollection deleteMany
   */
  export type UserCollectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserCollections to delete
     */
    where?: UserCollectionWhereInput
    /**
     * Limit how many UserCollections to delete.
     */
    limit?: number
  }

  /**
   * UserCollection without action
   */
  export type UserCollectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCollection
     */
    select?: UserCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCollection
     */
    omit?: UserCollectionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    passwordHash: 'passwordHash',
    displayName: 'displayName',
    avatarUrl: 'avatarUrl',
    gamesPlayed: 'gamesPlayed',
    gamesWon: 'gamesWon',
    rating: 'rating',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CardDefinitionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    cardType: 'cardType',
    rarity: 'rarity',
    energyCost: 'energyCost',
    powerCosts: 'powerCosts',
    description: 'description',
    flavorText: 'flavorText',
    might: 'might',
    subtypes: 'subtypes',
    domains: 'domains',
    keywords: 'keywords',
    tags: 'tags',
    scriptPath: 'scriptPath',
    hasScript: 'hasScript',
    imageUrl: 'imageUrl',
    artist: 'artist',
    cardNumber: 'cardNumber',
    setCode: 'setCode',
    setName: 'setName',
    isSignature: 'isSignature',
    isBasicRune: 'isBasicRune',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CardDefinitionScalarFieldEnum = (typeof CardDefinitionScalarFieldEnum)[keyof typeof CardDefinitionScalarFieldEnum]


  export const DeckScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    userId: 'userId',
    championLegendId: 'championLegendId',
    chosenChampionId: 'chosenChampionId',
    battlefieldId: 'battlefieldId',
    isValid: 'isValid',
    totalCards: 'totalCards',
    format: 'format',
    playCount: 'playCount',
    winCount: 'winCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DeckScalarFieldEnum = (typeof DeckScalarFieldEnum)[keyof typeof DeckScalarFieldEnum]


  export const MainDeckCardScalarFieldEnum: {
    id: 'id',
    deckId: 'deckId',
    cardId: 'cardId',
    quantity: 'quantity'
  };

  export type MainDeckCardScalarFieldEnum = (typeof MainDeckCardScalarFieldEnum)[keyof typeof MainDeckCardScalarFieldEnum]


  export const RuneDeckCardScalarFieldEnum: {
    id: 'id',
    deckId: 'deckId',
    cardId: 'cardId',
    quantity: 'quantity'
  };

  export type RuneDeckCardScalarFieldEnum = (typeof RuneDeckCardScalarFieldEnum)[keyof typeof RuneDeckCardScalarFieldEnum]


  export const MatchScalarFieldEnum: {
    id: 'id',
    player1Id: 'player1Id',
    player1DeckId: 'player1DeckId',
    player2Id: 'player2Id',
    player2DeckId: 'player2DeckId',
    status: 'status',
    winnerId: 'winnerId',
    winCondition: 'winCondition',
    currentRound: 'currentRound',
    currentPhase: 'currentPhase',
    gameState: 'gameState',
    format: 'format',
    isRanked: 'isRanked',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    duration: 'duration',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum]


  export const MatchEventScalarFieldEnum: {
    id: 'id',
    matchId: 'matchId',
    type: 'type',
    round: 'round',
    phase: 'phase',
    playerId: 'playerId',
    data: 'data',
    sequence: 'sequence',
    timestamp: 'timestamp'
  };

  export type MatchEventScalarFieldEnum = (typeof MatchEventScalarFieldEnum)[keyof typeof MatchEventScalarFieldEnum]


  export const GameSessionScalarFieldEnum: {
    id: 'id',
    matchId: 'matchId',
    state: 'state',
    lastActivity: 'lastActivity',
    expiresAt: 'expiresAt',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GameSessionScalarFieldEnum = (typeof GameSessionScalarFieldEnum)[keyof typeof GameSessionScalarFieldEnum]


  export const UserCollectionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    cardId: 'cardId',
    quantity: 'quantity',
    foil: 'foil',
    acquiredAt: 'acquiredAt'
  };

  export type UserCollectionScalarFieldEnum = (typeof UserCollectionScalarFieldEnum)[keyof typeof UserCollectionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'CardType'
   */
  export type EnumCardTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CardType'>
    


  /**
   * Reference to a field of type 'CardType[]'
   */
  export type ListEnumCardTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CardType[]'>
    


  /**
   * Reference to a field of type 'Rarity'
   */
  export type EnumRarityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Rarity'>
    


  /**
   * Reference to a field of type 'Rarity[]'
   */
  export type ListEnumRarityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Rarity[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'MatchStatus'
   */
  export type EnumMatchStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchStatus'>
    


  /**
   * Reference to a field of type 'MatchStatus[]'
   */
  export type ListEnumMatchStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    displayName?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    gamesPlayed?: IntFilter<"User"> | number
    gamesWon?: IntFilter<"User"> | number
    rating?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    decks?: DeckListRelationFilter
    gamesAsPlayer1?: MatchListRelationFilter
    gamesAsPlayer2?: MatchListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    decks?: DeckOrderByRelationAggregateInput
    gamesAsPlayer1?: MatchOrderByRelationAggregateInput
    gamesAsPlayer2?: MatchOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    displayName?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    gamesPlayed?: IntFilter<"User"> | number
    gamesWon?: IntFilter<"User"> | number
    rating?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    decks?: DeckListRelationFilter
    gamesAsPlayer1?: MatchListRelationFilter
    gamesAsPlayer2?: MatchListRelationFilter
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    displayName?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    gamesPlayed?: IntWithAggregatesFilter<"User"> | number
    gamesWon?: IntWithAggregatesFilter<"User"> | number
    rating?: IntWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CardDefinitionWhereInput = {
    AND?: CardDefinitionWhereInput | CardDefinitionWhereInput[]
    OR?: CardDefinitionWhereInput[]
    NOT?: CardDefinitionWhereInput | CardDefinitionWhereInput[]
    id?: StringFilter<"CardDefinition"> | string
    name?: StringFilter<"CardDefinition"> | string
    cardType?: EnumCardTypeFilter<"CardDefinition"> | $Enums.CardType
    rarity?: EnumRarityFilter<"CardDefinition"> | $Enums.Rarity
    energyCost?: IntFilter<"CardDefinition"> | number
    powerCosts?: JsonFilter<"CardDefinition">
    description?: StringFilter<"CardDefinition"> | string
    flavorText?: StringNullableFilter<"CardDefinition"> | string | null
    might?: IntNullableFilter<"CardDefinition"> | number | null
    subtypes?: JsonFilter<"CardDefinition">
    domains?: JsonFilter<"CardDefinition">
    keywords?: JsonFilter<"CardDefinition">
    tags?: JsonFilter<"CardDefinition">
    scriptPath?: StringNullableFilter<"CardDefinition"> | string | null
    hasScript?: BoolFilter<"CardDefinition"> | boolean
    imageUrl?: StringNullableFilter<"CardDefinition"> | string | null
    artist?: StringNullableFilter<"CardDefinition"> | string | null
    cardNumber?: StringNullableFilter<"CardDefinition"> | string | null
    setCode?: StringNullableFilter<"CardDefinition"> | string | null
    setName?: StringNullableFilter<"CardDefinition"> | string | null
    isSignature?: BoolFilter<"CardDefinition"> | boolean
    isBasicRune?: BoolFilter<"CardDefinition"> | boolean
    createdAt?: DateTimeFilter<"CardDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"CardDefinition"> | Date | string
    decksAsLegend?: DeckListRelationFilter
    decksAsChampion?: DeckListRelationFilter
    decksAsBattlefield?: DeckListRelationFilter
    mainDeckCards?: MainDeckCardListRelationFilter
    runeDeckCards?: RuneDeckCardListRelationFilter
  }

  export type CardDefinitionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    cardType?: SortOrder
    rarity?: SortOrder
    energyCost?: SortOrder
    powerCosts?: SortOrder
    description?: SortOrder
    flavorText?: SortOrderInput | SortOrder
    might?: SortOrderInput | SortOrder
    subtypes?: SortOrder
    domains?: SortOrder
    keywords?: SortOrder
    tags?: SortOrder
    scriptPath?: SortOrderInput | SortOrder
    hasScript?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    artist?: SortOrderInput | SortOrder
    cardNumber?: SortOrderInput | SortOrder
    setCode?: SortOrderInput | SortOrder
    setName?: SortOrderInput | SortOrder
    isSignature?: SortOrder
    isBasicRune?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    decksAsLegend?: DeckOrderByRelationAggregateInput
    decksAsChampion?: DeckOrderByRelationAggregateInput
    decksAsBattlefield?: DeckOrderByRelationAggregateInput
    mainDeckCards?: MainDeckCardOrderByRelationAggregateInput
    runeDeckCards?: RuneDeckCardOrderByRelationAggregateInput
  }

  export type CardDefinitionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CardDefinitionWhereInput | CardDefinitionWhereInput[]
    OR?: CardDefinitionWhereInput[]
    NOT?: CardDefinitionWhereInput | CardDefinitionWhereInput[]
    name?: StringFilter<"CardDefinition"> | string
    cardType?: EnumCardTypeFilter<"CardDefinition"> | $Enums.CardType
    rarity?: EnumRarityFilter<"CardDefinition"> | $Enums.Rarity
    energyCost?: IntFilter<"CardDefinition"> | number
    powerCosts?: JsonFilter<"CardDefinition">
    description?: StringFilter<"CardDefinition"> | string
    flavorText?: StringNullableFilter<"CardDefinition"> | string | null
    might?: IntNullableFilter<"CardDefinition"> | number | null
    subtypes?: JsonFilter<"CardDefinition">
    domains?: JsonFilter<"CardDefinition">
    keywords?: JsonFilter<"CardDefinition">
    tags?: JsonFilter<"CardDefinition">
    scriptPath?: StringNullableFilter<"CardDefinition"> | string | null
    hasScript?: BoolFilter<"CardDefinition"> | boolean
    imageUrl?: StringNullableFilter<"CardDefinition"> | string | null
    artist?: StringNullableFilter<"CardDefinition"> | string | null
    cardNumber?: StringNullableFilter<"CardDefinition"> | string | null
    setCode?: StringNullableFilter<"CardDefinition"> | string | null
    setName?: StringNullableFilter<"CardDefinition"> | string | null
    isSignature?: BoolFilter<"CardDefinition"> | boolean
    isBasicRune?: BoolFilter<"CardDefinition"> | boolean
    createdAt?: DateTimeFilter<"CardDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"CardDefinition"> | Date | string
    decksAsLegend?: DeckListRelationFilter
    decksAsChampion?: DeckListRelationFilter
    decksAsBattlefield?: DeckListRelationFilter
    mainDeckCards?: MainDeckCardListRelationFilter
    runeDeckCards?: RuneDeckCardListRelationFilter
  }, "id">

  export type CardDefinitionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    cardType?: SortOrder
    rarity?: SortOrder
    energyCost?: SortOrder
    powerCosts?: SortOrder
    description?: SortOrder
    flavorText?: SortOrderInput | SortOrder
    might?: SortOrderInput | SortOrder
    subtypes?: SortOrder
    domains?: SortOrder
    keywords?: SortOrder
    tags?: SortOrder
    scriptPath?: SortOrderInput | SortOrder
    hasScript?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    artist?: SortOrderInput | SortOrder
    cardNumber?: SortOrderInput | SortOrder
    setCode?: SortOrderInput | SortOrder
    setName?: SortOrderInput | SortOrder
    isSignature?: SortOrder
    isBasicRune?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CardDefinitionCountOrderByAggregateInput
    _avg?: CardDefinitionAvgOrderByAggregateInput
    _max?: CardDefinitionMaxOrderByAggregateInput
    _min?: CardDefinitionMinOrderByAggregateInput
    _sum?: CardDefinitionSumOrderByAggregateInput
  }

  export type CardDefinitionScalarWhereWithAggregatesInput = {
    AND?: CardDefinitionScalarWhereWithAggregatesInput | CardDefinitionScalarWhereWithAggregatesInput[]
    OR?: CardDefinitionScalarWhereWithAggregatesInput[]
    NOT?: CardDefinitionScalarWhereWithAggregatesInput | CardDefinitionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CardDefinition"> | string
    name?: StringWithAggregatesFilter<"CardDefinition"> | string
    cardType?: EnumCardTypeWithAggregatesFilter<"CardDefinition"> | $Enums.CardType
    rarity?: EnumRarityWithAggregatesFilter<"CardDefinition"> | $Enums.Rarity
    energyCost?: IntWithAggregatesFilter<"CardDefinition"> | number
    powerCosts?: JsonWithAggregatesFilter<"CardDefinition">
    description?: StringWithAggregatesFilter<"CardDefinition"> | string
    flavorText?: StringNullableWithAggregatesFilter<"CardDefinition"> | string | null
    might?: IntNullableWithAggregatesFilter<"CardDefinition"> | number | null
    subtypes?: JsonWithAggregatesFilter<"CardDefinition">
    domains?: JsonWithAggregatesFilter<"CardDefinition">
    keywords?: JsonWithAggregatesFilter<"CardDefinition">
    tags?: JsonWithAggregatesFilter<"CardDefinition">
    scriptPath?: StringNullableWithAggregatesFilter<"CardDefinition"> | string | null
    hasScript?: BoolWithAggregatesFilter<"CardDefinition"> | boolean
    imageUrl?: StringNullableWithAggregatesFilter<"CardDefinition"> | string | null
    artist?: StringNullableWithAggregatesFilter<"CardDefinition"> | string | null
    cardNumber?: StringNullableWithAggregatesFilter<"CardDefinition"> | string | null
    setCode?: StringNullableWithAggregatesFilter<"CardDefinition"> | string | null
    setName?: StringNullableWithAggregatesFilter<"CardDefinition"> | string | null
    isSignature?: BoolWithAggregatesFilter<"CardDefinition"> | boolean
    isBasicRune?: BoolWithAggregatesFilter<"CardDefinition"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CardDefinition"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CardDefinition"> | Date | string
  }

  export type DeckWhereInput = {
    AND?: DeckWhereInput | DeckWhereInput[]
    OR?: DeckWhereInput[]
    NOT?: DeckWhereInput | DeckWhereInput[]
    id?: StringFilter<"Deck"> | string
    name?: StringFilter<"Deck"> | string
    description?: StringNullableFilter<"Deck"> | string | null
    userId?: StringFilter<"Deck"> | string
    championLegendId?: StringFilter<"Deck"> | string
    chosenChampionId?: StringFilter<"Deck"> | string
    battlefieldId?: StringFilter<"Deck"> | string
    isValid?: BoolFilter<"Deck"> | boolean
    totalCards?: IntFilter<"Deck"> | number
    format?: StringFilter<"Deck"> | string
    playCount?: IntFilter<"Deck"> | number
    winCount?: IntFilter<"Deck"> | number
    createdAt?: DateTimeFilter<"Deck"> | Date | string
    updatedAt?: DateTimeFilter<"Deck"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    championLegend?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
    chosenChampion?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
    battlefield?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
    mainDeck?: MainDeckCardListRelationFilter
    runeDeck?: RuneDeckCardListRelationFilter
  }

  export type DeckOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    userId?: SortOrder
    championLegendId?: SortOrder
    chosenChampionId?: SortOrder
    battlefieldId?: SortOrder
    isValid?: SortOrder
    totalCards?: SortOrder
    format?: SortOrder
    playCount?: SortOrder
    winCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    championLegend?: CardDefinitionOrderByWithRelationInput
    chosenChampion?: CardDefinitionOrderByWithRelationInput
    battlefield?: CardDefinitionOrderByWithRelationInput
    mainDeck?: MainDeckCardOrderByRelationAggregateInput
    runeDeck?: RuneDeckCardOrderByRelationAggregateInput
  }

  export type DeckWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeckWhereInput | DeckWhereInput[]
    OR?: DeckWhereInput[]
    NOT?: DeckWhereInput | DeckWhereInput[]
    name?: StringFilter<"Deck"> | string
    description?: StringNullableFilter<"Deck"> | string | null
    userId?: StringFilter<"Deck"> | string
    championLegendId?: StringFilter<"Deck"> | string
    chosenChampionId?: StringFilter<"Deck"> | string
    battlefieldId?: StringFilter<"Deck"> | string
    isValid?: BoolFilter<"Deck"> | boolean
    totalCards?: IntFilter<"Deck"> | number
    format?: StringFilter<"Deck"> | string
    playCount?: IntFilter<"Deck"> | number
    winCount?: IntFilter<"Deck"> | number
    createdAt?: DateTimeFilter<"Deck"> | Date | string
    updatedAt?: DateTimeFilter<"Deck"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    championLegend?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
    chosenChampion?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
    battlefield?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
    mainDeck?: MainDeckCardListRelationFilter
    runeDeck?: RuneDeckCardListRelationFilter
  }, "id">

  export type DeckOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    userId?: SortOrder
    championLegendId?: SortOrder
    chosenChampionId?: SortOrder
    battlefieldId?: SortOrder
    isValid?: SortOrder
    totalCards?: SortOrder
    format?: SortOrder
    playCount?: SortOrder
    winCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DeckCountOrderByAggregateInput
    _avg?: DeckAvgOrderByAggregateInput
    _max?: DeckMaxOrderByAggregateInput
    _min?: DeckMinOrderByAggregateInput
    _sum?: DeckSumOrderByAggregateInput
  }

  export type DeckScalarWhereWithAggregatesInput = {
    AND?: DeckScalarWhereWithAggregatesInput | DeckScalarWhereWithAggregatesInput[]
    OR?: DeckScalarWhereWithAggregatesInput[]
    NOT?: DeckScalarWhereWithAggregatesInput | DeckScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Deck"> | string
    name?: StringWithAggregatesFilter<"Deck"> | string
    description?: StringNullableWithAggregatesFilter<"Deck"> | string | null
    userId?: StringWithAggregatesFilter<"Deck"> | string
    championLegendId?: StringWithAggregatesFilter<"Deck"> | string
    chosenChampionId?: StringWithAggregatesFilter<"Deck"> | string
    battlefieldId?: StringWithAggregatesFilter<"Deck"> | string
    isValid?: BoolWithAggregatesFilter<"Deck"> | boolean
    totalCards?: IntWithAggregatesFilter<"Deck"> | number
    format?: StringWithAggregatesFilter<"Deck"> | string
    playCount?: IntWithAggregatesFilter<"Deck"> | number
    winCount?: IntWithAggregatesFilter<"Deck"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Deck"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Deck"> | Date | string
  }

  export type MainDeckCardWhereInput = {
    AND?: MainDeckCardWhereInput | MainDeckCardWhereInput[]
    OR?: MainDeckCardWhereInput[]
    NOT?: MainDeckCardWhereInput | MainDeckCardWhereInput[]
    id?: StringFilter<"MainDeckCard"> | string
    deckId?: StringFilter<"MainDeckCard"> | string
    cardId?: StringFilter<"MainDeckCard"> | string
    quantity?: IntFilter<"MainDeckCard"> | number
    deck?: XOR<DeckScalarRelationFilter, DeckWhereInput>
    card?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
  }

  export type MainDeckCardOrderByWithRelationInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    deck?: DeckOrderByWithRelationInput
    card?: CardDefinitionOrderByWithRelationInput
  }

  export type MainDeckCardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    deckId_cardId?: MainDeckCardDeckIdCardIdCompoundUniqueInput
    AND?: MainDeckCardWhereInput | MainDeckCardWhereInput[]
    OR?: MainDeckCardWhereInput[]
    NOT?: MainDeckCardWhereInput | MainDeckCardWhereInput[]
    deckId?: StringFilter<"MainDeckCard"> | string
    cardId?: StringFilter<"MainDeckCard"> | string
    quantity?: IntFilter<"MainDeckCard"> | number
    deck?: XOR<DeckScalarRelationFilter, DeckWhereInput>
    card?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
  }, "id" | "deckId_cardId">

  export type MainDeckCardOrderByWithAggregationInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    _count?: MainDeckCardCountOrderByAggregateInput
    _avg?: MainDeckCardAvgOrderByAggregateInput
    _max?: MainDeckCardMaxOrderByAggregateInput
    _min?: MainDeckCardMinOrderByAggregateInput
    _sum?: MainDeckCardSumOrderByAggregateInput
  }

  export type MainDeckCardScalarWhereWithAggregatesInput = {
    AND?: MainDeckCardScalarWhereWithAggregatesInput | MainDeckCardScalarWhereWithAggregatesInput[]
    OR?: MainDeckCardScalarWhereWithAggregatesInput[]
    NOT?: MainDeckCardScalarWhereWithAggregatesInput | MainDeckCardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MainDeckCard"> | string
    deckId?: StringWithAggregatesFilter<"MainDeckCard"> | string
    cardId?: StringWithAggregatesFilter<"MainDeckCard"> | string
    quantity?: IntWithAggregatesFilter<"MainDeckCard"> | number
  }

  export type RuneDeckCardWhereInput = {
    AND?: RuneDeckCardWhereInput | RuneDeckCardWhereInput[]
    OR?: RuneDeckCardWhereInput[]
    NOT?: RuneDeckCardWhereInput | RuneDeckCardWhereInput[]
    id?: StringFilter<"RuneDeckCard"> | string
    deckId?: StringFilter<"RuneDeckCard"> | string
    cardId?: StringFilter<"RuneDeckCard"> | string
    quantity?: IntFilter<"RuneDeckCard"> | number
    deck?: XOR<DeckScalarRelationFilter, DeckWhereInput>
    card?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
  }

  export type RuneDeckCardOrderByWithRelationInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    deck?: DeckOrderByWithRelationInput
    card?: CardDefinitionOrderByWithRelationInput
  }

  export type RuneDeckCardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    deckId_cardId?: RuneDeckCardDeckIdCardIdCompoundUniqueInput
    AND?: RuneDeckCardWhereInput | RuneDeckCardWhereInput[]
    OR?: RuneDeckCardWhereInput[]
    NOT?: RuneDeckCardWhereInput | RuneDeckCardWhereInput[]
    deckId?: StringFilter<"RuneDeckCard"> | string
    cardId?: StringFilter<"RuneDeckCard"> | string
    quantity?: IntFilter<"RuneDeckCard"> | number
    deck?: XOR<DeckScalarRelationFilter, DeckWhereInput>
    card?: XOR<CardDefinitionScalarRelationFilter, CardDefinitionWhereInput>
  }, "id" | "deckId_cardId">

  export type RuneDeckCardOrderByWithAggregationInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    _count?: RuneDeckCardCountOrderByAggregateInput
    _avg?: RuneDeckCardAvgOrderByAggregateInput
    _max?: RuneDeckCardMaxOrderByAggregateInput
    _min?: RuneDeckCardMinOrderByAggregateInput
    _sum?: RuneDeckCardSumOrderByAggregateInput
  }

  export type RuneDeckCardScalarWhereWithAggregatesInput = {
    AND?: RuneDeckCardScalarWhereWithAggregatesInput | RuneDeckCardScalarWhereWithAggregatesInput[]
    OR?: RuneDeckCardScalarWhereWithAggregatesInput[]
    NOT?: RuneDeckCardScalarWhereWithAggregatesInput | RuneDeckCardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RuneDeckCard"> | string
    deckId?: StringWithAggregatesFilter<"RuneDeckCard"> | string
    cardId?: StringWithAggregatesFilter<"RuneDeckCard"> | string
    quantity?: IntWithAggregatesFilter<"RuneDeckCard"> | number
  }

  export type MatchWhereInput = {
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    id?: StringFilter<"Match"> | string
    player1Id?: StringFilter<"Match"> | string
    player1DeckId?: StringNullableFilter<"Match"> | string | null
    player2Id?: StringFilter<"Match"> | string
    player2DeckId?: StringNullableFilter<"Match"> | string | null
    status?: EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus
    winnerId?: StringNullableFilter<"Match"> | string | null
    winCondition?: StringNullableFilter<"Match"> | string | null
    currentRound?: IntFilter<"Match"> | number
    currentPhase?: StringNullableFilter<"Match"> | string | null
    gameState?: JsonNullableFilter<"Match">
    format?: StringFilter<"Match"> | string
    isRanked?: BoolFilter<"Match"> | boolean
    startedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    duration?: IntNullableFilter<"Match"> | number | null
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    player1?: XOR<UserScalarRelationFilter, UserWhereInput>
    player2?: XOR<UserScalarRelationFilter, UserWhereInput>
    events?: MatchEventListRelationFilter
  }

  export type MatchOrderByWithRelationInput = {
    id?: SortOrder
    player1Id?: SortOrder
    player1DeckId?: SortOrderInput | SortOrder
    player2Id?: SortOrder
    player2DeckId?: SortOrderInput | SortOrder
    status?: SortOrder
    winnerId?: SortOrderInput | SortOrder
    winCondition?: SortOrderInput | SortOrder
    currentRound?: SortOrder
    currentPhase?: SortOrderInput | SortOrder
    gameState?: SortOrderInput | SortOrder
    format?: SortOrder
    isRanked?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    player1?: UserOrderByWithRelationInput
    player2?: UserOrderByWithRelationInput
    events?: MatchEventOrderByRelationAggregateInput
  }

  export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    player1Id?: StringFilter<"Match"> | string
    player1DeckId?: StringNullableFilter<"Match"> | string | null
    player2Id?: StringFilter<"Match"> | string
    player2DeckId?: StringNullableFilter<"Match"> | string | null
    status?: EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus
    winnerId?: StringNullableFilter<"Match"> | string | null
    winCondition?: StringNullableFilter<"Match"> | string | null
    currentRound?: IntFilter<"Match"> | number
    currentPhase?: StringNullableFilter<"Match"> | string | null
    gameState?: JsonNullableFilter<"Match">
    format?: StringFilter<"Match"> | string
    isRanked?: BoolFilter<"Match"> | boolean
    startedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    duration?: IntNullableFilter<"Match"> | number | null
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    player1?: XOR<UserScalarRelationFilter, UserWhereInput>
    player2?: XOR<UserScalarRelationFilter, UserWhereInput>
    events?: MatchEventListRelationFilter
  }, "id">

  export type MatchOrderByWithAggregationInput = {
    id?: SortOrder
    player1Id?: SortOrder
    player1DeckId?: SortOrderInput | SortOrder
    player2Id?: SortOrder
    player2DeckId?: SortOrderInput | SortOrder
    status?: SortOrder
    winnerId?: SortOrderInput | SortOrder
    winCondition?: SortOrderInput | SortOrder
    currentRound?: SortOrder
    currentPhase?: SortOrderInput | SortOrder
    gameState?: SortOrderInput | SortOrder
    format?: SortOrder
    isRanked?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MatchCountOrderByAggregateInput
    _avg?: MatchAvgOrderByAggregateInput
    _max?: MatchMaxOrderByAggregateInput
    _min?: MatchMinOrderByAggregateInput
    _sum?: MatchSumOrderByAggregateInput
  }

  export type MatchScalarWhereWithAggregatesInput = {
    AND?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    OR?: MatchScalarWhereWithAggregatesInput[]
    NOT?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Match"> | string
    player1Id?: StringWithAggregatesFilter<"Match"> | string
    player1DeckId?: StringNullableWithAggregatesFilter<"Match"> | string | null
    player2Id?: StringWithAggregatesFilter<"Match"> | string
    player2DeckId?: StringNullableWithAggregatesFilter<"Match"> | string | null
    status?: EnumMatchStatusWithAggregatesFilter<"Match"> | $Enums.MatchStatus
    winnerId?: StringNullableWithAggregatesFilter<"Match"> | string | null
    winCondition?: StringNullableWithAggregatesFilter<"Match"> | string | null
    currentRound?: IntWithAggregatesFilter<"Match"> | number
    currentPhase?: StringNullableWithAggregatesFilter<"Match"> | string | null
    gameState?: JsonNullableWithAggregatesFilter<"Match">
    format?: StringWithAggregatesFilter<"Match"> | string
    isRanked?: BoolWithAggregatesFilter<"Match"> | boolean
    startedAt?: DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null
    duration?: IntNullableWithAggregatesFilter<"Match"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
  }

  export type MatchEventWhereInput = {
    AND?: MatchEventWhereInput | MatchEventWhereInput[]
    OR?: MatchEventWhereInput[]
    NOT?: MatchEventWhereInput | MatchEventWhereInput[]
    id?: StringFilter<"MatchEvent"> | string
    matchId?: StringFilter<"MatchEvent"> | string
    type?: StringFilter<"MatchEvent"> | string
    round?: IntFilter<"MatchEvent"> | number
    phase?: StringNullableFilter<"MatchEvent"> | string | null
    playerId?: StringNullableFilter<"MatchEvent"> | string | null
    data?: JsonFilter<"MatchEvent">
    sequence?: IntFilter<"MatchEvent"> | number
    timestamp?: DateTimeFilter<"MatchEvent"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
  }

  export type MatchEventOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    type?: SortOrder
    round?: SortOrder
    phase?: SortOrderInput | SortOrder
    playerId?: SortOrderInput | SortOrder
    data?: SortOrder
    sequence?: SortOrder
    timestamp?: SortOrder
    match?: MatchOrderByWithRelationInput
  }

  export type MatchEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchEventWhereInput | MatchEventWhereInput[]
    OR?: MatchEventWhereInput[]
    NOT?: MatchEventWhereInput | MatchEventWhereInput[]
    matchId?: StringFilter<"MatchEvent"> | string
    type?: StringFilter<"MatchEvent"> | string
    round?: IntFilter<"MatchEvent"> | number
    phase?: StringNullableFilter<"MatchEvent"> | string | null
    playerId?: StringNullableFilter<"MatchEvent"> | string | null
    data?: JsonFilter<"MatchEvent">
    sequence?: IntFilter<"MatchEvent"> | number
    timestamp?: DateTimeFilter<"MatchEvent"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
  }, "id">

  export type MatchEventOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    type?: SortOrder
    round?: SortOrder
    phase?: SortOrderInput | SortOrder
    playerId?: SortOrderInput | SortOrder
    data?: SortOrder
    sequence?: SortOrder
    timestamp?: SortOrder
    _count?: MatchEventCountOrderByAggregateInput
    _avg?: MatchEventAvgOrderByAggregateInput
    _max?: MatchEventMaxOrderByAggregateInput
    _min?: MatchEventMinOrderByAggregateInput
    _sum?: MatchEventSumOrderByAggregateInput
  }

  export type MatchEventScalarWhereWithAggregatesInput = {
    AND?: MatchEventScalarWhereWithAggregatesInput | MatchEventScalarWhereWithAggregatesInput[]
    OR?: MatchEventScalarWhereWithAggregatesInput[]
    NOT?: MatchEventScalarWhereWithAggregatesInput | MatchEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MatchEvent"> | string
    matchId?: StringWithAggregatesFilter<"MatchEvent"> | string
    type?: StringWithAggregatesFilter<"MatchEvent"> | string
    round?: IntWithAggregatesFilter<"MatchEvent"> | number
    phase?: StringNullableWithAggregatesFilter<"MatchEvent"> | string | null
    playerId?: StringNullableWithAggregatesFilter<"MatchEvent"> | string | null
    data?: JsonWithAggregatesFilter<"MatchEvent">
    sequence?: IntWithAggregatesFilter<"MatchEvent"> | number
    timestamp?: DateTimeWithAggregatesFilter<"MatchEvent"> | Date | string
  }

  export type GameSessionWhereInput = {
    AND?: GameSessionWhereInput | GameSessionWhereInput[]
    OR?: GameSessionWhereInput[]
    NOT?: GameSessionWhereInput | GameSessionWhereInput[]
    id?: StringFilter<"GameSession"> | string
    matchId?: StringFilter<"GameSession"> | string
    state?: JsonFilter<"GameSession">
    lastActivity?: DateTimeFilter<"GameSession"> | Date | string
    expiresAt?: DateTimeFilter<"GameSession"> | Date | string
    isActive?: BoolFilter<"GameSession"> | boolean
    createdAt?: DateTimeFilter<"GameSession"> | Date | string
    updatedAt?: DateTimeFilter<"GameSession"> | Date | string
  }

  export type GameSessionOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    state?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    matchId?: string
    AND?: GameSessionWhereInput | GameSessionWhereInput[]
    OR?: GameSessionWhereInput[]
    NOT?: GameSessionWhereInput | GameSessionWhereInput[]
    state?: JsonFilter<"GameSession">
    lastActivity?: DateTimeFilter<"GameSession"> | Date | string
    expiresAt?: DateTimeFilter<"GameSession"> | Date | string
    isActive?: BoolFilter<"GameSession"> | boolean
    createdAt?: DateTimeFilter<"GameSession"> | Date | string
    updatedAt?: DateTimeFilter<"GameSession"> | Date | string
  }, "id" | "matchId">

  export type GameSessionOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    state?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GameSessionCountOrderByAggregateInput
    _max?: GameSessionMaxOrderByAggregateInput
    _min?: GameSessionMinOrderByAggregateInput
  }

  export type GameSessionScalarWhereWithAggregatesInput = {
    AND?: GameSessionScalarWhereWithAggregatesInput | GameSessionScalarWhereWithAggregatesInput[]
    OR?: GameSessionScalarWhereWithAggregatesInput[]
    NOT?: GameSessionScalarWhereWithAggregatesInput | GameSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameSession"> | string
    matchId?: StringWithAggregatesFilter<"GameSession"> | string
    state?: JsonWithAggregatesFilter<"GameSession">
    lastActivity?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
    isActive?: BoolWithAggregatesFilter<"GameSession"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
  }

  export type UserCollectionWhereInput = {
    AND?: UserCollectionWhereInput | UserCollectionWhereInput[]
    OR?: UserCollectionWhereInput[]
    NOT?: UserCollectionWhereInput | UserCollectionWhereInput[]
    id?: StringFilter<"UserCollection"> | string
    userId?: StringFilter<"UserCollection"> | string
    cardId?: StringFilter<"UserCollection"> | string
    quantity?: IntFilter<"UserCollection"> | number
    foil?: BoolFilter<"UserCollection"> | boolean
    acquiredAt?: DateTimeFilter<"UserCollection"> | Date | string
  }

  export type UserCollectionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    foil?: SortOrder
    acquiredAt?: SortOrder
  }

  export type UserCollectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_cardId_foil?: UserCollectionUserIdCardIdFoilCompoundUniqueInput
    AND?: UserCollectionWhereInput | UserCollectionWhereInput[]
    OR?: UserCollectionWhereInput[]
    NOT?: UserCollectionWhereInput | UserCollectionWhereInput[]
    userId?: StringFilter<"UserCollection"> | string
    cardId?: StringFilter<"UserCollection"> | string
    quantity?: IntFilter<"UserCollection"> | number
    foil?: BoolFilter<"UserCollection"> | boolean
    acquiredAt?: DateTimeFilter<"UserCollection"> | Date | string
  }, "id" | "userId_cardId_foil">

  export type UserCollectionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    foil?: SortOrder
    acquiredAt?: SortOrder
    _count?: UserCollectionCountOrderByAggregateInput
    _avg?: UserCollectionAvgOrderByAggregateInput
    _max?: UserCollectionMaxOrderByAggregateInput
    _min?: UserCollectionMinOrderByAggregateInput
    _sum?: UserCollectionSumOrderByAggregateInput
  }

  export type UserCollectionScalarWhereWithAggregatesInput = {
    AND?: UserCollectionScalarWhereWithAggregatesInput | UserCollectionScalarWhereWithAggregatesInput[]
    OR?: UserCollectionScalarWhereWithAggregatesInput[]
    NOT?: UserCollectionScalarWhereWithAggregatesInput | UserCollectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserCollection"> | string
    userId?: StringWithAggregatesFilter<"UserCollection"> | string
    cardId?: StringWithAggregatesFilter<"UserCollection"> | string
    quantity?: IntWithAggregatesFilter<"UserCollection"> | number
    foil?: BoolWithAggregatesFilter<"UserCollection"> | boolean
    acquiredAt?: DateTimeWithAggregatesFilter<"UserCollection"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    decks?: DeckCreateNestedManyWithoutUserInput
    gamesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    gamesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    decks?: DeckUncheckedCreateNestedManyWithoutUserInput
    gamesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    gamesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decks?: DeckUpdateManyWithoutUserNestedInput
    gamesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    gamesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decks?: DeckUncheckedUpdateManyWithoutUserNestedInput
    gamesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    gamesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardDefinitionCreateInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckCreateNestedManyWithoutChampionLegendInput
    decksAsChampion?: DeckCreateNestedManyWithoutChosenChampionInput
    decksAsBattlefield?: DeckCreateNestedManyWithoutBattlefieldInput
    mainDeckCards?: MainDeckCardCreateNestedManyWithoutCardInput
    runeDeckCards?: RuneDeckCardCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionUncheckedCreateInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckUncheckedCreateNestedManyWithoutChampionLegendInput
    decksAsChampion?: DeckUncheckedCreateNestedManyWithoutChosenChampionInput
    decksAsBattlefield?: DeckUncheckedCreateNestedManyWithoutBattlefieldInput
    mainDeckCards?: MainDeckCardUncheckedCreateNestedManyWithoutCardInput
    runeDeckCards?: RuneDeckCardUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUpdateManyWithoutChampionLegendNestedInput
    decksAsChampion?: DeckUpdateManyWithoutChosenChampionNestedInput
    decksAsBattlefield?: DeckUpdateManyWithoutBattlefieldNestedInput
    mainDeckCards?: MainDeckCardUpdateManyWithoutCardNestedInput
    runeDeckCards?: RuneDeckCardUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUncheckedUpdateManyWithoutChampionLegendNestedInput
    decksAsChampion?: DeckUncheckedUpdateManyWithoutChosenChampionNestedInput
    decksAsBattlefield?: DeckUncheckedUpdateManyWithoutBattlefieldNestedInput
    mainDeckCards?: MainDeckCardUncheckedUpdateManyWithoutCardNestedInput
    runeDeckCards?: RuneDeckCardUncheckedUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionCreateManyInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CardDefinitionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardDefinitionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeckCreateInput = {
    id?: string
    name: string
    description?: string | null
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDecksInput
    championLegend: CardDefinitionCreateNestedOneWithoutDecksAsLegendInput
    chosenChampion: CardDefinitionCreateNestedOneWithoutDecksAsChampionInput
    battlefield: CardDefinitionCreateNestedOneWithoutDecksAsBattlefieldInput
    mainDeck?: MainDeckCardCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardCreateNestedManyWithoutDeckInput
  }

  export type DeckUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    championLegendId: string
    chosenChampionId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    mainDeck?: MainDeckCardUncheckedCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type DeckUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDecksNestedInput
    championLegend?: CardDefinitionUpdateOneRequiredWithoutDecksAsLegendNestedInput
    chosenChampion?: CardDefinitionUpdateOneRequiredWithoutDecksAsChampionNestedInput
    battlefield?: CardDefinitionUpdateOneRequiredWithoutDecksAsBattlefieldNestedInput
    mainDeck?: MainDeckCardUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    championLegendId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mainDeck?: MainDeckCardUncheckedUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type DeckCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    championLegendId: string
    chosenChampionId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeckUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeckUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    championLegendId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MainDeckCardCreateInput = {
    id?: string
    quantity?: number
    deck: DeckCreateNestedOneWithoutMainDeckInput
    card: CardDefinitionCreateNestedOneWithoutMainDeckCardsInput
  }

  export type MainDeckCardUncheckedCreateInput = {
    id?: string
    deckId: string
    cardId: string
    quantity?: number
  }

  export type MainDeckCardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    deck?: DeckUpdateOneRequiredWithoutMainDeckNestedInput
    card?: CardDefinitionUpdateOneRequiredWithoutMainDeckCardsNestedInput
  }

  export type MainDeckCardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type MainDeckCardCreateManyInput = {
    id?: string
    deckId: string
    cardId: string
    quantity?: number
  }

  export type MainDeckCardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type MainDeckCardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type RuneDeckCardCreateInput = {
    id?: string
    quantity?: number
    deck: DeckCreateNestedOneWithoutRuneDeckInput
    card: CardDefinitionCreateNestedOneWithoutRuneDeckCardsInput
  }

  export type RuneDeckCardUncheckedCreateInput = {
    id?: string
    deckId: string
    cardId: string
    quantity?: number
  }

  export type RuneDeckCardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    deck?: DeckUpdateOneRequiredWithoutRuneDeckNestedInput
    card?: CardDefinitionUpdateOneRequiredWithoutRuneDeckCardsNestedInput
  }

  export type RuneDeckCardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type RuneDeckCardCreateManyInput = {
    id?: string
    deckId: string
    cardId: string
    quantity?: number
  }

  export type RuneDeckCardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type RuneDeckCardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type MatchCreateInput = {
    id?: string
    player1DeckId?: string | null
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    player1: UserCreateNestedOneWithoutGamesAsPlayer1Input
    player2: UserCreateNestedOneWithoutGamesAsPlayer2Input
    events?: MatchEventCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateInput = {
    id?: string
    player1Id: string
    player1DeckId?: string | null
    player2Id: string
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: MatchEventUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    player1?: UserUpdateOneRequiredWithoutGamesAsPlayer1NestedInput
    player2?: UserUpdateOneRequiredWithoutGamesAsPlayer2NestedInput
    events?: MatchEventUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2Id?: StringFieldUpdateOperationsInput | string
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: MatchEventUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchCreateManyInput = {
    id?: string
    player1Id: string
    player1DeckId?: string | null
    player2Id: string
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2Id?: StringFieldUpdateOperationsInput | string
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchEventCreateInput = {
    id?: string
    type: string
    round: number
    phase?: string | null
    playerId?: string | null
    data: JsonNullValueInput | InputJsonValue
    sequence: number
    timestamp?: Date | string
    match: MatchCreateNestedOneWithoutEventsInput
  }

  export type MatchEventUncheckedCreateInput = {
    id?: string
    matchId: string
    type: string
    round: number
    phase?: string | null
    playerId?: string | null
    data: JsonNullValueInput | InputJsonValue
    sequence: number
    timestamp?: Date | string
  }

  export type MatchEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    round?: IntFieldUpdateOperationsInput | number
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    sequence?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutEventsNestedInput
  }

  export type MatchEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    round?: IntFieldUpdateOperationsInput | number
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    sequence?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchEventCreateManyInput = {
    id?: string
    matchId: string
    type: string
    round: number
    phase?: string | null
    playerId?: string | null
    data: JsonNullValueInput | InputJsonValue
    sequence: number
    timestamp?: Date | string
  }

  export type MatchEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    round?: IntFieldUpdateOperationsInput | number
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    sequence?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    round?: IntFieldUpdateOperationsInput | number
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    sequence?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionCreateInput = {
    id?: string
    matchId: string
    state: JsonNullValueInput | InputJsonValue
    lastActivity?: Date | string
    expiresAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameSessionUncheckedCreateInput = {
    id?: string
    matchId: string
    state: JsonNullValueInput | InputJsonValue
    lastActivity?: Date | string
    expiresAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    state?: JsonNullValueInput | InputJsonValue
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    state?: JsonNullValueInput | InputJsonValue
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionCreateManyInput = {
    id?: string
    matchId: string
    state: JsonNullValueInput | InputJsonValue
    lastActivity?: Date | string
    expiresAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    state?: JsonNullValueInput | InputJsonValue
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    state?: JsonNullValueInput | InputJsonValue
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCollectionCreateInput = {
    id?: string
    userId: string
    cardId: string
    quantity?: number
    foil?: boolean
    acquiredAt?: Date | string
  }

  export type UserCollectionUncheckedCreateInput = {
    id?: string
    userId: string
    cardId: string
    quantity?: number
    foil?: boolean
    acquiredAt?: Date | string
  }

  export type UserCollectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    foil?: BoolFieldUpdateOperationsInput | boolean
    acquiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCollectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    foil?: BoolFieldUpdateOperationsInput | boolean
    acquiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCollectionCreateManyInput = {
    id?: string
    userId: string
    cardId: string
    quantity?: number
    foil?: boolean
    acquiredAt?: Date | string
  }

  export type UserCollectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    foil?: BoolFieldUpdateOperationsInput | boolean
    acquiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCollectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    foil?: BoolFieldUpdateOperationsInput | boolean
    acquiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DeckListRelationFilter = {
    every?: DeckWhereInput
    some?: DeckWhereInput
    none?: DeckWhereInput
  }

  export type MatchListRelationFilter = {
    every?: MatchWhereInput
    some?: MatchWhereInput
    none?: MatchWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DeckOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    avatarUrl?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    rating?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    avatarUrl?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    avatarUrl?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    rating?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumCardTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CardType | EnumCardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CardType[] | ListEnumCardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CardType[] | ListEnumCardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCardTypeFilter<$PrismaModel> | $Enums.CardType
  }

  export type EnumRarityFilter<$PrismaModel = never> = {
    equals?: $Enums.Rarity | EnumRarityFieldRefInput<$PrismaModel>
    in?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    not?: NestedEnumRarityFilter<$PrismaModel> | $Enums.Rarity
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type MainDeckCardListRelationFilter = {
    every?: MainDeckCardWhereInput
    some?: MainDeckCardWhereInput
    none?: MainDeckCardWhereInput
  }

  export type RuneDeckCardListRelationFilter = {
    every?: RuneDeckCardWhereInput
    some?: RuneDeckCardWhereInput
    none?: RuneDeckCardWhereInput
  }

  export type MainDeckCardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RuneDeckCardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CardDefinitionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cardType?: SortOrder
    rarity?: SortOrder
    energyCost?: SortOrder
    powerCosts?: SortOrder
    description?: SortOrder
    flavorText?: SortOrder
    might?: SortOrder
    subtypes?: SortOrder
    domains?: SortOrder
    keywords?: SortOrder
    tags?: SortOrder
    scriptPath?: SortOrder
    hasScript?: SortOrder
    imageUrl?: SortOrder
    artist?: SortOrder
    cardNumber?: SortOrder
    setCode?: SortOrder
    setName?: SortOrder
    isSignature?: SortOrder
    isBasicRune?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CardDefinitionAvgOrderByAggregateInput = {
    energyCost?: SortOrder
    might?: SortOrder
  }

  export type CardDefinitionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cardType?: SortOrder
    rarity?: SortOrder
    energyCost?: SortOrder
    description?: SortOrder
    flavorText?: SortOrder
    might?: SortOrder
    scriptPath?: SortOrder
    hasScript?: SortOrder
    imageUrl?: SortOrder
    artist?: SortOrder
    cardNumber?: SortOrder
    setCode?: SortOrder
    setName?: SortOrder
    isSignature?: SortOrder
    isBasicRune?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CardDefinitionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cardType?: SortOrder
    rarity?: SortOrder
    energyCost?: SortOrder
    description?: SortOrder
    flavorText?: SortOrder
    might?: SortOrder
    scriptPath?: SortOrder
    hasScript?: SortOrder
    imageUrl?: SortOrder
    artist?: SortOrder
    cardNumber?: SortOrder
    setCode?: SortOrder
    setName?: SortOrder
    isSignature?: SortOrder
    isBasicRune?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CardDefinitionSumOrderByAggregateInput = {
    energyCost?: SortOrder
    might?: SortOrder
  }

  export type EnumCardTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CardType | EnumCardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CardType[] | ListEnumCardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CardType[] | ListEnumCardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCardTypeWithAggregatesFilter<$PrismaModel> | $Enums.CardType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCardTypeFilter<$PrismaModel>
    _max?: NestedEnumCardTypeFilter<$PrismaModel>
  }

  export type EnumRarityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Rarity | EnumRarityFieldRefInput<$PrismaModel>
    in?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    not?: NestedEnumRarityWithAggregatesFilter<$PrismaModel> | $Enums.Rarity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRarityFilter<$PrismaModel>
    _max?: NestedEnumRarityFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CardDefinitionScalarRelationFilter = {
    is?: CardDefinitionWhereInput
    isNot?: CardDefinitionWhereInput
  }

  export type DeckCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    championLegendId?: SortOrder
    chosenChampionId?: SortOrder
    battlefieldId?: SortOrder
    isValid?: SortOrder
    totalCards?: SortOrder
    format?: SortOrder
    playCount?: SortOrder
    winCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeckAvgOrderByAggregateInput = {
    totalCards?: SortOrder
    playCount?: SortOrder
    winCount?: SortOrder
  }

  export type DeckMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    championLegendId?: SortOrder
    chosenChampionId?: SortOrder
    battlefieldId?: SortOrder
    isValid?: SortOrder
    totalCards?: SortOrder
    format?: SortOrder
    playCount?: SortOrder
    winCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeckMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    championLegendId?: SortOrder
    chosenChampionId?: SortOrder
    battlefieldId?: SortOrder
    isValid?: SortOrder
    totalCards?: SortOrder
    format?: SortOrder
    playCount?: SortOrder
    winCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeckSumOrderByAggregateInput = {
    totalCards?: SortOrder
    playCount?: SortOrder
    winCount?: SortOrder
  }

  export type DeckScalarRelationFilter = {
    is?: DeckWhereInput
    isNot?: DeckWhereInput
  }

  export type MainDeckCardDeckIdCardIdCompoundUniqueInput = {
    deckId: string
    cardId: string
  }

  export type MainDeckCardCountOrderByAggregateInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
  }

  export type MainDeckCardAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type MainDeckCardMaxOrderByAggregateInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
  }

  export type MainDeckCardMinOrderByAggregateInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
  }

  export type MainDeckCardSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type RuneDeckCardDeckIdCardIdCompoundUniqueInput = {
    deckId: string
    cardId: string
  }

  export type RuneDeckCardCountOrderByAggregateInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
  }

  export type RuneDeckCardAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type RuneDeckCardMaxOrderByAggregateInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
  }

  export type RuneDeckCardMinOrderByAggregateInput = {
    id?: SortOrder
    deckId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
  }

  export type RuneDeckCardSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type EnumMatchStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | EnumMatchStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchStatusFilter<$PrismaModel> | $Enums.MatchStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type MatchEventListRelationFilter = {
    every?: MatchEventWhereInput
    some?: MatchEventWhereInput
    none?: MatchEventWhereInput
  }

  export type MatchEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchCountOrderByAggregateInput = {
    id?: SortOrder
    player1Id?: SortOrder
    player1DeckId?: SortOrder
    player2Id?: SortOrder
    player2DeckId?: SortOrder
    status?: SortOrder
    winnerId?: SortOrder
    winCondition?: SortOrder
    currentRound?: SortOrder
    currentPhase?: SortOrder
    gameState?: SortOrder
    format?: SortOrder
    isRanked?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchAvgOrderByAggregateInput = {
    currentRound?: SortOrder
    duration?: SortOrder
  }

  export type MatchMaxOrderByAggregateInput = {
    id?: SortOrder
    player1Id?: SortOrder
    player1DeckId?: SortOrder
    player2Id?: SortOrder
    player2DeckId?: SortOrder
    status?: SortOrder
    winnerId?: SortOrder
    winCondition?: SortOrder
    currentRound?: SortOrder
    currentPhase?: SortOrder
    format?: SortOrder
    isRanked?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchMinOrderByAggregateInput = {
    id?: SortOrder
    player1Id?: SortOrder
    player1DeckId?: SortOrder
    player2Id?: SortOrder
    player2DeckId?: SortOrder
    status?: SortOrder
    winnerId?: SortOrder
    winCondition?: SortOrder
    currentRound?: SortOrder
    currentPhase?: SortOrder
    format?: SortOrder
    isRanked?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchSumOrderByAggregateInput = {
    currentRound?: SortOrder
    duration?: SortOrder
  }

  export type EnumMatchStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | EnumMatchStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchStatusFilter<$PrismaModel>
    _max?: NestedEnumMatchStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MatchScalarRelationFilter = {
    is?: MatchWhereInput
    isNot?: MatchWhereInput
  }

  export type MatchEventCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    type?: SortOrder
    round?: SortOrder
    phase?: SortOrder
    playerId?: SortOrder
    data?: SortOrder
    sequence?: SortOrder
    timestamp?: SortOrder
  }

  export type MatchEventAvgOrderByAggregateInput = {
    round?: SortOrder
    sequence?: SortOrder
  }

  export type MatchEventMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    type?: SortOrder
    round?: SortOrder
    phase?: SortOrder
    playerId?: SortOrder
    sequence?: SortOrder
    timestamp?: SortOrder
  }

  export type MatchEventMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    type?: SortOrder
    round?: SortOrder
    phase?: SortOrder
    playerId?: SortOrder
    sequence?: SortOrder
    timestamp?: SortOrder
  }

  export type MatchEventSumOrderByAggregateInput = {
    round?: SortOrder
    sequence?: SortOrder
  }

  export type GameSessionCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    state?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    lastActivity?: SortOrder
    expiresAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCollectionUserIdCardIdFoilCompoundUniqueInput = {
    userId: string
    cardId: string
    foil: boolean
  }

  export type UserCollectionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    foil?: SortOrder
    acquiredAt?: SortOrder
  }

  export type UserCollectionAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type UserCollectionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    foil?: SortOrder
    acquiredAt?: SortOrder
  }

  export type UserCollectionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    cardId?: SortOrder
    quantity?: SortOrder
    foil?: SortOrder
    acquiredAt?: SortOrder
  }

  export type UserCollectionSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type DeckCreateNestedManyWithoutUserInput = {
    create?: XOR<DeckCreateWithoutUserInput, DeckUncheckedCreateWithoutUserInput> | DeckCreateWithoutUserInput[] | DeckUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutUserInput | DeckCreateOrConnectWithoutUserInput[]
    createMany?: DeckCreateManyUserInputEnvelope
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutPlayer1Input = {
    create?: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input> | MatchCreateWithoutPlayer1Input[] | MatchUncheckedCreateWithoutPlayer1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer1Input | MatchCreateOrConnectWithoutPlayer1Input[]
    createMany?: MatchCreateManyPlayer1InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutPlayer2Input = {
    create?: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input> | MatchCreateWithoutPlayer2Input[] | MatchUncheckedCreateWithoutPlayer2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer2Input | MatchCreateOrConnectWithoutPlayer2Input[]
    createMany?: MatchCreateManyPlayer2InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type DeckUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DeckCreateWithoutUserInput, DeckUncheckedCreateWithoutUserInput> | DeckCreateWithoutUserInput[] | DeckUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutUserInput | DeckCreateOrConnectWithoutUserInput[]
    createMany?: DeckCreateManyUserInputEnvelope
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutPlayer1Input = {
    create?: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input> | MatchCreateWithoutPlayer1Input[] | MatchUncheckedCreateWithoutPlayer1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer1Input | MatchCreateOrConnectWithoutPlayer1Input[]
    createMany?: MatchCreateManyPlayer1InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutPlayer2Input = {
    create?: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input> | MatchCreateWithoutPlayer2Input[] | MatchUncheckedCreateWithoutPlayer2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer2Input | MatchCreateOrConnectWithoutPlayer2Input[]
    createMany?: MatchCreateManyPlayer2InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DeckUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeckCreateWithoutUserInput, DeckUncheckedCreateWithoutUserInput> | DeckCreateWithoutUserInput[] | DeckUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutUserInput | DeckCreateOrConnectWithoutUserInput[]
    upsert?: DeckUpsertWithWhereUniqueWithoutUserInput | DeckUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeckCreateManyUserInputEnvelope
    set?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    disconnect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    delete?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    update?: DeckUpdateWithWhereUniqueWithoutUserInput | DeckUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeckUpdateManyWithWhereWithoutUserInput | DeckUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeckScalarWhereInput | DeckScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutPlayer1NestedInput = {
    create?: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input> | MatchCreateWithoutPlayer1Input[] | MatchUncheckedCreateWithoutPlayer1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer1Input | MatchCreateOrConnectWithoutPlayer1Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutPlayer1Input | MatchUpsertWithWhereUniqueWithoutPlayer1Input[]
    createMany?: MatchCreateManyPlayer1InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutPlayer1Input | MatchUpdateWithWhereUniqueWithoutPlayer1Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutPlayer1Input | MatchUpdateManyWithWhereWithoutPlayer1Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutPlayer2NestedInput = {
    create?: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input> | MatchCreateWithoutPlayer2Input[] | MatchUncheckedCreateWithoutPlayer2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer2Input | MatchCreateOrConnectWithoutPlayer2Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutPlayer2Input | MatchUpsertWithWhereUniqueWithoutPlayer2Input[]
    createMany?: MatchCreateManyPlayer2InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutPlayer2Input | MatchUpdateWithWhereUniqueWithoutPlayer2Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutPlayer2Input | MatchUpdateManyWithWhereWithoutPlayer2Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type DeckUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeckCreateWithoutUserInput, DeckUncheckedCreateWithoutUserInput> | DeckCreateWithoutUserInput[] | DeckUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutUserInput | DeckCreateOrConnectWithoutUserInput[]
    upsert?: DeckUpsertWithWhereUniqueWithoutUserInput | DeckUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeckCreateManyUserInputEnvelope
    set?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    disconnect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    delete?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    update?: DeckUpdateWithWhereUniqueWithoutUserInput | DeckUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeckUpdateManyWithWhereWithoutUserInput | DeckUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeckScalarWhereInput | DeckScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutPlayer1NestedInput = {
    create?: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input> | MatchCreateWithoutPlayer1Input[] | MatchUncheckedCreateWithoutPlayer1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer1Input | MatchCreateOrConnectWithoutPlayer1Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutPlayer1Input | MatchUpsertWithWhereUniqueWithoutPlayer1Input[]
    createMany?: MatchCreateManyPlayer1InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutPlayer1Input | MatchUpdateWithWhereUniqueWithoutPlayer1Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutPlayer1Input | MatchUpdateManyWithWhereWithoutPlayer1Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutPlayer2NestedInput = {
    create?: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input> | MatchCreateWithoutPlayer2Input[] | MatchUncheckedCreateWithoutPlayer2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer2Input | MatchCreateOrConnectWithoutPlayer2Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutPlayer2Input | MatchUpsertWithWhereUniqueWithoutPlayer2Input[]
    createMany?: MatchCreateManyPlayer2InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutPlayer2Input | MatchUpdateWithWhereUniqueWithoutPlayer2Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutPlayer2Input | MatchUpdateManyWithWhereWithoutPlayer2Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type DeckCreateNestedManyWithoutChampionLegendInput = {
    create?: XOR<DeckCreateWithoutChampionLegendInput, DeckUncheckedCreateWithoutChampionLegendInput> | DeckCreateWithoutChampionLegendInput[] | DeckUncheckedCreateWithoutChampionLegendInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutChampionLegendInput | DeckCreateOrConnectWithoutChampionLegendInput[]
    createMany?: DeckCreateManyChampionLegendInputEnvelope
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
  }

  export type DeckCreateNestedManyWithoutChosenChampionInput = {
    create?: XOR<DeckCreateWithoutChosenChampionInput, DeckUncheckedCreateWithoutChosenChampionInput> | DeckCreateWithoutChosenChampionInput[] | DeckUncheckedCreateWithoutChosenChampionInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutChosenChampionInput | DeckCreateOrConnectWithoutChosenChampionInput[]
    createMany?: DeckCreateManyChosenChampionInputEnvelope
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
  }

  export type DeckCreateNestedManyWithoutBattlefieldInput = {
    create?: XOR<DeckCreateWithoutBattlefieldInput, DeckUncheckedCreateWithoutBattlefieldInput> | DeckCreateWithoutBattlefieldInput[] | DeckUncheckedCreateWithoutBattlefieldInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutBattlefieldInput | DeckCreateOrConnectWithoutBattlefieldInput[]
    createMany?: DeckCreateManyBattlefieldInputEnvelope
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
  }

  export type MainDeckCardCreateNestedManyWithoutCardInput = {
    create?: XOR<MainDeckCardCreateWithoutCardInput, MainDeckCardUncheckedCreateWithoutCardInput> | MainDeckCardCreateWithoutCardInput[] | MainDeckCardUncheckedCreateWithoutCardInput[]
    connectOrCreate?: MainDeckCardCreateOrConnectWithoutCardInput | MainDeckCardCreateOrConnectWithoutCardInput[]
    createMany?: MainDeckCardCreateManyCardInputEnvelope
    connect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
  }

  export type RuneDeckCardCreateNestedManyWithoutCardInput = {
    create?: XOR<RuneDeckCardCreateWithoutCardInput, RuneDeckCardUncheckedCreateWithoutCardInput> | RuneDeckCardCreateWithoutCardInput[] | RuneDeckCardUncheckedCreateWithoutCardInput[]
    connectOrCreate?: RuneDeckCardCreateOrConnectWithoutCardInput | RuneDeckCardCreateOrConnectWithoutCardInput[]
    createMany?: RuneDeckCardCreateManyCardInputEnvelope
    connect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
  }

  export type DeckUncheckedCreateNestedManyWithoutChampionLegendInput = {
    create?: XOR<DeckCreateWithoutChampionLegendInput, DeckUncheckedCreateWithoutChampionLegendInput> | DeckCreateWithoutChampionLegendInput[] | DeckUncheckedCreateWithoutChampionLegendInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutChampionLegendInput | DeckCreateOrConnectWithoutChampionLegendInput[]
    createMany?: DeckCreateManyChampionLegendInputEnvelope
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
  }

  export type DeckUncheckedCreateNestedManyWithoutChosenChampionInput = {
    create?: XOR<DeckCreateWithoutChosenChampionInput, DeckUncheckedCreateWithoutChosenChampionInput> | DeckCreateWithoutChosenChampionInput[] | DeckUncheckedCreateWithoutChosenChampionInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutChosenChampionInput | DeckCreateOrConnectWithoutChosenChampionInput[]
    createMany?: DeckCreateManyChosenChampionInputEnvelope
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
  }

  export type DeckUncheckedCreateNestedManyWithoutBattlefieldInput = {
    create?: XOR<DeckCreateWithoutBattlefieldInput, DeckUncheckedCreateWithoutBattlefieldInput> | DeckCreateWithoutBattlefieldInput[] | DeckUncheckedCreateWithoutBattlefieldInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutBattlefieldInput | DeckCreateOrConnectWithoutBattlefieldInput[]
    createMany?: DeckCreateManyBattlefieldInputEnvelope
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
  }

  export type MainDeckCardUncheckedCreateNestedManyWithoutCardInput = {
    create?: XOR<MainDeckCardCreateWithoutCardInput, MainDeckCardUncheckedCreateWithoutCardInput> | MainDeckCardCreateWithoutCardInput[] | MainDeckCardUncheckedCreateWithoutCardInput[]
    connectOrCreate?: MainDeckCardCreateOrConnectWithoutCardInput | MainDeckCardCreateOrConnectWithoutCardInput[]
    createMany?: MainDeckCardCreateManyCardInputEnvelope
    connect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
  }

  export type RuneDeckCardUncheckedCreateNestedManyWithoutCardInput = {
    create?: XOR<RuneDeckCardCreateWithoutCardInput, RuneDeckCardUncheckedCreateWithoutCardInput> | RuneDeckCardCreateWithoutCardInput[] | RuneDeckCardUncheckedCreateWithoutCardInput[]
    connectOrCreate?: RuneDeckCardCreateOrConnectWithoutCardInput | RuneDeckCardCreateOrConnectWithoutCardInput[]
    createMany?: RuneDeckCardCreateManyCardInputEnvelope
    connect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
  }

  export type EnumCardTypeFieldUpdateOperationsInput = {
    set?: $Enums.CardType
  }

  export type EnumRarityFieldUpdateOperationsInput = {
    set?: $Enums.Rarity
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DeckUpdateManyWithoutChampionLegendNestedInput = {
    create?: XOR<DeckCreateWithoutChampionLegendInput, DeckUncheckedCreateWithoutChampionLegendInput> | DeckCreateWithoutChampionLegendInput[] | DeckUncheckedCreateWithoutChampionLegendInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutChampionLegendInput | DeckCreateOrConnectWithoutChampionLegendInput[]
    upsert?: DeckUpsertWithWhereUniqueWithoutChampionLegendInput | DeckUpsertWithWhereUniqueWithoutChampionLegendInput[]
    createMany?: DeckCreateManyChampionLegendInputEnvelope
    set?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    disconnect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    delete?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    update?: DeckUpdateWithWhereUniqueWithoutChampionLegendInput | DeckUpdateWithWhereUniqueWithoutChampionLegendInput[]
    updateMany?: DeckUpdateManyWithWhereWithoutChampionLegendInput | DeckUpdateManyWithWhereWithoutChampionLegendInput[]
    deleteMany?: DeckScalarWhereInput | DeckScalarWhereInput[]
  }

  export type DeckUpdateManyWithoutChosenChampionNestedInput = {
    create?: XOR<DeckCreateWithoutChosenChampionInput, DeckUncheckedCreateWithoutChosenChampionInput> | DeckCreateWithoutChosenChampionInput[] | DeckUncheckedCreateWithoutChosenChampionInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutChosenChampionInput | DeckCreateOrConnectWithoutChosenChampionInput[]
    upsert?: DeckUpsertWithWhereUniqueWithoutChosenChampionInput | DeckUpsertWithWhereUniqueWithoutChosenChampionInput[]
    createMany?: DeckCreateManyChosenChampionInputEnvelope
    set?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    disconnect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    delete?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    update?: DeckUpdateWithWhereUniqueWithoutChosenChampionInput | DeckUpdateWithWhereUniqueWithoutChosenChampionInput[]
    updateMany?: DeckUpdateManyWithWhereWithoutChosenChampionInput | DeckUpdateManyWithWhereWithoutChosenChampionInput[]
    deleteMany?: DeckScalarWhereInput | DeckScalarWhereInput[]
  }

  export type DeckUpdateManyWithoutBattlefieldNestedInput = {
    create?: XOR<DeckCreateWithoutBattlefieldInput, DeckUncheckedCreateWithoutBattlefieldInput> | DeckCreateWithoutBattlefieldInput[] | DeckUncheckedCreateWithoutBattlefieldInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutBattlefieldInput | DeckCreateOrConnectWithoutBattlefieldInput[]
    upsert?: DeckUpsertWithWhereUniqueWithoutBattlefieldInput | DeckUpsertWithWhereUniqueWithoutBattlefieldInput[]
    createMany?: DeckCreateManyBattlefieldInputEnvelope
    set?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    disconnect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    delete?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    update?: DeckUpdateWithWhereUniqueWithoutBattlefieldInput | DeckUpdateWithWhereUniqueWithoutBattlefieldInput[]
    updateMany?: DeckUpdateManyWithWhereWithoutBattlefieldInput | DeckUpdateManyWithWhereWithoutBattlefieldInput[]
    deleteMany?: DeckScalarWhereInput | DeckScalarWhereInput[]
  }

  export type MainDeckCardUpdateManyWithoutCardNestedInput = {
    create?: XOR<MainDeckCardCreateWithoutCardInput, MainDeckCardUncheckedCreateWithoutCardInput> | MainDeckCardCreateWithoutCardInput[] | MainDeckCardUncheckedCreateWithoutCardInput[]
    connectOrCreate?: MainDeckCardCreateOrConnectWithoutCardInput | MainDeckCardCreateOrConnectWithoutCardInput[]
    upsert?: MainDeckCardUpsertWithWhereUniqueWithoutCardInput | MainDeckCardUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: MainDeckCardCreateManyCardInputEnvelope
    set?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    disconnect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    delete?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    connect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    update?: MainDeckCardUpdateWithWhereUniqueWithoutCardInput | MainDeckCardUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: MainDeckCardUpdateManyWithWhereWithoutCardInput | MainDeckCardUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: MainDeckCardScalarWhereInput | MainDeckCardScalarWhereInput[]
  }

  export type RuneDeckCardUpdateManyWithoutCardNestedInput = {
    create?: XOR<RuneDeckCardCreateWithoutCardInput, RuneDeckCardUncheckedCreateWithoutCardInput> | RuneDeckCardCreateWithoutCardInput[] | RuneDeckCardUncheckedCreateWithoutCardInput[]
    connectOrCreate?: RuneDeckCardCreateOrConnectWithoutCardInput | RuneDeckCardCreateOrConnectWithoutCardInput[]
    upsert?: RuneDeckCardUpsertWithWhereUniqueWithoutCardInput | RuneDeckCardUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: RuneDeckCardCreateManyCardInputEnvelope
    set?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    disconnect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    delete?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    connect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    update?: RuneDeckCardUpdateWithWhereUniqueWithoutCardInput | RuneDeckCardUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: RuneDeckCardUpdateManyWithWhereWithoutCardInput | RuneDeckCardUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: RuneDeckCardScalarWhereInput | RuneDeckCardScalarWhereInput[]
  }

  export type DeckUncheckedUpdateManyWithoutChampionLegendNestedInput = {
    create?: XOR<DeckCreateWithoutChampionLegendInput, DeckUncheckedCreateWithoutChampionLegendInput> | DeckCreateWithoutChampionLegendInput[] | DeckUncheckedCreateWithoutChampionLegendInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutChampionLegendInput | DeckCreateOrConnectWithoutChampionLegendInput[]
    upsert?: DeckUpsertWithWhereUniqueWithoutChampionLegendInput | DeckUpsertWithWhereUniqueWithoutChampionLegendInput[]
    createMany?: DeckCreateManyChampionLegendInputEnvelope
    set?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    disconnect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    delete?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    update?: DeckUpdateWithWhereUniqueWithoutChampionLegendInput | DeckUpdateWithWhereUniqueWithoutChampionLegendInput[]
    updateMany?: DeckUpdateManyWithWhereWithoutChampionLegendInput | DeckUpdateManyWithWhereWithoutChampionLegendInput[]
    deleteMany?: DeckScalarWhereInput | DeckScalarWhereInput[]
  }

  export type DeckUncheckedUpdateManyWithoutChosenChampionNestedInput = {
    create?: XOR<DeckCreateWithoutChosenChampionInput, DeckUncheckedCreateWithoutChosenChampionInput> | DeckCreateWithoutChosenChampionInput[] | DeckUncheckedCreateWithoutChosenChampionInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutChosenChampionInput | DeckCreateOrConnectWithoutChosenChampionInput[]
    upsert?: DeckUpsertWithWhereUniqueWithoutChosenChampionInput | DeckUpsertWithWhereUniqueWithoutChosenChampionInput[]
    createMany?: DeckCreateManyChosenChampionInputEnvelope
    set?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    disconnect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    delete?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    update?: DeckUpdateWithWhereUniqueWithoutChosenChampionInput | DeckUpdateWithWhereUniqueWithoutChosenChampionInput[]
    updateMany?: DeckUpdateManyWithWhereWithoutChosenChampionInput | DeckUpdateManyWithWhereWithoutChosenChampionInput[]
    deleteMany?: DeckScalarWhereInput | DeckScalarWhereInput[]
  }

  export type DeckUncheckedUpdateManyWithoutBattlefieldNestedInput = {
    create?: XOR<DeckCreateWithoutBattlefieldInput, DeckUncheckedCreateWithoutBattlefieldInput> | DeckCreateWithoutBattlefieldInput[] | DeckUncheckedCreateWithoutBattlefieldInput[]
    connectOrCreate?: DeckCreateOrConnectWithoutBattlefieldInput | DeckCreateOrConnectWithoutBattlefieldInput[]
    upsert?: DeckUpsertWithWhereUniqueWithoutBattlefieldInput | DeckUpsertWithWhereUniqueWithoutBattlefieldInput[]
    createMany?: DeckCreateManyBattlefieldInputEnvelope
    set?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    disconnect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    delete?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    connect?: DeckWhereUniqueInput | DeckWhereUniqueInput[]
    update?: DeckUpdateWithWhereUniqueWithoutBattlefieldInput | DeckUpdateWithWhereUniqueWithoutBattlefieldInput[]
    updateMany?: DeckUpdateManyWithWhereWithoutBattlefieldInput | DeckUpdateManyWithWhereWithoutBattlefieldInput[]
    deleteMany?: DeckScalarWhereInput | DeckScalarWhereInput[]
  }

  export type MainDeckCardUncheckedUpdateManyWithoutCardNestedInput = {
    create?: XOR<MainDeckCardCreateWithoutCardInput, MainDeckCardUncheckedCreateWithoutCardInput> | MainDeckCardCreateWithoutCardInput[] | MainDeckCardUncheckedCreateWithoutCardInput[]
    connectOrCreate?: MainDeckCardCreateOrConnectWithoutCardInput | MainDeckCardCreateOrConnectWithoutCardInput[]
    upsert?: MainDeckCardUpsertWithWhereUniqueWithoutCardInput | MainDeckCardUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: MainDeckCardCreateManyCardInputEnvelope
    set?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    disconnect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    delete?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    connect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    update?: MainDeckCardUpdateWithWhereUniqueWithoutCardInput | MainDeckCardUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: MainDeckCardUpdateManyWithWhereWithoutCardInput | MainDeckCardUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: MainDeckCardScalarWhereInput | MainDeckCardScalarWhereInput[]
  }

  export type RuneDeckCardUncheckedUpdateManyWithoutCardNestedInput = {
    create?: XOR<RuneDeckCardCreateWithoutCardInput, RuneDeckCardUncheckedCreateWithoutCardInput> | RuneDeckCardCreateWithoutCardInput[] | RuneDeckCardUncheckedCreateWithoutCardInput[]
    connectOrCreate?: RuneDeckCardCreateOrConnectWithoutCardInput | RuneDeckCardCreateOrConnectWithoutCardInput[]
    upsert?: RuneDeckCardUpsertWithWhereUniqueWithoutCardInput | RuneDeckCardUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: RuneDeckCardCreateManyCardInputEnvelope
    set?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    disconnect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    delete?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    connect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    update?: RuneDeckCardUpdateWithWhereUniqueWithoutCardInput | RuneDeckCardUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: RuneDeckCardUpdateManyWithWhereWithoutCardInput | RuneDeckCardUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: RuneDeckCardScalarWhereInput | RuneDeckCardScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutDecksInput = {
    create?: XOR<UserCreateWithoutDecksInput, UserUncheckedCreateWithoutDecksInput>
    connectOrCreate?: UserCreateOrConnectWithoutDecksInput
    connect?: UserWhereUniqueInput
  }

  export type CardDefinitionCreateNestedOneWithoutDecksAsLegendInput = {
    create?: XOR<CardDefinitionCreateWithoutDecksAsLegendInput, CardDefinitionUncheckedCreateWithoutDecksAsLegendInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutDecksAsLegendInput
    connect?: CardDefinitionWhereUniqueInput
  }

  export type CardDefinitionCreateNestedOneWithoutDecksAsChampionInput = {
    create?: XOR<CardDefinitionCreateWithoutDecksAsChampionInput, CardDefinitionUncheckedCreateWithoutDecksAsChampionInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutDecksAsChampionInput
    connect?: CardDefinitionWhereUniqueInput
  }

  export type CardDefinitionCreateNestedOneWithoutDecksAsBattlefieldInput = {
    create?: XOR<CardDefinitionCreateWithoutDecksAsBattlefieldInput, CardDefinitionUncheckedCreateWithoutDecksAsBattlefieldInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutDecksAsBattlefieldInput
    connect?: CardDefinitionWhereUniqueInput
  }

  export type MainDeckCardCreateNestedManyWithoutDeckInput = {
    create?: XOR<MainDeckCardCreateWithoutDeckInput, MainDeckCardUncheckedCreateWithoutDeckInput> | MainDeckCardCreateWithoutDeckInput[] | MainDeckCardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: MainDeckCardCreateOrConnectWithoutDeckInput | MainDeckCardCreateOrConnectWithoutDeckInput[]
    createMany?: MainDeckCardCreateManyDeckInputEnvelope
    connect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
  }

  export type RuneDeckCardCreateNestedManyWithoutDeckInput = {
    create?: XOR<RuneDeckCardCreateWithoutDeckInput, RuneDeckCardUncheckedCreateWithoutDeckInput> | RuneDeckCardCreateWithoutDeckInput[] | RuneDeckCardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: RuneDeckCardCreateOrConnectWithoutDeckInput | RuneDeckCardCreateOrConnectWithoutDeckInput[]
    createMany?: RuneDeckCardCreateManyDeckInputEnvelope
    connect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
  }

  export type MainDeckCardUncheckedCreateNestedManyWithoutDeckInput = {
    create?: XOR<MainDeckCardCreateWithoutDeckInput, MainDeckCardUncheckedCreateWithoutDeckInput> | MainDeckCardCreateWithoutDeckInput[] | MainDeckCardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: MainDeckCardCreateOrConnectWithoutDeckInput | MainDeckCardCreateOrConnectWithoutDeckInput[]
    createMany?: MainDeckCardCreateManyDeckInputEnvelope
    connect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
  }

  export type RuneDeckCardUncheckedCreateNestedManyWithoutDeckInput = {
    create?: XOR<RuneDeckCardCreateWithoutDeckInput, RuneDeckCardUncheckedCreateWithoutDeckInput> | RuneDeckCardCreateWithoutDeckInput[] | RuneDeckCardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: RuneDeckCardCreateOrConnectWithoutDeckInput | RuneDeckCardCreateOrConnectWithoutDeckInput[]
    createMany?: RuneDeckCardCreateManyDeckInputEnvelope
    connect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutDecksNestedInput = {
    create?: XOR<UserCreateWithoutDecksInput, UserUncheckedCreateWithoutDecksInput>
    connectOrCreate?: UserCreateOrConnectWithoutDecksInput
    upsert?: UserUpsertWithoutDecksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDecksInput, UserUpdateWithoutDecksInput>, UserUncheckedUpdateWithoutDecksInput>
  }

  export type CardDefinitionUpdateOneRequiredWithoutDecksAsLegendNestedInput = {
    create?: XOR<CardDefinitionCreateWithoutDecksAsLegendInput, CardDefinitionUncheckedCreateWithoutDecksAsLegendInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutDecksAsLegendInput
    upsert?: CardDefinitionUpsertWithoutDecksAsLegendInput
    connect?: CardDefinitionWhereUniqueInput
    update?: XOR<XOR<CardDefinitionUpdateToOneWithWhereWithoutDecksAsLegendInput, CardDefinitionUpdateWithoutDecksAsLegendInput>, CardDefinitionUncheckedUpdateWithoutDecksAsLegendInput>
  }

  export type CardDefinitionUpdateOneRequiredWithoutDecksAsChampionNestedInput = {
    create?: XOR<CardDefinitionCreateWithoutDecksAsChampionInput, CardDefinitionUncheckedCreateWithoutDecksAsChampionInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutDecksAsChampionInput
    upsert?: CardDefinitionUpsertWithoutDecksAsChampionInput
    connect?: CardDefinitionWhereUniqueInput
    update?: XOR<XOR<CardDefinitionUpdateToOneWithWhereWithoutDecksAsChampionInput, CardDefinitionUpdateWithoutDecksAsChampionInput>, CardDefinitionUncheckedUpdateWithoutDecksAsChampionInput>
  }

  export type CardDefinitionUpdateOneRequiredWithoutDecksAsBattlefieldNestedInput = {
    create?: XOR<CardDefinitionCreateWithoutDecksAsBattlefieldInput, CardDefinitionUncheckedCreateWithoutDecksAsBattlefieldInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutDecksAsBattlefieldInput
    upsert?: CardDefinitionUpsertWithoutDecksAsBattlefieldInput
    connect?: CardDefinitionWhereUniqueInput
    update?: XOR<XOR<CardDefinitionUpdateToOneWithWhereWithoutDecksAsBattlefieldInput, CardDefinitionUpdateWithoutDecksAsBattlefieldInput>, CardDefinitionUncheckedUpdateWithoutDecksAsBattlefieldInput>
  }

  export type MainDeckCardUpdateManyWithoutDeckNestedInput = {
    create?: XOR<MainDeckCardCreateWithoutDeckInput, MainDeckCardUncheckedCreateWithoutDeckInput> | MainDeckCardCreateWithoutDeckInput[] | MainDeckCardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: MainDeckCardCreateOrConnectWithoutDeckInput | MainDeckCardCreateOrConnectWithoutDeckInput[]
    upsert?: MainDeckCardUpsertWithWhereUniqueWithoutDeckInput | MainDeckCardUpsertWithWhereUniqueWithoutDeckInput[]
    createMany?: MainDeckCardCreateManyDeckInputEnvelope
    set?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    disconnect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    delete?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    connect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    update?: MainDeckCardUpdateWithWhereUniqueWithoutDeckInput | MainDeckCardUpdateWithWhereUniqueWithoutDeckInput[]
    updateMany?: MainDeckCardUpdateManyWithWhereWithoutDeckInput | MainDeckCardUpdateManyWithWhereWithoutDeckInput[]
    deleteMany?: MainDeckCardScalarWhereInput | MainDeckCardScalarWhereInput[]
  }

  export type RuneDeckCardUpdateManyWithoutDeckNestedInput = {
    create?: XOR<RuneDeckCardCreateWithoutDeckInput, RuneDeckCardUncheckedCreateWithoutDeckInput> | RuneDeckCardCreateWithoutDeckInput[] | RuneDeckCardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: RuneDeckCardCreateOrConnectWithoutDeckInput | RuneDeckCardCreateOrConnectWithoutDeckInput[]
    upsert?: RuneDeckCardUpsertWithWhereUniqueWithoutDeckInput | RuneDeckCardUpsertWithWhereUniqueWithoutDeckInput[]
    createMany?: RuneDeckCardCreateManyDeckInputEnvelope
    set?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    disconnect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    delete?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    connect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    update?: RuneDeckCardUpdateWithWhereUniqueWithoutDeckInput | RuneDeckCardUpdateWithWhereUniqueWithoutDeckInput[]
    updateMany?: RuneDeckCardUpdateManyWithWhereWithoutDeckInput | RuneDeckCardUpdateManyWithWhereWithoutDeckInput[]
    deleteMany?: RuneDeckCardScalarWhereInput | RuneDeckCardScalarWhereInput[]
  }

  export type MainDeckCardUncheckedUpdateManyWithoutDeckNestedInput = {
    create?: XOR<MainDeckCardCreateWithoutDeckInput, MainDeckCardUncheckedCreateWithoutDeckInput> | MainDeckCardCreateWithoutDeckInput[] | MainDeckCardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: MainDeckCardCreateOrConnectWithoutDeckInput | MainDeckCardCreateOrConnectWithoutDeckInput[]
    upsert?: MainDeckCardUpsertWithWhereUniqueWithoutDeckInput | MainDeckCardUpsertWithWhereUniqueWithoutDeckInput[]
    createMany?: MainDeckCardCreateManyDeckInputEnvelope
    set?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    disconnect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    delete?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    connect?: MainDeckCardWhereUniqueInput | MainDeckCardWhereUniqueInput[]
    update?: MainDeckCardUpdateWithWhereUniqueWithoutDeckInput | MainDeckCardUpdateWithWhereUniqueWithoutDeckInput[]
    updateMany?: MainDeckCardUpdateManyWithWhereWithoutDeckInput | MainDeckCardUpdateManyWithWhereWithoutDeckInput[]
    deleteMany?: MainDeckCardScalarWhereInput | MainDeckCardScalarWhereInput[]
  }

  export type RuneDeckCardUncheckedUpdateManyWithoutDeckNestedInput = {
    create?: XOR<RuneDeckCardCreateWithoutDeckInput, RuneDeckCardUncheckedCreateWithoutDeckInput> | RuneDeckCardCreateWithoutDeckInput[] | RuneDeckCardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: RuneDeckCardCreateOrConnectWithoutDeckInput | RuneDeckCardCreateOrConnectWithoutDeckInput[]
    upsert?: RuneDeckCardUpsertWithWhereUniqueWithoutDeckInput | RuneDeckCardUpsertWithWhereUniqueWithoutDeckInput[]
    createMany?: RuneDeckCardCreateManyDeckInputEnvelope
    set?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    disconnect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    delete?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    connect?: RuneDeckCardWhereUniqueInput | RuneDeckCardWhereUniqueInput[]
    update?: RuneDeckCardUpdateWithWhereUniqueWithoutDeckInput | RuneDeckCardUpdateWithWhereUniqueWithoutDeckInput[]
    updateMany?: RuneDeckCardUpdateManyWithWhereWithoutDeckInput | RuneDeckCardUpdateManyWithWhereWithoutDeckInput[]
    deleteMany?: RuneDeckCardScalarWhereInput | RuneDeckCardScalarWhereInput[]
  }

  export type DeckCreateNestedOneWithoutMainDeckInput = {
    create?: XOR<DeckCreateWithoutMainDeckInput, DeckUncheckedCreateWithoutMainDeckInput>
    connectOrCreate?: DeckCreateOrConnectWithoutMainDeckInput
    connect?: DeckWhereUniqueInput
  }

  export type CardDefinitionCreateNestedOneWithoutMainDeckCardsInput = {
    create?: XOR<CardDefinitionCreateWithoutMainDeckCardsInput, CardDefinitionUncheckedCreateWithoutMainDeckCardsInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutMainDeckCardsInput
    connect?: CardDefinitionWhereUniqueInput
  }

  export type DeckUpdateOneRequiredWithoutMainDeckNestedInput = {
    create?: XOR<DeckCreateWithoutMainDeckInput, DeckUncheckedCreateWithoutMainDeckInput>
    connectOrCreate?: DeckCreateOrConnectWithoutMainDeckInput
    upsert?: DeckUpsertWithoutMainDeckInput
    connect?: DeckWhereUniqueInput
    update?: XOR<XOR<DeckUpdateToOneWithWhereWithoutMainDeckInput, DeckUpdateWithoutMainDeckInput>, DeckUncheckedUpdateWithoutMainDeckInput>
  }

  export type CardDefinitionUpdateOneRequiredWithoutMainDeckCardsNestedInput = {
    create?: XOR<CardDefinitionCreateWithoutMainDeckCardsInput, CardDefinitionUncheckedCreateWithoutMainDeckCardsInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutMainDeckCardsInput
    upsert?: CardDefinitionUpsertWithoutMainDeckCardsInput
    connect?: CardDefinitionWhereUniqueInput
    update?: XOR<XOR<CardDefinitionUpdateToOneWithWhereWithoutMainDeckCardsInput, CardDefinitionUpdateWithoutMainDeckCardsInput>, CardDefinitionUncheckedUpdateWithoutMainDeckCardsInput>
  }

  export type DeckCreateNestedOneWithoutRuneDeckInput = {
    create?: XOR<DeckCreateWithoutRuneDeckInput, DeckUncheckedCreateWithoutRuneDeckInput>
    connectOrCreate?: DeckCreateOrConnectWithoutRuneDeckInput
    connect?: DeckWhereUniqueInput
  }

  export type CardDefinitionCreateNestedOneWithoutRuneDeckCardsInput = {
    create?: XOR<CardDefinitionCreateWithoutRuneDeckCardsInput, CardDefinitionUncheckedCreateWithoutRuneDeckCardsInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutRuneDeckCardsInput
    connect?: CardDefinitionWhereUniqueInput
  }

  export type DeckUpdateOneRequiredWithoutRuneDeckNestedInput = {
    create?: XOR<DeckCreateWithoutRuneDeckInput, DeckUncheckedCreateWithoutRuneDeckInput>
    connectOrCreate?: DeckCreateOrConnectWithoutRuneDeckInput
    upsert?: DeckUpsertWithoutRuneDeckInput
    connect?: DeckWhereUniqueInput
    update?: XOR<XOR<DeckUpdateToOneWithWhereWithoutRuneDeckInput, DeckUpdateWithoutRuneDeckInput>, DeckUncheckedUpdateWithoutRuneDeckInput>
  }

  export type CardDefinitionUpdateOneRequiredWithoutRuneDeckCardsNestedInput = {
    create?: XOR<CardDefinitionCreateWithoutRuneDeckCardsInput, CardDefinitionUncheckedCreateWithoutRuneDeckCardsInput>
    connectOrCreate?: CardDefinitionCreateOrConnectWithoutRuneDeckCardsInput
    upsert?: CardDefinitionUpsertWithoutRuneDeckCardsInput
    connect?: CardDefinitionWhereUniqueInput
    update?: XOR<XOR<CardDefinitionUpdateToOneWithWhereWithoutRuneDeckCardsInput, CardDefinitionUpdateWithoutRuneDeckCardsInput>, CardDefinitionUncheckedUpdateWithoutRuneDeckCardsInput>
  }

  export type UserCreateNestedOneWithoutGamesAsPlayer1Input = {
    create?: XOR<UserCreateWithoutGamesAsPlayer1Input, UserUncheckedCreateWithoutGamesAsPlayer1Input>
    connectOrCreate?: UserCreateOrConnectWithoutGamesAsPlayer1Input
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutGamesAsPlayer2Input = {
    create?: XOR<UserCreateWithoutGamesAsPlayer2Input, UserUncheckedCreateWithoutGamesAsPlayer2Input>
    connectOrCreate?: UserCreateOrConnectWithoutGamesAsPlayer2Input
    connect?: UserWhereUniqueInput
  }

  export type MatchEventCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchEventCreateWithoutMatchInput, MatchEventUncheckedCreateWithoutMatchInput> | MatchEventCreateWithoutMatchInput[] | MatchEventUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchEventCreateOrConnectWithoutMatchInput | MatchEventCreateOrConnectWithoutMatchInput[]
    createMany?: MatchEventCreateManyMatchInputEnvelope
    connect?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
  }

  export type MatchEventUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchEventCreateWithoutMatchInput, MatchEventUncheckedCreateWithoutMatchInput> | MatchEventCreateWithoutMatchInput[] | MatchEventUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchEventCreateOrConnectWithoutMatchInput | MatchEventCreateOrConnectWithoutMatchInput[]
    createMany?: MatchEventCreateManyMatchInputEnvelope
    connect?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
  }

  export type EnumMatchStatusFieldUpdateOperationsInput = {
    set?: $Enums.MatchStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutGamesAsPlayer1NestedInput = {
    create?: XOR<UserCreateWithoutGamesAsPlayer1Input, UserUncheckedCreateWithoutGamesAsPlayer1Input>
    connectOrCreate?: UserCreateOrConnectWithoutGamesAsPlayer1Input
    upsert?: UserUpsertWithoutGamesAsPlayer1Input
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGamesAsPlayer1Input, UserUpdateWithoutGamesAsPlayer1Input>, UserUncheckedUpdateWithoutGamesAsPlayer1Input>
  }

  export type UserUpdateOneRequiredWithoutGamesAsPlayer2NestedInput = {
    create?: XOR<UserCreateWithoutGamesAsPlayer2Input, UserUncheckedCreateWithoutGamesAsPlayer2Input>
    connectOrCreate?: UserCreateOrConnectWithoutGamesAsPlayer2Input
    upsert?: UserUpsertWithoutGamesAsPlayer2Input
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGamesAsPlayer2Input, UserUpdateWithoutGamesAsPlayer2Input>, UserUncheckedUpdateWithoutGamesAsPlayer2Input>
  }

  export type MatchEventUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchEventCreateWithoutMatchInput, MatchEventUncheckedCreateWithoutMatchInput> | MatchEventCreateWithoutMatchInput[] | MatchEventUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchEventCreateOrConnectWithoutMatchInput | MatchEventCreateOrConnectWithoutMatchInput[]
    upsert?: MatchEventUpsertWithWhereUniqueWithoutMatchInput | MatchEventUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchEventCreateManyMatchInputEnvelope
    set?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
    disconnect?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
    delete?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
    connect?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
    update?: MatchEventUpdateWithWhereUniqueWithoutMatchInput | MatchEventUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchEventUpdateManyWithWhereWithoutMatchInput | MatchEventUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchEventScalarWhereInput | MatchEventScalarWhereInput[]
  }

  export type MatchEventUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchEventCreateWithoutMatchInput, MatchEventUncheckedCreateWithoutMatchInput> | MatchEventCreateWithoutMatchInput[] | MatchEventUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchEventCreateOrConnectWithoutMatchInput | MatchEventCreateOrConnectWithoutMatchInput[]
    upsert?: MatchEventUpsertWithWhereUniqueWithoutMatchInput | MatchEventUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchEventCreateManyMatchInputEnvelope
    set?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
    disconnect?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
    delete?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
    connect?: MatchEventWhereUniqueInput | MatchEventWhereUniqueInput[]
    update?: MatchEventUpdateWithWhereUniqueWithoutMatchInput | MatchEventUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchEventUpdateManyWithWhereWithoutMatchInput | MatchEventUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchEventScalarWhereInput | MatchEventScalarWhereInput[]
  }

  export type MatchCreateNestedOneWithoutEventsInput = {
    create?: XOR<MatchCreateWithoutEventsInput, MatchUncheckedCreateWithoutEventsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutEventsInput
    connect?: MatchWhereUniqueInput
  }

  export type MatchUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<MatchCreateWithoutEventsInput, MatchUncheckedCreateWithoutEventsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutEventsInput
    upsert?: MatchUpsertWithoutEventsInput
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutEventsInput, MatchUpdateWithoutEventsInput>, MatchUncheckedUpdateWithoutEventsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumCardTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CardType | EnumCardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CardType[] | ListEnumCardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CardType[] | ListEnumCardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCardTypeFilter<$PrismaModel> | $Enums.CardType
  }

  export type NestedEnumRarityFilter<$PrismaModel = never> = {
    equals?: $Enums.Rarity | EnumRarityFieldRefInput<$PrismaModel>
    in?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    not?: NestedEnumRarityFilter<$PrismaModel> | $Enums.Rarity
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumCardTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CardType | EnumCardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CardType[] | ListEnumCardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CardType[] | ListEnumCardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCardTypeWithAggregatesFilter<$PrismaModel> | $Enums.CardType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCardTypeFilter<$PrismaModel>
    _max?: NestedEnumCardTypeFilter<$PrismaModel>
  }

  export type NestedEnumRarityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Rarity | EnumRarityFieldRefInput<$PrismaModel>
    in?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    not?: NestedEnumRarityWithAggregatesFilter<$PrismaModel> | $Enums.Rarity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRarityFilter<$PrismaModel>
    _max?: NestedEnumRarityFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumMatchStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | EnumMatchStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchStatusFilter<$PrismaModel> | $Enums.MatchStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | EnumMatchStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchStatusFilter<$PrismaModel>
    _max?: NestedEnumMatchStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DeckCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    championLegend: CardDefinitionCreateNestedOneWithoutDecksAsLegendInput
    chosenChampion: CardDefinitionCreateNestedOneWithoutDecksAsChampionInput
    battlefield: CardDefinitionCreateNestedOneWithoutDecksAsBattlefieldInput
    mainDeck?: MainDeckCardCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardCreateNestedManyWithoutDeckInput
  }

  export type DeckUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    championLegendId: string
    chosenChampionId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    mainDeck?: MainDeckCardUncheckedCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type DeckCreateOrConnectWithoutUserInput = {
    where: DeckWhereUniqueInput
    create: XOR<DeckCreateWithoutUserInput, DeckUncheckedCreateWithoutUserInput>
  }

  export type DeckCreateManyUserInputEnvelope = {
    data: DeckCreateManyUserInput | DeckCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutPlayer1Input = {
    id?: string
    player1DeckId?: string | null
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    player2: UserCreateNestedOneWithoutGamesAsPlayer2Input
    events?: MatchEventCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutPlayer1Input = {
    id?: string
    player1DeckId?: string | null
    player2Id: string
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: MatchEventUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutPlayer1Input = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input>
  }

  export type MatchCreateManyPlayer1InputEnvelope = {
    data: MatchCreateManyPlayer1Input | MatchCreateManyPlayer1Input[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutPlayer2Input = {
    id?: string
    player1DeckId?: string | null
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    player1: UserCreateNestedOneWithoutGamesAsPlayer1Input
    events?: MatchEventCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutPlayer2Input = {
    id?: string
    player1Id: string
    player1DeckId?: string | null
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: MatchEventUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutPlayer2Input = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input>
  }

  export type MatchCreateManyPlayer2InputEnvelope = {
    data: MatchCreateManyPlayer2Input | MatchCreateManyPlayer2Input[]
    skipDuplicates?: boolean
  }

  export type DeckUpsertWithWhereUniqueWithoutUserInput = {
    where: DeckWhereUniqueInput
    update: XOR<DeckUpdateWithoutUserInput, DeckUncheckedUpdateWithoutUserInput>
    create: XOR<DeckCreateWithoutUserInput, DeckUncheckedCreateWithoutUserInput>
  }

  export type DeckUpdateWithWhereUniqueWithoutUserInput = {
    where: DeckWhereUniqueInput
    data: XOR<DeckUpdateWithoutUserInput, DeckUncheckedUpdateWithoutUserInput>
  }

  export type DeckUpdateManyWithWhereWithoutUserInput = {
    where: DeckScalarWhereInput
    data: XOR<DeckUpdateManyMutationInput, DeckUncheckedUpdateManyWithoutUserInput>
  }

  export type DeckScalarWhereInput = {
    AND?: DeckScalarWhereInput | DeckScalarWhereInput[]
    OR?: DeckScalarWhereInput[]
    NOT?: DeckScalarWhereInput | DeckScalarWhereInput[]
    id?: StringFilter<"Deck"> | string
    name?: StringFilter<"Deck"> | string
    description?: StringNullableFilter<"Deck"> | string | null
    userId?: StringFilter<"Deck"> | string
    championLegendId?: StringFilter<"Deck"> | string
    chosenChampionId?: StringFilter<"Deck"> | string
    battlefieldId?: StringFilter<"Deck"> | string
    isValid?: BoolFilter<"Deck"> | boolean
    totalCards?: IntFilter<"Deck"> | number
    format?: StringFilter<"Deck"> | string
    playCount?: IntFilter<"Deck"> | number
    winCount?: IntFilter<"Deck"> | number
    createdAt?: DateTimeFilter<"Deck"> | Date | string
    updatedAt?: DateTimeFilter<"Deck"> | Date | string
  }

  export type MatchUpsertWithWhereUniqueWithoutPlayer1Input = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutPlayer1Input, MatchUncheckedUpdateWithoutPlayer1Input>
    create: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input>
  }

  export type MatchUpdateWithWhereUniqueWithoutPlayer1Input = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutPlayer1Input, MatchUncheckedUpdateWithoutPlayer1Input>
  }

  export type MatchUpdateManyWithWhereWithoutPlayer1Input = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutPlayer1Input>
  }

  export type MatchScalarWhereInput = {
    AND?: MatchScalarWhereInput | MatchScalarWhereInput[]
    OR?: MatchScalarWhereInput[]
    NOT?: MatchScalarWhereInput | MatchScalarWhereInput[]
    id?: StringFilter<"Match"> | string
    player1Id?: StringFilter<"Match"> | string
    player1DeckId?: StringNullableFilter<"Match"> | string | null
    player2Id?: StringFilter<"Match"> | string
    player2DeckId?: StringNullableFilter<"Match"> | string | null
    status?: EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus
    winnerId?: StringNullableFilter<"Match"> | string | null
    winCondition?: StringNullableFilter<"Match"> | string | null
    currentRound?: IntFilter<"Match"> | number
    currentPhase?: StringNullableFilter<"Match"> | string | null
    gameState?: JsonNullableFilter<"Match">
    format?: StringFilter<"Match"> | string
    isRanked?: BoolFilter<"Match"> | boolean
    startedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    duration?: IntNullableFilter<"Match"> | number | null
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
  }

  export type MatchUpsertWithWhereUniqueWithoutPlayer2Input = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutPlayer2Input, MatchUncheckedUpdateWithoutPlayer2Input>
    create: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input>
  }

  export type MatchUpdateWithWhereUniqueWithoutPlayer2Input = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutPlayer2Input, MatchUncheckedUpdateWithoutPlayer2Input>
  }

  export type MatchUpdateManyWithWhereWithoutPlayer2Input = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutPlayer2Input>
  }

  export type DeckCreateWithoutChampionLegendInput = {
    id?: string
    name: string
    description?: string | null
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDecksInput
    chosenChampion: CardDefinitionCreateNestedOneWithoutDecksAsChampionInput
    battlefield: CardDefinitionCreateNestedOneWithoutDecksAsBattlefieldInput
    mainDeck?: MainDeckCardCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardCreateNestedManyWithoutDeckInput
  }

  export type DeckUncheckedCreateWithoutChampionLegendInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    chosenChampionId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    mainDeck?: MainDeckCardUncheckedCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type DeckCreateOrConnectWithoutChampionLegendInput = {
    where: DeckWhereUniqueInput
    create: XOR<DeckCreateWithoutChampionLegendInput, DeckUncheckedCreateWithoutChampionLegendInput>
  }

  export type DeckCreateManyChampionLegendInputEnvelope = {
    data: DeckCreateManyChampionLegendInput | DeckCreateManyChampionLegendInput[]
    skipDuplicates?: boolean
  }

  export type DeckCreateWithoutChosenChampionInput = {
    id?: string
    name: string
    description?: string | null
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDecksInput
    championLegend: CardDefinitionCreateNestedOneWithoutDecksAsLegendInput
    battlefield: CardDefinitionCreateNestedOneWithoutDecksAsBattlefieldInput
    mainDeck?: MainDeckCardCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardCreateNestedManyWithoutDeckInput
  }

  export type DeckUncheckedCreateWithoutChosenChampionInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    championLegendId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    mainDeck?: MainDeckCardUncheckedCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type DeckCreateOrConnectWithoutChosenChampionInput = {
    where: DeckWhereUniqueInput
    create: XOR<DeckCreateWithoutChosenChampionInput, DeckUncheckedCreateWithoutChosenChampionInput>
  }

  export type DeckCreateManyChosenChampionInputEnvelope = {
    data: DeckCreateManyChosenChampionInput | DeckCreateManyChosenChampionInput[]
    skipDuplicates?: boolean
  }

  export type DeckCreateWithoutBattlefieldInput = {
    id?: string
    name: string
    description?: string | null
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDecksInput
    championLegend: CardDefinitionCreateNestedOneWithoutDecksAsLegendInput
    chosenChampion: CardDefinitionCreateNestedOneWithoutDecksAsChampionInput
    mainDeck?: MainDeckCardCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardCreateNestedManyWithoutDeckInput
  }

  export type DeckUncheckedCreateWithoutBattlefieldInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    championLegendId: string
    chosenChampionId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    mainDeck?: MainDeckCardUncheckedCreateNestedManyWithoutDeckInput
    runeDeck?: RuneDeckCardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type DeckCreateOrConnectWithoutBattlefieldInput = {
    where: DeckWhereUniqueInput
    create: XOR<DeckCreateWithoutBattlefieldInput, DeckUncheckedCreateWithoutBattlefieldInput>
  }

  export type DeckCreateManyBattlefieldInputEnvelope = {
    data: DeckCreateManyBattlefieldInput | DeckCreateManyBattlefieldInput[]
    skipDuplicates?: boolean
  }

  export type MainDeckCardCreateWithoutCardInput = {
    id?: string
    quantity?: number
    deck: DeckCreateNestedOneWithoutMainDeckInput
  }

  export type MainDeckCardUncheckedCreateWithoutCardInput = {
    id?: string
    deckId: string
    quantity?: number
  }

  export type MainDeckCardCreateOrConnectWithoutCardInput = {
    where: MainDeckCardWhereUniqueInput
    create: XOR<MainDeckCardCreateWithoutCardInput, MainDeckCardUncheckedCreateWithoutCardInput>
  }

  export type MainDeckCardCreateManyCardInputEnvelope = {
    data: MainDeckCardCreateManyCardInput | MainDeckCardCreateManyCardInput[]
    skipDuplicates?: boolean
  }

  export type RuneDeckCardCreateWithoutCardInput = {
    id?: string
    quantity?: number
    deck: DeckCreateNestedOneWithoutRuneDeckInput
  }

  export type RuneDeckCardUncheckedCreateWithoutCardInput = {
    id?: string
    deckId: string
    quantity?: number
  }

  export type RuneDeckCardCreateOrConnectWithoutCardInput = {
    where: RuneDeckCardWhereUniqueInput
    create: XOR<RuneDeckCardCreateWithoutCardInput, RuneDeckCardUncheckedCreateWithoutCardInput>
  }

  export type RuneDeckCardCreateManyCardInputEnvelope = {
    data: RuneDeckCardCreateManyCardInput | RuneDeckCardCreateManyCardInput[]
    skipDuplicates?: boolean
  }

  export type DeckUpsertWithWhereUniqueWithoutChampionLegendInput = {
    where: DeckWhereUniqueInput
    update: XOR<DeckUpdateWithoutChampionLegendInput, DeckUncheckedUpdateWithoutChampionLegendInput>
    create: XOR<DeckCreateWithoutChampionLegendInput, DeckUncheckedCreateWithoutChampionLegendInput>
  }

  export type DeckUpdateWithWhereUniqueWithoutChampionLegendInput = {
    where: DeckWhereUniqueInput
    data: XOR<DeckUpdateWithoutChampionLegendInput, DeckUncheckedUpdateWithoutChampionLegendInput>
  }

  export type DeckUpdateManyWithWhereWithoutChampionLegendInput = {
    where: DeckScalarWhereInput
    data: XOR<DeckUpdateManyMutationInput, DeckUncheckedUpdateManyWithoutChampionLegendInput>
  }

  export type DeckUpsertWithWhereUniqueWithoutChosenChampionInput = {
    where: DeckWhereUniqueInput
    update: XOR<DeckUpdateWithoutChosenChampionInput, DeckUncheckedUpdateWithoutChosenChampionInput>
    create: XOR<DeckCreateWithoutChosenChampionInput, DeckUncheckedCreateWithoutChosenChampionInput>
  }

  export type DeckUpdateWithWhereUniqueWithoutChosenChampionInput = {
    where: DeckWhereUniqueInput
    data: XOR<DeckUpdateWithoutChosenChampionInput, DeckUncheckedUpdateWithoutChosenChampionInput>
  }

  export type DeckUpdateManyWithWhereWithoutChosenChampionInput = {
    where: DeckScalarWhereInput
    data: XOR<DeckUpdateManyMutationInput, DeckUncheckedUpdateManyWithoutChosenChampionInput>
  }

  export type DeckUpsertWithWhereUniqueWithoutBattlefieldInput = {
    where: DeckWhereUniqueInput
    update: XOR<DeckUpdateWithoutBattlefieldInput, DeckUncheckedUpdateWithoutBattlefieldInput>
    create: XOR<DeckCreateWithoutBattlefieldInput, DeckUncheckedCreateWithoutBattlefieldInput>
  }

  export type DeckUpdateWithWhereUniqueWithoutBattlefieldInput = {
    where: DeckWhereUniqueInput
    data: XOR<DeckUpdateWithoutBattlefieldInput, DeckUncheckedUpdateWithoutBattlefieldInput>
  }

  export type DeckUpdateManyWithWhereWithoutBattlefieldInput = {
    where: DeckScalarWhereInput
    data: XOR<DeckUpdateManyMutationInput, DeckUncheckedUpdateManyWithoutBattlefieldInput>
  }

  export type MainDeckCardUpsertWithWhereUniqueWithoutCardInput = {
    where: MainDeckCardWhereUniqueInput
    update: XOR<MainDeckCardUpdateWithoutCardInput, MainDeckCardUncheckedUpdateWithoutCardInput>
    create: XOR<MainDeckCardCreateWithoutCardInput, MainDeckCardUncheckedCreateWithoutCardInput>
  }

  export type MainDeckCardUpdateWithWhereUniqueWithoutCardInput = {
    where: MainDeckCardWhereUniqueInput
    data: XOR<MainDeckCardUpdateWithoutCardInput, MainDeckCardUncheckedUpdateWithoutCardInput>
  }

  export type MainDeckCardUpdateManyWithWhereWithoutCardInput = {
    where: MainDeckCardScalarWhereInput
    data: XOR<MainDeckCardUpdateManyMutationInput, MainDeckCardUncheckedUpdateManyWithoutCardInput>
  }

  export type MainDeckCardScalarWhereInput = {
    AND?: MainDeckCardScalarWhereInput | MainDeckCardScalarWhereInput[]
    OR?: MainDeckCardScalarWhereInput[]
    NOT?: MainDeckCardScalarWhereInput | MainDeckCardScalarWhereInput[]
    id?: StringFilter<"MainDeckCard"> | string
    deckId?: StringFilter<"MainDeckCard"> | string
    cardId?: StringFilter<"MainDeckCard"> | string
    quantity?: IntFilter<"MainDeckCard"> | number
  }

  export type RuneDeckCardUpsertWithWhereUniqueWithoutCardInput = {
    where: RuneDeckCardWhereUniqueInput
    update: XOR<RuneDeckCardUpdateWithoutCardInput, RuneDeckCardUncheckedUpdateWithoutCardInput>
    create: XOR<RuneDeckCardCreateWithoutCardInput, RuneDeckCardUncheckedCreateWithoutCardInput>
  }

  export type RuneDeckCardUpdateWithWhereUniqueWithoutCardInput = {
    where: RuneDeckCardWhereUniqueInput
    data: XOR<RuneDeckCardUpdateWithoutCardInput, RuneDeckCardUncheckedUpdateWithoutCardInput>
  }

  export type RuneDeckCardUpdateManyWithWhereWithoutCardInput = {
    where: RuneDeckCardScalarWhereInput
    data: XOR<RuneDeckCardUpdateManyMutationInput, RuneDeckCardUncheckedUpdateManyWithoutCardInput>
  }

  export type RuneDeckCardScalarWhereInput = {
    AND?: RuneDeckCardScalarWhereInput | RuneDeckCardScalarWhereInput[]
    OR?: RuneDeckCardScalarWhereInput[]
    NOT?: RuneDeckCardScalarWhereInput | RuneDeckCardScalarWhereInput[]
    id?: StringFilter<"RuneDeckCard"> | string
    deckId?: StringFilter<"RuneDeckCard"> | string
    cardId?: StringFilter<"RuneDeckCard"> | string
    quantity?: IntFilter<"RuneDeckCard"> | number
  }

  export type UserCreateWithoutDecksInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    gamesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    gamesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
  }

  export type UserUncheckedCreateWithoutDecksInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    gamesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    gamesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
  }

  export type UserCreateOrConnectWithoutDecksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDecksInput, UserUncheckedCreateWithoutDecksInput>
  }

  export type CardDefinitionCreateWithoutDecksAsLegendInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsChampion?: DeckCreateNestedManyWithoutChosenChampionInput
    decksAsBattlefield?: DeckCreateNestedManyWithoutBattlefieldInput
    mainDeckCards?: MainDeckCardCreateNestedManyWithoutCardInput
    runeDeckCards?: RuneDeckCardCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionUncheckedCreateWithoutDecksAsLegendInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsChampion?: DeckUncheckedCreateNestedManyWithoutChosenChampionInput
    decksAsBattlefield?: DeckUncheckedCreateNestedManyWithoutBattlefieldInput
    mainDeckCards?: MainDeckCardUncheckedCreateNestedManyWithoutCardInput
    runeDeckCards?: RuneDeckCardUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionCreateOrConnectWithoutDecksAsLegendInput = {
    where: CardDefinitionWhereUniqueInput
    create: XOR<CardDefinitionCreateWithoutDecksAsLegendInput, CardDefinitionUncheckedCreateWithoutDecksAsLegendInput>
  }

  export type CardDefinitionCreateWithoutDecksAsChampionInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckCreateNestedManyWithoutChampionLegendInput
    decksAsBattlefield?: DeckCreateNestedManyWithoutBattlefieldInput
    mainDeckCards?: MainDeckCardCreateNestedManyWithoutCardInput
    runeDeckCards?: RuneDeckCardCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionUncheckedCreateWithoutDecksAsChampionInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckUncheckedCreateNestedManyWithoutChampionLegendInput
    decksAsBattlefield?: DeckUncheckedCreateNestedManyWithoutBattlefieldInput
    mainDeckCards?: MainDeckCardUncheckedCreateNestedManyWithoutCardInput
    runeDeckCards?: RuneDeckCardUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionCreateOrConnectWithoutDecksAsChampionInput = {
    where: CardDefinitionWhereUniqueInput
    create: XOR<CardDefinitionCreateWithoutDecksAsChampionInput, CardDefinitionUncheckedCreateWithoutDecksAsChampionInput>
  }

  export type CardDefinitionCreateWithoutDecksAsBattlefieldInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckCreateNestedManyWithoutChampionLegendInput
    decksAsChampion?: DeckCreateNestedManyWithoutChosenChampionInput
    mainDeckCards?: MainDeckCardCreateNestedManyWithoutCardInput
    runeDeckCards?: RuneDeckCardCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionUncheckedCreateWithoutDecksAsBattlefieldInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckUncheckedCreateNestedManyWithoutChampionLegendInput
    decksAsChampion?: DeckUncheckedCreateNestedManyWithoutChosenChampionInput
    mainDeckCards?: MainDeckCardUncheckedCreateNestedManyWithoutCardInput
    runeDeckCards?: RuneDeckCardUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionCreateOrConnectWithoutDecksAsBattlefieldInput = {
    where: CardDefinitionWhereUniqueInput
    create: XOR<CardDefinitionCreateWithoutDecksAsBattlefieldInput, CardDefinitionUncheckedCreateWithoutDecksAsBattlefieldInput>
  }

  export type MainDeckCardCreateWithoutDeckInput = {
    id?: string
    quantity?: number
    card: CardDefinitionCreateNestedOneWithoutMainDeckCardsInput
  }

  export type MainDeckCardUncheckedCreateWithoutDeckInput = {
    id?: string
    cardId: string
    quantity?: number
  }

  export type MainDeckCardCreateOrConnectWithoutDeckInput = {
    where: MainDeckCardWhereUniqueInput
    create: XOR<MainDeckCardCreateWithoutDeckInput, MainDeckCardUncheckedCreateWithoutDeckInput>
  }

  export type MainDeckCardCreateManyDeckInputEnvelope = {
    data: MainDeckCardCreateManyDeckInput | MainDeckCardCreateManyDeckInput[]
    skipDuplicates?: boolean
  }

  export type RuneDeckCardCreateWithoutDeckInput = {
    id?: string
    quantity?: number
    card: CardDefinitionCreateNestedOneWithoutRuneDeckCardsInput
  }

  export type RuneDeckCardUncheckedCreateWithoutDeckInput = {
    id?: string
    cardId: string
    quantity?: number
  }

  export type RuneDeckCardCreateOrConnectWithoutDeckInput = {
    where: RuneDeckCardWhereUniqueInput
    create: XOR<RuneDeckCardCreateWithoutDeckInput, RuneDeckCardUncheckedCreateWithoutDeckInput>
  }

  export type RuneDeckCardCreateManyDeckInputEnvelope = {
    data: RuneDeckCardCreateManyDeckInput | RuneDeckCardCreateManyDeckInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutDecksInput = {
    update: XOR<UserUpdateWithoutDecksInput, UserUncheckedUpdateWithoutDecksInput>
    create: XOR<UserCreateWithoutDecksInput, UserUncheckedCreateWithoutDecksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDecksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDecksInput, UserUncheckedUpdateWithoutDecksInput>
  }

  export type UserUpdateWithoutDecksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gamesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    gamesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
  }

  export type UserUncheckedUpdateWithoutDecksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gamesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    gamesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
  }

  export type CardDefinitionUpsertWithoutDecksAsLegendInput = {
    update: XOR<CardDefinitionUpdateWithoutDecksAsLegendInput, CardDefinitionUncheckedUpdateWithoutDecksAsLegendInput>
    create: XOR<CardDefinitionCreateWithoutDecksAsLegendInput, CardDefinitionUncheckedCreateWithoutDecksAsLegendInput>
    where?: CardDefinitionWhereInput
  }

  export type CardDefinitionUpdateToOneWithWhereWithoutDecksAsLegendInput = {
    where?: CardDefinitionWhereInput
    data: XOR<CardDefinitionUpdateWithoutDecksAsLegendInput, CardDefinitionUncheckedUpdateWithoutDecksAsLegendInput>
  }

  export type CardDefinitionUpdateWithoutDecksAsLegendInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsChampion?: DeckUpdateManyWithoutChosenChampionNestedInput
    decksAsBattlefield?: DeckUpdateManyWithoutBattlefieldNestedInput
    mainDeckCards?: MainDeckCardUpdateManyWithoutCardNestedInput
    runeDeckCards?: RuneDeckCardUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionUncheckedUpdateWithoutDecksAsLegendInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsChampion?: DeckUncheckedUpdateManyWithoutChosenChampionNestedInput
    decksAsBattlefield?: DeckUncheckedUpdateManyWithoutBattlefieldNestedInput
    mainDeckCards?: MainDeckCardUncheckedUpdateManyWithoutCardNestedInput
    runeDeckCards?: RuneDeckCardUncheckedUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionUpsertWithoutDecksAsChampionInput = {
    update: XOR<CardDefinitionUpdateWithoutDecksAsChampionInput, CardDefinitionUncheckedUpdateWithoutDecksAsChampionInput>
    create: XOR<CardDefinitionCreateWithoutDecksAsChampionInput, CardDefinitionUncheckedCreateWithoutDecksAsChampionInput>
    where?: CardDefinitionWhereInput
  }

  export type CardDefinitionUpdateToOneWithWhereWithoutDecksAsChampionInput = {
    where?: CardDefinitionWhereInput
    data: XOR<CardDefinitionUpdateWithoutDecksAsChampionInput, CardDefinitionUncheckedUpdateWithoutDecksAsChampionInput>
  }

  export type CardDefinitionUpdateWithoutDecksAsChampionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUpdateManyWithoutChampionLegendNestedInput
    decksAsBattlefield?: DeckUpdateManyWithoutBattlefieldNestedInput
    mainDeckCards?: MainDeckCardUpdateManyWithoutCardNestedInput
    runeDeckCards?: RuneDeckCardUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionUncheckedUpdateWithoutDecksAsChampionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUncheckedUpdateManyWithoutChampionLegendNestedInput
    decksAsBattlefield?: DeckUncheckedUpdateManyWithoutBattlefieldNestedInput
    mainDeckCards?: MainDeckCardUncheckedUpdateManyWithoutCardNestedInput
    runeDeckCards?: RuneDeckCardUncheckedUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionUpsertWithoutDecksAsBattlefieldInput = {
    update: XOR<CardDefinitionUpdateWithoutDecksAsBattlefieldInput, CardDefinitionUncheckedUpdateWithoutDecksAsBattlefieldInput>
    create: XOR<CardDefinitionCreateWithoutDecksAsBattlefieldInput, CardDefinitionUncheckedCreateWithoutDecksAsBattlefieldInput>
    where?: CardDefinitionWhereInput
  }

  export type CardDefinitionUpdateToOneWithWhereWithoutDecksAsBattlefieldInput = {
    where?: CardDefinitionWhereInput
    data: XOR<CardDefinitionUpdateWithoutDecksAsBattlefieldInput, CardDefinitionUncheckedUpdateWithoutDecksAsBattlefieldInput>
  }

  export type CardDefinitionUpdateWithoutDecksAsBattlefieldInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUpdateManyWithoutChampionLegendNestedInput
    decksAsChampion?: DeckUpdateManyWithoutChosenChampionNestedInput
    mainDeckCards?: MainDeckCardUpdateManyWithoutCardNestedInput
    runeDeckCards?: RuneDeckCardUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionUncheckedUpdateWithoutDecksAsBattlefieldInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUncheckedUpdateManyWithoutChampionLegendNestedInput
    decksAsChampion?: DeckUncheckedUpdateManyWithoutChosenChampionNestedInput
    mainDeckCards?: MainDeckCardUncheckedUpdateManyWithoutCardNestedInput
    runeDeckCards?: RuneDeckCardUncheckedUpdateManyWithoutCardNestedInput
  }

  export type MainDeckCardUpsertWithWhereUniqueWithoutDeckInput = {
    where: MainDeckCardWhereUniqueInput
    update: XOR<MainDeckCardUpdateWithoutDeckInput, MainDeckCardUncheckedUpdateWithoutDeckInput>
    create: XOR<MainDeckCardCreateWithoutDeckInput, MainDeckCardUncheckedCreateWithoutDeckInput>
  }

  export type MainDeckCardUpdateWithWhereUniqueWithoutDeckInput = {
    where: MainDeckCardWhereUniqueInput
    data: XOR<MainDeckCardUpdateWithoutDeckInput, MainDeckCardUncheckedUpdateWithoutDeckInput>
  }

  export type MainDeckCardUpdateManyWithWhereWithoutDeckInput = {
    where: MainDeckCardScalarWhereInput
    data: XOR<MainDeckCardUpdateManyMutationInput, MainDeckCardUncheckedUpdateManyWithoutDeckInput>
  }

  export type RuneDeckCardUpsertWithWhereUniqueWithoutDeckInput = {
    where: RuneDeckCardWhereUniqueInput
    update: XOR<RuneDeckCardUpdateWithoutDeckInput, RuneDeckCardUncheckedUpdateWithoutDeckInput>
    create: XOR<RuneDeckCardCreateWithoutDeckInput, RuneDeckCardUncheckedCreateWithoutDeckInput>
  }

  export type RuneDeckCardUpdateWithWhereUniqueWithoutDeckInput = {
    where: RuneDeckCardWhereUniqueInput
    data: XOR<RuneDeckCardUpdateWithoutDeckInput, RuneDeckCardUncheckedUpdateWithoutDeckInput>
  }

  export type RuneDeckCardUpdateManyWithWhereWithoutDeckInput = {
    where: RuneDeckCardScalarWhereInput
    data: XOR<RuneDeckCardUpdateManyMutationInput, RuneDeckCardUncheckedUpdateManyWithoutDeckInput>
  }

  export type DeckCreateWithoutMainDeckInput = {
    id?: string
    name: string
    description?: string | null
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDecksInput
    championLegend: CardDefinitionCreateNestedOneWithoutDecksAsLegendInput
    chosenChampion: CardDefinitionCreateNestedOneWithoutDecksAsChampionInput
    battlefield: CardDefinitionCreateNestedOneWithoutDecksAsBattlefieldInput
    runeDeck?: RuneDeckCardCreateNestedManyWithoutDeckInput
  }

  export type DeckUncheckedCreateWithoutMainDeckInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    championLegendId: string
    chosenChampionId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    runeDeck?: RuneDeckCardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type DeckCreateOrConnectWithoutMainDeckInput = {
    where: DeckWhereUniqueInput
    create: XOR<DeckCreateWithoutMainDeckInput, DeckUncheckedCreateWithoutMainDeckInput>
  }

  export type CardDefinitionCreateWithoutMainDeckCardsInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckCreateNestedManyWithoutChampionLegendInput
    decksAsChampion?: DeckCreateNestedManyWithoutChosenChampionInput
    decksAsBattlefield?: DeckCreateNestedManyWithoutBattlefieldInput
    runeDeckCards?: RuneDeckCardCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionUncheckedCreateWithoutMainDeckCardsInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckUncheckedCreateNestedManyWithoutChampionLegendInput
    decksAsChampion?: DeckUncheckedCreateNestedManyWithoutChosenChampionInput
    decksAsBattlefield?: DeckUncheckedCreateNestedManyWithoutBattlefieldInput
    runeDeckCards?: RuneDeckCardUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionCreateOrConnectWithoutMainDeckCardsInput = {
    where: CardDefinitionWhereUniqueInput
    create: XOR<CardDefinitionCreateWithoutMainDeckCardsInput, CardDefinitionUncheckedCreateWithoutMainDeckCardsInput>
  }

  export type DeckUpsertWithoutMainDeckInput = {
    update: XOR<DeckUpdateWithoutMainDeckInput, DeckUncheckedUpdateWithoutMainDeckInput>
    create: XOR<DeckCreateWithoutMainDeckInput, DeckUncheckedCreateWithoutMainDeckInput>
    where?: DeckWhereInput
  }

  export type DeckUpdateToOneWithWhereWithoutMainDeckInput = {
    where?: DeckWhereInput
    data: XOR<DeckUpdateWithoutMainDeckInput, DeckUncheckedUpdateWithoutMainDeckInput>
  }

  export type DeckUpdateWithoutMainDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDecksNestedInput
    championLegend?: CardDefinitionUpdateOneRequiredWithoutDecksAsLegendNestedInput
    chosenChampion?: CardDefinitionUpdateOneRequiredWithoutDecksAsChampionNestedInput
    battlefield?: CardDefinitionUpdateOneRequiredWithoutDecksAsBattlefieldNestedInput
    runeDeck?: RuneDeckCardUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateWithoutMainDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    championLegendId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runeDeck?: RuneDeckCardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type CardDefinitionUpsertWithoutMainDeckCardsInput = {
    update: XOR<CardDefinitionUpdateWithoutMainDeckCardsInput, CardDefinitionUncheckedUpdateWithoutMainDeckCardsInput>
    create: XOR<CardDefinitionCreateWithoutMainDeckCardsInput, CardDefinitionUncheckedCreateWithoutMainDeckCardsInput>
    where?: CardDefinitionWhereInput
  }

  export type CardDefinitionUpdateToOneWithWhereWithoutMainDeckCardsInput = {
    where?: CardDefinitionWhereInput
    data: XOR<CardDefinitionUpdateWithoutMainDeckCardsInput, CardDefinitionUncheckedUpdateWithoutMainDeckCardsInput>
  }

  export type CardDefinitionUpdateWithoutMainDeckCardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUpdateManyWithoutChampionLegendNestedInput
    decksAsChampion?: DeckUpdateManyWithoutChosenChampionNestedInput
    decksAsBattlefield?: DeckUpdateManyWithoutBattlefieldNestedInput
    runeDeckCards?: RuneDeckCardUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionUncheckedUpdateWithoutMainDeckCardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUncheckedUpdateManyWithoutChampionLegendNestedInput
    decksAsChampion?: DeckUncheckedUpdateManyWithoutChosenChampionNestedInput
    decksAsBattlefield?: DeckUncheckedUpdateManyWithoutBattlefieldNestedInput
    runeDeckCards?: RuneDeckCardUncheckedUpdateManyWithoutCardNestedInput
  }

  export type DeckCreateWithoutRuneDeckInput = {
    id?: string
    name: string
    description?: string | null
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDecksInput
    championLegend: CardDefinitionCreateNestedOneWithoutDecksAsLegendInput
    chosenChampion: CardDefinitionCreateNestedOneWithoutDecksAsChampionInput
    battlefield: CardDefinitionCreateNestedOneWithoutDecksAsBattlefieldInput
    mainDeck?: MainDeckCardCreateNestedManyWithoutDeckInput
  }

  export type DeckUncheckedCreateWithoutRuneDeckInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    championLegendId: string
    chosenChampionId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    mainDeck?: MainDeckCardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type DeckCreateOrConnectWithoutRuneDeckInput = {
    where: DeckWhereUniqueInput
    create: XOR<DeckCreateWithoutRuneDeckInput, DeckUncheckedCreateWithoutRuneDeckInput>
  }

  export type CardDefinitionCreateWithoutRuneDeckCardsInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckCreateNestedManyWithoutChampionLegendInput
    decksAsChampion?: DeckCreateNestedManyWithoutChosenChampionInput
    decksAsBattlefield?: DeckCreateNestedManyWithoutBattlefieldInput
    mainDeckCards?: MainDeckCardCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionUncheckedCreateWithoutRuneDeckCardsInput = {
    id: string
    name: string
    cardType: $Enums.CardType
    rarity: $Enums.Rarity
    energyCost: number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description: string
    flavorText?: string | null
    might?: number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: string | null
    hasScript?: boolean
    imageUrl?: string | null
    artist?: string | null
    cardNumber?: string | null
    setCode?: string | null
    setName?: string | null
    isSignature?: boolean
    isBasicRune?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    decksAsLegend?: DeckUncheckedCreateNestedManyWithoutChampionLegendInput
    decksAsChampion?: DeckUncheckedCreateNestedManyWithoutChosenChampionInput
    decksAsBattlefield?: DeckUncheckedCreateNestedManyWithoutBattlefieldInput
    mainDeckCards?: MainDeckCardUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardDefinitionCreateOrConnectWithoutRuneDeckCardsInput = {
    where: CardDefinitionWhereUniqueInput
    create: XOR<CardDefinitionCreateWithoutRuneDeckCardsInput, CardDefinitionUncheckedCreateWithoutRuneDeckCardsInput>
  }

  export type DeckUpsertWithoutRuneDeckInput = {
    update: XOR<DeckUpdateWithoutRuneDeckInput, DeckUncheckedUpdateWithoutRuneDeckInput>
    create: XOR<DeckCreateWithoutRuneDeckInput, DeckUncheckedCreateWithoutRuneDeckInput>
    where?: DeckWhereInput
  }

  export type DeckUpdateToOneWithWhereWithoutRuneDeckInput = {
    where?: DeckWhereInput
    data: XOR<DeckUpdateWithoutRuneDeckInput, DeckUncheckedUpdateWithoutRuneDeckInput>
  }

  export type DeckUpdateWithoutRuneDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDecksNestedInput
    championLegend?: CardDefinitionUpdateOneRequiredWithoutDecksAsLegendNestedInput
    chosenChampion?: CardDefinitionUpdateOneRequiredWithoutDecksAsChampionNestedInput
    battlefield?: CardDefinitionUpdateOneRequiredWithoutDecksAsBattlefieldNestedInput
    mainDeck?: MainDeckCardUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateWithoutRuneDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    championLegendId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mainDeck?: MainDeckCardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type CardDefinitionUpsertWithoutRuneDeckCardsInput = {
    update: XOR<CardDefinitionUpdateWithoutRuneDeckCardsInput, CardDefinitionUncheckedUpdateWithoutRuneDeckCardsInput>
    create: XOR<CardDefinitionCreateWithoutRuneDeckCardsInput, CardDefinitionUncheckedCreateWithoutRuneDeckCardsInput>
    where?: CardDefinitionWhereInput
  }

  export type CardDefinitionUpdateToOneWithWhereWithoutRuneDeckCardsInput = {
    where?: CardDefinitionWhereInput
    data: XOR<CardDefinitionUpdateWithoutRuneDeckCardsInput, CardDefinitionUncheckedUpdateWithoutRuneDeckCardsInput>
  }

  export type CardDefinitionUpdateWithoutRuneDeckCardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUpdateManyWithoutChampionLegendNestedInput
    decksAsChampion?: DeckUpdateManyWithoutChosenChampionNestedInput
    decksAsBattlefield?: DeckUpdateManyWithoutBattlefieldNestedInput
    mainDeckCards?: MainDeckCardUpdateManyWithoutCardNestedInput
  }

  export type CardDefinitionUncheckedUpdateWithoutRuneDeckCardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cardType?: EnumCardTypeFieldUpdateOperationsInput | $Enums.CardType
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    energyCost?: IntFieldUpdateOperationsInput | number
    powerCosts?: JsonNullValueInput | InputJsonValue
    description?: StringFieldUpdateOperationsInput | string
    flavorText?: NullableStringFieldUpdateOperationsInput | string | null
    might?: NullableIntFieldUpdateOperationsInput | number | null
    subtypes?: JsonNullValueInput | InputJsonValue
    domains?: JsonNullValueInput | InputJsonValue
    keywords?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    scriptPath?: NullableStringFieldUpdateOperationsInput | string | null
    hasScript?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    artist?: NullableStringFieldUpdateOperationsInput | string | null
    cardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    setCode?: NullableStringFieldUpdateOperationsInput | string | null
    setName?: NullableStringFieldUpdateOperationsInput | string | null
    isSignature?: BoolFieldUpdateOperationsInput | boolean
    isBasicRune?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decksAsLegend?: DeckUncheckedUpdateManyWithoutChampionLegendNestedInput
    decksAsChampion?: DeckUncheckedUpdateManyWithoutChosenChampionNestedInput
    decksAsBattlefield?: DeckUncheckedUpdateManyWithoutBattlefieldNestedInput
    mainDeckCards?: MainDeckCardUncheckedUpdateManyWithoutCardNestedInput
  }

  export type UserCreateWithoutGamesAsPlayer1Input = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    decks?: DeckCreateNestedManyWithoutUserInput
    gamesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
  }

  export type UserUncheckedCreateWithoutGamesAsPlayer1Input = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    decks?: DeckUncheckedCreateNestedManyWithoutUserInput
    gamesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
  }

  export type UserCreateOrConnectWithoutGamesAsPlayer1Input = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGamesAsPlayer1Input, UserUncheckedCreateWithoutGamesAsPlayer1Input>
  }

  export type UserCreateWithoutGamesAsPlayer2Input = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    decks?: DeckCreateNestedManyWithoutUserInput
    gamesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
  }

  export type UserUncheckedCreateWithoutGamesAsPlayer2Input = {
    id?: string
    email: string
    username: string
    passwordHash: string
    displayName?: string | null
    avatarUrl?: string | null
    gamesPlayed?: number
    gamesWon?: number
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    decks?: DeckUncheckedCreateNestedManyWithoutUserInput
    gamesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
  }

  export type UserCreateOrConnectWithoutGamesAsPlayer2Input = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGamesAsPlayer2Input, UserUncheckedCreateWithoutGamesAsPlayer2Input>
  }

  export type MatchEventCreateWithoutMatchInput = {
    id?: string
    type: string
    round: number
    phase?: string | null
    playerId?: string | null
    data: JsonNullValueInput | InputJsonValue
    sequence: number
    timestamp?: Date | string
  }

  export type MatchEventUncheckedCreateWithoutMatchInput = {
    id?: string
    type: string
    round: number
    phase?: string | null
    playerId?: string | null
    data: JsonNullValueInput | InputJsonValue
    sequence: number
    timestamp?: Date | string
  }

  export type MatchEventCreateOrConnectWithoutMatchInput = {
    where: MatchEventWhereUniqueInput
    create: XOR<MatchEventCreateWithoutMatchInput, MatchEventUncheckedCreateWithoutMatchInput>
  }

  export type MatchEventCreateManyMatchInputEnvelope = {
    data: MatchEventCreateManyMatchInput | MatchEventCreateManyMatchInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutGamesAsPlayer1Input = {
    update: XOR<UserUpdateWithoutGamesAsPlayer1Input, UserUncheckedUpdateWithoutGamesAsPlayer1Input>
    create: XOR<UserCreateWithoutGamesAsPlayer1Input, UserUncheckedCreateWithoutGamesAsPlayer1Input>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGamesAsPlayer1Input = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGamesAsPlayer1Input, UserUncheckedUpdateWithoutGamesAsPlayer1Input>
  }

  export type UserUpdateWithoutGamesAsPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decks?: DeckUpdateManyWithoutUserNestedInput
    gamesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
  }

  export type UserUncheckedUpdateWithoutGamesAsPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decks?: DeckUncheckedUpdateManyWithoutUserNestedInput
    gamesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
  }

  export type UserUpsertWithoutGamesAsPlayer2Input = {
    update: XOR<UserUpdateWithoutGamesAsPlayer2Input, UserUncheckedUpdateWithoutGamesAsPlayer2Input>
    create: XOR<UserCreateWithoutGamesAsPlayer2Input, UserUncheckedCreateWithoutGamesAsPlayer2Input>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGamesAsPlayer2Input = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGamesAsPlayer2Input, UserUncheckedUpdateWithoutGamesAsPlayer2Input>
  }

  export type UserUpdateWithoutGamesAsPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decks?: DeckUpdateManyWithoutUserNestedInput
    gamesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
  }

  export type UserUncheckedUpdateWithoutGamesAsPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    decks?: DeckUncheckedUpdateManyWithoutUserNestedInput
    gamesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
  }

  export type MatchEventUpsertWithWhereUniqueWithoutMatchInput = {
    where: MatchEventWhereUniqueInput
    update: XOR<MatchEventUpdateWithoutMatchInput, MatchEventUncheckedUpdateWithoutMatchInput>
    create: XOR<MatchEventCreateWithoutMatchInput, MatchEventUncheckedCreateWithoutMatchInput>
  }

  export type MatchEventUpdateWithWhereUniqueWithoutMatchInput = {
    where: MatchEventWhereUniqueInput
    data: XOR<MatchEventUpdateWithoutMatchInput, MatchEventUncheckedUpdateWithoutMatchInput>
  }

  export type MatchEventUpdateManyWithWhereWithoutMatchInput = {
    where: MatchEventScalarWhereInput
    data: XOR<MatchEventUpdateManyMutationInput, MatchEventUncheckedUpdateManyWithoutMatchInput>
  }

  export type MatchEventScalarWhereInput = {
    AND?: MatchEventScalarWhereInput | MatchEventScalarWhereInput[]
    OR?: MatchEventScalarWhereInput[]
    NOT?: MatchEventScalarWhereInput | MatchEventScalarWhereInput[]
    id?: StringFilter<"MatchEvent"> | string
    matchId?: StringFilter<"MatchEvent"> | string
    type?: StringFilter<"MatchEvent"> | string
    round?: IntFilter<"MatchEvent"> | number
    phase?: StringNullableFilter<"MatchEvent"> | string | null
    playerId?: StringNullableFilter<"MatchEvent"> | string | null
    data?: JsonFilter<"MatchEvent">
    sequence?: IntFilter<"MatchEvent"> | number
    timestamp?: DateTimeFilter<"MatchEvent"> | Date | string
  }

  export type MatchCreateWithoutEventsInput = {
    id?: string
    player1DeckId?: string | null
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    player1: UserCreateNestedOneWithoutGamesAsPlayer1Input
    player2: UserCreateNestedOneWithoutGamesAsPlayer2Input
  }

  export type MatchUncheckedCreateWithoutEventsInput = {
    id?: string
    player1Id: string
    player1DeckId?: string | null
    player2Id: string
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchCreateOrConnectWithoutEventsInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutEventsInput, MatchUncheckedCreateWithoutEventsInput>
  }

  export type MatchUpsertWithoutEventsInput = {
    update: XOR<MatchUpdateWithoutEventsInput, MatchUncheckedUpdateWithoutEventsInput>
    create: XOR<MatchCreateWithoutEventsInput, MatchUncheckedCreateWithoutEventsInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutEventsInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutEventsInput, MatchUncheckedUpdateWithoutEventsInput>
  }

  export type MatchUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    player1?: UserUpdateOneRequiredWithoutGamesAsPlayer1NestedInput
    player2?: UserUpdateOneRequiredWithoutGamesAsPlayer2NestedInput
  }

  export type MatchUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2Id?: StringFieldUpdateOperationsInput | string
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeckCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    championLegendId: string
    chosenChampionId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchCreateManyPlayer1Input = {
    id?: string
    player1DeckId?: string | null
    player2Id: string
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchCreateManyPlayer2Input = {
    id?: string
    player1Id: string
    player1DeckId?: string | null
    player2DeckId?: string | null
    status: $Enums.MatchStatus
    winnerId?: string | null
    winCondition?: string | null
    currentRound?: number
    currentPhase?: string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: string
    isRanked?: boolean
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeckUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    championLegend?: CardDefinitionUpdateOneRequiredWithoutDecksAsLegendNestedInput
    chosenChampion?: CardDefinitionUpdateOneRequiredWithoutDecksAsChampionNestedInput
    battlefield?: CardDefinitionUpdateOneRequiredWithoutDecksAsBattlefieldNestedInput
    mainDeck?: MainDeckCardUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    championLegendId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mainDeck?: MainDeckCardUncheckedUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    championLegendId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUpdateWithoutPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    player2?: UserUpdateOneRequiredWithoutGamesAsPlayer2NestedInput
    events?: MatchEventUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2Id?: StringFieldUpdateOperationsInput | string
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: MatchEventUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2Id?: StringFieldUpdateOperationsInput | string
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUpdateWithoutPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    player1?: UserUpdateOneRequiredWithoutGamesAsPlayer1NestedInput
    events?: MatchEventUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    player1Id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: MatchEventUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    player1Id?: StringFieldUpdateOperationsInput | string
    player1DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    player2DeckId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    winCondition?: NullableStringFieldUpdateOperationsInput | string | null
    currentRound?: IntFieldUpdateOperationsInput | number
    currentPhase?: NullableStringFieldUpdateOperationsInput | string | null
    gameState?: NullableJsonNullValueInput | InputJsonValue
    format?: StringFieldUpdateOperationsInput | string
    isRanked?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeckCreateManyChampionLegendInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    chosenChampionId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeckCreateManyChosenChampionInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    championLegendId: string
    battlefieldId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeckCreateManyBattlefieldInput = {
    id?: string
    name: string
    description?: string | null
    userId: string
    championLegendId: string
    chosenChampionId: string
    isValid?: boolean
    totalCards?: number
    format?: string
    playCount?: number
    winCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MainDeckCardCreateManyCardInput = {
    id?: string
    deckId: string
    quantity?: number
  }

  export type RuneDeckCardCreateManyCardInput = {
    id?: string
    deckId: string
    quantity?: number
  }

  export type DeckUpdateWithoutChampionLegendInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDecksNestedInput
    chosenChampion?: CardDefinitionUpdateOneRequiredWithoutDecksAsChampionNestedInput
    battlefield?: CardDefinitionUpdateOneRequiredWithoutDecksAsBattlefieldNestedInput
    mainDeck?: MainDeckCardUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateWithoutChampionLegendInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mainDeck?: MainDeckCardUncheckedUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateManyWithoutChampionLegendInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeckUpdateWithoutChosenChampionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDecksNestedInput
    championLegend?: CardDefinitionUpdateOneRequiredWithoutDecksAsLegendNestedInput
    battlefield?: CardDefinitionUpdateOneRequiredWithoutDecksAsBattlefieldNestedInput
    mainDeck?: MainDeckCardUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateWithoutChosenChampionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    championLegendId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mainDeck?: MainDeckCardUncheckedUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateManyWithoutChosenChampionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    championLegendId?: StringFieldUpdateOperationsInput | string
    battlefieldId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeckUpdateWithoutBattlefieldInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDecksNestedInput
    championLegend?: CardDefinitionUpdateOneRequiredWithoutDecksAsLegendNestedInput
    chosenChampion?: CardDefinitionUpdateOneRequiredWithoutDecksAsChampionNestedInput
    mainDeck?: MainDeckCardUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateWithoutBattlefieldInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    championLegendId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mainDeck?: MainDeckCardUncheckedUpdateManyWithoutDeckNestedInput
    runeDeck?: RuneDeckCardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type DeckUncheckedUpdateManyWithoutBattlefieldInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    championLegendId?: StringFieldUpdateOperationsInput | string
    chosenChampionId?: StringFieldUpdateOperationsInput | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
    totalCards?: IntFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    playCount?: IntFieldUpdateOperationsInput | number
    winCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MainDeckCardUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    deck?: DeckUpdateOneRequiredWithoutMainDeckNestedInput
  }

  export type MainDeckCardUncheckedUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type MainDeckCardUncheckedUpdateManyWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type RuneDeckCardUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    deck?: DeckUpdateOneRequiredWithoutRuneDeckNestedInput
  }

  export type RuneDeckCardUncheckedUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type RuneDeckCardUncheckedUpdateManyWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type MainDeckCardCreateManyDeckInput = {
    id?: string
    cardId: string
    quantity?: number
  }

  export type RuneDeckCardCreateManyDeckInput = {
    id?: string
    cardId: string
    quantity?: number
  }

  export type MainDeckCardUpdateWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    card?: CardDefinitionUpdateOneRequiredWithoutMainDeckCardsNestedInput
  }

  export type MainDeckCardUncheckedUpdateWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type MainDeckCardUncheckedUpdateManyWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type RuneDeckCardUpdateWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    card?: CardDefinitionUpdateOneRequiredWithoutRuneDeckCardsNestedInput
  }

  export type RuneDeckCardUncheckedUpdateWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type RuneDeckCardUncheckedUpdateManyWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type MatchEventCreateManyMatchInput = {
    id?: string
    type: string
    round: number
    phase?: string | null
    playerId?: string | null
    data: JsonNullValueInput | InputJsonValue
    sequence: number
    timestamp?: Date | string
  }

  export type MatchEventUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    round?: IntFieldUpdateOperationsInput | number
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    sequence?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchEventUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    round?: IntFieldUpdateOperationsInput | number
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    sequence?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchEventUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    round?: IntFieldUpdateOperationsInput | number
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    sequence?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}