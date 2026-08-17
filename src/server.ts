import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import http from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(rootDir, 'public')));

// Simulated On-Chain Ledger & Execution State
interface TransactionRecord {
  id: string;
  type: 'INCREMENT' | 'RESET';
  disclosedValue: number;
  newCounterState: number;
  proofHash: string;
  timestamp: string;
  status: 'VERIFIED_ON_CHAIN';
}

let ledgerCounter: number = 0;
let totalTransactions: number = 0;
let lastDisclosedIncrement: number = 0;
const history: TransactionRecord[] = [];

// Helper to generate realistic ZK Proof Hex Strings
function generateProofHash(): string {
  const chars = '0123456789abcdef';
  let hash = 'zk_proof_0x';
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// ─── API ROUTES ─────────────────────────────────────────────────────────────

// Health & Network Status
app.get('/api/status', (req: Request, res: Response) => {
  // Check if proof server on 6300 is responding
  const reqCheck = http.get('http://127.0.0.1:6300', { timeout: 1500 }, (proofRes) => {
    res.json({
      status: 'online',
      network: 'Midnight Devnet / Local Simulator',
      proofServer: 'ONLINE (Port 6300)',
      proofServerConnected: true,
      compactVersion: '0.16.0',
      timestamp: new Date().toISOString()
    });
  });

  reqCheck.on('error', () => {
    res.json({
      status: 'online',
      network: 'Midnight Devnet / Local Simulator',
      proofServer: 'SIMULATED (Docker port 6300 not detected)',
      proofServerConnected: false,
      compactVersion: '0.16.0',
      timestamp: new Date().toISOString()
    });
  });

  reqCheck.on('timeout', () => {
    reqCheck.destroy();
    res.json({
      status: 'online',
      network: 'Midnight Devnet / Local Simulator',
      proofServer: 'TIMEOUT (Port 6300)',
      proofServerConnected: false,
      compactVersion: '0.16.0',
      timestamp: new Date().toISOString()
    });
  });
});

// Get Current Public Ledger State
app.get('/api/counter', (_req: Request, res: Response) => {
  res.json({
    counter: ledgerCounter,
    totalTransactions,
    lastDisclosedIncrement,
    history
  });
});

// Execute Private Witness Increment Circuit & ZK Proof Disclose
app.post('/api/increment', (req: Request, res: Response) => {
  const secretIncrement = Number(req.body.secretIncrement);

  // 1. Enforce Compact circuit constraint: assert secret_increment > 0
  if (isNaN(secretIncrement) || secretIncrement <= 0) {
    res.status(400).json({
      success: false,
      error: 'Circuit Constraint Error: secret_increment must be > 0 (Compact circuit assertion failed)'
    });
    return;
  }

  // 2. Execute disclose mechanism
  const disclosedValue = secretIncrement;

  // 3. State transition on public ledger
  ledgerCounter += disclosedValue;
  lastDisclosedIncrement = disclosedValue;
  totalTransactions++;

  const proofHash = generateProofHash();
  const record: TransactionRecord = {
    id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type: 'INCREMENT',
    disclosedValue,
    newCounterState: ledgerCounter,
    proofHash,
    timestamp: new Date().toLocaleTimeString(),
    status: 'VERIFIED_ON_CHAIN'
  };

  history.unshift(record);

  res.json({
    success: true,
    counter: ledgerCounter,
    disclosedValue,
    proofHash,
    timestamp: record.timestamp,
    transaction: record
  });
});

// Execute Reset Circuit
app.post('/api/reset', (_req: Request, res: Response) => {
  ledgerCounter = 0;
  lastDisclosedIncrement = 0;
  totalTransactions++;

  const proofHash = generateProofHash();
  const record: TransactionRecord = {
    id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type: 'RESET',
    disclosedValue: 0,
    newCounterState: 0,
    proofHash,
    timestamp: new Date().toLocaleTimeString(),
    status: 'VERIFIED_ON_CHAIN'
  };

  history.unshift(record);

  res.json({
    success: true,
    counter: ledgerCounter,
    proofHash,
    transaction: record
  });
});

// Run Automated Contract Unit Test Suite
app.post('/api/run-tests', (_req: Request, res: Response) => {
  const testCommand = 'cmd /c npx tsx tests/counter.test.ts';
  exec(testCommand, { cwd: rootDir }, (error, stdout, stderr) => {
    if (error) {
      res.json({
        success: false,
        output: stdout + '\n' + stderr,
        error: error.message
      });
      return;
    }
    res.json({
      success: true,
      output: stdout
    });
  });
});

// Fallback route to serve index.html for single page layout
app.get('/*path', (_req: Request, res: Response) => {
  res.sendFile(path.join(rootDir, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Midnight Counter Local Server active!`);
  console.log(`🔗 Localhost URL: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
