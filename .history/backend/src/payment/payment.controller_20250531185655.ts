import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async pay(@Body() paymentData: any) {
    return this.paymentService.processPayment(paymentData);
  }
}
