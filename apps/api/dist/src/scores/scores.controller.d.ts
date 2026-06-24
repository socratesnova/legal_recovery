import { ScoringService } from "./scoring.service";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class ScoresController {
    private readonly scoringService;
    constructor(scoringService: ScoringService);
    score(caseId: string, user: AuthenticatedUser): Promise<import("./scoring.service").ScoreResult & {
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
}
