package com.projecthotel.khanhsky_hotel.model;

import java.math.BigDecimal;

public enum ServiceType {
    AIRPORT_PICKUP("Đưa đón sân bay",new BigDecimal("100000"), PricingRule.FIXED),
    EXTRA_BED("Ghế tình yêu",new BigDecimal("200000"), PricingRule.PER_NIGHT),
    BREAKFAST("Ăn sáng",new BigDecimal("300000"), PricingRule.PER_PERSON_PER_NIGHT),
    SEA_FOOD("Tôm hùm bông 333",new BigDecimal("300000"), PricingRule.PER_PERSON_PER_NIGHT);

    private final String displayName;
    private final BigDecimal price;
    private final PricingRule rule;

    ServiceType(String displayName,BigDecimal price,PricingRule rule) {
        this.displayName = displayName;
        this.price = price;
        this.rule = rule;
    }
    public String getDisplayName() {return displayName;}
    public BigDecimal getPrice() {return price;}
    public PricingRule getRule() {return rule;}

    public enum PricingRule{
        FIXED,
        PER_NIGHT,
        PER_PERSON_PER_NIGHT
    }
}
