import React from 'react';
import { useMidnight } from './hooks/useMidnight';
import { Header } from './components/Header';
import { LedgerState } from './components/LedgerState';
import { WitnessCircuitControl } from './components/WitnessCircuitControl';
import { ZKFlowVisualizer } from './components/ZKFlowVisualizer';
import { CompactCodeViewer } from './components/CompactCodeViewer';
import { TransactionAuditLog } from './components/TransactionAuditLog';
import { TestTerminalModal } from './components/TestTerminalModal';
import { ToastContainer } from './components/ToastContainer';
import { WalletModal } from './components/WalletModal';

export const App: React.FC = () => {
  const {
    walletState,
    isWalletModalOpen,
    setIsWalletModalOpen,
    counterState,
    lastDisclosedInc,
    totalTransactions,
    history,
    serverStatus,
    isGeneratingProof,
    currentStepIndex,
    lastTxResult,
    testOutput,
    isRunningTests,
    isTerminalOpen,
    toasts,
    soundEnabled,
    toggleSound,
    connectWallet,
    connectRealWallet,
    connectSimulatedWallet,
    disconnectWallet,
    executeCircuitCall,
    executeResetCircuitCall,
    runUnitTests,
    closeTerminal,
    addToast,
    removeToast,
  } = useMidnight();

  const isConnected = walletState.status === 'connected';

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast('info', `Copied ${label} to clipboard!`);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `midnight_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'Exported transaction audit log to JSON!');
  };

  return (
    <div className="app-shell">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Top Header Navigation */}
      <Header
        walletState={walletState}
        serverStatus={serverStatus}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onConnect={connectWallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onDisconnect={disconnectWallet}
        onCopyAddress={(addr) => handleCopyText(addr, 'Wallet Address')}
      />

      {/* Main Content Layout */}
      <main className="main-layout">
        {/* Top Grid: On-Chain Ledger State & Witness Circuit Control Panel */}
        <div className="grid-two-col">
          <LedgerState
            counterState={counterState}
            lastDisclosedInc={lastDisclosedInc}
            totalTransactions={totalTransactions}
            contractAddress={walletState.contractAddress}
            onCopyContractAddress={() =>
              handleCopyText(walletState.contractAddress, 'Contract Address')
            }
            onResetCounter={executeResetCircuitCall}
            isGeneratingProof={isGeneratingProof}
          />

          <WitnessCircuitControl
            contractAddress={walletState.contractAddress}
            isGeneratingProof={isGeneratingProof}
            currentStepIndex={currentStepIndex}
            lastTxResult={lastTxResult}
            isConnected={isConnected}
            onExecuteCircuit={executeCircuitCall}
            onRunUnitTests={runUnitTests}
            onCopyText={handleCopyText}
          />
        </div>

        {/* Middle Grid: ZK Secrecy Architecture Flow & Compact Smart Contract Code Viewer */}
        <div className="grid-two-col info-section-grid">
          <ZKFlowVisualizer />
          <CompactCodeViewer onCopyCode={(code) => handleCopyText(code, 'Compact Code')} />
        </div>

        {/* On-Chain Transaction & ZK Proof Audit Log */}
        <TransactionAuditLog
          history={history}
          totalTransactions={totalTransactions}
          onCopyText={handleCopyText}
          onExportJSON={handleExportJSON}
        />
      </main>

      {/* Interactive Lace Wallet Connection Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        walletState={walletState}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectReal={connectRealWallet}
        onConnectSimulated={connectSimulatedWallet}
        onDisconnect={disconnectWallet}
        onCopyText={handleCopyText}
      />

      {/* Embedded Unit Test Terminal Runner Modal */}
      <TestTerminalModal
        isOpen={isTerminalOpen}
        testOutput={testOutput}
        isRunningTests={isRunningTests}
        onClose={closeTerminal}
        onReRunTests={runUnitTests}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Midnight Network Builder Challenge Level 2 | Powered by Compact Smart Contracts & Zero-Knowledge Proofs
        </p>
      </footer>
    </div>
  );
};

export default App;
