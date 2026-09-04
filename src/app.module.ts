import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { CoursesModule } from './Presentation/courses/courses.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [CoursesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
