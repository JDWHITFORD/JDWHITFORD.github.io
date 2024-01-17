// Joshua Whitford "Simple Viewer" for Arthrex Technical Assignment
// January 16, 2024
// Takes a (currently hard-coded) pair of input files:
// -- An STL of a scapula (provided) and a R=20mm Solid Sphere made up in Fusion 360 vis a simple arc & revolve.
// Summary : Creates a visualization of the scapula that users can click to "socket" a sphere in the Glenoid region.
// After placing the sphere, it can be adjusted by 5mm increments.
// Used three.js - check the README.md for the motivation.

import * as THREE from "three";

// Basic functionality pulled in: orbit (camera) transform (sphere) and an STL loader for STL files.
// Given more time, the loader could be made more dynamic to handld OBJ, Step, etc. based on file extension (and validated via content)
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

let cameraOrtho, currentCamera, cameraFrustumSize;
let scene, renderer, stlLoader, modelControl, camOrbitControl;
const worldScale = 0.01;
const snapIncrement = 0.05;

// You'll need a live server or to host these somewhere. CORS doesn't like file:// anymore.
// Made the assumption that we might want to expose the file(s) to be selected in the future.
let hostingURL = "http://localhost:5500/";
let sphereFileName = "media/Sphere_40mm.stl";
let scapulaFileName = "media/Scapula (2).stl";

let socketableMeshArray = [];

init();
render();

// Sets up our scene, adds the STLs, and adds controls to the UI.
// Assumed I don't know the user's device, and used Ortho rather than Perspective 
//    w/ the assumption that scale would need to be easy to perceive visually.
function init() {

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  const aspect = window.innerWidth / window.innerHeight;
  
  scene = new THREE.Scene();
  scene.add(new THREE.GridHelper(2.5, 50, 0x888888, 0x222222)); // Grid is (overall size (250 mm), cells in each row/column (50), and colors of majors and minors)
  
  const ambientLight = new THREE.AmbientLight(0xffffff);  
  scene.add(ambientLight);                                     // Consider adding a light slider to help people better see and understand depth and ridges.
  
  const light = new THREE.DirectionalLight(0xffffff, 4);
  light.position.set(1, 1, 1);
  scene.add(light);


  // Camera Setup
  // Consider allowing users to control this via a GUI set of sliders. Consider allowing camera switching.
  cameraFrustumSize = 3;
  cameraOrtho = new THREE.OrthographicCamera(
                (cameraFrustumSize * aspect) / -2,
                (cameraFrustumSize * aspect) / 2,
                cameraFrustumSize / 2,
                cameraFrustumSize / -2,
                0.1, // Near Plane
                1000 // Far Plane
            );
  currentCamera = cameraOrtho; // Considered adding other cameras. Not an evening-type of scope, though!
  currentCamera.zoom = 1.4;
  currentCamera.position.set(2, 2, 2);
  currentCamera.lookAt(new THREE.Vector3(2,0,2));
  currentCamera.updateProjectionMatrix();


  camOrbitControl = new OrbitControls(currentCamera, renderer.domElement);
  camOrbitControl.update();
  camOrbitControl.addEventListener("change", render);


  // Loading our models. Spent too much time trying to math the match on the glenoid automatically.
  // Instead, since we might have wildly different scapula we'll lean on the users to tell us an initial position.
  stlLoader = new STLLoader(); // Worth noting this automatically recognizes binary vs. ASCII STL files.

  addStaticModelsToScene(hostingURL, scapulaFileName);

  modelControl = new TransformControls(currentCamera, renderer.domElement);
  modelControl.setTranslationSnap(snapIncrement);
  modelControl.addEventListener("change", render);
  modelControl.addEventListener("dragging-changed", function (event) {
    camOrbitControl.enabled = !event.value;  // Don't move the camera and sphere at the same time.
  });



  document.addEventListener("click", userClickedSocketable);
  window.addEventListener("resize", onWindowResize);

}

// When a user clicks a socketable mesh (e.g. the Scapula), we'll raycast into the screen to find where they clicked.
function userClickedSocketable(event) {
  let raycaster = new THREE.Raycaster();
  let pointer = new THREE.Vector2();

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Cast a ray from pointer location into the scene - what does it hit that is in the socketableMeshArray list?
  raycaster.setFromCamera(pointer, currentCamera);
  const intersects = raycaster.intersectObjects(socketableMeshArray, false);

  // Add the sphere to the object that was clicked, where it was clicked.
  // Really rough logic, and given more time I would've tried to put it more on rails, and give confirmation dialogs.
  if (intersects.length > 0) {
    addSphereToSpecifiedSocket(intersects); 
    document.removeEventListener("click", userClickedSocketable);
    render();
  }
}


// Adding sphere to the user's clicked location on the meshes that can be socketed.
// Adds controls for moving the sphere after placement, snaps movement to 5mm increments.
// Consider adding GUI to change these increments and/or enable sliders similar to VIP YouTube (UX and language familiarity to users.)
// In an ideal world, we could math or use sub-objects to determine the glenoid facing. Not in scope for the evening.
function addSphereToSpecifiedSocket(intersects, hostingUrl, modelFileName) {

  const sphereMaterial = new THREE.MeshPhongMaterial({
                            color: 0x6c6c6c,
                            specular: 0x494949,
                            shininess: 100,
                        });

  stlLoader.load(`${hostingURL}${sphereFileName}`, (geometry) => {
    const sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
    sphereMesh.scale.set(worldScale, worldScale, worldScale);
    sphereMesh.position.set(
                intersects[0].point.x + 0.1,     // TODO: Calculate the real offsets based on sphere radius. This works for now.
                intersects[0].point.y + 0.1,
                intersects[0].point.z + 0.1
                );
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;

    // Remember to attach the translational modelControls
    modelControl.attach(sphereMesh);

    scene.add(sphereMesh);
    scene.add(modelControl);
    // TODO: Make this more dynamic, reusable, and elegant...
    document.getElementById("instructionalTextStep1").style.display = "none";
    document.getElementById("instructionalTextStep2").style.display = "block";
    render();
  });
}

function addStaticModelsToScene(hostingUrl, modelFileName) {
  const scapMaterial = new THREE.MeshPhongMaterial({
                            color: 0xf6f1c4,
                            specular: 0x494949,
                            shininess: 200,
                        });
  // The STLs could have color baked in. I'm going to arbitrarily assign a color so I know it'll always be visible and have some light interaction.
  // Scapula - Static but Selectable as a Socketable Mesh that we'll attach our sphere to.
    stlLoader.load(`${hostingURL}${scapulaFileName}`, (geometry) => {
    const mesh = new THREE.Mesh(geometry, scapMaterial);
    mesh.scale.set(worldScale, worldScale, worldScale);
    mesh.receiveShadow = true;
    
    // Forcing this calculation at load for the scapula, because they might vary in length / size.
    // The radius of the boundingSphere of this model will give us our largest dimension w/ some excess.
    geometry.computeBoundingSphere();
    let longestSide = geometry.boundingSphere.radius - 10;
    mesh.position.set(0, 0 + longestSide * worldScale, 0 + (longestSide / 2 ) * worldScale);


    // Two things could be accounted for: depending on the software, the "forward" vector can be different,
    // or if we assume the scapula will always be "longest" in its upright / tallest orientation, we could find that instead.
    mesh.rotation.set(-Math.PI / 2, 0, 0);
    scene.add(mesh);
    socketableMeshArray.push(mesh);

    render();

  });
}

// Re-calculates and redraws things if the user resizes their window mid viewing.
function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  cameraOrtho.left = cameraOrtho.bottom * aspect;
  cameraOrtho.right = cameraOrtho.top * aspect;
  cameraOrtho.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, currentCamera);
}
