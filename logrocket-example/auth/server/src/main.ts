import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import 'dotenv/config';
import { Logger } from '@nestjs/common';

const port = process.env.PORT;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	Logger.log(`Server started running on http://localhost:${port}`, 'Bootstrap');
	await app.listen(port);
}
bootstrap();
