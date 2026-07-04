-- 💡 [소인수분해 게임 데이터베이스 세팅 SQL]
-- 이 쿼리문을 복사하여 Supabase 대시보드의 [SQL Editor] -> [New Query]에 붙여넣고 [Run] 버튼을 눌러 실행해 주세요!

-- 1. 게임 결과 저장용 테이블 생성
CREATE TABLE IF NOT EXISTS public.game_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    game_type TEXT NOT NULL DEFAULT 'prime_factorization',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 테이블에 주석 추가 (Supabase 스키마 뷰어에서 보임)
COMMENT ON TABLE public.game_results IS '교육용 웹앱 소인수분해 게임 결과 저장 테이블';

-- 3. Row Level Security (RLS) 설정 
-- ⚠️ 중요: RLS가 켜져 있으면 외부(프론트엔드)에서 데이터를 추가하거나 읽을 수 없습니다.
-- 테스트 및 교육용이므로 RLS를 활성화하고 누구나 쓰고 읽을 수 있는 정책(Policy)을 추가하거나, RLS를 완전히 끕니다.
-- 여기서는 가장 쉬운 방법인 RLS 비활성화를 적용합니다. (보안이 중요한 서비스라면 활성화 후 정책을 추가해야 합니다.)
ALTER TABLE public.game_results DISABLE ROW LEVEL SECURITY;

-- (참고) 만약 RLS를 켜고 public 권한을 주고 싶다면 아래 주석을 풀고 실행하세요.
-- ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read/write access for all users" ON public.game_results
--     FOR ALL
--     TO public
--     USING (true)
--     WITH CHECK (true);
