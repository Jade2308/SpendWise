import type { Expense, Category, AnalyticsSummary } from '../types/expense';
import { PAYMENT_METHODS } from '../constants/paymentMethods';
import { formatDateVN } from './date';
import { formatVND } from './currency';

export function exportExpensesToCSV(
  expenses: Expense[],
  categories: Category[],
  fileName: string = 'SpendWise_DanhSachChiTieu.csv'
) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const paymentMap = new Map(PAYMENT_METHODS.map((p) => [p.id, p.name]));

  // CSV Headers
  const headers = ['Mã GD', 'Ngày chi', 'Danh mục', 'Số tiền (VND)', 'Phương thức thanh toán', 'Ghi chú', 'Định kỳ'];

  const rows = expenses.map((item) => {
    const categoryName = categoryMap.get(item.categoryId) || 'Khác';
    const paymentName = paymentMap.get(item.paymentMethod) || item.paymentMethod;
    const isRecurringText = item.isRecurring ? 'Có' : 'Không';
    const cleanNote = (item.note || '').replace(/"/g, '""');

    return [
      `"${item.id}"`,
      `"${formatDateVN(item.date)}"`,
      `"${categoryName}"`,
      item.amount,
      `"${paymentName}"`,
      `"${cleanNote}"`,
      `"${isRecurringText}"`,
    ].join(',');
  });

  // UTF-8 BOM for Microsoft Excel Windows support
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printFinancialReport(
  expenses: Expense[],
  categories: Category[],
  summary: AnalyticsSummary,
  periodLabel: string
) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const paymentMap = new Map(PAYMENT_METHODS.map((p) => [p.id, p.name]));

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const rowsHtml = expenses
    .slice(0, 100) // Top 100 in print view
    .map(
      (e, idx) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatDateVN(e.date)}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${categoryMap.get(e.categoryId) || 'Khác'}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #dc2626;">${formatVND(e.amount)}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${paymentMap.get(e.paymentMethod) || e.paymentMethod}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${e.note || '-'}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Báo Cáo Chi Tiêu - ${periodLabel}</title>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; padding: 24px; }
        .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #0f172a; padding-bottom: 12px; }
        .title { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
        .subtitle { font-size: 14px; color: #64748b; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
        .stat-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
        .stat-value { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px; }
        th { background: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; text-align: left; }
        @media print {
          @page { margin: 1.5cm; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">BÁO CÁO TỔNG HỢP CHI TIÊU SPENDWISE</div>
        <div class="subtitle">Kỳ báo cáo: ${periodLabel} | Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Tổng Chi Tiêu</div>
          <div class="stat-value" style="color: #dc2626;">${formatVND(summary.totalSpend)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Trung Bình Ngày</div>
          <div class="stat-value">${formatVND(summary.dailyAverage)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Số Lượng Giao Dịch</div>
          <div class="stat-value">${summary.transactionCount} giao dịch</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Danh Mục Chi Nhiều Nhất</div>
          <div class="stat-value" style="font-size: 14px;">${summary.topCategory ? `${summary.topCategory.category.name} (${summary.topCategory.percentage}%)` : 'Chưa có'}</div>
        </div>
      </div>

      <h3>Chi tiết các khoản chi (${expenses.length} khoản)</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">STT</th>
            <th style="width: 100px;">Ngày</th>
            <th style="width: 140px;">Danh mục</th>
            <th style="width: 120px; text-align: right;">Số tiền</th>
            <th style="width: 120px;">Phương thức</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
