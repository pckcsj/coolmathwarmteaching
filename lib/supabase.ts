import { createClient } from "@supabase/supabase-js";

// 멘토의 팁 💡: Supabase와 연동하기 위해서는 Supabase 프로젝트의 URL과 API Key가 필요합니다.
// 이 값들은 보안을 위해 코드에 직접 쓰지 않고 환경 변수(Environment Variables)로 관리합니다.
// 로컬 개발 시에는 프로젝트 루트 폴더에 `.env.local` 파일을 만들고 아래 두 값을 적어주세요.
//
// 예시 (.env.local):
// NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 환경 변수가 설정되지 않았을 때 빌드 오류를 방지하기 위해 가짜(placeholder) 값을 사용하며 콘솔에 친절한 경고를 남깁니다.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ [Supabase 경고] NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수가 비어 있습니다. " +
    "로컬에서는 .env.local 파일을 확인하시고, Vercel 배포 시에는 Environment Variables 설정을 완료해 주세요."
  );
}

// Supabase 클라이언트를 초기화하여 내보냅니다.
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
