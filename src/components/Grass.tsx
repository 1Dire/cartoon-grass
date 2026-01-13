import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
const GRASS_COUNT = 20000;

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main(){
    vUv = uv;
    vec4 instancePosition = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);

    float windDistortion = sin(instancePosition.x * 0.5 + instancePosition.z * 0.5 + uTime);
    float wind = windDistortion * 0.2; // 흔들림 강도 조절

    vec3 pos = position;

    pos.x += wind  * uv.y;
    
    pos.z += (abs(position.x) / 0.075) * 0.05;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;
const fragmentShader = `
  varying vec2 vUv;

  void main(){
    vec3 baseColor = vec3(0.1, 0.3, 0.1); 
    vec3 tipColor = vec3(0.5, 0.8, 0.2);
   
    vec3 finalColor = mix(baseColor, tipColor, vUv.y);

    gl_FragColor = vec4(finalColor, 1.0);
  }

`;

const Grass = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.15, 0.7, 1, 8);
    geo.translate(0, 0.35, 0);

    const position = geo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      const x = position.getX(i);

      const ratio = y / 0.7;

      const taper = Math.pow(1.0 - ratio, 0.8);
      position.setX(i, x * taper);
    }

    position.needsUpdate = true;
    return geo;
  }, []);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < GRASS_COUNT; i++) {
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      dummy.position.set(x, 0, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, GRASS_COUNT]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 }, // 초깃값 0
        }}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};

export default Grass;
