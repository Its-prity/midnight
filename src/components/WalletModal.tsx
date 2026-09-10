import React, { useState, useEffect } from 'react';
import { WalletState } from '../types';
import {
  detectMidnightWallets,
  DiscoveredWallet,
  VALID_MIDNIGHT_NETWORKS,
  ValidNetworkId,
} from '../utils/midnightWallet';

interface WalletModalProps {
  isOpen: boolean;
  walletState: WalletState;
  onClose: () => void;
  onConnectReal: (walletId?: string, networkId?: string) => Promise<void>;
  onConnectSimulated: (networkId?: string) => void;
  onDisconnect: () => void;
  onCopyText: (text: string, label: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  walletState,
  onClose,
  onConnectReal,
  onConnectSimulated,
  onDisconnect,
  onCopyText,
}) => {
  const [availableWallets, setAvailableWallets] = useState<DiscoveredWallet[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'config'>('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<ValidNetworkId>('preprod');

  const scanWallets = () => {
    setIsScanning(true);
    const discovered = detectMidnightWallets();
    setAvailableWallets(discovered);
    setTimeout(() => setIsScanning(false), 400);
  };

  useEffect(() => {
    if (isOpen) {
      scanWallets();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConnected = walletState.status === 'connected';
  const isConnecting = walletState.status === 'connecting';
  const hasInjectedLace = availableWallets.length > 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="wallet-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="lace-brand-avatar">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="10" fill="#181335"/>
                <path d="M20 8L31 14.5V25.5L20 32L9 25.5V14.5L20 8Z" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 16L26 19.5V24.5L20 28L14 24.5V19.5L20 16Z" fill="#8B5CF6" fillOpacity="0.6" stroke="#8B5CF6" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <h3>Midnight Lace Connection</h3>
              <p className="modal-subtitle">
                {isConnected
                  ? (walletState.isRealLace ? 'Active Midnight Lace Extension' : 'Preprod Simulation Sandbox')
                  : 'Connect your ZK-enabled Midnight wallet'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {isConnected ? (
            /* Connected View */
            <div className="connected-wallet-panel">
              <div className="status-banner connected">
                <div className="status-dot-pulse"></div>
                <div className="banner-text">
                  <strong>{walletState.walletName || 'Lace (Midnight Preview)'}</strong>
                  <span className="net-tag">{walletState.network}</span>
                  {walletState.isRealLace ? (
                    <span className="real-badge">✓ Real Extension</span>
                  ) : (
                    <span className="sim-badge">Dev Sandbox</span>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="wallet-modal-tabs">
                <button
                  className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  💳 Identity & Balances
                </button>
                <button
                  className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
                  onClick={() => setActiveTab('config')}
                >
                  ⚙️ ZK Service Nodes
                </button>
              </div>

              {activeTab === 'overview' ? (
                <div className="tab-content">
                  {/* Balances Card */}
                  <div className="balances-card">
                    <div className="balance-item">
                      <span className="balance-label">Shielded / Native Token</span>
                      <span className="balance-value highlight">
                        {walletState.balances?.night || '2,500.00 tNIGHT'}
                      </span>
                    </div>
                    <div className="balance-item">
                      <span className="balance-label">Midnight Dust</span>
                      <span className="balance-value">
                        {walletState.balances?.dust || '10,000 Dust'}
                      </span>
                    </div>
                  </div>

                  {/* Shielded Address Box */}
                  <div className="address-box-card">
                    <div className="address-box-header">
                      <span className="badge-shield">🛡️ Shielded ZK Address (Primary)</span>
                      <button
                        className="btn-copy-chip"
                        onClick={() =>
                          onCopyText(
                            walletState.shieldedAddress || walletState.address || '',
                            'Shielded Address'
                          )
                        }
                      >
                        📋 Copy
                      </button>
                    </div>
                    <code className="address-code">
                      {walletState.shieldedAddress || walletState.address}
                    </code>
                  </div>

                  {/* Unshielded Address Box */}
                  {walletState.unshieldedAddress && (
                    <div className="address-box-card secondary">
                      <div className="address-box-header">
                        <span className="badge-unshield">🔓 Unshielded Public Address</span>
                        <button
                          className="btn-copy-chip"
                          onClick={() =>
                            onCopyText(walletState.unshieldedAddress || '', 'Unshielded Address')
                          }
                        >
                          📋 Copy
                        </button>
                      </div>
                      <code className="address-code">{walletState.unshieldedAddress}</code>
                    </div>
                  )}
                </div>
              ) : (
                /* Config Tab */
                <div className="tab-content config-tab">
                  <div className="config-row">
                    <span className="config-key">Prover Server URI:</span>
                    <span className="config-val">
                      {walletState.serviceConfig?.proverServerUri || 'http://127.0.0.1:6300 (or In-Browser WASM)'}
                    </span>
                  </div>
                  <div className="config-row">
                    <span className="config-key">Indexer URI:</span>
                    <span className="config-val">
                      {walletState.serviceConfig?.indexerUri || 'https://indexer.preprod.midnight.network/api/v1/graphql'}
                    </span>
                  </div>
                  <div className="config-row">
                    <span className="config-key">Network ID:</span>
                    <span className="config-val">{walletState.networkId || 'preprod'}</span>
                  </div>
                  <div className="config-row">
                    <span className="config-key">DApp API Version:</span>
                    <span className="config-val">{walletState.apiVersion || '4.0.1 (Latest Connector)'}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="modal-actions-footer">
                <button
                  className="btn btn-outline"
                  onClick={onClose}
                >
                  Done
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onDisconnect();
                    onClose();
                  }}
                >
                  🔌 Disconnect Wallet
                </button>
              </div>
            </div>
          ) : (
            /* Disconnected / Connect Flow */
            <div className="connect-flow-panel">
              {/* Network Selector Pill Bar */}
              <div className="network-selector-group">
                <label className="network-selector-label">Target Network:</label>
                <div className="network-pills">
                  {(['preprod', 'preview', 'testnet', 'devnet'] as ValidNetworkId[]).map((net) => (
                    <button
                      key={net}
                      type="button"
                      className={`network-pill ${selectedNetwork === net ? 'active' : ''}`}
                      onClick={() => setSelectedNetwork(net)}
                    >
                      {net.charAt(0).toUpperCase() + net.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {hasInjectedLace ? (
                /* Detected Extension in Browser */
                <div className="detected-wallets-list">
                  <p className="section-hint">
                    ✨ Detected Midnight Lace extension in your browser:
                  </p>
                  {availableWallets.map((w) => (
                    <button
                      key={w.id}
                      className="wallet-option-item detected"
                      onClick={() => onConnectReal(w.id, selectedNetwork)}
                      disabled={isConnecting}
                    >
                      <div className="wallet-option-info">
                        <div className="wallet-icon-wrap">🛡️</div>
                        <div className="wallet-meta">
                          <span className="wallet-name">{w.name}</span>
                          <span className="wallet-version">API v{w.apiVersion} • Injected</span>
                        </div>
                      </div>
                      <span className="btn-action-text">
                        {isConnecting ? 'Authorizing...' : `Connect (${selectedNetwork}) →`}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                /* Extension Not Detected */
                <div className="no-extension-guide">
                  <div className="warning-card">
                    <div className="warning-icon">ℹ️</div>
                    <div className="warning-text">
                      <strong>Lace Extension Not Detected in this Browser</strong>
                      <p>
                        To use your real Midnight testnet account, install the official Lace wallet extension with Midnight Network support.
                      </p>
                    </div>
                  </div>

                  <div className="install-guide-steps">
                    <div className="guide-step">
                      <span className="step-num">1</span>
                      <div className="step-content">
                        <strong>Install Midnight Lace</strong>
                        <p>Get the Chrome/Brave extension from the official site.</p>
                        <div className="step-links">
                          <a
                            href="https://www.lace.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-lace"
                          >
                            🌐 Visit Lace.io ↗
                          </a>
                          <a
                            href="https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-cyan"
                          >
                            🧩 Chrome Web Store ↗
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="guide-step">
                      <span className="step-num">2</span>
                      <div className="step-content">
                        <strong>Re-detect Extension</strong>
                        <p>After installing and opening Lace, click below to link:</p>
                        <button
                          className="btn btn-sm btn-recheck"
                          onClick={scanWallets}
                          disabled={isScanning}
                        >
                          {isScanning ? '🔄 Scanning window.midnight...' : '🔄 Check Extension Again'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divider-or">
                    <span>OR TEST IMMEDIATELY WITHOUT EXTENSION</span>
                  </div>

                  {/* Sandbox Devnet fallback button */}
                  <button
                    className="btn btn-simulated-connect"
                    onClick={() => {
                      onConnectSimulated(selectedNetwork);
                      onClose();
                    }}
                  >
                    <span className="icon">🧪</span>
                    <div className="text-wrap">
                      <span className="title">Launch {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)} Simulator & Faucet</span>
                      <span className="sub">Test ZK proof generation, private witness inputs, and ledger state</span>
                    </div>
                    <span className="arrow">→</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
