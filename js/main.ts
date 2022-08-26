import '../styles/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DirectionalLight, DirectionalLightHelper, GridHelper } from 'three';

// #### Création de la caméra #### \\
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);

camera.position.set(-15, 50, 150);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// #### Création du Renderer #### \\
const renderer = new THREE.WebGLRenderer(
{
    // canvas: document.getElementById('webgl'),
    antialias: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// #### Window Resize #### \\
export function OnWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize' , OnWindowResize);

// #### --  Création de la scène -- #### \\
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010101);

// #### -- Controls -- #### \\
const controls = new OrbitControls(camera, renderer.domElement);

// #### --  gridHelper -- #### \\
const gridHelperCheckbox = document.getElementById('grid-helper',) as HTMLInputElement | null;
gridHelperCheckbox?.addEventListener('click', () => {
    if (gridHelperCheckbox != null) {
        let checked = false;
        // ✅ Si checkbox checked
        if (gridHelperCheckbox.checked){
            checked = true
        }else{
            checked = false
        }
        gridHelp(checked);
        // ✅ Si checkbox unchecked
    }
});
// #### fonction gridHelper #### \\
function gridHelp (check: boolean) 
{
    // Définit la taille de l'objet (d'abord stocké dans l'objet scale)
    let scale = { x: 120, y: 2, z: 100 };
    const size = scale.x;
    // Le nombre de divisions de la ligne
    const divisions = 10;

    // Instancie l'objet grid Helper
    const gridHelper = new GridHelper( size, divisions );
    // Donne un nom au grid helper (indispensable pour pouvoir le remove par la suite)
    gridHelper.name = "gridHelper";
    // Stocke le nom de l'objet dans une variable qui nécéssite de préciser le type d'objet
    let gridHelperName = <THREE.GridHelper><any>scene.getObjectByName('gridHelper');
    // Si check est a true
    if (check){
        // Ajoute le GridHelper
        scene.add(gridHelper);
    }else{
        // Sinon retire le gridHelper
        scene.remove(gridHelperName);
    }
}

// #### --- LIGHTS --- #### \\

// ## Point Light ## \\
const pointLight = new THREE.PointLight( 0x7f00ff, 1, 200 );
pointLight.position.set( 10, 10, 10 );
scene.add( pointLight );
// # PointLight Helper # \\
const pointLightHelperCheckbox = document.getElementById('point-light-helper',) as HTMLInputElement | null;

pointLightHelperCheckbox?.addEventListener('click', () => {
    if (pointLightHelperCheckbox != null){
        let checked = false;
        if (pointLightHelperCheckbox.checked){
            checked = true;
        }else{
            checked = false;
        }
        pointLightHelper(checked)
    }
})

function pointLightHelper(check: boolean)
{
    const sphereSize = 2;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    pointLightHelper.name = "pointLightHelper";
    let pointLightHelperName = <THREE.GridHelper><any>scene.getObjectByName('pointLightHelper');

    if(check){
        scene.add( pointLightHelper );

    }else{
        scene.remove(pointLightHelperName);
    }
}

// #### Animate fonction (for refresh) #### \\
export function animate()
{
    dragObect()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// #### Ambient Light #### \\
let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(hemiLight);

// #### Directional light #### \\
let dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
dirLight.position.set(-20, 50, -30);
scene.add(dirLight);

// Ajoute une ombre à la scène
dirLight.castShadow = true;
// Définit la taille de l'ombre
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
// Définit la position de l'ombre
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;


// #### HELPER - Directional light #### \\
const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
dirLightHelper.name = "dirLightHelper";

// Checkbox pour activer
const dirLightHelperCheckbox = document.getElementById('dir-light-helper',) as HTMLInputElement | null;

dirLightHelperCheckbox?.addEventListener('click', () => {
    if (dirLightHelperCheckbox != null) {
        let checked = false;
        if (dirLightHelperCheckbox.checked){
            checked = true;
        }else{
            checked = false;
        }
        dirLightHelp(checked);
    }
})

function dirLightHelp (check: boolean)
{
    if(check){
        scene.add(dirLightHelper);        
    }else{
        let dirLightHelperName = <THREE.GridHelper><any>scene.getObjectByName('dirLightHelper');

        scene.remove(dirLightHelperName)
    }
}

// #### -- Création des Meshs -- #### \\
// ## Création du sol ## \\
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

    //  Object3D.userData sert a stocker des données sur l'objet 3D
    blockPlane.userData.ground = true;
};
function createWall () 
{
    let pos = { x: 0, y: 25, z: -46 };
    let scale = { x: 100, y: 50, z: 2 };
    let blockWall = new THREE.Mesh(new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({
        color: 0xf9c834
    })
);
blockWall.position.set(pos.x, pos.y, pos.z);
blockWall.scale.set(scale.x, scale.y, scale.z);
blockWall.castShadow = true;
// blockWall.receiveShadow = true;
scene.add(blockWall);
}
// ## Création d'une box ## \\
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
    // objet.userData.draggable sert à dire que l'objet sera "draggable"
    box.userData.draggable = true;
    // objet.userData.name permet de lui attribuer un nom
    box.userData.name = 'BOX';
};

// ## Création d'une sphère ## \\
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
    
    sphere.userData.draggable = true;
    sphere.userData.name = 'SPHERE';
};

// ## Création d'un cylindre ## \\
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
    
    cylinder.userData.draggable = true;
    cylinder.userData.name = 'CYLINDER';
};

// ## Création d'un objet 3D d'après un modèle .obj ## \\
function createCastle ()
{
    const objLoader = new OBJLoader();
    objLoader.loadAsync('../assets/models/castle/castle.obj').then((group) =>{
        const castle = group.children[0];

        castle.position.x = -15;
        castle.position.z = -15;

        castle.scale.x = 5;
        castle.scale.y = 5;
        castle.scale.z = 5;

        castle.castShadow = true;
        castle.receiveShadow = true;
        scene.add(castle);

        castle.userData.draggable = true;
        castle.userData.name = 'CASTLE';
    })
};

// #### Instance du raycaster #### \\
const raycaster = new THREE.Raycaster();

// #### Position du click avec 2 vecteurs x et y #### \\
const clickMouse = new THREE.Vector2();

// #### Derniere position de la souris #### \\
const moveMouse = new THREE.Vector2();

// #### la variable qui va contenir le dernier objet cliqué
var draggable: THREE.Object3D;

window.addEventListener('click', event => {
    if (draggable){
        console.log(`déplacement de ${draggable.userData.name} terminé`);
        draggable = null as any
        return;
    }
    // Ici on définit ou la souris a cliqué en x puis en y
	clickMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	clickMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( clickMouse, camera );

    // Ici on calcule quel objet intersecte
    const found = raycaster.intersectObjects( scene.children );
    // Cela stocke dans un tableau les coordonées

    // Si tu trouve un object qui intersecte
    // Et que l'objet trouvé est draggable true
    if(found.length > 0 && found[0].object.userData.draggable){
        // stocke le dans la variable globale draggable
        draggable = found[0].object
        console.log(`Un objet déplaçable a été trouvé : ${draggable.userData.name}`);
    }
});

window.addEventListener('mousemove', event => {
    moveMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	moveMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});

function dragObect ()
{
    if (draggable != null){
        raycaster.setFromCamera(moveMouse, camera)
        const found = raycaster.intersectObjects( scene.children );
        if (found.length > 0){
            for (let o of found){
                if(!o.object.userData.ground)
                    continue

                    draggable.position.x = o.point.x
                    draggable.position.z = o.point.z
            }
        }
    }
}

createFloor();
createWall();
createBox();
createSphere();
createCylinder();
createCastle();


animate();