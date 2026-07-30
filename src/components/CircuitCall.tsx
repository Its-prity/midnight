import React, { useState } from 'react';
import { CircuitCallResult } from '../hooks/useMidnight';

interface CircuitCallProps {
  contractAddress: string;
  counterState: number;
  isGeneratingProof: boolean;
  lastTxResult: CircuitCallResult | null;
  onExecuteCircuit: (secretIncrement: number) => Promise<CircuitCallResult>;
  isConnected: boolean;
}

export const CircuitCall: React.FC<CircuitCallProps> = ({
  contractAddress,
  counterState,
  isGeneratingProof,
  lastTxResult,
  onExecuteCircuit,
  isConnected,
}) => {
  const [secretInput, setSecretInput] = useState<string>('5');
  const secretNum = Number(secretInput);
  const isValidInput = !isNaN(secretNum) && secretNum > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidInput || !isConnected || isGeneratingProof) return;
    await onExecuteCircuit(secretNum);
  };

  return (
    <div className="circuit-call-card glass-panel">
      <div className="card-header">
        <div className="header-title">
          <span className="icon">⚡</span>
          <h3>Circuit Call & Local Proof Generator</h3>
        </div>
        <span className="network-chip">Preprod Contract</span>
      </div>

      <div className="contract-address-bar">
        <span className="label">Contract:</span>
        <code className="address-code">{contractAddress}</code>
      </div>

      <form onSubmit={handleSubmit} className="circuit-form">
        <div className="form-group">
          <label htmlFor="secretIncInput">
            <span className="label-main">Private Witness Input (secret_increment)</span>
            <span className="label-hint">Passed off-chain into local circuit; never displayed in public output</span>
          </label>

          <div className="input-wrapper">
            <span className="lock-icon">🔒</span>
            <input
              id="secretIncInput"
              type="number"
              min="1"
              value={secretInput}
              onChange={e => setSecretInput(e.target.value)}
              placeholder="Enter positive integer..."
              disabled={isGeneratingProof || !isConnected}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValidInput || !isConnected || isGeneratingProof}
            >
              {isGeneratingProof ? (
                <>
                  <span className="spinner"></span>
                  Compiling ZK Proof...
                </>
              ) : (
                'Call Circuit (increment)'
              )}
            </button>
          </div>

          <div className={`constraint-box ${isValidInput ? 'valid' : 'invalid'}`}>
            <span className="check-mark">{isValidInput ? '✓' : '✕'}</span>
            <span>Compact Constraint: <code>assert secret_increment &gt; 0</code></span>
          </div>
        </div>
      </form>

      {/* Mandatory Level 2 Privacy Statement Label */}
      <div className="privacy-proved-banner">
        <span className="shield-icon">🛡️</span>
        <span className="privacy-claim-text">Proved without revealing your input</span>
      </div>

      {/* Loading state during proof generation */}
      {isGeneratingProof && (
        <div className="proof-loading-overlay">
          <div className="loading-content">
            <div className="pulse-spinner"></div>
            <h4>Generating Local Zero-Knowledge Proof...</h4>
            <p>Compiling witness execution constraints in-browser off-chain</p>
          </div>
        </div>
      )}

      {/* On-chain Transaction Result Display */}
      {lastTxResult && (
        <div className={`tx-result-box ${lastTxResult.success ? 'success' : 'failure'}`}>
          {lastTxResult.success ? (
            <>
              <div className="result-header">
                <span className="badge-success">✓ Transaction Submitted to Preprod</span>
                <span className="timestamp">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="result-details">
                <div className="detail-row">
                  <span className="detail-label">Transaction ID:</span>
                  <code className="detail-val">{lastTxResult.txId}</code>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Block Height:</span>
                  <span className="detail-val">{lastTxResult.blockHeight}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Updated Ledger Counter:</span>
                  <span className="detail-val highlight">{lastTxResult.counterState}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ZK Proof Hash:</span>
                  <code className="detail-val proof">{lastTxResult.proofHash}</code>
                </div>
                <div className="secrecy-note">
                  🔒 Note: Disclosed increment applied to public ledger. Private witness value was never exposed on-chain or rendered in public logs.
                </div>
              </div>
            </>
          ) : (
            <div className="result-failure">
              <span className="err-title">❌ Transaction Failed:</span>
              <p>{lastTxResult.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
