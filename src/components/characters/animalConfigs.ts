import type { MbtiType } from "@/lib/mbti";

/** 동물 종류를 구분하기 위한 이름 타입 */
export type AnimalSpecies =
  | "owl"
  | "cat"
  | "lion"
  | "fox"
  | "deer"
  | "rabbit"
  | "dog"
  | "squirrel"
  | "turtle"
  | "bear"
  | "penguin"
  | "sheep"
  | "hedgehog"
  | "panda"
  | "monkey"
  | "parrot";

/** 동물별 외형 색상 및 기본 구조 옵션을 담는 설정 인터페이스 */
export interface AnimalVisualConfig {
  species: AnimalSpecies;
  /** 머리와 기본 몸통 색 */
  bodyColor: string;
  /** 배와 주둥이 등에 쓰는 밝은 포인트 색 */
  accentColor: string;
  /** 귀 안쪽·볼 등 보조 색 */
  detailColor: string;
  /** 코 또는 부리 색 */
  noseColor: string;
  /** 팔다리 색 (비워 두면 bodyColor 사용) */
  limbColor?: string;
  /** 얼굴색이 몸통과 다른 경우 사용 (예: 펭귄, 고슴도치) */
  faceColor?: string;
  /** 기본 둥근 주둥이 표시 여부 (새 부리·뾰족 코 등은 전용 부품 사용) */
  hasRoundMuzzle: boolean;
  /** 기본 팔 대신 날개/지느러미를 쓰는 동물인지 여부 */
  usesWings: boolean;
}

/**
 * 16가지 MBTI 유형 코드마다 어떤 동물과 색상 구성을 그릴지 연결한 설정표입니다.
 * - src/data/types.ts 의 유형별 동물 정보와 대표 색감을 바탕으로 알아보며 꾸몄습니다.
 */
export const ANIMAL_CONFIGS: Record<MbtiType, AnimalVisualConfig> = {
  INTJ: {
    species: "owl",
    bodyColor: "#9A8FC2", // 연보라(INTJ) 바탕의 차분한 부엉이 색
    accentColor: "#EFEAFF",
    detailColor: "#D6CEF7",
    noseColor: "#F4B860",
    hasRoundMuzzle: false,
    usesWings: true,
  },
  INTP: {
    species: "cat",
    bodyColor: "#B7CCE0", // 하늘빛 파스텔(INTP) 실버 고양이
    accentColor: "#F5F9FD",
    detailColor: "#F6B3C2",
    noseColor: "#F28BA3",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  ENTJ: {
    species: "lion",
    bodyColor: "#F2BC6B", // 살구·황금빛(ENTJ) 씩씩한 사자
    accentColor: "#FFF2D8",
    detailColor: "#D67E3A", // 갈기 색
    noseColor: "#4A2E20",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  ENTP: {
    species: "fox",
    bodyColor: "#F28B4E", // 따뜻한 주황빛(ENTP) 재치 여우
    accentColor: "#FFF7EE",
    detailColor: "#5C3D31",
    noseColor: "#2F201A",
    limbColor: "#5C3D31",
    hasRoundMuzzle: false,
    usesWings: false,
  },
  INFJ: {
    species: "deer",
    bodyColor: "#D4A373", // 포근한 밤색 사슴 + 숲속 민트 포인트
    accentColor: "#FAF4E8",
    detailColor: "#8A5E3B", // 뿔 색
    noseColor: "#3D291E",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  INFP: {
    species: "rabbit",
    bodyColor: "#FCE2EC", // 파스텔 핑크(INFP) 몽글 토끼
    accentColor: "#FFFFFF",
    detailColor: "#F6AFC7",
    noseColor: "#EE82A4",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  ENFJ: {
    species: "dog",
    bodyColor: "#E8B77D", // 따뜻한 골드 피치(ENFJ) 강아지
    accentColor: "#FFF5E8",
    detailColor: "#C58349", // 처진 귀 색
    noseColor: "#3B261C",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  ENFP: {
    species: "squirrel",
    bodyColor: "#DF8F52", // 밝은 캐러멜(ENFP) 다람쥐
    accentColor: "#FFF0D1",
    detailColor: "#C66E35", // 풍성한 꼬리 색
    noseColor: "#3D261C",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  ISTJ: {
    species: "turtle",
    bodyColor: "#8FD4B6", // 파스텔 민트 거북이 + 하늘빛 등딱지(ISTJ)
    accentColor: "#EAF6FF",
    detailColor: "#63A8D6", // 등딱지 색
    noseColor: "#355E4B",
    hasRoundMuzzle: false,
    usesWings: false,
  },
  ISFJ: {
    species: "bear",
    bodyColor: "#C88A55", // 포근한 베이지(ISFJ) 곰돌이
    accentColor: "#F7E3CC",
    detailColor: "#F2CFAF",
    noseColor: "#3A2419",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  ESTJ: {
    species: "penguin",
    bodyColor: "#33435B", // 깔끔한 네이비 펭귄 + 아이스블루(ESTJ) 포인트
    accentColor: "#F7FBFF",
    detailColor: "#BFE2FA",
    noseColor: "#F5A638",
    faceColor: "#33435B",
    hasRoundMuzzle: false,
    usesWings: true,
  },
  ESFJ: {
    species: "sheep",
    bodyColor: "#FFF8EA", // 크림(ESFJ) 몽실 아기양
    accentColor: "#FFFFFF",
    detailColor: "#F4D5BC", // 얼굴·귀 피부색
    noseColor: "#E996A7",
    faceColor: "#F6DEC9",
    limbColor: "#F4D5BC",
    hasRoundMuzzle: false,
    usesWings: false,
  },
  ISTP: {
    species: "hedgehog",
    bodyColor: "#8C7263", // 세이지/모카 톤(ISTP) 고슴도치
    accentColor: "#F3DFCB",
    detailColor: "#6E584B", // 가시 색
    noseColor: "#2F211B",
    faceColor: "#F3DFCB",
    limbColor: "#E2C6AD",
    hasRoundMuzzle: false,
    usesWings: false,
  },
  ISFP: {
    species: "panda",
    bodyColor: "#FAF8FD", // 라벤더 화이트(ISFP) 판다
    accentColor: "#FFFFFF",
    detailColor: "#322D3D", // 검은 귀·눈가 무늬
    noseColor: "#26222E",
    limbColor: "#322D3D",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  ESTP: {
    species: "monkey",
    bodyColor: "#B9794E", // 따뜻한 코랄 브라운(ESTP) 원숭이
    accentColor: "#FADCC2",
    detailColor: "#F8CEAC",
    noseColor: "#4A2B1D",
    hasRoundMuzzle: true,
    usesWings: false,
  },
  ESFP: {
    species: "parrot",
    bodyColor: "#FF7D8E", // 화려한 핑크(ESFP)·노랑·아쿠아 앵무새
    accentColor: "#FFD166", // 배 & 머리 위 보 노란 깃털
    detailColor: "#4ECDC4", // 날개 & 꼬리 청록 깃털
    noseColor: "#F4A261",
    hasRoundMuzzle: false,
    usesWings: true,
  },
};
