import { getMbtiTypeProfile, type MbtiTypeProfile } from "@/data/types";
import { MBTI_TYPES, type MbtiType } from "@/lib/mbti";
import { supabase } from "@/lib/supabase";
import { isValidMbtiCode } from "@/lib/testResults";

/** 막대 그래프 한 줄에 보여 줄 유형별 통계 정보입니다. */
export interface TypeStatItem {
  /** 유형 코드, 별명, 대표 색상, 3D 캐릭터 정보 */
  profile: MbtiTypeProfile;
  /** 이 유형이 저장된 횟수 */
  count: number;
  /** 전체 결과 중 차지하는 비율 (0 ~ 100 숫자) */
  percentage: number;
  /** 화면에 보여 줄 비율 문자열 (예: "25", "12.5") */
  percentageText: string;
}

/** 통계 페이지 전체에 전달할 요약 데이터입니다. */
export interface StatsSummary {
  /** 모든 회원이 저장한 전체 결과 수 */
  totalCount: number;
  /** 가장 많이 저장된 대표 유형 (결과가 없으면 null) */
  topType: TypeStatItem | null;
  /** 개수 많은 순서대로 정렬된 16가지 유형 전체 목록 */
  items: TypeStatItem[];
}

/** 퍼센트 숫자를 보기 좋게 소수 첫째 자리까지 정리합니다 (딱 떨어지면 정수). */
function formatPercentage(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * Supabase 의 get_type_stats() 함수를 실행해 16가지 유형 통계를 계산합니다.
 * - DB 함수는 저장된 유형만 돌려주므로, 아직 0개인 유형도 합쳐 16개를 모두 정렬해 반환합니다.
 */
export async function fetchTypeStatsSummary(): Promise<StatsSummary> {
  const { data, error } = await supabase.rpc("get_type_stats");

  if (error) {
    throw error;
  }

  // 16가지 유형의 개수를 0으로 초기화한 뒤 DB 함수 결과로 채웁니다.
  const countMap = new Map<MbtiType, number>(
    MBTI_TYPES.map((code) => [code, 0]),
  );

  const rows = Array.isArray(data) ? data : [];
  for (const row of rows) {
    if (typeof row !== "object" || row === null) continue;

    const record = row as { mbti_type?: unknown; count?: unknown };
    if (!isValidMbtiCode(record.mbti_type)) continue;

    const numericCount = Number(record.count);
    if (!Number.isFinite(numericCount) || numericCount < 0) continue;

    countMap.set(record.mbti_type, Math.floor(numericCount));
  }

  // 모든 유형의 개수를 더해 전체 저장 결과 수를 구합니다.
  let totalCount = 0;
  for (const count of countMap.values()) {
    totalCount += count;
  }

  // 16개 유형 전체를 개수 내림차순(동률이면 코드 알파벳순)으로 정렬합니다.
  const items: TypeStatItem[] = MBTI_TYPES.map((code) => {
    const count = countMap.get(code) ?? 0;
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

    return {
      profile: getMbtiTypeProfile(code),
      count,
      percentage,
      percentageText: formatPercentage(percentage),
    };
  }).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.profile.code.localeCompare(b.profile.code);
  });

  return {
    totalCount,
    topType: totalCount > 0 ? (items[0] ?? null) : null,
    items,
  };
}

/**
 * 통계 조회 중 발생한 오류를 한국어 안내 문장으로 바꿉니다.
 */
export function getStatsErrorMessage(error: unknown): string {
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

  // SQL Editor 에서 stats.sql 을 아직 실행하지 않은 경우
  if (
    code === "pgrst202" ||
    code === "42883" ||
    message.includes("get_type_stats") ||
    message.includes("could not find the function")
  ) {
    return "통계 함수(get_type_stats)를 찾지 못했어요. Supabase SQL Editor 에서 supabase/stats.sql 을 먼저 실행해 주세요.";
  }

  // 실행 권한(GRANT EXECUTE)이 없는 경우
  if (code === "42501" || message.includes("permission denied")) {
    return "통계 함수를 실행할 권한이 없어요. supabase/stats.sql 의 권한 설정을 확인해 주세요.";
  }

  // 네트워크 연결 문제인 경우
  if (
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("fetch")
  ) {
    return "네트워크 연결이 불안정해 통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  return "통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
}
