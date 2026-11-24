"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

/**
 * 모든 페이지 상단에 공통으로 보이는 헤더 컴포넌트입니다.
 * - 왼쪽: 서비스 이름('돌고래 MBTI') — 누르면 첫 화면('/')으로 이동합니다.
 * - 오른쪽: '유형 도감'('/types')과 로그인 상태에 따른 '마이페이지'·'로그아웃' 또는 '로그인' 메뉴를 보여줍니다.
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
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-between gap-2 px-3 sm:px-5">
        {/* 왼쪽: 서비스 로고와 이름 (클릭 시 홈으로 이동, 375px 화면에서도 줄바꿈되지 않게 유지) */}
        <Link
          href="/"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pr-0.5 transition-opacity hover:opacity-85 active:scale-[0.98] sm:gap-2 sm:pr-1"
        >
          {/* 파스텔 동그라미 배지 안에 돌고래 아이콘 배치 */}
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 via-cyan-100 to-indigo-100 shadow-sm ring-1 ring-sky-200/70 transition-transform group-hover:scale-105 sm:h-9 sm:w-9"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-sky-600 sm:h-5 sm:w-5"
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
          <span className="whitespace-nowrap text-[14px] font-extrabold tracking-tight text-slate-800 sm:text-[17px]">
            돌고래 MBTI
          </span>
        </Link>

        {/* 오른쪽: 메뉴 영역 ('유형 도감' + 로그인 시 '마이페이지'·'로그아웃' / 비로그인 시 '로그인') */}
        <nav
          aria-label="상단 메뉴"
          className="flex shrink-0 items-center gap-1 sm:gap-2"
        >
          <Link
            href="/types"
            className="inline-flex min-h-[34px] items-center justify-center whitespace-nowrap rounded-full bg-sky-50 px-2.5 py-1 text-[12px] font-semibold text-sky-700 shadow-xs ring-1 ring-sky-200/80 transition-all hover:bg-sky-100 hover:shadow-sm active:scale-[0.97] sm:min-h-[40px] sm:px-3.5 sm:py-1.5 sm:text-sm"
          >
            유형 도감
          </Link>

          {/* 로그인 여부를 확인하는 짧은 순간에는 자리를 비워 두어 메뉴 깜빡임을 막습니다. */}
          {isLoading ? (
            <span
              aria-hidden="true"
              className="inline-flex min-h-[34px] min-w-[58px] sm:min-h-[40px] sm:min-w-[74px]"
            />
          ) : user ? (
            <>
              <Link
                href="/mypage"
                className="inline-flex min-h-[34px] items-center justify-center whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-teal-700 shadow-xs ring-1 ring-emerald-200/80 transition-all hover:bg-emerald-100 hover:shadow-sm active:scale-[0.97] sm:min-h-[40px] sm:px-3.5 sm:py-1.5 sm:text-sm"
              >
                마이페이지
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex min-h-[34px] items-center justify-center whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-semibold text-slate-700 shadow-xs ring-1 ring-slate-200/90 transition-all hover:bg-slate-200/70 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[40px] sm:min-w-[74px] sm:px-3.5 sm:py-1.5 sm:text-sm"
              >
                {isSigningOut ? "처리 중..." : "로그아웃"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-[34px] min-w-[58px] items-center justify-center whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-teal-700 shadow-xs ring-1 ring-emerald-200/80 transition-all hover:bg-emerald-100 hover:shadow-sm active:scale-[0.97] sm:min-h-[40px] sm:min-w-[74px] sm:px-3.5 sm:py-1.5 sm:text-sm"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
