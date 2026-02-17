package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceStatus {
    private String name;
    private String status; // UP, DOWN, DEGRADED
    private int latency;
    private String version;
}
