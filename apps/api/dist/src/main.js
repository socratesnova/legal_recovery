"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const app_module_1 = require("./app.module");
const audit_interceptor_1 = require("./common/interceptors/audit.interceptor");
const decimal_serialize_interceptor_1 = require("./common/interceptors/decimal-serialize.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ["error", "warn", "log", "debug"],
    });
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.enableCors({
        origin: process.env.WEB_URL?.split(",") || ["http://localhost:3000"],
        credentials: true,
    });
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalInterceptors(app.get(decimal_serialize_interceptor_1.DecimalSerializeInterceptor), app.get(audit_interceptor_1.AuditInterceptor));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Legal Recovery OS API")
        .setDescription("API for legal debt recovery platform")
        .setVersion("1.0.0")
        .addBearerAuth()
        .addTag("Auth")
        .addTag("Users")
        .addTag("Institutions")
        .addTag("Portfolios")
        .addTag("Cases")
        .addTag("Documents")
        .addTag("DataPassports")
        .addTag("Contacts")
        .addTag("Scores")
        .addTag("Agreements")
        .addTag("Payments")
        .addTag("Disputes")
        .addTag("Communications")
        .addTag("Reports")
        .addTag("Audit")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, document);
    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`API running on http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map