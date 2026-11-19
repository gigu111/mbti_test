import Link from "next/link";

/**
 * 모든 페이지 상단에 공통으로 보이는 헤더 컴포넌트입니다.
 * - 왼쪽: 서비스 이름('돌고래 MBTI') — 누르면 첫 화면('/')으로 이동합니다.
 * - 오른쪽: 메뉴('유형 도감') — '/types' 경로로 이동합니다.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-sky-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-between px-5">
        {/* 왼쪽: 서비스 로고와 이름 (클릭 시 홈으로 이동) */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-full py-1.5 pr-2 transition-opacity hover:opacity-85 active:scale-[0.98]"
        >
          {/* 파스텔 동그라미 배지 안에 돌고래 아이콘 배치 */}
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 via-cyan-100 to-indigo-100 shadow-sm ring-1 ring-sky-200/70 transition-transform group-hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-sky-600"
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
          <span className="text-[17px] font-extrabold tracking-tight text-slate-800">
            돌고래 MBTI
          </span>
        </Link>

        {/* 오른쪽: 메뉴 영역 (현재는 '유형 도감' 하나만 표시) */}
        <nav aria-label="상단 메뉴">
          <Link
            href="/types"
            className="inline-flex min-h-[40px] items-center rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 shadow-xs ring-1 ring-sky-200/80 transition-all hover:bg-sky-100 hover:shadow-sm active:scale-[0.97]"
          >
            유형 도감
          </Link>
        </nav>
      </div>
    </header>
  );
}
