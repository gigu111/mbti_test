"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CharacterViewer from "@/components/characters/CharacterViewer";
import {
  fetchTypeStatsSummary,
  getStatsErrorMessage,
  type StatsSummary,
} from "@/lib/stats";

/** 통계 화면의 불러오기 상태를 묶어서 관리하는 타입입니다. */
interface StatsPageState {
  status: "loading" | "ready" | "error";
  summary: StatsSummary | null;
  errorMessage: string;
}

/**
 * 모든 회원이 저장한 MBTI 결과를 집계해 보여 주는 공개 통계 화면입니다.
 * - 로그인하지 않은 방문자도 DB 함수 get_type_stats() 를 통해 전체 통계를 볼 수 있습니다.
 * - 가장 많은 유형의 3D 캐릭터와 16가지 유형 가로 막대 그래프를 제공합니다.
 */
export default function StatsView() {
  const [pageState, setPageState] = useState<StatsPageState>({
    status: "loading",
    summary: null,
    errorMessage: "",
  });
  const [isRetrying, setIsRetrying] = useState(false);

  // 페이지에 들어오면 Supabase get_type_stats() 함수를 호출해 전체 통계를 불러옵니다.
  useEffect(() => {
    let cancelled = false;

    fetchTypeStatsSummary()
      .then((summary) => {
        if (cancelled) return;
        setPageState({ status: "ready", summary, errorMessage: "" });
      })
      .catch((error) => {
        if (cancelled) return;
        setPageState({
          status: "error",
          summary: null,
          errorMessage: getStatsErrorMessage(error),
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** 오류가 발생했을 때 '다시 불러오기' 버튼으로 통계를 다시 요청합니다. */
  async function handleRetry() {
    if (isRetrying) return;
    setIsRetrying(true);

    try {
      const summary = await fetchTypeStatsSummary();
      setPageState({ status: "ready", summary, errorMessage: "" });
    } catch (error) {
      setPageState({
        status: "error",
        summary: null,
        errorMessage: getStatsErrorMessage(error),
      });
    } finally {
      setIsRetrying(false);
    }
  }

  // 불러오는 동안 안내 문구 표시
  if (pageState.status === "loading" || isRetrying) {
    return (
      <div className="-mx-5 -mt-4 -mb-6 flex flex-1 items-center justify-center bg-gradient-to-b from-[#e8f6f2] via-[#f2fbf8] to-[#ffffff] px-5 py-10">
        <p className="text-sm font-medium text-slate-500">불러오는 중...</p>
      </div>
    );
  }

  // 조회 오류 안내 화면
  if (pageState.status === "error" || !pageState.summary) {
    return (
      <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#e8f6f2] via-[#f2fbf8] to-[#ffffff] px-5 py-10">
        <section className="w-full rounded-3xl bg-white/95 px-6 py-8 text-center shadow-[0_14px_40px_-14px_rgba(71,85,105,0.14)] ring-1 ring-rose-100">
          <p role="alert" className="break-keep text-sm font-medium text-rose-600">
            {pageState.errorMessage || "통계를 불러오지 못했어요."}
          </p>
          <button
            type="button"
            onClick={() => void handleRetry()}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200/80"
          >
            다시 불러오기
          </button>
        </section>
      </div>
    );
  }

  const { totalCount, topType, items } = pageState.summary;

  return (
    <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col gap-4 bg-gradient-to-b from-[#e8f6f2] via-[#f2fbf8] to-[#ffffff] px-5 pt-6 pb-8">
      {/* 1. 맨 위 요약: 지금까지 저장된 전체 결과 수 */}
      <section className="rounded-3xl bg-white/95 px-5 py-6 shadow-[0_14px_40px_-14px_rgba(52,168,138,0.16)] ring-1 ring-emerald-100">
        <p className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200/80">
          전체 통계
        </p>
        <h1 className="mt-3 break-keep text-2xl font-extrabold leading-snug tracking-tight text-slate-800">
          지금까지 {totalCount.toLocaleString("ko-KR")}개의 결과가 모였어요
        </h1>
        <p className="mt-1.5 break-keep text-sm text-slate-500">
          돌고래 MBTI 참여자들이 저장한 유형 분포를 한눈에 확인해 보세요.
        </p>
      </section>

      {totalCount === 0 || !topType ? (
        /* 저장된 결과가 하나도 없을 때 */
        <section className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-white/95 px-6 py-12 text-center shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white">
          <p className="text-lg font-extrabold text-slate-800">
            아직 모인 결과가 없어요
          </p>
          <p className="mt-2 break-keep text-sm leading-relaxed text-slate-500">
            첫 번째 검사 결과를 저장하면 가장 많은 유형과 분포 그래프가 나타나요.
          </p>
          <Link
            href="/test"
            className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] px-6 text-[16px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(38,166,234,0.65)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            검사하러 가기
          </Link>
        </section>
      ) : (
        <>
          {/* 2. 가장 많은 유형의 3D 캐릭터와 별명 */}
          <section className="rounded-3xl bg-white/95 px-5 py-5 text-center shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200/80">
                가장 많은 유형
              </p>
              <span className="text-xs font-semibold tabular-nums text-slate-500">
                {topType.count.toLocaleString("ko-KR")}개 ({topType.percentageText}
                %)
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline justify-center gap-2">
              <span className="shrink-0 text-2xl font-extrabold tracking-wider text-slate-800">
                {topType.profile.code}
              </span>
              <span className="truncate text-sm font-bold text-slate-600">
                {topType.profile.nickname}
              </span>
            </div>

            <div
              className="relative mt-3.5 h-[236px] w-full overflow-hidden rounded-3xl shadow-inner ring-2 ring-white/85"
              style={{ backgroundColor: topType.profile.color }}
            >
              <CharacterViewer type={topType.profile.code} />
              <p className="pointer-events-none absolute right-3 bottom-2.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-xs backdrop-blur-xs">
                {topType.profile.character.name}
              </p>
            </div>
          </section>

          {/* 3. 16개 유형 전체 가로 막대 그래프 (많은 순서) */}
          <section className="rounded-3xl bg-white/95 px-4 py-5 shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white sm:px-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-800">
                유형별 순위
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                전체 16개 유형
              </span>
            </div>

            <ol className="mt-4 flex flex-col gap-2.5">
              {items.map((item) => (
                <li
                  key={item.profile.code}
                  className="flex items-center gap-2"
                >
                  {/* 유형 코드 배지 (대표 색상 적용) */}
                  <span
                    className="inline-flex w-[52px] shrink-0 items-center justify-center rounded-lg py-1 text-xs font-extrabold tracking-wide text-slate-800 ring-1 ring-black/8"
                    style={{ backgroundColor: item.profile.color }}
                  >
                    {item.profile.code}
                  </span>

                  {/* 라이브러리 없이 직접 그린 가로 막대 그래프 */}
                  <div
                    role="progressbar"
                    aria-label={`${item.profile.code} 비율 ${item.percentageText}%`}
                    aria-valuenow={Math.round(item.percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-6 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100/90 ring-1 ring-slate-200/70"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width:
                          item.count > 0
                            ? `${Math.max(item.percentage, 4)}%`
                            : "0%",
                        backgroundColor: item.profile.color,
                        boxShadow:
                          item.count > 0
                            ? "inset 0 0 0 1px rgba(15, 23, 42, 0.1)"
                            : "none",
                      }}
                    />
                  </div>

                  {/* 개수와 비율(%) */}
                  <span className="w-[82px] shrink-0 whitespace-nowrap text-right text-[11px] font-semibold tabular-nums text-slate-600 sm:w-[94px] sm:text-xs">
                    {item.count.toLocaleString("ko-KR")}개 ({item.percentageText}
                    %)
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}
