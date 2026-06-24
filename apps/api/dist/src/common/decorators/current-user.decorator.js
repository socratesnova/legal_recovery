"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentInstitution = exports.CurrentUser = exports.UserRole = void 0;
const common_1 = require("@nestjs/common");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SUPERVISOR"] = "SUPERVISOR";
    UserRole["GESTOR"] = "GESTOR";
    UserRole["ABOGADO"] = "ABOGADO";
    UserRole["COMPLIANCE"] = "COMPLIANCE";
    UserRole["BANCO"] = "BANCO";
    UserRole["DEUDOR"] = "DEUDOR";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
exports.CurrentInstitution = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.institutionId;
});
//# sourceMappingURL=current-user.decorator.js.map