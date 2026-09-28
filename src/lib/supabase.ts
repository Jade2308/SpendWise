import { createClient } from '@supabase/supabase-js';

// URL và Public Anon Key của Supabase
// (Fallback mặc định đảm bảo app chạy được ngay trên Cloudflare/Vercel khi chưa kịp cấu hình biến môi trường)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://hgzvuwwtnaousrpgibso.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_VyA9noANgrA_4A4x3wA8Jw_yvYFOK7k';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

// Khởi tạo Supabase client an toàn, tuyệt đối không làm crash app nếu thiếu cấu hình
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
