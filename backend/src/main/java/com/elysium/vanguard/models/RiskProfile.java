package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskProfile {
    private String applicantId;
    private String applicantName;
    private RiskLevel riskLevel;
    private double siprScore;
    private String currentStep;
    private List<Anomaly> anomalies;
    private Object aiAudit;
}
