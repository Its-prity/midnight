import React, { useState } from 'react';
import { WalletState, ServerStatus } from '../types';

interface HeaderProps {
  walletState: WalletState;
  serverStatus: ServerStatus;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onConnect: () => void;
  onOpenWalletModal: () => void;
  onDisconnect: () => void;
  onCopyAddress: (address: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  walletState,
  serverStatus,
  soundEnabled,
  onToggleSound,
  onConnect,
  onOpenWalletModal,
  onDisconnect,
  onCopyAddress,
}) => {
  const isConnected = walletState.status === 'connected';
  const isConnecting = walletState.status === 'connecting';
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="brand-titles">
          <h1>MIDNIGHT <span>COUNTER</span></h1>
          <p className="subtitle">Privacy-Preserving ZK dApp • Midnight Network Preprod</p>
        </div>
      </div>

      <div className="header-controls">
        {/* Proof Server & Network Health Indicator */}
        <div className="health-status-badge" title={`Proof Server Status: ${serverStatus.proofServer}`}>
          <span className={`status-dot ${serverStatus.online ? 'pulse-green' : 'pulse-amber'}`}></span>
          <span className="health-text">
            {serverStatus.online
              ? `Proof Server: Port 6300 Active`
              : `Local Circuit Simulator`}
          </span>
        </div>

        {/* Audio Sound Toggle */}
        <button
          className={`btn-icon sound-btn ${soundEnabled ? 'active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
        >
          {soundEnabled ? '🔔' : '🔕'}
        </button>

        {/* Wallet Connect Button / Connected Badge */}
        {isConnected ? (
          <div className="wallet-connected-wrapper">
            {/* Balance chip */}
            {walletState.balances?.night && (
              <div
                className="wallet-balance-pill"
                onClick={onOpenWalletModal}
                title="Click for full wallet details & ZK configuration"
              >
                <span className="coin-icon">🌙</span>
                <span className="balance-txt">{walletState.balances.night}</span>
              </div>
            )}

            {/* Address Pill */}
            <button
              className="wallet-address-chip"
              onClick={() => setShowAddressDropdown((prev) => !prev)}
            >
              <div className="lace-badge-dot"></div>
              <span className="address-text">
                {walletState.shieldedAddress
                  ? `${walletState.shieldedAddress.slice(0, 8)}...${walletState.shieldedAddress.slice(-6)}`
                  : walletState.address
                  ? `${walletState.address.slice(0, 8)}...${walletState.address.slice(-6)}`
                  : 'Lace Connected'}
              </span>
              {walletState.isRealLace ? (
                <span className="verified-dot" title="Verified Lace Extension">✓</span>
              ) : null}
              <span className="dropdown-arrow">▼</span>
            </button>

            {showAddressDropdown && (
              <div className="wallet-dropdown-menu">
                <div className="menu-header">
                  <div className="menu-brand">
                    <span className="menu-icon">🛡️</span>
                    <span className="menu-label">{walletState.walletName || 'Midnight Lace'}</span>
                  </div>
                  <span className="menu-net">{walletState.network}</span>
                </div>

                <div className="full-address-code">
                  <span className="code-label">Shielded Address:</span>
                  <code>{walletState.shieldedAddress || walletState.address}</code>
                </div>

                {walletState.unshieldedAddress && (
                  <div className="full-address-code secondary-addr">
                    <span className="code-label">Unshielded Address:</span>
                    <code>{walletState.unshieldedAddress}</code>
                  </div>
                )}

                <div className="dropdown-actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      onOpenWalletModal();
                      setShowAddressDropdown(false);
                    }}
                  >
                    ⚙️ Wallet Details
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      if (walletState.shieldedAddress || walletState.address) {
                        onCopyAddress((walletState.shieldedAddress || walletState.address)!);
                      }
                      setShowAddressDropdown(false);
                    }}
                  >
                    📋 Copy Address
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      onDisconnect();
                      setShowAddressDropdown(false);
                    }}
                  >
                    🔌 Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-connect"
            onClick={onConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting Lace...
              </>
            ) : (
              <>
                <span className="icon">🛡️</span>
                Connect Lace Wallet
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
