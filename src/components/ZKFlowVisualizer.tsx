import React, { useState } from 'react';

export const ZKFlowVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'matrix'>('flow');

  return (
    <div className="card glass-panel zk-flow-card">
      <div className="card-header">
        <div className="header-title">
          <span className="icon">🛡️</span>
          <h2>Midnight Secrecy Architecture & Data Flow</h2>
        </div>
        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeTab === 'flow' ? 'active' : ''}`}
            onClick={() => setActiveTab('flow')}
          >
            🔄 Interactive Data Flow
          </button>
          <button
            className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            📋 Privacy Matrix
          </button>
        </div>
      </div>

      {activeTab === 'flow' ? (
        <div className="flow-visualizer-container">
          <div className="flow-nodes-grid">
            {/* Node 1: Private Realm */}
            <div className="flow-node private-node">
              <div className="node-badge">1. PRIVATE REALM</div>
              <div className="node-icon">🔐</div>
              <h4>Witness Input</h4>
              <code className="node-code">secret_increment: Uint&lt;32&gt;</code>
              <p className="node-desc">Off-chain private input provided locally by user</p>
            </div>

            <div className="flow-connector">
              <span className="connector-line"></span>
              <span className="connector-label">Circuit Evaluation</span>
              <span className="connector-arrow">➔</span>
            </div>

            {/* Node 2: Circuit Constraint */}
            <div className="flow-node constraint-node">
              <div className="node-badge">2. COMPACT CIRCUIT</div>
              <div className="node-icon">⚡</div>
              <h4>Constraint Verification</h4>
              <code className="node-code">assert secret &gt; 0</code>
              <p className="node-desc">Evaluates assertions off-chain in local ZK engine</p>
            </div>

            <div className="flow-connector">
              <span className="connector-line"></span>
              <span className="connector-label">disclose()</span>
              <span className="connector-arrow">➔</span>
            </div>

            {/* Node 3: Disclose & Proof */}
            <div className="flow-node proof-node">
              <div className="node-badge">3. ZK PROOF SYNTHESIS</div>
              <div className="node-icon">📜</div>
              <h4>ZK Proof & Output</h4>
              <code className="node-code">const inc = disclose(secret)</code>
              <p className="node-desc">Generates Zero-Knowledge proof of valid execution</p>
            </div>

            <div className="flow-connector">
              <span className="connector-line"></span>
              <span className="connector-label">Ledger Update</span>
              <span className="connector-arrow">➔</span>
            </div>

            {/* Node 4: Public Ledger */}
            <div className="flow-node public-node">
              <div className="node-badge">4. PUBLIC LEDGER</div>
              <div className="node-icon">🌐</div>
              <h4>On-Chain State</h4>
              <code className="node-code">counter.write(count + inc)</code>
              <p className="node-desc">Public ledger updated without exposing secret witness</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="privacy-matrix-container">
          <div className="privacy-three-col">
            <div className="p-box public">
              <h4>🌐 What is PUBLIC (On-Chain)</h4>
              <ul>
                <li><code>counter</code> Cell state total on-chain ledger</li>
                <li>Disclosed increment value applied to counter</li>
                <li>Zero-Knowledge Proof verification hash & block height</li>
              </ul>
            </div>

            <div className="p-box private">
              <h4>🔐 What is PRIVATE (Off-Chain)</h4>
              <ul>
                <li><code>secret_increment</code> raw witness input</li>
                <li>User caller identity & wallet keys</li>
                <li>Off-chain computing environment & local execution state</li>
              </ul>
            </div>

            <div className="p-box proves">
              <h4>⚡ What User PROVES</h4>
              <ul>
                <li>Proves <code>secret_increment &gt; 0</code> circuit constraint</li>
                <li>Proves execution complied strictly with Compact contract code</li>
                <li>Proves validity without exposing caller identity or raw witness</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <blockquote className="claim-quote">
        "An on-chain observer sees the updated ledger counter total and the cryptographic Zero-Knowledge proof confirming the circuit ran validly. The observer <strong>CANNOT</strong> see the caller's private witness input or identity."
      </blockquote>
    </div>
  );
};
