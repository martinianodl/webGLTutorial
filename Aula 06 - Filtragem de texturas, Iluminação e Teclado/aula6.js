// Objeto da cena
var scene;

// Objeto da camera
var camera;

// Rotação x e y
var xRotation = 0.0;
var yRotation = 0.0;

// Velocidade de rotação em torno dos eixos x e y
var xSpeed = 0.0;
var ySpeed = 0.0;

// Translação ao longo do eixo z
var zTranslation = 0.0;

// Textura e flag para o filtro da textura
var crateTexture;
var textureFilter = 0;

// Flag para ligar/desligar luz
var lightIsOn = true;

// Inicializa a cena
initializeScene();

// Anima a cena
animateScene();

/**
 * Initialze the scene.
 */
 function initializeScene(){
      webGLAvailable = false; 
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

    // Load an image as texture
    crateTexture = new THREE.ImageUtils.loadTexture("crate.gif");

    // Create a material, which contains the texture.
    var boxMaterial = new THREE.MeshLambertMaterial({
        map:crateTexture,
        side:THREE.DoubleSide
    });

    // Infelizmente, o CanvasRenderer não suporta MeshLambertMaterial em combinação com texturas.
    // Por outro lado, o MeshBasicMaterial não suporta iluminação.
    // O CanvasRenderer irá mostrar a textura sem iluminação via MeshBasicMaterial
    if(!webGLAvailable){
        boxMaterial = new THREE.MeshBasicMaterial({
            map:crateTexture,
            side:THREE.DoubleSide
        });
    }

    // Cria uma malha e insere a geometria do objeto, e o material. Translada toda a malha em 'zTranslation' no eixo z e adiciona a malha na cena.
    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(camera.position.x, camera.position.y, camera.position.z);
    scene.add(boxMesh);

    // A luz ambiente não tem direção, ela ilumina cada objeto com a mesma intensidade. Se apenas a luz ambiente é utilizada, não há efeitos de sombreamento.
    var ambientLight = new THREE.AmbientLight(0x101010, 1.0);
    scene.add(ambientLight);

    // A luz direcional tem uma fonte e brilha em todas as direções, como o sol.
    // Esse comportamento cria efeitos de sombreamento.
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0.0, 0.0, 1.0);
    scene.add(directionalLight);

    // Cria um listener para o pressionamento de um botão no teclado ('keydown' events).
    // Este listener envia todos as teclas pressionadas para a função 'onDocumentKeyDown'.
    document.addEventListener("keydown", onDocumentKeyDown, false);
}


 // Esta função é chamada, quando uma tecla é pressionada.
function onDocumentKeyDown(event){
    // Obtem o código da tecla pressionada
    var keyCode = event.which;

    // 'F' - Alterna entre dos filtros de textura
    if(keyCode == 70){
        switch(textureFilter){
            case 0:
                crateTexture.minFilter = THREE.NearestFilter;
                crateTexture.magFilter = THREE.NearestFilter;
                textureFilter = 1;
                break;
            case 1:
                crateTexture.minFilter = THREE.LinearFilter;
                crateTexture.magFilter = THREE.LinearFilter;
                textureFilter = 2;
                break;
            case 2:
                crateTexture.minFilter = THREE.LinearFilter;
                crateTexture.magFilter = THREE.LinearMipMapNearestFilter;
                textureFilter = 0;
                break;
        };
        crateTexture.needsUpdate = true;

    // 'L' - Alterna entre as luzes
    } else if(keyCode == 76){
        // Se as luzes da cena forem removidas, não seria possivel ver o cubo pois a cena ficaria escura. Isto ocorre devido ao `MeshLambertMaterial', pois este necessita de luz.
        if(lightIsOn){
            boxMesh.material = new THREE.MeshBasicMaterial({
                map:crateTexture,
                side:THREE.DoubleSide
            });
            lightIsOn = false;
        } else {
            if(webGLAvailable){
                boxMesh.material = new THREE.MeshLambertMaterial({
                    map:crateTexture,
                    side:THREE.DoubleSide
                });
            } else {
                boxMesh.material = new THREE.MeshBasicMaterial({
                    map:crateTexture,
                    side:THREE.DoubleSide
                });
            }
            lightIsOn = true;
        }
        boxMesh.material.needsUpdate = true;

    // Seta para cima
    } else if(keyCode == 38){
        xSpeed -= 0.01;

    // Seta para baixo
    } else if(keyCode == 40){
        xSpeed += 0.01;

    // Seta para a esquerda
    } else if(keyCode == 37){
        ySpeed -= 0.01;

    // Seta para a direita
    } else if(keyCode == 39){
        ySpeed += 0.01;

    // Page up
    } else if(keyCode == 33){
        zTranslation -= 0.2;

    // Page down
    } else if(keyCode == 34){
        zTranslation += 0.2;
    }
}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){
    directionalLight.position = camera.position;

    // Atualiza a rotação no eixo x e y
    xRotation += xSpeed;
    yRotation += ySpeed;
    boxMesh.rotation.set(xRotation, yRotation, 0.0);

    // Aplica a translação ao longo do eixo z
    boxMesh.position.z = zTranslation;

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
