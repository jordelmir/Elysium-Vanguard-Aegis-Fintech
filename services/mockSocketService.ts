import { RiskProfile, RiskLevel, AnomalyType, Anomaly, LedgerBlock } from '../types';

// Generators for mock data
const generateHash = () => Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

const INITIAL_PROFILE: RiskProfile = {
  applicantId: "SUBJ-8821-X",
  siprScore: 0.45,
  forensicIntegrityScore: 0.98,
  riskLevel: RiskLevel.LOW,
  anomalies: [],
  vectors: [
    { dimension: "Liquidity Velocity", value: 85 },
    { dimension: "Debt Saturation", value: 30 },
    { dimension: "Collateral Elasticity", value: 60 }
  ],
  lastAuditBlock: {
    blockId: "BLK-0000-GENESIS",
    hash: generateHash(),
    previousHash: "0000000000000000",
    timestamp: new Date().toISOString(),
    actor: "SYSTEM_BOOTSTRAP",
    status: 'VERIFIED'
  }
};

type Listener = (data: RiskProfile) => void;

class MockBioSocket {
  private listeners: Listener[] = [];
  private currentProfile: RiskProfile = { ...INITIAL_PROFILE };
  private intervalId: number | null = null;
  private overrideMode: 'NORMAL' | 'BREACH' | null = null;

  constructor() {
    this.startSimulation();
  }

  public subscribe(callback: Listener): () => void {
    this.listeners.push(callback);
    callback(this.currentProfile); // Immediate initial data
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // New: Allow UI to force specific scenarios
  public triggerScenario(scenario: 'NORMAL' | 'BREACH') {
    this.overrideMode = scenario;
    this.runSimulationStep(); // Immediate update
  }

  private broadcast() {
    this.listeners.forEach(l => l(this.currentProfile));
  }

  private runSimulationStep() {
    let newScore = this.currentProfile.siprScore;

    if (this.overrideMode === 'BREACH') {
        // Force high risk
        newScore = Math.min(0.98, newScore + 0.05);
    } else if (this.overrideMode === 'NORMAL') {
        // Force recovery
        newScore = Math.max(0.15, newScore - 0.05);
    } else {
        // Natural fluctuation
        const delta = (Math.random() - 0.45) * 0.05;
        newScore += delta;
        // Occasional spike
        if (Math.random() > 0.98) newScore += 0.15;
    }
    
    // Clamp
    newScore = Math.max(0, Math.min(1, newScore));

    // Determine Risk Level
    let level = RiskLevel.LOW;
    if (newScore > 0.6) level = RiskLevel.MEDIUM;
    if (newScore > 0.8) level = RiskLevel.HIGH;
    if (newScore > 0.9) level = RiskLevel.CRITICAL;

    // Generate Anomalies if risk is high (or forced breach)
    const currentAnomalies = [...this.currentProfile.anomalies];
    const shouldGenAnomaly = (newScore > 0.75 && Math.random() > 0.7) || (this.overrideMode === 'BREACH' && Math.random() > 0.5);

    if (shouldGenAnomaly) {
      const types = Object.values(AnomalyType);
      const newAnomaly: Anomaly = {
        id: `ANM-${Math.floor(Math.random() * 9999)}`,
        type: types[Math.floor(Math.random() * types.length)],
        description: "Inconsistent temporal metadata in transaction log detected by forensic engine.",
        severity: Math.random(),
        detectedAt: new Date().toISOString()
      };
      currentAnomalies.unshift(newAnomaly);
      if (currentAnomalies.length > 8) currentAnomalies.pop();
    }

    // Update Ledger
    const newBlock: LedgerBlock = {
      blockId: `BLK-${Math.floor(Date.now() / 1000)}`,
      previousHash: this.currentProfile.lastAuditBlock.hash.substring(0, 16) + "...",
      hash: generateHash(),
      timestamp: new Date().toISOString(),
      actor: "AI_ORCHESTRATOR_SVC",
      status: 'VERIFIED'
    };

    // Update Integrity inversely to Risk
    let newIntegrity = this.currentProfile.forensicIntegrityScore;
    if (newScore > 0.8) newIntegrity = Math.max(0.4, newIntegrity - 0.02);
    else newIntegrity = Math.min(1.0, newIntegrity + 0.01);

    this.currentProfile = {
      ...this.currentProfile,
      siprScore: newScore,
      forensicIntegrityScore: newIntegrity,
      riskLevel: level,
      anomalies: currentAnomalies,
      lastAuditBlock: newBlock,
      vectors: this.currentProfile.vectors.map(v => ({
          ...v,
          value: Math.max(0, Math.min(100, v.value + (Math.random() - 0.5) * 15))
      }))
    };

    this.broadcast();
  }

  private startSimulation() {
    this.intervalId = window.setInterval(() => {
        this.runSimulationStep();
    }, 2000); // 2 second heartbeat
  }

  // Helper for charts
  public getHistory(metric: string) {
    const data = [];
    let val = 50;
    for(let i=0; i<20; i++) {
        val = Math.max(0, Math.min(100, val + (Math.random() - 0.5) * 20));
        data.push({ time: `T-${20-i}`, value: val });
    }
    return data;
  }
}

export const bioSocket = new MockBioSocket();