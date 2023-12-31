import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsGateway } from './payments/payments.gateway';

@Module({
  imports: [ConfigModule.forRoot(), PaymentsModule, HttpModule],
  controllers: [AppController, PaymentsController],
  providers: [AppService, PaymentsService, PaymentsGateway],
})
export class AppModule {}
