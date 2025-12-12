import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";

// Register GSAP plugins
gsap.registerPlugin(CSSPlugin);

// Import scene components
import CyberpunkOffice from "./scenes/CyberpunkOffice.js";
import LoadingManager from "./utils/LoadingManager.js";
import PerformanceManager from "./utils/PerformanceManager.js";
import NavigationManager from "./utils/NavigationManager.js";
import InteractiveElements from "./components/InteractiveElements.js";
import ModalManager from "./utils/ModalManager.js";
import { portfolioContent } from "./data/portfolioContent.js";

class Portfolio3D {
  constructor() {
    this.canvas = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    this.loadingManager = new LoadingManager();
    this.performanceManager = new PerformanceManager();
    this.navigationManager = new NavigationManager();
    this.interactiveElements = new InteractiveElements(this.scene);
    this.modalManager = new ModalManager();

    // Make modal manager globally accessible for robot interaction
    window.modalManager = this.modalManager;

    this.cyberpunkOffice = null;

    // Rotating text system
    this.rotatingText = null;
    this.rotatingTextGroup = null;

    // Raycaster for click detection
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Active hologram screen tracking
    this.activeHologramIndex = -1;
    this.isHologramActive = false;

    this.isLoaded = false;
    this.currentSection = "home";

    this.init();
  }

  init() {
    this.setupScene();
    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupLights();
    this.setupEventListeners();

    // Add typing effect for name in loading screen
    this.setupLoadingNameAnimation();

    // Load the cyberpunk office scene
    this.loadScene();

    // Start the animation loop
    this.animate();

    // Setup loading manager
    this.setupLoadingManager();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
  }

  setupRenderer() {
    const canvasContainer = document.getElementById("canvas-container");

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    canvasContainer.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Position camera to face the center monitor
    // Center monitor is at position (0, 5.0, -1.5)
    this.camera.position.set(0, 8, 12);
    this.camera.lookAt(0, 5, -1.5);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI * 0.75;
    this.controls.target.set(0, 5, -1.5); // Target center monitor
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
  }

  setupLights() {
    // Ambient light for overall illumination - increased intensity
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Main directional light (moonlight) - increased intensity
    const directionalLight = new THREE.DirectionalLight(0x4080ff, 1.5);
    directionalLight.position.set(20, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -25;
    directionalLight.shadow.camera.right = 25;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -25;
    this.scene.add(directionalLight);

    // Additional directional light from the front for better visibility
    const frontLight = new THREE.DirectionalLight(0x8080ff, 0.8);
    frontLight.position.set(0, 15, 25);
    frontLight.castShadow = false; // No shadow to avoid conflict
    this.scene.add(frontLight);

    // Spot light focused on desk area
    const deskSpotLight = new THREE.SpotLight(
      0xffffff,
      2,
      30,
      Math.PI / 6,
      0.3
    );
    deskSpotLight.position.set(0, 15, 5);
    deskSpotLight.target.position.set(0, 2, 0);
    deskSpotLight.castShadow = true;
    deskSpotLight.shadow.mapSize.width = 1024;
    deskSpotLight.shadow.mapSize.height = 1024;
    this.scene.add(deskSpotLight);
    this.scene.add(deskSpotLight.target);

    // Neon accent lights - increased intensity
    const neonLight1 = new THREE.PointLight(0x00ffff, 3, 30);
    neonLight1.position.set(-10, 5, 10);
    this.scene.add(neonLight1);

    const neonLight2 = new THREE.PointLight(0xff00ff, 3, 30);
    neonLight2.position.set(10, 5, -10);
    this.scene.add(neonLight2);

    // Additional point lights around the desk for better illumination
    const deskLight1 = new THREE.PointLight(0xffffff, 1.5, 15);
    deskLight1.position.set(-5, 8, 5);
    this.scene.add(deskLight1);

    const deskLight2 = new THREE.PointLight(0xffffff, 1.5, 15);
    deskLight2.position.set(5, 8, 5);
    this.scene.add(deskLight2);

    // Rim lighting from behind
    const rimLight = new THREE.DirectionalLight(0x00ffff, 0.5);
    rimLight.position.set(0, 5, -20);
    this.scene.add(rimLight);

    // Add lighting for rotating text
    const textLight = new THREE.PointLight(0x00ffff, 2, 50);
    textLight.position.set(0, 30, 0);
    this.scene.add(textLight);

    // Add ambient light for text visibility
    const textAmbient = new THREE.AmbientLight(0x004466, 0.3);
    this.scene.add(textAmbient);
  }

  async loadScene() {
    try {
      this.cyberpunkOffice = new CyberpunkOffice(
        this.scene,
        this.loadingManager
      );
      await this.cyberpunkOffice.load();

      // Setup navigation after scene is loaded
      this.navigationManager.setup(
        this.camera,
        this.controls,
        this.cyberpunkOffice
      );

      // Setup interactive elements
      this.interactiveElements.setCamera(this.camera);
      this.interactiveElements.setupPortfolioInteractions(this.cyberpunkOffice);

      // Create rotating text
      this.createRotatingText();

      this.isLoaded = true;

      // Scene is loaded, loading will continue automatically
    } catch (error) {
      console.error("Error loading scene:", error);
    }
  }

  setupLoadingManager() {
    // Setup rotating loading messages
    this.setupLoadingMessages();

    this.loadingManager.onProgress = (progress) => {
      const progressBar = document.getElementById("loading-progress");
      const progressText = document.getElementById("loading-percentage");

      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
      }
    };

    this.loadingManager.onLoad = () => {
      console.log("Main.js received onLoad, calling hideLoadingScreen");
      this.hideLoadingScreen();
    };
  }

  setupLoadingMessages() {
    const loadingText = document.getElementById("loading-text");
    if (!loadingText) return;

    const messages = [
      "Initializing Cyberpunk Terminal...",
      "Loading 3D Environment...",
      "Connecting Neural Networks...",
      "Activating Hologram Systems...",
      "Calibrating Reality Matrix...",
      "Synchronizing Digital Assets...",
      "Preparing Portfolio Interface...",
      "Almost Ready to Launch...",
    ];

    let messageIndex = 0;

    const rotateMessages = () => {
      if (document.getElementById("loading-screen").style.display !== "none") {
        loadingText.textContent = messages[messageIndex];
        messageIndex = (messageIndex + 1) % messages.length;
        setTimeout(rotateMessages, 2000); // Change every 2 seconds
      }
    };

    // Start rotating messages after initial delay
    setTimeout(rotateMessages, 3000); // Start after name typing
  }

  hideLoadingScreen() {
    console.log("Hiding loading screen");
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          loadingScreen.style.display = "none";
          console.log("Loading screen hidden");
        },
      });
    }
  }

  setupLoadingNameAnimation() {
    const nameElement = document.querySelector(".loading-name");
    if (!nameElement) return;

    const fullName = "TAUFIK HIDAYAT ZEBUA";
    nameElement.textContent = ""; // Clear initial content

    let currentIndex = 0;

    const typeWriter = () => {
      if (currentIndex < fullName.length) {
        nameElement.textContent += fullName[currentIndex];
        currentIndex++;

        // Random typing speed for more realistic effect
        const typingDelay = Math.random() * 100 + 50; // 50-150ms
        setTimeout(typeWriter, typingDelay);
      } else {
        // Start the glow pulse animation after typing is complete
        nameElement.style.animation = "glowPulse 3s ease-in-out infinite";
      }
    };

    // Start typing after a small delay
    setTimeout(typeWriter, 500);
  }

  setupEventListeners() {
    // Mouse state tracking for preventing click during drag
    this.isMouseDown = false;
    this.mouseDownPosition = new THREE.Vector2();
    this.dragThreshold = 5; // pixels

    // Window resize
    window.addEventListener("resize", () => {
      this.onWindowResize();
    });

    // Mouse down - start tracking for drag detection
    this.canvas.addEventListener("mousedown", (event) => {
      this.isMouseDown = true;
      this.mouseDownPosition.set(event.clientX, event.clientY);
    });

    // Mouse up - end tracking
    this.canvas.addEventListener("mouseup", (event) => {
      this.isMouseDown = false;
    });

    // Mouse click for hologram screen interaction (with drag detection)
    this.canvas.addEventListener("click", (event) => {
      this.onHologramClick(event);
    });

    // Mouse move for cursor pointer on hologram hover
    this.canvas.addEventListener("mousemove", (event) => {
      this.onMouseMove(event);
    });

    // Keyboard escape to deactivate hologram tracking
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isHologramActive) {
        this.deactivateHologram();
      }
    });

    // Navigation buttons
    const navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const section = e.target.getAttribute("data-section");

        // Add visual feedback for hologram sections
        const isHologramSection = [
          "about",
          "projects",
          "skills",
          "contact",
        ].includes(section);
        if (isHologramSection) {
          // Add dramatic click effect
          this.addNavbarClickEffect(e.target, section);

          console.log(
            `Navbar click: Activating ${section.toUpperCase()} hologram`
          );
        }

        this.navigateToSection(section);

        // Update active button
        navButtons.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
      });
    });

    // Performance monitoring
    this.performanceManager.onPerformanceChange = (settings) => {
      this.applyPerformanceSettings(settings);
    };
  }

  navigateToSection(section) {
    if (this.currentSection === section || !this.isLoaded) return;

    this.currentSection = section;

    // Map section to hologram screen index
    const sectionToScreenMap = {
      about: 0, // Left screen - ABOUT
      projects: 1, // Back screen - PROJECTS
      skills: 2, // Right screen - SKILLS
      contact: 3, // Front screen - CONTACT
    };

    // If clicking home, return to default view
    if (section === "home") {
      this.returnToDefaultView();
      return;
    }

    // If clicking on a hologram section, trigger hologram focus instead
    if (sectionToScreenMap.hasOwnProperty(section)) {
      const screenIndex = sectionToScreenMap[section];
      this.focusOnHologramScreen(screenIndex);
      return;
    }

    // For other sections, use normal navigation
    this.navigationManager.navigateTo(section);

    // Disable auto-rotate during navigation
    this.controls.autoRotate = false;

    // Re-enable auto-rotate after navigation
    setTimeout(() => {
      if (section === "home") {
        this.controls.autoRotate = true;
      }
    }, 3000);
  }

  addNavbarClickEffect(button, section) {
    // Create a ripple effect
    const ripple = document.createElement("div");
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(0, 255, 255, 0.6)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.left = "50%";
    ripple.style.top = "50%";
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.marginLeft = "-10px";
    ripple.style.marginTop = "-10px";
    ripple.style.pointerEvents = "none";
    ripple.style.zIndex = "1000";

    // Add ripple animation keyframes if not already added
    if (!document.getElementById("ripple-styles")) {
      const style = document.createElement("style");
      style.id = "ripple-styles";
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Make button position relative if not already
    if (getComputedStyle(button).position === "static") {
      button.style.position = "relative";
    }

    button.appendChild(ripple);

    // Button click animation
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });

    // Enhanced glow effect
    const originalBoxShadow = button.style.boxShadow;
    button.style.boxShadow =
      "0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 20px rgba(0, 255, 255, 0.2)";
    button.style.borderColor = "#00ffff";
    button.style.color = "#ffffff";

    // Screen flash effect on the whole screen - REMOVED to prevent blue flash
    // this.addScreenFlashEffect();

    setTimeout(() => {
      button.removeChild(ripple);
      button.style.boxShadow = originalBoxShadow;
      button.style.borderColor = "";
      button.style.color = "";
    }, 600);
  }

  createRotatingText() {
    const text = "TAUFIK HIDAYAT ZEBUA";
    const radius = 35; // Distance from center
    const height = 25; // Height above ground

    // Create main group for all text elements
    this.rotatingTextGroup = new THREE.Group();
    this.rotatingTextGroup.position.set(0, height, 0);
    this.scene.add(this.rotatingTextGroup);

    // Split text into words for different spacing
    const words = text.split(" ");

    // Spacing configuration:
    const letterSpacing = 0.1; // Spacing between letters in same word (0.08-0.12 recommended)
    const wordSpacing = 0.5; // Extra spacing between words (0.4-0.8 recommended)

    // letterSpacing values:
    // 0.08 = very tight letters
    // 0.1 = tight letters (current)
    // 0.12 = normal letters
    // 0.15 = loose letters

    // wordSpacing values:
    // 0.3 = close words
    // 0.4 = normal words
    // 0.5 = separated words (current)
    // 0.6-0.8 = well separated words

    let totalAngle = 0;
    let allLetterPositions = [];

    // First pass: calculate positions for all letters
    words.forEach((word, wordIndex) => {
      for (let i = 0; i < word.length; i++) {
        allLetterPositions.push({
          letter: word[i],
          angle: totalAngle,
          wordIndex: wordIndex,
          isFirstLetter: i === 0, // Mark first letter of each word
        });

        if (i < word.length - 1) {
          // Add letter spacing within word
          totalAngle += letterSpacing;
        }
      }

      // Add word spacing after each word (except last)
      if (wordIndex < words.length - 1) {
        totalAngle += wordSpacing;
      }
    });

    // Center the entire text arc
    const startAngle = -totalAngle / 2;

    // Second pass: create letter geometries
    allLetterPositions.forEach((letterData, index) => {
      const angle = startAngle + letterData.angle;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Create letter group that will always face center
      const letterGroup = new THREE.Group();
      letterGroup.position.set(x, 0, z);

      // Create box geometry for letter background (slightly smaller for better spacing)
      const boxGeometry = new THREE.BoxGeometry(2.4, 3.0, 0.4);

      // Different colors for first letters of each word
      let emissiveColor, borderColor;

      if (letterData.isFirstLetter) {
        // Same color for all first letters (T, H, Z)
        emissiveColor = 0x440033; // Magenta tint for all first letters
        borderColor = 0xff00ff; // Magenta border for all first letters
      } else {
        // Regular letters use cyan
        emissiveColor = 0x003344; // Cyan tint
        borderColor = 0x00ffff; // Cyan border
      }

      const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: emissiveColor,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.95,
        metalness: 0.8,
        roughness: 0.3,
        side: THREE.DoubleSide,
      });
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

      // Add border/frame effect
      const borderGeometry = new THREE.BoxGeometry(2.5, 3.1, 0.42);
      const borderMaterial = new THREE.MeshBasicMaterial({
        color: borderColor,
        transparent: true,
        opacity: 0.6,
        side: THREE.BackSide,
      });
      const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);

      // Create text geometry
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 256;
      canvas.height = 256;

      // Clear canvas
      context.clearRect(0, 0, 256, 256);

      // Set font and style
      context.font = "bold 160px Orbitron, monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";

      // Determine colors based on whether it's first letter of word
      let mainColor, glowColor;

      if (letterData.isFirstLetter) {
        // Same color for all first letters (T, H, Z)
        mainColor = "#ff00ff"; // Magenta for all first letters
        glowColor = "#ff00ff";
      } else {
        // Regular letters use cyan
        mainColor = "#00ffff";
        glowColor = "#00ffff";
      }

      // Add outline first (black)
      context.strokeStyle = "#000000";
      context.lineWidth = 6;
      context.strokeText(letterData.letter, 128, 128);

      // Add glow effect
      context.shadowColor = glowColor;
      context.shadowBlur = 30;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;

      // Add main text (magenta for first letters, cyan for others)
      context.fillStyle = mainColor;
      context.fillText(letterData.letter, 128, 128);

      // Add inner highlight
      context.shadowBlur = 0;
      context.fillStyle = "#ffffff";
      context.fillText(letterData.letter, 128, 128);

      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.1,
      });

      // Create plane for text
      const textGeometry = new THREE.PlaneGeometry(2.0, 2.6);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.z = 0.22; // In front of box

      // Add border, box and text to letter group
      letterGroup.add(borderMesh);
      letterGroup.add(boxMesh);
      letterGroup.add(textMesh);

      // Store initial angle for facing center calculation
      letterGroup.userData.angle = angle;
      letterGroup.userData.radius = radius;

      // Add to main group
      this.rotatingTextGroup.add(letterGroup);
    });

    // Add rotation animation
    this.animateRotatingText();
  }

  animateRotatingText() {
    if (!this.rotatingTextGroup) return;

    // Rotate the entire group around Y axis (slower rotation)
    gsap.to(this.rotatingTextGroup.rotation, {
      y: Math.PI * 2,
      duration: 30, // Slower rotation
      ease: "none",
      repeat: -1,
    });

    // Add subtle floating animation
    gsap.to(this.rotatingTextGroup.position, {
      y: "+=1.5",
      duration: 4,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Add pulsing glow effect to individual letters
    this.rotatingTextGroup.children.forEach((letterGroup, index) => {
      // Stagger the glow animation - target the box material (index 1)
      const boxMaterial = letterGroup.children[1].material;
      gsap.to(boxMaterial, {
        emissiveIntensity: 0.8,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.1, // Stagger effect
      });

      // Also animate border opacity
      const borderMaterial = letterGroup.children[0].material;
      gsap.to(borderMaterial, {
        opacity: 1.0,
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.1,
      });
    });
  }

  applyPerformanceSettings(settings) {
    // Apply performance optimizations based on device capabilities
    this.renderer.setPixelRatio(settings.pixelRatio);
    this.renderer.shadowMap.enabled = settings.shadows;

    if (this.cyberpunkOffice) {
      this.cyberpunkOffice.applyPerformanceSettings(settings);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    if (!this.cyberpunkOffice || !this.isLoaded) return;

    // Calculate mouse position in normalized device coordinates
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Cast ray from camera through mouse position
    this.raycaster.setFromCamera(mouse, this.camera);

    // First check for back button hover
    const backButtons = this.cyberpunkOffice.getBackButtons();
    let hoveringBackButton = false;

    for (const buttonData of backButtons) {
      if (buttonData.button.visible) {
        const buttonIntersects = this.raycaster.intersectObjects(
          [buttonData.button],
          true
        );
        if (buttonIntersects.length > 0) {
          hoveringBackButton = true;
          break;
        }
      }
    }

    // Check for internal details button hover
    const internalDetailsButtons =
      this.cyberpunkOffice.getInternalDetailsButtons();
    let hoveringInternalDetailsButton = false;

    for (const buttonData of internalDetailsButtons) {
      const buttonIntersects = this.raycaster.intersectObjects(
        [buttonData.button],
        true
      );
      if (buttonIntersects.length > 0) {
        hoveringInternalDetailsButton = true;
        break;
      }
    }

    if (hoveringBackButton || hoveringInternalDetailsButton) {
      this.canvas.style.cursor = "pointer";
      return;
    }

    // Check for robot hover
    const robot = this.cyberpunkOffice.objects.robot;
    if (robot) {
      const robotIntersects = this.raycaster.intersectObjects([robot], true);
      if (robotIntersects.length > 0) {
        this.canvas.style.cursor = "pointer";
        return;
      }
    }

    // Check for Yes/No button hover if robot is in help mode
    if (this.cyberpunkOffice.robotInteractionMode) {
      const robotButtons = this.cyberpunkOffice.getRobotButtons();

      for (const buttonData of robotButtons) {
        if (buttonData.button.visible) {
          const buttonIntersects = this.raycaster.intersectObjects(
            [buttonData.button],
            true
          );

          if (buttonIntersects.length > 0) {
            this.canvas.style.cursor = "pointer";
            return;
          }
        }
      }
    }

    // Get hologram screens
    const hologramScreens = this.cyberpunkOffice.getHologramScreens();
    if (!hologramScreens || hologramScreens.length === 0) return;

    // Check for intersections with hologram screens
    const intersects = this.raycaster.intersectObjects(hologramScreens, true);

    // Change cursor to pointer if hovering over hologram screen
    if (intersects.length > 0) {
      this.canvas.style.cursor = "pointer";
    } else {
      this.canvas.style.cursor = "default";
    }
  }

  onHologramClick(event) {
    if (!this.cyberpunkOffice || !this.isLoaded) return;

    // Check if this is a drag operation (prevent click during camera rotation)
    const currentMousePosition = new THREE.Vector2(
      event.clientX,
      event.clientY
    );
    const dragDistance =
      this.mouseDownPosition.distanceTo(currentMousePosition);

    if (dragDistance > this.dragThreshold) {
      // This was a drag operation, not a click - ignore it
      return;
    }

    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // First, check for Yes/No button clicks if robot is in help mode (BEFORE robot click)
    if (this.cyberpunkOffice.robotInteractionMode) {
      // Try to detect button clicks by checking all robot children
      const robot = this.cyberpunkOffice.objects.robot;
      if (robot) {
        const allRobotParts = [];
        robot.traverse((child) => {
          if (
            child.userData &&
            (child.userData.buttonType === "yes" ||
              child.userData.buttonType === "no")
          ) {
            allRobotParts.push(child);
          }
        });

        console.log("Found robot button children:", allRobotParts.length);

        const robotIntersects = this.raycaster.intersectObjects(
          allRobotParts,
          true
        );
        if (robotIntersects.length > 0) {
          const clickedObject = robotIntersects[0].object;
          console.log(
            "Robot part clicked:",
            clickedObject.name,
            clickedObject.userData
          );

          // Find the button type by traversing up
          let buttonType = null;
          let currentObject = clickedObject;
          while (currentObject && !buttonType) {
            if (currentObject.userData && currentObject.userData.buttonType) {
              buttonType = currentObject.userData.buttonType;
            }
            currentObject = currentObject.parent;
          }

          console.log("Detected button type:", buttonType);

          if (buttonType === "yes") {
            console.log("YES button clicked via traverse");
            this.cyberpunkOffice.showTutorialModal();
            this.cyberpunkOffice.deactivateRobotHelpMode(
              this.camera,
              this.controls
            );
            return;
          } else if (buttonType === "no") {
            console.log("NO button clicked via traverse");
            this.cyberpunkOffice.deactivateRobotHelpMode(
              this.camera,
              this.controls
            );
            return;
          }
        }
      }

      // Also check for clicks on the help text area itself
      if (robot && robot.userData.helpText) {
        const helpText = robot.userData.helpText;
        const helpTextIntersects = this.raycaster.intersectObjects(
          [helpText],
          true
        );

        if (helpTextIntersects.length > 0) {
          console.log("Help text area clicked");

          // Get mouse position relative to help text area
          const mouseX = this.mouse.x;

          // Simple left/right detection for Yes/No
          if (mouseX < 0) {
            console.log("Left side clicked - YES button");
            this.cyberpunkOffice.showTutorialModal();
            this.cyberpunkOffice.deactivateRobotHelpMode(
              this.camera,
              this.controls
            );
          } else {
            console.log("Right side clicked - NO button");
            this.cyberpunkOffice.deactivateRobotHelpMode(
              this.camera,
              this.controls
            );
          }
          return;
        }
      }

      const robotButtons = this.cyberpunkOffice.getRobotButtons();
      console.log("Robot buttons found:", robotButtons.length);

      for (const buttonData of robotButtons) {
        console.log(
          `Checking button: ${buttonData.type}, visible: ${buttonData.button.visible}`
        );
        if (buttonData.button.visible) {
          const buttonIntersects = this.raycaster.intersectObjects(
            [buttonData.button],
            true
          );
          console.log(
            `${buttonData.type} button intersects:`,
            buttonIntersects.length
          );

          if (buttonIntersects.length > 0) {
            console.log(`${buttonData.type} button clicked`);

            if (buttonData.type === "yes") {
              // Show tutorial modal but keep help mode active
              this.cyberpunkOffice.showTutorialModal();
              // Deactivate help mode after showing modal
              this.cyberpunkOffice.deactivateRobotHelpMode(
                this.camera,
                this.controls
              );
            } else if (buttonData.type === "no") {
              // Only deactivate help mode (return to normal)
              this.cyberpunkOffice.deactivateRobotHelpMode(
                this.camera,
                this.controls
              );
            }
            return;
          }
        }
      }
    }

    // Second, check for robot clicks (AFTER button detection and only if NOT in interaction mode)
    if (!this.cyberpunkOffice.robotInteractionMode) {
      const robot = this.cyberpunkOffice.objects.robot;
      if (robot) {
        const robotIntersects = this.raycaster.intersectObjects([robot], true);
        if (robotIntersects.length > 0) {
          console.log("Robot clicked - activating help mode");

          // Auto-close phone hologram
          this.autoClosePhoneHologram();

          this.cyberpunkOffice.activateRobotHelpMode(
            this.camera,
            this.controls
          );
          return; // Exit early if robot was clicked
        }
      }
    }

    // Check for phone clicks
    const phone = this.cyberpunkOffice.objects.phone;
    if (phone) {
      const phoneIntersects = this.raycaster.intersectObjects([phone], true);
      if (phoneIntersects.length > 0) {
        console.log("Phone clicked");
        this.cyberpunkOffice.handlePhoneClick(this.camera, this.controls);
        return; // Exit early if phone was clicked
      }
    }

    // Check for phone hologram button clicks (if hologram is visible)
    if (
      this.cyberpunkOffice.phoneHologram &&
      this.cyberpunkOffice.phoneHologram.visible
    ) {
      const hologramIntersects = this.raycaster.intersectObjects(
        [this.cyberpunkOffice.phoneHologram],
        true
      );

      console.log("Hologram intersects found:", hologramIntersects.length);

      if (hologramIntersects.length > 0) {
        // Log all intersected objects to debug
        hologramIntersects.forEach((intersect, index) => {
          console.log(`Intersect ${index}:`, {
            object: intersect.object,
            userData: intersect.object.userData,
            material: intersect.object.material,
            geometry: intersect.object.geometry,
          });
        });

        // Find the first clickable object
        for (const intersect of hologramIntersects) {
          const clickedObject = intersect.object;
          if (clickedObject.userData && clickedObject.userData.clickable) {
            console.log(
              "Hologram button clicked:",
              clickedObject.userData.type
            );

            // Handle close button
            if (clickedObject.userData.type === "close") {
              console.log("Close button clicked - closing phone hologram");
              this.cyberpunkOffice.exitPhoneMode(this.camera, this.controls);
              return;
            }

            // Handle other buttons (WhatsApp, Email)
            this.cyberpunkOffice.handleHologramButtonClick(
              clickedObject.userData.type,
              clickedObject.userData.url
            );
            return;
          }
        }

        console.log("No clickable objects found in hologram intersects");
      }
    }

    // Third, check for back button clicks
    const backButtons = this.cyberpunkOffice.getBackButtons();
    for (const buttonData of backButtons) {
      if (buttonData.button.visible) {
        const buttonIntersects = this.raycaster.intersectObjects(
          [buttonData.button],
          true
        );
        if (buttonIntersects.length > 0) {
          console.log("Back button clicked - returning to default view");
          this.returnToDefaultView();
          return; // Exit early if back button was clicked
        }
      }
    }

    // Second, check for internal details button clicks
    const internalDetailsButtons =
      this.cyberpunkOffice.getInternalDetailsButtons();
    for (const buttonData of internalDetailsButtons) {
      const buttonIntersects = this.raycaster.intersectObjects(
        [buttonData.button],
        true
      );
      if (buttonIntersects.length > 0) {
        console.log(
          "Internal details button clicked for screen:",
          buttonData.screenIndex
        );
        this.showDetailsModal(buttonData.screenIndex);
        return; // Exit early if internal details button was clicked
      }
    }

    // Get hologram screens from cyberpunk office
    const hologramScreens = this.cyberpunkOffice.getHologramScreens();

    if (!hologramScreens || hologramScreens.length === 0) return;

    // Check for intersections with hologram screens (only if no back button was clicked)
    const intersects = this.raycaster.intersectObjects(hologramScreens, true);

    if (intersects.length > 0) {
      // Find which screen was clicked
      const clickedScreen = intersects[0].object;
      const screenIndex = this.findScreenIndex(clickedScreen, hologramScreens);

      if (screenIndex !== -1) {
        this.focusOnHologramScreen(screenIndex);
      }
    }
  }

  findScreenIndex(clickedObject, hologramScreens) {
    // Find which hologram screen group contains the clicked object
    for (let i = 0; i < hologramScreens.length; i++) {
      if (this.isChildOfGroup(clickedObject, hologramScreens[i])) {
        return i;
      }
    }
    return -1;
  }

  isChildOfGroup(object, group) {
    // Recursively check if object is a child of the group
    let parent = object.parent;
    while (parent) {
      if (parent === group) return true;
      parent = parent.parent;
    }
    return false;
  }

  focusOnHologramScreen(screenIndex) {
    const screenTexts = ["ABOUT", "PROJECTS", "SKILLS", "CONTACT"];
    const screenSections = ["about", "projects", "skills", "contact"];
    const screenPositions = [
      [-25, 10, 0], // Left side
      [0, 10, -30], // Back center
      [25, 10, 0], // Right side
      [0, 10, 25], // Front
    ];

    // Auto-close phone hologram
    this.autoClosePhoneHologram();

    // Close robot help mode if it's active
    if (this.cyberpunkOffice.robotInteractionMode) {
      console.log("Closing robot help mode - hologram screen focused");
      this.cyberpunkOffice.deactivateRobotHelpMode(this.camera, this.controls);
    }

    if (screenIndex >= 0 && screenIndex < screenPositions.length) {
      const targetPosition = screenPositions[screenIndex];
      const screenName = screenTexts[screenIndex];
      const sectionName = screenSections[screenIndex];

      // Update current section and navigation UI
      this.currentSection = sectionName;
      this.updateNavigationUI(sectionName);

      // Reset previous hologram if different
      if (
        this.activeHologramIndex !== -1 &&
        this.activeHologramIndex !== screenIndex
      ) {
        this.cyberpunkOffice.resetHologramOrientation(this.activeHologramIndex);
        this.cyberpunkOffice.hideHologramContent(this.activeHologramIndex);
      }

      // Set active hologram but delay tracking until animation completes
      this.activeHologramIndex = screenIndex;
      this.isHologramActive = false; // Will be activated after animation

      // Disable auto rotation during focus
      this.controls.autoRotate = false;

      // Immediately make hologram face camera
      this.cyberpunkOffice.setHologramFaceCamera(
        screenIndex,
        this.camera.position
      );

      // Calculate camera position directly in front of the screen
      const frontCameraPosition = this.getFrontCameraPosition(
        screenIndex,
        targetPosition
      );

      // Animate camera to position in front of the screen
      gsap.to(this.camera.position, {
        x: frontCameraPosition.x,
        y: frontCameraPosition.y,
        z: frontCameraPosition.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          // Continue making hologram face camera during animation
          this.cyberpunkOffice.setHologramFaceCamera(
            screenIndex,
            this.camera.position
          );
        },
      });

      // Animate controls target to center of the screen
      gsap.to(this.controls.target, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          // Now activate tracking after animation completes
          this.isHologramActive = true;
          console.log(
            `Animation complete - activating tracking for hologram ${screenIndex}`
          );

          // Show hologram content (subtitle, preview, and buttons)
          this.cyberpunkOffice.showHologramContent(screenIndex);

          // Re-enable auto rotation after focusing
          setTimeout(() => {
            this.controls.autoRotate = true;
            console.log(
              `Hologram ${screenIndex} tracking is now active - will follow camera continuously`
            );
          }, 1000);
        },
      });

      console.log(`Focusing on ${screenName} hologram screen from front view`);
    }
  }

  getFrontCameraPosition(screenIndex, screenPosition) {
    // Position camera directly in front of each screen
    const frontDistance = 12; // Distance from screen
    const frontPositions = [
      // ABOUT (left screen) - camera positioned to the right of screen
      {
        x: screenPosition[0] + frontDistance,
        y: screenPosition[1],
        z: screenPosition[2],
      },

      // PROJECTS (back screen) - camera positioned in front of screen
      {
        x: screenPosition[0],
        y: screenPosition[1],
        z: screenPosition[2] + frontDistance,
      },

      // SKILLS (right screen) - camera positioned to the left of screen
      {
        x: screenPosition[0] - frontDistance,
        y: screenPosition[1],
        z: screenPosition[2],
      },

      // CONTACT (front screen) - camera positioned behind screen
      {
        x: screenPosition[0],
        y: screenPosition[1],
        z: screenPosition[2] - frontDistance,
      },
    ];

    return frontPositions[screenIndex] || { x: 0, y: 10, z: 15 };
  }

  deactivateHologram() {
    // Hide content and buttons before deactivating
    if (this.activeHologramIndex >= 0) {
      this.cyberpunkOffice.hideHologramContent(this.activeHologramIndex);
      this.cyberpunkOffice.resetHologramOrientation(this.activeHologramIndex);
    }

    this.isHologramActive = false;
    this.activeHologramIndex = -1;
    console.log("Hologram tracking deactivated");
  }

  // Show details modal for a specific screen
  showDetailsModal(screenIndex) {
    const screenTypes = ["about", "projects", "skills", "contact"];
    const screenNames = ["ABOUT", "PROJECTS", "SKILLS", "CONTACT"];

    if (screenIndex >= 0 && screenIndex < screenTypes.length) {
      const contentType = screenTypes[screenIndex];
      const content = portfolioContent[contentType];

      if (content) {
        console.log(`Showing ${screenNames[screenIndex]} details modal`);
        this.modalManager.showModal(content, contentType);
      } else {
        console.error(`No content found for ${contentType}`);
      }
    }
  }

  // Check if robot help mode should auto-close based on camera position/target changes
  shouldAutoCloseRobotHelp() {
    if (
      !this.cyberpunkOffice.robotInteractionMode ||
      !this.cyberpunkOffice.objects.robot
    ) {
      return false;
    }

    // Add grace period - don't auto-close for first 3 seconds after activation
    const gracePeriod = 3000; // 3 seconds
    const timeSinceActivation =
      Date.now() - (this.cyberpunkOffice.robotHelpModeStartTime || 0);

    if (timeSinceActivation < gracePeriod) {
      return false; // Don't auto-close during grace period
    }

    const robot = this.cyberpunkOffice.objects.robot;
    const robotPos = robot.position;
    const cameraPos = this.camera.position;
    const controlsTarget = this.controls.target;

    // Calculate distance from camera to robot
    const distanceToRobot = cameraPos.distanceTo(robotPos);

    // Calculate distance from controls target to robot
    const targetToRobotDistance = controlsTarget.distanceTo(robotPos);

    // Auto-close if:
    // 1. Camera is too far from robot (user zoomed out or moved away)
    // 2. Controls target is too far from robot (user focused on something else)
    // 3. Camera target moved significantly from robot area

    const maxCameraDistance = 25; // Increased from 20 to be more forgiving
    const maxTargetDistance = 20; // Increased from 15 to be more forgiving

    if (
      distanceToRobot > maxCameraDistance ||
      targetToRobotDistance > maxTargetDistance
    ) {
      return true;
    }

    return false;
  }

  // Auto-close phone hologram when other activities change camera focus
  autoClosePhoneHologram() {
    if (
      this.cyberpunkOffice.phoneInteractionMode &&
      this.cyberpunkOffice.phoneHologram &&
      this.cyberpunkOffice.phoneHologram.visible
    ) {
      console.log("Auto-closing phone hologram due to other camera activity");
      this.cyberpunkOffice.exitPhoneMode(this.camera, this.controls);
    }
  }

  // Return camera to default position (center monitor)
  returnToDefaultView() {
    // Close phone hologram if it's active
    this.autoClosePhoneHologram();

    // Close robot help mode if it's active
    if (this.cyberpunkOffice.robotInteractionMode) {
      console.log("Closing robot help mode - returning to default view");
      this.cyberpunkOffice.deactivateRobotHelpMode(this.camera, this.controls);
    }

    // Update current section and navigation UI to home
    this.currentSection = "home";
    this.updateNavigationUI("home");

    // Hide all back buttons and hologram content
    this.cyberpunkOffice.hideAllBackButtons();
    this.cyberpunkOffice.hideAllHologramContent();

    // Deactivate current hologram
    this.deactivateHologram();

    // Disable auto rotation during transition
    this.controls.autoRotate = false;

    // Animate camera back to default position
    gsap.to(this.camera.position, {
      x: 0,
      y: 8,
      z: 12,
      duration: 2,
      ease: "power2.inOut",
    });

    // Animate controls target back to center monitor
    gsap.to(this.controls.target, {
      x: 0,
      y: 5,
      z: -1.5,
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        // Re-enable auto rotation after returning to default
        this.controls.autoRotate = true;
        console.log(
          "Returned to default view - camera focused on center monitor"
        );
      },
    });
  }

  // Update navigation UI to reflect current section
  updateNavigationUI(section) {
    const navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.section === section) {
        btn.classList.add("active");
      }
    });

    console.log(
      `Navigation UI updated - ${section.toUpperCase()} is now active`
    );
  }

  isCameraTargetOnHologram(screenIndex) {
    const screenPositions = [
      [-25, 10, 0], // Left side - ABOUT
      [0, 10, -30], // Back center - PROJECTS
      [25, 10, 0], // Right side - SKILLS
      [0, 10, 25], // Front - CONTACT
    ];

    if (screenIndex >= 0 && screenIndex < screenPositions.length) {
      const screenPos = new THREE.Vector3(...screenPositions[screenIndex]);
      const targetPos = this.controls.target;

      // Calculate distance between camera target and hologram screen
      const distance = screenPos.distanceTo(targetPos);

      // Consider target "on hologram" if within 8 units radius
      const threshold = 8;

      return distance <= threshold;
    }

    return false;
  }

  updateRotatingText() {
    if (!this.rotatingTextGroup) return;

    // Update each letter to face center
    this.rotatingTextGroup.children.forEach((letterGroup) => {
      // Calculate the angle from letter to center (0,0,0)
      const letterPos = letterGroup.position;
      const angleToCenter = Math.atan2(letterPos.x, letterPos.z);

      // Set rotation so letter faces inward to center
      letterGroup.rotation.y = angleToCenter + Math.PI;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update controls
    this.controls.update();

    // Update performance manager
    this.performanceManager.update();

    // Update scene animations
    if (this.cyberpunkOffice) {
      this.cyberpunkOffice.update();

      // Update robot face camera if in interaction mode
      this.cyberpunkOffice.updateRobotFaceCamera(this.camera);

      // Update phone hologram face camera if in phone mode
      this.cyberpunkOffice.updatePhoneHologramFaceCamera(this.camera);

      // Check if robot help mode should auto-close when camera moves away
      if (this.cyberpunkOffice.robotInteractionMode) {
        const shouldAutoClose = this.shouldAutoCloseRobotHelp();
        if (shouldAutoClose) {
          console.log("Auto-closing robot help mode - camera moved away");
          this.cyberpunkOffice.deactivateRobotHelpMode(
            this.camera,
            this.controls
          );
        }
      }

      // Check if camera target is still on active hologram
      if (this.isHologramActive && this.activeHologramIndex >= 0) {
        const isOnHologram = this.isCameraTargetOnHologram(
          this.activeHologramIndex
        );

        if (isOnHologram) {
          // Continue tracking - use the same method as during animation for consistency
          this.cyberpunkOffice.setHologramFaceCamera(
            this.activeHologramIndex,
            this.camera.position
          );
        } else {
          // Camera target moved away from hologram - deactivate tracking
          console.log(
            `Deactivating hologram ${this.activeHologramIndex} - camera target moved away`
          );
          this.deactivateHologram();
        }
      }
    }

    // Update rotating text to always face center
    this.updateRotatingText();

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize the portfolio when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new Portfolio3D();
});
