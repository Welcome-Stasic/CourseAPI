import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { CoursesModule } from './Presentation/courses/courses.module.js';
import { DBModule } from './Infrastructure/db/database.module.js';
import { AuthModule } from './Presentation/auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    DBModule,
    AuthModule,
    CoursesModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
