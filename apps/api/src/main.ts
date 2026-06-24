import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import compression from "compression";
import { AppModule } from "./app.module";
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";
import { DecimalSerializeInterceptor } from "./common/interceptors/decimal-serialize.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });

  // Security
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: process.env.WEB_URL?.split(",") || ["http://localhost:3000"],
    credentials: true,
  });

  // Global API prefix + URI version segment baked into controller paths
  // (e.g. @Controller("v1/auth")) -> routes serve at /api/v1/<resource>.
  // Nest's enableVersioning(URI) did not insert the version segment into the
  // Express routes in this stack, so the version is expressed in the
  // controller path instead — stable and explicit. A future v2 adds a
  // parallel set of "v2/..." controllers.
  app.setGlobalPrefix("api");

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Interceptors. DecimalSerializeInterceptor runs outermost so its
  // map() is applied last, normalizing Prisma Decimal → number on the final
  // response body (before it is JSON-serialized). AuditInterceptor taps for the
  // audit log and does not transform the body, so ordering between the two is
  // safe either way.
  app.useGlobalInterceptors(
    app.get(DecimalSerializeInterceptor),
    app.get(AuditInterceptor),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
