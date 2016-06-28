// Objeto da cena
var scene;

// Objeto da camera
var camera;

// Inicializa a cena
initializeScene();

// Renderiza a cena
renderScene();

// Função para inicializar a cena
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

  // Cria um basic material branco e ativa o atributo 'doubleSided'.
  var triangleMaterial = new THREE.MeshBasicMaterial({
    color:0xFFFFFF,
    side:THREE.DoubleSide
  });

  // Cria uma malha e insere a geometria do objeto, e o basic material (cor). Translada toda a malha por -1,5 no eixo X e 4 no eixo Z. Finalmente adiciona a malha na cena.
  var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
  triangleMesh.position.set(-1.5, 0.0, 4.0);
  scene.add(triangleMesh);

  // A criação do quadrado é feita da mesma maneira que o triângulo, com excepção da definição das faces. Ao inves de um, temos que definir dois THREE.Face3.
  var squareGeometry = new THREE.Geometry();
  squareGeometry.vertices.push(new THREE.Vector3(-1.0,  1.0, 0.0));
  squareGeometry.vertices.push(new THREE.Vector3( 1.0,  1.0, 0.0));
  squareGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0));
  squareGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
  squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
  squareGeometry.faces.push(new THREE.Face3(0, 2, 3));

  // Cria um basic material branco e ativa o atributo 'doubleSided'.
  var squareMaterial = new THREE.MeshBasicMaterial({
    color:0xFFFFFF,
    side:THREE.DoubleSide
  });

  // Cria uma malha e insere a geometria do objeto, e o basic material (cor). Translada toda a malha por +1,5 no eixo X e 4 no eixo Z. Finalmente adiciona a malha na cena.
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
