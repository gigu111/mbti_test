/**
 * MBTI의 4가지 성격 지표를 구분하는 타입입니다.
 * - EI: 에너지 방향 (외향 E / 내향 I)
 * - SN: 인식 방식 (감각 S / 직관 N)
 * - TF: 판단 기준 (사고 T / 감정 F)
 * - JP: 생활 양식 (판단 J / 인식 P)
 */
export type MbtiDimension = "EI" | "SN" | "TF" | "JP";

/** 선택지가 가리키는 8가지 성향 글자 타입입니다. */
export type MbtiTrait = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

/** 문항 하나에 들어가는 선택지 1개의 데이터 모양입니다. */
export interface QuestionOption {
  /** 화면의 선택 버튼에 보여줄 문장 */
  label: string;
  /** 이 선택지를 골랐을 때 점수가 올라가는 MBTI 성향 글자 */
  trait: MbtiTrait;
}

/** 검사 문항 1개의 전체 데이터 모양입니다. */
export interface Question {
  /** 문항 번호 (1부터 12까지) */
  id: number;
  /** 이 문항이 측정하는 성격 지표 */
  dimension: MbtiDimension;
  /** 사용자에게 물어보는 짧은 한 문장 질문 */
  prompt: string;
  /** 반드시 2개의 선택지만 담도록 정한 배열(튜플) 타입 */
  options: [QuestionOption, QuestionOption];
}

/**
 * 돌고래 MBTI 검사에 사용하는 전체 12개 문항 목록입니다.
 * - E/I, S/N, T/F, J/P 각 지표마다 3문항씩 들어 있습니다.
 * - 같은 지표의 질문이 연속으로 나오지 않도록 순서를 섞어 배치했습니다.
 */
export const QUESTIONS: Question[] = [
  {
    id: 1,
    dimension: "EI",
    prompt: "긴 연휴가 시작된 첫날, 가장 먼저 하고 싶은 일은 무엇인가요?",
    options: [
      {
        label: "친구들에게 연락해 반가운 모임 약속을 잡아요.",
        trait: "E",
      },
      {
        label: "집에서 좋아하는 간식을 먹으며 혼자만의 시간을 보내요.",
        trait: "I",
      },
    ],
  },
  {
    id: 2,
    dimension: "SN",
    prompt: "처음 가 본 동네를 산책할 때 주로 어떤 점에 눈이 가나요?",
    options: [
      {
        label: "골목 분위기에서 떠오르는 이야기나 상상이 먼저 펼쳐져요.",
        trait: "N",
      },
      {
        label: "간판 글씨나 가게 진열처럼 눈에 보이는 디테일이 먼저 들어와요.",
        trait: "S",
      },
    ],
  },
  {
    id: 3,
    dimension: "TF",
    prompt: "친구가 서툰 요리를 대접하며 맛을 물어본다면 어떻게 답하시겠어요?",
    options: [
      {
        label: "정성껏 만들어 준 마음이 고마워서 맛있다고 따뜻하게 말해 줘요.",
        trait: "F",
      },
      {
        label: "고마운 마음을 전하면서도 다음엔 더 맛있게 되도록 솔직한 팁을 보태요.",
        trait: "T",
      },
    ],
  },
  {
    id: 4,
    dimension: "JP",
    prompt: "며칠 뒤 떠날 여행 짐을 챙길 때 보통 어떤 모습에 가깝나요?",
    options: [
      {
        label: "며칠 전부터 필요한 물건 목록을 적어 하나씩 체크하며 챙겨요.",
        trait: "J",
      },
      {
        label: "출발 전날 밤이나 당일에 필요한 걸 떠올리며 유연하게 챙겨요.",
        trait: "P",
      },
    ],
  },
  {
    id: 5,
    dimension: "SN",
    prompt: "새로운 카페에 가면 메뉴를 고를 때 어떤 편이신가요?",
    options: [
      {
        label: "재료 설명과 리뷰를 꼼꼼히 보고 실패 없을 메뉴를 골라요.",
        trait: "S",
      },
      {
        label: "이름이나 색감이 독특해서 느낌 오는 새로운 메뉴에 도전해 봐요.",
        trait: "N",
      },
    ],
  },
  {
    id: 6,
    dimension: "EI",
    prompt: "모르는 사람이 많은 자리에서 자연스럽게 취하는 행동은 무엇인가요?",
    options: [
      {
        label: "조용히 분위기를 살피다가 한두 명과 깊이 이야기를 나눠요.",
        trait: "I",
      },
      {
        label: "먼저 가볍게 인사를 건네며 여러 사람과 대화를 이어 가요.",
        trait: "E",
      },
    ],
  },
  {
    id: 7,
    dimension: "JP",
    prompt: "약속 시간까지 한 시간 정도 비었을 때 주로 어떻게 보내시나요?",
    options: [
      {
        label: "발길 닿는 대로 주변 가게를 구경하며 즉흥적으로 시간을 보내요.",
        trait: "P",
      },
      {
        label: "근처 카페 위치를 미리 확인하고 할 일을 정리하며 기다려요.",
        trait: "J",
      },
    ],
  },
  {
    id: 8,
    dimension: "TF",
    prompt: "지인이 고민을 털어놓을 때 머릿속에 먼저 떠오르는 반응은 무엇인가요?",
    options: [
      {
        label: "지금 상황에서 가장 도움이 될 만한 해결 방법부터 정리해 봐요.",
        trait: "T",
      },
      {
        label: "얼마나 속상하고 힘들었을지 상대의 기분부터 함께 느껴 봐요.",
        trait: "F",
      },
    ],
  },
  {
    id: 9,
    dimension: "EI",
    prompt: "바쁜 한 주를 마친 금요일 저녁, 어떻게 쉬면 기운이 다시 나나요?",
    options: [
      {
        label: "가까운 사람들과 맛있는 걸 먹으며 수다를 떨어야 풀려요.",
        trait: "E",
      },
      {
        label: "아무 말 없이 조용한 공간에서 나만의 리듬으로 쉬어야 풀려요.",
        trait: "I",
      },
    ],
  },
  {
    id: 10,
    dimension: "JP",
    prompt: "갑자기 다음 날 일정이 통째로 바뀌었을 때 기분이 어떠신가요?",
    options: [
      {
        label: "세워 둔 계획이 어긋나서 머릿속을 빨리 다시 정리해야 편해요.",
        trait: "J",
      },
      {
        label: "오히려 새로운 변수가 생겨서 가볍게 흐름에 맡겨 보게 돼요.",
        trait: "P",
      },
    ],
  },
  {
    id: 11,
    dimension: "SN",
    prompt: "재미있게 본 영화가 끝난 뒤 가장 기억에 오래 남는 부분은 무엇인가요?",
    options: [
      {
        label: "장면 너머에 담긴 숨은 의미와 나만의 해석이 오래 맴돌아요.",
        trait: "N",
      },
      {
        label: "인상 깊었던 대사나 장면의 색감, 연출 같은 실제 모습이 선명해요.",
        trait: "S",
      },
    ],
  },
  {
    id: 12,
    dimension: "TF",
    prompt: "중요한 물건을 하나 새로 살 때 마음을 결정짓는 기준은 무엇인가요?",
    options: [
      {
        label: "들고 다닐 때마다 기분이 좋아지고 애정이 갈 만한 느낌이 중요해요.",
        trait: "F",
      },
      {
        label: "가격 대비 성능과 오래 쓸 수 있는 실용성을 꼼꼼히 따져 봐요.",
        trait: "T",
      },
    ],
  },
];
