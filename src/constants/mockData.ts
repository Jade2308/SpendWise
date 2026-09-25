import type { Expense } from '../types/expense';
import { format } from 'date-fns';

export function getMockExpenses(): Expense[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const makeDate = (day: number, subMonth: number = 0): string => {
    const targetMonth = month - subMonth;
    const d = new Date(year, targetMonth, Math.max(1, Math.min(day, 28)));
    return format(d, 'yyyy-MM-dd');
  };

  const currentMonthExpenses: Omit<Expense, 'id' | 'createdAt'>[] = [
    // Month begin bills
    { amount: 4500000, categoryId: 'housing', date: makeDate(1), paymentMethod: 'bank_transfer', note: 'Tiền thuê căn hộ tháng này', isRecurring: true, recurringPeriod: 'monthly' },
    { amount: 350000, categoryId: 'housing', date: makeDate(2), paymentMethod: 'bank_transfer', note: 'Tiền cước Internet FPT cáp quang', isRecurring: true, recurringPeriod: 'monthly' },
    { amount: 180000, categoryId: 'entertainment', date: makeDate(3), paymentMethod: 'credit_card', note: 'Gói thuê bao gia đình Netflix', isRecurring: true, recurringPeriod: 'monthly' },
    { amount: 59000, categoryId: 'entertainment', date: makeDate(3), paymentMethod: 'credit_card', note: 'Spotify Premium cá nhân', isRecurring: true, recurringPeriod: 'monthly' },

    // Food & Groceries
    { amount: 55000, categoryId: 'food', date: makeDate(4), paymentMethod: 'e_wallet', note: 'Ăn sáng phở bò tái lăn' },
    { amount: 45000, categoryId: 'food', date: makeDate(4), paymentMethod: 'e_wallet', note: 'Cà phê muối Highland' },
    { amount: 890000, categoryId: 'food', date: makeDate(5), paymentMethod: 'credit_card', note: 'Đi chợ siêu thị WinMart cuối tuần' },
    { amount: 120000, categoryId: 'food', date: makeDate(6), paymentMethod: 'e_wallet', note: 'Ăn trưa cơm văn phòng cùng đồng nghiệp' },
    { amount: 65000, categoryId: 'food', date: makeDate(7), paymentMethod: 'cash', note: 'Trà sữa Phúc Long' },
    { amount: 520000, categoryId: 'food', date: makeDate(8), paymentMethod: 'credit_card', note: 'Ăn tối lẩu Haidilao cùng bạn bè' },
    { amount: 40000, categoryId: 'food', date: makeDate(9), paymentMethod: 'cash', note: 'Bánh mì chảo ăn sáng' },
    { amount: 750000, categoryId: 'food', date: makeDate(11), paymentMethod: 'debit_card', note: 'Tiếp tế thực phẩm tươi sống tuần mới' },
    { amount: 60000, categoryId: 'food', date: makeDate(13), paymentMethod: 'e_wallet', note: 'Cà phê trứng The Coffee House' },
    { amount: 145000, categoryId: 'food', date: makeDate(15), paymentMethod: 'e_wallet', note: 'Pizza 4P giao tận nơi' },
    { amount: 50000, categoryId: 'food', date: makeDate(18), paymentMethod: 'cash', note: 'Bún chả Hà Nội' },
    { amount: 680000, categoryId: 'food', date: makeDate(20), paymentMethod: 'credit_card', note: 'Mua sắm rau củ thịt cá Co.opmart' },

    // Transportation
    { amount: 90000, categoryId: 'transport', date: makeDate(2), paymentMethod: 'cash', note: 'Đổ xăng xe máy đầy bình A95' },
    { amount: 45000, categoryId: 'transport', date: makeDate(5), paymentMethod: 'e_wallet', note: 'GrabBike đi gặp đối tác' },
    { amount: 120000, categoryId: 'transport', date: makeDate(8), paymentMethod: 'e_wallet', note: 'GrabCar trời mưa về nhà' },
    { amount: 95000, categoryId: 'transport', date: makeDate(14), paymentMethod: 'cash', note: 'Đổ xăng xe máy' },
    { amount: 250000, categoryId: 'transport', date: makeDate(17), paymentMethod: 'bank_transfer', note: 'Bảo dưỡng thay nhớt xe máy Motul' },

    // Shopping
    { amount: 650000, categoryId: 'shopping', date: makeDate(5), paymentMethod: 'credit_card', note: 'Mua áo thun & quần short Uniqlo' },
    { amount: 280000, categoryId: 'shopping', date: makeDate(10), paymentMethod: 'e_wallet', note: 'Đơn hàng Shopee đồ gia dụng nhà bếp' },
    { amount: 1200000, categoryId: 'shopping', date: makeDate(16), paymentMethod: 'credit_card', note: 'Giày chạy bộ thể thao Nike giảm giá' },

    // Entertainment & Social
    { amount: 260000, categoryId: 'entertainment', date: makeDate(6), paymentMethod: 'e_wallet', note: '2 vé xem phim CGV IMAX' },
    { amount: 350000, categoryId: 'entertainment', date: makeDate(12), paymentMethod: 'cash', note: 'Đi hát Karaoke cùng nhóm bạn thân' },

    // Health
    { amount: 165000, categoryId: 'health', date: makeDate(7), paymentMethod: 'e_wallet', note: 'Mua vitamin C & thuốc cảm nhà thuốc Long Châu' },
    { amount: 600000, categoryId: 'health', date: makeDate(19), paymentMethod: 'debit_card', note: 'Lấy cao răng & kiểm tra nha khoa định kỳ' },

    // Education & Self-development
    { amount: 320000, categoryId: 'education', date: makeDate(9), paymentMethod: 'credit_card', note: 'Mua 3 cuốn sách phát triển kỹ năng tại Fahasa' },
    { amount: 890000, categoryId: 'education', date: makeDate(15), paymentMethod: 'bank_transfer', note: 'Khóa học thiết kế giao diện Figma trên Udemy' },

    // Family & Pets
    { amount: 250000, categoryId: 'family', date: makeDate(11), paymentMethod: 'e_wallet', note: 'Hạt cho mèo Royal Canin & cát vệ sinh' },
    { amount: 500000, categoryId: 'family', date: makeDate(18), paymentMethod: 'bank_transfer', note: 'Gửi quà biếu ông bà dưới quê' },

    // Gifts & Donations
    { amount: 1000000, categoryId: 'gifts', date: makeDate(14), paymentMethod: 'bank_transfer', note: 'Mừng cưới đồng nghiệp công ty' },

    // Utilities / Housing mid-month
    { amount: 820000, categoryId: 'housing', date: makeDate(15), paymentMethod: 'bank_transfer', note: 'Tiền điện nước EVN tháng trước' },

    // Other
    { amount: 150000, categoryId: 'other', date: makeDate(17), paymentMethod: 'cash', note: 'Sửa khóa cửa phòng & photo tài liệu' },
  ];

  // Previous month expenses for comparison
  const previousMonthExpenses: Omit<Expense, 'id' | 'createdAt'>[] = [
    { amount: 4500000, categoryId: 'housing', date: makeDate(1, 1), paymentMethod: 'bank_transfer', note: 'Tiền thuê căn hộ tháng trước' },
    { amount: 950000, categoryId: 'housing', date: makeDate(15, 1), paymentMethod: 'bank_transfer', note: 'Tiền điện nước tháng trước' },
    { amount: 350000, categoryId: 'housing', date: makeDate(2, 1), paymentMethod: 'bank_transfer', note: 'Tiền mạng Internet' },
    { amount: 2400000, categoryId: 'food', date: makeDate(7, 1), paymentMethod: 'credit_card', note: 'Tổng tiền ăn uống siêu thị' },
    { amount: 1800000, categoryId: 'food', date: makeDate(16, 1), paymentMethod: 'debit_card', note: 'Ăn ngoài & nhà hàng' },
    { amount: 650000, categoryId: 'transport', date: makeDate(10, 1), paymentMethod: 'cash', note: 'Chi phí xăng xe tháng trước' },
    { amount: 1950000, categoryId: 'shopping', date: makeDate(12, 1), paymentMethod: 'credit_card', note: 'Mua sắm thời trang hè' },
    { amount: 1200000, categoryId: 'entertainment', date: makeDate(20, 1), paymentMethod: 'credit_card', note: 'Chuyến cắm trại dã ngoại cuối tuần' },
    { amount: 800000, categoryId: 'gifts', date: makeDate(22, 1), paymentMethod: 'bank_transfer', note: 'Quà sinh nhật sếp' },
  ];

  const allItems = [...currentMonthExpenses, ...previousMonthExpenses];

  return allItems.map((item, index) => ({
    ...item,
    id: `mock-exp-${index + 1}`,
    createdAt: new Date().toISOString(),
  }));
}
