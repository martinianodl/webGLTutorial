// Objeto da cena
var scene;

// Objeto do renderizador
var renderer;

// Objeto da camera
var camera;

// Objeto dos controles
var controls;

// Objeto da luz ambiente
var ambientLight;

// Objeto da luz direcional
var directionalLight;

// Inicializa a cena
initializeScene();

// Cria e habilita os 'orbitControls'
orbitControls();

// Cria o mundo (le os dados e cria os objetos)
createWorld();

// Anima a cena
animateScene();

function initializeScene() {

  // Verifica se o browser suporta o webGL
      if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({
          antialias: true
        });
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

    // Define e adicionar a câmera à cena.
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
    camera.position.set(0, 6, 6);
    camera.lookAt(scene.position);
    scene.add(camera);

    // A luz ambiente não tem direção, ela ilumina cada objeto com a mesma intensidade. Se apenas a luz ambiente é utilizada, não há efeitos de sombreamento.
    ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // A luz direcional tem uma fonte e brilha em todas as direções, como o sol.
    // Esse comportamento cria efeitos de sombreamento.
    directionalLight = new THREE.PointLight(0xffffff);
    directionalLight.position.set(250,250,250);
    scene.add(directionalLight);
}

function createWorld() {
    // Carrega a imagem
    var texture = new THREE.ImageUtils.loadTexture("mud.gif");

    // Cria um basic material utilizando uma textura e ativa o atributo `doubleSided'.
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      side:THREE.DoubleSide
    });
    // Percorre todos os triângulos em nosso ``mundo"
    for ( i=0; i<nTriangles; i++ ) {
        // busca três linhas de cada vez, sendo os três vértices
        var i1 = i * 3;
        var i2 = i * 3 + 1;
        var i3 = i * 3 + 2;
        // cria uma geometria plana e adiciona os vértices nela
        var triGeom = new THREE.Geometry();
        triGeom.vertices.push(new THREE.Vector3(world[i1][V_X],world[i1][V_Y],world[i1][V_Z]));
        triGeom.vertices.push(new THREE.Vector3(world[i2][V_X],world[i2][V_Y],world[i2][V_Z]));
        triGeom.vertices.push(new THREE.Vector3(world[i3][V_X],world[i3][V_Y],world[i3][V_Z]));

        // Agora precisamos criar o mapeamento entre a textura e os dois triângulos que compõem as faces.
        var uvs = [];

        // Precisamos verificar em qual triângulo estamos, assim mapeando o lado corretamente. Senão mapearemos o mesmo lado duas vezes
        if ((i & 1) == 1) {
        uvs.push( new THREE.Vector2( 0.0, 1.0 ) );
        uvs.push( new THREE.Vector2( 1.0, 1.0 ) );
        uvs.push( new THREE.Vector2( 1.0, 0.0 ) );
        } else {
        uvs.push( new THREE.Vector2( 0.0, 1.0 ) );
        uvs.push( new THREE.Vector2( 0.0, 0.0 ) );
        uvs.push( new THREE.Vector2( 1.0, 0.0 ) );
        }
        // criar um novo rosto, cujos índices apontam para os vértices criados acima
        triGeom.faces.push( new THREE.Face3( 0, 1, 2 ) );
        // em seguida, definir vértices UV correspondentes
        triGeom.faceVertexUvs[ 0 ].push( [ uvs[0], uvs[1], uvs[2] ] );
        // recalcular as normais para ambas as faces e vértices
        triGeom.computeFaceNormals();
        triGeom.computeVertexNormals();
        // criar a malha
        var mesh = new THREE.Mesh( triGeom, material);
        // adicionar a malha a cena
        scene.add(mesh);
    }
}

function orbitControls() {
    // Adiciona os controles
    controls = new THREE.OrbitControls( camera, renderer.domElement );
}

function animateScene() {
    // Define a função que é executada pelo browser. Se a aba não está visível, a animação é pausada.
    requestAnimationFrame(animateScene);
    // Renderiza a cena
    renderer.render(scene, camera);
    // os `orbit controls', se usados, precisam ser ser atualizados
    if (controls != null && typeof controls != 'undefined')
        controls.update();
}
