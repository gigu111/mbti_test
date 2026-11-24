"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import CharacterViewer from "@/components/characters/CharacterViewer";
import { getMbtiTypeProfile } from "@/data/types";
import { supabase } from "@/lib/supabase";
import {
  fetchMyTestResults,
  formatSavedDate,
  getTestResultErrorMessage,
  type TestResultRecord,
} from "@/lib/testResults";

/** 회원별로 불러온 검사 기록 목록과 조회 오류를 함께 보관하는 상태입니다. */
interface LoadedResultsState {
  userId: string;
  records: TestResultRecord[];
  error: string;
}

/**
 * 로그인한 회원이 자신의 저장된 MBTI 검사 기록을 확인하는 마이페이지 화면입니다.
 * - 비로그인 상태로 접근하면 /login?next=/mypage 로 보냅니다.
 * - 가장 최근에 저장한 유형의 3D 캐릭터와 최신순 기록 목록, 개별 삭제 기능을 제공합니다.
 */
export default function MyPageView() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [loadedState, setLoadedState] = useState<LoadedResultsState | null>(
    null,
  );
  const [isRetrying, setIsRetrying] = useState(false);
  const [actionError, setActionError] = useState("");

  // 삭제 확인 모달에 띄울 대상 기록 (null 이면 모달이 닫혀 있습니다)
  const [deleteTarget, setDeleteTarget] = useState<TestResultRecord | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // 로그아웃 상태가 확정되면 로그인 페이지로 이동합니다.
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login?next=/mypage");
    }
  }, [isAuthLoading, user, router]);

  // 로그인한 회원이 확인되면 내 검사 기록을 비동기로 불러옵니다.
  useEffect(() => {
    if (isAuthLoading || !user) return;

    let cancelled = false;
    const targetUserId = user.id;

    fetchMyTestResults()
      .then((records) => {
        if (cancelled) return;
        setLoadedState({ userId: targetUserId, records, error: "" });
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadedState({
          userId: targetUserId,
          records: [],
          error: getTestResultErrorMessage(error, "load"),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, user]);

  /** 조회 오류가 났을 때 '다시 불러오기' 버튼으로 기록을 재조회합니다. */
  async function handleRetryFetch() {
    if (!user || isRetrying) return;

    const targetUserId = user.id;
    setIsRetrying(true);

    try {
      const records = await fetchMyTestResults();
      setLoadedState({ userId: targetUserId, records, error: "" });
    } catch (error) {
      setLoadedState({
        userId: targetUserId,
        records: [],
        error: getTestResultErrorMessage(error, "load"),
      });
    } finally {
      setIsRetrying(false);
    }
  }

  /** 삭제 확인 모달에서 '삭제하기'를 눌렀을 때 DB에서 해당 기록을 삭제합니다. */
  async function handleConfirmDelete() {
    if (!deleteTarget || isDeleting) return;

    const targetId = deleteTarget.id;
    setIsDeleting(true);
    setActionError("");

    try {
      const { error } = await supabase
        .from("test_results")
        .delete()
        .eq("id", targetId);

      if (error) {
        setActionError(getTestResultErrorMessage(error, "delete"));
        setDeleteTarget(null);
        return;
      }

      // DB 삭제가 끝나면 화면의 목록에서도 해당 기록을 즉시 제거합니다.
      setLoadedState((prev) =>
        prev
          ? {
              ...prev,
              records: prev.records.filter((item) => item.id !== targetId),
            }
          : prev,
      );
      setDeleteTarget(null);
    } catch (error) {
      setActionError(getTestResultErrorMessage(error, "delete"));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  // 로그인 여부를 확인하거나 비로그인 상태라 로그인 화면으로 이동하는 동안의 안내 화면
  if (isAuthLoading || !user) {
    return (
      <div className="-mx-5 -mt-4 -mb-6 flex flex-1 items-center justify-center bg-gradient-to-b from-[#e8f6f2] via-[#f2fbf8] to-[#ffffff] px-5 py-10">
        <p className="text-sm font-medium text-slate-500">불러오는 중...</p>
      </div>
    );
  }

  // 현재 로그인한 회원의 데이터가 아직 도착하지 않았거나 재조회 중이면 로딩 상태로 봅니다.
  const isFetching = isRetrying || loadedState?.userId !== user.id;
  const fetchError =
    loadedState?.userId === user.id ? loadedState.error : "";
  const results =
    loadedState?.userId === user.id ? loadedState.records : [];

  // 가입 시 user_metadata.nickname 에 저장한 닉네임을 꺼내고, 없으면 이메일 앞부분을 사용합니다.
  const rawNickname =
    typeof user.user_metadata?.nickname === "string"
      ? user.user_metadata.nickname.trim()
      : "";
  const displayName = rawNickname || user.email?.split("@")[0] || "회원";

  // 최신순 목록의 첫 번째 항목이 가장 최근에 저장한 유형입니다.
  const latestResult = results[0] ?? null;
  const latestProfile = latestResult
    ? getMbtiTypeProfile(latestResult.mbti_type)
    : null;
  const deleteTargetProfile = deleteTarget
    ? getMbtiTypeProfile(deleteTarget.mbti_type)
    : null;

  return (
    <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col gap-4 bg-gradient-to-b from-[#e8f6f2] via-[#f2fbf8] to-[#ffffff] px-5 pt-6 pb-8">
      {/* 1. 상단 회원 정보: '닉네임 님의 기록' + 가입 이메일 */}
      <section className="rounded-3xl bg-white/95 px-5 py-6 shadow-[0_14px_40px_-14px_rgba(52,168,138,0.16)] ring-1 ring-emerald-100">
        <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-emerald-200/80">
          마이페이지
        </p>
        <h1 className="mt-3 break-keep text-2xl font-extrabold tracking-tight text-slate-800">
          {displayName} 님의 기록
        </h1>
        {user.email ? (
          <p className="mt-1 truncate text-sm font-medium text-slate-500">
            {user.email}
          </p>
        ) : null}
      </section>

      {/* 2. 기록 로딩 / 오류 / 빈 상태 / 최근 캐릭터 + 검사 기록 목록 */}
      {isFetching ? (
        <section className="flex flex-1 items-center justify-center rounded-3xl bg-white/90 px-5 py-14 shadow-[0_12px_32px_-14px_rgba(71,85,105,0.12)] ring-1 ring-white">
          <p className="text-sm font-medium text-slate-500">불러오는 중...</p>
        </section>
      ) : fetchError ? (
        <section className="rounded-3xl bg-white/95 px-6 py-8 text-center shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-rose-100">
          <p role="alert" className="text-sm font-medium text-rose-600">
            {fetchError}
          </p>
          <button
            type="button"
            onClick={() => void handleRetryFetch()}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200/80"
          >
            다시 불러오기
          </button>
        </section>
      ) : results.length === 0 ? (
        <section className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-white/95 px-6 py-12 text-center shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white">
          <p className="text-lg font-extrabold text-slate-800">
            아직 저장한 결과가 없어요
          </p>
          <p className="mt-2 break-keep text-sm leading-relaxed text-slate-500">
            12개의 질문에 답하고 내 MBTI 유형과 3D 동물 캐릭터를 저장해 보세요.
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
          {/* 가장 최근에 저장한 유형의 3D 캐릭터 */}
          {latestProfile ? (
            <section className="rounded-3xl bg-white/95 px-5 py-5 text-center shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-500">
                  최근 저장한 유형
                </p>
                <span className="text-xs font-medium tabular-nums text-slate-400">
                  {formatSavedDate(latestResult.created_at)}
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-center gap-2">
                <span className="shrink-0 text-2xl font-extrabold tracking-wider text-slate-800">
                  {latestProfile.code}
                </span>
                <span className="truncate text-sm font-bold text-slate-600">
                  {latestProfile.nickname}
                </span>
              </div>

              <div
                className="relative mt-3.5 h-[236px] w-full overflow-hidden rounded-3xl shadow-inner ring-2 ring-white/85"
                style={{ backgroundColor: latestProfile.color }}
              >
                <CharacterViewer type={latestProfile.code} />
                <p className="pointer-events-none absolute right-3 bottom-2.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-xs backdrop-blur-xs">
                  {latestProfile.character.name}
                </p>
              </div>
            </section>
          ) : null}

          {/* 내 검사 기록 목록 (최신순) */}
          <section className="rounded-3xl bg-white/95 px-3.5 py-5 shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white sm:px-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-extrabold text-slate-800">
                내 검사 기록
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                총 {results.length}건
              </span>
            </div>

            {actionError ? (
              <p
                role="alert"
                className="mt-3 rounded-2xl bg-rose-50 px-4 py-2.5 text-center text-xs font-medium text-rose-600 ring-1 ring-rose-200/80"
              >
                {actionError}
              </p>
            ) : null}

            <ul className="mt-3 flex flex-col gap-2">
              {results.map((item) => {
                const profile = getMbtiTypeProfile(item.mbti_type);
                const savedDate = formatSavedDate(item.created_at);

                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50/75 px-3 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <Link
                      href={`/result/${profile.code}`}
                      title={`${profile.code} ${profile.nickname} 결과 보기`}
                      className="flex min-w-0 flex-1 items-center gap-1.5 rounded-xl py-0.5 text-left transition-opacity hover:opacity-80"
                    >
                      <span className="shrink-0 text-[11px] font-medium tabular-nums text-slate-400">
                        {savedDate}
                      </span>
                      <span
                        className="inline-flex shrink-0 items-center rounded-lg px-2 py-0.5 text-[12px] font-extrabold tracking-wide text-slate-800 ring-1 ring-black/5"
                        style={{ backgroundColor: profile.color }}
                      >
                        {profile.code}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-slate-700">
                        {profile.nickname}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setActionError("");
                        setDeleteTarget(item);
                      }}
                      className="shrink-0 rounded-xl bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-500 ring-1 ring-rose-200/80 transition-colors hover:bg-rose-50 active:scale-[0.97]"
                    >
                      삭제
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      {/* 삭제 전에 사용자에게 한 번 더 확인받는 안내 창 */}
      {deleteTarget && deleteTargetProfile ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5 backdrop-blur-[2px]"
          onClick={() => {
            if (!isDeleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className="w-full max-w-[340px] rounded-3xl bg-white p-6 text-center shadow-xl ring-1 ring-slate-100"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="delete-dialog-title"
              className="text-lg font-extrabold text-slate-800"
            >
              이 기록을 정말 삭제할까요?
            </h3>
            <p className="mt-2 break-keep text-sm text-slate-500">
              {formatSavedDate(deleteTarget.created_at)} ·{" "}
              <span className="font-bold text-slate-700">
                {deleteTargetProfile.code}
              </span>{" "}
              ({deleteTargetProfile.nickname})
            </p>
            <p className="mt-1 text-xs text-slate-400">
              삭제한 기록은 다시 되돌릴 수 없어요.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex h-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleConfirmDelete()}
                className="flex h-11 items-center justify-center rounded-2xl bg-rose-500 text-sm font-bold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
