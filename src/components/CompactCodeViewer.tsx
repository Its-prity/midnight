import React, { useState } from 'react';

interface CompactCodeViewerProps {
  onCopyCode: (code: string) => void;
}

const COMPACT_CODE = `// Midnight Compact Smart Contract — Privacy-Preserving Counter
pragma language_version >= 0.14.0;

import CompactStandardLibrary;

export ledger counter: Cell<Uint<32>>;

export circuit increment(secret_increment: Uint<32>): [] {
    // Enforce private circuit logic constraint
    assert secret_increment > 0 "Increment amount must be greater than zero";

    // Explicitly disclose the private witness input to update public ledger state
    const inc = disclose(secret_increment);
    counter.write(counter.read() + inc);
}

export circuit reset(): [] {
    counter.write(0);
}`;

export const CompactCodeViewer: React.FC<CompactCodeViewerProps> = ({ onCopyCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyCode(COMPACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card glass-panel code-card">
      <div className="card-header">
        <div className="header-title">
          <span className="icon">📄</span>
          <h2>contracts/counter.compact</h2>
        </div>
        <div className="code-header-actions">
          <span className="chip code-chip">COMPACT v0.16.0</span>
          <button className="btn-sm btn-outline btn-copy-code" onClick={handleCopy}>
            {copied ? '✓ Copied' : '📋 Copy Code'}
          </button>
        </div>
      </div>

      <div className="code-container">
        <pre>
          <code>
            <span className="c-comment">// Midnight Compact Smart Contract — Privacy-Preserving Counter</span>{'\n'}
            <span className="c-keyword">pragma</span> language_version &gt;= <span className="c-string">0.14.0</span>;{'\n\n'}
            <span className="c-keyword">import</span> CompactStandardLibrary;{'\n\n'}
            <span className="c-comment">// 1. PUBLIC LEDGER STATE</span>{'\n'}
            <span className="c-keyword">export ledger</span> counter: Cell&lt;Uint&lt;<span className="c-number">32</span>&gt;&gt;;{'\n\n'}
            <span className="c-comment">// 2. CIRCUIT EXECUTION WITH WITNESS & DISCLOSE</span>{'\n'}
            <span className="c-keyword">export circuit</span> <span class="c-func">increment</span>(secret_increment: Uint&lt;<span class="c-number">32</span>&gt;): [] {'{\n'}
            <span className="c-comment">    // Enforce private circuit logic constraint</span>{'\n'}
            <span className="c-keyword">    assert</span> secret_increment &gt; <span class="c-number">0</span> <span class="c-string">"Increment amount must be greater than zero"</span>;{'\n\n'}
            <span className="c-comment">    // Explicitly disclose the private witness input to update public ledger state</span>{'\n'}
            <span className="c-keyword">    const</span> inc = <span class="c-func">disclose</span>(secret_increment);{'\n'}
            <span className="c-keyword">    counter</span>.write(counter.read() + inc);{'\n'}
            {'}\n\n'}
            <span className="c-comment">// 3. RESET CIRCUIT</span>{'\n'}
            <span className="c-keyword">export circuit</span> <span class="c-func">reset</span>(): [] {'{\n'}
            <span className="c-keyword">    counter</span>.write(<span class="c-number">0</span>);{'\n'}
            {'}'}
          </code>
        </pre>
      </div>

      <div className="code-annotations font-mono">
        <div className="annotation-item">
          <span className="annotation-tag kw">export ledger</span>
          <span className="annotation-desc">Declares on-chain persistent Cell readable by anyone on the network.</span>
        </div>
        <div className="annotation-item">
          <span className="annotation-tag fn">disclose()</span>
          <span className="annotation-desc">Explicitly exposes private witness value to the public ledger context.</span>
        </div>
        <div className="annotation-item">
          <span className="annotation-tag assert">assert</span>
          <span className="annotation-desc">Constrains off-chain witness execution; fails proof compilation if violated.</span>
        </div>
      </div>
    </div>
  );
};
