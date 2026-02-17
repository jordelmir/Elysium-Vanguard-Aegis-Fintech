package com.elysium.vanguard.controllers;

import com.elysium.vanguard.models.RiskProfile;
import com.elysium.vanguard.models.RiskLevel;
import com.elysium.vanguard.models.Anomaly;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.UUID;
import java.time.Instant;

@RestController
@RequestMapping("/api/risk")
public class RiskController {

    @GetMapping("/profile")
    public RiskProfile getMockRiskProfile() {
        return RiskProfile.builder()
                .applicantId(UUID.randomUUID().toString())
                .applicantName("Cortex Node 01")
                .riskLevel(RiskLevel.MEDIUM)
                .siprScore(0.72)
                .currentStep("KAFKA_INGEST")
                .anomalies(Arrays.asList(
                        Anomaly.builder()
                                .id(UUID.randomUUID().toString())
                                .type("BEHAVIORAL")
                                .description("High velocity keystroke detected")
                                .severity(2)
                                .detectedAt(Instant.now().toString())
                                .build()))
                .build();
    }
}
