"use client";

import { useEffect, useState } from "react";
import CharacterViewer from "@/components/characters/CharacterViewer";
import { MBTI_TYPE_LIST } from "@/data/types";

/**
 * 첫 화면('/') 제목 아래에서 3초마다 다른 유형의 3D 캐릭터를 번갈아 보여 주는 컴포넌트입니다.
 * - 한 화면에 3D 캔버스는 1개만 유지하고, 전달하는 유형 코드만 3초 간격으로 바꿉니다.
 */
export default function HomeCharacterShowcase() {
  // 현재 화면에 보여줄 유형의 순서 번호 (0부터 15까지 반복)
  const [typeIndex, setTypeIndex] = useState(0);

  useEffect(() => {
    // 3초(3000ms)마다 다음 MBTI 유형 캐릭터로 전환합니다.
    const timer = setInterval(() => {
      setTypeIndex((prev) => (prev + 1) % MBTI_TYPE_LIST.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentProfile = MBTI_TYPE_LIST[typeIndex];

  return (
    <div
      className="relative mt-4 h-[210px] w-full overflow-hidden rounded-3xl shadow-inner ring-2 ring-white/90 transition-colors duration-500"
      style={{ backgroundColor: currentProfile.color }}
    >
      {/* 캔버스 하나를 재사용하면서 캐릭터만 부드럽게 교체합니다 */}
      <CharacterViewer type={currentProfile.code} />

      {/* 현재 보여지는 캐릭터의 유형과 이름 뱃지 */}
      <p className="pointer-events-none absolute right-3 bottom-2.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-xs backdrop-blur-xs">
        {currentProfile.code} · {currentProfile.character.name}
      </p>
    </div>
  );
}
