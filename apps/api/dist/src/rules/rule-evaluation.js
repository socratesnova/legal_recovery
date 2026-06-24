"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRules = mergeRules;
exports.validateAgreementAgainstRules = validateAgreementAgainstRules;
exports.isAgreementActiveForPayment = isAgreementActiveForPayment;
const PAYMENT_ELIGIBLE_STATUSES = new Set(["APPROVED", "ACTIVE", "COMPLETED"]);
function minDefined(...vals) {
    const defined = vals.filter((v) => v != null);
    return defined.length ? Math.min(...defined) : null;
}
function maxDefined(...vals) {
    const defined = vals.filter((v) => v != null);
    return defined.length ? Math.max(...defined) : null;
}
function mergeRules(institution, portfolio) {
    const inst = institution ?? {
        maxDiscountAuto: null,
        maxDiscountManual: null,
        minInstallments: null,
        maxInstallments: null,
        autoApprovalLimit: null,
    };
    const port = portfolio ?? {
        discountMax: null,
        minInstallments: null,
        maxInstallments: null,
        autoApprovalLimit: null,
        channelsAllowed: null,
    };
    return {
        discountHardMax: minDefined(inst.maxDiscountManual, port.discountMax),
        discountAutoMax: inst.maxDiscountAuto != null
            ? minDefined(inst.maxDiscountAuto, port.discountMax)
            : null,
        minInstallments: maxDefined(inst.minInstallments, port.minInstallments),
        maxInstallments: minDefined(inst.maxInstallments, port.maxInstallments),
        autoApprovalLimit: minDefined(inst.autoApprovalLimit, port.autoApprovalLimit),
        channelsAllowed: port.channelsAllowed && port.channelsAllowed.length > 0
            ? port.channelsAllowed
            : null,
    };
}
function validateAgreementAgainstRules(input, rules) {
    const violations = [];
    if (input.discountPercentage != null) {
        if (rules.discountHardMax != null &&
            input.discountPercentage > rules.discountHardMax) {
            violations.push({
                code: "DISCOUNT_EXCEEDS_MAX",
                message: `Discount of ${input.discountPercentage}% exceeds the allowed maximum of ${rules.discountHardMax}%`,
            });
        }
    }
    if (input.installments != null) {
        if (rules.minInstallments != null &&
            input.installments < rules.minInstallments) {
            violations.push({
                code: "INSTALLMENTS_BELOW_MIN",
                message: `Installments of ${input.installments} are below the minimum of ${rules.minInstallments}`,
            });
        }
        if (rules.maxInstallments != null &&
            input.installments > rules.maxInstallments) {
            violations.push({
                code: "INSTALLMENTS_ABOVE_MAX",
                message: `Installments of ${input.installments} exceed the maximum of ${rules.maxInstallments}`,
            });
        }
    }
    const discountAutoOk = input.discountPercentage == null ||
        (rules.discountAutoMax != null &&
            input.discountPercentage <= rules.discountAutoMax);
    const amountOk = rules.autoApprovalLimit != null && input.amount <= rules.autoApprovalLimit;
    const autoApproved = violations.length === 0 && discountAutoOk && amountOk;
    return { ok: violations.length === 0, violations, autoApproved };
}
function isAgreementActiveForPayment(status) {
    return PAYMENT_ELIGIBLE_STATUSES.has(status);
}
//# sourceMappingURL=rule-evaluation.js.map