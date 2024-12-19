import * as THREE from 'three';
import gsap from "gsap";
import { OrbitControls} from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

//Texture Loader
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');
const nightLightsTexture = textureLoader.load('eartf.jpg');

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    map: earthTexture,
    emissiveMap: nightLightsTexture,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 1.5,
});
const earth = new THREE.Mesh(geometry, material);
earth.castShadow = true;
earth.receiveShadow = true;
scene.add(earth);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

//Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.PointLight(0xffffff, 30, 80, 1.8);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

//Earth shadows
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;


const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 10;
scene.add(camera);

const canvas = document.querySelector("canvas.webgl");
if(!canvas){
    console.error("canvas not found.");
}

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";

window.addEventListener("resize", ()=> {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});



const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};
loop();


const tl = gsap.timeline({defaults: { duration: 1 }});
tl.fromTo(earth.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1 });
tl.fromTo('nav', {y: "-100%"}, {y: "0%"});
tl.fromTo('title', {opacity: 0}, {opacity: 1});
