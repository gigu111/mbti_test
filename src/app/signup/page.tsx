"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_INPUT_CLASS, getAuthErrorMessage } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/**
 * 이메일 + 비밀번호 방식으로 새 계정을 만드는 회원가입 페이지('/signup')입니다.
 * - 닉네임, 이메일, 비밀번호(6자 이상), 비밀번호 확인을 입력받습니다.
 * - 닉네임은 별도 테이블 없이 Supabase 사용자 정보(user_metadata.nickname)에 함께 저장합니다.
 */
export default function SignupPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 회원가입 양식을 제출했을 때 입력값을 검사하고 Supabase Auth signUp 을 호출합니다. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setNoticeMessage("");

    const trimmedNickname = nickname.trim();
    const trimmedEmail = email.trim();

    if (!trimmedNickname) {
      setErrorMessage("닉네임을 입력해 주세요.");
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage("이메일을 입력해 주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("올바른 이메일 형식으로 입력해 주세요.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상 입력해 주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호 확인이 일치하지 않아요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          // 닉네임은 auth.users 의 user_metadata.nickname 에 함께 저장합니다.
          data: {
            nickname: trimmedNickname,
          },
        },
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error));
        return;
      }

      // 이메일 인증이 켜진 프로젝트에서는 이미 가입된 이메일로 요청 시 오류 대신 identities 가 빈 배열로 올 수 있습니다.
      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        setErrorMessage("이미 가입된 이메일이에요.");
        return;
      }

      // 이메일 인증이 꺼져 있어 가입과 동시에 세션이 생성되면 바로 로그인된 상태로 홈으로 이동합니다.
      if (data.session) {
        router.replace("/");
        return;
      }

      // 이메일 인증이 켜져 있어 세션이 아직 없다면 메일 확인 안내 문구를 보여 줍니다.
      setNoticeMessage(
        "가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.",
      );
    } catch {
      setErrorMessage(
        "가입 요청 중 연결에 실패했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col justify-center bg-gradient-to-b from-[#d8f8ec] via-[#e9fcf5] to-[#f4fefb] px-5 py-6">
      <section className="w-full rounded-3xl bg-white/95 px-6 py-7 shadow-[0_14px_40px_-14px_rgba(52,168,138,0.2)] ring-1 ring-emerald-100/90">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-emerald-200/80">
            회원가입
          </p>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-800">
            돌고래 MBTI 시작하기
          </h1>
          <p className="mt-1.5 break-keep text-sm text-slate-500">
            닉네임과 이메일을 등록하면 검사 결과를 저장할 수 있어요.
          </p>
        </div>

        {/* 이메일 인증 대기 안내 화면 */}
        {noticeMessage ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-5 text-center ring-1 ring-emerald-200/80">
            <p
              role="status"
              className="break-keep text-sm leading-relaxed font-semibold text-teal-800"
            >
              {noticeMessage}
            </p>
            <Link
              href="/login"
              className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] px-5 text-sm font-bold text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.98]"
            >
              로그인 페이지로 이동
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="signup-nickname"
                className="block text-sm font-bold text-slate-700"
              >
                닉네임
              </label>
              <input
                id="signup-nickname"
                type="text"
                autoComplete="nickname"
                placeholder="예: 반짝 돌고래"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                disabled={isSubmitting}
                className={AUTH_INPUT_CLASS}
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-bold text-slate-700"
              >
                이메일
              </label>
              <input
                id="signup-email"
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
                htmlFor="signup-password"
                className="block text-sm font-bold text-slate-700"
              >
                비밀번호 (6자 이상)
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="6자 이상 입력해 주세요"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                className={AUTH_INPUT_CLASS}
              />
            </div>

            <div>
              <label
                htmlFor="signup-password-confirm"
                className="block text-sm font-bold text-slate-700"
              >
                비밀번호 확인
              </label>
              <input
                id="signup-password-confirm"
                type="password"
                autoComplete="new-password"
                placeholder="비밀번호를 한 번 더 입력해 주세요"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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
              {isSubmitting ? "처리 중..." : "가입하기"}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-slate-500">
          이미 회원이신가요?{" "}
          <Link
            href="/login"
            className="font-bold text-sky-600 underline-offset-4 hover:underline"
          >
            로그인
          </Link>
        </p>
      </section>
    </div>
  );
}
