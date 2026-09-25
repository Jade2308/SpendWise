import type { PaymentMethodInfo } from '../types/expense';

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'cash',
    name: 'Tiền mặt',
    icon: 'Banknote',
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản NH',
    icon: 'Landmark',
  },
  {
    id: 'credit_card',
    name: 'Thẻ tín dụng',
    icon: 'CreditCard',
  },
  {
    id: 'debit_card',
    name: 'Thẻ ghi nợ / ATM',
    icon: 'Wallet',
  },
  {
    id: 'e_wallet',
    name: 'Ví điện tử (Momo/Zalo)',
    icon: 'Smartphone',
  },
];
