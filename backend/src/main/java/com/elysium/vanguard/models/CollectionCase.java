package com.elysium.vanguard.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionCase {
    private String loanId;
    private String applicantName;
    private int daysPastDue;
    private double amountDue;
    private String strategy; // PREVENTIVE_PUSH, SOFT_NEGOTIATION, etc.
    private String cluster; // FORGETFUL, ILLIQUID, etc.
    private double recoveryProbability;
    private String lastInteraction;
}
