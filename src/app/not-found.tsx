import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";

/** 404 안내 페이지 제목, 설명 및 링크 공유(Open Graph) 정보 */
export const metadata: Metadata = createPageMetadata({
  title: "페이지를 찾을 수 없어요 | 돌고래 MBTI",
  description:
    "요청하신 페이지를 찾을 수 없어요. 첫 화면으로 돌아가 돌고래 MBTI 검사를 시작해 보세요.",
});

/**
 * 존재하지 않는 주소로 들어왔을 때 보여 주는 서비스 맞춤 404 페이지입니다.
 * - 돌고래 MBTI의 연한 민트·스카이 색감에 맞춰 첫 화면이나 유형 도감으로 쉽게 돌아갈 수 있게 안내합니다.
 */
export default function NotFound() {
  return (
    <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#d8f8ec] via-[#e9fcf5] to-[#f4fefb] px-5 py-10">
      <section className="w-full rounded-3xl bg-white/95 px-6 py-9 text-center shadow-[0_14px_40px_-14px_rgba(52,168,138,0.2)] ring-1 ring-emerald-100/90">
        {/* 파스텔 돌고래 뱃지 아이콘 */}
        <div
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-100 shadow-sm ring-2 ring-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-9 w-9 text-sky-600"
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
        </div>

        <p className="mt-4 inline-flex items-center rounded-full bg-sky-50 px-3.5 py-1 text-xs font-bold tracking-wider text-sky-700 ring-1 ring-sky-200/80">
          404 · 없는 주소예요
        </p>

        <h1 className="mt-3 break-keep text-2xl font-extrabold tracking-tight text-slate-800">
          페이지를 찾을 수 없어요
        </h1>

        <p className="mt-2.5 break-keep text-sm leading-relaxed text-slate-500">
          주소가 잘못되었거나 바뀐 페이지예요.
          <br />
          첫 화면으로 돌아가 성격 유형 검사를 시작해 보세요.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] px-6 text-[16px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(38,166,234,0.65)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            홈으로 가기
          </Link>

          <Link
            href="/types"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-slate-50 px-5 text-sm font-bold text-slate-700 ring-1 ring-slate-200/80 transition-colors hover:bg-slate-100 active:scale-[0.98]"
          >
            16가지 유형 도감 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
