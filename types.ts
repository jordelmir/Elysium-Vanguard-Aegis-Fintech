
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  OFFICER = 'OFFICER',
  CLIENT = 'CLIENT'
}

export enum UI_MODE {
  DASHBOARD = 'DASHBOARD',
  TERMINAL = 'TERMINAL',
  FOCUS = 'FOCUS'
}

export enum ApplicationStep {
  KAFKA_INGEST = 'KAFKA_INGEST',
  WEBFLUX_ROUTING = 'WEBFLUX_ROUTING',
  VIRTUAL_THREAD_EXEC = 'VIRTUAL_THREAD_EXEC',
  ONNX_INFERENCE = 'ONNX_INFERENCE',
  DROOLS_VALIDATION = 'DROOLS_VALIDATION',
  LEDGER_COMMIT = 'LEDGER_COMMIT',
  DISBURSEMENT_EXEC = 'DISBURSEMENT_EXEC'
}

export enum APPLICANT_FLOW_STEP {
  IDENTITY_SCAN = 'IDENTITY_SCAN',
  LIVENESS_CHECK = 'LIVENESS_CHECK',
  BANK_CONNECT = 'BANK_CONNECT',
  FUND_SELECTION = 'FUND_SELECTION',
  CONTRACT_SIGNING = 'CONTRACT_SIGNING',
  VAULT_PROCESSING = 'VAULT_PROCESSING',
  SUCCESS = 'SUCCESS'
}

export interface ClusterNode {
  id: string;
  type: 'CORE' | 'IA' | 'EDGE';
  cpu: number;
  memory: number;
  pods: number;
  status: 'HEALTHY' | 'PRESSURE' | 'SCALING';
}

export interface SecurityPerimeter {
  wafBlockedToday: number;
  activeDdosThreat: boolean;
  mfaCompliance: number;
  encryptionStandard: string;
}

export interface CICDPipeline {
  currentBuild: string;
  status: 'SUCCESS' | 'RUNNING' | 'ROLLING_BACK';
  testCoverage: number;
  securityGate: 'PASSED' | 'FAILED';
}

export enum DebtorCluster {
  FORGETFUL = 'FORGETFUL',
  ILLIQUID = 'ILLIQUID',
  NEGLIGENT = 'NEGLIGENT',
  FRAUDULENT = 'FRAUDULENT'
}

export enum CollectionStrategy {
  PREVENTIVE_PUSH = 'PREVENTIVE_PUSH',
  SOFT_NEGOTIATION = 'SOFT_NEGOTIATION',
  HARD_NEGOTIATION = 'HARD_NEGOTIATION',
  LEGAL_NUCLEAR = 'LEGAL_NUCLEAR'
}

export interface RiskProfile {
  applicantId: string;
  applicantName: string;
  currentStep: ApplicationStep;
  telemetry: BehavioralTelemetry;
  judges: EnsembleJudges;
  backend: BackendMetrics;
  siprScore: number;
  explanation: { feature: string; impact: number }[];
  riskLevel: RiskLevel;
  anomalies: Anomaly[];
  services: ServiceStatus[];
  cluster: ClusterNode[];
  security: SecurityPerimeter;
  pipeline: CICDPipeline;
  collections: {
    cases: CollectionCase[];
    metrics: CollectionMetrics;
  };
  lastAuditBlock: {
    id: string;
    hash: string;
    timestamp: string;
  };
  aiAudit?: any;
}

export enum AnomalyType {
  BEHAVIORAL = 'BEHAVIORAL',
  METADATA = 'METADATA',
  TEMPORAL = 'TEMPORAL',
  TYPOGRAPHIC = 'TYPOGRAPHIC'
}

export interface BackendMetrics {
  virtualThreads: number;
  heapUsage: number;
  p99Latency: number;
  gcActivity: 'IDLE' | 'ZGC_RUNNING' | 'CLEANUP';
  kafkaOffset: number;
  throughput: number;
}

export interface BehavioralTelemetry {
  keystrokeJitter: number;
  scrollVelocity: number;
  deviceStability: number;
  batteryStatus: number;
  isCharging: boolean;
  networkType: 'WIFI' | '5G' | 'VPN_DETECTED';
}

export interface EnsembleJudges {
  tabularScore: number;
  sequentialScore: number;
  graphScore: number;
  inferenceTimeMs: number;
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  description: string;
  severity: number;
  detectedAt: string;
}

export interface CollectionCase {
  loanId: string;
  applicantName: string;
  daysPastDue: number;
  amountDue: number;
  strategy: CollectionStrategy; 
  cluster: DebtorCluster;
  recoveryProbability: number;
  lastInteraction: string;
}

export interface CollectionMetrics {
  costToCollect: number;
  recoveryRate: number;
  cureRate: number;
  activeNegotiations: number;
}

export interface ServiceStatus {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  latency: number;
  version: string;
}
