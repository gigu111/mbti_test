import { Suspense } from "react";
import Link from "next/link";
import CharacterViewer from "@/components/characters/CharacterViewer";
import ShareResultButton from "@/components/ShareResultButton";
import { getMbtiTypeProfile } from "@/data/types";
import { MBTI_TYPES, type MbtiType } from "@/lib/mbti";

/**
 * 빌드 시 16가지 MBTI 결과 페이지('/result/ENFP' 등)를 미리 생성하기 위한 목록입니다.
 */
export function generateStaticParams() {
  return MBTI_TYPES.map((type) => ({ type }));
}

/** 전달받은 문자열이 16가지 MBTI 유형 코드 중 하나인지 검사합니다. */
function isValidMbtiType(value: string): value is MbtiType {
  return (MBTI_TYPES as readonly string[]).includes(value);
}

/** URL에서 type 값을 꺼내 해당 유형의 상세 결과(또는 없는 유형 안내)를 렌더링합니다. */
async function ResultContent({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  // 소문자(/result/enfp)로 접속해도 대문자(ENFP)로 변환해 조회합니다.
  const normalizedType = type.toUpperCase();

  // 16가지 MBTI 유형에 없는 코드라면 안내 문구와 홈 이동 버튼을 보여줍니다.
  if (!isValidMbtiType(normalizedType)) {
    return (
      <div className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#e8f6f2] via-[#f2fbf8] to-[#ffffff] px-5 py-10">
        <section className="w-full rounded-3xl bg-white/95 px-6 py-10 text-center shadow-[0_14px_40px_-14px_rgba(52,168,138,0.18)] ring-1 ring-emerald-100">
          <p className="mb-3 inline-flex items-center rounded-full bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-600 ring-1 ring-rose-200/80">
            유형 확인 불가
          </p>
          <h1 className="text-2xl font-extrabold text-slate-800">
            없는 유형이에요
          </h1>
          <p className="mt-2.5 break-keep text-sm leading-relaxed text-slate-500">
            주소에 입력된 유형 코드를 다시 확인하거나 첫 화면으로 돌아가 검사를 시작해 보세요.
          </p>
          <Link
            href="/"
            className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] px-6 text-[16px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(38,166,234,0.6)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            홈으로 가기
          </Link>
        </section>
      </div>
    );
  }

  // 해당 MBTI 유형의 상세 데이터 꺼내기
  const profile = getMbtiTypeProfile(normalizedType);

  // 잘 맞는 유형 2개의 상세 정보 미리 조회하기
  const compatibleProfiles = profile.compatibleTypes.map((code) =>
    getMbtiTypeProfile(code),
  );

  return (
    /* 유형의 대표 색상이 페이지 전체에 은은하게 깔리도록 그라데이션 배경 적용 */
    <div
      className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col gap-4 px-5 pt-6 pb-8"
      style={{
        background: `linear-gradient(180deg, color-mix(in srgb, ${profile.color} 78%, #ffffff) 0%, color-mix(in srgb, ${profile.color} 38%, #ffffff) 52%, #ffffff 100%)`,
      }}
    >
      {/* 1. 상단 유형 소개: "당신의 유형은", 유형 코드(크게), 별명 */}
      <section className="rounded-3xl bg-white/88 px-5 py-6 text-center shadow-[0_14px_40px_-14px_rgba(71,85,105,0.16)] ring-1 ring-white">
        <p className="inline-flex items-center rounded-full bg-slate-100/80 px-3.5 py-1 text-xs font-semibold text-slate-600">
          당신의 유형은
        </p>

        <h1 className="mt-3 text-5xl font-extrabold tracking-widest text-slate-800">
          {profile.code}
        </h1>

        <p className="mt-2.5 break-keep text-lg font-bold text-slate-700">
          {profile.nickname}
        </p>

        {/* 2. 캐릭터 자리: 대표 색상 배경의 둥근 무대 위에 해당 유형의 3D 캐릭터 표시 */}
        <div
          className="relative mt-4 h-[284px] w-full overflow-hidden rounded-3xl shadow-inner ring-2 ring-white/85"
          style={{ backgroundColor: profile.color }}
        >
          <CharacterViewer type={profile.code} />
          <p className="pointer-events-none absolute right-3 bottom-2.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-xs backdrop-blur-xs">
            {profile.character.name}
          </p>
        </div>
      </section>

      {/* 3. 한 줄 소개와 성격 설명 */}
      <section className="rounded-3xl bg-white/90 px-6 py-6 shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white">
        <h2 className="sr-only">유형 소개 및 성격 설명</h2>
        <p className="break-keep text-[16px] leading-relaxed font-bold text-slate-800">
          {profile.summary}
        </p>
        <p className="mt-3 break-keep text-[14.5px] leading-relaxed text-slate-600">
          {profile.description}
        </p>
      </section>

      {/* 4. 강점 목록과 조심할 점 목록 */}
      <section className="flex flex-col gap-4 rounded-3xl bg-white/90 px-6 py-6 shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white">
        {/* 강점 3가지 */}
        <div>
          <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-slate-800">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400"
            />
            <span>강점</span>
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {profile.strengths.map((strength) => (
              <li
                key={strength}
                className="flex items-start gap-2.5 rounded-2xl bg-emerald-50/70 px-4 py-3 text-sm leading-relaxed text-slate-700"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-bold text-emerald-600"
                >
                  ✓
                </span>
                <span className="break-keep">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 조심할 점 2가지 */}
        <div className="border-t border-slate-100 pt-4">
          <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-slate-800">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400"
            />
            <span>조심할 점</span>
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {profile.cautions.map((caution) => (
              <li
                key={caution}
                className="flex items-start gap-2.5 rounded-2xl bg-amber-50/75 px-4 py-3 text-sm leading-relaxed text-slate-700"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-bold text-amber-600"
                >
                  !
                </span>
                <span className="break-keep">{caution}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. 잘 맞는 유형 2개 (누르면 해당 유형의 결과 페이지로 이동) */}
      <section className="rounded-3xl bg-white/90 px-6 py-6 shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white">
        <h2 className="text-[15px] font-extrabold text-slate-800">
          잘 맞는 유형
        </h2>
        <div className="mt-3.5 grid grid-cols-2 gap-3">
          {compatibleProfiles.map((partner) => (
            <Link
              key={partner.code}
              href={`/result/${partner.code}`}
              className="group flex flex-col items-center justify-center rounded-2xl px-3 py-4 text-center shadow-xs ring-1 ring-slate-200/70 transition-all hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
              style={{
                backgroundColor: `color-mix(in srgb, ${partner.color} 55%, #ffffff)`,
              }}
            >
              <span className="text-xl font-extrabold tracking-wider text-slate-800">
                {partner.code}
              </span>
              <span className="mt-1 text-xs font-semibold text-slate-600">
                {partner.character.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. 하단 버튼 2개: '다시 검사하기'(/test) + '결과 공유하기'(주소 복사) */}
      <section aria-label="결과 이동 및 공유" className="mt-1 flex flex-col gap-3">
        <Link
          href="/test"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-white/95 px-5 text-[16px] font-bold text-slate-700 shadow-xs ring-1 ring-slate-200/90 transition-all hover:bg-white active:scale-[0.98]"
        >
          다시 검사하기
        </Link>

        <ShareResultButton />
      </section>
    </div>
  );
}

/**
 * 검사 결과 페이지('/result/[type]')입니다.
 * - 유형 코드(대소문자 모두 지원)에 맞는 데이터를 src/data/types.ts에서 불러와 보여줍니다.
 */
export default function ResultPage({ params }: PageProps<"/result/[type]">) {
  return (
    <Suspense
      fallback={
        <div className="-mx-5 -mt-4 -mb-6 flex flex-1 items-center justify-center bg-[#eef9f5] px-5 py-10 text-sm font-medium text-slate-500">
          결과를 불러오는 중입니다...
        </div>
      }
    >
      <ResultContent params={params} />
    </Suspense>
  );
}
