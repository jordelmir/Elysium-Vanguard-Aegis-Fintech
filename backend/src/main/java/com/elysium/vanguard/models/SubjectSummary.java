package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectSummary {
    private String netWorth;
    private int creditScore;
    private String liabilities;
}
