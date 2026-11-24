"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AUTH_INPUT_CLASS,
  getAuthErrorMessage,
  getSafeNextPath,
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/**
 * 이메일 + 비밀번호 로그인 폼 클라이언트 컴포넌트입니다.
 * - URL 의 next 쿼리 값을 읽어 안전한 내부 경로('/')인 경우에만 로그인 후 이동합니다.
 */
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 로그인 양식을 제출했을 때 입력값을 확인하고 Supabase Auth signInWithPassword 를 호출합니다. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage("이메일을 입력해 주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("올바른 이메일 형식으로 입력해 주세요.");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error));
        return;
      }

      // 주소의 next 값이 '/' 로 시작하는 우리 사이트 내부 주소일 때만 그곳으로 이동합니다.
      const destination = getSafeNextPath(searchParams.get("next"));
      router.replace(destination);
    } catch {
      setErrorMessage(
        "로그인 요청 중 연결에 실패했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col justify-center bg-gradient-to-b from-[#d8f8ec] via-[#e9fcf5] to-[#f4fefb] px-5 py-6">
      <section className="w-full rounded-3xl bg-white/95 px-6 py-7 shadow-[0_14px_40px_-14px_rgba(52,168,138,0.2)] ring-1 ring-emerald-100/90">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full bg-sky-50 px-3.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200/80">
            로그인
          </p>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-800">
            다시 오셨네요!
          </h1>
          <p className="mt-1.5 break-keep text-sm text-slate-500">
            가입하신 이메일과 비밀번호를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-bold text-slate-700"
            >
              이메일
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              className={AUTH_INPUT_CLASS}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-bold text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              className={AUTH_INPUT_CLASS}
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 ring-1 ring-rose-200/80"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] px-6 text-[16px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(38,166,234,0.6)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "처리 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          아직 회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="font-bold text-sky-600 underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </section>
    </div>
  );
}
