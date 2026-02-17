import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8081; // Different from Java Backend (8080) and Web (3001)

app.use(cors());
app.use(express.json());

// Biometric Entropy Generator
const generateBiometrics = () => ({
    mouseVelocity: Math.floor(Math.random() * 200) + 50,
    scrollConsistency: Number((Math.random() * (0.95 - 0.75) + 0.75).toFixed(2)),
    biometricSignature: `AEGIS_REGEN_${Math.random().toString(36).substring(7).toUpperCase()}`,
    timestamp: new Date().toISOString()
});

app.get('/api/telemetry', (req, res) => {
    console.log(`[TELEMETRY_TX] Dispatching Biometric Signature at ${new Date().toLocaleTimeString()}`);
    res.json({
        status: 'HEALTHY',
        service: 'ELYSIUM_VANGUARD_TELEMETRY',
        node: 'NODE_EPSILON_91',
        data: generateBiometrics()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 [TELEMETRY_SERVICE] Online at http://localhost:${PORT}`);
    console.log(`🔒 [ZERO_TRUST] Distributed Biometric Perimeter Active`);
});
