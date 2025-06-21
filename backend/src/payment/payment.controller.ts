import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async pay(@Body() paymentData: PaymentDto) {
    return this.paymentService.processFinansbankPayment(paymentData);
  }
}
