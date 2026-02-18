
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// ─── INTERFACES ─────────────────────────────────────────────────────────────
interface TelemetryData {
    mouseVelocity: number;
    scrollConsistency: number;
    keystrokeDelta: number;
    deviceOrientation: number;
    sessionEntropy: number;
    timestamp: string;
}

interface HealthResponse {
    status: string;
    service: string;
    version: string;
    uptime: number;
    timestamp: string;
}

interface ErrorResponse {
    error: string;
    detail: string;
    timestamp: string;
    service: string;
}

// ─── CONFIGURATION ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8081;
const SERVICE_NAME = 'elysium-telemetry-sentinel';
const SERVICE_VERSION = '2.0.0-aegis';
const startTime = Date.now();

const app = express();

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} — ${req.ip}`);
    next();
});

// ─── ROUTES ─────────────────────────────────────────────────────────────────

/** Health check endpoint for monitoring and orchestration */
app.get('/api/telemetry/health', (_req: Request, res: Response) => {
    const response: HealthResponse = {
        status: 'OPERATIONAL',
        service: SERVICE_NAME,
        version: SERVICE_VERSION,
        uptime: Math.floor((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
    };
    res.json(response);
});

/** Primary telemetry data endpoint — generates behavioral biometric signals */
app.get('/api/telemetry', (_req: Request, res: Response) => {
    const telemetry: TelemetryData = {
        mouseVelocity: parseFloat((Math.random() * 1500).toFixed(2)),
        scrollConsistency: parseFloat((Math.random()).toFixed(4)),
        keystrokeDelta: parseFloat((50 + Math.random() * 200).toFixed(1)),
        deviceOrientation: parseFloat((Math.random() * 360).toFixed(1)),
        sessionEntropy: parseFloat((Math.random()).toFixed(6)),
        timestamp: new Date().toISOString(),
    };
    res.json(telemetry);
});

/** Error ingestion endpoint — receives client-side error reports */
app.post('/api/telemetry/error', (req: Request, res: Response) => {
    const { message, stack, componentStack, timestamp } = req.body;
    console.error(`[ERROR_INGESTED] ${timestamp || new Date().toISOString()}`);
    console.error(`  Message: ${message}`);
    if (stack) console.error(`  Stack: ${stack.substring(0, 200)}`);
    if (componentStack) console.error(`  Component: ${componentStack.substring(0, 200)}`);
    res.status(201).json({ status: 'INGESTED', id: `ERR-${Date.now()}` });
});

// ─── ERROR HANDLING ─────────────────────────────────────────────────────────

// 404 handler
app.use((_req: Request, res: Response) => {
    const response: ErrorResponse = {
        error: 'ENDPOINT_NOT_FOUND',
        detail: `No handler for ${_req.method} ${_req.path}`,
        timestamp: new Date().toISOString(),
        service: SERVICE_NAME,
    };
    res.status(404).json(response);
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(`[FATAL] ${err.message}`);
    const response: ErrorResponse = {
        error: 'INTERNAL_FAULT',
        detail: err.message,
        timestamp: new Date().toISOString(),
        service: SERVICE_NAME,
    };
    res.status(500).json(response);
});

// ─── STARTUP ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  ${SERVICE_NAME} v${SERVICE_VERSION}`);
    console.log(`  Port: ${PORT}`);
    console.log(`  Status: OPERATIONAL`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
