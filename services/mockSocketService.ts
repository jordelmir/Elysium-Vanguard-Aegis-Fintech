
import { 
  RiskProfile, RiskLevel, ApplicationStep, Anomaly, AnomalyType, 
  CollectionStrategy, DebtorCluster, CollectionCase, CollectionMetrics 
} from '../types';

const generateHash = () => Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

const SUBJECTS = [
  { name: "ELON V. MASK", id: "NODE-772-X" },
  { name: "SARAH CONNOR", id: "NODE-101-T" },
  { name: "NEO ANDERSON", id: "NODE-001-Z" }
];

class JavaFintechEngine {
  private listeners: ((data: RiskProfile) => void)[] = [];
  private state: RiskProfile;
  private kafkaCounter = 442190;

  constructor() {
    this.state = this.createInitialState();
    this.init();
  }

  private createInitialState(): RiskProfile {
    return {
      applicantId: SUBJECTS[0].id,
      applicantName: SUBJECTS[0].name,
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
        tabularScore: 0.15,
        sequentialScore: 0.10,
        graphScore: 0.05,
        inferenceTimeMs: 12.4
      },
      backend: {
        virtualThreads: 1024,
        heapUsage: 22.5,
        p99Latency: 1.2,
        gcActivity: 'IDLE',
        kafkaOffset: this.kafkaCounter
      },
      siprScore: 0.10,
      explanation: [
        { feature: "JVM_TRUST_SCORE", impact: -0.15 },
        { feature: "CASHFLOW_STABILITY", impact: -0.25 },
        { feature: "BEHAVIORAL_VECTOR", impact: 0.05 }
      ],
      riskLevel: RiskLevel.LOW,
      anomalies: [],
      collections: {
        cases: this.generateInitialCollectionCases(),
        metrics: {
          costToCollect: 0.012,
          recoveryRate: 0.82,
          cureRate: 0.65,
          activeNegotiations: 42
        }
      },
      lastAuditBlock: {
        id: "GENESIS",
        hash: generateHash(),
        timestamp: new Date().toISOString()
      }
    };
  }

  private generateInitialCollectionCases(): CollectionCase[] {
    return [
      {
        loanId: "LN-101",
        applicantName: "ALEX MURPHY",
        daysPastDue: 14,
        amountDue: 450,
        strategy: CollectionStrategy.SOFT_NEGOTIATION,
        cluster: DebtorCluster.FORGETFUL,
        recoveryProbability: 0.92,
        lastInteraction: "AI_BOT: SMS_SENT"
      },
      {
        loanId: "LN-202",
        applicantName: "ELLEN RIPLEY",
        daysPastDue: 45,
        amountDue: 1200,
        strategy: CollectionStrategy.HARD_NEGOTIATION,
        cluster: DebtorCluster.NEGLIGENT,
        recoveryProbability: 0.45,
        lastInteraction: "AI_BOT: WHATSAPP_REPLY_PENDING"
      },
      {
        loanId: "LN-303",
        applicantName: "HANS GRUBER",
        daysPastDue: 92,
        amountDue: 5000,
        strategy: CollectionStrategy.LEGAL_NUCLEAR,
        cluster: DebtorCluster.FRAUDULENT,
        recoveryProbability: 0.05,
        lastInteraction: "SYSTEM: BUREAU_REPORTED"
      }
    ];
  }

  private init() {
    setInterval(() => {
      this.processStep();
      this.updateBackendTelemetry();
      this.updateCollectionsDynamics();
      this.broadcast();
    }, 2500);
  }

  private broadcast() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  public updateCase(loanId: string, updates: Partial<CollectionCase>) {
    this.state.collections.cases = this.state.collections.cases.map(c => 
      c.loanId === loanId ? { ...c, ...updates } : c
    );
    this.broadcast();
  }

  private updateCollectionsDynamics() {
    this.state.collections.cases = this.state.collections.cases.map(c => ({
      ...c,
      recoveryProbability: c.recoveryProbability > 0.99 ? 1 : Math.min(1, Math.max(0, c.recoveryProbability + (Math.random() - 0.5) * 0.02))
    }));
  }

  private updateBackendTelemetry() {
    this.kafkaCounter += Math.floor(Math.random() * 50);
    this.state.backend.kafkaOffset = this.kafkaCounter;
  }

  private processStep() {
    this.state.lastAuditBlock.hash = generateHash();
  }

  public subscribe(fn: (data: RiskProfile) => void) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }
}

export const bioSocket = new JavaFintechEngine();
