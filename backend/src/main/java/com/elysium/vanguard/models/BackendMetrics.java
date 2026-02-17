package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackendMetrics {
    private int virtualThreads;
    private double heapUsage;
    private double p99Latency;
    private String gcActivity; // IDLE, ZGC_RUNNING, CLEANUP
    private double errorRate;
    private long kafkaOffset;
    private int throughput;
}
