import React from 'react';
import type { PaymentStat } from '../../types/expense';
import { formatVND } from '../../utils/currency';
import { CreditCard, Landmark, Banknote, Smartphone, Wallet } from 'lucide-react';

interface PaymentMethodChartProps {
  paymentStats: PaymentStat[];
  totalSpend: number;
}

const METHOD_ICONS: Record<string, React.ReactNode> = {
  cash: <Banknote size={16} className="text-emerald-500" />,
  bank_transfer: <Landmark size={16} className="text-blue-500" />,
  credit_card: <CreditCard size={16} className="text-purple-500" />,
  debit_card: <Wallet size={16} className="text-indigo-500" />,
  e_wallet: <Smartphone size={16} className="text-rose-500" />,
};

const METHOD_COLORS: Record<string, string> = {
  cash: '#10b981',
  bank_transfer: '#3b82f6',
  credit_card: '#a855f7',
  debit_card: '#6366f1',
  e_wallet: '#f43f5e',
};

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({
  paymentStats,
  totalSpend,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CreditCard size={18} />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Phương Thức Thanh Toán
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Tỷ trọng dùng Tiền mặt, Thẻ tín dụng và Ví điện tử
          </p>
        </div>
      </div>

      {/* Multi-segment stacked bar */}
      {totalSpend > 0 && (
        <div className="w-full h-2.5 sm:h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 mb-4 sm:mb-5">
          {paymentStats.map((item) => {
            if (item.percentage <= 0) return null;
            return (
              <div
                key={item.method}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: METHOD_COLORS[item.method] || '#94a3b8',
                }}
                className="h-full transition-all duration-500"
                title={`${item.name}: ${item.percentage}% (${formatVND(item.totalAmount)})`}
              />
            );
          })}
        </div>
      )}

      {/* Detail list */}
      <div className="space-y-2 sm:space-y-3">
        {paymentStats.map((item) => {
          return (
            <div
              key={item.method}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {METHOD_ICONS[item.method] || <CreditCard size={15} />}
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400">
                    {item.count} lần
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">
                  {formatVND(item.totalAmount)}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {item.percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
