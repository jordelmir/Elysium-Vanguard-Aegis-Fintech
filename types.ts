export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AnomalyType {
  TEMPORAL = 'TEMPORAL',
  TYPOGRAPHIC = 'TYPOGRAPHIC',
  METADATA = 'METADATA',
  BEHAVIORAL = 'BEHAVIORAL'
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  description: string;
  severity: number; // 0.0 to 1.0
  detectedAt: string; // ISO Timestamp
}

export interface FinancialVector {
  dimension: string; // e.g., "Liquidity", "Solvency", "Leverage"
  value: number; // Normalized 0-100
}

export interface LedgerBlock {
  blockId: string;
  hash: string;
  previousHash: string;
  timestamp: string;
  actor: string;
  status: 'VERIFIED' | 'TAMPERED';
}

export interface RiskProfile {
  applicantId: string;
  siprScore: number; // 0.0 to 1.0 (Saturation & Insolvency Prediction Risk)
  forensicIntegrityScore: number; // 0.0 to 1.0
  riskLevel: RiskLevel;
  anomalies: Anomaly[];
  vectors: FinancialVector[];
  lastAuditBlock: LedgerBlock;
}

export interface SystemStatus {
  gateway: 'SECURE' | 'COMPROMISED';
  aiEngine: 'ONLINE' | 'THINKING' | 'OFFLINE';
  ledgerIntegrity: boolean;
  activeNodes: number;
}