import type { Metadata } from "next";
import TypesEncyclopedia from "@/components/TypesEncyclopedia";
import { createPageMetadata } from "@/lib/metadata";

/** 유형 도감 페이지('/types') 제목, 설명 및 링크 공유(Open Graph) 정보 */
export const metadata: Metadata = createPageMetadata({
  title: "16가지 유형 도감 | 돌고래 MBTI",
  description:
    "16가지 MBTI 성격 유형별 3D 동물 캐릭터와 특징을 한눈에 둘러보세요.",
});

/**
 * 16가지 MBTI 유형과 3D 동물 캐릭터를 모아 보는 '유형 도감' 페이지('/types')입니다.
 */
export default function TypesPage() {
  return <TypesEncyclopedia />;
}
