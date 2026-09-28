import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface InstallAppBannerProps {
  onInstall: () => void;
  isInstalled: boolean;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({
  onInstall,
  isInstalled,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(true);

  useEffect(() => {
    // Only show if not installed and not dismissed in this session
    if (!isInstalled) {
      const dismissed = sessionStorage.getItem('spendwise-install-dismissed');
      if (!dismissed) {
        setIsDismissed(false);
      }
    }
  }, [isInstalled]);

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('spendwise-install-dismissed', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <aside
      aria-label="Cài đặt ứng dụng SpendWise"
      className="fixed bottom-[74px] md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:max-w-sm z-40 animate-slideUp"
    >
      <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 border border-emerald-500/30 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/icon-192.png"
            alt="SpendWise"
            className="w-10 h-10 rounded-xl shadow-md shrink-0 border border-emerald-500/40"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white truncate">
                Cài SpendWise
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 uppercase">
                App
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              Mở 1 chạm & dùng như app gốc
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-600 active:scale-95 transition-all"
          >
            <Download size={13} className="stroke-[2.5]" />
            <span>Tải ngay</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
