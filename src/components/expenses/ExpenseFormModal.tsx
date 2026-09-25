import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  Repeat,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import type { Expense, Category, PaymentMethodType } from '../../types/expense';
import { PAYMENT_METHODS } from '../../constants/paymentMethods';
import { formatVND, parseVND } from '../../utils/currency';
import { getTodayString } from '../../utils/date';
import { CategoryIcon } from '../common/CategoryIcon';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: Omit<Expense, 'id' | 'createdAt'>) => void;
  initialData?: Expense | null;
  categories: Category[];
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}) => {
  const [rawAmount, setRawAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash');
  const [note, setNote] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringPeriod, setRecurringPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setRawAmount(initialData.amount ? initialData.amount.toString() : '');
      setCategoryId(initialData.categoryId);
      setDate(initialData.date);
      setPaymentMethod(initialData.paymentMethod);
      setNote(initialData.note || '');
      setIsRecurring(Boolean(initialData.isRecurring));
      setRecurringPeriod(initialData.recurringPeriod || 'monthly');
      setReceiptImage(initialData.receiptImage);
    } else {
      setRawAmount('');
      setCategoryId(categories[0]?.id || '');
      setDate(getTodayString());
      setPaymentMethod('cash');
      setNote('');
      setIsRecurring(false);
      setRecurringPeriod('monthly');
      setReceiptImage(undefined);
    }
    setError('');
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  const numericAmount = parseVND(rawAmount);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, '');
    setRawAmount(val);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước ảnh tối đa 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setError('Vui lòng nhập số tiền chi lớn hơn 0');
      return;
    }
    if (!categoryId) {
      setError('Vui lòng chọn danh mục chi tiêu');
      return;
    }
    if (!date) {
      setError('Vui lòng chọn ngày chi');
      return;
    }

    onSave({
      amount: numericAmount,
      categoryId,
      date,
      paymentMethod,
      note: note.trim(),
      isRecurring,
      recurringPeriod: isRecurring ? recurringPeriod : undefined,
      receiptImage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-y-auto flex flex-col animate-slide-up sm:animate-none pb-safe"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              {initialData ? <Save size={17} /> : <Plus size={17} />}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {initialData ? 'Chỉnh Sửa Khoản Chi' : 'Ghi Khoản Chi Mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Số tiền chi (VND) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="0"
                value={rawAmount ? Number(rawAmount).toLocaleString('vi-VN') : ''}
                onChange={handleAmountChange}
                className="w-full text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 tracking-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                VND
              </span>
            </div>
            {numericAmount > 0 && (
              <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 text-right">
                Định dạng: {formatVND(numericAmount)}
              </p>
            )}
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Danh mục chi tiêu <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 max-h-40 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgLight }}
                    >
                      <CategoryIcon name={cat.icon} size={13} color={cat.color} />
                    </div>
                    <span className="truncate text-[11px] sm:text-xs">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method Row */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Ngày chi <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Phương thức
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Ghi chú / Diễn giải
            </label>
            <input
              type="text"
              placeholder="VD: Cà phê sáng với nhóm bạn, Ăn trưa..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 sm:py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Recurring Expense Checkbox */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <Repeat size={15} className="text-slate-500" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Khoản chi định kỳ
                </span>
                <p className="text-[10px] text-slate-400">
                  Lặp lại cố định hàng tháng/tuần
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isRecurring && (
                <select
                  value={recurringPeriod}
                  onChange={(e) => setRecurringPeriod(e.target.value as any)}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs py-1 px-1.5"
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              )}
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
            </div>
          </div>

          {/* Receipt Image Upload */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Ảnh hóa đơn / Biên lai (Tùy chọn)
            </label>
            {receiptImage ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                <img
                  src={receiptImage}
                  alt="Receipt"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setReceiptImage(undefined)}
                  className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs text-slate-500 transition-colors">
                <ImageIcon size={15} />
                <span>Chụp / Tải ảnh hóa đơn</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Save size={15} />
              <span>{initialData ? 'Lưu thay đổi' : 'Lưu khoản chi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
