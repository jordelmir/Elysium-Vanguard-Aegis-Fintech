/**
 * Centralized constants for the Elysium Vanguard: Aegis platform.
 * All magic numbers, URLs, and configuration values should be defined here.
 */

// ─── SERVICE ENDPOINTS ──────────────────────────────────────────────────────
export const CORTEX_API_URL = 'http://localhost:8080/api/risk/profile';
export const TELEMETRY_API_URL = 'http://localhost:8081/api/telemetry';
export const HEALTH_CORTEX_URL = 'http://localhost:8080/api/health';
export const HEALTH_TELEMETRY_URL = 'http://localhost:8081/api/telemetry/health';

// ─── POLLING & TIMING ───────────────────────────────────────────────────────
export const POLL_INTERVAL_MS = 3000;
export const FETCH_TIMEOUT_MS = 5000;
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// ─── RESILIENCY ─────────────────────────────────────────────────────────────
export const CIRCUIT_BREAKER_THRESHOLD = 3;
export const CIRCUIT_BREAKER_RESET_MS = 15000;
export const MAX_RETRY_BACKOFF_MS = 30000;

// ─── RISK SCORING ───────────────────────────────────────────────────────────
export const RISK_THRESHOLDS = {
    CRITICAL: 0.75,
    MEDIUM: 0.35,
    LOW: 0.0,
} as const;

export const CREDIT_SCORE_RANGE = {
    MAX: 950,
    PRIME: 800,
    NEAR_PRIME: 700,
    SUB_PRIME: 600,
    MIN: 50,
} as const;

// ─── FINANCIAL ──────────────────────────────────────────────────────────────
export const APR_BY_RISK = {
    CRITICAL: 24.9,
    MEDIUM: 18.5,
    LOW: 12.8,
} as const;

// ─── BANK LIST ──────────────────────────────────────────────────────────────
export const SUPPORTED_BANKS = [
    'AEGIS_CAPITAL',
    'VANGUARD_TRUST',
    'ELYSIUM_FEDERAL',
    'NEXUS_PRIME',
] as const;

// ─── APPLICATION FLOW ───────────────────────────────────────────────────────
export const LOAN_AMOUNT_RANGE = {
    MIN: 100,
    MAX: 50000,
    DEFAULT: 1200,
    STEP: 100,
} as const;

// ─── UI CONSTANTS ───────────────────────────────────────────────────────────
export const ANIMATION_DURATION_MS = 300;
export const SCANNER_DURATION_MS = 3000;
export const CONTRACT_MATURITY_MONTHS = 12;

export type SupportedBank = typeof SUPPORTED_BANKS[number];
