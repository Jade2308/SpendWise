import React from 'react';
import { CloudCheck, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import type { SyncState } from '../../hooks/useSupabaseSync';

interface SyncStatusBadgeProps {
  syncState: SyncState;
  lastSyncedTime: Date | null;
  onManualSync: () => void;
  errorMessage: string | null;
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  syncState,
  lastSyncedTime,
  onManualSync,
  errorMessage,
}) => {
  const getStatusDisplay = () => {
    switch (syncState) {
      case 'synced':
        return {
          icon: <CloudCheck size={15} className="text-emerald-500" />,
          label: 'Đã đồng bộ',
          textColor: 'text-emerald-700 dark:text-emerald-300',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
          dotColor: 'bg-emerald-500',
        };
      case 'syncing':
        return {
          icon: <RefreshCw size={14} className="text-amber-500 animate-spin" />,
          label: 'Đang đồng bộ...',
          textColor: 'text-amber-700 dark:text-amber-300',
          bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
          dotColor: 'bg-amber-500 animate-ping',
        };
      case 'offline':
        return {
          icon: <CloudOff size={14} className="text-slate-500" />,
          label: 'Ngoại tuyến (Offline)',
          textColor: 'text-slate-600 dark:text-slate-400',
          bgColor: 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
          dotColor: 'bg-slate-400',
        };
      case 'error':
        return {
          icon: <AlertCircle size={14} className="text-rose-500" />,
          label: 'Lỗi đồng bộ',
          textColor: 'text-rose-700 dark:text-rose-300',
          bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
          dotColor: 'bg-rose-500',
        };
    }
  };

  const status = getStatusDisplay();

  const formattedTime = lastSyncedTime
    ? `${lastSyncedTime.getHours().toString().padStart(2, '0')}:${lastSyncedTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${lastSyncedTime.getSeconds().toString().padStart(2, '0')}`
    : null;

  return (
    <button
      onClick={onManualSync}
      title={
        errorMessage
          ? `Lỗi: ${errorMessage}. Nhấn để thử lại`
          : formattedTime
          ? `Lần đồng bộ gần nhất: ${formattedTime}. Nhấn để đồng bộ ngay`
          : 'Nhấn để đồng bộ'
      }
      className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-xs active:scale-95 ${status.bgColor} ${status.textColor}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dotColor}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dotColor}`} />
      </span>
      {status.icon}
      <span className="hidden sm:inline font-semibold">{status.label}</span>
      {formattedTime && syncState === 'synced' && (
        <span className="text-[10px] opacity-75 hidden md:inline">({formattedTime})</span>
      )}
    </button>
  );
};
