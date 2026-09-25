import React, { useState } from 'react';
import {
  Download,
  Upload,
  Sparkles,
  Trash2,
  ShieldCheck,
  Plus,
  Check,
} from 'lucide-react';
import { useExpenseStore } from '../../store/useExpenseStore';
import { exportExpensesToCSV } from '../../utils/exportExcel';
import { CategoryIcon } from '../common/CategoryIcon';

const PRESET_COLORS = [
  '#10b981', // Emerald primary
  '#059669', // Deep emerald
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#3b82f6', // Blue
  '#eab308', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#64748b', // Slate
  '#6366f1', // Indigo
];

const PRESET_ICONS = [
  'Utensils',
  'Home',
  'Car',
  'ShoppingBag',
  'Film',
  'HeartPulse',
  'GraduationCap',
  'Users',
  'Gift',
  'Coffee',
  'Plane',
  'Smartphone',
  'Banknote',
  'CreditCard',
  'Wallet',
  'Tag',
];

export const DataBackupModal: React.FC = () => {
  const {
    expenses,
    categories,
    monthlyBudget,
    loadMockData,
    importExpenses,
    clearAllData,
    addCategory,
    deleteCategory,
  } = useExpenseStore();

  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(PRESET_COLORS[0]);
  const [newCatIcon, setNewCatIcon] = useState(PRESET_ICONS[0]);
  const [showAddCat, setShowAddCat] = useState(false);

  // Export JSON backup
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      expenses,
      categories,
      monthlyBudget,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `SpendWise_Backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed.expenses)) {
            importExpenses(parsed.expenses);
            alert(`Đã nhập thành công ${parsed.expenses.length} khoản chi!`);
          } else {
            alert('File sao lưu không đúng định dạng!');
          }
        } catch {
          alert('Lỗi khi đọc file JSON!');
        }
      };
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      icon: newCatIcon,
      color: newCatColor,
      bgLight: `${newCatColor}20`,
    });

    setNewCatName('');
    setShowAddCat(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      {/* Privacy & Offline Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-600/10 border border-emerald-200/80 dark:border-emerald-900/60 p-4 sm:p-5 rounded-3xl flex items-start gap-3 sm:gap-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/25">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            Bảo Mật Tuyệt Đối & Lưu Trữ Trên Máy (Offline)
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            SpendWise lưu trữ 100% dữ liệu chi tiêu trên điện thoại của bạn.
            Không có máy chủ trung gian thu thập dữ liệu cá nhân. Bạn có thể xuất Excel hoặc sao lưu JSON bất cứ lúc nào.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Data Backup & Export */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Sao Lưu & Xuất Dữ Liệu
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Xuất báo cáo sang Excel hoặc tạo bản sao lưu an toàn
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Export CSV / Excel */}
            <button
              onClick={() => exportExpensesToCSV(expenses, categories)}
              className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all text-xs text-left"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Download size={17} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs">
                    Xuất File Excel (CSV tiếng Việt)
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Chuẩn UTF-8 mở bằng Excel không lỗi font
                  </div>
                </div>
              </div>
              <span className="font-bold text-emerald-600 text-xs">Tải về</span>
            </button>

            {/* Export Full JSON */}
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition-all text-xs text-left"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Download size={17} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs">
                    Sao Lưu File JSON
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Lưu toàn bộ danh mục, hạn mức và lịch sử chi
                  </div>
                </div>
              </div>
              <span className="font-bold text-teal-600 text-xs">Sao lưu</span>
            </button>

            {/* Restore JSON */}
            <label className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all text-xs cursor-pointer">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Upload size={17} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs">
                    Phục Hồi Dữ Liệu JSON
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Nạp lại các giao dịch đã sao lưu
                  </div>
                </div>
              </div>
              <span className="font-bold text-emerald-600 text-xs">Chọn file</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick Demo & Reset Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <button
              onClick={() => {
                if (window.confirm('Nạp lại bộ dữ liệu 35+ giao dịch mẫu thực tế?')) {
                  loadMockData();
                  alert('Đã nạp dữ liệu mẫu thành công!');
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles size={14} />
              <span>Nạp Dữ Liệu Mẫu (35+ Giao Dịch)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('CẢNH BÁO: Hành động này sẽ xóa toàn bộ các khoản chi hiện có trên máy bạn!')) {
                  clearAllData();
                  alert('Đã xóa dữ liệu.');
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 size={14} />
              <span>Xóa Toàn Bộ Lịch Sử Chi Tiêu</span>
            </button>
          </div>
        </div>

        {/* Card 2: Custom Categories Management */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Danh Mục Chi Tiêu
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Tùy chỉnh nhóm chi tiêu ({categories.length} nhóm)
              </p>
            </div>

            <button
              onClick={() => setShowAddCat(!showAddCat)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              <Plus size={13} />
              <span>Thêm mới</span>
            </button>
          </div>

          {/* New Category Form */}
          {showAddCat && (
            <form
              onSubmit={handleCreateCategory}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 animate-fadeIn text-xs"
            >
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  placeholder="VD: Nuôi pet, Gym, Quà vặt..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  Màu sắc
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setNewCatColor(c)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: c }}
                    >
                      {newCatColor === c && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  Biểu tượng
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {PRESET_ICONS.map((iconName) => (
                    <button
                      type="button"
                      key={iconName}
                      onClick={() => setNewCatIcon(iconName)}
                      className={`p-1.5 rounded-lg border ${
                        newCatIcon === iconName
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <CategoryIcon name={iconName} size={14} color={newCatColor} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCat(false)}
                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 text-xs"
                >
                  Tạo nhóm
                </button>
              </div>
            </form>
          )}

          {/* Category List */}
          <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgLight }}
                    >
                      <CategoryIcon name={cat.icon} size={13} color={cat.color} />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">
                      {cat.name}
                    </span>
                  </div>

                  {cat.id.startsWith('cat-') && (
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Xóa danh mục này"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
