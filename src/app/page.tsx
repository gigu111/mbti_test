import Link from "next/link";

// 첫 화면에 보여줄 서비스 특징 카드 3개의 데이터 목록
const FEATURE_CARDS = [
  {
    title: "12문항 · 2분",
    description: "부담 없이 가볍게 답하는 짧은 질문",
    badgeClass: "bg-sky-100 text-sky-600",
    // 시계 모양 아이콘
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 7.5V12L15 13.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "16가지 유형",
    description: "나만의 성향과 매력 포인트를 한눈에",
    badgeClass: "bg-violet-100 text-violet-600",
    // 4칸 성격 유형 그리드 아이콘
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "유형별 3D 캐릭터",
    description: "각 성격에 어울리는 귀여운 3D 동물 친구",
    badgeClass: "bg-teal-100 text-teal-600",
    // 입체 큐브(3D) 아이콘
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3.5L19.5 7.8V16.2L12 20.5L4.5 16.2V7.8L12 3.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 7.8L12 12L19.5 7.8M12 12V20.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/**
 * 서비스의 첫 화면('/') 페이지 컴포넌트입니다.
 * - 상단 히어로 카드: 큰 제목, 한 줄 소개, '검사 시작하기' 버튼
 * - 중단: 특징 카드 3개
 * - 하단: 간이 검사 안내 문구
 */
export default function Home() {
  return (
    /* 첫 화면 전체를 연한 민트색 계열 배경으로 채우기 위해 부모 여백(px-5 pt-4 pb-6)을 상쇄한 뒤 내부 여백을 다시 줍니다. */
    <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col gap-3.5 bg-gradient-to-b from-[#d8f8ec] via-[#e9fcf5] to-[#f4fefb] px-5 pt-4 pb-6">
      {/* 1. 첫 화면 핵심 소개 및 검사 시작 버튼 카드 */}
      <section className="rounded-3xl bg-white/92 px-6 py-5.5 text-center shadow-[0_14px_40px_-14px_rgba(52,168,138,0.2)] ring-1 ring-emerald-100/90">
        {/* 파스텔 톤 돌고래 일러스트 배지 */}
        <div
          aria-hidden="true"
          className="mx-auto mb-3.5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 shadow-inner ring-4 ring-white"
        >
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-12 w-12"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 부드러운 물결 */}
            <path
              d="M10 47C15 43.5 20 43.5 25 47C30 50.5 35 50.5 40 47C45 43.5 50 43.5 54 46"
              stroke="#7dd3fc"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* 귀여운 돌고래 본체 */}
            <path
              d="M13 38C17.5 25.5 27.5 17 39.5 17C44.5 17 49 19 52.5 22.5C55.2 25.1 57 27.5 58 29.5C53.2 29.8 49.5 31.3 46.2 33.4C41.8 36.2 36.8 38.5 30.2 38.5C26 38.5 22.6 37.6 19.6 36.1L12.5 41.2L15.1 34.4L13 38Z"
              fill="#38bdf8"
            />
            {/* 등지느러미 */}
            <path
              d="M32.5 18.2L35.8 10.5C39.2 12.2 40.8 15.2 41.2 18.2"
              fill="#0ea5e9"
            />
            {/* 눈 */}
            <circle cx="46.2" cy="24.5" r="2.2" fill="#ffffff" />
            <circle cx="46.7" cy="24.5" r="1" fill="#0f172a" />
            {/* 작은 물방울 포인트 */}
            <circle cx="21" cy="18" r="2.4" fill="#bae6fd" />
            <circle cx="16" cy="24" r="1.6" fill="#a7f3d0" />
          </svg>
        </div>

        {/* 작은 상단 뱃지 */}
        <p className="mb-2 inline-flex items-center rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-emerald-200/80">
          3D 동물 캐릭터 성격 유형 검사
        </p>

        {/* 큰 제목 */}
        <h1 className="text-[26px] leading-snug font-extrabold tracking-tight text-slate-800">
          나는 어떤 유형일까?
        </h1>

        {/* 한 줄 소개 문구 (한글 단어 단위로 깔끔하게 줄바꿈되도록 break-keep 적용) */}
        <p className="mt-2 break-keep text-[15px] leading-relaxed text-slate-600">
          12개 질문에 답하고 나만의 3D 동물 캐릭터를 만나보세요.
        </p>

        {/* 더 크고 누르기 쉬운 검사 시작하기 버튼 (/test 로 이동) */}
        <Link
          href="/test"
          className="mt-5 flex h-16 w-full items-center justify-center gap-2.5 rounded-[20px] bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] px-6 text-[19px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(38,166,234,0.7)] transition-all hover:brightness-105 hover:shadow-[0_16px_34px_-10px_rgba(38,166,234,0.8)] active:scale-[0.98]"
        >
          <span>검사 시작하기</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 10H15.5M15.5 10L11 5.5M15.5 10L11 14.5"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </section>

      {/* 2. 서비스 특징 카드 3개 */}
      <section aria-label="검사 특징" className="flex flex-col gap-2.5">
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.title}
            className="flex items-center gap-3.5 rounded-2xl bg-white/88 px-4 py-3 shadow-[0_8px_24px_-12px_rgba(52,168,138,0.18)] ring-1 ring-emerald-100/80"
          >
            {/* 특징별 파스텔 아이콘 배지 */}
            <div
              aria-hidden="true"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${card.badgeClass}`}
            >
              {card.icon}
            </div>

            {/* 특징 제목 및 짧은 설명 */}
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-slate-800">{card.title}</h2>
              <p className="mt-0.5 text-xs text-slate-500">{card.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. 맨 아래 작은 안내 문구 */}
      <footer className="mt-auto pt-2 text-center">
        <p className="break-keep text-[11px] leading-relaxed text-slate-500/85">
          이 검사는 재미로 보는 간이 검사이며, 공식 MBTI® 검사가 아닙니다.
        </p>
      </footer>
    </div>
  );
}
