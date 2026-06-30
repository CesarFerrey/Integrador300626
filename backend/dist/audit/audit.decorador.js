"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audit = void 0;
const common_1 = require("@nestjs/common");
const Audit = (entityName, action) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('entityName', entityName), (0, common_1.SetMetadata)('action', action));
};
exports.Audit = Audit;
//# sourceMappingURL=audit.decorador.js.map