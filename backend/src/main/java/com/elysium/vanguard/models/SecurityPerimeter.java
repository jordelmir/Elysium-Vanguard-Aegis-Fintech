package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecurityPerimeter {
    private int wafBlockedToday;
    private boolean activeDdosThreat;
    private int mfaCompliance;
    private String encryptionStandard;
}
