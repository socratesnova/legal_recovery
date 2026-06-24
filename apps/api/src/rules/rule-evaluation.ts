/**
 * Pure institution/portfolio rule evaluation — decoupled from Prisma so it can
 * be unit-tested directly (same pattern as {@link computeScores}).
 *
 * Rules live in two places and are merged into the most restrictive effective
 * set before any agreement is created/approved:
 *   - {@link Institution}  (institution-wide caps: maxDiscountAuto/Manual,
 *     min/maxInstallments, autoApprovalLimit)
 *   - {@link PortfolioRule} (per-portfolio narrowing: discountMax,
 *     min/maxInstallments, autoApprovalLimit, channelsAllowed)
 *
 * Semantics:
 *   - discountHardMax  = absolute discount cap; a discount above it is rejected.
 *   - discountAutoMax  = discount cap eligible for AUTO-approval. Requires
 *     `maxDiscountAuto` to be configured; without it discounts always need
 *     manual approval (human-in-the-loop, business rule #5).
 *   - autoApprovalLimit = amount cap for auto-approval. When not configured,
 *     nothing auto-approves (every agreement needs a human).
 *   - channelsAllowed  = communication channels permitted for the portfolio.
 *     Not enforced here — consumed by the Legal Firewall / communications flow.
 */

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

export type RuleViolationCode =
  | "DISCOUNT_EXCEEDS_MAX"
  | "INSTALLMENTS_BELOW_MIN"
  | "INSTALLMENTS_ABOVE_MAX";

export interface RuleViolation {
  code: RuleViolationCode;
  message: string;
}

export interface AgreementRuleValidation {
  ok: boolean;
  violations: RuleViolation[];
  /** True when the agreement may be auto-approved (within auto caps and no violations). */
  autoApproved: boolean;
}

/** Agreement statuses that may receive payments. */
const PAYMENT_ELIGIBLE_STATUSES = new Set(["APPROVED", "ACTIVE", "COMPLETED"]);

/** Smallest defined value among the inputs, or null when none are defined. */
function minDefined(...vals: (number | null | undefined)[]): number | null {
  const defined = vals.filter((v): v is number => v != null);
  return defined.length ? Math.min(...defined) : null;
}

/** Largest defined value among the inputs, or null when none are defined. */
function maxDefined(...vals: (number | null | undefined)[]): number | null {
  const defined = vals.filter((v): v is number => v != null);
  return defined.length ? Math.max(...defined) : null;
}

/**
 * Merge institution-wide and portfolio-level rules into the most restrictive
 * effective set. A `null` result for a field means "not configured / not enforced".
 */
export function mergeRules(
  institution: InstitutionRules | null,
  portfolio: PortfolioRules | null,
): EffectiveRules {
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
    // Absolute cap: most restrictive of the manual cap and the portfolio cap.
    discountHardMax: minDefined(inst.maxDiscountManual, port.discountMax),
    // Auto cap: only when maxDiscountAuto is configured, narrowed by the portfolio cap.
    discountAutoMax:
      inst.maxDiscountAuto != null
        ? minDefined(inst.maxDiscountAuto, port.discountMax)
        : null,
    // Installments floor is the LARGEST minimum; ceiling is the SMALLEST maximum.
    minInstallments: maxDefined(inst.minInstallments, port.minInstallments),
    maxInstallments: minDefined(inst.maxInstallments, port.maxInstallments),
    autoApprovalLimit: minDefined(
      inst.autoApprovalLimit,
      port.autoApprovalLimit,
    ),
    channelsAllowed:
      port.channelsAllowed && port.channelsAllowed.length > 0
        ? port.channelsAllowed
        : null,
  };
}

/**
 * Validate an agreement draft against the effective rules. Returns the list of
 * violations (empty when ok) and whether the agreement may be auto-approved.
 *
 * - Discount above `discountHardMax` (when configured) is a hard violation.
 * - Installments outside `[minInstallments, maxInstallments]` (when configured)
 *   are hard violations.
 * - Auto-approval requires a configured `autoApprovalLimit` AND a discount
 *   within `discountAutoMax` (or no discount) AND no hard violations.
 */
export function validateAgreementAgainstRules(
  input: AgreementRuleInput,
  rules: EffectiveRules,
): AgreementRuleValidation {
  const violations: RuleViolation[] = [];

  if (input.discountPercentage != null) {
    if (
      rules.discountHardMax != null &&
      input.discountPercentage > rules.discountHardMax
    ) {
      violations.push({
        code: "DISCOUNT_EXCEEDS_MAX",
        message: `Discount of ${input.discountPercentage}% exceeds the allowed maximum of ${rules.discountHardMax}%`,
      });
    }
  }

  if (input.installments != null) {
    if (
      rules.minInstallments != null &&
      input.installments < rules.minInstallments
    ) {
      violations.push({
        code: "INSTALLMENTS_BELOW_MIN",
        message: `Installments of ${input.installments} are below the minimum of ${rules.minInstallments}`,
      });
    }
    if (
      rules.maxInstallments != null &&
      input.installments > rules.maxInstallments
    ) {
      violations.push({
        code: "INSTALLMENTS_ABOVE_MAX",
        message: `Installments of ${input.installments} exceed the maximum of ${rules.maxInstallments}`,
      });
    }
  }

  // Auto-approval: only when an amount limit is configured, the discount is
  // auto-eligible (none, or within the auto cap), and there are no violations.
  const discountAutoOk =
    input.discountPercentage == null ||
    (rules.discountAutoMax != null &&
      input.discountPercentage <= rules.discountAutoMax);
  const amountOk =
    rules.autoApprovalLimit != null && input.amount <= rules.autoApprovalLimit;
  const autoApproved = violations.length === 0 && discountAutoOk && amountOk;

  return { ok: violations.length === 0, violations, autoApproved };
}

/**
 * Whether a payment may be registered against an agreement in the given status.
 * Payments are only accepted against approved/active/completed agreements —
 * never against drafts or pending/rejected/cancelled ones.
 */
export function isAgreementActiveForPayment(status: string): boolean {
  return PAYMENT_ELIGIBLE_STATUSES.has(status);
}
