/**
 * 로그인·회원가입 화면에서 함께 쓰는 인증 도우미 함수와 공통 스타일입니다.
 */

/** 입력 칸에 공통으로 적용하는 모바일 친화적 스타일 */
export const AUTH_INPUT_CLASS =
  "mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Supabase Auth 에서 내려오는 영어 오류를 사용자가 이해하기 쉬운 한국어 문장으로 바꿉니다.
 */
export function getAuthErrorMessage(error: unknown): string {
  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message.toLowerCase()
      : "";

  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code.toLowerCase()
      : "";

  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    message.includes("already registered") ||
    message.includes("already exists")
  ) {
    return "이미 가입된 이메일이에요.";
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials")
  ) {
    return "이메일 또는 비밀번호가 올바르지 않아요.";
  }

  if (
    code === "weak_password" ||
    message.includes("at least") ||
    message.includes("password should be")
  ) {
    return "비밀번호는 6자 이상 입력해 주세요.";
  }

  if (
    code === "email_not_confirmed" ||
    message.includes("email not confirmed")
  ) {
    return "이메일 인증이 아직 끝나지 않았어요. 받은 메일의 링크를 누른 뒤 로그인해 주세요.";
  }

  if (
    code === "validation_failed" ||
    message.includes("invalid email") ||
    message.includes("unable to validate email")
  ) {
    return "올바른 이메일 형식으로 입력해 주세요.";
  }

  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  ) {
    return "요청이 잠시 몰렸어요. 조금 뒤에 다시 시도해 주세요.";
  }

  return "처리하는 중 문제가 발생했어요. 입력 내용을 확인한 뒤 다시 시도해 주세요.";
}

/**
 * 로그인 성공 뒤 이동할 next 주소가 안전한 내부 경로인지 검사합니다.
 * - '/' 로 시작하는 우리 사이트 안의 경로만 허용하고, 외부 주소나 '//' 로 시작하는 주소는 홈('/')으로 돌립니다.
 */
export function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam) {
    return "/";
  }

  const trimmed = nextParam.trim();

  // '//evil.com' 또는 '/\evil.com' 같은 외부 이동 시도를 막기 위해 단일 '/' 경로만 허용합니다.
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return "/";
  }

  return trimmed;
}
