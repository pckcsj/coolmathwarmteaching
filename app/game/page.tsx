"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// 소수 여부 판별 함수
const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// 4부터 100 사이의 합성수(소수가 아닌 수) 생성 함수
const generateCompositeNumber = (): number => {
  let num;
  do {
    num = Math.floor(Math.random() * 97) + 4; // 4 ~ 100
  } while (isPrime(num));
  return num;
};

// 리더보드 항목 타입
interface LeaderboardItem {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}

export default function GamePage() {
  // 게임 상태 관리
  const [gameState, setGameState] = useState<"READY" | "PLAYING" | "ENDED">("READY");
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [playerName, setPlayerName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // 사용자가 선택한 소인수 이력 저장
  const [factorsChosen, setFactorsChosen] = useState<number[]>([]);

  // 타이머를 위한 ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. 게임 시작
  const startGame = () => {
    setGameState("PLAYING");
    setScore(0);
    setTimeLeft(60);
    setErrorMessage("");
    setSuccessMessage("");
    setPlayerName("");
    setFactorsChosen([]);
    nextQuestion();
  };

  // 2. 다음 문제 출제
  const nextQuestion = () => {
    const newNum = generateCompositeNumber();
    setTargetNumber(newNum);
    setCurrentNumber(newNum);
    setFactorsChosen([]);
  };

  // 3. 소인수 버튼 클릭 핸들러
  const handleFactorClick = (factor: number) => {
    if (gameState !== "PLAYING") return;

    if (currentNumber % factor === 0) {
      const nextNum = currentNumber / factor;
      setFactorsChosen((prev) => [...prev, factor]);
      setCurrentNumber(nextNum);

      // 1이 되면 소인수분해 완성!
      if (nextNum === 1) {
        setScore((prev) => prev + 1);
        // 잠깐 성공 피드백을 보여주기 위해 연출 가능
        nextQuestion();
      }
    } else {
      // 소인수로 나누어떨어지지 않을 경우 (오답 피드백)
      setErrorMessage(`${currentNumber}은(는) ${factor}(으)로 나누어떨어지지 않아요! 😢`);
      setTimeout(() => setErrorMessage(""), 1500);
    }
  };

  // 4. 타이머 이펙트
  useEffect(() => {
    if (gameState === "PLAYING") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameState("ENDED");
            fetchLeaderboard(); // 게임이 끝나면 순위표 조회
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // 5. Supabase에서 리더보드(순위표) 불러오기
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("game_results")
        .select("id, player_name, score, created_at")
        .eq("game_type", "prime_factorization")
        .order("score", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(5);

      if (error) throw error;
      if (data) setLeaderboard(data as LeaderboardItem[]);
    } catch (err: any) {
      console.error("리더보드 로딩 실패:", err.message);
      // DB가 없거나 오류 시 가짜(로컬) 데이터 보여주기
      setLeaderboard([
        { id: "1", player_name: "수학왕선생님", score: 15, created_at: "" },
        { id: "2", player_name: "아이슈타인", score: 12, created_at: "" },
        { id: "3", player_name: "피타고라스", score: 10, created_at: "" },
      ]);
    }
  };

  // 6. Supabase에 결과 저장하기
  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // 멘토의 팁 💡: supabase.from('테이블명').insert() 함수를 이용해 데이터를 쉽게 DB에 저장할 수 있습니다!
      const { error } = await supabase.from("game_results").insert([
        {
          player_name: playerName.trim(),
          score: score,
          game_type: "prime_factorization",
        },
      ]);

      if (error) throw error;

      setSuccessMessage("점수가 성공적으로 기록되었습니다! 🎉");
      fetchLeaderboard(); // 순위표 갱신
    } catch (err: any) {
      console.error("점수 저장 실패:", err.message);
      setErrorMessage("데이터베이스 저장에 실패했습니다. (환경변수나 테이블을 확인해 주세요!)");
      
      // 로컬 리더보드에 임시 반영하여 동작하는 것처럼 보여줌 (사용자 편의성)
      setLeaderboard((prev) =>
        [
          ...prev,
          {
            id: Math.random().toString(),
            player_name: playerName + " (로컬 저장됨)",
            score: score,
            created_at: new Date().toISOString(),
          },
        ]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* 상단 헤더 */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            EduBuilder 🛠️
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </header>

      {/* 메인 게임 구역 */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-8 shadow-lg dark:bg-slate-900 dark:border-slate-800">
          
          {/* A. 대기 화면 (READY) */}
          {gameState === "READY" && (
            <div className="text-center py-6">
              <span className="text-5xl">🎲</span>
              <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
                소인수분해 알아맞추기 게임
              </h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                화면에 나타나는 합성수를 소수 버튼(2, 3, 5, 7...)을 클릭해서 
                나누어 떨어지게 만들며 최종적으로 1을 만들어 보세요! <br />
                제한시간 60초 동안 몇 개의 문제를 해결할 수 있을까요?
              </p>
              <button
                onClick={startGame}
                className="mt-8 w-full rounded-xl bg-indigo-600 py-3.5 text-lg font-bold text-white shadow-md hover:bg-indigo-700 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                게임 시작하기! 🚀
              </button>
            </div>
          )}

          {/* B. 진행 화면 (PLAYING) */}
          {gameState === "PLAYING" && (
            <div className="flex flex-col items-center">
              {/* 상단 정보 (남은 시간 & 현재 점수) */}
              <div className="w-full flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-slate-500">시간:</span>
                  <span className={`text-xl font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-slate-800 dark:text-white"}`}>
                    {timeLeft}초
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-slate-500">맞춘 개수:</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {score}개
                  </span>
                </div>
              </div>

              {/* 출제된 숫자 카드 */}
              <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl p-8 text-center border border-slate-100 dark:border-slate-900 mb-6">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  소인수분해할 숫자
                </span>
                <span className="text-6xl font-black text-slate-800 dark:text-white tracking-tight">
                  {currentNumber}
                </span>
                {targetNumber !== currentNumber && (
                  <div className="mt-3 text-sm text-indigo-500">
                    시작 숫자: {targetNumber} → ({factorsChosen.join(" × ")}) × {currentNumber}
                  </div>
                )}
              </div>

              {/* 에러 피드백 메시지 */}
              {errorMessage && (
                <div className="w-full text-center text-red-500 text-sm font-semibold mb-4 animate-bounce">
                  {errorMessage}
                </div>
              )}

              {/* 소수 버튼 리스트 */}
              <div className="w-full">
                <span className="text-xs text-slate-400 font-bold block mb-3 text-center">
                  나눌 소수를 탭하세요! (100 이하의 모든 소수)
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 
                    31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 
                    73, 79, 83, 89, 97
                  ].map((prime) => (
                    <button
                      key={prime}
                      onClick={() => handleFactorClick(prime)}
                      className="h-11 rounded-lg border border-slate-200 bg-white font-bold text-sm hover:bg-indigo-50 active:bg-indigo-100 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-800 dark:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
                    >
                      {prime}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setGameState("READY")}
                className="mt-8 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                포기하고 처음으로
              </button>
            </div>
          )}

          {/* C. 종료 화면 (ENDED) */}
          {gameState === "ENDED" && (
            <div className="py-2">
              <div className="text-center mb-6">
                <span className="text-5xl">🏆</span>
                <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                  게임 종료!
                </h2>
                <p className="mt-1.5 text-slate-600 dark:text-slate-400">
                  선생님/학생의 소인수분해 실력이 아주 대단해요!
                </p>
                <div className="mt-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl py-3 px-6 inline-block">
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">최종 스코어: </span>
                  <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">{score}개</span>
                </div>
              </div>

              {/* 결과 전송 폼 */}
              {successMessage ? (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-4 text-sm text-center mb-6 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50">
                  {successMessage}
                </div>
              ) : (
                <form onSubmit={handleSubmitScore} className="mb-8 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                    랭킹에 점수 기록하기
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="이름이나 닉네임 입력"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      required
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:bg-slate-400 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                      {isSubmitting ? "기록 중..." : "등록"}
                    </button>
                  </div>
                  {errorMessage && (
                    <p className="mt-2 text-xs text-red-500 font-semibold">{errorMessage}</p>
                  )}
                </form>
              )}

              {/* 리더보드 (순위표) */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 justify-center">
                  👑 실시간 랭킹 (Top 5)
                </h3>
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-2">불러오는 중...</p>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex justify-between items-center px-4 py-2.5 rounded-lg text-sm ${
                          index === 0
                            ? "bg-amber-50 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30"
                            : "bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold w-4 text-center">
                            {index === 0 ? "🥇" : index + 1}
                          </span>
                          <span className="font-semibold">{item.player_name}</span>
                        </div>
                        <span className="font-black text-indigo-600 dark:text-indigo-400">{item.score}개 해결</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 재시작 버튼 */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={startGame}
                  className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  다시 도전하기 🔁
                </button>
                <button
                  onClick={() => setGameState("READY")}
                  className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                >
                  처음 화면으로
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 py-6 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          &copy; 2026 EduBuilder. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
