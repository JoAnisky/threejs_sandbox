import '../styles/style.css';
import * as THREE from 'three';
// Controle de la scène
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import d'objets 3D
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// Meshs
import { BoxGeometry, CircleBufferGeometry, CircleGeometry, ConeGeometry, DirectionalLight, DirectionalLightHelper, FogExp2, GridHelper, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, ShapeGeometry, TextureLoader } from 'three';
// Fonts
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

/* RAPPELS MATERIAL
-- MeshBasicMaterial --  
(le Material le plus léger et rapide – Mais le moins réaliste des trois)
Cette classe de Material est utilisée pour dessiner des objets 3D de manière ultra-basique, sans prise en compte de l’éclairage ou shading.

-- MeshLambertMaterial --
(à mi-chemin entre Basic et Phong)
Ce type de Material est utilisé pour les surfaces non-brillantes et sans reflets lumineux.

L’éclairage et le shading sont calculés grâce aux sommets de la structure 3D, puis appliqués sur les faces de l’objet.

-- MeshPhongMaterial --
(le plus lourd et lent pour le processeur – Mais le plus réaliste des trois)
La classe MeshPhongMaterial est utilisée pour créer des surfaces brillantes, avec des reflets lumineux.

L’éclairage et le shading sont calculés pour chaque pixel de l’objet, puis appliqués sur la surface.
*/
var scene: THREE.Scene;
var renderer: THREE.WebGLRenderer;
var camera: THREE.PerspectiveCamera;
var controls = undefined;

function init(){
    //# ------------- SCENE ------------- #\\
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010101);
    // Ajout de brouillard dans la scène
    // scene.fog = new THREE.FogExp2(0x2f3640, 0.005)

    //# ------------- RENDERER ------------- #\\
    renderer = new THREE.WebGLRenderer(
    {
        // canvas: document.getElementById('webgl'),
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    //# ------------- CAMERA ------------- #\\
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(-70, 60, 200);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    //# ------------- Controls ------------- #\\
    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 1;
    controls.maxDistance = 1000;
    // Pour fluidifier le mouvement de la caméra
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.002
    //# ------------- Ambient Light ------------- #\\
    let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
    scene.add(hemiLight);
}
init();

//# ------------- WINDOW RESIZE FONCTION ------------- #\\
export function OnWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize' , OnWindowResize);



//# ------------- HELPERS ------------- #\\
// --  gridHelper -- \\
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
// -- Fonction gridHelper -- \\
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

//# ------------- LIGHTS -------------- #\\
var pointLight: THREE.PointLight;
// ## Point Light ## \\
function pointLightAdd(){
    pointLight = new THREE.PointLight( 0xFF15FF, 1, 130 );
    pointLight.position.set( 0, 20, 50 );
    scene.add( pointLight );
}
pointLightAdd()
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
    const sphereSize = 4;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    pointLightHelper.name = "pointLightHelper";
    let pointLightHelperName = <THREE.GridHelper><any>scene.getObjectByName('pointLightHelper');

    if(check){
        scene.add( pointLightHelper );

    }else{
        scene.remove(pointLightHelperName);
    }
}

//# ------------- Animate fonction (for refresh) ------------- #\\
export function animate()
{
    dragObect()
    controls.update();
    // interactionManager.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// # Directional light # \\
const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
dirLight.position.set(-30, 70, -30);
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

// Checkbox pour activer le directionnal light helper
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

//# ------------- TEXTE ------------- #\\
const fontLoader = new FontLoader();
fontLoader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    function ( font )
    {
        const matLite = new MeshBasicMaterial({
            color: 0xFAFAFA,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        })

        const message = "Super SandBox";

        const shapes = font.generateShapes( message, 5 );

        const geometry = new ShapeGeometry( shapes );
        geometry.computeBoundingBox();

        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate ( xMid, 0, 0 );

        const text = new Mesh( geometry, matLite );
        text.position.z =  - 42.7;
        text.position.y = 25;
        scene.add( text )
    }
);

//# ------------- Création des Meshs  ------------- #\\
// # Création du sol # \\
function createFloor ()
{
    let pos = { x: 0, y: -1, z: 3 };
    let scale = { x: 100, y: 2, z: 100 };
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({
            color: 0xf9c834
        })
    );
    blockPlane.position.set( pos.x, pos.y, pos.z );
    blockPlane.scale.set( scale.x, scale.y, scale.z );
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add( blockPlane );

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

    blockWall.position.set( pos.x, pos.y, pos.z );
    blockWall.scale.set( scale.x, scale.y, scale.z );
    blockWall.castShadow = true;
    // blockWall.receiveShadow = true;
    scene.add( blockWall );
}
// # Création d'un cercle # \\
// function createRingCircle()
// {
    // let pos = {x: 0, y: 10, z: 0};
    // let radius = 3;
    // const geometry = new THREE.CircleGeometry( radius, 32 );
    // const material = new THREE.MeshBasicMaterial({
    //     color: 0xFFFFFF
    // })
    // const circle = new THREE.Mesh( geometry, material );
    // circle.position.set( pos.x, pos.y, pos.z );
    // scene.add( circle );
    // // Ring Geometry pour entourer le rond
    // let innerRadius = 4.2;
    // let outerRadius = 4;
    // const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 42, 5, 32 );
    // const ringMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
    // const ring = new THREE.Mesh( ringGeo, ringMaterial );
    // circle.add( ring ); 
    // circle.userData.draggable = true;
    // circle.userData.name = 'Circle';

// circle.addEventListener('click', (event) =>{
//     console.log("cercle cliqué");
// });

// ## Création d'une box ## \\
var box: THREE.Mesh
function createBox ()
{
    let scale = { x: 6, y: 6, z: 6 };
    let pos = { x: -20, y: scale.y / 2, z: 15 };

    box = new THREE.Mesh(new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({
            color: 0xDC143C
        })
    );
    box.position.set( pos.x, pos.y, pos.z );
    box.scale.set( scale.x, scale.y, scale.z );
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add( box );
    // objet.userData.draggable sert à dire que l'objet sera "draggable"
    box.userData.draggable = true;
    // objet.userData.name permet de lui attribuer un nom
    box.userData.name = 'BOX';
};
// # Création d'un cube essai de textures # \\
var cube: THREE.Mesh
function createCube()
{
    let pos = {x: 35, y: 2.5, z: 25 };

    const loader = new TextureLoader();

    const geometry = new BoxGeometry( 5, 5, 5 );
    const material = new MeshPhongMaterial({
        map: loader.load('assets/images/textures/gold_texture.jpg'),
        shininess: 200
    })
    cube = new Mesh( geometry, material );
    cube.position.set( pos.x, pos.y, pos.z )
    scene.add(cube)
}
createCube();
// # Création d'un cône # \\
var cone: THREE.Mesh;
function createCone()
{
    let pos = {x: 35, y: 2.5, z: -10 }
    const geometry = new ConeGeometry( 5, 5, 35 );
    const material = new MeshPhongMaterial({ color: 0x00ffff });
    cone = new Mesh( geometry, material );
    cone.position.set( pos.x, pos.y, pos.z );
    cone.castShadow = true;
    cone.receiveShadow = true;
    scene.add( cone );

    // cone.userData.draggable = true;
    cone.userData.name = "CONE"
}
// # Création d'une sphère ## \\
function createSphere ()
{
    let radius = 4;
    let pos = { x: -20, y: radius, z: -15};

    let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({
            color: 0x43a1f4
        })
    );
    sphere.position.set( pos.x, pos.y, pos.z );
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );
    
    sphere.userData.draggable = true;
    sphere.userData.name = 'SPHERE';
};

// # Création d'un cylindre # \\
function createCylinder ()
{
    let radius = 4;
    let height = 6;
    let pos = { x: -40, y: height / 2, z: 15 };

    // threejs
    let cylinder = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(radius, radius, height, 32 ), 
        new THREE.MeshPhongMaterial({
            color: 0x90ee90
        })
    )
    cylinder.position.set( pos.x, pos.y, pos.z );
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add( cylinder );
    
    cylinder.userData.draggable = true;
    cylinder.userData.name = 'CYLINDER';
};

// ## Création d'un objet 3D d'après un modèle .obj ## \\
function createCastle ()
{
    const objLoader = new OBJLoader();
    objLoader.loadAsync('../assets/models/castle/castle.obj').then(( group ) =>{
        const castle = group.children[0];

        castle.position.x = -40;
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
// ## Deuxième exmple : importation .obj et texture .mtl
let ironMan = undefined;
function createIronMan()
{
    var mtlLoader = new MTLLoader();
    mtlLoader.load("assets/models/IronMan/IronMan.mtl",
    function (materials)
    {
        materials.preload();
        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        console.log(materials);
        objLoader.load("assets/models/IronMan/IronMan.obj",
        
        function(object){
            ironMan = object;
            let size = 0.15
            ironMan.position.set(0, 0, 15)
            ironMan.scale.set( size, size, size)
            ironMan.castShadow = true;
            ironMan.receiveShadow = true;

            scene.add(ironMan)
        })
    })
}


const addNewBoxMesh = ( x: number, y: number, z:number ) => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshPhongMaterial({
       color: 0xfafafa,
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(x, y, z);
    scene.add(boxMesh);
}
 
 addNewBoxMesh(0, 2, 0);
 addNewBoxMesh(2, 2, 0);
 addNewBoxMesh(-2, 2, 0);
 addNewBoxMesh(0, 2, -2);
 addNewBoxMesh(2, 2, -2);
 addNewBoxMesh(-2, 2, -2);
 addNewBoxMesh(0, 2, 2);
 addNewBoxMesh(2, 2, 2);
 addNewBoxMesh(-2, 2, 2);
//# ------------- RAYCASTER  ------------- #\\
//# Instance du raycaster #\\
const raycaster = new THREE.Raycaster();

// Raycaster EXEMPLE 2 : 
// const pointer = new THREE.Vector2();

// const onMouseMove = (event: MouseEvent) => {
//     // Calcule les coordonées du pointer de souris
//     pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//     pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.setFromCamera(pointer, camera);
//     const intersects = raycaster.intersectObjects(scene.children);

//     for (let i = 0; i < intersects.length; i++){
//         intersects[i].object['material']['color'].set(0xff0000);
//         // intersects[i].object.material.color.set(0xff0000)
//     }
// }
// window.addEventListener('mousemove', onMouseMove);

// #### Position du click avec 2 vecteurs x et y #### \\
const clickMouse = new THREE.Vector2();

//# Derniere position de la souris #\\
const moveMouse = new THREE.Vector2();

//# la variable qui va contenir le dernier objet cliqué
var draggable: THREE.Object3D;

//# ------------- Intéraction avec les objets au click ------------- #\\
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
        camera.position.set(draggable.position.x, draggable.position.y, camera.position.z);
    }
});
//# ------------- Déplacement des objets ------------- #\\

window.addEventListener('mousemove', event => {
    moveMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	moveMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});
function dragObect ()
{
    if (draggable != null){
        raycaster.setFromCamera( moveMouse, camera )
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

//# ------------- Instanciation des objets ------------- #\\
createFloor();
createWall();
createCone();
createBox();
createSphere();
createCylinder();
createCastle();
// createIronMan()
// controls();
animate();