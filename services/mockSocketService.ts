
import { 
  RiskProfile, RiskLevel, ApplicationStep, Anomaly, AnomalyType, 
  ServiceStatus, DebtorCluster, CollectionStrategy
} from '../types';

const generateHash = () => Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

export const SUBJECTS = [
  { name: "ELON V. MASK", id: "NODE-772-X" },
  { name: "SARAH CONNOR", id: "NODE-101-T" },
  { name: "NEO ANDERSON", id: "NODE-001-Z" },
  { name: "TRINITY PRIME", id: "NODE-002-Z" },
  { name: "MORPHEUS N.", id: "NODE-003-Z" }
];

class JavaFintechEngine {
  private listeners: ((data: RiskProfile) => void)[] = [];
  private state: RiskProfile;
  private kafkaCounter = 442190;

  constructor() {
    this.state = this.createInitialState(SUBJECTS[0].id, SUBJECTS[0].name);
    this.init();
  }

  private createInitialState(id: string, name: string): RiskProfile {
    const isCritical = name === "SARAH CONNOR"; // Simulate different levels
    return {
      applicantId: id,
      applicantName: name,
      currentStep: ApplicationStep.KAFKA_INGEST,
      telemetry: {
        keystrokeJitter: 0.12,
        scrollVelocity: 450,
        deviceStability: 0.98,
        batteryStatus: 85,
        isCharging: true,
        networkType: 'WIFI'
      },
      judges: {
        tabularScore: isCritical ? 0.85 : 0.15,
        sequentialScore: isCritical ? 0.70 : 0.10,
        graphScore: 0.05,
        inferenceTimeMs: 12.4
      },
      backend: {
        virtualThreads: 1024,
        heapUsage: 22.5,
        p99Latency: 1.2,
        gcActivity: 'IDLE',
        kafkaOffset: this.kafkaCounter,
        throughput: 24200
      },
      cluster: [
        { id: 'EKS-NODE-01', type: 'CORE', cpu: 12, memory: 34, pods: 8, status: 'HEALTHY' },
        { id: 'EKS-NODE-02', type: 'CORE', cpu: 18, memory: 41, pods: 12, status: 'HEALTHY' },
        { id: 'IA-NODE-G5', type: 'IA', cpu: 78, memory: 88, pods: 4, status: 'PRESSURE' }
      ],
      security: {
        wafBlockedToday: 12480,
        activeDdosThreat: false,
        mfaCompliance: 99.8,
        encryptionStandard: 'AES-256-GCM'
      },
      pipeline: {
        currentBuild: 'AEGIS-V6-6.0.4-REL',
        status: 'SUCCESS',
        testCoverage: 94.2,
        securityGate: 'PASSED'
      },
      services: [
        { name: 'IDENTITY-SVC', status: 'UP', latency: 45, version: 'v3.2.1' },
        { name: 'RISK-ENGINE', status: 'UP', latency: 120, version: 'v6.0.4' },
        { name: 'LEDGER-CORE', status: 'UP', latency: 12, version: 'v1.1.0' },
        { name: 'KAFKA-CLUSTER', status: 'UP', latency: 2, version: 'v3.6.0' }
      ],
      siprScore: isCritical ? 0.92 : 0.10,
      explanation: [
        { feature: "JVM_TRUST_SCORE", impact: isCritical ? 0.45 : -0.15 },
        { feature: "CASHFLOW_STABILITY", impact: isCritical ? 0.35 : -0.25 },
        { feature: "BEHAVIORAL_VECTOR", impact: 0.05 }
      ],
      riskLevel: isCritical ? RiskLevel.CRITICAL : RiskLevel.LOW,
      anomalies: isCritical ? [
        { id: 'ANM-01', type: AnomalyType.BEHAVIORAL, description: 'Neural pattern mismatch in signature block.', severity: 0.95, detectedAt: new Date().toISOString() }
      ] : [],
      collections: {
        cases: [
          {
            loanId: `LN-AEGIS-${id.split('-')[1]}`,
            applicantName: name,
            daysPastDue: isCritical ? 45 : 0,
            amountDue: isCritical ? 2450.50 : 0,
            strategy: isCritical ? CollectionStrategy.HARD_NEGOTIATION : CollectionStrategy.PREVENTIVE_PUSH,
            cluster: isCritical ? DebtorCluster.NEGLIGENT : DebtorCluster.FORGETFUL,
            recoveryProbability: isCritical ? 0.42 : 0.98,
            lastInteraction: new Date().toISOString()
          }
        ],
        metrics: {
          costToCollect: 0.012,
          recoveryRate: 0.82,
          cureRate: 0.65,
          activeNegotiations: 42
        }
      },
      lastAuditBlock: {
        id: generateHash().slice(0, 8),
        hash: generateHash(),
        timestamp: new Date().toISOString()
      }
    };
  }

  private init() {
    setInterval(() => {
      this.updateBackendTelemetry();
      this.updateClusterDynamics();
      this.broadcast();
    }, 2500);
  }

  private broadcast() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  private updateClusterDynamics() {
    this.state.cluster = this.state.cluster.map(node => ({
      ...node,
      cpu: Math.min(100, Math.max(5, node.cpu + (Math.random() - 0.5) * 10)),
      memory: Math.min(100, Math.max(5, node.memory + (Math.random() - 0.5) * 5))
    }));
    this.state.security.wafBlockedToday += Math.floor(Math.random() * 5);
  }

  private updateBackendTelemetry() {
    this.kafkaCounter += Math.floor(Math.random() * 50);
    this.state.backend.kafkaOffset = this.kafkaCounter;
    this.state.backend.heapUsage = Math.min(95, Math.max(10, this.state.backend.heapUsage + (Math.random() - 0.5) * 2));
    this.state.backend.p99Latency = Math.max(0.8, this.state.backend.p99Latency + (Math.random() - 0.5) * 0.1);
  }

  public selectSubject(id: string) {
    const sub = SUBJECTS.find(s => s.id === id);
    if (sub) {
      this.state = this.createInitialState(sub.id, sub.name);
      this.broadcast();
    }
  }

  public subscribe(fn: (data: RiskProfile) => void) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }
}

export const bioSocket = new JavaFintechEngine();
