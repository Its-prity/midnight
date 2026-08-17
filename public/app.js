document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const counterValueEl = document.getElementById('counterValue');
  const lastDisclosedValEl = document.getElementById('lastDisclosedVal');
  const totalTxValEl = document.getElementById('totalTxVal');
  const secretInput = document.getElementById('secretInput');
  const constraintBox = document.getElementById('constraintBox');
  const btnIncrement = document.getElementById('btnIncrement');
  const btnReset = document.getElementById('btnReset');
  const btnRunTests = document.getElementById('btnRunTests');
  const proofStepper = document.getElementById('proofStepper');
  const proofServerBadge = document.getElementById('proofServerBadge');
  const historyTableBody = document.getElementById('historyTableBody');
  const txCountBadge = document.getElementById('txCountBadge');
  const terminalSection = document.getElementById('terminalSection');
  const terminalOutput = document.getElementById('terminalOutput');
  const btnCloseTerminal = document.getElementById('btnCloseTerminal');

  // Step Indicators
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const step4 = document.getElementById('step4');

  // 1. Check Server & Proof Server Status
  async function checkServerStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.proofServerConnected) {
        proofServerBadge.className = 'status-badge';
        proofServerBadge.innerHTML = `<span class="status-dot pulsing"></span><span>Proof Server: Port 6300 Active</span>`;
      } else {
        proofServerBadge.className = 'status-badge';
        proofServerBadge.innerHTML = `<span class="status-dot pulsing" style="background:#f59e0b"></span><span>Local Circuit Simulator Ready</span>`;
      }
    } catch (err) {
      proofServerBadge.className = 'status-badge';
      proofServerBadge.innerHTML = `<span class="status-dot" style="background:#ef4444"></span><span>Backend Offline</span>`;
    }
  }

  // 2. Fetch Public Ledger Counter State
  async function fetchCounterState() {
    try {
      const res = await fetch('/api/counter');
      const data = await res.json();
      updateUIState(data);
    } catch (err) {
      console.error('Failed to fetch counter state:', err);
    }
  }

  function updateUIState(data) {
    // Update numeric values
    if (counterValueEl.innerText !== String(data.counter)) {
      counterValueEl.innerText = data.counter;
      counterValueEl.classList.add('updated');
      setTimeout(() => counterValueEl.classList.remove('updated'), 300);
    }
    
    lastDisclosedValEl.innerText = data.lastDisclosedIncrement || 0;
    totalTxValEl.innerText = data.totalTransactions || 0;
    txCountBadge.innerText = `${data.totalTransactions || 0} Transactions Recorded`;

    // Render Transaction Audit Log
    renderHistory(data.history || []);
  }

  function renderHistory(history) {
    if (!history || history.length === 0) {
      historyTableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="6">No transactions recorded yet. Enter a secret increment above and click execute!</td>
        </tr>`;
      return;
    }

    historyTableBody.innerHTML = history.map(item => `
      <tr>
        <td>${item.timestamp}</td>
        <td>
          <span class="chip ${item.type === 'INCREMENT' ? 'public-chip' : 'private-chip'}">
            ${item.type}
          </span>
        </td>
        <td><strong>+${item.disclosedValue}</strong></td>
        <td><strong style="color: var(--accent-cyan);">${item.newCounterState}</strong></td>
        <td class="proof-hash-cell">${item.proofHash}</td>
        <td><span style="color: var(--accent-green); font-size: 0.8rem;">✓ Verified ZK Proof</span></td>
      </tr>
    `).join('');
  }

  // 3. Real-time Constraint Validator
  secretInput.addEventListener('input', () => {
    const val = Number(secretInput.value);
    if (val > 0) {
      constraintBox.className = 'constraint-indicator valid';
      constraintBox.innerHTML = `<span class="check-icon">✓</span><span class="constraint-text">Compact Circuit Constraint: <code>assert secret_increment > 0</code> PASS</span>`;
      btnIncrement.disabled = false;
    } else {
      constraintBox.className = 'constraint-indicator invalid';
      constraintBox.innerHTML = `<span class="check-icon">✕</span><span class="constraint-text">Compact Circuit Assertion Error: secret_increment must be > 0</span>`;
      btnIncrement.disabled = true;
    }
  });

  // 4. Step-by-step ZK Proof Animation & Execution
  btnIncrement.addEventListener('click', async () => {
    const secretValue = Number(secretInput.value);
    if (secretValue <= 0) return;

    btnIncrement.disabled = true;
    proofStepper.classList.remove('hidden');
    resetSteps();

    // Step 1: Validate Witness
    step1.className = 'step-box active';
    await delay(350);
    step1.className = 'step-box done';

    // Step 2: Disclose Witness
    step2.className = 'step-box active';
    await delay(400);
    step2.className = 'step-box done';

    // Step 3: Zero Knowledge Proof Generation
    step3.className = 'step-box active';
    await delay(500);

    // Call API
    try {
      const res = await fetch('/api/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretIncrement: secretValue })
      });
      const result = await res.json();

      step3.className = 'step-box done';
      step4.className = 'step-box active';
      await delay(350);
      step4.className = 'step-box done';

      if (result.success) {
        fetchCounterState();
      } else {
        alert(`Circuit Exception: ${result.error}`);
      }
    } catch (err) {
      alert('Failed to connect to local server backend.');
    } finally {
      btnIncrement.disabled = false;
      setTimeout(() => proofStepper.classList.add('hidden'), 2500);
    }
  });

  // 5. Reset Action
  btnReset.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to reset the public ledger counter to 0?')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        fetchCounterState();
      }
    } catch (err) {
      alert('Failed to reset ledger state.');
    }
  });

  // 6. Unit Test Runner
  btnRunTests.addEventListener('click', async () => {
    terminalSection.classList.remove('hidden');
    terminalOutput.innerText = '⏳ Executing TSX Counter Contract Unit Test Suite (tests/counter.test.ts)...\n';
    try {
      const res = await fetch('/api/run-tests', { method: 'POST' });
      const data = await res.json();
      terminalOutput.innerText = data.output || data.error || 'Test run complete.';
    } catch (err) {
      terminalOutput.innerText = '❌ Failed to execute tests via backend server.';
    }
  });

  btnCloseTerminal.addEventListener('click', () => {
    terminalSection.classList.add('hidden');
  });

  // Helpers
  function resetSteps() {
    [step1, step2, step3, step4].forEach(s => s.className = 'step-box');
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Initial Load & Polling
  checkServerStatus();
  fetchCounterState();
  setInterval(fetchCounterState, 4000);
});
