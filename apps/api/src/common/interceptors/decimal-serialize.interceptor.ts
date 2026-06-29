import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
// Prisma hydrates Decimal-typed columns as instances of this decimal.js class,
// whose toJSON serializes to a string — see the note in intercept() below.
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Normalizes Prisma `Decimal` fields to JS numbers in HTTP responses.
 *
 * Prisma hydrates Decimal columns as decimal.js `Decimal` instances, and
 * decimal.js-light sets `Decimal.prototype.toJSON = toString`, so the API
 * returns monetary amounts as JSON **strings** (e.g. `"250000"`) instead of
 * numbers. That breaks every frontend sum/reduce (`"0" + "250000" === "025000"`)
 * and forces `Number()` coercion at each call site — which is easy to forget and
 * silently corrupts dashboards. This interceptor walks the response body and
 * converts Decimal instances to numbers before JSON serialization, so the wire
 * format matches Int/Float fields and the frontend can compute on them directly.
 *
 * Safe for this domain: amounts are in pesos and stay well below
 * `Number.MAX_SAFE_INTEGER` (~9e15); Decimal is still used for storage precision,
 * only the wire format is normalized. `null`/`undefined` pass through unchanged.
 */
@Injectable()
export class DecimalSerializeInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data) => this.coerceDecimals(data)));
  }

  private coerceDecimals(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }
    if (value instanceof Decimal) {
      return value.toNumber();
    }
    if (Array.isArray(value)) {
      return value.map((v) => this.coerceDecimals(v));
    }
    // Preserve types that are objects but must not be recursed into.
    if (value instanceof Date || value instanceof Buffer) {
      return value;
    }
    if (typeof value === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        out[k] = this.coerceDecimals(v);
      }
      return out;
    }
    return value;
  }
}
