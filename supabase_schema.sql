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
-- 교육용 웹앱이므로 로그인 없이 모든 사용자가 점수를 저장(INSERT)하고 순위표를 조회(SELECT)할 수 있는 정책(Policy)을 추가합니다.

-- RLS를 명시적으로 활성화합니다.
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

-- 1) 누구나 순위 데이터를 조회할 수 있도록 허용 (SELECT)
CREATE POLICY "Allow public read access" 
ON public.game_results 
FOR SELECT 
USING (true);

-- 2) 누구나 점수를 기록할 수 있도록 허용 (INSERT)
CREATE POLICY "Allow public insert access" 
ON public.game_results 
FOR INSERT 
WITH CHECK (true);

