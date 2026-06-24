"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = exports.Role = void 0;
const common_1 = require("@nestjs/common");
var current_user_decorator_1 = require("./current-user.decorator");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return current_user_decorator_1.UserRole; } });
exports.ROLES_KEY = "roles";
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map