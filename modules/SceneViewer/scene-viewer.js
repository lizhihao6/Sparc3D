export class ViewerModule {
  constructor(container, modelBaseNames, modelPath, imagePath) {
    this.container = container;
    this.modelBaseNames = modelBaseNames;
    this.modelPath = modelPath;
    this.imagePath = imagePath;
    this.imageExtension = ".png";
    this.modelExtension = ".drc";
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.controls = null;
  }

  init() {
    this.setupScene();
    this.createImageSlider();
    this.loadModel(this.modelBaseNames[0]);
  }

  setupScene() {
    const viewerContainer = document.querySelector(
      `${this.container} #viewer-container`
    );
    const width = viewerContainer.clientWidth;
    const height = viewerContainer.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    this.camera.position.set(0, 1, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xffffff);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    viewerContainer.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);

    const lightIntensity = 18;
    const lightDistance = 100;

    const directions = [
      [10, 0, 0], // +x
      [-10, 0, 0], // -x
      [0, 10, 0], // +y
      [0, -10, 0], // -y
      [0, 0, 10], // +z
      [0, 0, -10], //-z
    ];

    directions.forEach((dir, index) => {
      const pointLight = new THREE.PointLight(
        0xffffff,
        lightIntensity,
        lightDistance
      );
      pointLight.position.set(...dir);
      pointLight.castShadow = true;
      this.scene.add(pointLight);

      pointLight.name = `PointLight_${index}`;
    });

    window.addEventListener("resize", () => {
      const newWidth = viewerContainer.clientWidth;
      const newHeight = viewerContainer.clientHeight;
      this.renderer.setSize(newWidth, newHeight);
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
    });

    this.animate();
  }

  loadModel(baseName, index) {
    if (this.model) this.scene.remove(this.model);

    const overlay = document.querySelector(
      `${this.container} #loading-overlay`
    );
    overlay.style.display = "flex";
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/draco_decoder.js' );
    // dracoLoader.setDecoderConfig({type: 'js'});
    // dracoLoader.getDecoderModule();
    // const loader = new THREE.GLTFLoader();
    // loader.setDRACOLoader( dracoLoader );
    dracoLoader.load(`${this.modelPath}/${baseName}${this.modelExtension}`, function (geometry) {
      var material = new THREE.MeshStandardMaterial( { color: 0x606060 } );
      var mesh = new THREE.Mesh( geometry, material );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add( mesh );
  })
    // dracoLoader.load( `${this.modelPath}/${baseName}${this.modelExtension}`, function ( geometry ) {

    //   this.scene.add( new THREE.Mesh( geometry ) );
    
    //   // (Optional) Release the cached decoder module.
    //   THREE.DRACOLoader.releaseDecoderModule();
    
    // } );
    // loader.load(
    //   `${this.modelPath}/${baseName}${this.modelExtension}`,
    //   (gltf) => {
    //     this.model = gltf.scene;
    //     this.scene.add(this.model);

    //     this.model.traverse((child) => {
    //       if (child.isMesh) child.visible = true;
    //     });

    //     this.changeModelColor(0xffffff);

    //     // Reset camera
    //     this.camera.position.set(0, 1, 5);

    //     // Please check here
    //     this.createButtons(this.model.children[0].children.length);

    //     overlay.style.display = "none";
    //   }
    // );
  }

  changeModelColor(color) {
    if (this.model) {
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color);
        }
      });
    }
  }

  createImageSlider() {
    const sliderContainer = document.querySelector(
      `${this.container} #image-slider`
    );
    this.modelBaseNames.forEach((baseName, index) => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      const img = document.createElement("img");
      img.src = `${this.imagePath}/${baseName}${this.imageExtension}`;
      img.alt = `Model ${index + 1}`;
      img.onclick = () => this.loadModel(baseName, index);

      slide.appendChild(img);
      sliderContainer.appendChild(slide);
    });

    this.swiper = new Swiper(`${this.container} .swiper`, {
      slidesPerView: "auto",
      slidesPerGroup: 2,
      spaceBetween: 10,
      rewind: true,
      navigation: {
        nextEl: `${this.container} .swiper-button-next`,
        prevEl: `${this.container} .swiper-button-prev`,
      },
    });
  }

  createButtons(length) {
    const controlsDiv = document.querySelector(
      `${this.container} #button-block`
    );
    const buttons = controlsDiv.querySelectorAll("button");
    buttons.forEach((button) => button.remove());

    for (let i = 0; i < length; i++) {
      const button = document.createElement("button");
      button.textContent = `Show Instance ${i + 1}`;
      button.onclick = () => this.showPart(i);
      controlsDiv.appendChild(button);
    }

    // Add "Show All" button
    const showAllButton = document.createElement("button");
    showAllButton.textContent = "Show All";
    showAllButton.onclick = () => this.showAll();
    controlsDiv.appendChild(showAllButton);
  }

  showPart(index) {
    if (this.model) {
      // Please check hierarchy of the model
      let root = this.model.children[0];
      for (let i = 0; i < root.children.length; i++) {
        if (i === index) {
          root.children[i].visible = true;
        } else {
          root.children[i].visible = false;
        }
      }
    }
  }

  showAll() {
    if (this.model) {
      this.model.traverse((child) => {
        if (child.isMesh) child.visible = true;
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
