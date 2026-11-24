import type { Metadata } from "next";
import TestQuiz from "@/components/TestQuiz";
import { createPageMetadata } from "@/lib/metadata";

/** 검사 페이지('/test') 제목, 설명 및 링크 공유(Open Graph) 정보 */
export const metadata: Metadata = createPageMetadata({
  title: "성격 유형 검사 | 돌고래 MBTI",
  description:
    "12개의 간단한 질문에 답하고 나의 MBTI 성격 유형과 3D 동물 캐릭터를 알아보세요.",
});

/**
 * 12개 문항을 한 화면에 하나씩 풀어보는 검사 페이지('/test')입니다.
 */
export default function TestPage() {
  return <TestQuiz />;
}
