import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = Record<string, never>;

export type ImpureCircuits<T> = {
  increment(context: __compactRuntime.CircuitContext<T>, secret_increment: bigint): __compactRuntime.CircuitResults<T, void>;
  reset(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, void>;
};

export type PureCircuits = Record<string, never>;

export type Circuits<T> = ImpureCircuits<T> & PureCircuits;

export type Ledger = {
  readonly counter: bigint;
};

export type ContractReferenceLocations = Record<string, never>;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
