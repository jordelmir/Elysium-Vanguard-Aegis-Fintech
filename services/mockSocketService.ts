import { RiskProfile } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export const riskService = {
  async getProfile(): Promise<RiskProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/risk/profile`);
      if (!response.ok) throw new Error('Cortex Link failure');
      return await response.json();
    } catch (error) {
      console.error('API Error, falling back to secure buffer:', error);
      throw error;
    }
  }
};

const MOCK_PROFILE: RiskProfile = {
  applicantId: "SARAH_CONNOR_9LX",
  applicantName: "SARAH CONNOR",
  riskLevel: RiskLevel.CRITICAL,
  siprScore: 0.982,
  currentStep: 'IDENTITY_SCAN',
  telemetry: {
    mouseVelocity: 142,
    scrollConsistency: 0.89,
    keyboardInteractions: [],
    biometricSignature: 'AEGIS_B64_HASH_9922'
  },
  judges: {
    llmAudit: 0.95,
    neuralMesh: 0.98,
    legacyScore: 0.42
  },
  backend: {
    throughput: 4821,
    p99Latency: 12.45,
    errorRate: 0.0001,
    virtualThreads: 1024,
    heapUsage: 45.2,
    gcActivity: 'IDLE',
    kafkaOffset: 8210455,
    connectedNodes: 12
  },
  pipeline: {
    currentBuild: "v6.4.2-GOLD",
    status: "SUCCESS",
    testCoverage: 98.5,
    securityGate: "PASSED"
  },
  cluster: [
    { id: "NODE_ALPHA_01", type: "CORE", cpu: 42, memory: 58, pods: 12, status: "HEALTHY" },
    { id: "NODE_BETA_02", type: "IA", cpu: 35, memory: 61, pods: 8, status: "HEALTHY" }
  ],
  services: [
    { name: "AUTH_GATEWAY", status: "UP", latency: 4, version: "2.1.0" },
    { name: "RISK_ENGINE", status: "UP", latency: 11, version: "1.8.4" }
  ],
  security: {
    wafBlockedToday: 48210,
    activeDdosThreat: false,
    mfaCompliance: 100,
    encryptionStandard: "AES-256GCM"
  },
  collections: {
    cases: [
      {
        loanId: "LN-AEGIS-SARAH",
        applicantName: "SARAH CONNOR",
        amountDue: 500000,
        daysPastDue: 35,
        strategy: "HARD_NEGOTIATION",
        cluster: "NEGOTIATION"
      }
    ],
    metrics: {
      total: 1000000,
      recovered: 350000,
      successRate: 0.35,
      costToCollect: 1200,
      recoveryRate: 0.35,
      cureRate: 0.12,
      activeNegotiations: 24
    }
  },
  lastAuditBlock: {
    id: "B-9102",
    hash: "0x882a...119c",
    timestamp: new Date().toISOString()
  },
  anomalies: [
    {
      id: "ANOM-001",
      type: "BEHAVIORAL",
      description: "High velocity keystroke detected",
      severity: 2,
      detectedAt: new Date().toISOString()
    }
  ],
  aiAudit: {}
};

export const bioSocket = {
  subscribe: (callback: (data: RiskProfile) => void) => {
    // Immediate callback with mock data
    callback(MOCK_PROFILE);

    const interval = setInterval(async () => {
      try {
        const data = await riskService.getProfile();
        callback(data);
      } catch (e) {
        // Silently fallback to mock updates
        callback({
          ...MOCK_PROFILE,
          backend: {
            ...MOCK_PROFILE.backend,
            throughput: MOCK_PROFILE.backend.throughput + Math.floor(Math.random() * 100)
          }
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  },
  selectSubject: (id: string) => {
    console.log(`Focus node changed: ${id}`);
  }
};
