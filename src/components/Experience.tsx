import { OrbitControls, Sky } from "@react-three/drei";
import Grass from "./Grass";


const Experience = () => {
  return (
    <>
      {/* 헬퍼 */}
      <OrbitControls makeDefault />
      {/* 배경 */}
      <Sky sunPosition={[100, 5, 3]} />
      {/* 조명 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      {/* 잔디 */}
      <Grass />
      {/* 바닥 */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2d4a1e" />
      </mesh>
    </>
  );
};

export default Experience;
