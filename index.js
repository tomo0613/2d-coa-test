import * as Utils from './utils.js';

const vWidth = 512;
const vHeight = 512;
const gScene = new THREE.Scene();
const gCamera = new THREE.PerspectiveCamera(45, vWidth / vHeight, 1, 100);
const gClock = new THREE.Clock();
const gRenderer = new THREE.WebGLRenderer(/*{antialias: true}*/{alpha: true});
/* gRenderer.gammaFactor = 1.9; */
gRenderer.gammaOutput = true;


let gAnimationMixer;
gRenderer.setSize(vWidth, vHeight);
document.body.appendChild(gRenderer.domElement);

init();

async function init() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    gScene.add(ambientLight);
    
    gCamera.position.set(0, 3, 10);
    
    
    const gltf = await Utils.loadModel('ac_coa.gltf');
    const model = gltf.scene;

    const material = new THREE.MeshBasicMaterial();
    material.alphaTest = 0.5;
    material.skinning = true;

    model.traverse((child) => {
		if (child.material) {
            material.map = child.material.map;
			child.material = material;
			child.material.needsUpdate = true;
		}
    });

    gScene.add(model);

    initAnimationMixer(gltf);

    render();
}

function animate() {
    const elapsedTime = gClock.getDelta() * gAnimationMixer.timeScale;

    gAnimationMixer.update(elapsedTime);
}

function render() {
    animate();

    gRenderer.render(gScene, gCamera);

    requestAnimationFrame(render);
}

function initAnimationMixer(gltf) {
    console.log(gltf.animations);
    
    gAnimationMixer = new THREE.AnimationMixer(gltf.scene);

    const walkClip = THREE.AnimationClip.findByName(gltf.animations, 'walk');
    
    gAnimationMixer.clipAction(walkClip).play();
}
