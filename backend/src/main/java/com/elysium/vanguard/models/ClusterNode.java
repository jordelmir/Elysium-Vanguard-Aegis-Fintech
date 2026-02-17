package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClusterNode {
    private String id;
    private String type; // CORE, IA, EDGE
    private int cpu;
    private int memory;
    private int pods;
    private String status; // HEALTHY, PRESSURE, SCALING
}
