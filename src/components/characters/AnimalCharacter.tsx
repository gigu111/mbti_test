"use client";

import { useEffect, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type * as THREE from "three";
import { ANIMAL_CONFIGS } from "@/components/characters/animalConfigs";
import {
  AnimalBodyFeatures,
  AnimalHeadFeatures,
} from "@/components/characters/AnimalExtras";
import type { MbtiType } from "@/lib/mbti";

/**
 * 16가지 MBTI 유형 코드를 받아 각 유형의 동물 캐릭터를 그리는 통합 3D 컴포넌트입니다.
 * - 머리·몸통·눈·팔다리 같은 기본 2등신 구조는 공통으로 사용합니다.
 * - 동물마다 다른 귀·꼬리·무늬·부리 등은 ANIMAL_CONFIGS 와 AnimalExtras 로 갈아 끼웁니다.
 * - 유형 성격에 맞는 기본 움직임과, 눌렀을 때 폴짝 뛰어오르는 반응을 함께 처리합니다.
 */
export default function AnimalCharacter({ type }: { type: MbtiType }) {
  const config = ANIMAL_CONFIGS[type];
  const limbColor = config.limbColor ?? config.bodyColor;
  const faceColor = config.faceColor ?? config.bodyColor;

  // 전체 위치(점프·둥실거림·춤)와 숨쉬기 크기를 조절할 그룹 참조
  const rootRef = useRef<THREE.Group>(null);
  // 고개 움직임(끄덕임·갸우뚱)을 위한 머리 그룹 참조
  const headRef = useRef<THREE.Group>(null);
  // 왼눈·오른눈 깜빡임용 참조
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);

  // 탭했을 때 폴짝 뛰어오르는 애니메이션 진행도를 저장하는 참조 (null이면 대기 상태)
  const jumpStartTimeRef = useRef<number | null>(null);
  const clockTimeRef = useRef(0);

  // 컴포넌트가 사라지거나 유형이 바뀔 때 커서 스타일을 기본값으로 되돌립니다.
  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  /** 캐릭터를 탭/클릭하면 폴짝 뛰어오르게 합니다 (드래그 회전 시에는 반응하지 않도록 delta 확인). */
  function handleTap(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    // 6px 이상 움직였다면 회전 드래그로 보고 점프시키지 않습니다.
    if (event.delta > 6) {
      return;
    }
    jumpStartTimeRef.current = clockTimeRef.current;
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    clockTimeRef.current = t;

    // 1. 탭 시 폴짝 뛰어오르는 포물선 계산 (0.45초 동안 진행)
    let jumpOffsetY = 0;
    let jumpStretchY = 1;
    let jumpSquashXZ = 1;

    if (jumpStartTimeRef.current !== null) {
      const elapsed = t - jumpStartTimeRef.current;
      const duration = 0.45;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        // 확대된 화면 구도에서도 긴 귀·뿔이 잘리지 않도록 점프 높이를 0.12로 맞춥니다.
        jumpOffsetY = Math.sin(progress * Math.PI) * 0.12;
        jumpStretchY = 1 + Math.sin(progress * Math.PI) * 0.035;
        jumpSquashXZ = 1 - Math.sin(progress * Math.PI) * 0.025;
      } else {
        jumpStartTimeRef.current = null;
      }
    }

    // 2. 유형별 성격에 어울리는 고유 움직임 계산
    let idleY = Math.sin(t * 1.7) * 0.05;
    let idleRotY = 0;
    let idleRotZ = 0;
    let headRotX = 0;
    let headRotY = 0;
    let headRotZ = 0;

    switch (type) {
      case "ENFP": // 다람쥐: 신나게 통통 뛰는 움직임
        idleY = Math.abs(Math.sin(t * 4.2)) * 0.095;
        idleRotZ = Math.sin(t * 4.2) * 0.04;
        break;
      case "ISTJ": // 거북이: 천천히 고개를 끄덕이는 움직임
        idleY = Math.sin(t * 1.1) * 0.025;
        headRotX = Math.sin(t * 1.6) * 0.11;
        break;
      case "ESFP": // 앵무새: 좌우로 흔들며 춤추는 움직임
        idleY = Math.abs(Math.sin(t * 3.8)) * 0.055;
        idleRotZ = Math.sin(t * 3.8) * 0.13;
        idleRotY = Math.sin(t * 1.9) * 0.18;
        break;
      case "INTJ": // 부엉이: 좌우로 차분히 살피는 움직임
        headRotY = Math.sin(t * 1.2) * 0.22;
        break;
      case "INTP": // 고양이: 호기심 있게 고개를 갸웃거림
        headRotZ = Math.sin(t * 1.4) * 0.12;
        break;
      case "ENTJ": // 사자: 씩씩하고 당당한 끄덕임
        headRotX = Math.sin(t * 2.2) * 0.07;
        break;
      case "ENTP": // 여우: 재치 있게 통통 갸우뚱
        idleY = Math.abs(Math.sin(t * 2.8)) * 0.045;
        headRotZ = Math.sin(t * 2.4) * 0.1;
        break;
      case "INFJ": // 사슴: 우아하고 잔잔한 좌우 흔들림
        idleRotZ = Math.sin(t * 1.2) * 0.045;
        break;
      case "INFP": // 토끼: 몽글몽글 부드럽게 둥실
        idleY = Math.sin(t * 1.5) * 0.05;
        headRotZ = Math.sin(t * 1.1) * 0.06;
        break;
      case "ENFJ": // 강아지: 반갑게 통통 리듬
        idleY = Math.abs(Math.sin(t * 3.2)) * 0.055;
        headRotZ = Math.sin(t * 3.2) * 0.06;
        break;
      case "ESTJ": // 펭귄: 반장처럼 뒤뚱뒤뚱 좌우 기우뚱
        idleRotZ = Math.sin(t * 3.0) * 0.09;
        break;
      case "ESFJ": // 양: 다정하게 포근포근 흔들기
        idleRotZ = Math.sin(t * 2.0) * 0.06;
        idleY = Math.sin(t * 2.0) * 0.04;
        break;
      case "ISTP": // 고슴도치: 담백하게 가끔 고개 살짝 까딱
        idleY = Math.sin(t * 1.4) * 0.03;
        headRotX = Math.sin(t * 2.6) * 0.05;
        break;
      case "ISFP": // 판다: 느긋하게 여유로운 기우뚱
        idleRotZ = Math.sin(t * 1.0) * 0.07;
        idleY = Math.sin(t * 1.0) * 0.03;
        break;
      case "ESTP": // 원숭이: 장난스럽게 톡톡 리듬 타기
        idleY = Math.abs(Math.sin(t * 3.4)) * 0.065;
        idleRotY = Math.sin(t * 2.4) * 0.14;
        break;
      case "ISFJ": // 곰: 포근하게 둥실둥실
      default:
        break;
    }

    // 3. 숨 쉬듯 살짝 커졌다 작아지는 공통 움직임 적용
    if (rootRef.current) {
      const breath = 1 + Math.sin(t * 2.3) * 0.02;
      rootRef.current.position.y = -0.05 + idleY + jumpOffsetY;
      rootRef.current.rotation.y = idleRotY;
      rootRef.current.rotation.z = idleRotZ;
      rootRef.current.scale.set(
        breath * jumpSquashXZ,
        (1 - Math.sin(t * 2.3) * 0.012) * jumpStretchY,
        breath * jumpSquashXZ,
      );
    }

    if (headRef.current) {
      headRef.current.rotation.set(headRotX, headRotY, headRotZ);
    }

    // 4. 주기적으로 가볍게 눈을 깜빡이는 공통 애니메이션
    const blinkCycle = t % 3.6;
    let eyeScaleY = 1;
    if (blinkCycle < 0.18) {
      eyeScaleY = 1 - Math.sin((blinkCycle / 0.18) * Math.PI) * 0.9;
    }
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = eyeScaleY;
      rightEyeRef.current.scale.y = eyeScaleY;
    }
  });

  return (
    <group
      ref={rootRef}
      position={[0, -0.05, 0]}
      onClick={handleTap}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* ================= 1. 공통 2등신 머리 구조 ================= */}
      <group ref={headRef} position={[0, 0.36, 0]}>
        {/* 둥근 머리 본체 (모바일 최적화: 면 수를 과하지 않게 24×24로 유지) */}
        <mesh scale={[0.63, 0.56, 0.57]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={faceColor}
            roughness={0.34}
            metalness={0.04}
          />
        </mesh>

        {/* 양쪽 까만 눈 + 작은 하얀 반짝임 2개 */}
        <group
          ref={leftEyeRef}
          position={[-0.22, 0.07, 0.528]}
          rotation={[0, -0.22, 0]}
        >
          <mesh scale={[0.068, 0.074, 0.048]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial
              color="#1E1815"
              roughness={0.12}
              metalness={0.08}
            />
          </mesh>
          <mesh position={[0.022, 0.026, 0.036]} scale={[0.021, 0.021, 0.015]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.016, -0.02, 0.038]} scale={[0.01, 0.01, 0.01]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        <group
          ref={rightEyeRef}
          position={[0.22, 0.07, 0.528]}
          rotation={[0, 0.22, 0]}
        >
          <mesh scale={[0.068, 0.074, 0.048]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial
              color="#1E1815"
              roughness={0.12}
              metalness={0.08}
            />
          </mesh>
          <mesh position={[0.022, 0.026, 0.036]} scale={[0.021, 0.021, 0.015]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.016, -0.02, 0.038]} scale={[0.01, 0.01, 0.01]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* 부드러운 분홍 볼터치 (다람쥐는 별도 볼록한 볼이 있어 생략) */}
        {config.species !== "squirrel" && (
          <>
            <mesh
              position={[-0.35, -0.09, 0.45]}
              rotation={[0, -0.45, 0]}
              scale={[0.085, 0.055, 0.038]}
            >
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color="#F5A6B8" roughness={0.5} />
            </mesh>
            <mesh
              position={[0.35, -0.09, 0.45]}
              rotation={[0, 0.45, 0]}
              scale={[0.085, 0.055, 0.038]}
            >
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color="#F5A6B8" roughness={0.5} />
            </mesh>
          </>
        )}

        {/* 공통 둥근 주둥이와 코 (새·여우·고슴도치·양 등은 전용 부위 사용) */}
        {config.hasRoundMuzzle && (
          <>
            <mesh position={[0, -0.1, 0.49]} scale={[0.23, 0.16, 0.15]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={config.accentColor}
                roughness={0.38}
              />
            </mesh>
            <mesh position={[0, -0.02, 0.62]} scale={[0.09, 0.065, 0.065]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={config.noseColor} roughness={0.2} />
            </mesh>
          </>
        )}

        {/* 동물별 고유 머리 장식 (귀, 뿔, 갈기, 수염, 부리 등) */}
        <AnimalHeadFeatures config={config} />
      </group>

      {/* ================= 2. 공통 통통한 몸통과 팔다리 ================= */}
      <group position={[0, -0.34, 0]}>
        {/* 둥근 몸통 */}
        <mesh scale={[0.48, 0.48, 0.42]}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial
            color={config.bodyColor}
            roughness={0.34}
            metalness={0.04}
          />
        </mesh>

        {/* 배 앞쪽의 밝은 포인트 무늬 */}
        <mesh position={[0, -0.02, 0.24]} scale={[0.31, 0.34, 0.22]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={config.accentColor} roughness={0.4} />
        </mesh>

        {/* 팔 또는 날개 (부엉이·펭귄·앵무새는 날개 모양으로 넓고 납작하게 표현) */}
        {config.usesWings ? (
          <>
            <mesh
              position={[-0.47, 0.05, 0.02]}
              rotation={[0.08, 0.18, 0.54]}
              scale={[0.45, 1.25, 1.35]}
            >
              <capsuleGeometry args={[0.13, 0.26, 6, 12]} />
              <meshStandardMaterial
                color={
                  config.species === "parrot" ? config.detailColor : limbColor
                }
                roughness={0.34}
              />
            </mesh>
            <mesh
              position={[0.47, 0.05, 0.02]}
              rotation={[0.08, -0.18, -0.54]}
              scale={[0.45, 1.25, 1.35]}
            >
              <capsuleGeometry args={[0.13, 0.26, 6, 12]} />
              <meshStandardMaterial
                color={
                  config.species === "parrot" ? config.detailColor : limbColor
                }
                roughness={0.34}
              />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[-0.44, 0.08, 0.05]} rotation={[0.15, 0, 0.55]}>
              <capsuleGeometry args={[0.125, 0.2, 6, 12]} />
              <meshStandardMaterial color={limbColor} roughness={0.34} />
            </mesh>
            <mesh position={[0.44, 0.08, 0.05]} rotation={[0.15, 0, -0.55]}>
              <capsuleGeometry args={[0.125, 0.2, 6, 12]} />
              <meshStandardMaterial color={limbColor} roughness={0.34} />
            </mesh>
          </>
        )}

        {/* 짧은 다리 2개 (새·펭귄은 발을 주황색 포인트로 표시) */}
        <mesh position={[-0.21, -0.37, 0.05]} rotation={[0.12, 0, 0.08]}>
          <capsuleGeometry args={[0.14, 0.14, 6, 12]} />
          <meshStandardMaterial
            color={
              config.species === "penguin" || config.species === "parrot"
                ? config.noseColor
                : limbColor
            }
            roughness={0.34}
          />
        </mesh>
        <mesh position={[0.21, -0.37, 0.05]} rotation={[0.12, 0, -0.08]}>
          <capsuleGeometry args={[0.14, 0.14, 6, 12]} />
          <meshStandardMaterial
            color={
              config.species === "penguin" || config.species === "parrot"
                ? config.noseColor
                : limbColor
            }
            roughness={0.34}
          />
        </mesh>

        {/* 동물별 고유 등·꼬리 특징 (등딱지, 하얀 점, 가시, 털, 꼬리 등) */}
        <AnimalBodyFeatures config={config} />
      </group>
    </group>
  );
}
