import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import waterVertexShader from "./shaders/water/vertex";
import waterFragmentShader from "./shaders/water/fragment";
import objectVertexShader from "./shaders/object/vertex";
import objectFragmentShader from "./shaders/object/fragment";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const settings = {
  waveAmp: 0.6,
  waveNoise: 1,
  object: false,
};
const gui = new dat.GUI({ width: 340 });

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-5, 3, -2);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#000523");

const waterGeometry = new THREE.PlaneGeometry(4, 4, 512, 512);
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    PI: { value: Math.PI },
    uTex: { value: null },
    uWaveAmp: { value: 0.6 },
    uWaveNoise: { value: 1 },
  },
  side: THREE.DoubleSide,
});

gui
  .add(settings, "waveAmp")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Amp")
  .onChange((value) => {
    waterMaterial.uniforms.uWaveAmp.value = value;
    objectMaterial.uniforms.uWaveAmp.value = value;
  });
gui
  .add(settings, "waveNoise")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Noise")
  .onChange((value) => {
    waterMaterial.uniforms.uWaveNoise.value = value;
    objectMaterial.uniforms.uWaveNoise.value = value;
  });
gui
  .add(settings, "object")
  .name("Object")
  .onChange((value) => {
    object.visible = value;
  });

textureLoader.load("/waves.jpg", (tex) => {
  waterMaterial.uniforms.uTex.value = tex;
  waterMaterial.needsUpdate = true;
});

const water = new THREE.Mesh(waterGeometry, waterMaterial);
scene.add(water);

const objectGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.9);
// const objectGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const objectMaterial = new THREE.ShaderMaterial({
  vertexShader: objectVertexShader,
  fragmentShader: objectFragmentShader,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    PI: { value: Math.PI },
    uWaveAmp: { value: 0.6 },
    uWaveNoise: { value: 1 },
  },
  side: THREE.DoubleSide,
});
const object = new THREE.Mesh(objectGeometry, objectMaterial);
object.visible = false;
scene.add(object);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  waterMaterial.uniforms.uTime.value = elapsedTime;
  objectMaterial.uniforms.uTime.value = elapsedTime;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
