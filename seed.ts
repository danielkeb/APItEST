import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { SeederModule } from './src/seeder/seeder.module';
import { SeederService } from './src/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seeder = app.get(SeederService);

  try {
    await seeder.seed();
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
