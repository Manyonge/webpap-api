import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsService } from './payments/payments.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), PaymentsModule, HttpModule],
  controllers: [AppController, PaymentsController],
  providers: [AppService, PaymentsService],
})
export class AppModule {}
