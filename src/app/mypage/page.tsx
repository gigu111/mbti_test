import type { Metadata } from "next";
import MyPageView from "@/components/MyPageView";
import { createPageMetadata } from "@/lib/metadata";

/** 마이페이지('/mypage') 제목, 설명 및 검색 엔진 제외 설정 */
export const metadata: Metadata = createPageMetadata({
  title: "마이페이지 | 돌고래 MBTI",
  description:
    "내가 저장한 MBTI 검사 기록과 최근 3D 동물 캐릭터를 다시 확인해 보세요.",
  noIndex: true,
});

/**
 * 로그인한 회원이 자신의 저장된 MBTI 검사 기록을 확인하는 마이페이지('/mypage')입니다.
 */
export default function MyPage() {
  return <MyPageView />;
}
