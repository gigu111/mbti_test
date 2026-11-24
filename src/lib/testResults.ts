import { MBTI_TYPES, type MbtiType } from "@/lib/mbti";
import { supabase } from "@/lib/supabase";

/**
 * test_results 테이블에서 읽어 온 검사 결과 한 건의 데이터 구조입니다.
 */
export interface TestResultRecord {
  /** DB가 자동으로 부여하는 고유 번호 */
  id: number;
  /** 저장된 4글자 MBTI 유형 코드 (예: "ENFP") */
  mbti_type: MbtiType;
  /** DB가 자동으로 기록한 저장 시각 (ISO 문자열) */
  created_at: string;
}

/**
 * 현재 로그인한 회원의 test_results 기록을 최신순으로 조회합니다.
 * - DB의 RLS 정책('본인 결과만 조회')에 따라 본인 기록만 안전하게 내려옵니다.
 */
export async function fetchMyTestResults(): Promise<TestResultRecord[]> {
  const { data, error } = await supabase
    .from("test_results")
    .select("id, mbti_type, created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  // 혹시 모를 잘못된 형식의 행은 걸러 내고 안전한 데이터만 반환합니다.
  return (data ?? []).flatMap((row) => {
    if (
      typeof row.id === "number" &&
      typeof row.created_at === "string" &&
      isValidMbtiCode(row.mbti_type)
    ) {
      return [
        {
          id: row.id,
          mbti_type: row.mbti_type,
          created_at: row.created_at,
        },
      ];
    }
    return [];
  });
}

/** 전달받은 값이 16가지 MBTI 유형 코드 중 하나인지 확인합니다. */
export function isValidMbtiCode(value: unknown): value is MbtiType {
  return (
    typeof value === "string" &&
    (MBTI_TYPES as readonly string[]).includes(value)
  );
}

/**
 * DB에서 받은 날짜 문자열을 '2026.11.17' 형식으로 바꿉니다.
 */
export function formatSavedDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

/**
 * Supabase test_results 조회·저장·삭제 중 발생한 오류를 한국어 안내 문장으로 바꿉니다.
 */
export function getTestResultErrorMessage(
  error: unknown,
  action: "save" | "load" | "delete",
): string {
  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message.toLowerCase()
      : error instanceof Error
        ? error.message.toLowerCase()
        : "";

  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code.toLowerCase()
      : "";

  // 테이블이 아직 만들어지지 않은 경우
  if (
    code === "42p01" ||
    code === "pgrst205" ||
    message.includes("does not exist") ||
    message.includes("could not find the table")
  ) {
    return "검사 기록 테이블(test_results)을 찾지 못했어요. Supabase SQL 설정을 확인해 주세요.";
  }

  // 로그인 세션 만료 또는 RLS 권한 오류인 경우
  if (
    code === "42501" ||
    code === "pgrst301" ||
    message.includes("permission denied") ||
    message.includes("row-level security") ||
    message.includes("jwt")
  ) {
    return "로그인 정보가 만료되었거나 접근 권한이 없어요. 다시 로그인해 주세요.";
  }

  // MBTI 유형 check 제약을 벗어난 경우
  if (
    code === "23514" ||
    message.includes("check constraint") ||
    message.includes("mbti_type")
  ) {
    return "올바른 MBTI 유형 코드(4글자)가 아니에요.";
  }

  // 네트워크 연결 문제인 경우
  if (
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("fetch")
  ) {
    return "네트워크 연결이 불안정해 서버와 통신하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  if (action === "save") {
    return "검사 결과를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  if (action === "delete") {
    return "검사 기록을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  return "저장된 검사 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
}
