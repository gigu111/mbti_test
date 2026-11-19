"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 결과 페이지의 '결과 공유하기' 버튼 컴포넌트입니다.
 * - 누르면 현재 브라우저 주소를 클립보드에 복사합니다.
 * - 복사가 끝나면 아래에 '주소를 복사했어요' 안내 문구를 띄워 줍니다.
 */
export default function ShareResultButton() {
  // 복사 완료 안내 문구를 화면에 보여줄지 여부
  const [copied, setCopied] = useState(false);
  // 이전 타이머를 정리하기 위한 참조 값
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 컴포넌트가 사라질 때 남아 있는 타이머를 정리합니다.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /** 현재 페이지 URL을 클립보드에 복사하고 안내 문구를 표시합니다. */
  async function handleCopyUrl() {
    const currentUrl = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        fallbackCopyText(currentUrl);
      }
    } catch {
      // 클립보드 API가 막힌 환경에서도 복사되도록 보조 방식을 사용합니다.
      fallbackCopyText(currentUrl);
    }

    setCopied(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleCopyUrl}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] px-5 text-[16px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(38,166,234,0.65)] transition-all hover:brightness-105 active:scale-[0.98]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 4.5C13 3.67157 13.6716 3 14.5 3C15.3284 3 16 3.67157 16 4.5C16 5.32843 15.3284 6 14.5 6C13.6716 6 13 5.32843 13 4.5ZM13 4.5L7 8.5M7 11.5L13 15.5M4 10C4 9.17157 4.67157 8.5 5.5 8.5C6.32843 8.5 7 9.17157 7 10C7 10.8284 6.32843 11.5 5.5 11.5C4.67157 11.5 4 10.8284 4 10ZM13 15.5C13 14.6716 13.6716 14 14.5 14C15.3284 14 16 14.6716 16 15.5C16 16.3284 15.3284 17 14.5 17C13.6716 17 13 16.3284 13 15.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>결과 공유하기</span>
      </button>

      {/* 복사 완료 안내 문구 (복사 버튼 클릭 후에만 보입니다) */}
      <p
        role="status"
        aria-live="polite"
        className={`min-h-[24px] text-xs font-semibold text-teal-700 transition-opacity ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? "주소를 복사했어요" : ""}
      </p>
    </div>
  );
}

/** 구형 브라우저나 권한 제한 환경에서 텍스트를 복사할 때 쓰는 보조 함수입니다. */
function fallbackCopyText(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
