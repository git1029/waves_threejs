const fragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uWaveAmp;

  varying vec2 vUv;
  varying float vElevation;
  varying float vT;

  void main() {
    vec4 c0 = vec4(vec3(2., 44., 104.)/255., 0.);
    vec4 c1 = vec4(vec3(16., 144., 161.)/255., .0);
    vec4 c2 = vec4(vec3(159., 184., 189.)/200., .5);
    vec4 c3 = vec4(vec3(200., 228., 238.)/255., 1.);

    vec3 colorA = c0.rgb;
    float stopA = c0.a;
    for (float i = 1.; i < 4.; i++) {
      vec4 cB = c1;
      if (i == 2.) cB = c2;
      if (i == 3.) cB = c3;
      vec3 colorB = cB.rgb;
      float stopB = cB.a;
      float fc = smoothstep(stopA, stopB, vElevation);
      colorA = mix(colorA, colorB, fc);
      stopA = cB.a;
    }

    colorA = mix(texture2D(uTex, vUv).rgb, colorA, vElevation);
    colorA = mix(colorA, c1.rgb, pow(1. - vElevation, 2.) * .9);
    colorA *= mix(vec3(1.), c0.rgb, pow(vT, 2.) * mix(.9, 1., smoothstep(.6, 1., uWaveAmp)) * smoothstep(0., .6, uWaveAmp));

    gl_FragColor = vec4(colorA, 1.0);
  }
`;

export default fragmentShader;
