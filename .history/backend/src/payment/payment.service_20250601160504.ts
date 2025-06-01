import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async processPayment(paymentData: any): Promise<{ success: boolean; message: string; order?: any; data?: any }> {
    // 1. Ödeme işlemini banka ile simüle et
    const paymentResult = await this.processFinansbankPayment(paymentData);
    if (paymentResult.status) {
      // 2. Siparişi kaydet
      const orderDto: CreateOrderDto = paymentData.orderDetails;
      const order = await this.ordersService.create(orderDto);
      return { success: true, message: 'Ödeme başarılı, sipariş oluşturuldu', order, data: paymentResult.data };
    } else {
      return { success: false, message: paymentResult.message, data: paymentResult.data };
    }
  }

  private async processFinansbankPayment(paymentData: any): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const MbrId = '5';
      const MerchantID = '087800000026740';
      const UserCode = 'ohbturadmin1';
      const UserPass = '312935';
      const OrderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const SecureType = 'NonSecure';
      const TxnType = 'Auth';
      const PurchAmount = paymentData.amount?.toFixed(2) || '0.00';
      const Currency = '949';
      const Lang = 'TR';
      const MOTO = '0';

      // Expiry bilgisini ayır
      let expiryMonth = '';
      let expiryYear = '';
      if (paymentData.expiry) {
        const [month, year] = paymentData.expiry.split('/');
        expiryMonth = month;
        expiryYear = year;
      }

      const data = new URLSearchParams({
        MbrId,
        MerchantID,
        UserCode,
        UserPass,
        OrderId,
        SecureType,
        TxnType,
        PurchAmount,
        Currency,
        Pan: paymentData.cardNumber,
        Expiry: `${expiryMonth}${expiryYear?.slice(-2)}`,
        Cvv2: paymentData.cvv,
        MOTO,
        Lang,
      }).toString();

      const response = await axios.post(
        'https://vpostest.qnb.com.tr/Gateway/Default.aspx',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const resultValues = response.data.split(';;');
      const result = resultValues.reduce((acc: Record<string, string>, value: string) => {
        const [key, val] = value.split('=');
        if (key && val) {
          acc[key] = val;
        }
        return acc;
      }, {});

      if (result.ProcReturnCode === '00') {
        return {
          status: true,
          message: 'Payment successful',
          data: {
            orderId: OrderId,
            transactionId: result.TransId,
            amount: PurchAmount,
          },
        };
      }

      return {
        status: false,
        message: result.ErrMsg || 'Payment failed',
        data: {
          orderId: OrderId,
          errorCode: result.ProcReturnCode,
          errorMessage: result.ErrMsg,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Payment failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}
