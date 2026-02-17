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

// Legacy Mock Service for backward compatibility or offline mode
export const bioSocket = {
  subscribe: (callback: (data: RiskProfile) => void) => {
    // Immediate fetch to avoid black screen delay
    riskService.getProfile().then(callback).catch(() => { });

    const interval = setInterval(async () => {
      try {
        const data = await riskService.getProfile();
        callback(data);
      } catch (e) {
        // Fallback or quiet retry
      }
    }, 5000);
    return () => clearInterval(interval);
  }
};
