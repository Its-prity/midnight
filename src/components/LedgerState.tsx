import React from 'react';

interface LedgerStateProps {
  counterState: number;
  lastDisclosedInc: number;
  totalTransactions: number;
  contractAddress: string;
  onCopyContractAddress: () => void;
  onResetCounter: () => void;
  isGeneratingProof: boolean;
}

export const LedgerState: React.FC<LedgerStateProps> = ({
  counterState,
  lastDisclosedInc,
  totalTransactions,
  contractAddress,
  onCopyContractAddress,
  onResetCounter,
  isGeneratingProof,
}) => {
  return (
    <div className="card glass-panel state-display-card">
      <div className="card-header">
        <div className="header-title">
          <span className="icon">📊</span>
          <h2>Public Ledger State</h2>
        </div>
        <span className="chip public-chip">ON-CHAIN PUBLIC LEDGER</span>
      </div>

      <div className="counter-val-wrapper">
        <div className="counter-glow-effect"></div>
        <span className="counter-title">Current Ledger Count</span>
        <div className="counter-big-number" key={counterState}>
          {counterState}
        </div>
        <p className="counter-type">
          Ledger Cell Type: <code>Cell&lt;Uint&lt;32&gt;&gt;</code>
        </p>
      </div>

      <div className="state-summary-box">
        <div className="summary-item">
          <span className="s-label">Last Disclosed Input</span>
          <span className="s-val text-cyan">+{lastDisclosedInc}</span>
        </div>
        <div className="summary-item">
          <span className="s-label">Total Transactions</span>
          <span className="s-val text-purple">{totalTransactions}</span>
        </div>
        <div className="summary-item">
          <span className="s-label">Circuit Status</span>
          <span className="s-val text-green">✓ Ready</span>
        </div>
      </div>

      <div className="contract-address-bar">
        <span className="label">Contract:</span>
        <code className="address-code" title={contractAddress}>
          {contractAddress.slice(0, 14)}...{contractAddress.slice(-8)}
        </code>
        <button
          className="btn-icon-copy"
          onClick={onCopyContractAddress}
          title="Copy Contract Address"
        >
          📋
        </button>
      </div>

      <div className="ledger-card-actions">
        <button
          className="btn btn-outline btn-sm btn-reset-state"
          onClick={onResetCounter}
          disabled={isGeneratingProof}
        >
          🔄 Call reset() Circuit (Reset to 0)
        </button>
      </div>
    </div>
  );
};
