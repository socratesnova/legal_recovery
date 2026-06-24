import { PrismaService } from "../common/prisma.service";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export interface ScoreInput {
    status: string;
    totalBalance: number;
    hasIdNumber: boolean;
    documentCount: number;
    productCount: number;
    contactCount: number;
    activeDataPassportCount: number;
    channels: {
        phone: boolean;
        email: boolean;
        whatsappOptIn: boolean;
        address: boolean;
    };
    communicationConsent: boolean;
    paidAmount: number;
    activeAgreement: boolean;
    draftAgreement: boolean;
    activeDispute: boolean;
    pendingOrBrokenPromise: boolean;
}
export interface ScoreResult {
    scoreDocumental: number;
    scoreRecoverability: number;
    scoreContactability: number;
    scoreRisk: number;
    nextBestAction: string;
}
export declare function computeScores(input: ScoreInput): ScoreResult;
export declare class ScoringService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    scoreCase(caseId: string, user: AuthenticatedUser): Promise<ScoreResult & {
        caseId: string;
        computedAt: Date;
    }>;
    getScores(caseId: string, user: AuthenticatedUser): Promise<{
        caseId: string;
        scoreDocumental: any;
        scoreRecoverability: any;
        scoreContactability: any;
        scoreRisk: any;
        nextAction: any;
    }>;
    private loadCase;
    private toScoreInput;
}
