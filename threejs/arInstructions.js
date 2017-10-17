var renderer,
    scene,
    camera,
    container;

var arSource,
    arContext,
    arMarker = [];

var mesh;
const extendedTrackingThreshold = 60;
const startTrackingThreshold = 30;

var tracking = false;
var startTrackingThresholdCount = 0;
var extendedTrackingThresholdCount = extendedTrackingThreshold;



init();

function init(){



    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    scene = new THREE.Scene();
    camera = new THREE.Camera();

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    scene.add(camera);
    scene.visible = false;


    mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({
        color: 0xFF00FF,
        transparent: true,
        opacity: 0.5
    }));
    scene.add(mesh);

    var loader = new THREE.GLTFLoader();

    loader.load( './assets/3d/fox-gltf-new/fox.gltf', function ( gltf ) {
    scene.add( gltf.scene );

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene;      // THREE.Scene
        gltf.scenes;     // Array<THREE.Scene>
        gltf.cameras;    // Array<THREE.Camera>
    } );



    arSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
    });

    arContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: './assets/data/camera_para.dat',
        detectionMode: 'mono',
    });

    arMarker[0] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : './assets/data/patt.hiro',
        changeMatrixMode: 'cameraTransformMatrix'
    });

    arMarker[1] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : './assets/data/pattern-marker.patt',
        changeMatrixMode: 'cameraTransformMatrix'
    });





    /* handle */
    arSource.init(function(){
        arSource.onResize();
        arSource.copySizeTo(renderer.domElement);

        if(arContext.arController !== null) arSource.copySizeTo(arContext.arController.canvas);

    });

    arContext.init(function onCompleted(){
        
        camera.projectionMatrix.copy(arContext.getProjectionMatrix());

    });


    render();   
    
}   


function setTracking(){

            if(camera.visible){
                startTrackingThresholdCount++;

                //if(thresholdCount)
                if(startTrackingThresholdCount>startTrackingThreshold){
                	extendedTrackingThresholdCount = 0;
                	tracking = true;
             
                }else{
                    tracking = false;
                }
            }else{
                //console.log(visible);
                if(extendedTrackingThresholdCount>=extendedTrackingThreshold){
                	startTrackingThresholdCount = 0;
                	tracking = false;
                  
                }else{
                	extendedTrackingThresholdCount++;
                    tracking = true;
                }

            }
        
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);
    setTracking();              
    console.log(tracking);
    if(arSource.ready === false) return;

    arContext.update(arSource.domElement);

    scene.visible = tracking

    mesh.rotateX(.1);

}          
