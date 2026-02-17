import { RiskProfile, RiskLevel } from '../types';

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

// RESILIENCY CONSTANTS
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;
const BACKOFF_FACTOR = 1.5;
const JITTER_FACTOR = 0.2;
const FAILURE_THRESHOLD = 3;

enum CircuitState { CLOSED, OPEN, HALF_OPEN }

const CORTEX_URL = 'http://localhost:8080/api/risk/profile';
const TELEMETRY_URL = 'http://localhost:8081/api/telemetry';

// Socket topics for internal use
export const SOCKET_TOPICS = {
  RISK: 'risk-profile',
  TELEMETRY: 'telemetry-stream',
  SYSTEM: 'system-status'
};

// Public Registry Data for SystemMonitor
export const SUBJECTS = [
  { id: "SARAH_CONNOR_9LX", name: "SARAH CONNOR", riskTier: "CRITICAL", status: "ACTIVE" },
  { id: "JOHN_DOE_12X", name: "JOHN DOE", riskTier: "LOW", status: "ARCHIVED" },
  { id: "ALICE_V_77", name: "ALICE VANCE", riskTier: "MEDIUM", status: "ACTIVE" }
];

export const bioSocket = {
  subscribe: (callback: (data: RiskProfile) => void) => {
    let isSubscribed = true;
    let riskCircuit = { failureCount: 0, state: CircuitState.CLOSED, retryDelay: INITIAL_RETRY_DELAY };
    let telemetryCircuit = { failureCount: 0, state: CircuitState.CLOSED, retryDelay: INITIAL_RETRY_DELAY };
    let timeoutId: any = null;

    // Baseline local state
    let lastData: RiskProfile = { ...MOCK_PROFILE };

    const fetchService = async (url: string, circuit: any, serviceName: string) => {
      if (circuit.state === CircuitState.OPEN) return null;

      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
        if (!response.ok) throw new Error(`${serviceName} non-ok response`);

        circuit.failureCount = 0;
        circuit.retryDelay = INITIAL_RETRY_DELAY;
        circuit.state = CircuitState.CLOSED;
        return await response.json();
      } catch (e) {
        circuit.failureCount++;
        circuit.retryDelay = Math.min(circuit.retryDelay * BACKOFF_FACTOR, MAX_RETRY_DELAY);

        console.error(`🚨 [${serviceName}] Failure ${circuit.failureCount}/${FAILURE_THRESHOLD}`);

        if (circuit.failureCount >= FAILURE_THRESHOLD) {
          circuit.state = CircuitState.OPEN;
          console.error(`❌ [${serviceName}] CIRCUIT OPENED.`);
          // Auto-recovery attempt after 30s
          setTimeout(() => {
            circuit.state = CircuitState.CLOSED;
            console.log(`🔄 [${serviceName}] Circuit reset for retry.`);
          }, 30000);
        }
        return null;
      }
    };

    const poll = async () => {
      if (!isSubscribed) return;

      try {
        // DISTRIBUTED POLL: Dual Services
        const [riskUpdate, telemetryUpdate] = await Promise.all([
          fetchService(CORTEX_URL, riskCircuit, 'CORTEX').catch(() => null),
          fetchService(TELEMETRY_URL, telemetryCircuit, 'TELEMETRY').catch(() => null)
        ]);

        // STABILITY HARDENING: Deep Merge Logic (Ironclad Edition)
        // Prevents any service update from injecting nulls into required objects
        const mergedRisk = riskUpdate ? {
          ...lastData,
          ...riskUpdate,
          // DEFENSE: Never allow null to overwrite a required structure
          backend: (riskUpdate.backend && typeof riskUpdate.backend === 'object') ? { ...lastData.backend, ...riskUpdate.backend } : lastData.backend,
          pipeline: (riskUpdate.pipeline && typeof riskUpdate.pipeline === 'object') ? { ...lastData.pipeline, ...riskUpdate.pipeline } : lastData.pipeline,
          collections: (riskUpdate.collections && typeof riskUpdate.collections === 'object') ? { ...lastData.collections, ...riskUpdate.collections } : lastData.collections,
          cluster: Array.isArray(riskUpdate.cluster) ? riskUpdate.cluster : lastData.cluster,
          services: Array.isArray(riskUpdate.services) ? riskUpdate.services : lastData.services,
          security: (riskUpdate.security && typeof riskUpdate.security === 'object') ? { ...lastData.security, ...riskUpdate.security } : lastData.security,
          anomalies: Array.isArray(riskUpdate.anomalies) ? riskUpdate.anomalies : lastData.anomalies,
          judges: (riskUpdate.judges && typeof riskUpdate.judges === 'object') ? { ...lastData.judges, ...riskUpdate.judges } : lastData.judges,
          aiAudit: riskUpdate.aiAudit || lastData.aiAudit || {},
          lastAuditBlock: riskUpdate.lastAuditBlock || lastData.lastAuditBlock
        } : lastData;

        lastData = {
          ...mergedRisk,
          telemetry: (telemetryUpdate && telemetryUpdate.data) ? {
            ...mergedRisk.telemetry,
            mouseVelocity: telemetryUpdate.data.mouseVelocity ?? mergedRisk.telemetry.mouseVelocity,
            scrollConsistency: telemetryUpdate.data.scrollConsistency ?? mergedRisk.telemetry.scrollConsistency,
            biometricSignature: telemetryUpdate.data.biometricSignature ?? mergedRisk.telemetry.biometricSignature,
            timestamp: telemetryUpdate.data.timestamp
          } : {
            ...mergedRisk.telemetry,
            // Simulated jitter if telemetry service is down
            mouseVelocity: mergedRisk.telemetry.mouseVelocity + (Math.random() * 6 - 3),
            biometricSignature: mergedRisk.telemetry.biometricSignature || 'AEGIS_OFFLINE_MODE'
          }
        };

        // DEBUG: Output state for local diagnosis
        console.log('📡 [SYNC_ACTIVE] Aggregated Distributed State:', lastData.applicantId);
        callback(lastData);
      } catch (fatalError) {
        console.error('❌ [FATAL_NODE_ERROR] Recovery Protocol Engaged:', fatalError);
        // Fallback to last known good state if everything explodes
        callback(lastData);
      }

      timeoutId = setTimeout(poll, 3000);
    };

    // Initial dispatch
    callback(lastData);
    poll();

    return () => {
      isSubscribed = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  },
  selectSubject: (id: string) => {
    console.log(`[SOVEREIGN_ROOT] Focus node changed: ${id}`);
  }
};
