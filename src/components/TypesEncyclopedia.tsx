"use client";

import { useState } from "react";
import Link from "next/link";
import CharacterViewer from "@/components/characters/CharacterViewer";
import { getMbtiTypeProfile, MBTI_TYPE_LIST } from "@/data/types";
import type { MbtiType } from "@/lib/mbti";

/**
 * 16가지 MBTI 유형과 3D 동물 캐릭터를 한눈에 살펴볼 수 있는 '유형 도감' 클라이언트 컴포넌트입니다.
 * - 상단: 선택한 유형의 3D 캐릭터 (캔버스 1개만 재사용)
 * - 중단: 캐릭터 이름, 유형 코드, 별명, 한 줄 소개, '자세히 보기' 버튼
 * - 하단: 4줄 4칸(4×4) 형태의 16개 유형 선택 버튼
 */
export default function TypesEncyclopedia() {
  // 현재 선택된 MBTI 유형 (처음에는 첫 번째 유형인 INTJ를 보여줍니다)
  const [selectedType, setSelectedType] = useState<MbtiType>("INTJ");
  const selectedProfile = getMbtiTypeProfile(selectedType);

  return (
    <div
      className="-mx-5 -mt-4 -mb-6 flex flex-1 flex-col gap-2 px-5 pt-2.5 pb-4 transition-colors duration-300"
      style={{
        background: `linear-gradient(180deg, color-mix(in srgb, ${selectedProfile.color} 72%, #ffffff) 0%, color-mix(in srgb, ${selectedProfile.color} 32%, #ffffff) 55%, #ffffff 100%)`,
      }}
    >
      {/* 1. 위쪽: 선택한 유형의 3D 캐릭터 무대 (한 화면에 캔버스 1개만 사용) */}
      <section
        aria-label="선택한 유형 3D 캐릭터"
        className="relative h-[252px] w-full overflow-hidden rounded-3xl shadow-[0_14px_36px_-14px_rgba(71,85,105,0.18)] ring-2 ring-white/90 transition-colors duration-300"
        style={{ backgroundColor: selectedProfile.color }}
      >
        <CharacterViewer type={selectedType} />

        {/* 조작 안내 힌트 (터치 이벤트를 방해하지 않도록 pointer-events-none 적용) */}
        <p className="pointer-events-none absolute right-3 bottom-2.5 rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-medium text-slate-600 backdrop-blur-xs">
          눌러서 점프 · 돌려서 구경하기
        </p>
      </section>

      {/* 2. 가운데: 캐릭터 이름, 유형 코드, 별명, 한 줄 소개, 자세히 보기 버튼 */}
      <section className="rounded-3xl bg-white/92 px-5 py-3 shadow-[0_12px_32px_-14px_rgba(71,85,105,0.14)] ring-1 ring-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-slate-800"
                style={{ backgroundColor: selectedProfile.color }}
              >
                {selectedProfile.code}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {selectedProfile.character.animal}
              </span>
            </div>

            <h1 className="mt-1.5 text-xl font-extrabold tracking-tight text-slate-800">
              {selectedProfile.character.name}
            </h1>
          </div>

          {/* 해당 유형 결과 상세 페이지로 이동하는 버튼 */}
          <Link
            href={`/result/${selectedProfile.code}`}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#2e8eff] via-[#26a6ea] to-[#2bc2be] px-4 text-xs font-bold text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.98]"
          >
            자세히 보기
          </Link>
        </div>

        <p className="mt-1.5 text-sm font-bold text-slate-700">
          {selectedProfile.nickname}
        </p>
        <p className="mt-1 break-keep text-xs leading-relaxed text-slate-500">
          {selectedProfile.summary}
        </p>
      </section>

      {/* 3. 맨 아래: 16개 유형 버튼 4줄 4칸 (4×4 그리드) */}
      <section aria-label="16가지 유형 선택 목록">
        <div className="grid grid-cols-4 gap-2">
          {MBTI_TYPE_LIST.map((profile) => {
            const isSelected = profile.code === selectedType;

            return (
              <button
                key={profile.code}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedType(profile.code)}
                className={`flex min-h-[48px] flex-col items-center justify-center rounded-2xl px-1 py-1.5 text-center transition-all active:scale-[0.96] ${
                  isSelected
                    ? "ring-2 ring-slate-800 shadow-sm"
                    : "bg-white/90 ring-1 ring-slate-200/80 hover:bg-white"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: profile.color }
                    : undefined
                }
              >
                <span className="text-[13px] font-extrabold tracking-wide text-slate-800">
                  {profile.code}
                </span>
                <span className="mt-0.5 text-[10px] font-medium text-slate-500">
                  {profile.character.animal}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
