export declare class CreateDisputeDto {
    caseId: string;
    reason: string;
    description?: string;
}
export declare class ResolveDisputeDto {
    resolution?: string;
}
export declare class UpdateDisputeDto {
    description?: string;
    resolution?: string;
}
