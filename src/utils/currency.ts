export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatVNDRaw(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactVND(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace('.', ',')} tỷ`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    const val = amount / 1_000_000;
    return `${Number.isInteger(val) ? val : val.toFixed(1).replace('.', ',')} tr`;
  }
  if (Math.abs(amount) >= 1_000) {
    const val = amount / 1_000;
    return `${Number.isInteger(val) ? val : val.toFixed(0)}k`;
  }
  return `${amount} ₫`;
}

export function parseVND(input: string): number {
  if (!input) return 0;
  // Remove non-digit characters
  const clean = input.replace(/[^\d]/g, '');
  return parseInt(clean, 10) || 0;
}
