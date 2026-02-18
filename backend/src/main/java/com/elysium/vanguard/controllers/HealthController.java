package com.elysium.vanguard.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;

/**
 * Health check endpoint for monitoring and orchestration.
 * Returns service status, uptime, version, and JVM diagnostics.
 */
@RestController
public class HealthController {

    private static final Instant START_TIME = Instant.now();

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        Runtime runtime = Runtime.getRuntime();
        Duration uptime = Duration.between(START_TIME, Instant.now());

        return Map.of(
            "status", "OPERATIONAL",
            "service", "elysium-vanguard-cortex",
            "version", "2.0.0-aegis",
            "uptime", formatDuration(uptime),
            "uptimeSeconds", uptime.toSeconds(),
            "timestamp", Instant.now().toString(),
            "jvm", Map.of(
                "maxMemoryMB", runtime.maxMemory() / (1024 * 1024),
                "usedMemoryMB", (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024),
                "availableProcessors", runtime.availableProcessors(),
                "javaVersion", System.getProperty("java.version", "unknown")
            )
        );
    }

    @GetMapping("/api/risk/health")
    public Map<String, Object> riskHealth() {
        return Map.of(
            "status", "OPERATIONAL",
            "subsystem", "risk-assessment-engine",
            "timestamp", Instant.now().toString()
        );
    }

    private String formatDuration(Duration d) {
        long hours = d.toHours();
        long minutes = d.toMinutesPart();
        long seconds = d.toSecondsPart();
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }
}
