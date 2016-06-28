// Objeto da cena
var scene;

// Objeto da camera
var camera;

// Malha da piramide
var pyramidMesh;

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

  // Cria o triângulo:
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

  // Cria um basic material utilizando as cores dos vertices e ativa o atributo 'doubleSided'. Para ativar a cor do vértice, é necessário definir o atributo 'vertexColors' com 'THREE.VertexColors'. Caso contrário, não será exibida nenhuma cor.
  var pyramidMaterial = new THREE.MeshBasicMaterial({
    vertexColors:THREE.VertexColors,
    side:THREE.DoubleSide
  });

  // Cria uma malha e insere a geometria do objeto, e o basic material (cor). Translada toda a malha por -1,5 no eixo X e 4 no eixo Z. Finalmente adiciona a malha na cena.
  pyramidMesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
  pyramidMesh.position.set(-1.5, 0.0, 4.0);
  scene.add(pyramidMesh);

  // Criando o cubo
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

  // Cria a malha e insere a geometria do objeto, e o basic material (cores). Toda a malha é transladada em +1,5 no eixo X e 4 no eixo Z. Finalmente adiciona-se a malha na cena.
  boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.set(1.5, 0.0, 4.0);
  scene.add(boxMesh);
}

function animateScene(){

  // Aumenta a rotação em Y do triângulo
  pyramidMesh.rotation.y += 0.1;

  // Diminui a rotação em X do cubo
  boxMesh.rotateOnAxis(new THREE.Vector3(1, 1, 1).normalize(), 0.075);

  // Define a função que é executada pelo browser. Se a aba não está visível, a animação é pausada.
  requestAnimationFrame(animateScene);

  // Renderiza a cena
  renderScene();
}

// Função para renderizar a cena
function renderScene(){
  renderer.render(scene, camera);
}
