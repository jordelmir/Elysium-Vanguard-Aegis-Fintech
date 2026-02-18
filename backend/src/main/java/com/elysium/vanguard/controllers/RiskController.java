package com.elysium.vanguard.controllers;

import com.elysium.vanguard.models.*;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.UUID;
import java.time.Instant;

@RestController
@RequestMapping("/api/risk")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class RiskController {

        @GetMapping("/profile")
        public RiskProfile getMockRiskProfile() {
                return createBaseProfile();
        }

        @PostMapping("/profile/update")
        public RiskProfile updateProfile(
                        @RequestHeader(value = "X-Idempotency-Key", required = true) String idempotencyKey,
                        @RequestBody RiskProfile updateRequest) {

                // IDEMPOTENCY SAFETY: In a production system, we would query the Idempotency
                // Store (Redis/DB)
                System.out.println("[IDEMPOTENCY] Processing request with key: " + idempotencyKey);

                // CONCURRENCY SAFETY: Optimistic Locking Check
                RiskProfile current = createBaseProfile();
                if (updateRequest.getVersion() < current.getVersion()) {
                        throw new RuntimeException("STALE_UPDATE_DETECTED: Target version " + updateRequest.getVersion()
                                        + " is behind current version " + current.getVersion());
                }

                return updateRequest;
        }

        private RiskProfile createBaseProfile() {
                return RiskProfile.builder()
                                .applicantId("SARAH_CONNOR_9LX")
                                .applicantName("SARAH CONNOR")
                                .riskLevel(RiskLevel.CRITICAL)
                                .siprScore(0.982)
                                .currentStep("IDENTITY_SCAN")
                                .version(10L) // Starting version for audit purposes
                                .backend(BackendMetrics.builder()
                                                .throughput(4821)
                                                .p99Latency(12.45)
                                                .errorRate(0.0001)
                                                .virtualThreads(1024)
                                                .heapUsage(45.2)
                                                .gcActivity("IDLE")
                                                .kafkaOffset(8210455L)
                                                .build())
                                .pipeline(Pipeline.builder()
                                                .currentBuild("v6.4.2-GOLD")
                                                .status("SUCCESS")
                                                .testCoverage(98.5)
                                                .securityGate("PASSED")
                                                .build())
                                .cluster(Arrays.asList(
                                                ClusterNode.builder().id("NODE_ALPHA_01").type("CORE").cpu(42)
                                                                .memory(58).pods(12)
                                                                .status("HEALTHY").build(),
                                                ClusterNode.builder().id("NODE_BETA_02").type("IA").cpu(35).memory(61)
                                                                .pods(8).status("HEALTHY")
                                                                .build()))
                                .services(Arrays.asList(
                                                ServiceStatus.builder().name("AUTH_GATEWAY").status("UP").latency(4)
                                                                .version("2.1.0").build(),
                                                ServiceStatus.builder().name("RISK_ENGINE").status("UP").latency(11)
                                                                .version("1.8.4").build()))
                                .security(SecurityPerimeter.builder()
                                                .wafBlockedToday(48210)
                                                .activeDdosThreat(false)
                                                .mfaCompliance(100)
                                                .encryptionStandard("AES-256GCM")
                                                .build())
                                .collections(Collections.builder()
                                                .cases(Arrays.asList(
                                                                CollectionCase.builder()
                                                                                .loanId("LN-AEGIS-SARAH")
                                                                                .applicantName("SARAH CONNOR")
                                                                                .amountDue(500000)
                                                                                .daysPastDue(35)
                                                                                .strategy("HARD_NEGOTIATION")
                                                                                .cluster("NEGOTIATION")
                                                                                .build()))
                                                .metrics(CollectionMetrics.builder()
                                                                .costToCollect(1250.45)
                                                                .recoveryRate(0.35)
                                                                .cureRate(0.12)
                                                                .activeNegotiations(24)
                                                                .build())
                                                .build())
                                .subjectSummary(SubjectSummary.builder()
                                                .netWorth("5.2M")
                                                .creditScore(840)
                                                .liabilities("120K")
                                                .build())
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
