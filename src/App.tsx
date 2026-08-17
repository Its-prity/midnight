import React from 'react';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';

export const App: React.FC = () => {
  const {
    walletState,
    counterState,
    isGeneratingProof,
    lastTxResult,
    connectWallet,
    disconnectWallet,
    executeCircuitCall,
  } = useMidnight();

  const isConnected = walletState.status === 'connected';

  return (
    <div className="app-shell">
      {/* Top Header Navigation */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="brand-titles">
            <h1>MIDNIGHT <span>COUNTER</span></h1>
            <p className="subtitle">Privacy-Preserving dApp (Level 2 Challenge)</p>
          </div>
        </div>

        <WalletConnect
          walletState={walletState}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
      </header>

      {/* Main Grid Content */}
      <main className="main-layout">
        <div className="grid-two-col">
          {/* Left Column: Ledger Counter State */}
          <div className="card glass-panel state-display-card">
            <div className="card-header">
              <div className="header-title">
                <span className="icon">📊</span>
                <h2>On-Chain Ledger State</h2>
              </div>
              <span className="chip public-chip">PUBLIC LEDGER</span>
            </div>

            <div className="counter-val-wrapper">
              <span className="counter-title">Current Public Counter Value</span>
              <div className="counter-big-number">{counterState}</div>
              <p className="counter-type">Ledger Cell: <code>Cell&lt;Uint&lt;32&gt;&gt;</code></p>
            </div>

            <div className="state-summary-box">
              <div className="summary-item">
                <span className="s-label">Target Network</span>
                <span className="s-val highlight">{walletState.network}</span>
              </div>
              <div className="summary-item">
                <span className="s-label">Circuit Status</span>
                <span className="s-val text-green">Ready</span>
              </div>
              <div className="summary-item">
                <span className="s-label">Proof Server</span>
                <span className="s-val text-cyan">In-Browser Local Compiler</span>
              </div>
            </div>
          </div>

          {/* Right Column: Circuit Execution Component */}
          <CircuitCall
            contractAddress={walletState.contractAddress}
            counterState={counterState}
            isGeneratingProof={isGeneratingProof}
            lastTxResult={lastTxResult}
            onExecuteCircuit={executeCircuitCall}
            isConnected={isConnected}
          />
        </div>

        {/* Bottom Section: Privacy Model & Privacy Claim */}
        <section className="privacy-section-grid">
          {/* Card 1: Privacy Model breakdown */}
          <div className="card glass-panel privacy-model-panel">
            <div className="card-header">
              <div className="header-title">
                <span className="icon">🛡️</span>
                <h2>Privacy Model Architecture</h2>
              </div>
            </div>

            <div className="privacy-three-col">
              <div className="p-box public">
                <h4>🌐 What is PUBLIC</h4>
                <ul>
                  <li><code>counter</code> Cell state total on-chain</li>
                  <li>Disclosed increment amount applied</li>
                  <li>Zero-Knowledge Proof verification hash</li>
                </ul>
              </div>

              <div className="p-box private">
                <h4>🔐 What is PRIVATE</h4>
                <ul>
                  <li><code>secret_increment</code> witness input</li>
                  <li>User off-chain execution context</li>
                  <li>Private keys & wallet credentials</li>
                </ul>
              </div>

              <div className="p-box proves">
                <h4>⚡ What User PROVES</h4>
                <ul>
                  <li>Proves <code>secret_increment &gt; 0</code> constraint</li>
                  <li>Proves execution met Compact circuit rules</li>
                  <li>Proves without revealing secret input</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Privacy Claim */}
          <div className="card glass-panel privacy-claim-panel">
            <div className="card-header">
              <div className="header-title">
                <span className="icon">📜</span>
                <h2>Privacy Claim Statement</h2>
              </div>
            </div>
            <div className="claim-body">
              <blockquote className="claim-quote">
                "An on-chain observer sees the updated ledger counter total and the cryptographic Zero-Knowledge proof confirming the circuit ran validly. The observer <strong>CANNOT</strong> see the caller's private witness input or identity."
              </blockquote>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Midnight Builder Challenge Level 2 | Powered by Compact & Midnight.js</p>
      </footer>
    </div>
  );
};
