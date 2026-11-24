"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { MbtiType } from "@/lib/mbti";

/**
 * 3D 캔버스는 브라우저 WebGL 환경에서만 동작하므로 ssr: false 로 서버 렌더링에서 제외합니다.
 * - 불러오는 동안에는 '캐릭터 불러오는 중...' 안내 문구를 보여줍니다.
 */
const DynamicCharacterCanvas = dynamic(
  () => import("@/components/characters/CharacterCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
        캐릭터 불러오는 중...
      </div>
    ),
  },
);

/**
 * 선택한 MBTI 유형의 3D 캐릭터 뷰어를 안전하게 불러오는 클라이언트 컴포넌트입니다.
 * - Next.js의 페이지 캐싱(Activity)으로 이전 화면이 숨겨질 때 캔버스도 함께 내려
 *   문서 전체에 3D 캔버스 1개만 유지되도록 관리합니다.
 */
export default function CharacterViewer({
  type = "ISFJ",
}: {
  type?: MbtiType;
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsActive(true);
    });
    return () => {
      cancelAnimationFrame(frameId);
      setIsActive(false);
    };
  }, []);

  return (
    <div className="h-full w-full select-none">
      {isActive ? (
        <DynamicCharacterCanvas type={type} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
          캐릭터 불러오는 중...
        </div>
      )}
    </div>
  );
}
