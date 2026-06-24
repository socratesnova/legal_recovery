import { CommStatus } from "@prisma/client";
export declare function mapProviderStatus(rawStatus: string): CommStatus | null;
export declare function shouldTransition(current: CommStatus, next: CommStatus): boolean;
