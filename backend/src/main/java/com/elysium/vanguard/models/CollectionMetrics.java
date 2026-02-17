package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionMetrics {
    private double costToCollect;
    private double recoveryRate;
    private double cureRate;
    private int activeNegotiations;
}
