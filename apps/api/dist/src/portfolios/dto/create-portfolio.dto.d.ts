import { PortfolioType, PortfolioStatus } from "@prisma/client";
export declare class CreatePortfolioDto {
    name: string;
    institutionId: string;
    type: PortfolioType;
    totalAmount: number;
    currency?: string;
    fileSource?: string;
    uploadDate?: string;
    status?: PortfolioStatus;
}
