import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsGateway } from './payments.gateway';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsGateway],
})
export class PaymentsModule {}
