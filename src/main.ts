import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:3000', 'https://glittering-longma-fbadb7.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 정적 파일 서빙 설정
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'public'));

  // 전역 유효성 검사 파이프 설정
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // DTO에 정의되지 않은 속성은 제거
    forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 요청 자체를 막음
    transform: true,            // 요청 데이터를 DTO 클래스의 인스턴스로 변환
  }));

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS로 구현한 사용자 및 주문 관리 API')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
