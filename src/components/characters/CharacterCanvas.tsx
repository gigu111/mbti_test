"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import AnimalCharacter from "@/components/characters/AnimalCharacter";
import type { MbtiType } from "@/lib/mbti";

/**
 * 3D 캔버스 무대와 조명, 바닥 그림자, 마우스/터치 회전 조작을 담당하는 컴포넌트입니다.
 * - 한 화면에서 캔버스 하나만 유지한 채 type 값만 바꿔 16가지 동물을 전환합니다.
 * - 배경은 투명(alpha: true)이며, 인터넷 HDR 환경맵 없이 코드 조명만 사용합니다.
 */
export default function CharacterCanvas({
  type = "ISFJ",
}: {
  type?: MbtiType;
}) {
  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.36, 3.55], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
    >
      {/* 전체를 은은하게 밝혀 주는 기본 조명 */}
      <ambientLight intensity={0.85} />

      {/* 위쪽의 따뜻한 하늘빛과 아래쪽의 부드러운 반사광 */}
      <hemisphereLight args={["#fff8f0", "#dbeafe", 0.75]} />

      {/* 정면 오른쪽 위에서 비추어 입체감을 주는 주 조명 */}
      <directionalLight
        position={[2.8, 4.2, 3.6]}
        intensity={1.35}
        color="#fff6ea"
      />

      {/* 뒤쪽 왼쪽에서 윤곽을 살려 주는 보조 조명 */}
      <directionalLight
        position={[-2.8, 1.8, -2.6]}
        intensity={0.55}
        color="#dbeafe"
      />

      {/* 전달받은 MBTI 유형에 맞는 3D 동물 캐릭터 */}
      <AnimalCharacter type={type} />

      {/* 캐릭터 발 아래의 부드러운 바닥 그림자 (모바일 성능 최적화를 위해 해상도 128 사용) */}
      <ContactShadows
        position={[0, -1.01, 0]}
        opacity={0.32}
        scale={3.2}
        blur={2.2}
        far={2.4}
        resolution={128}
        color="#5b4d42"
      />

      {/* 확대·축소와 이동은 막고, 마우스 드래그 / 손가락 밀기로 회전만 허용합니다. */}
      <OrbitControls
        target={[0, 0.16, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.62}
      />
    </Canvas>
  );
}
