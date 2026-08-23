package com.finsync.dto;

import java.math.BigDecimal;

public class CardControlRequest {
    public Boolean cardFrozen;
    public Boolean onlineTxnEnabled;
    public Boolean contactlessEnabled;
    public Boolean internationalTxnEnabled;
    public BigDecimal dailyLimit;
}
