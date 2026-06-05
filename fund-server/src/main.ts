import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix("api");

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
      "https://your-frontend-domain.com",
      "https://funddefi-server.vercel.app/api/",
      "https://funddefi-server.vercel.app",
      // "*"
    ],
    // origin: "*",
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Crowdfunding 3.0 API")
    .setDescription("The Crowdfunding 3.0 API documentation")
    .setVersion("1.0")
    .addTag("campaigns")
    .addTag("users")
    .addTag("funding")
    .addTag("auth")
    .addTag("upload")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3001;

  try {
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(
      `📚 Swagger docs available at http://localhost:${port}/api/docs`,
    );
    console.log(`🚀 Server running on https://funddefi-server.vercel.app/api:${port}`);
    console.log(
      `📚 Swagger docs available at https://funddefi-server.vercel.app:${port}/api/docs`,
    );
  } catch (error: any) {
    if (error.code === "EADDRINUSE") {
      console.error(`❌ Port ${port} is already in use.`);
      console.error(`   Please run: npm run kill-port`);
      console.error(
        `   Or manually kill the process using: lsof -ti:${port} | xargs kill -9`,
      );
      process.exit(1);
    } else {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }
}

bootstrap();
