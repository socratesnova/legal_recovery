"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule_evaluation_1 = require("./rule-evaluation");
const noInst = {
    maxDiscountAuto: null,
    maxDiscountManual: null,
    minInstallments: null,
    maxInstallments: null,
    autoApprovalLimit: null,
};
const noPort = {
    discountMax: null,
    minInstallments: null,
    maxInstallments: null,
    autoApprovalLimit: null,
    channelsAllowed: null,
};
const baseRules = {
    discountHardMax: 20,
    discountAutoMax: 10,
    minInstallments: 3,
    maxInstallments: 12,
    autoApprovalLimit: 5000,
    channelsAllowed: null,
};
describe("mergeRules", () => {
    it("returns all-null effective rules when nothing is configured", () => {
        const r = (0, rule_evaluation_1.mergeRules)(null, null);
        expect(r).toEqual({
            discountHardMax: null,
            discountAutoMax: null,
            minInstallments: null,
            maxInstallments: null,
            autoApprovalLimit: null,
            channelsAllowed: null,
        });
    });
    it("uses institution-wide caps when no portfolio rule exists", () => {
        const r = (0, rule_evaluation_1.mergeRules)({
            maxDiscountAuto: 10,
            maxDiscountManual: 20,
            minInstallments: 2,
            maxInstallments: 24,
            autoApprovalLimit: 5000,
        }, null);
        expect(r).toEqual({
            discountHardMax: 20,
            discountAutoMax: 10,
            minInstallments: 2,
            maxInstallments: 24,
            autoApprovalLimit: 5000,
            channelsAllowed: null,
        });
    });
    it("uses portfolio caps only when no institution caps exist (no auto max without maxDiscountAuto)", () => {
        const r = (0, rule_evaluation_1.mergeRules)(noInst, {
            discountMax: 15,
            minInstallments: 3,
            maxInstallments: 12,
            autoApprovalLimit: 3000,
            channelsAllowed: ["PHONE", "EMAIL"],
        });
        expect(r).toEqual({
            discountHardMax: 15,
            discountAutoMax: null,
            minInstallments: 3,
            maxInstallments: 12,
            autoApprovalLimit: 3000,
            channelsAllowed: ["PHONE", "EMAIL"],
        });
    });
    it("picks the most restrictive value when both are configured", () => {
        const r = (0, rule_evaluation_1.mergeRules)({
            maxDiscountAuto: 10,
            maxDiscountManual: 20,
            minInstallments: 1,
            maxInstallments: 36,
            autoApprovalLimit: 10000,
        }, {
            discountMax: 15,
            minInstallments: 3,
            maxInstallments: 12,
            autoApprovalLimit: 3000,
            channelsAllowed: null,
        });
        expect(r.discountHardMax).toBe(15);
        expect(r.discountAutoMax).toBe(10);
        expect(r.minInstallments).toBe(3);
        expect(r.maxInstallments).toBe(12);
        expect(r.autoApprovalLimit).toBe(3000);
    });
    it("treats an empty channelsAllowed array as not configured", () => {
        const r = (0, rule_evaluation_1.mergeRules)(noInst, { ...noPort, channelsAllowed: [] });
        expect(r.channelsAllowed).toBeNull();
    });
});
describe("validateAgreementAgainstRules", () => {
    it("auto-approves a no-discount agreement within the amount limit", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "FULL_PAYMENT", amount: 1000 }, baseRules);
        expect(r.ok).toBe(true);
        expect(r.violations).toEqual([]);
        expect(r.autoApproved).toBe(true);
    });
    it("auto-approves a discount within the auto cap", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "DISCOUNT", amount: 1000, discountPercentage: 8 }, baseRules);
        expect(r.ok).toBe(true);
        expect(r.autoApproved).toBe(true);
    });
    it("accepts a discount within the hard cap but routes it to manual approval", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "DISCOUNT", amount: 1000, discountPercentage: 15 }, baseRules);
        expect(r.ok).toBe(true);
        expect(r.autoApproved).toBe(false);
    });
    it("rejects a discount above the hard cap", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "DISCOUNT", amount: 1000, discountPercentage: 25 }, baseRules);
        expect(r.ok).toBe(false);
        expect(r.violations).toHaveLength(1);
        expect(r.violations[0].code).toBe("DISCOUNT_EXCEEDS_MAX");
        expect(r.autoApproved).toBe(false);
    });
    it("rejects installments below the minimum", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "INSTALLMENTS", amount: 1000, installments: 1 }, baseRules);
        expect(r.ok).toBe(false);
        expect(r.violations[0].code).toBe("INSTALLMENTS_BELOW_MIN");
    });
    it("rejects installments above the maximum", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "INSTALLMENTS", amount: 1000, installments: 40 }, baseRules);
        expect(r.ok).toBe(false);
        expect(r.violations[0].code).toBe("INSTALLMENTS_ABOVE_MAX");
    });
    it("accepts installments exactly at the boundaries", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "INSTALLMENTS", amount: 1000, installments: 3 }, baseRules);
        expect(r.ok).toBe(true);
    });
    it("routes to manual approval when the amount exceeds the auto limit", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "FULL_PAYMENT", amount: 6000 }, baseRules);
        expect(r.ok).toBe(true);
        expect(r.autoApproved).toBe(false);
    });
    it("requires manual approval for any discount when no auto max is configured", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "DISCOUNT", amount: 1000, discountPercentage: 5 }, { ...baseRules, discountAutoMax: null });
        expect(r.ok).toBe(true);
        expect(r.autoApproved).toBe(false);
    });
    it("requires manual approval for everything when no auto limit is configured", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "FULL_PAYMENT", amount: 1000 }, { ...baseRules, autoApprovalLimit: null });
        expect(r.ok).toBe(true);
        expect(r.autoApproved).toBe(false);
    });
    it("auto-approves a discount exactly at the auto cap", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "DISCOUNT", amount: 1000, discountPercentage: 10 }, baseRules);
        expect(r.ok).toBe(true);
        expect(r.autoApproved).toBe(true);
    });
    it("collects multiple violations", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({
            type: "INSTALLMENTS",
            amount: 1000,
            discountPercentage: 25,
            installments: 1,
        }, baseRules);
        expect(r.ok).toBe(false);
        expect(r.violations).toHaveLength(2);
        expect(r.violations.map((v) => v.code)).toEqual(expect.arrayContaining([
            "DISCOUNT_EXCEEDS_MAX",
            "INSTALLMENTS_BELOW_MIN",
        ]));
    });
    it("skips discount/installment checks when they are not provided", () => {
        const r = (0, rule_evaluation_1.validateAgreementAgainstRules)({ type: "FULL_PAYMENT", amount: 1000 }, {
            ...baseRules,
            discountHardMax: null,
            minInstallments: null,
            maxInstallments: null,
        });
        expect(r.ok).toBe(true);
    });
});
describe("isAgreementActiveForPayment", () => {
    it.each(["APPROVED", "ACTIVE", "COMPLETED"])("accepts an agreement in status %s", (status) => {
        expect((0, rule_evaluation_1.isAgreementActiveForPayment)(status)).toBe(true);
    });
    it.each(["DRAFT", "PENDING_APPROVAL", "CANCELLED", "REJECTED"])("rejects an agreement in status %s", (status) => {
        expect((0, rule_evaluation_1.isAgreementActiveForPayment)(status)).toBe(false);
    });
});
//# sourceMappingURL=rule-evaluation.spec.js.map