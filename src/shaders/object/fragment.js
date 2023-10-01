const fragmentShader = /* glsl */ `
  varying vec3 vNormal;

  void main() {
    gl_FragColor = vec4(vNormal, 1.0);
  }
`;

export default fragmentShader;
