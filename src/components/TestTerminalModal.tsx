import React from 'react';

interface TestTerminalModalProps {
  isOpen: boolean;
  testOutput: string | null;
  isRunningTests: boolean;
  onClose: () => void;
  onReRunTests: () => void;
}

export const TestTerminalModal: React.FC<TestTerminalModalProps> = ({
  isOpen,
  testOutput,
  isRunningTests,
  onClose,
  onReRunTests,
}) => {
  if (!isOpen) return null;

  return (
    <div className="terminal-overlay" onClick={onClose}>
      <div className="terminal-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="terminal-header">
          <div className="terminal-header-title">
            <span className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </span>
            <h3>Automated Unit Test Execution (counter.test.ts)</h3>
          </div>
          <div className="terminal-actions">
            <button
              className="btn btn-sm btn-outline"
              onClick={onReRunTests}
              disabled={isRunningTests}
            >
              {isRunningTests ? (
                <>
                  <span className="spinner"></span> Running...
                </>
              ) : (
                '🔄 Re-run Tests'
              )}
            </button>
            <button className="btn-close-terminal" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="terminal-body">
          <pre className="terminal-output-code">
            {testOutput || 'No output recorded.'}
          </pre>
        </div>

        <div className="terminal-footer">
          <span className="terminal-status">
            {isRunningTests ? '⏳ Executing circuit assertions and state tests...' : '✓ Execution Complete'}
          </span>
          <span className="terminal-command">Command: <code>npx tsx tests/counter.test.ts</code></span>
        </div>
      </div>
    </div>
  );
};
