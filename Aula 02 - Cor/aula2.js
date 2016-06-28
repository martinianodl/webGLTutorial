// Objeto da cena
var scene;

// Objeto da camera
var camera;

// Inicializa a cena
initializeScene();

// Renderiza a cena
renderScene();

// Inicializa a cena
 function initializeScene(){
     // Verifica se o browser suporta o webGL
     if(Detector.webgl){
         renderer = new THREE.WebGLRenderer({antialias:true});

     // Se não é suportado, instancia o renderizador de canvas, que é suportado em todos os navegadores
     } else {
         renderer = new THREE.CanvasRenderer();
     }

     // Define a cor de fundo para preto, com opacidade total
     renderer.setClearColor(0x000000, 1);

     // Obtem o tamanho da area de conteudo para renderizar com o tamanho total da janela
     canvasWidth = window.innerWidth;
     canvasHeight = window.innerHeight;

     // Define o tamanho da área de conteúdo
     renderer.setSize(canvasWidth, canvasHeight);

     // Obtem o elemento DIV a partir do documento HTML pelo seu ID e anexa o renderer a ele
     document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

     // Cria a cena, onde todos os objetos estão armazenados (camera, luzes, geometrias)
     scene = new THREE.Scene();

     // Definir e adicionar a câmera à cena.
     camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
     camera.position.set(0, 0, 10);
     camera.lookAt(scene.position);
     scene.add(camera);

     // Cria o triângulo:
     var triangleGeometry = new THREE.Geometry();
     triangleGeometry.vertices.push(new THREE.Vector3( 0.0,  1.0, 0.0));
     triangleGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
     triangleGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0));
     triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));

    // Para colorir a superfície, um material tem de ser criado. Se todos os vértices devem ter cores diferentes, precisamos definir as cores dos vértices de cada face. As cores entre serão interpolados como gradientes de cor.
    triangleGeometry.faces[0].vertexColors[0] = new THREE.Color(0xFF0000);
    triangleGeometry.faces[0].vertexColors[1] = new THREE.Color(0x00FF00);
    triangleGeometry.faces[0].vertexColors[2] = new THREE.Color(0x0000FF);

    // To activate the vertex color, we have to set 'vertexColors' attribute to 'THREE.VertexColors'. Otherwise they won't be displayed.

    // Create a basic material, supporting vertex colors. Activate the 'doubleSided'
    // attribute to force the rendering of both sides of each face (front and back).
    // This prevents the so called 'backface culling'. Usually, only the side is
    // rendered, whose normal vector points towards the camera. The other side is not
    // rendered (backface culling). But this performance optimization sometimes leads
    // to wholes in the surface. When this happens in your surface, simply set
    // 'doubleSided' to 'true'.
    var triangleMaterial = new THREE.MeshBasicMaterial({
        vertexColors:THREE.VertexColors,
        side:THREE.DoubleSide
    });

    // Create a mesh and insert the geometry and the material. Translate the whole mesh
    // by -1.5 on the x axis and by 4 on the z axis. Finally add the mesh to the scene.
    var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    triangleMesh.position.set(-1.5, 0.0, 4.0);
    scene.add(triangleMesh);

    // The creation of the square is done in the same way as the triangle, except that we
    // now need two THREE.Face3s.
    // 1. Instantiate the geometry object
    // 2. Add the vertices
    // 3. Define the faces by setting the vertices indices
    var squareGeometry = new THREE.Geometry();
    squareGeometry.vertices.push(new THREE.Vector3(-1.0,  1.0, 0.0));
    squareGeometry.vertices.push(new THREE.Vector3( 1.0,  1.0, 0.0));
    squareGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0));
    squareGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
    squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
    squareGeometry.faces.push(new THREE.Face3(0, 2, 3));

    // The square gets a new face color. In contrast to vertex colors means face color, that all vertices have the same color or in other words, the whole face has the same color (no color gradients).

    // Create a light blue basic material and activate the 'doubleSided' attribute.
    var squareMaterial = new THREE.MeshBasicMaterial({
        color:0x8080FF,
        side:THREE.DoubleSide
    });

    // Create a mesh and insert the geometry and the material. Translate the whole mesh
    // by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene.
    var squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
    squareMesh.position.set(1.5, 0.0, 4.0);
    scene.add(squareMesh);
}

/**
 * Render the scene. Map the 3D world to the 2D screen.
 */
function renderScene(){
    renderer.render(scene, camera);
}
