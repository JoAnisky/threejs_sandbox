import '../styles/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// #### Création de la caméra #### \\
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);

camera.position.set(-15, 50, 150);
camera.lookAt(new THREE.Vector3(0, 0, 0));
// #### Création du Renderer #### \\
const renderer = new THREE.WebGLRenderer(
{
    canvas: document.getElementById('webgl'),
    antialias: true
});
console.log(THREE);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// #### Window Resize #### \\
function OnWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize' , OnWindowResize);

// #### Création de la scène #### \\
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

// #### Controls #### \\
const controls = new OrbitControls(camera, renderer.domElement);

function animate()
{
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// #### Ambient Light #### \\
let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(hemiLight);

// #### Directional light #### \\
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;

// #### Création du sol #### \\
function createFloor ()
{
    let pos = { x: 0, y: -1, z: 3 };
    let scale = { x: 100, y: 2, z: 100 };

    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({
            color: 0xf9c834
        })
    );
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);
}

// #### Création d'une box #### \\
function createBox ()
{
    let scale = { x: 6, y: 6, z: 6 };
    let pos = { x: 15, y: scale.y / 2, z: 15 };

    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({
            color: 0xDC143C
        })
    );
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);
}

// #### Création d'une sphère #### \\
function createSphere ()
{
    let radius = 4;
    let pos = { x: 15, y: radius, z: -15};

    let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({
            color: 0x43a1f4
        })
    );
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
}

// #### Création d'un cylindre #### \\
function createCylinder ()
{
    let radius = 4;
    let height = 6;
    let pos = { x: -15, y: height / 2, z: 15 };

    // threejs
    let cylinder = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(radius, radius, height, 32 ), 
        new THREE.MeshPhongMaterial({
            color: 0x90ee90
        })
    )
    cylinder.position.set(pos.x, pos.y, pos.z);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder);
}

// #### Création d'un objet 3D d'après un modèle .obj #### \\
function createCastle ()
{
    const objLoader = new OBJLoader();
    objLoader.loadAsync('./obect.obj').then((group) =>{
        const castle = group.children[0];

        castle.position.x = -15;
        castle.position.z = -15;

        castle.scale.x = 5;
        castle.scale.y = 5;
        castle.scale.z = 5;

        castle.castShadow = true;
        castle.receiveShadow = true;
        scene.add(castle);
    })
}

createFloor();
createBox();
createSphere();
createCylinder();

animate();