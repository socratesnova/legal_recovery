import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "../prisma.service";
export declare class AuditInterceptor implements NestInterceptor {
    private readonly prisma;
    constructor(prisma: PrismaService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
    private isMutating;
    private mapMethodToAction;
    private extractEntityType;
    private toPascalCase;
    private captureSnapshot;
    private extractIp;
    private stringifyIfNeeded;
}
