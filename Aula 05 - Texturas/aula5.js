// Objeto da cena
var scene;

// Objeto da camera
var camera;

// O cubo tem de girar em torno de três eixos, por isso precisamos de três valores de rotação.

// Rotação em x, y e z
var xRotation = 0.0;
var yRotation = 0.0;
var zRotation = 0.0;

// Malha do cubo
var cubeMesh;

// Inicializa a cena
initializeScene();

// Anima a cena
animateScene();

/**
 * Initialze the scene.
 */
function initializeScene(){
    // Check whether the browser supports WebGL. If so, instantiate the hardware accelerated
    // WebGL renderer. For antialiasing, we have to enable it. The canvas renderer uses
    // antialiasing by default.
    // The approach of multiplse renderers is quite nice, because your scene can also be
    // viewed in browsers, which don't support WebGL. The limitations of the canvas renderer
    // in contrast to the WebGL renderer will be explained in the tutorials, when there is a
    // difference.
    if(Detector.webgl){
        renderer = new THREE.WebGLRenderer({antialias:true});

    // If its not supported, instantiate the canvas renderer to support all non WebGL
    // browsers
    } else {
        renderer = new THREE.CanvasRenderer();
    }

    // Set the background color of the renderer to black, with full opacity
    renderer.setClearColor(0x000000, 1);

    // Get the size of the inner window (content area) to create a full size renderer
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    // Set the renderers size to the content areas size
    renderer.setSize(canvasWidth, canvasHeight);

    // Get the DIV element from the HTML document by its ID and append the renderers DOM
    // object to it
    document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

    // Create the scene, in which all objects are stored (e. g. camera, lights,
    // geometries, ...)
    scene = new THREE.Scene();

    // Now that we have a scene, we want to look into it. Therefore we need a camera.
    // Three.js offers three camera types:
    //  - PerspectiveCamera (perspective projection)
    //  - OrthographicCamera (parallel projection)
    //  - CombinedCamera (allows to switch between perspective / parallel projection
    //    during runtime)
    // In this example we create a perspective camera. Parameters for the perspective
    // camera are ...
    // ... field of view (FOV),
    // ... aspect ratio (usually set to the quotient of canvas width to canvas height)
    // ... near and
    // ... far.
    // Near and far define the cliping planes of the view frustum. Three.js provides an
    // example (http://mrdoob.github.com/three.js/examples/
    // -> canvas_camera_orthographic2.html), which allows to play around with these
    // parameters.
    // The camera is moved 10 units towards the z axis to allow looking to the center of
    // the scene.
    // After definition, the camera has to be added to the scene.
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(scene.position);
    scene.add(camera);

    // Cria o cubo
    var boxGeometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);

    // Carrega a imagem
    var neheTexture = new THREE.ImageUtils.loadTexture("nehe.gif");


    // Cria um basic material utilizando uma textura e ativa o atributo `doubleSided'. Para ativar a cor do vértice, é necessário definir o atributo 'vertexColors' com 'THREE.VertexColors'.
    var boxMaterial = new THREE.MeshBasicMaterial({
        map:neheTexture,
        side:THREE.DoubleSide
    });

    // Cria uma malha e insere a geometria do objeto, e o basic material (cor). Translada toda a malha em 4 no eixo Z.
    // Finalmente adiciona a malha na cena.
    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(0.0, 0.0, 4.0);
    scene.add(boxMesh);
}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){
    // Aumenta a rotação em x, y e z do cubo
    xRotation += 0.03;
    yRotation += 0.02;
    zRotation += 0.04;
    boxMesh.rotation.set(xRotation, yRotation, zRotation);

    // Define a função que é executada pelo browser. Se a aba não está visível, a animação é pausada.
    requestAnimationFrame(animateScene);

    // Renderiza a cena
    renderScene();
}

/**
 * Render the scene. Map the 3D world to the 2D screen.
 */
function renderScene(){
    renderer.render(scene, camera);
}
