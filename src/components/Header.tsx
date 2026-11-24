"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

/** 상단 헤더 메뉴 버튼들이 함께 쓰는 모바일 우선 공통 스타일입니다. */
const NAV_PILL_BASE =
  "inline-flex min-h-[32px] items-center justify-center whitespace-nowrap rounded-full px-1.5 py-1 text-[11px] font-semibold shadow-xs ring-1 transition-all hover:shadow-sm active:scale-[0.97] min-[400px]:min-h-[34px] min-[400px]:px-2.5 min-[400px]:text-[12px] sm:min-h-[40px] sm:px-3.5 sm:py-1.5 sm:text-sm";

/**
 * 모든 페이지 상단에 공통으로 보이는 헤더 컴포넌트입니다.
 * - 왼쪽: 서비스 이름('돌고래 MBTI') — 누르면 첫 화면('/')으로 이동합니다.
 * - 오른쪽: '유형 도감'('/types'), '통계'('/stats'), 그리고 로그인 상태에 따른 '마이페이지'·'로그아웃' 또는 '로그인' 메뉴를 보여줍니다.
 */
export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  /** 헤더의 '로그아웃' 버튼을 눌렀을 때 실행합니다. */
  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-sky-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-between gap-1.5 px-2.5 sm:gap-2 sm:px-5">
        {/* 왼쪽: 서비스 로고와 이름 (375px 화면에서 모든 메뉴가 한 줄에 들어가도록 크기를 조절했습니다) */}
        <Link
          href="/"
          className="group inline-flex shrink-0 items-center gap-1 rounded-full py-1.5 transition-opacity hover:opacity-85 active:scale-[0.98] min-[400px]:gap-1.5 sm:gap-2 sm:pr-1"
        >
          {/* 파스텔 동그라미 배지 안에 돌고래 아이콘 배치 */}
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 via-cyan-100 to-indigo-100 shadow-sm ring-1 ring-sky-200/70 transition-transform group-hover:scale-105 min-[400px]:h-7 min-[400px]:w-7 sm:h-9 sm:w-9"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-3.5 w-3.5 text-sky-600 min-[400px]:h-4 min-[400px]:w-4 sm:h-5 sm:w-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 15.5C6.5 11.5 10.2 8.5 14.5 8.5C16.2 8.5 17.8 9.2 19.2 10.4C20.2 11.2 21 12.2 21.5 13C19.8 13.1 18.4 13.7 17.2 14.5C15.5 15.6 13.6 16.5 11 16.5C9.5 16.5 8.2 16.2 7 15.6L4.5 17.5L5.3 14.9L4.5 15.5Z"
                fill="currentColor"
                fillOpacity="0.88"
              />
              <path
                d="M12.2 8.8L13.5 5.8C14.7 6.5 15.3 7.6 15.4 8.7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="17.3" cy="11.3" r="0.9" fill="#ffffff" />
            </svg>
          </span>
          <span className="whitespace-nowrap text-[13px] font-extrabold tracking-tight text-slate-800 min-[400px]:text-[14px] sm:text-[17px]">
            돌고래 MBTI
          </span>
        </Link>

        {/* 오른쪽: 메뉴 영역 ('유형 도감' + '통계' + 로그인 시 '마이페이지'·'로그아웃' / 비로그인 시 '로그인') */}
        <nav
          aria-label="상단 메뉴"
          className="flex shrink-0 items-center gap-1 sm:gap-2"
        >
          <Link
            href="/types"
            className={`${NAV_PILL_BASE} bg-sky-50 text-sky-700 ring-sky-200/80 hover:bg-sky-100`}
          >
            유형 도감
          </Link>

          <Link
            href="/stats"
            className={`${NAV_PILL_BASE} bg-indigo-50 text-indigo-700 ring-indigo-200/80 hover:bg-indigo-100`}
          >
            통계
          </Link>

          {/* 로그인 여부를 확인하는 짧은 순간에는 자리를 비워 두어 메뉴 깜빡임을 막습니다. */}
          {isLoading ? (
            <span
              aria-hidden="true"
              className="inline-flex min-h-[32px] min-w-[46px] min-[400px]:min-h-[34px] min-[400px]:min-w-[56px] sm:min-h-[40px] sm:min-w-[74px]"
            />
          ) : user ? (
            <>
              <Link
                href="/mypage"
                className={`${NAV_PILL_BASE} bg-emerald-50 text-teal-700 ring-emerald-200/80 hover:bg-emerald-100`}
              >
                마이페이지
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`${NAV_PILL_BASE} bg-slate-100 text-slate-700 ring-slate-200/90 hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[74px]`}
              >
                {isSigningOut ? "처리 중..." : "로그아웃"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`${NAV_PILL_BASE} min-w-[46px] bg-emerald-50 text-teal-700 ring-emerald-200/80 hover:bg-emerald-100 min-[400px]:min-w-[56px] sm:min-w-[74px]`}
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
