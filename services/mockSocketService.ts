
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
      this.listeners.forEach(l => l({ ...this.state }));
    }, 2500);
  }

  private updateCollectionsDynamics() {
    // Simular el motor NBA actualizando probabilidades
    this.state.collections.cases = this.state.collections.cases.map(c => ({
      ...c,
      recoveryProbability: Math.min(1, Math.max(0, c.recoveryProbability + (Math.random() - 0.5) * 0.05)),
      lastInteraction: Math.random() > 0.7 ? `AI_BOT: RE_NEGOTIATING_${Math.floor(Date.now()/100000)}` : c.lastInteraction
    }));

    // Actualizar métricas globales de cobranza
    this.state.collections.metrics = {
      costToCollect: 0.01 + Math.random() * 0.005,
      recoveryRate: 0.8 + Math.random() * 0.05,
      cureRate: 0.6 + Math.random() * 0.1,
      activeNegotiations: 40 + Math.floor(Math.random() * 10)
    };
  }

  private updateBackendTelemetry() {
    this.kafkaCounter += Math.floor(Math.random() * 50);
    this.state.backend = {
      virtualThreads: 5000 + Math.floor(Math.random() * 15000),
      heapUsage: 30 + Math.sin(Date.now() / 10000) * 10,
      p99Latency: 0.8 + Math.random() * 0.4,
      gcActivity: Math.random() > 0.9 ? 'ZGC_RUNNING' : 'IDLE',
      kafkaOffset: this.kafkaCounter
    };
  }

  private processStep() {
    const steps = Object.values(ApplicationStep);
    const nextIdx = (steps.indexOf(this.state.currentStep) + 1) % steps.length;
    const nextStep = steps[nextIdx];

    if (nextStep === ApplicationStep.KAFKA_INGEST) {
      const sub = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
      this.state.applicantName = sub.name;
      this.state.applicantId = sub.id;
      this.state.anomalies = [];
    }

    this.state.telemetry = {
      keystrokeJitter: Math.random(),
      scrollVelocity: Math.random() * 1000,
      deviceStability: 0.5 + Math.random() * 0.5,
      batteryStatus: Math.max(5, Math.floor(Math.random() * 100)),
      isCharging: Math.random() > 0.5,
      networkType: Math.random() > 0.9 ? 'VPN_DETECTED' : 'WIFI'
    };

    this.state.judges = {
      tabularScore: Math.random(),
      sequentialScore: Math.random(),
      graphScore: this.state.telemetry.networkType === 'VPN_DETECTED' ? 0.98 : Math.random() * 0.2,
      inferenceTimeMs: 4.2 + Math.random() * 8.5
    };

    this.state.siprScore = (this.state.judges.tabularScore * 0.45) + 
                           (this.state.judges.sequentialScore * 0.35) + 
                           (this.state.judges.graphScore * 0.2);

    this.state.riskLevel = this.state.siprScore > 0.8 ? RiskLevel.CRITICAL : 
                           this.state.siprScore > 0.5 ? RiskLevel.HIGH : 
                           this.state.siprScore > 0.2 ? RiskLevel.MEDIUM : RiskLevel.LOW;

    this.state.currentStep = nextStep;
    this.state.lastAuditBlock = {
      id: `BLK-${Math.floor(Math.random()*10000)}`,
      hash: generateHash(),
      timestamp: new Date().toISOString()
    };

    if (this.state.riskLevel === RiskLevel.CRITICAL && this.state.anomalies.length === 0) {
      this.state.anomalies.push({
        id: `ANM-${Math.floor(Math.random() * 9999)}`,
        type: AnomalyType.METADATA,
        description: "ONNX Confidence Mismatch: Device profile suggests bot farm emulation.",
        severity: 0.95,
        detectedAt: new Date().toISOString()
      });
    }
  }

  public subscribe(fn: (data: RiskProfile) => void) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }
}

export const bioSocket = new JavaFintechEngine();
