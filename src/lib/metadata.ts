import type { Metadata } from "next";

/** 서비스 공식 이름 */
export const SERVICE_NAME = "돌고래 MBTI";

/** 서비스 기본 설명 문구 */
export const DEFAULT_DESCRIPTION =
  "12개 질문에 답하면 16가지 성격 유형과 3D 동물 캐릭터를 알려주는 검사 서비스";

/**
 * 각 페이지에 알맞은 제목(title), 설명(description), Open Graph 미리보기 설정을 만들어 줍니다.
 */
export function createPageMetadata({
  title,
  description,
  noIndex = false,
}: {
  /** 브라우저 탭과 링크 미리보기에 보일 페이지 제목 */
  title: string;
  /** 검색 엔진 및 링크 미리보기에 보일 설명 */
  description: string;
  /** 개인 화면(예: 마이페이지)의 검색 색인 제외 여부 */
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SERVICE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
