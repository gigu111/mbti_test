import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

/**
 * 로그인 페이지('/login')입니다.
 * - useSearchParams()를 쓰는 LoginForm을 Suspense 로 감싸 Next.js 정적 생성 오류를 막습니다.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="-mx-5 -mt-4 -mb-6 flex flex-1 items-center justify-center bg-[#e9fcf5] px-5 py-10 text-sm font-medium text-slate-500">
          로그인 화면을 불러오는 중입니다...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
