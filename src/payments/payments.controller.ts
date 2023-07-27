import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('process')
  processPayment(
    @Body() customer: { customerPhone: 'string'; amount: number },
  ) {
    return this.paymentsService.processPayment(customer);
  }
}
