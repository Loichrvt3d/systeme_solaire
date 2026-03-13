
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var  createScene = function() {

    
      var scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(0.95, 0.95, 0.95); 

      const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 1.2, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas, false); 

       camera.inputs.attached.mousewheel.detachControl();
        const pointerInput = camera.inputs.attached.pointers;

        if (camera.inputs.attached.pointers) {
            const pointerInput = camera.inputs.attached.pointers;

            pointerInput.multiTouchPanAndZoom = false;
            pointerInput.multiTouchPanning = false;
            pointerInput.pinchToZoom = false;
            pointerInput.pinchDeltaPercentage = 0; 
        }
          
        pointerInput.onButtonDown = function (evt) {
              if (evt.button === 0) {
                  evt.preventDefault();
              }
          };
          

        camera.minZ = 0.01;
        camera.maxZ = 1000;
        camera.beta = Math.PI / 2.5;  
       camera.radius = 0.6;
      camera.lowerRadiusLimit = 0.6;
      camera.upperRadiusLimit = 0.6;


      //LIGHT + shadow
      var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-1, -10, -1), scene);
        light.position = new BABYLON.Vector3(5, 10, 5);  
        light.intensity = 1.0;
        light.direction = new BABYLON.Vector3(1, -2, -1).normalize();
        light.position = new BABYLON.Vector3(3, 10, 3);

      var light2 = new BABYLON.HemisphericLight("light1", BABYLON.Vector3.Up(), scene);
        light2.groundColor = new BABYLON.Color3(0.3, 0.3, 0.3); 
        light2.skyColor = new BABYLON.Color3(0.8, 0.8, 0.8); 
        light2.intensity =0.95;

      // IMPORT SYSTEME SOLAIRE
      let animationGroups = [];
      function importGLB(scene, url, options = {}) {
          const {
              position = new BABYLON.Vector3(0, 0, 0),
              scaling = new BABYLON.Vector3(0.15, 0.15, 0.15),
              rotation = new BABYLON.Vector3(0, 0, 0),
              onSuccess = null,
              onError = null,
              addToShadowCaster = false,
              shadowGenerator = null
          } = options;

          return BABYLON.SceneLoader.ImportMeshAsync("", url, "", scene)
              .then(result => {
                  const root = result.meshes[0];
                  root.position = position;
                  root.scaling = scaling;
                  root.rotation = rotation;
                  root.position.y = 0;
                  root.checkCollisions = true;

                  if (addToShadowCaster && shadowGenerator) {
                      shadowGenerator.addShadowCaster(root);
                  }

                   animationGroups = result.animationGroups;

                    animationGroups.forEach(animation => {
                      
                      animation.start(true);
                    });

                  if (onSuccess) onSuccess(result);
                  return result;
              })
              .catch(error => {
                  console.error("Erreur lors de l'import du modèle :", error);
                  if (onError) onError(error);
              });
      }

        importGLB(scene, "system.glb");
        // BOUTONS
        const speedButtons = document.querySelectorAll("#speedControls button");

        speedButtons.forEach(btn => {
          btn.addEventListener("click", () => {
            const speed = parseFloat(btn.getAttribute("data-speed")); // RECUP VITESSE DEPUIS BOUTONS

            animationGroups.forEach(anim => {
              anim.speedRatio = speed;
            });
          });
        });

       document.getElementById("closeInfoBtn").addEventListener("click", () => {
        const panel = document.getElementById("infoPanel");
        panel.classList.remove("show");
        setTimeout(() => {
          panel.style.display = "none";
        }, 300); 
      });

  // INFOS POUR PLANETES
  const planetData = {
  "MERCURE": {
    name: "Mercure",
    intro: "Mercure est la planète la plus proche du Soleil, mais aussi la plus petite du Système solaire.",
    details: "Type de planète : Tellurique \nSuperficie : 7,48 × 10⁷ km²\nMasse : 3,301 × 10²³ kg \nGravité : 3,70 m/s² \nPériode de révolution : 88j",
    image: "mercure.gif",
    color: "#757575"
  },
  "VENUS": {
    name: "Vénus",
    intro: "Vénus est la deuxième planète du Système solaire par ordre d'éloignement au Soleil, et la sixième plus grosse aussi bien par la masse que le diamètre.",
    details: "Type de planète : Tellurique\nSuperficie : 4,60 × 10⁸ km² \nMasse : 4,87 × 10²⁴ kg\nGravité : 8,87 m/s²\nPériode de révolution : 225j",
    image: "venus.gif",
    color: "#f3753f"
  },
  "TERRE": {
    name: "Terre",
    intro: "La Terre est la troisième planète par ordre d'éloignement au Soleil et la cinquième plus grande du Système solaire aussi bien par la masse que par le diamètre.",
    details:  "Type de planète : Tellurique\n" +
    "Superficie : 510 000 000 km²\n" +
    "Masse : 5,972 × 10²⁴ kg\n" +
    "Gravité : 9,806 m/s²\n" +
    "Période de révolution : 365j",
    image: "earth.gif",
    color: "#54b8d6"
  },
  "MARS": {
    name: "Mars",
    intro: "Mars est la quatrième planète du Système solaire par ordre croissant de la distance au Soleil et la deuxième par ordre croissant de la taille et de la masse.",
    details: "Type de planète : Tellurique \nSuperficie : 144 798 500 km² \nMasse : 6,418 × 10²³ kg\nGravité : 3,711 m/s² \nPériode de révolution : 686j",
    image: "mars.gif",
    color: "#ff4500"
  },
  "JUPITER": {
    name: "Jupiter",
    intro: "Jupiter est la cinquième planète du Système solaire par ordre d'éloignement au Soleil, et la plus grande par la taille et la masse devant Saturne, qui est comme elle une planète géante gazeuse.",
    details: "Type de planète : Géante gazeuse\nSuperficie : 6,146 × 10¹⁰ km²\nMasse : 1,898 × 10²⁷ kg\nGravité : 24,796 m/s² \nPériode de révolution : 4 332j",
    image: "jupiter.gif",
    color: "#a28f7d"
  },
  "SATURNE_primitive1": {
    name: "Saturne",
    intro: "Saturne est la sixième planète du Système solaire par ordre d'éloignement au Soleil, et la deuxième plus grande par la taille et la masse après Jupiter. C'est une planète géante gazeuse comme Jupiter.",
    details: "Type de planète : Géante gazeuse\nSuperficie : 4,346 × 10¹⁰ km²\nMasse : 5,684 × 10²⁶ kg\nGravité : 10,44 m/s² \nPériode de révolution : 10 755j",
    image: "saturne.gif",
    color: "#f4a460"
  },
  "NEPTUNE": {
    name: "NEPTUNE",
    intro: "Neptune est la huitième planète par ordre d'éloignement du Soleil et la plus éloignée de l'étoile dans le Système solaire qui soit connue. C'est la troisième planète la plus massive, la quatrième plus grande par la taille.",
    details: "Type de planète : Géante glacée \nSuperficie : 7,640 ×10⁹ km²\nMasse : 1,024 × 10²⁶ kg \nGravité : 11,27 m/s²\nPériode de révolution : 60 216 j",
    image: "neptune.gif",
    color: "#6e7eda"
  },
  "URANUS": {
    name: "Uranus",
    intro: "Uranus est la septième planète du Système solaire par ordre d'éloignement du Soleil. Elle orbite autour de celui-ci à une distance d'environ 19,2 unités astronomiques (2,87 milliards de kilomètres), avec une période de révolution de 84,05 années terrestres.",
    details: "Type de planète :\nSuperficie :  8,083 × 10⁹ km²\nMasse : 8,681 × 10²⁵ kg\nGravité :  8,87 m/s²\nPériode de révolution : 30 698j",
    image: "Uranus.gif",
    color: "#6ec6da"
  },
  "SOLEIL": {
    name: "Soleil",
    intro: "Le Soleil est l’étoile de type naine jaune du Système solaire, qui se situe dans le bras d'Orion. Il orbite autour du centre galactique en une année galactique de 225 à 250 millions d'années",
    details: "Type : Étoile naine\nDiamètre moyen : 1 392 684 km \nMasse : 1,9885 × 10³⁰ kg\nGravité : 273,95 m/s²\n Vitesse : 217 km/s",
    image: "sun.gif",
    color: "#ffa000"
  },
  "LUNE": {
    name: "Lune",
    intro: "La Lune, est l'unique satellite naturel permanent de la planète Terre. Il s'agit du cinquième plus grand satellite naturel du Système solaire.",
    details: "Type : Satellite naturel terrestre \nSuperficie : 37 871 220,85 km²\nMasse : 7,35 × 10²² kg  kg\nGravité : 1,62 m/s² \nPériode de révolution : 27j",
    image: "lune.gif",
    color: "#6e6e6e"
  }
};




// ANIMATION INFO
function animatePlanetName() {
  const title = document.getElementById('planetName');
  const text = title.textContent;
  title.innerHTML = text.split('').map(char => `<span>${char}</span>`).join('');

  const spans = title.querySelectorAll('span');
  spans.forEach((span, i) => {
    span.style.animationDelay = `${i * 0.05}s`;
  });
}





  // CLICK
  scene.onPointerObservable.add((pointerInfo) => {
          if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
              const pickResult = pointerInfo.pickInfo;
              if (pickResult?.hit && pickResult.pickedMesh) {
                  const planetName = pickResult.pickedMesh.name;

                 if (planetData[planetName]) {
                        const data = planetData[planetName];
                        document.getElementById("planetName").style.color = data.color || 'black';  
                        document.getElementById("planetName").textContent = data.name;

                        document.getElementById("planetIntro").textContent = data.intro || '';
                         document.getElementById("planetDetails").textContent = data.details || '';

                        document.getElementById("planetImage").src = data.image;
                    
                        animatePlanetName();
                        const panel = document.getElementById("infoPanel");
                        panel.style.display = "block";
                        requestAnimationFrame(() => panel.classList.add("show"));
                    }
                    else {
                      console.log("nop")
                  }
              }
          }
      });



      return scene;
    };


    var scene = createScene();
    const envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("env.env", scene);
    scene.environmentTexture = envTexture;

    const backgroundLayer = new BABYLON.Layer("backgroundLayer", "fond.png", scene, true);
    backgroundLayer.isBackground = true;
    backgroundLayer.texture.level = 0;

    scene.environmentIntensity = 0.2
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 1.0;

        engine.runRenderLoop(() => {
          scene.render();
      });
      window.addEventListener('resize', () => {
          engine.resize();

        });
