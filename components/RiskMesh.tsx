import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Explicitly extend JSX.IntrinsicElements to include R3F elements used in this file
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      icosahedronGeometry: any;
      shaderMaterial: any;
    }
  }
}

interface RiskMeshProps {
  siprScore: number;
}

// GLSL Vertex Shader: Deforms the mesh based on time and risk factor
const vertexShader = `
  uniform float uTime;
  uniform float uRisk;
  varying vec2 vUv;
  varying float vDisplacement;
  varying vec3 vNormal;

  // Classic Perlin Noise (Simplified for brevity)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Amplitude increases with risk score
    float amplitude = 0.1 + (uRisk * 1.5); 
    
    // Frequency increases with risk score
    float frequency = 1.0 + (uRisk * 4.0);
    
    float noiseVal = snoise(position * frequency + uTime * 0.5);
    vDisplacement = noiseVal;
    
    vec3 newPosition = position + normal * noiseVal * amplitude;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// GLSL Fragment Shader: Colors change based on risk
const fragmentShader = `
  uniform float uRisk;
  uniform float uTime;
  varying float vDisplacement;
  varying vec3 vNormal;

  void main() {
    // Base Colors
    vec3 safeColor = vec3(0.0, 0.8, 1.0); // Cyan
    vec3 dangerColor = vec3(1.0, 0.1, 0.1); // Red
    vec3 midColor = vec3(0.5, 0.0, 1.0); // Purple

    // Mix based on Risk
    vec3 baseColor = mix(safeColor, midColor, uRisk);
    baseColor = mix(baseColor, dangerColor, smoothstep(0.5, 1.0, uRisk));

    // Pulse effect for high risk
    float pulse = 0.0;
    if (uRisk > 0.7) {
        pulse = sin(uTime * 10.0) * 0.2;
    }

    // Edge highlighting using displacement
    float intensity = 0.6 + (vDisplacement * 2.0) + pulse;
    
    // Wireframe-ish feel
    float scanline = sin(gl_FragCoord.y * 0.5 + uTime * 5.0) * 0.1;

    gl_FragColor = vec4(baseColor * intensity + scanline, 0.85);
  }
`;

const RiskMesh: React.FC<RiskMeshProps> = ({ siprScore }) => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uRisk: { value: 0 },
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.005 + (siprScore * 0.02); // Spin faster on high risk
      mesh.current.rotation.z += 0.002;
      
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Smooth interpolation for risk value
      material.uniforms.uRisk.value = THREE.MathUtils.lerp(
        material.uniforms.uRisk.value,
        siprScore,
        0.05
      );
    }
  });

  return (
    <mesh ref={mesh}>
      {/* High segment count for smooth deformation */}
      <icosahedronGeometry args={[2, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        wireframe={false}
      />
    </mesh>
  );
};

export default RiskMesh;