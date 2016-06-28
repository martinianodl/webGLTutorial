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

  // Cria o cubo
  var boxGeometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);

  // Carrega a imagem
  var neheTexture = new THREE.TextureLoader().load("nehe.gif");

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

// Função para renderizar a cena
function renderScene(){
  renderer.render(scene, camera);
}
