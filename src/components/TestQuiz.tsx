"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type MbtiTrait } from "@/data/questions";
import { calculateMbtiType } from "@/lib/mbti";

/**
 * 12개 문항을 한 화면에 하나씩 풀어보는 검사 컴포넌트입니다.
 * - 위쪽: 현재 진행 번호('3 / 12')와 진행 막대
 * - 가운데: 현재 질문과 큼직한 선택지 버튼 2개
 * - 아래쪽: 앞 질문으로 돌아가는 '이전' 버튼 (첫 질문에서는 숨김)
 */
export default function TestQuiz() {
  const router = useRouter();

  // 현재 화면에 보여줄 질문의 순서 번호 (0부터 11까지)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 각 문항에서 사용자가 고른 성향 글자를 저장하는 배열 (아직 안 고른 문항은 null)
  const [answers, setAnswers] = useState<(MbtiTrait | null)[]>(() =>
    Array(QUESTIONS.length).fill(null),
  );

  // 마지막 문항을 고르고 결과 페이지로 이동하는 동안 중복 클릭을 막기 위한 상태
  const [isMovingToResult, setIsMovingToResult] = useState(false);

  const totalCount = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const selectedTrait = answers[currentIndex];
  // 진행 막대 너비(%) 계산: 1번 문항이면 1/12, 12번 문항이면 12/12(100%)
  const progressPercent = Math.round(((currentIndex + 1) / totalCount) * 100);

  /** 선택지 버튼을 눌렀을 때 답을 저장하고 다음 질문 또는 결과 페이지로 이동합니다. */
  function handleSelectOption(trait: MbtiTrait) {
    if (isMovingToResult) {
      return;
    }

    // 현재 문항의 선택을 반영한 새 응답 배열 만들기
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = trait;
    setAnswers(nextAnswers);

    // 아직 마지막 질문이 아니라면 바로 다음 질문으로 넘어갑니다.
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // 12번째 질문까지 모두 골랐다면 유형 코드를 계산해 결과 페이지로 이동합니다.
    setIsMovingToResult(true);
    const completedTraits = nextAnswers.filter(
      (item): item is MbtiTrait => item !== null,
    );
    const resultType = calculateMbtiType(completedTraits);
    router.push(`/result/${resultType}`);
  }

  /** '이전' 버튼을 눌렀을 때 한 단계 앞 질문으로 되돌아갑니다. */
  function handlePrevious() {
    if (isMovingToResult || currentIndex === 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
  }

  return (
    <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col bg-gradient-to-b from-[#d8f8ec] via-[#e9fcf5] to-[#f4fefb] px-5 pt-5 pb-6">
      {/* 1. 위쪽 진행 상황 영역: 숫자와 진행 막대 */}
      <section aria-label="검사 진행 상황" className="mb-5">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-teal-700">
            진행 상황
          </span>
          <span className="text-sm font-bold tabular-nums text-slate-700">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>

        {/* 진행 막대 트랙 */}
        <div
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalCount}
          aria-label={`총 ${totalCount}문항 중 ${currentIndex + 1}번째 질문`}
          className="h-3 w-full overflow-hidden rounded-full bg-white/85 shadow-inner ring-1 ring-emerald-100"
        >
          {/* 현재 진행 비율만큼 채워지는 민트-스카이 그라데이션 막대 */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* 2. 현재 질문 카드 및 선택지 2개 */}
      <section key={currentQuestion.id} className="flex flex-col gap-4">
        <div className="rounded-3xl bg-white/92 px-6 py-7 shadow-[0_14px_40px_-14px_rgba(52,168,138,0.2)] ring-1 ring-emerald-100/90">
          {/* 질문 번호 배지 */}
          <p className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-emerald-200/80">
            질문 {currentIndex + 1}
          </p>

          {/* 한 문장 질문 제목 */}
          <h1 className="break-keep text-[21px] leading-snug font-extrabold tracking-tight text-slate-800">
            {currentQuestion.prompt}
          </h1>

          {/* 큼직한 선택지 버튼 2개 */}
          <div className="mt-6 flex flex-col gap-3.5">
            {currentQuestion.options.map((option, optionIndex) => {
              // '이전'으로 돌아왔을 때 기존에 골랐던 답을 알아볼 수 있도록 표시
              const isPreviouslySelected = selectedTrait === option.trait;

              return (
                <button
                  key={`${currentQuestion.id}-${option.trait}`}
                  type="button"
                  disabled={isMovingToResult}
                  onClick={() => handleSelectOption(option.trait)}
                  className={`group flex min-h-[84px] w-full items-center gap-3.5 rounded-2xl px-5 py-4 text-left transition-all active:scale-[0.985] disabled:opacity-60 ${
                    isPreviouslySelected
                      ? "bg-sky-50/95 ring-2 ring-sky-400 shadow-[0_10px_24px_-12px_rgba(38,166,234,0.35)]"
                      : "bg-slate-50/85 ring-1 ring-slate-200/90 shadow-xs hover:bg-sky-50/70 hover:ring-sky-300 hover:shadow-sm"
                  }`}
                >
                  {/* 번호 원형 배지 (1 / 2) */}
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      isPreviouslySelected
                        ? "bg-sky-500 text-white"
                        : "bg-white text-sky-600 ring-1 ring-sky-200 group-hover:bg-sky-100"
                    }`}
                  >
                    {optionIndex + 1}
                  </span>

                  {/* 선택지 문장 */}
                  <span className="flex-1 break-keep text-[15px] leading-relaxed font-semibold text-slate-700">
                    {option.label}
                  </span>

                  {/* 이전에 골랐던 선택지인 경우 작은 배지 표시 */}
                  {isPreviouslySelected && (
                    <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                      선택됨
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. 아래쪽 '이전' 버튼 영역 (첫 질문에서는 숨김) */}
        <div className="flex min-h-[48px] items-center justify-start">
          {currentIndex > 0 && (
            <button
              type="button"
              disabled={isMovingToResult}
              onClick={handlePrevious}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-xs ring-1 ring-emerald-200/80 transition-all hover:bg-white hover:text-slate-800 active:scale-[0.98] disabled:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5 10H5.5M5.5 10L9.5 6M5.5 10L9.5 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>이전</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
