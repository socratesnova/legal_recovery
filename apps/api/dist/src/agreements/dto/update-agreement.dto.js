"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAgreementDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_agreement_dto_1 = require("./create-agreement.dto");
class UpdateAgreementDto extends (0, swagger_1.PartialType)(create_agreement_dto_1.CreateAgreementDto) {
}
exports.UpdateAgreementDto = UpdateAgreementDto;
//# sourceMappingURL=update-agreement.dto.js.map