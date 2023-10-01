import { map, perlin3d, rotation3d } from "../utils";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float PI;
  uniform float uWaveAmp;
  uniform float uWaveNoise;

  varying vec3 vNormal;

  ${perlin3d}
  ${rotation3d}
  ${map}
  
  void main() {
    float ld = 2.;
    float off = 0.;
    float t = mod(uTime + off, ld) / ld;
    float u = t * PI * 2.;

    vec3 pos = position;

    vec2 dir = vec2(
      sin(u + 2. - cos(u + .5) * .5) * uWaveAmp,
      cos(u) * uWaveAmp
    );

    float za = cnoise(vec3(uTime * .5));

    pos = (vec4(pos, 1.) * rotation3d(vec3(1., 0., 0.), -sin(u) * PI / 4. * uWaveAmp)).xyz;
    pos = (vec4(pos, 1.) * rotation3d(vec3(0., 0., 1.), za * PI / 4. * uWaveNoise)).xyz;

    pos.yz += dir;
    
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vNormal = normal;
}`;

export default vertexShader;
