import type { Metadata } from "next";
import StatsView from "@/components/StatsView";
import { createPageMetadata } from "@/lib/metadata";

/** 통계 페이지('/stats') 제목, 설명 및 링크 공유(Open Graph) 정보 */
export const metadata: Metadata = createPageMetadata({
  title: "참여 통계 | 돌고래 MBTI",
  description:
    "돌고래 MBTI 참여자들이 저장한 16가지 성격 유형 순위와 분포를 확인해 보세요.",
});

/**
 * 모든 회원이 저장한 MBTI 결과를 집계해 보여 주는 공개 통계 페이지('/stats')입니다.
 */
export default function StatsPage() {
  return <StatsView />;
}
