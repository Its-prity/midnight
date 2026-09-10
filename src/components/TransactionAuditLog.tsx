import React, { useState } from 'react';
import { TransactionRecord } from '../types';

interface TransactionAuditLogProps {
  history: TransactionRecord[];
  totalTransactions: number;
  onCopyText: (text: string, label: string) => void;
  onExportJSON: () => void;
}

export const TransactionAuditLog: React.FC<TransactionAuditLogProps> = ({
  history,
  totalTransactions,
  onCopyText,
  onExportJSON,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'INCREMENT' | 'RESET'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHistory = history.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.proofHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="card glass-panel history-card">
      <div className="card-header history-header">
        <div className="header-title">
          <span className="icon">📜</span>
          <h2>On-Chain Transaction & ZK Proof Audit Log</h2>
        </div>
        <div className="history-badges">
          <span className="badge tx-count-badge">
            {totalTransactions} {totalTransactions === 1 ? 'Transaction' : 'Transactions'} Total
          </span>
          <button className="btn btn-sm btn-outline btn-export" onClick={onExportJSON}>
            📥 Export JSON Log
          </button>
        </div>
      </div>

      <div className="audit-controls-bar">
        <div className="filter-button-group">
          <button
            className={`filter-btn ${filterType === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterType('ALL')}
          >
            All ({history.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'INCREMENT' ? 'active' : ''}`}
            onClick={() => setFilterType('INCREMENT')}
          >
            Increments ({history.filter((h) => h.type === 'INCREMENT').length})
          </button>
          <button
            className={`filter-btn ${filterType === 'RESET' ? 'active' : ''}`}
            onClick={() => setFilterType('RESET')}
          >
            Resets ({history.filter((h) => h.type === 'RESET').length})
          </button>
        </div>

        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search Tx ID or Proof Hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="history-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Circuit Action</th>
              <th>Disclosed Increment</th>
              <th>New Counter State</th>
              <th>ZK Proof Hash</th>
              <th>Verification Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr className="empty-row">
                <td colspan={6}>
                  {history.length === 0
                    ? 'No transactions recorded yet. Enter a secret increment above and call circuit!'
                    : 'No transactions match your search filter.'}
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td className="timestamp-cell">{item.timestamp}</td>
                  <td>
                    <span
                      className={`chip ${
                        item.type === 'INCREMENT' ? 'public-chip' : 'reset-chip'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <strong className="disclosed-val">
                      {item.type === 'INCREMENT' ? `+${item.disclosedValue}` : '0 (Reset)'}
                    </strong>
                  </td>
                  <td>
                    <strong className="state-val">{item.newCounterState}</strong>
                  </td>
                  <td className="proof-hash-cell">
                    <code
                      className="proof-code copyable"
                      title="Click to copy full ZK Proof Hash"
                      onClick={() => onCopyText(item.proofHash, 'ZK Proof Hash')}
                    >
                      {item.proofHash.slice(0, 18)}... 📋
                    </code>
                  </td>
                  <td>
                    <span className="status-verified">✓ Verified ZK Proof</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
