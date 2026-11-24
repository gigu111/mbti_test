import type { MbtiTrait } from "@/data/questions";

/** 16가지 MBTI 성격 유형 전체 목록 */
export const MBTI_TYPES = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
] as const;

/** 16가지 MBTI 유형 코드 타입 */
export type MbtiType = (typeof MBTI_TYPES)[number];

/** 전달받은 값이 16가지 MBTI 유형 코드 중 하나인지 검사합니다. */
export function isValidMbtiType(value: unknown): value is MbtiType {
  return (
    typeof value === "string" &&
    (MBTI_TYPES as readonly string[]).includes(value)
  );
}

/**
 * 사용자가 선택한 성향 글자 목록을 바탕으로 최종 MBTI 4글자를 계산합니다.
 * - E/I, S/N, T/F, J/P 각 지표마다 더 많이 고른 쪽 글자를 선택합니다.
 * - 고른 글자 4개를 순서대로 이어 붙여 유형 코드(예: "ENFP")를 만듭니다.
 */
export function calculateMbtiType(selectedTraits: readonly MbtiTrait[]): MbtiType {
  // 8가지 성향이 각각 몇 번 선택되었는지 저장할 개수표
  const counts: Record<MbtiTrait, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // 사용자가 고른 성향을 하나씩 순회하며 개수를 1씩 늘립니다.
  for (const trait of selectedTraits) {
    counts[trait] += 1;
  }

  // 각 지표에서 더 많이 선택된 성향 글자를 하나씩 결정합니다.
  const ei = counts.E >= counts.I ? "E" : "I";
  const sn = counts.S >= counts.N ? "S" : "N";
  const tf = counts.T >= counts.F ? "T" : "F";
  const jp = counts.J >= counts.P ? "J" : "P";

  return `${ei}${sn}${tf}${jp}`;
}
