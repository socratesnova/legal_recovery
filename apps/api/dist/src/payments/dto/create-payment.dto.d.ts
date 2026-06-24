import { PaymentMethod, PaymentStatus } from "@prisma/client";
export declare class CreatePaymentDto {
    caseId: string;
    institutionId: string;
    agreementId?: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    receiptPath?: string;
    status?: PaymentStatus;
}
