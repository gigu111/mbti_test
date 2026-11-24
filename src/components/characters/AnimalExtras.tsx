"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import type { AnimalVisualConfig } from "@/components/characters/animalConfigs";

/**
 * 동물마다 다르게 붙는 머리 장식(귀, 뿔, 갈기, 눈 무늬, 부리, 수염 등)을 그리는 컴포넌트입니다.
 */
export function AnimalHeadFeatures({ config }: { config: AnimalVisualConfig }) {
  const { species, bodyColor, accentColor, detailColor, noseColor } = config;

  switch (species) {
    case "owl":
      return (
        <>
          {/* 뾰족한 귀깃 2개 */}
          <mesh position={[-0.43, 0.48, 0.04]} rotation={[0.1, 0, 0.48]}>
            <coneGeometry args={[0.14, 0.34, 16]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
          <mesh position={[0.43, 0.48, 0.04]} rotation={[0.1, 0, -0.48]}>
            <coneGeometry args={[0.14, 0.34, 16]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
          {/* 동그랗고 큰 눈테 2개 (얼굴 표면 z=0.529 위에 또렷이 올라오도록 z=0.502에 배치) */}
          <mesh position={[-0.22, 0.07, 0.502]} rotation={[0, -0.22, 0]} scale={[0.2, 0.2, 0.036]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>
          <mesh position={[0.22, 0.07, 0.502]} rotation={[0, 0.22, 0]} scale={[0.2, 0.2, 0.036]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>
          {/* 작은 부엉이 부리 */}
          <mesh position={[0, -0.05, 0.6]} rotation={[Math.PI * 0.6, 0, 0]}>
            <coneGeometry args={[0.09, 0.17, 16]} />
            <meshStandardMaterial color={noseColor} roughness={0.28} />
          </mesh>
        </>
      );

    case "cat":
      return (
        <>
          {/* 세모 귀 2개 (바깥 + 분홍 안쪽) */}
          <group position={[-0.42, 0.46, 0.02]} rotation={[0.08, 0, 0.35]}>
            <mesh scale={[1, 1, 0.6]}>
              <coneGeometry args={[0.19, 0.36, 16]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, -0.02, 0.06]} scale={[0.6, 0.6, 0.45]}>
              <coneGeometry args={[0.17, 0.3, 16]} />
              <meshStandardMaterial color={detailColor} roughness={0.45} />
            </mesh>
          </group>
          <group position={[0.42, 0.46, 0.02]} rotation={[0.08, 0, -0.35]}>
            <mesh scale={[1, 1, 0.6]}>
              <coneGeometry args={[0.19, 0.36, 16]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, -0.02, 0.06]} scale={[0.6, 0.6, 0.45]}>
              <coneGeometry args={[0.17, 0.3, 16]} />
              <meshStandardMaterial color={detailColor} roughness={0.45} />
            </mesh>
          </group>
          {/* 양쪽 수염 3줄씩 */}
          {[-0.14, -0.04, 0.06].map((angle, i) => (
            <group key={i}>
              <mesh
                position={[-0.44, -0.08 + i * 0.045, 0.44]}
                rotation={[0, 0.25, Math.PI / 2 + angle]}
              >
                <capsuleGeometry args={[0.011, 0.22, 6, 8]} />
                <meshStandardMaterial color="#475569" roughness={0.4} />
              </mesh>
              <mesh
                position={[0.44, -0.08 + i * 0.045, 0.44]}
                rotation={[0, -0.25, Math.PI / 2 - angle]}
              >
                <capsuleGeometry args={[0.011, 0.22, 6, 8]} />
                <meshStandardMaterial color="#475569" roughness={0.4} />
              </mesh>
            </group>
          ))}
        </>
      );

    case "lion": {
      // 얼굴 주위를 둥글게 감싸는 사자 갈기(구 12개 배치)
      const maneAngles = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
      return (
        <>
          {maneAngles.map((angle, idx) => (
            <mesh
              key={idx}
              position={[Math.cos(angle) * 0.56, Math.sin(angle) * 0.52, -0.08]}
              scale={[0.24, 0.24, 0.22]}
            >
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          ))}
          {/* 갈기 안쪽의 작은 둥근 귀 */}
          <mesh position={[-0.45, 0.44, 0.04]} scale={[0.16, 0.16, 0.1]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
          <mesh position={[0.45, 0.44, 0.04]} scale={[0.16, 0.16, 0.1]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
        </>
      );
    }

    case "fox":
      return (
        <>
          {/* 크고 뾰족한 여우 귀 2개 */}
          <group position={[-0.43, 0.5, 0.02]} rotation={[0.08, 0, 0.34]}>
            <mesh scale={[1, 1, 0.58]}>
              <coneGeometry args={[0.22, 0.46, 16]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, -0.03, 0.06]} scale={[0.62, 0.65, 0.45]}>
              <coneGeometry args={[0.18, 0.34, 16]} />
              <meshStandardMaterial color={accentColor} roughness={0.4} />
            </mesh>
          </group>
          <group position={[0.43, 0.5, 0.02]} rotation={[0.08, 0, -0.34]}>
            <mesh scale={[1, 1, 0.58]}>
              <coneGeometry args={[0.22, 0.46, 16]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, -0.03, 0.06]} scale={[0.62, 0.65, 0.45]}>
              <coneGeometry args={[0.18, 0.34, 16]} />
              <meshStandardMaterial color={accentColor} roughness={0.4} />
            </mesh>
          </group>
          {/* 뾰족한 하얀 주둥이와 코끝 */}
          <mesh position={[0, -0.1, 0.56]} rotation={[Math.PI * 0.48, 0, 0]}>
            <coneGeometry args={[0.21, 0.36, 20]} />
            <meshStandardMaterial color={accentColor} roughness={0.36} />
          </mesh>
          <mesh position={[0, -0.08, 0.74]} scale={[0.075, 0.065, 0.065]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={noseColor} roughness={0.2} />
          </mesh>
        </>
      );

    case "deer":
      return (
        <>
          {/* 사슴 둥근 귀 */}
          <mesh position={[-0.48, 0.36, 0]} rotation={[0, 0, 0.65]} scale={[0.14, 0.21, 0.09]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
          <mesh position={[0.48, 0.36, 0]} rotation={[0, 0, -0.65]} scale={[0.14, 0.21, 0.09]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
          {/* 가지 모양 뿔 (왼·오른쪽 각 줄기 + 가지 2개, 상단 잘림 방지를 위해 비율과 위치 조정) */}
          <group position={[-0.23, 0.54, 0.02]} rotation={[0, 0, 0.22]} scale={0.9}>
            <mesh position={[0, 0.14, 0]}>
              <capsuleGeometry args={[0.038, 0.3, 8, 12]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
            <mesh position={[-0.09, 0.22, 0]} rotation={[0, 0, 0.7]}>
              <capsuleGeometry args={[0.028, 0.14, 8, 10]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
            <mesh position={[0.07, 0.28, 0]} rotation={[0, 0, -0.55]}>
              <capsuleGeometry args={[0.025, 0.12, 8, 10]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          </group>
          <group position={[0.23, 0.54, 0.02]} rotation={[0, 0, -0.22]} scale={0.9}>
            <mesh position={[0, 0.14, 0]}>
              <capsuleGeometry args={[0.038, 0.3, 8, 12]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
            <mesh position={[0.09, 0.22, 0]} rotation={[0, 0, -0.7]}>
              <capsuleGeometry args={[0.028, 0.14, 8, 10]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
            <mesh position={[-0.07, 0.28, 0]} rotation={[0, 0, 0.55]}>
              <capsuleGeometry args={[0.025, 0.12, 8, 10]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          </group>
        </>
      );

    case "rabbit":
      return (
        <>
          {/* 길쭉한 토끼 귀 2개 (상단 여백을 넉넉히 두어 점프 시에도 잘리지 않게 조정) */}
          <group position={[-0.23, 0.59, 0]} rotation={[0.08, 0, 0.18]}>
            <mesh scale={[1, 1, 0.58]}>
              <capsuleGeometry args={[0.12, 0.31, 6, 12]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, -0.02, 0.05]} scale={[0.62, 0.8, 0.45]}>
              <capsuleGeometry args={[0.1, 0.25, 6, 10]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          </group>
          <group position={[0.23, 0.59, 0]} rotation={[0.08, 0, -0.18]}>
            <mesh scale={[1, 1, 0.58]}>
              <capsuleGeometry args={[0.12, 0.31, 6, 12]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, -0.02, 0.05]} scale={[0.62, 0.8, 0.45]}>
              <capsuleGeometry args={[0.1, 0.25, 6, 10]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          </group>
        </>
      );

    case "dog":
      return (
        <>
          {/* 아래로 처진 강아지 귀 2개 */}
          <mesh position={[-0.58, 0.04, 0.05]} rotation={[0.12, 0, 0.28]} scale={[0.9, 1.1, 0.55]}>
            <capsuleGeometry args={[0.15, 0.32, 12, 16]} />
            <meshStandardMaterial color={detailColor} roughness={0.38} />
          </mesh>
          <mesh position={[0.58, 0.04, 0.05]} rotation={[0.12, 0, -0.28]} scale={[0.9, 1.1, 0.55]}>
            <capsuleGeometry args={[0.15, 0.32, 12, 16]} />
            <meshStandardMaterial color={detailColor} roughness={0.38} />
          </mesh>
          {/* 주둥이 아래로 귀엽게 내민 분홍 혀 */}
          <mesh position={[0, -0.23, 0.56]} rotation={[0.55, 0, 0]} scale={[0.95, 1, 0.5]}>
            <capsuleGeometry args={[0.06, 0.09, 8, 12]} />
            <meshStandardMaterial color="#F27B93" roughness={0.35} />
          </mesh>
        </>
      );

    case "squirrel":
      return (
        <>
          {/* 다람쥐 귀 2개 + 볼록한 볼 2개 */}
          <mesh position={[-0.41, 0.44, 0]} rotation={[0, 0, 0.3]} scale={[0.16, 0.2, 0.1]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
          <mesh position={[0.41, 0.44, 0]} rotation={[0, 0, -0.3]} scale={[0.16, 0.2, 0.1]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
          {/* 볼록 튀어나온 귀여운 볼 */}
          <mesh position={[-0.39, -0.13, 0.37]} scale={[0.21, 0.16, 0.18]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.38} />
          </mesh>
          <mesh position={[0.39, -0.13, 0.37]} scale={[0.21, 0.16, 0.18]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.38} />
          </mesh>
        </>
      );

    case "turtle":
      return (
        /* 거북이는 귀가 없고, 다정한 미소 라인을 살짝 넣어 줍니다. */
        <mesh position={[0, -0.11, 0.54]} scale={[0.13, 0.06, 0.06]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={noseColor} roughness={0.4} />
        </mesh>
      );

    case "bear":
      return (
        <>
          {/* 둥근 곰 귀 2개 (바깥 + 안쪽 크림) */}
          <group position={[-0.46, 0.43, -0.02]}>
            <mesh scale={[0.21, 0.21, 0.13]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0.01, -0.01, 0.08]} scale={[0.12, 0.12, 0.07]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          </group>
          <group position={[0.46, 0.43, -0.02]}>
            <mesh scale={[0.21, 0.21, 0.13]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[-0.01, -0.01, 0.08]} scale={[0.12, 0.12, 0.07]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          </group>
        </>
      );

    case "penguin":
      return (
        <>
          {/* 펭귄 얼굴의 하얀 볼 무늬 (눈이 가려지지 않도록 z 위치를 맞춥니다) */}
          <mesh position={[-0.17, -0.04, 0.39]} scale={[0.25, 0.27, 0.14]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.36} />
          </mesh>
          <mesh position={[0.17, -0.04, 0.39]} scale={[0.25, 0.27, 0.14]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.36} />
          </mesh>
          {/* 둥근 주황색 펭귄 부리 */}
          <mesh position={[0, -0.07, 0.62]} rotation={[Math.PI * 0.52, 0, 0]} scale={[1.2, 1, 0.75]}>
            <coneGeometry args={[0.1, 0.18, 18]} />
            <meshStandardMaterial color={noseColor} roughness={0.28} />
          </mesh>
        </>
      );

    case "sheep": {
      // 양 머리 위를 덮는 몽글몽글한 작은 털 구 9개
      const woolPuffs: [number, number, number, number][] = [
        [0, 0.52, 0.1, 0.22],
        [-0.24, 0.47, 0.16, 0.19],
        [0.24, 0.47, 0.16, 0.19],
        [-0.4, 0.34, 0.08, 0.17],
        [0.4, 0.34, 0.08, 0.17],
        [0, 0.48, -0.18, 0.21],
        [-0.24, 0.42, -0.18, 0.18],
        [0.24, 0.42, -0.18, 0.18],
        [0, 0.39, 0.32, 0.17],
      ];
      return (
        <>
          {woolPuffs.map(([x, y, z, r], idx) => (
            <mesh key={idx} position={[x, y, z]} scale={[r, r, r]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={bodyColor} roughness={0.45} />
            </mesh>
          ))}
          {/* 옆으로 뻗은 양 귀 2개 */}
          <mesh position={[-0.62, 0.14, 0.02]} rotation={[0, 0, 1.25]} scale={[0.75, 1, 0.55]}>
            <capsuleGeometry args={[0.1, 0.18, 10, 14]} />
            <meshStandardMaterial color={detailColor} roughness={0.38} />
          </mesh>
          <mesh position={[0.62, 0.14, 0.02]} rotation={[0, 0, -1.25]} scale={[0.75, 1, 0.55]}>
            <capsuleGeometry args={[0.1, 0.18, 10, 14]} />
            <meshStandardMaterial color={detailColor} roughness={0.38} />
          </mesh>
          {/* 작은 코 */}
          <mesh position={[0, -0.08, 0.58]} scale={[0.075, 0.055, 0.055]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={noseColor} roughness={0.25} />
          </mesh>
        </>
      );
    }

    case "hedgehog": {
      // 정면에서도 고슴도치 윤곽이 바로 보이도록 머리 위·양옆과 뒤쪽을 감싸는 가시 배치
      const headSpikes: [number, number, number, [number, number, number]][] = [
        [0, 0.56, -0.04, [-0.28, 0, 0]],
        [-0.28, 0.52, -0.05, [-0.3, 0, 0.48]],
        [0.28, 0.52, -0.05, [-0.3, 0, -0.48]],
        [-0.5, 0.38, -0.06, [-0.3, 0, 0.88]],
        [0.5, 0.38, -0.06, [-0.3, 0, -0.88]],
        [-0.58, 0.16, -0.08, [-0.3, 0, 1.25]],
        [0.58, 0.16, -0.08, [-0.3, 0, -1.25]],
        [0, 0.46, -0.32, [-0.95, 0, 0]],
        [-0.28, 0.42, -0.26, [-0.85, 0, 0.45]],
        [0.28, 0.42, -0.26, [-0.85, 0, -0.45]],
        [-0.2, 0.18, -0.44, [-1.35, 0, 0.3]],
        [0.2, 0.18, -0.44, [-1.35, 0, -0.3]],
      ];
      return (
        <>
          {headSpikes.map(([x, y, z, rot], idx) => (
            <mesh key={idx} position={[x, y, z]} rotation={rot}>
              <coneGeometry args={[0.135, 0.34, 12]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          ))}
          {/* 작은 둥근 귀 */}
          <mesh position={[-0.44, 0.28, 0.18]} scale={[0.11, 0.12, 0.07]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.38} />
          </mesh>
          <mesh position={[0.44, 0.28, 0.18]} scale={[0.11, 0.12, 0.07]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.38} />
          </mesh>
          {/* 뾰족한 고슴도치 코 (정면에서도 입체감이 살도록 앞으로 살짝 돌출) */}
          <mesh position={[0, -0.09, 0.6]} rotation={[Math.PI * 0.48, 0, 0]}>
            <coneGeometry args={[0.17, 0.32, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.36} />
          </mesh>
          <mesh position={[0, -0.07, 0.76]} scale={[0.07, 0.06, 0.06]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={noseColor} roughness={0.2} />
          </mesh>
        </>
      );
    }

    case "panda":
      return (
        <>
          {/* 검은 둥근 귀 2개 */}
          <mesh position={[-0.46, 0.43, -0.02]} scale={[0.2, 0.2, 0.12]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={detailColor} roughness={0.34} />
          </mesh>
          <mesh position={[0.46, 0.43, -0.02]} scale={[0.2, 0.2, 0.12]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={detailColor} roughness={0.34} />
          </mesh>
          {/* 판다 특유의 큰 검은 눈가 무늬 2개 (얼굴 표면 z=0.529 위로 또렷하게 배치) */}
          <mesh
            position={[-0.22, 0.05, 0.502]}
            rotation={[0, -0.22, 0.26]}
            scale={[0.16, 0.2, 0.036]}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={detailColor} roughness={0.35} />
          </mesh>
          <mesh
            position={[0.22, 0.05, 0.502]}
            rotation={[0, 0.22, -0.26]}
            scale={[0.16, 0.2, 0.036]}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={detailColor} roughness={0.35} />
          </mesh>
        </>
      );

    case "monkey":
      return (
        <>
          {/* 얼굴 옆 크고 둥근 원숭이 귀 2개 */}
          <group position={[-0.63, 0.08, -0.02]}>
            <mesh scale={[0.21, 0.22, 0.1]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0, 0.05]} scale={[0.13, 0.14, 0.06]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={detailColor} roughness={0.4} />
            </mesh>
          </group>
          <group position={[0.63, 0.08, -0.02]}>
            <mesh scale={[0.21, 0.22, 0.1]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0, 0.05]} scale={[0.13, 0.14, 0.06]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={detailColor} roughness={0.4} />
            </mesh>
          </group>
          {/* 머리 꼭대기의 귀여운 털 포인트 */}
          <mesh position={[0.02, 0.56, 0.06]} rotation={[0.15, 0, -0.25]} scale={[0.7, 1, 0.7]}>
            <coneGeometry args={[0.11, 0.22, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
          {/* 눈 주변과 볼을 감싸는 밝은 하트형 원숭이 얼굴 마스크 */}
          <mesh position={[-0.17, 0.03, 0.495]} scale={[0.23, 0.24, 0.055]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.38} />
          </mesh>
          <mesh position={[0.17, 0.03, 0.495]} scale={[0.23, 0.24, 0.055]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.38} />
          </mesh>
        </>
      );

    case "parrot":
      return (
        <>
          {/* 정면과 옆면 모두에서 잘 보이는 머리 위 알록달록 3갈래 깃털 보(crest) */}
          <mesh position={[-0.1, 0.56, 0.14]} rotation={[0.22, 0, 0.55]} scale={[1.1, 1, 0.7]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.34} />
          </mesh>
          <mesh position={[0, 0.61, 0.14]} rotation={[0.2, 0, 0]} scale={[0.85, 1.3, 0.75]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={detailColor} roughness={0.34} />
          </mesh>
          <mesh position={[0.1, 0.56, 0.14]} rotation={[0.22, 0, -0.55]} scale={[1.1, 1, 0.7]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.34} />
          </mesh>
          {/* 아래로 살짝 굽은 앵무새 부리 */}
          <group position={[0, -0.05, 0.6]}>
            <mesh position={[0, 0.02, 0.02]} rotation={[Math.PI * 0.68, 0, 0]}>
              <coneGeometry args={[0.1, 0.2, 12]} />
              <meshStandardMaterial color={noseColor} roughness={0.28} />
            </mesh>
            <mesh position={[0, -0.05, 0.09]} rotation={[Math.PI * 0.88, 0, 0]}>
              <coneGeometry args={[0.06, 0.11, 12]} />
              <meshStandardMaterial color={noseColor} roughness={0.28} />
            </mesh>
          </group>
        </>
      );
  }
}

/**
 * 등딱지, 하얀 점, 복슬복슬한 양털, 등에 난 가시, 꼬리 등 몸통 특징을 그리는 컴포넌트입니다.
 */
export function AnimalBodyFeatures({ config }: { config: AnimalVisualConfig }) {
  const { species, bodyColor, accentColor, detailColor } = config;
  // 꼬리 흔들기 애니메이션이 있는 동물(고양이, 강아지, 여우, 원숭이 등)을 위한 참조
  const tailRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!tailRef.current) return;
    const t = clock.getElapsedTime();

    if (species === "dog") {
      tailRef.current.rotation.y = Math.sin(t * 9.5) * 0.42;
    } else if (species === "cat") {
      tailRef.current.rotation.y = Math.sin(t * 2.6) * 0.3;
    } else if (species === "fox" || species === "monkey") {
      tailRef.current.rotation.y = Math.sin(t * 3.2) * 0.22;
    } else if (species === "squirrel") {
      tailRef.current.rotation.x = Math.sin(t * 4.2) * 0.05;
    }
  });

  return (
    <>
      {/* 1. 등·배 쪽 동물별 추가 특징 */}
      {species === "deer" && (
        /* 사슴 등의 하얀 점 무늬 */
        <>
          <mesh position={[-0.18, 0.08, -0.37]} scale={[0.07, 0.07, 0.04]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>
          <mesh position={[0.16, 0.1, -0.37]} scale={[0.065, 0.065, 0.04]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.02, -0.42]} scale={[0.075, 0.075, 0.04]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>
          <mesh position={[-0.2, -0.1, -0.38]} scale={[0.055, 0.055, 0.04]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>
          <mesh position={[0.19, -0.08, -0.38]} scale={[0.055, 0.055, 0.04]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>
        </>
      )}

      {species === "turtle" && (
        /* 거북이의 넓은 둥근 등딱지 + 테두리 + 등딱지 무늬 (정면 옆선에서도 살짝 보이도록 넓게 배치) */
        <group position={[0, -0.01, -0.18]}>
          <mesh scale={[0.57, 0.52, 0.36]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={detailColor} roughness={0.36} />
          </mesh>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]} scale={[0.59, 0.35, 0.14]}>
            <cylinderGeometry args={[1, 1, 0.5, 18]} />
            <meshStandardMaterial color={accentColor} roughness={0.42} />
          </mesh>
          {/* 등딱지 위 육각형 느낌의 둥근 무늬 5개 */}
          {[
            [0, 0.14, -0.31, 0.14],
            [0, -0.12, -0.32, 0.14],
            [-0.22, 0.02, -0.28, 0.13],
            [0.22, 0.02, -0.28, 0.13],
            [0, 0.01, -0.35, 0.15],
          ].map(([x, y, z, r], idx) => (
            <mesh key={idx} position={[x, y, z]} scale={[r, r, 0.06]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color="#4C8DB8" roughness={0.4} />
            </mesh>
          ))}
        </group>
      )}

      {species === "sheep" && (
        /* 양 몸통 주변의 몽글몽글한 털 구 여러 개 */
        <>
          {[
            [-0.28, 0.18, 0.24, 0.18],
            [0.28, 0.18, 0.24, 0.18],
            [0, 0.22, 0.3, 0.18],
            [-0.36, -0.04, 0.18, 0.19],
            [0.36, -0.04, 0.18, 0.19],
            [0, -0.12, -0.36, 0.2],
            [-0.26, 0.08, -0.32, 0.18],
            [0.26, 0.08, -0.32, 0.18],
          ].map(([x, y, z, r], idx) => (
            <mesh key={idx} position={[x, y, z]} scale={[r, r, r]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={bodyColor} roughness={0.45} />
            </mesh>
          ))}
        </>
      )}

      {species === "hedgehog" && (
        /* 고슴도치 등에 난 가시 여러 개 */
        <>
          {[
            [0, 0.16, -0.42, [-1.25, 0, 0]],
            [-0.24, 0.12, -0.38, [-1.2, 0, 0.4]],
            [0.24, 0.12, -0.38, [-1.2, 0, -0.4]],
            [0, -0.08, -0.45, [-1.55, 0, 0]],
            [-0.28, -0.1, -0.38, [-1.5, 0, 0.5]],
            [0.28, -0.1, -0.38, [-1.5, 0, -0.5]],
            [-0.16, -0.28, -0.38, [-1.85, 0, 0.3]],
            [0.16, -0.28, -0.38, [-1.85, 0, -0.3]],
          ].map(([x, y, z, rot], idx) => (
            <mesh
              key={idx}
              position={[x as number, y as number, z as number]}
              rotation={rot as [number, number, number]}
            >
              <coneGeometry args={[0.13, 0.34, 12]} />
              <meshStandardMaterial color={detailColor} roughness={0.42} />
            </mesh>
          ))}
        </>
      )}

      {species === "panda" && (
        /* 판다 어깨 뒤쪽의 부드러운 검은 무늬 */
        <mesh position={[0, 0.21, -0.03]} scale={[0.46, 0.11, 0.37]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={detailColor} roughness={0.36} />
        </mesh>
      )}

      {/* 2. 뒤쪽에 붙는 동물별 꼬리 */}
      <group ref={tailRef} position={[0, -0.2, -0.38]}>
        {species === "cat" && (
          /* 매끄러운 J자 곡선으로 위로 휘어 올라가는 고양이 꼬리 */
          <group>
            <mesh position={[0, 0.04, -0.1]} rotation={[-1.25, 0, 0]}>
              <capsuleGeometry args={[0.052, 0.14, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.08, -0.21]} scale={[0.054, 0.054, 0.054]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.14, -0.26]} rotation={[-0.75, 0, 0]}>
              <capsuleGeometry args={[0.05, 0.12, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.21, -0.3]} scale={[0.052, 0.052, 0.052]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.28, -0.31]} rotation={[-0.2, 0, 0]}>
              <capsuleGeometry args={[0.048, 0.12, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.36, -0.31]} scale={[0.05, 0.05, 0.05]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.42, -0.28]} rotation={[0.35, 0, 0]}>
              <capsuleGeometry args={[0.045, 0.1, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
          </group>
        )}

        {species === "lion" && (
          /* 몸통에 단단히 붙어 부드럽게 올라가는 사자 꼬리와 끝 털 뭉치 */
          <group>
            <mesh position={[0, 0.08, -0.09]} rotation={[-1.05, 0, 0]}>
              <capsuleGeometry args={[0.042, 0.24, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.155, -0.225]} scale={[0.043, 0.043, 0.043]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.24, -0.25]} rotation={[-0.25, 0, 0]}>
              <capsuleGeometry args={[0.04, 0.16, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.35, -0.28]} scale={[0.115, 0.125, 0.115]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={detailColor} roughness={0.4} />
            </mesh>
          </group>
        )}

        {species === "fox" && (
          /* 끝이 하얀 풍성한 여우 꼬리 */
          <group rotation={[-0.75, 0, 0]}>
            <mesh position={[0, 0.18, -0.1]}>
              <capsuleGeometry args={[0.15, 0.32, 6, 12]} />
              <meshStandardMaterial color={bodyColor} roughness={0.36} />
            </mesh>
            <mesh position={[0, 0.4, -0.1]} scale={[0.145, 0.16, 0.145]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={accentColor} roughness={0.38} />
            </mesh>
          </group>
        )}

        {species === "squirrel" && (
          /* 몸통에서 바깥쪽으로 둥글게 말려 올라가며 꼬리 끝이 뒤쪽 바깥을 향하는 풍성한 다람쥐 꼬리 */
          <group>
            <mesh position={[0, 0.08, -0.08]} rotation={[-0.65, 0, 0]} scale={[0.16, 0.19, 0.16]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={detailColor} roughness={0.38} />
            </mesh>
            <mesh position={[0, 0.25, -0.24]} rotation={[-0.5, 0, 0]} scale={[0.2, 0.24, 0.2]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={detailColor} roughness={0.38} />
            </mesh>
            <mesh position={[0, 0.48, -0.36]} rotation={[-0.25, 0, 0]} scale={[0.21, 0.25, 0.21]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={detailColor} roughness={0.38} />
            </mesh>
            <mesh position={[0, 0.7, -0.42]} rotation={[-0.35, 0, 0]} scale={[0.2, 0.22, 0.2]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={detailColor} roughness={0.38} />
            </mesh>
            <mesh position={[0, 0.87, -0.51]} rotation={[-0.78, 0, 0]} scale={[0.15, 0.19, 0.15]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={accentColor} roughness={0.4} />
            </mesh>
          </group>
        )}

        {species === "dog" && (
          /* 흔드는 강아지 꼬리 */
          <mesh position={[0, 0.08, -0.09]} rotation={[-0.75, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.18, 6, 10]} />
            <meshStandardMaterial color={detailColor} roughness={0.36} />
          </mesh>
        )}

        {species === "monkey" && (
          /* 몸통에 단단히 붙어 S자로 부드럽게 말려 올라가는 원숭이 꼬리 */
          <group>
            <mesh position={[0, 0.08, -0.09]} rotation={[-1.05, 0, 0]}>
              <capsuleGeometry args={[0.044, 0.24, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.16, -0.23]} scale={[0.046, 0.046, 0.046]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.26, -0.255]} rotation={[-0.22, 0, 0]}>
              <capsuleGeometry args={[0.044, 0.14, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.37, -0.28]} scale={[0.045, 0.045, 0.045]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0.03, 0.45, -0.24]} rotation={[0.45, 0, -0.32]}>
              <capsuleGeometry args={[0.042, 0.11, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0.06, 0.53, -0.2]} scale={[0.042, 0.042, 0.042]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
            <mesh position={[0.132, 0.569, -0.233]} rotation={[-0.7, 0, -0.95]}>
              <capsuleGeometry args={[0.038, 0.1, 6, 10]} />
              <meshStandardMaterial color={bodyColor} roughness={0.34} />
            </mesh>
          </group>
        )}

        {(species === "rabbit" || species === "sheep") && (
          /* 폭신한 솜뭉치 꼬리 */
          <mesh position={[0, -0.02, -0.04]} scale={[0.16, 0.16, 0.16]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.42} />
          </mesh>
        )}

        {(species === "bear" || species === "panda" || species === "deer") && (
          /* 동글동글 작은 꼬리 */
          <mesh position={[0, -0.02, -0.03]} scale={[0.13, 0.13, 0.13]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color={species === "panda" ? detailColor : accentColor}
              roughness={0.4}
            />
          </mesh>
        )}

        {species === "turtle" && (
          /* 거북이 몸통 색에 맞춘 둥글고 짧은 꼬리 */
          <mesh position={[0, -0.1, -0.06]} rotation={[-1.1, 0, 0]}>
            <coneGeometry args={[0.075, 0.14, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.36} />
          </mesh>
        )}

        {species === "parrot" && (
          /* 알록달록 앵무새 꼬리 깃털 */
          <mesh position={[0, -0.06, -0.1]} rotation={[0.9, 0, 0]} scale={[1.2, 1, 0.45]}>
            <capsuleGeometry args={[0.08, 0.26, 6, 10]} />
            <meshStandardMaterial color={detailColor} roughness={0.34} />
          </mesh>
        )}

        {species === "penguin" && (
          /* 중앙 뒤쪽으로 균형 있게 뻗은 짧은 펭귄 꼬리 */
          <mesh position={[0, -0.12, -0.07]} rotation={[-1.05, 0, 0]}>
            <coneGeometry args={[0.085, 0.16, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.34} />
          </mesh>
        )}
      </group>
    </>
  );
}
