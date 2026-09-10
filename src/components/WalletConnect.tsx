import React from 'react';
import { WalletState } from '../types';

interface WalletConnectProps {
  walletState: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenDetails?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  walletState,
  onConnect,
  onDisconnect,
  onOpenDetails,
}) => {
  const isConnected = walletState.status === 'connected';
  const isConnecting = walletState.status === 'connecting';

  return (
    <div className="wallet-connect-container">
      {walletState.error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-msg">{walletState.error}</span>
        </div>
      )}

      {isConnected ? (
        <div className="wallet-connected-box">
          <div className="wallet-info">
            <div className="status-indicator connected">
              <span className="dot"></span>
              <span className="network-label">{walletState.network}</span>
            </div>
            <div
              className="wallet-address-chip"
              onClick={onOpenDetails}
              title={walletState.shieldedAddress || walletState.address || ''}
              style={{ cursor: onOpenDetails ? 'pointer' : 'default' }}
            >
              <span className="lace-logo">🛡️</span>
              <span className="address-text">
                {walletState.shieldedAddress
                  ? `${walletState.shieldedAddress.slice(0, 10)}...${walletState.shieldedAddress.slice(-6)}`
                  : walletState.address
                  ? `${walletState.address.slice(0, 10)}...${walletState.address.slice(-6)}`
                  : 'Lace Connected'}
              </span>
              {walletState.isRealLace && <span className="verified-badge-pill">✓</span>}
            </div>
          </div>
          <button className="btn btn-disconnect" onClick={onDisconnect}>
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-disconnected-box">
          <div className="disconnected-status">
            <span className="status-indicator disconnected">
              <span className="dot"></span>
              <span>Disconnected</span>
            </span>
            <span className="desc-text">Connect Lace Wallet to interact with Midnight Preprod smart contract</span>
          </div>
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
        </div>
      )}
    </div>
  );
};
