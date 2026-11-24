"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { MbtiType } from "@/lib/mbti";
import { supabase } from "@/lib/supabase";
import { getTestResultErrorMessage } from "@/lib/testResults";

/**
 * 결과 페이지에서 검사 결과를 DB(test_results)에 저장하는 '내 기록에 저장' 버튼입니다.
 * - 로그인 상태: test_results 테이블에 mbti_type 만 저장한 뒤 버튼이 '저장했어요' 로 바뀌고 비활성화됩니다.
 * - 로그아웃 상태: /login?next=/result/유형코드 주소로 이동시켜 로그인 후 다시 돌아오게 합니다.
 */
export default function SaveResultButton({ mbtiType }: { mbtiType: MbtiType }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  // 어떤 회원이 이 결과를 저장했는지 ID로 기록해 로그아웃 시 자동으로 저장 전 상태로 되돌립니다.
  const [savedUserId, setSavedUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isSaved = Boolean(user && savedUserId === user.id);
  const visibleError = user ? errorMessage : "";

  /** '내 기록에 저장' 버튼을 눌렀을 때 실행합니다. */
  async function handleSaveResult() {
    if (isSaving || isSaved) return;
    setErrorMessage("");

    // AuthProvider 가 아직 초기 확인 중이라면 최신 세션을 한 번 더 확인합니다.
    let currentUser = user;
    if (isLoading && !currentUser) {
      const { data } = await supabase.auth.getSession();
      currentUser = data.session?.user ?? null;
    }

    // 로그아웃 상태라면 로그인 뒤 현재 결과 페이지로 돌아오도록 next 파라미터를 붙입니다.
    if (!currentUser) {
      router.push(`/login?next=/result/${mbtiType}`);
      return;
    }

    setIsSaving(true);

    try {
      // user_id 와 created_at 은 DB 기본값(auth.uid(), now())이 자동으로 채워 줍니다.
      const { error } = await supabase
        .from("test_results")
        .insert({ mbti_type: mbtiType });

      if (error) {
        setErrorMessage(getTestResultErrorMessage(error, "save"));
        return;
      }

      setSavedUserId(currentUser.id);
    } catch (error) {
      setErrorMessage(getTestResultErrorMessage(error, "save"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleSaveResult}
        disabled={isSaving || isSaved}
        className={
          isSaved
            ? "flex h-14 w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-5 text-[16px] font-bold text-emerald-700 ring-1 ring-emerald-200/90"
            : "flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#10b981] via-[#14b8a6] to-[#0ea5e9] px-5 text-[16px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(20,184,166,0.55)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-65"
        }
      >
        {isSaved ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 10.5L8.2 14.2L15.5 6.8"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 3.5H14.5C15.0523 3.5 15.5 3.94772 15.5 4.5V16.5L10 13.2L4.5 16.5V4.5C4.5 3.94772 4.94772 3.5 5.5 3.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span>
          {isSaved ? "저장했어요" : isSaving ? "저장 중..." : "내 기록에 저장"}
        </span>
      </button>

      {visibleError ? (
        <p
          role="alert"
          className="rounded-2xl bg-rose-50/95 px-4 py-3 text-center text-sm font-medium text-rose-600 ring-1 ring-rose-200/80"
        >
          {visibleError}
        </p>
      ) : null}
    </div>
  );
}
