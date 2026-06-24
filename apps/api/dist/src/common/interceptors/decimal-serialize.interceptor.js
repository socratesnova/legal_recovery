"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecimalSerializeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const library_1 = require("@prisma/client/runtime/library");
let DecimalSerializeInterceptor = class DecimalSerializeInterceptor {
    intercept(_context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => this.coerceDecimals(data)));
    }
    coerceDecimals(value) {
        if (value === null || value === undefined) {
            return value;
        }
        if (value instanceof library_1.Decimal) {
            return value.toNumber();
        }
        if (Array.isArray(value)) {
            return value.map((v) => this.coerceDecimals(v));
        }
        if (value instanceof Date || value instanceof Buffer) {
            return value;
        }
        if (typeof value === "object") {
            const out = {};
            for (const [k, v] of Object.entries(value)) {
                out[k] = this.coerceDecimals(v);
            }
            return out;
        }
        return value;
    }
};
exports.DecimalSerializeInterceptor = DecimalSerializeInterceptor;
exports.DecimalSerializeInterceptor = DecimalSerializeInterceptor = __decorate([
    (0, common_1.Injectable)()
], DecimalSerializeInterceptor);
//# sourceMappingURL=decimal-serialize.interceptor.js.map