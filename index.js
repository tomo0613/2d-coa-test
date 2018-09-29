import * as Utils from './utils.js';

const viewSize = 10;
const viewWidth = 512;
const viewHeight = 512;
const aspectRatio = viewWidth / viewHeight;
const gCamera = new THREE.OrthographicCamera(
    aspectRatio * -viewSize / 2, aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2, -1, 1,
);
const gScene = new THREE.Scene();
const gClock = new THREE.Clock();
const gRenderer = new THREE.WebGLRenderer(/*{antialias: true}*/{alpha: true});
/* gRenderer.gammaFactor = 1.9; */
gRenderer.gammaOutput = true;


let gAnimationMixer;
gRenderer.setSize(viewWidth, viewHeight);
document.body.appendChild(gRenderer.domElement);

init();

async function init() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    gScene.add(ambientLight);
    
    const gltf = await Utils.loadModel('ac_coa.gltf');
    // const gltf = await Utils.loadModel('fly-2actions.gltf');
    const model = gltf.scene;
    model.position.y = -3;

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
    // const walkClip = THREE.AnimationClip.findByName(gltf.animations, 'ArmatureAction');
    
    gAnimationMixer.clipAction(walkClip).play();
}
