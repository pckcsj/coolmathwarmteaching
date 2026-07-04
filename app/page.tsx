"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  // 멘토의 팁 💡: 상태(State)를 이용하면 사용자의 인터랙션에 맞춰 UI를 바꿀 수 있어요!
  const [clickCount, setClickCount] = useState(0);

  const handleButtonClick = () => {
    setClickCount((prev) => prev + 1);
    alert(
      `🎉 환영합니다! "기능 추가" 버튼을 누르셨네요. \n현재 클릭 횟수: ${clickCount + 1}회\n\n선생님만의 멋진 교육 도구(예: 퀴즈, 단어장 등)를 이곳에 자유롭게 코딩해 보세요!`
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. 상단 헤더 (Header) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* 서비스 로고 (텍스트) */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              EduBuilder 🛠️
            </span>
          </div>

          {/* 네비게이션 링크 공간 (반응형: 모바일에서는 심플하게 표시하거나 숨김) */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/game"
              className="text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              소인수분해 게임 🎮
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              제공 기능
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              공식 문서
            </a>
          </nav>
        </div>
      </header>

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="flex-1">
        {/* 히어로 섹션 (Hero Section) */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white py-20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* 멘토의 팁 💡: Tailwind의 sm:, md:, lg: 접두사를 활용하여 모바일에서 PC까지 예쁜 크기로 반응형 텍스트를 만들 수 있어요! */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
              <span className="block xl:inline">나만의 </span>
              <span className="block text-indigo-600 dark:text-indigo-400 xl:inline">
                교육용 웹앱
              </span>
              <span> 만들기</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
              선생님과 학생들이 수업에 필요한 다양한 디지털 교구를 직접 만들고
              사용해 보는 템플릿입니다. 이 웹앱은 Vercel에 즉시 배포할 수 있는
              가장 깨끗한 보일러플레이트 코드입니다.
            </p>

            {/* 기능 추가를 위한 가짜(Placeholder) 버튼 & 실제 게임 버튼 */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/game"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                소인수분해 게임 플레이하기 🎮
              </Link>
              <button
                onClick={handleButtonClick}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                새로운 기능 예시 버튼 ⚙️
              </button>
            </div>
          </div>
        </section>

        {/* 멘토의 팁 💡: 확장성을 위해 앞으로 추가할 수 있는 예시 컴포넌트 카드들을 아래에 보여줍니다. */}
        <section id="features" className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                💡 우리 웹앱에서 이용 가능한 기능들
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                작동 중인 실제 게임과 앞으로 자유롭게 추가할 수 있는 교육 도구의 목록입니다.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* 카드 1 (현재 작동 중!) */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-6 shadow-sm transition-all hover:shadow-md dark:border-indigo-900/50 dark:bg-indigo-950/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                  🎮
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  소인수분해 게임
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-400">
                    실제 작동 중!
                  </span>
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  화면의 숫자를 소인수 버튼을 눌러 나누어 떨어뜨리며 60초간 높은 점수를 노려보세요! 
                  점수는 Supabase DB에 저장됩니다.
                </p>
                <div className="mt-4">
                  <Link href="/game" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    지금 플레이하기 &rarr;
                  </Link>
                </div>
              </div>

              {/* 카드 2 */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                  📚
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  플래시 단어장
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  학생들이 단어와 그림을 매칭하며 스스로 학습할 수 있는 디지털
                  카드를 만들어 봅니다. (아이디어 구현 대기 중)
                </p>
              </div>

              {/* 카드 3 */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                  🏆
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  모둠별 점수판
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  게임이나 활동 중 실시간으로 점수를 기록하고 순위를 매기는 인터랙티브
                  대시보드입니다. (아이디어 구현 대기 중)
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3. 하단 푸터 (Footer) */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; 2026 EduBuilder. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            선생님들의 아름다운 교육 열정을 응원하는 코딩 멘토 Antigravity 🚀
          </p>
        </div>
      </footer>
    </div>
  );
}


