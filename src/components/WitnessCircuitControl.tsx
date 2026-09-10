import React, { useState } from 'react';
import { CircuitCallResult } from '../types';

interface WitnessCircuitControlProps {
  contractAddress: string;
  isGeneratingProof: boolean;
  currentStepIndex: number;
  lastTxResult: CircuitCallResult | null;
  isConnected: boolean;
  onExecuteCircuit: (secretIncrement: number) => Promise<CircuitCallResult>;
  onRunUnitTests: () => void;
  onCopyText: (text: string, label: string) => void;
}

export const WitnessCircuitControl: React.FC<WitnessCircuitControlProps> = ({
  contractAddress,
  isGeneratingProof,
  currentStepIndex,
  lastTxResult,
  isConnected,
  onExecuteCircuit,
  onRunUnitTests,
  onCopyText,
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
          <h2>Circuit Execution & Private Witness Input</h2>
        </div>
        <span className="chip private-chip">OFF-CHAIN WITNESS</span>
      </div>

      <form onSubmit={handleSubmit} className="circuit-form">
        <div className="form-group">
          <label htmlFor="secretIncInput">
            <span className="label-main">Private Witness Input (secret_increment)</span>
            <span className="label-hint">
              Processed locally off-chain; disclosed value updates public ledger count
            </span>
          </label>

          <div className="input-wrapper">
            <span className="lock-icon" title="Private witness input">🔒</span>
            <input
              id="secretIncInput"
              type="number"
              min="1"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder="Enter positive integer..."
              disabled={isGeneratingProof || !isConnected}
            />
            <button
              type="submit"
              className="btn btn-primary btn-execute"
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
            <span>
              Compact Circuit Constraint: <code>assert secret_increment &gt; 0</code>
            </span>
          </div>
        </div>
      </form>

      {/* Interactive 4-Stage Zero-Knowledge Proof Stepper Animation */}
      {isGeneratingProof && (
        <div className="proof-stepper-box">
          <div className="stepper-header">
            <span className="pulse-icon">⏳</span>
            <h4>Zero-Knowledge Proof Generation Sequence</h4>
          </div>
          <div className="steps-grid">
            <div className={`step-box ${currentStepIndex >= 1 ? (currentStepIndex === 1 ? 'active' : 'done') : ''}`}>
              <span className="step-num">{currentStepIndex > 1 ? '✓' : '1'}</span>
              <span className="step-desc">Witness Constraint</span>
            </div>
            <div className={`step-box ${currentStepIndex >= 2 ? (currentStepIndex === 2 ? 'active' : 'done') : ''}`}>
              <span className="step-num">{currentStepIndex > 2 ? '✓' : '2'}</span>
              <span className="step-desc">disclose(secret)</span>
            </div>
            <div className={`step-box ${currentStepIndex >= 3 ? (currentStepIndex === 3 ? 'active' : 'done') : ''}`}>
              <span className="step-num">{currentStepIndex > 3 ? '✓' : '3'}</span>
              <span className="step-desc">Synthesize ZK Proof</span>
            </div>
            <div className={`step-box ${currentStepIndex >= 4 ? (currentStepIndex === 4 ? 'active' : 'done') : ''}`}>
              <span className="step-num">4</span>
              <span className="step-desc">Update Ledger</span>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Level 2 Privacy Statement Label */}
      <div className="privacy-proved-banner">
        <span className="shield-icon">🛡️</span>
        <span className="privacy-claim-text">Proved without revealing your input</span>
      </div>

      <div className="control-secondary-actions">
        <button
          type="button"
          className="btn btn-outline btn-test-runner"
          onClick={onRunUnitTests}
        >
          🧪 Run Automated Contract Unit Tests (counter.test.ts)
        </button>
      </div>

      {/* On-chain Transaction Result Display */}
      {lastTxResult && (
        <div className={`tx-result-box ${lastTxResult.success ? 'success' : 'failure'}`}>
          {lastTxResult.success ? (
            <>
              <div className="result-header">
                <span className="badge-success">✓ Transaction Submitted to Preprod</span>
                <span className="timestamp">{lastTxResult.timestamp || new Date().toLocaleTimeString()}</span>
              </div>
              <div className="result-details">
                <div className="detail-row">
                  <span className="detail-label">Tx ID:</span>
                  <code className="detail-val copyable" onClick={() => onCopyText(lastTxResult.txId || '', 'Transaction ID')}>
                    {lastTxResult.txId} 📋
                  </code>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Block Height:</span>
                  <span className="detail-val">{lastTxResult.blockHeight}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Updated Ledger Counter:</span>
                  <span className="detail-val highlight">+{lastTxResult.disclosedValue} → {lastTxResult.counterState}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ZK Proof Hash:</span>
                  <code className="detail-val proof copyable" onClick={() => onCopyText(lastTxResult.proofHash || '', 'Proof Hash')}>
                    {lastTxResult.proofHash?.slice(0, 22)}... 📋
                  </code>
                </div>
                <div className="secrecy-note">
                  🔒 Note: Disclosed increment applied to public ledger. Private witness value was never exposed on-chain or logged in public memory.
                </div>
              </div>
            </>
          ) : (
            <div className="result-failure">
              <span className="err-title">❌ Transaction Exception:</span>
              <p>{lastTxResult.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
