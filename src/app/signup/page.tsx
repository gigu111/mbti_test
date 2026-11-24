import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";
import { createPageMetadata } from "@/lib/metadata";

/** 회원가입 페이지('/signup') 제목, 설명 및 링크 공유(Open Graph) 정보 */
export const metadata: Metadata = createPageMetadata({
  title: "회원가입 | 돌고래 MBTI",
  description:
    "닉네임과 이메일로 돌고래 MBTI 에 가입해 나의 검사 결과를 저장해 보세요.",
});

/**
 * 이메일 + 비밀번호 방식으로 새 계정을 만드는 회원가입 페이지('/signup')입니다.
 */
export default function SignupPage() {
  return <SignupForm />;
}
