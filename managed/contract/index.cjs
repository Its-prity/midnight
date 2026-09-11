'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

class Contract {
  constructor(witnesses) {
    this.witnesses = witnesses;
    this.circuits = {
      increment: (context, secret_increment) => {
        const inc = typeof secret_increment === 'bigint' ? secret_increment : BigInt(secret_increment);
        if (inc <= 0n) {
          throw new Error('Increment amount must be greater than zero');
        }
        return {
          context,
          result: undefined,
        };
      },
      reset: (context) => {
        return {
          context,
          result: undefined,
        };
      },
    };
  }

  initialState(context) {
    return {
      currentContractState: context.currentContractState,
      currentQueryContext: context.currentQueryContext,
    };
  }
}

function ledger(state) {
  return {
    counter: 0n,
  };
}

exports.Contract = Contract;
exports.ledger = ledger;
