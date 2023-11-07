import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#loadingWrap").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minDistance = 5;
controls.maxDistance = 12;

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

const light = new THREE.AmbientLight(0x404040, 1); // soft white light
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 20);
pointLight.position.y = 4;
pointLight.position.x = -3;
pointLight.position.z = 3;
pointLight.castShadow = true;
scene.add(pointLight);

const blueDirectional = new THREE.PointLight(0x5376cc, 12);
blueDirectional.position.z = 2;
blueDirectional.position.y = 1;
blueDirectional.position.x = 3;
scene.add(blueDirectional);

const pinkDirectional = new THREE.PointLight(0xff4b3d, 20);
pinkDirectional.position.x = -3;
pinkDirectional.position.z = -4;
pinkDirectional.position.y = 6;
scene.add(pinkDirectional);

let delorean = null;
const loader = new GLTFLoader();
loader.load(
  "./DeLorean.glb",
  function (gltf) {
    scene.add(gltf.scene);
    delorean = gltf.scene;

    delorean.castShadow = true;
    delorean.traverse((node) => {
      if (node.isMesh) node.castShadow = true;
    });
  },
  undefined,
  function (error) {
    console.error(error);
    delorean = null;
  }
);

const geometry = new THREE.CircleGeometry(3, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x2b2b2b,
  roughness: 1,
  metalness: 1,
});
const phong = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  depthWrite: true,
});

const floor = new THREE.Mesh(geometry, material);
floor.receiveShadow = true;
floor.position.y = 0.2;
floor.rotateX(-Math.PI / 2);
scene.add(floor);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;
camera.position.y = 2;

let carYPos = 0;
let floatIncrement = 0.001;

let hit = false;

let carYRot = 0;
let rotationIncrement = Math.PI / 300000;

let clicked = false;
document.addEventListener("mousedown", () => (clicked = true));
document.addEventListener("mouseup", () => (clicked = false));

function animate() {
  if (delorean && !clicked) {
    if (carYPos < 0.2 && !hit) {
      delorean.position.y = carYPos;
      carYPos += floatIncrement;
      if (carYPos >= 0.2) hit = true;
    } else {
      delorean.position.y = carYPos;
      carYPos -= floatIncrement;
      if (carYPos <= 0) hit = false;
    }

    carYRot += rotationIncrement;
    if (carYRot >= Math.PI * 2) carYRot = 0;
    delorean.rotateY(carYRot);
  }

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / 60);
  controls.update();
  renderer.render(scene, camera);
}
animate();

const svgWidth = 550;
const svgHeight = 30;
const loadingColor = "#fff";

const paddingFromViewbox = 10;
const borderRadius = svgHeight / 2;

const draw = SVG()
  .addTo("#loadingBarWrap")
  .size(svgWidth + paddingFromViewbox, svgHeight + paddingFromViewbox);
const outterRect = draw
  .rect(svgWidth, svgHeight)
  .attr({ fill: "none", x: paddingFromViewbox / 2, y: paddingFromViewbox / 2 });
outterRect.stroke({ color: loadingColor, width: 4 });
outterRect.radius(borderRadius);

const innerRectWidth = svgWidth - paddingFromViewbox;
const innerRectHeight = svgHeight - paddingFromViewbox;
const innerRectBorderRadius = innerRectHeight / 2;
const innerRect = draw.rect(innerRectWidth, innerRectHeight).attr({
  fill: "none",
  x: paddingFromViewbox,
  y: paddingFromViewbox,
});
innerRect.stroke({ color: loadingColor, width: 4 });
innerRect.radius(innerRectBorderRadius);

const animateLoadingBar = () => {
  const checkmarkObj = document.querySelector("#checkmarkWrapper > i");
  const loadPercent = sessionStorage.getItem("load");
  innerRect.width(loadPercent * (svgWidth - paddingFromViewbox));

  checkmarkObj.style.scale = 0.0001;
  if (loadPercent == 100) {
    sessionStorage.setItem("load", "0");
    innerRect.width(svgWidth - paddingFromViewbox);
    gsap.to(innerRect, {
      width: 0,
      x: innerRectWidth / 2 + paddingFromViewbox + paddingFromViewbox / 2,
      duration: 1,
      ease: "power3.in",
      delay: 0.7,
    });
    gsap.to(outterRect, {
      width: 0,
      x: svgWidth / 2 + paddingFromViewbox,
      duration: 1,
      delay: 0.9,
      ease: "power3.in",
    });

    gsap.to(checkmarkObj, {
      rotate: 360,
      scale: 12000,
      delay: 1.9,
      duration: 0.6,
      ease: "power4.out",
    });
    setTimeout(() => {
      document.querySelector("#checkmarkWrapper").classList.add("complete");
    }, 1500);
    document
      .querySelector(".root")
      .scrollTo({ top: 0, left: 0, behavior: "smooth" });
    return;
  }

  requestAnimationFrame(animateLoadingBar);
};

animateLoadingBar();
