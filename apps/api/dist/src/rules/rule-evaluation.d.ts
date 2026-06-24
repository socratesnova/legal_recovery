export interface InstitutionRules {
    maxDiscountAuto: number | null;
    maxDiscountManual: number | null;
    minInstallments: number | null;
    maxInstallments: number | null;
    autoApprovalLimit: number | null;
}
export interface PortfolioRules {
    discountMax: number | null;
    minInstallments: number | null;
    maxInstallments: number | null;
    autoApprovalLimit: number | null;
    channelsAllowed: string[] | null;
}
export interface EffectiveRules {
    discountHardMax: number | null;
    discountAutoMax: number | null;
    minInstallments: number | null;
    maxInstallments: number | null;
    autoApprovalLimit: number | null;
    channelsAllowed: string[] | null;
}
export interface AgreementRuleInput {
    type: string;
    amount: number;
    discountPercentage?: number | null;
    installments?: number | null;
}
export interface PaymentRuleInput {
    method: string;
    amount: number;
}
export type RuleViolationCode = "DISCOUNT_EXCEEDS_MAX" | "INSTALLMENTS_BELOW_MIN" | "INSTALLMENTS_ABOVE_MAX";
export interface RuleViolation {
    code: RuleViolationCode;
    message: string;
}
export interface AgreementRuleValidation {
    ok: boolean;
    violations: RuleViolation[];
    autoApproved: boolean;
}
export declare function mergeRules(institution: InstitutionRules | null, portfolio: PortfolioRules | null): EffectiveRules;
export declare function validateAgreementAgainstRules(input: AgreementRuleInput, rules: EffectiveRules): AgreementRuleValidation;
export declare function isAgreementActiveForPayment(status: string): boolean;
