import { Module } from '@nestjs/common';
import { FraudModule } from './fraud/fraud.module';

@Module({
  imports: [
    FraudModule,
  ],
})
export class AppModule {}
