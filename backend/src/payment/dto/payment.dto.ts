export class PaymentDto {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  amount: number;
  orderDetails: any; // This will contain the order details from the cart
} 