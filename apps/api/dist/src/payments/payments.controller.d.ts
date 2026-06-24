import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(caseId: string | undefined, user: AuthenticatedUser): Promise<({
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
        agreement: {
            id: string;
            type: import("@prisma/client").$Enums.AgreementType;
        };
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        agreementId: string | null;
        method: import("@prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        receiptPath: string | null;
        reconciledAt: Date | null;
        reconciledBy: string | null;
    })[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
        agreement: {
            id: string;
            type: import("@prisma/client").$Enums.AgreementType;
        };
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        agreementId: string | null;
        method: import("@prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        receiptPath: string | null;
        reconciledAt: Date | null;
        reconciledBy: string | null;
    }>;
    create(data: CreatePaymentDto, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
        agreement: {
            id: string;
            type: import("@prisma/client").$Enums.AgreementType;
        };
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        agreementId: string | null;
        method: import("@prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        receiptPath: string | null;
        reconciledAt: Date | null;
        reconciledBy: string | null;
    }>;
    update(id: string, data: UpdatePaymentDto, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
        agreement: {
            id: string;
            type: import("@prisma/client").$Enums.AgreementType;
        };
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        agreementId: string | null;
        method: import("@prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        receiptPath: string | null;
        reconciledAt: Date | null;
        reconciledBy: string | null;
    }>;
    reconcile(id: string, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        agreementId: string | null;
        method: import("@prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        receiptPath: string | null;
        reconciledAt: Date | null;
        reconciledBy: string | null;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        institutionId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        agreementId: string | null;
        method: import("@prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        receiptPath: string | null;
        reconciledAt: Date | null;
        reconciledBy: string | null;
    }>;
}
