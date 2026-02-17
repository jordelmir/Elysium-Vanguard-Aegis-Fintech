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
    private BackendMetrics backend;
    private Pipeline pipeline;
    private List<ClusterNode> cluster;
    private List<ServiceStatus> services;
    private SecurityPerimeter security;
    private Collections collections;
    private SubjectSummary subjectSummary;
    private Object aiAudit;
}
