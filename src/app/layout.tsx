import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import {
  createPageMetadata,
  DEFAULT_DESCRIPTION,
  SERVICE_NAME,
} from "@/lib/metadata";
import "./globals.css";

// next/font를 사용해 Google Fonts의 Noto Sans KR 글꼴을 최적화해 불러옵니다.
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

// 브라우저 탭 제목과 검색 엔진·링크 공유용 기본 설명(Open Graph 포함) 설정
export const metadata: Metadata = createPageMetadata({
  title: SERVICE_NAME,
  description: DEFAULT_DESCRIPTION,
});

/**
 * 모든 페이지에 공통으로 적용되는 루트 레이아웃입니다.
 * - 밝은 파스텔 톤 배경 위에 본문을 가운데 정렬하고 최대 너비를 480px로 제한해
 *   PC 화면에서도 모바일 앱처럼 보기 좋게 보여줍니다.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className="min-h-dvh bg-gradient-to-br from-[#dcf6ee] via-[#eaf8f5] to-[#f2f9ff] text-slate-800">
        {/* 앱 전체에서 로그인 상태를 공유하도록 AuthProvider 로 감쌉니다. */}
        <AuthProvider>
          {/* 가운데 정렬 + 최대 너비 480px 모바일 프레임 영역 */}
          <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-gradient-to-b from-[#f6fbff] via-[#faf8ff] to-[#fffaf5] sm:border-x sm:border-white/90 sm:shadow-[0_20px_60px_-20px_rgba(61,150,130,0.22)]">
            {/* 모든 페이지 공통 상단 헤더 */}
            <Header />

            {/* 각 페이지 본문이 들어가는 영역 */}
            <main className="flex flex-1 flex-col px-5 pt-4 pb-6">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
