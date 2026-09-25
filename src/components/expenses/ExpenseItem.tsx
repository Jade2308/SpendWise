import React, { useState } from 'react';
import {
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Repeat,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import type { Expense, Category } from '../../types/expense';
import { formatVND } from '../../utils/currency';
import { PAYMENT_METHODS } from '../../constants/paymentMethods';
import { CategoryIcon } from '../common/CategoryIcon';

interface ExpenseItemProps {
  expense: Expense;
  category?: Category;
  onEdit: (expense: Expense) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  category,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const payment = PAYMENT_METHODS.find((p) => p.id === expense.paymentMethod);

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa khoản chi "${expense.note || category?.name}" này không?`)) {
      onDelete(expense.id);
    }
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-sm transition-all flex items-center justify-between gap-2.5">
        {/* Left: Category Icon & Details */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: category?.bgLight || '#f1f5f9' }}
          >
            <CategoryIcon
              name={category?.icon || 'Tag'}
              size={17}
              color={category?.color}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {expense.note || category?.name || 'Khoản chi không tên'}
              </h4>
              {expense.isRecurring && (
                <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Repeat size={9} />
                  <span>Định kỳ</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
              {/* Category pill */}
              <span
                className="px-1.5 sm:px-2 py-0.2 rounded-md font-semibold text-[10px]"
                style={{
                  backgroundColor: category?.bgLight || '#f1f5f9',
                  color: category?.color || '#64748b',
                }}
              >
                {category?.name || 'Chung'}
              </span>

              {/* Payment Method */}
              <span className="truncate">
                • {payment?.name || expense.paymentMethod}
              </span>

              {/* Receipt icon if available */}
              {expense.receiptImage && (
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold"
                  title="Xem hóa đơn"
                >
                  <ImageIcon size={11} />
                  <span>Hóa đơn</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Amount & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="text-right">
            <div className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 tracking-tight">
              -{formatVND(expense.amount)}
            </div>
          </div>

          {/* Desktop Hover Action Buttons */}
          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDuplicate(expense.id)}
              title="Nhân bản"
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => onEdit(expense)}
              title="Chỉnh sửa"
              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              title="Xóa"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Mobile Action Dropdown */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-30 text-xs sm:text-sm"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDuplicate(expense.id);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
                >
                  <Copy size={15} />
                  <span>Nhân bản</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(expense);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
                >
                  <Edit2 size={15} />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                >
                  <Trash2 size={15} />
                  <span>Xóa</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Image Lightbox Modal */}
      {showReceiptModal && expense.receiptImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2.5">
              <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                Hóa đơn: {expense.note || category?.name}
              </h5>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <img
              src={expense.receiptImage}
              alt="Hóa đơn"
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
