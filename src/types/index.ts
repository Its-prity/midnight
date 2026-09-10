export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WalletBalances {
  night?: string;
  dust?: string;
  tokens?: Record<string, string>;
}

export interface WalletServiceConfig {
  indexerUri?: string;
  indexerWsUri?: string;
  proverServerUri?: string;
  substrateNodeUri?: string;
  networkId?: string;
}

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  shieldedAddress?: string | null;
  unshieldedAddress?: string | null;
  dustAddress?: string | null;
  balances?: WalletBalances;
  network: string;
  networkId?: string | number | null;
  walletName?: string;
  walletIcon?: string | null;
  apiVersion?: string | null;
  isRealLace?: boolean;
  serviceConfig?: WalletServiceConfig | null;
  error: string | null;
  contractAddress: string;
}

export interface CircuitCallResult {
  success: boolean;
  txId?: string;
  blockHeight?: number;
  disclosedValue?: number;
  counterState?: number;
  proofHash?: string;
  error?: string;
  timestamp?: string;
  provenBy?: string;
}

export interface TransactionRecord {
  id: string;
  type: 'INCREMENT' | 'RESET';
  disclosedValue: number;
  newCounterState: number;
  proofHash: string;
  timestamp: string;
  status: 'VERIFIED_ON_CHAIN';
  provenBy?: string;
}

export interface ServerStatus {
  online: boolean;
  network: string;
  proofServer: string;
  proofServerConnected: boolean;
  compactVersion: string;
  lastChecked?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type ProofStepState = 'idle' | 'active' | 'done' | 'error';

export interface ProofStep {
  id: number;
  label: string;
  description: string;
  state: ProofStepState;
}
