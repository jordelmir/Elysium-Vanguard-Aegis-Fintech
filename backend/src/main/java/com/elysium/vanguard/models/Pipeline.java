package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pipeline {
    private String currentBuild;
    private String status; // SUCCESS, RUNNING, ROLLBACK
    private double testCoverage;
    private String securityGate; // PASSED, FAILED
}
