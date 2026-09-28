import React from 'react';
import {
  Share,
  Download,
  X,
  Menu,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  isSamsungBrowser: boolean;
  onNativeInstall?: () => void;
  canPromptNative: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  isSamsungBrowser,
  onNativeInstall,
  canPromptNative,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        {/* Header with App Logo */}
        <div className="flex items-center gap-3.5 mb-5">
          <img
            src="/icon-192.png"
            alt="SpendWise Icon"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl shadow-md shadow-emerald-500/25 border border-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Cài đặt SpendWise
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dùng như ứng dụng gốc, mượt mà & toàn màn hình
            </p>
          </div>
        </div>

        {/* Primary Action Button (If Browser allows Native Trigger) */}
        {canPromptNative && (
          <div className="mb-5">
            <button
              onClick={() => {
                onNativeInstall?.();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 active:scale-98 transition-all"
            >
              <Download size={18} className="stroke-[2.5]" />
              <span>Tải & Cài Đặt Ngay</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-1.5">
              Bấm để mở hộp thoại cài đặt của hệ thống
            </p>
          </div>
        )}

        {/* Step-by-Step Instructions based on Browser/Device */}
        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wide">
            <Sparkles size={14} className="text-emerald-500" />
            <span>Hướng dẫn cài đặt chi tiết</span>
          </div>

          {/* Samsung Internet Guide */}
          {isSamsungBrowser && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  S
                </span>
                <span>Trên trình duyệt Samsung Internet:</span>
              </div>
              <ul className="space-y-2 pl-1.5">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">1.</span>
                  <span>
                    Nhấn vào biểu tượng <strong>Menu 3 gạch (≡)</strong> ở góc dưới bên phải màn hình.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">2.</span>
                  <span>
                    Chọn <strong>"Thêm trang vào"</strong> (Add page to).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">3.</span>
                  <span>
                    Chọn <strong>"Màn hình ứng dụng"</strong> hoặc <strong>"Màn hình chờ"</strong> (Home screen).
                  </span>
                </li>
              </ul>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-xl border border-emerald-200/50 dark:border-emerald-900/50 mt-2">
                💡 <em>Mẹo:</em> Ở thanh địa chỉ (URL) trên cùng, Samsung Internet cũng có biểu tượng <strong>mũi tên tải xuống (↓)</strong> để cài app trong 1 chạm!
              </div>
            </div>
          )}

          {/* iOS Safari Guide */}
          {isIOS && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share size={15} className="text-blue-500" />
                <span>Trên iPhone / iPad (Safari):</span>
              </div>
              <ul className="space-y-2 pl-1.5">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">1.</span>
                  <span>
                    Nhấn nút <strong>Chia sẻ</strong> (biểu tượng ô vuông mũi tên hướng lên <Share size={13} className="inline text-blue-500" />) ở thanh công cụ dưới cùng của Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">2.</span>
                  <span>
                    Cuộn xuống danh sách và chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">3.</span>
                  <span>
                    Nhấn <strong>"Thêm"</strong> (Add) ở góc trên bên phải để hoàn tất.
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Standard Chrome / Android Guide (If not iOS and not Samsung) */}
          {!isIOS && !isSamsungBrowser && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Menu size={15} className="text-emerald-500" />
                <span>Trên Chrome / Trình duyệt khác:</span>
              </div>
              <ul className="space-y-2 pl-1.5">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">1.</span>
                  <span>
                    Nhấn biểu tượng <strong>Menu 3 chấm (⋮)</strong> ở góc trên bên phải trình duyệt.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">2.</span>
                  <span>
                    Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">3.</span>
                  <span>
                    Xác nhận <strong>"Cài đặt"</strong> để biểu tượng SpendWise xuất hiện trong danh sách app.
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Key Advantages */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              <span>Không chiếm dung lượng</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              <span>Đồng bộ Cloud tức thì</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              <span>Không có thanh địa chỉ</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              <span>Mở 1 chạm từ màn hình</span>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Đã hiểu, đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
