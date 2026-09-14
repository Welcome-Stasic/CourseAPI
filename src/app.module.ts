import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { CoursesModule } from './Presentation/courses/courses.module.js';
import { DBModule } from './Infrastructure/db/database.module.js';
import { AuthModule } from './Presentation/auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DBModule,
    AuthModule,
    CoursesModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
