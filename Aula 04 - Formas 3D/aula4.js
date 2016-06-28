// Global scene object
var scene;

// Global camera object
var camera;

// Global mesh object of the pyramid
var pyramidMesh;

// Global mesh object of the cube
var cubeMesh;

// Initialize the scene
initializeScene();

// Animate the scene
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

    // If its not supported, instantiate the canvas renderer to support all non WebGL browsers
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

    // Para criar uma piramide, será usado o comando THREE.CylinderGeometry.
    // Com cinco parâmetros, pode-se criar a geometria de uma pirâmide (subtipo de um cilindro).
    // Parametro 1 'radiusTop': Controla o raio da extremidade superior do cilindro. Se definido para a '0', temos um cone.
    // Parametro 2 'radiusBottom': Controla o raio da extremidade inferior.
    // Parametro 3 'height': Define a altura do cilindro.
    // Parametro 4 'segments': Número de segmentos. Para criar uma pirâmide, nós escolhemos '4'.
    // Parametro 5 'openEnded': Permite ter extremidades abertas ('true') ou extremidades fechadas ("falso") do cilindro. Uma vez que a pirâmide deve ter um fundo, podemos defini-lo como "falso".
    var pyramidGeometry = new THREE.CylinderGeometry(0, 1.5, 1.5, 4, false);

    // Colorir os lados com as cores do vértice é um pouco complicado, mas nos permite aprender como fazer um loop atraves dos lados e verificar se eles tem 3 ou 4 vertices.
    // Com um simples `for' loop, é possivel percorrer todos os lados.
    // O operador 'instanceof' dá a possibilidade de verificar se o lado atual é um THREE.Face4 ou THREE.Face3.
    // Dependendo do seu tipo de objeto, definimos três ou quatro cores de vértice.
    // Para o THREE.Face4 muda-se as cores dos vértices 1 e 2 para cada segunda face, porque queremos os vértices inferiores com as mesmas cores do vizinho.
    // Os vertices 0 e 3 são os vértices superiores, que são sempre vermelhos.
    for(i = 0; i < pyramidGeometry.faces.length; i++){
        if(pyramidGeometry.faces[i] instanceof THREE.Face4){
            pyramidGeometry.faces[i].vertexColors[0] = new THREE.Color(0xFF0000);
            if((i % 2) == 0){
                pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x00FF00);
                pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x0000FF);
            } else {
                pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x0000FF);
                pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x00FF00);
            }
            pyramidGeometry.faces[i].vertexColors[3] = new THREE.Color(0xFF0000);
        } else {
            pyramidGeometry.faces[i].vertexColors[0] = new THREE.Color(0xFF0000);
            pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x00FF00);
            pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x0000FF);
        }
    }

    // To activate the vertex color, we have to set 'vertexColors' attribute to
    // 'THREE.VertexColors'. Otherwise they won't be displayed.

    // Create a basic material, supporting vertex colors. Activate the 'doubleSided'
    // attribute to force the rendering of both sides of each face (front and back).
    // This prevents the so called 'backface culling'. Usually, only the side is
    // rendered, whose normal vector points towards the camera. The other side is not
    // rendered (backface culling). But this performance optimization sometimes leads
    // to wholes in the surface. When this happens in your surface, simply set
    // 'doubleSided' to 'true'.
    var pyramidMaterial = new THREE.MeshBasicMaterial({
        vertexColors:THREE.VertexColors,
        side:THREE.DoubleSide
    });

    // Create a mesh and insert the geometry and the material. Translate the whole mesh
    // by -1.5 on the x axis and by 4 on the z axis. Finally add the mesh to the scene.
    pyramidMesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramidMesh.position.set(-1.5, 0.0, 4.0);
    scene.add(pyramidMesh);

    // Para criar o cubo:
    // Parametro 1: Largura
    // Parameter 2: Altura
    // Parameter 3: Profundidade
    var boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);


    // A aplicação de diferentes materiais para as faces é mais difícil do que a aplicação de um material a toda a geometria.
    // Começamos com a criação de uma matriz de THREE.MeshBasicMaterial.
    // Definindo seis cores de materiais
    var boxMaterials = [
        new THREE.MeshBasicMaterial({color:0xFF0000}),
        new THREE.MeshBasicMaterial({color:0x00FF00}),
        new THREE.MeshBasicMaterial({color:0x0000FF}),
        new THREE.MeshBasicMaterial({color:0xFFFF00}),
        new THREE.MeshBasicMaterial({color:0x00FFFF}),
        new THREE.MeshBasicMaterial({color:0xFFFFFF})
    ];


    // Cria uma MeshFaceMaterial, que permite que o cubo tenha diferentes materiais em cada face
    var boxMaterial = new THREE.MeshFaceMaterial(boxMaterials);

    // Create a mesh and insert the geometry and the material. Translate the whole mesh
    // by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene.
    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(1.5, 0.0, 4.0);
    scene.add(boxMesh);
}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){
    // Increase the y rotation of the triangle
    pyramidMesh.rotation.y += 0.1;

    // Decrease the rotation of the cube
    boxMesh.rotateOnAxis(new THREE.Vector3(1, 1, 1).normalize(), 0.075);

    // Define the function, which is called by the browser supported timer loop. If the
    // browser tab is not visible, the animation is paused. So 'animateScene()' is called
    // in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    renderScene();
}

/**
 * Render the scene. Map the 3D world to the 2D screen.
 */
function renderScene(){
    renderer.render(scene, camera);
}
