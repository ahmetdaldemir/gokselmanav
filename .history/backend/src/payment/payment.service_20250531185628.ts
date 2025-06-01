import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async processPayment(paymentData: any): Promise<{ success: boolean; message: string; order?: any }> {
    // 1. Ödeme işlemini simüle et (örneğin her zaman başarılı kabul edelim)
    const paymentSuccess = true; // burada gerçek banka entegrasyonu olacak

    if (paymentSuccess) {
      // 2. Siparişi kaydet
      const orderDto: CreateOrderDto = paymentData.orderDetails;
      const order = await this.ordersService.create(orderDto);
      return { success: true, message: 'Ödeme başarılı, sipariş oluşturuldu', order };
    } else {
      return { success: false, message: 'Ödeme başarısız' };
    }
  }
}
