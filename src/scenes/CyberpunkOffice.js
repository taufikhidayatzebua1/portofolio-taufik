import * as THREE from "three";
import { gsap } from "gsap";

export default class CyberpunkOffice {
  constructor(scene, loadingManager) {
    this.scene = scene;
    this.loadingManager = loadingManager;

    this.objects = {
      desk: null,
      monitors: [],
      chair: null,
      keyboard: null,
      mouse: null,
      phone: null,
      secondDesk: null,
      cpuTower: null,
      decorations: [],
      particleSystems: [],
      hologramScreens: [], // Add hologram screens array
      robot: null, // Add robot object
    };

    this.materials = {};
    this.animations = [];

    // Robot interaction state
    this.robotInteractionMode = false;
    this.originalCameraPosition = null;
    this.originalCameraTarget = null;

    // Phone interaction state
    this.phoneInteractionMode = false;
    this.phoneHologram = null;

    // Define obstacles for robot collision detection
    this.obstacles = [
      // Main desk area
      { x: 0, z: 0, width: 14, depth: 8 },
      // Chair area
      { x: 0, z: 5, width: 3, depth: 3 },
      // Second desk area
      { x: 15, z: -8, width: 8, depth: 6 },
      // CPU Tower area
      { x: 8, z: 2, width: 2, depth: 2 },
      // Hologram projectors
      { x: -25, z: 0, width: 4, depth: 4 },
      { x: 0, z: -30, width: 4, depth: 4 },
      { x: 25, z: 0, width: 4, depth: 4 },
      { x: 0, z: 25, width: 4, depth: 4 },
    ];

    this.isLoaded = false;
  }

  async load() {
    try {
      this.createMaterials();
      this.createFloor();
      this.createWalls();
      this.createDesk();
      this.createChair();
      this.createMonitors();
      this.createKeyboard();
      this.createPhone();
      this.createMouse();
      this.createMousepad();
      this.createSecondDesk();
      this.createCPUTower();
      this.createHologramScreens();
      this.createDecorations();
      this.createParticleEffects();
      this.createHologram();
      this.createRobot(); // Add robot creation

      this.setupAnimations();

      this.isLoaded = true;

      // Scene loading complete - no need to notify LoadingManager
    } catch (error) {
      console.error("Error loading cyberpunk office:", error);
      throw error;
    }
  }

  createMaterials() {
    // Floor material with cyberpunk grid pattern - brighter
    this.materials.floor = new THREE.MeshLambertMaterial({
      color: 0x222222,
      emissive: 0x003366,
      emissiveIntensity: 0.15,
    });

    // Wall material - fully transparent to hide walls
    this.materials.wall = new THREE.MeshLambertMaterial({
      color: 0x2a2a2a,
      emissive: 0x002244,
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.0, // Completely invisible
    });

    // Desk material - brighter and more visible
    this.materials.desk = new THREE.MeshLambertMaterial({
      color: 0x4a4a4a,
      emissive: 0x002244,
      emissiveIntensity: 0.1,
    });

    // Monitor materials
    this.materials.monitorFrame = new THREE.MeshLambertMaterial({
      color: 0x2a2a2a,
      emissive: 0x001122,
      emissiveIntensity: 0.05,
    });

    this.materials.monitorScreen = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
    });

    // Neon materials for furniture accents
    this.materials.neonCyan = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2.0,
    });

    this.materials.neonMagenta = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 2.0,
    });

    // Chair material - brighter and more visible
    this.materials.chair = new THREE.MeshLambertMaterial({
      color: 0x555555,
      emissive: 0x002244,
      emissiveIntensity: 0.15,
    });
  }

  createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floor = new THREE.Mesh(floorGeometry, this.materials.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    // Add grid pattern - brighter and more visible
    const gridHelper = new THREE.GridHelper(100, 50, 0x00ffff, 0x006666);
    gridHelper.material.opacity = 0.5;
    gridHelper.material.transparent = true;

    this.scene.add(floor);
    this.scene.add(gridHelper);
  }

  createWalls() {
    // Back wall
    const wallGeometry = new THREE.PlaneGeometry(100, 50);
    const backWall = new THREE.Mesh(wallGeometry, this.materials.wall);
    backWall.position.z = -50;
    backWall.position.y = 25;
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Side walls
    const leftWall = new THREE.Mesh(wallGeometry, this.materials.wall);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -50;
    leftWall.position.y = 25;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometry, this.materials.wall);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.x = 50;
    rightWall.position.y = 25;
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);
  }

  createDesk() {
    const deskGroup = new THREE.Group();

    // Desk top - BIGGER SIZE AND HIGHER
    const deskTopGeometry = new THREE.BoxGeometry(12, 0.3, 6);
    const deskTop = new THREE.Mesh(deskTopGeometry, this.materials.desk);
    deskTop.position.y = 2.8; // Raised from 2 to 2.8
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk legs - TALLER LEGS FOR HIGHER DESK
    const legGeometry = new THREE.BoxGeometry(0.3, 2.8, 0.3); // Increased height from 2 to 2.8
    const positions = [
      [-5.7, 1.4, -2.7], // Adjusted Y position for taller legs
      [5.7, 1.4, -2.7],
      [-5.7, 1.4, 2.7],
      [5.7, 1.4, 2.7],
    ];

    positions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, this.materials.desk);
      leg.position.set(...pos);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Add horizontal neon strips on desk edges - ENHANCED GLOW (adjusted for higher desk)
    const stripGeometry = new THREE.BoxGeometry(12, 0.05, 0.15);
    const stripMaterial = this.materials.neonCyan.clone();
    stripMaterial.emissiveIntensity = 1.5; // Increased intensity

    const strip1 = new THREE.Mesh(stripGeometry, stripMaterial);
    strip1.position.set(0, 2.65, 2.7); // Raised for higher desk
    deskGroup.add(strip1);

    const strip2 = new THREE.Mesh(stripGeometry, stripMaterial);
    strip2.position.set(0, 2.65, -2.7); // Raised for higher desk
    deskGroup.add(strip2);

    // Add side neon strips on desk edges (adjusted for higher desk)
    const sideStripGeometry = new THREE.BoxGeometry(0.15, 0.05, 6);
    const sideStripMaterial = this.materials.neonCyan.clone();
    sideStripMaterial.emissiveIntensity = 1.5;

    const sideStrip1 = new THREE.Mesh(sideStripGeometry, sideStripMaterial);
    sideStrip1.position.set(5.85, 2.65, 0); // Raised for higher desk
    deskGroup.add(sideStrip1);

    const sideStrip2 = new THREE.Mesh(sideStripGeometry, sideStripMaterial);
    sideStrip2.position.set(-5.85, 2.65, 0); // Raised for higher desk
    deskGroup.add(sideStrip2);

    // Add vertical neon strips on desk legs for better visibility - TALLER STRIPS FOR HIGHER DESK
    const legStripGeometry = new THREE.BoxGeometry(0.08, 2.6, 0.08); // Increased height from 1.8 to 2.6
    const legStripMaterial = this.materials.neonMagenta.clone();
    legStripMaterial.emissiveIntensity = 0.6;

    positions.forEach((pos) => {
      const legStrip = new THREE.Mesh(legStripGeometry, legStripMaterial);
      legStrip.position.set(pos[0], pos[1], pos[2]);
      deskGroup.add(legStrip);
    });

    // Add desk surface glow effect - BIGGER GLOW (adjusted for higher desk)
    const glowGeometry = new THREE.PlaneGeometry(12.3, 6.3);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });
    const deskGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    deskGlow.rotation.x = -Math.PI / 2;
    deskGlow.position.y = 2.82; // Raised from 2.02 to 2.82 for higher desk
    deskGroup.add(deskGlow);

    this.objects.desk = deskGroup;
    this.scene.add(deskGroup);
  }

  createChair() {
    const chairGroup = new THREE.Group();

    // Seat - MUCH BIGGER AND HIGHER
    const seatGeometry = new THREE.BoxGeometry(3.0, 0.4, 3.0); // Increased from 2.2 to 3.0
    const seat = new THREE.Mesh(seatGeometry, this.materials.chair);
    seat.position.y = 1.6; // Raised from 0.8 to 1.6 for higher desk
    seat.castShadow = true;
    chairGroup.add(seat);

    // Backrest - MUCH BIGGER AND TALLER, adjusted for higher seat
    const backrestGeometry = new THREE.BoxGeometry(3.0, 2.8, 0.4); // Increased width and height
    const backrest = new THREE.Mesh(backrestGeometry, this.materials.chair);
    backrest.position.y = 3.0; // Raised from 2.2 to 3.0 for higher seat
    backrest.position.z = -1.3; // Moved back slightly for bigger seat
    backrest.castShadow = true;
    chairGroup.add(backrest);

    // Chair base - MUCH BIGGER, adjusted for higher seat
    const baseGeometry = new THREE.CylinderGeometry(1.6, 1.6, 0.4); // Increased radius and height
    const base = new THREE.Mesh(baseGeometry, this.materials.chair);
    base.position.y = 0.95; // Raised from 0.15 to 0.95 for higher seat
    base.castShadow = true;
    chairGroup.add(base);

    // Chair legs (5 legs for office chair) - LONGER AND THICKER
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8);
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leg = new THREE.Mesh(legGeometry, this.materials.chair);
      leg.position.x = Math.cos(angle) * 0.9;
      leg.position.z = Math.sin(angle) * 0.9;
      leg.position.y = 0.4;
      leg.castShadow = true;
      chairGroup.add(leg);
    }

    // Add neon accent to chair - MUCH BIGGER for larger chair
    const chairAccentGeometry = new THREE.TorusGeometry(1.6, 0.04, 8, 16); // Increased radius and thickness
    const chairAccentMaterial = this.materials.neonCyan.clone();
    chairAccentMaterial.emissiveIntensity = 0.4;
    const chairAccent = new THREE.Mesh(
      chairAccentGeometry,
      chairAccentMaterial
    );
    chairAccent.position.y = 0.6;
    chairAccent.rotation.x = -Math.PI / 2;
    chairGroup.add(chairAccent);

    // Add glowing neon strips to backrest (adjusted for bigger chair)
    const backrestStripGeometry = new THREE.BoxGeometry(2.8, 0.06, 0.06); // Wider strips for bigger backrest
    const backrestStripMaterial = this.materials.neonMagenta.clone();
    backrestStripMaterial.emissiveIntensity = 1.2;

    // Three horizontal strips on backrest (adjusted for higher chair)
    for (let i = 0; i < 3; i++) {
      const strip = new THREE.Mesh(
        backrestStripGeometry,
        backrestStripMaterial
      );
      strip.position.y = 2.3 + i * 0.5; // Raised from 1.5 to 2.3 for higher backrest
      strip.position.z = -1.1; // Adjusted for moved backrest
      chairGroup.add(strip);
    }

    // Add vertical neon strips on sides of seat (adjusted for higher chair)
    const seatStripGeometry = new THREE.BoxGeometry(0.06, 0.3, 2.8); // Longer strips for bigger seat
    const seatStripMaterial = this.materials.neonCyan.clone();
    seatStripMaterial.emissiveIntensity = 1.0;

    const leftStrip = new THREE.Mesh(seatStripGeometry, seatStripMaterial);
    leftStrip.position.set(-1.4, 1.6, 0); // Raised from 0.8 to 1.6 for higher seat
    chairGroup.add(leftStrip);

    const rightStrip = new THREE.Mesh(seatStripGeometry, seatStripMaterial);
    rightStrip.position.set(1.4, 1.6, 0); // Raised from 0.8 to 1.6 for higher seat
    chairGroup.add(rightStrip);

    // Add subtle glow under chair - MUCH BIGGER GLOW
    const chairGlowGeometry = new THREE.CircleGeometry(2.0, 16); // Increased radius for bigger chair
    const chairGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const chairGlow = new THREE.Mesh(chairGlowGeometry, chairGlowMaterial);
    chairGlow.rotation.x = -Math.PI / 2;
    chairGlow.position.y = 0.01;
    chairGroup.add(chairGlow);

    chairGroup.position.set(0, 0, 5.5); // MOVED CLOSER TO DESK
    chairGroup.rotation.y = Math.PI; // ROTATE 180 DEGREES TO FACE DESK
    this.objects.chair = chairGroup;
    this.scene.add(chairGroup);
  }

  createMonitors() {
    const monitorGroup = new THREE.Group();

    // Main monitor (center) - RAISED SLIGHTLY HIGHER
    const mainMonitor = this.createSingleMonitor(4.5, 2.8, 0.3);
    mainMonitor.position.set(0, 5.0, -1.5); // Raised from 4.6 to 5.0
    monitorGroup.add(mainMonitor);

    // Side monitors - RAISED SLIGHTLY HIGHER
    const leftMonitor = this.createSingleMonitor(3.2, 2.2, 0.25);
    leftMonitor.position.set(-4.2, 4.8, -1.2); // Raised from 4.4 to 4.8
    leftMonitor.rotation.y = Math.PI / 6;
    monitorGroup.add(leftMonitor);

    const rightMonitor = this.createSingleMonitor(3.2, 2.2, 0.25);
    rightMonitor.position.set(4.2, 4.8, -1.2); // Raised from 4.4 to 4.8
    rightMonitor.rotation.y = -Math.PI / 6;
    monitorGroup.add(rightMonitor);

    this.objects.monitors = [mainMonitor, leftMonitor, rightMonitor];
    this.scene.add(monitorGroup);
  }

  createSingleMonitor(width, height, depth) {
    const monitorGroup = new THREE.Group();

    // Frame
    const frameGeometry = new THREE.BoxGeometry(width, height, depth);
    const frame = new THREE.Mesh(frameGeometry, this.materials.monitorFrame);
    frame.castShadow = true;
    monitorGroup.add(frame);

    // Screen
    const screenGeometry = new THREE.PlaneGeometry(width * 0.9, height * 0.9);
    const screen = new THREE.Mesh(screenGeometry, this.materials.monitorScreen);
    screen.position.z = depth / 2 + 0.01;
    monitorGroup.add(screen);

    // Animasi Matrix-style dihapus sesuai permintaan

    // Stand - SHORTER and proportional to lowered monitors
    const standGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.5); // Shortened from 1.8 to 0.8
    const stand = new THREE.Mesh(standGeometry, this.materials.monitorFrame);
    stand.position.y = -height / 2 - 0.4; // Adjusted for shorter stand
    stand.castShadow = true;
    monitorGroup.add(stand);

    return monitorGroup;
  }

  createKeyboard() {
    const keyboardGroup = new THREE.Group();

    // Keyboard base - BIGGER
    const baseGeometry = new THREE.BoxGeometry(5, 0.15, 1.8);
    const base = new THREE.Mesh(baseGeometry, this.materials.desk);
    base.castShadow = true;
    keyboardGroup.add(base);

    // Keys - BIGGER KEYS WITH ENHANCED GLOW
    const keyGeometry = new THREE.BoxGeometry(0.25, 0.08, 0.25);
    const keyMaterial = new THREE.MeshLambertMaterial({
      color: 0x444444,
      emissive: 0x00ffcc, // Cyan glow
      emissiveIntensity: 0.4, // Increased intensity
    });

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 15; col++) {
        const key = new THREE.Mesh(keyGeometry, keyMaterial);
        key.position.x = (col - 7) * 0.32;
        key.position.y = 0.12;
        key.position.z = (row - 1.5) * 0.35;
        key.castShadow = true;
        keyboardGroup.add(key);
      }
    }

    // Add neon strips around keyboard edges
    const edgeStripGeometry = new THREE.BoxGeometry(5.2, 0.03, 0.05);
    const edgeStripMaterial = this.materials.neonCyan.clone();
    edgeStripMaterial.emissiveIntensity = 1.8; // Very bright glow

    // Front edge strip
    const frontStrip = new THREE.Mesh(edgeStripGeometry, edgeStripMaterial);
    frontStrip.position.set(0, 0.08, 0.9);
    keyboardGroup.add(frontStrip);

    // Back edge strip
    const backStrip = new THREE.Mesh(edgeStripGeometry, edgeStripMaterial);
    backStrip.position.set(0, 0.08, -0.9);
    keyboardGroup.add(backStrip);

    // Side strips
    const sideStripGeometry = new THREE.BoxGeometry(0.05, 0.03, 1.8);
    const leftStrip = new THREE.Mesh(sideStripGeometry, edgeStripMaterial);
    leftStrip.position.set(-2.5, 0.08, 0);
    keyboardGroup.add(leftStrip);

    const rightStrip = new THREE.Mesh(sideStripGeometry, edgeStripMaterial);
    rightStrip.position.set(2.5, 0.08, 0);
    keyboardGroup.add(rightStrip);

    // Add keyboard backlight effect - ENHANCED GLOW
    const backlightGeometry = new THREE.PlaneGeometry(5.3, 1.9);
    const backlightMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3, // Increased opacity for more visibility
    });
    const backlight = new THREE.Mesh(backlightGeometry, backlightMaterial);
    backlight.rotation.x = -Math.PI / 2;
    backlight.position.y = 0.08;
    keyboardGroup.add(backlight);

    keyboardGroup.position.set(0, 2.95, 2); // ADJUSTED FOR HIGHER DESK (raised from 2.15 to 2.95)
    this.objects.keyboard = keyboardGroup;
    this.scene.add(keyboardGroup);
  }

  createPhone() {
    const phoneGroup = new THREE.Group();

    // Phone body - modern smartphone shape
    const phoneBodyGeometry = new THREE.BoxGeometry(0.8, 0.05, 1.6);
    const phoneBodyMaterial = new THREE.MeshLambertMaterial({
      color: 0x1a1a1a,
      emissive: 0x111111,
      emissiveIntensity: 0.2,
    });
    const phoneBody = new THREE.Mesh(phoneBodyGeometry, phoneBodyMaterial);
    phoneBody.castShadow = true;
    phoneGroup.add(phoneBody);

    // Phone screen - glowing display
    const screenGeometry = new THREE.BoxGeometry(0.75, 0.02, 1.5);
    const screenMaterial = new THREE.MeshLambertMaterial({
      color: 0x001122,
      emissive: 0x0088ff,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 0.035;
    phoneGroup.add(screen);

    // Create a simple, clear envelope/letter icon
    const letterGroup = new THREE.Group();

    // Main envelope body - clean rectangular shape
    const envelopeGeometry = new THREE.BoxGeometry(0.35, 0.02, 0.25);
    const envelopeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
    });
    const envelope = new THREE.Mesh(envelopeGeometry, envelopeMaterial);
    envelope.position.set(0, 0, 0);
    letterGroup.add(envelope);

    // Envelope flap - simple triangular flap on top
    const flapGeometry = new THREE.BufferGeometry();
    const flapVertices = new Float32Array([
      -0.175,
      0.01,
      -0.125, // bottom left
      0.175,
      0.01,
      -0.125, // bottom right
      0.0,
      0.01,
      0.0, // top center
    ]);
    flapGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(flapVertices, 3)
    );
    flapGeometry.computeVertexNormals();

    const flapMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600, // Orange color for contrast
      side: THREE.DoubleSide,
    });
    const flap = new THREE.Mesh(flapGeometry, flapMaterial);
    letterGroup.add(flap);

    // Position the letter group on the phone screen
    letterGroup.position.set(0, 0.045, 0);
    phoneGroup.add(letterGroup);

    // Screen edge glow
    const glowGeometry = new THREE.BoxGeometry(0.8, 0.01, 1.55);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 0.04;
    phoneGroup.add(glow);

    // Position phone to the left of keyboard
    phoneGroup.position.set(-4.2, 2.95, 1.8); // Lebih ke belakang dari sebelumnya
    phoneGroup.rotation.y = Math.PI * 0.15; // Slight angle for better visibility

    // Make phone interactive
    phoneGroup.userData = {
      type: "phone",
      interactive: true,
      clickable: true,
    };

    // Add click detection to phone body
    phoneBody.userData = {
      type: "phone",
      interactive: true,
      clickable: true,
    };

    this.objects.phone = phoneGroup;
    this.scene.add(phoneGroup);

    // Add pulsing animation for letter icon
    this.animations.push(() => {
      if (phoneGroup) {
        const time = Date.now() * 0.003;

        // Letter group is now at index 2
        const letterGroup = phoneGroup.children[2];
        if (letterGroup && letterGroup.children) {
          letterGroup.children.forEach((letterPart, partIndex) => {
            if (
              letterPart.material &&
              letterPart.material.emissiveIntensity !== undefined
            ) {
              // Different animation for different parts
              switch (partIndex) {
                case 0: // envelope body (blue)
                  letterPart.material.emissiveIntensity =
                    1.5 + Math.sin(time * 1.0) * 0.2;
                  break;
                case 1: // envelope flap (orange)
                  letterPart.material.emissiveIntensity =
                    1.3 + Math.sin(time * 1.2) * 0.3;
                  break;
              }
            }
          });
        }

        // Pulse screen glow (index 1)
        if (phoneGroup.children[1]) {
          phoneGroup.children[1].material.emissiveIntensity =
            0.8 + Math.sin(time * 2) * 0.2;
        }
      }
    });
  }

  createPhoneHologram() {
    const hologramGroup = new THREE.Group();

    // Create hologram screen background - similar to main hologram screens
    const screenGeometry = new THREE.PlaneGeometry(1.6, 3.0);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x001133,
      emissive: 0x001133,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const hologramScreen = new THREE.Mesh(screenGeometry, screenMaterial);
    hologramScreen.position.set(0, 1.2, 0);
    hologramGroup.add(hologramScreen);

    // Create bright border frame - similar to main hologram screens
    const borderGeometry = new THREE.PlaneGeometry(1.7, 3.1);
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.3,
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.set(0, 1.2, -0.01);
    hologramGroup.add(border);

    // WhatsApp button - using plane geometry instead of box
    const whatsappButtonGeometry = new THREE.PlaneGeometry(1.2, 0.35);
    const whatsappButtonMaterial = new THREE.MeshStandardMaterial({
      color: 0x25d366,
      emissive: 0x25d366,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const whatsappButton = new THREE.Mesh(
      whatsappButtonGeometry,
      whatsappButtonMaterial
    );
    whatsappButton.position.set(0, 1.8, 0.02);
    whatsappButton.userData = {
      type: "whatsapp",
      interactive: true,
      clickable: true,
      url: "https://wa.me/6282298400897",
    };
    hologramGroup.add(whatsappButton);

    // WhatsApp button border
    const whatsappBorderGeometry = new THREE.PlaneGeometry(1.3, 0.45);
    const whatsappBorderMaterial = new THREE.MeshBasicMaterial({
      color: 0x30e878,
      transparent: true,
      opacity: 0.6,
    });
    const whatsappBorder = new THREE.Mesh(
      whatsappBorderGeometry,
      whatsappBorderMaterial
    );
    whatsappBorder.position.set(0, 1.8, 0.01);
    hologramGroup.add(whatsappBorder);

    // WhatsApp text/icon
    const whatsappTextGeometry = new THREE.PlaneGeometry(0.1, 0.1);
    const whatsappTextMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const whatsappIcon = new THREE.Mesh(
      whatsappTextGeometry,
      whatsappTextMaterial
    );
    whatsappIcon.position.set(-0.25, 1.2, 0.03);
    // Remove whatsapp icon - hologramGroup.add(whatsappIcon);

    // WhatsApp label text - larger and centered
    const whatsappLabelCanvas = document.createElement("canvas");
    const whatsappLabelContext = whatsappLabelCanvas.getContext("2d");
    whatsappLabelCanvas.width = 720;
    whatsappLabelCanvas.height = 180;
    whatsappLabelContext.fillStyle = "rgba(0, 0, 0, 0)";
    whatsappLabelContext.fillRect(
      0,
      0,
      whatsappLabelCanvas.width,
      whatsappLabelCanvas.height
    );
    whatsappLabelContext.font = "bold 72px Arial";
    whatsappLabelContext.fillStyle = "#ffffff";
    whatsappLabelContext.textAlign = "center";
    whatsappLabelContext.fillText(
      "WhatsApp",
      whatsappLabelCanvas.width / 2,
      whatsappLabelCanvas.height / 2 + 18
    );

    const whatsappLabelTexture = new THREE.CanvasTexture(whatsappLabelCanvas);
    const whatsappLabelGeometry = new THREE.PlaneGeometry(1.1, 0.3);
    const whatsappLabelMaterial = new THREE.MeshBasicMaterial({
      map: whatsappLabelTexture,
      transparent: true,
      opacity: 1.0,
    });
    const whatsappLabel = new THREE.Mesh(
      whatsappLabelGeometry,
      whatsappLabelMaterial
    );
    whatsappLabel.position.set(0, 1.8, 0.03); // Behind the button
    whatsappLabel.userData = {
      type: "whatsapp",
      interactive: true,
      clickable: true,
      url: "https://wa.me/6282298400897",
    };
    hologramGroup.add(whatsappLabel);

    // Email button - using plane geometry instead of box
    const emailButtonGeometry = new THREE.PlaneGeometry(1.2, 0.35);
    const emailButtonMaterial = new THREE.MeshStandardMaterial({
      color: 0x4285f4,
      emissive: 0x4285f4,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const emailButton = new THREE.Mesh(
      emailButtonGeometry,
      emailButtonMaterial
    );
    emailButton.position.set(0, 1.2, 0.02);
    emailButton.userData = {
      type: "email",
      interactive: true,
      clickable: true,
      url: "mailto:taufikhizet1350@gmail.com",
    };
    hologramGroup.add(emailButton);

    // Email button border
    const emailBorderGeometry = new THREE.PlaneGeometry(1.3, 0.45);
    const emailBorderMaterial = new THREE.MeshBasicMaterial({
      color: 0x5a9eff,
      transparent: true,
      opacity: 0.6,
    });
    const emailBorder = new THREE.Mesh(
      emailBorderGeometry,
      emailBorderMaterial
    );
    emailBorder.position.set(0, 1.2, 0.01);
    hologramGroup.add(emailBorder);

    // Remove email icon - not needed anymore

    // Email label text - larger and centered
    const emailLabelCanvas = document.createElement("canvas");
    const emailLabelContext = emailLabelCanvas.getContext("2d");
    emailLabelCanvas.width = 720;
    emailLabelCanvas.height = 180;
    emailLabelContext.fillStyle = "rgba(0, 0, 0, 0)";
    emailLabelContext.fillRect(
      0,
      0,
      emailLabelCanvas.width,
      emailLabelCanvas.height
    );
    emailLabelContext.font = "bold 72px Arial";
    emailLabelContext.fillStyle = "#ffffff";
    emailLabelContext.textAlign = "center";
    emailLabelContext.fillText(
      "Email",
      emailLabelCanvas.width / 2,
      emailLabelCanvas.height / 2 + 18
    );

    const emailLabelTexture = new THREE.CanvasTexture(emailLabelCanvas);
    const emailLabelGeometry = new THREE.PlaneGeometry(1.1, 0.3);
    const emailLabelMaterial = new THREE.MeshBasicMaterial({
      map: emailLabelTexture,
      transparent: true,
      opacity: 1.0,
    });
    const emailLabel = new THREE.Mesh(emailLabelGeometry, emailLabelMaterial);
    emailLabel.position.set(0, 1.2, 0.03); // Behind the button
    emailLabel.userData = {
      type: "email",
      interactive: true,
      clickable: true,
      url: "mailto:taufikhizet1350@gmail.com",
    };
    hologramGroup.add(emailLabel);

    // Close button - using plane geometry
    const closeButtonGeometry = new THREE.PlaneGeometry(1.2, 0.35);
    const closeButtonMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      emissive: 0xff4444,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const closeButton = new THREE.Mesh(
      closeButtonGeometry,
      closeButtonMaterial
    );
    closeButton.position.set(0, 0.6, 0.02);
    closeButton.userData = {
      type: "close",
      interactive: true,
      clickable: true,
    };
    hologramGroup.add(closeButton);

    // Close button border
    const closeBorderGeometry = new THREE.PlaneGeometry(1.3, 0.45);
    const closeBorderMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6666,
      transparent: true,
      opacity: 0.6,
    });
    const closeBorder = new THREE.Mesh(
      closeBorderGeometry,
      closeBorderMaterial
    );
    closeBorder.position.set(0, 0.6, 0.01);
    hologramGroup.add(closeBorder);

    // Close label text
    const closeLabelCanvas = document.createElement("canvas");
    const closeLabelContext = closeLabelCanvas.getContext("2d");
    closeLabelCanvas.width = 720;
    closeLabelCanvas.height = 180;
    closeLabelContext.fillStyle = "rgba(0, 0, 0, 0)";
    closeLabelContext.fillRect(
      0,
      0,
      closeLabelCanvas.width,
      closeLabelCanvas.height
    );
    closeLabelContext.font = "bold 72px Arial";
    closeLabelContext.fillStyle = "#ffffff";
    closeLabelContext.textAlign = "center";
    closeLabelContext.fillText(
      "Close",
      closeLabelCanvas.width / 2,
      closeLabelCanvas.height / 2 + 18
    );

    const closeLabelTexture = new THREE.CanvasTexture(closeLabelCanvas);
    const closeLabelGeometry = new THREE.PlaneGeometry(1.1, 0.3);
    const closeLabelMaterial = new THREE.MeshBasicMaterial({
      map: closeLabelTexture,
      transparent: true,
      opacity: 1.0,
    });
    const closeLabel = new THREE.Mesh(closeLabelGeometry, closeLabelMaterial);
    closeLabel.position.set(0, 0.6, 0.03);
    closeLabel.userData = { clickable: true, type: "close" };
    hologramGroup.add(closeLabel);

    // Add floating particles around screen - similar to main hologram screens
    for (let i = 0; i < 8; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.02);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7,
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);

      const angle = (i / 8) * Math.PI * 2;
      particle.position.set(
        Math.cos(angle) * 0.8 + (Math.random() - 0.5) * 0.3,
        0.8 + Math.sin(angle) * 1.2 + (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.2
      );
      hologramGroup.add(particle);

      // Animate particles
      gsap.to(particle.position, {
        x: particle.position.x + (Math.random() - 0.5) * 0.6,
        y: particle.position.y + (Math.random() - 0.5) * 0.6,
        duration: 3 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(particle.material, {
        opacity: 0.3 + Math.random() * 0.4,
        duration: 1 + Math.random(),
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    // Position hologram above phone
    hologramGroup.position.copy(this.objects.phone.position);
    hologramGroup.position.y += 1.0; // Decreased from 1.2 to 1.0 for slightly lower position
    hologramGroup.visible = false;

    this.phoneHologram = hologramGroup;
    this.scene.add(hologramGroup);

    // Add animation for hologram
    this.animations.push(() => {
      if (this.phoneHologram && this.phoneHologram.visible) {
        const time = Date.now() * 0.002;

        // Animate buttons with subtle pulsing
        const whatsappButton = this.phoneHologram.children.find(
          (child) => child.userData && child.userData.type === "whatsapp"
        );
        const emailButton = this.phoneHologram.children.find(
          (child) => child.userData && child.userData.type === "email"
        );
        const closeButton = this.phoneHologram.children.find(
          (child) => child.userData && child.userData.type === "close"
        );

        if (whatsappButton) {
          whatsappButton.material.emissiveIntensity =
            0.8 + Math.sin(time * 2) * 0.2;
        }
        if (emailButton) {
          emailButton.material.emissiveIntensity =
            0.8 + Math.sin(time * 2.5) * 0.2;
        }
        if (closeButton) {
          closeButton.material.emissiveIntensity =
            0.8 + Math.sin(time * 3) * 0.2;
        }

        // Animate border glow
        const border = this.phoneHologram.children[1]; // Border is second child
        if (border) {
          border.material.emissiveIntensity = 1.0 + Math.sin(time * 3) * 0.3;
        }

        // Note: Camera facing is handled in updatePhoneHologramFaceCamera method
      }
    });
  }

  handlePhoneClick(camera, controls) {
    if (this.phoneInteractionMode) {
      // Exit phone mode
      this.exitPhoneMode(camera, controls);
    } else {
      // Enter phone mode
      this.enterPhoneMode(camera, controls);
    }
  }

  enterPhoneMode(camera, controls) {
    this.phoneInteractionMode = true;

    // Store original camera position
    this.originalCameraPosition = camera.position.clone();
    this.originalCameraTarget = controls.target.clone();

    // Move camera to focus directly on hologram screen
    const phonePosition = this.objects.phone.position.clone();
    const hologramPosition = phonePosition.clone();
    hologramPosition.y += 1.0; // Updated hologram height offset to match new position

    // Focus directly on hologram instead of midpoint
    const targetPosition = new THREE.Vector3(
      phonePosition.x - 1.8, // Further back for better view of hologram
      hologramPosition.y + 0.3, // Focus on hologram level
      phonePosition.z + 1.5 // Good distance to see entire hologram
    );

    gsap.to(camera.position, {
      duration: 1.5,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease: "power2.inOut",
    });

    gsap.to(controls.target, {
      duration: 1.5,
      x: hologramPosition.x, // Focus directly on hologram center
      y: hologramPosition.y, // Focus on hologram center height
      z: hologramPosition.z, // Focus on hologram center depth
      ease: "power2.inOut",
      onComplete: () => {
        // Show hologram after camera movement
        if (!this.phoneHologram) {
          this.createPhoneHologram();
        }
        this.phoneHologram.visible = true;
      },
    });
  }

  exitPhoneMode(camera, controls) {
    this.phoneInteractionMode = false;

    // Hide hologram
    if (this.phoneHologram) {
      this.phoneHologram.visible = false;
    }

    // Return camera to original position
    gsap.to(camera.position, {
      duration: 1.5,
      x: this.originalCameraPosition.x,
      y: this.originalCameraPosition.y,
      z: this.originalCameraPosition.z,
      ease: "power2.inOut",
    });

    gsap.to(controls.target, {
      duration: 1.5,
      x: this.originalCameraTarget.x,
      y: this.originalCameraTarget.y,
      z: this.originalCameraTarget.z,
      ease: "power2.inOut",
    });
  }

  handleHologramButtonClick(buttonType, url) {
    // Open link in new tab
    window.open(url, "_blank");
  }

  createMouse() {
    const mouseGroup = new THREE.Group();

    // Mouse base - FLAT BOTTOM with rounded edges like real mouse
    const mouseBaseGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24);
    mouseBaseGeometry.scale(1.15, 1, 2.0); // Elliptical and elongated
    const mouseBaseMaterial = new THREE.MeshLambertMaterial({
      color: 0x333333,
      emissive: 0x001133,
      emissiveIntensity: 0.2,
    });
    const mouseBase = new THREE.Mesh(mouseBaseGeometry, mouseBaseMaterial);
    mouseBase.position.y = 0.03; // Half of height
    mouseBase.castShadow = true;
    mouseGroup.add(mouseBase);

    // Mouse top - CURVED TOP like real mouse
    const mouseTopGeometry = new THREE.SphereGeometry(0.18, 24, 16);
    mouseTopGeometry.scale(1.15, 0.35, 2.0); // Matching base proportions
    const mouseTopMaterial = new THREE.MeshLambertMaterial({
      color: 0x2a2a2a,
      emissive: 0x001144,
      emissiveIntensity: 0.15,
    });
    const mouseTop = new THREE.Mesh(mouseTopGeometry, mouseTopMaterial);
    mouseTop.position.y = 0.08; // On top of base
    mouseTop.castShadow = true;
    mouseGroup.add(mouseTop);

    // RGB Light strips PERFECTLY POSITIONED on mouse contour
    // Create curved path along the mouse sides with better positioning
    for (let side = 0; side < 2; side++) {
      const sideMultiplier = side === 0 ? -1 : 1;
      const lightColor = side === 0 ? 0xff0080 : 0x00ff80;

      // Create multiple light segments following the mouse curve with proper positioning
      for (let i = 0; i < 7; i++) {
        // Reduced from 8 to 7 segments
        const t = i / 6; // Parameter from 0 to 1 along mouse length
        // Calculate Z position along mouse length
        const z = -0.18 + t * 0.36; // From front to back of mouse

        // Calculate X position following the elliptical cylinder shape
        const ellipseRadius = 0.18 * 1.15; // Base cylinder radius * X scale
        const normalizedZ = Math.abs(z) / 0.18; // Normalize to 0-1
        const taperFactor = Math.cos(normalizedZ * Math.PI * 0.5); // Taper towards ends
        const currentRadius = ellipseRadius * taperFactor;
        const x = sideMultiplier * (currentRadius + 0.015);

        // Calculate Y position - follow the mouse profile (cylinder base + sphere top)
        let y;
        if (t < 0.3 || t > 0.7) {
          // Front and back - follow cylinder base height
          y = 0.03 + 0.02; // Base height + small offset
        } else {
          // Middle section - follow sphere top curve
          const sphereT = (t - 0.3) / 0.4; // Normalize to middle section
          const sphereHeight = 0.035 * Math.sin(sphereT * Math.PI); // Sphere curve
          y = 0.06 + sphereHeight + 0.015; // Base + sphere + offset
        }

        const lightSegmentGeometry = new THREE.SphereGeometry(0.005, 8, 8);
        lightSegmentGeometry.scale(0.8, 1.0, 1.8); // Smaller, more proportional

        const lightMaterial = new THREE.MeshStandardMaterial({
          color: lightColor,
          emissive: lightColor,
          emissiveIntensity: 0.9,
        });

        const lightSegment = new THREE.Mesh(
          lightSegmentGeometry,
          lightMaterial
        );
        lightSegment.position.set(x, y, z);

        // Rotation to follow mouse surface
        const surfaceAngle = Math.atan2(currentRadius * 0.1, 1); // Surface normal
        lightSegment.rotation.y = sideMultiplier * surfaceAngle;
        lightSegment.rotation.z = surfaceAngle * 0.5;

        mouseGroup.add(lightSegment);
      }
    }

    // Additional accent lights on the shortened back section
    const backAccentGeometry = new THREE.SphereGeometry(0.006, 8, 6);
    backAccentGeometry.scale(0.5, 1, 3); // Shortened from 4 to 3 for less elongation

    const backLeftMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0080,
      emissive: 0xff0080,
      emissiveIntensity: 0.7,
    });
    const backRightMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff80,
      emissive: 0x00ff80,
      emissiveIntensity: 0.7,
    });

    const backLeftLight = new THREE.Mesh(backAccentGeometry, backLeftMaterial);
    backLeftLight.position.set(-0.12, 0.09, 0.2); // Higher Y to match curved top
    backLeftLight.rotation.y = 0.2;
    mouseGroup.add(backLeftLight);

    const backRightLight = new THREE.Mesh(
      backAccentGeometry,
      backRightMaterial
    );
    backRightLight.position.set(0.12, 0.09, 0.2); // Higher Y to match curved top
    backRightLight.rotation.y = -0.2;
    mouseGroup.add(backRightLight);

    mouseGroup.position.set(3.5, 3.0, 2.0); // Moved back from 1.8 to 2.0
    this.objects.mouse = mouseGroup;
    this.scene.add(mouseGroup);
  }

  createMousepad() {
    // Gaming mousepad - square shaped with MAXIMUM VISIBILITY
    const mousepadGeometry = new THREE.BoxGeometry(1.2, 0.02, 1.2);
    const mousepadMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888, // Very light gray for maximum visibility
      emissive: 0x003366,
      emissiveIntensity: 0.8,
    });
    const mousepad = new THREE.Mesh(mousepadGeometry, mousepadMaterial);
    mousepad.position.set(3.5, 2.95, 2.0); // Moved back from 1.8 to 2.0
    mousepad.receiveShadow = true;
    mousepad.castShadow = true;
    this.scene.add(mousepad);

    // Mousepad border with cyan RGB lighting
    const borderThickness = 0.04;
    const borderHeight = 0.025;

    // Top border
    const topBorderGeometry = new THREE.BoxGeometry(
      1.2 + borderThickness,
      borderHeight,
      borderThickness
    );
    const topBorderMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6,
    });
    const topBorder = new THREE.Mesh(topBorderGeometry, topBorderMaterial);
    topBorder.position.set(3.5, 2.97, 1.4 - borderThickness / 2); // Moved back: 1.2 -> 1.4
    this.scene.add(topBorder);

    // Bottom border
    const bottomBorderGeometry = new THREE.BoxGeometry(
      1.2 + borderThickness,
      borderHeight,
      borderThickness
    );
    const bottomBorderMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6,
    });
    const bottomBorder = new THREE.Mesh(
      bottomBorderGeometry,
      bottomBorderMaterial
    );
    bottomBorder.position.set(3.5, 2.97, 2.6 + borderThickness / 2); // Moved back: 2.4 -> 2.6
    this.scene.add(bottomBorder);

    // Left border
    const leftBorderGeometry = new THREE.BoxGeometry(
      borderThickness,
      borderHeight,
      1.2
    );
    const leftBorderMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6,
    });
    const leftBorder = new THREE.Mesh(leftBorderGeometry, leftBorderMaterial);
    leftBorder.position.set(2.9 - borderThickness / 2, 2.97, 2.0); // Moved back: 1.8 -> 2.0
    this.scene.add(leftBorder);

    // Right border
    const rightBorderGeometry = new THREE.BoxGeometry(
      borderThickness,
      borderHeight,
      1.2
    );
    const rightBorderMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6,
    });
    const rightBorder = new THREE.Mesh(
      rightBorderGeometry,
      rightBorderMaterial
    );
    rightBorder.position.set(4.1 + borderThickness / 2, 2.97, 2.0); // Moved back: 1.8 -> 2.0
    this.scene.add(rightBorder);

    // Corner pieces to connect the borders
    const cornerSize = borderThickness;
    const cornerGeometry = new THREE.BoxGeometry(
      cornerSize,
      borderHeight,
      cornerSize
    );
    const cornerMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6,
    });

    // Top-left corner
    const topLeftCorner = new THREE.Mesh(cornerGeometry, cornerMaterial);
    topLeftCorner.position.set(
      2.9 - borderThickness / 2,
      2.97,
      1.4 - borderThickness / 2
    ); // Moved back
    this.scene.add(topLeftCorner);

    // Top-right corner
    const topRightCorner = new THREE.Mesh(cornerGeometry, cornerMaterial);
    topRightCorner.position.set(
      4.1 + borderThickness / 2,
      2.97,
      1.4 - borderThickness / 2
    ); // Moved back
    this.scene.add(topRightCorner);

    // Bottom-left corner
    const bottomLeftCorner = new THREE.Mesh(cornerGeometry, cornerMaterial);
    bottomLeftCorner.position.set(
      2.9 - borderThickness / 2,
      2.97,
      2.6 + borderThickness / 2
    ); // Moved back
    this.scene.add(bottomLeftCorner);

    // Bottom-right corner
    const bottomRightCorner = new THREE.Mesh(cornerGeometry, cornerMaterial);
    bottomRightCorner.position.set(
      4.1 + borderThickness / 2,
      2.97,
      2.6 + borderThickness / 2
    ); // Moved back
    this.scene.add(bottomRightCorner);

    this.objects.mousepad = mousepad;
  }

  createSecondDesk() {
    // Second desk on the right side
    const deskGroup = new THREE.Group();

    // Main desk surface - narrower width for CPU desk
    const deskSurfaceGeometry = new THREE.BoxGeometry(2.5, 0.2, 2.5);
    const deskSurface = new THREE.Mesh(
      deskSurfaceGeometry,
      this.materials.desk
    );
    deskSurface.position.set(0, 2.9, 0);
    deskSurface.receiveShadow = true;
    deskGroup.add(deskSurface);

    // Desk legs - adjusted positions for narrower desk
    const legGeometry = new THREE.BoxGeometry(0.3, 2.8, 0.3);
    const legPositions = [
      [-1.0, 1.4, -1], // Back left
      [1.0, 1.4, -1], // Back right
      [-1.0, 1.4, 1], // Front left
      [1.0, 1.4, 1], // Front right
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, this.materials.desk);
      leg.position.set(...pos);
      leg.castShadow = true;
      leg.receiveShadow = true;
      deskGroup.add(leg);
    });

    // Position the entire desk group closer to main desk (right side)
    deskGroup.position.set(8, 0, 1);
    this.scene.add(deskGroup);

    this.objects.secondDesk = deskGroup;
  }

  createCPUTower() {
    const cpuGroup = new THREE.Group();

    // Main CPU case - taller and more impressive
    const caseGeometry = new THREE.BoxGeometry(1.2, 2.2, 2);
    const caseMaterial = new THREE.MeshLambertMaterial({
      color: 0x1a1a1a,
      emissive: 0x111111,
      emissiveIntensity: 0.1,
    });
    const cpuCase = new THREE.Mesh(caseGeometry, caseMaterial);
    cpuCase.position.set(0, 1.1, 0);
    cpuCase.castShadow = true;
    cpuCase.receiveShadow = true;
    cpuGroup.add(cpuCase);

    // Tempered glass side panel (left side)
    const glassGeometry = new THREE.PlaneGeometry(1.8, 2);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.3,
      metalness: 0.8,
      roughness: 0.1,
    });
    const glassPanel = new THREE.Mesh(glassGeometry, glassMaterial);
    glassPanel.position.set(-0.61, 1.1, 0);
    glassPanel.rotation.y = Math.PI / 2;
    cpuGroup.add(glassPanel);

    // GPU with RGB lighting
    this.createRGBGPU(cpuGroup);

    // CPU cooler with RGB fan
    this.createRGBCooler(cpuGroup);

    // RAM sticks with RGB
    this.createRGBRAM(cpuGroup);

    // Motherboard
    this.createMotherboard(cpuGroup);

    // Front panel with RGB strip
    this.createFrontPanel(cpuGroup);

    // Power supply
    this.createPowerSupply(cpuGroup);

    // Position CPU on second desk (slightly forward)
    cpuGroup.position.set(8, 2.9, 1.0);
    this.scene.add(cpuGroup);

    this.objects.cpuTower = cpuGroup;
  }

  createRGBGPU(parent) {
    const gpuGroup = new THREE.Group();

    // GPU PCB (main board)
    const pcbGeometry = new THREE.BoxGeometry(1.8, 0.15, 0.8);
    const pcbMaterial = new THREE.MeshLambertMaterial({
      color: 0x0d4f0d,
      emissive: 0x001100,
      emissiveIntensity: 0.1,
    });
    const pcb = new THREE.Mesh(pcbGeometry, pcbMaterial);
    pcb.position.set(0, 0.8, 0.3);
    gpuGroup.add(pcb);

    // GPU cooling shroud
    const shroudGeometry = new THREE.BoxGeometry(1.6, 0.4, 0.6);
    const shroudMaterial = new THREE.MeshLambertMaterial({
      color: 0x333333,
      emissive: 0x111111,
      emissiveIntensity: 0.2,
    });
    const shroud = new THREE.Mesh(shroudGeometry, shroudMaterial);
    shroud.position.set(0, 1.0, 0.3);
    gpuGroup.add(shroud);

    // RGB lighting strips on GPU
    const rgbColors = [
      0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff, 0xffff00,
    ];

    for (let i = 0; i < 3; i++) {
      const stripGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.7);
      const stripMaterial = new THREE.MeshStandardMaterial({
        color: rgbColors[i % rgbColors.length],
        emissive: rgbColors[i % rgbColors.length],
        emissiveIntensity: 0.8,
      });
      const strip = new THREE.Mesh(stripGeometry, stripMaterial);
      strip.position.set(-0.4 + i * 0.4, 1.22, 0.3);
      gpuGroup.add(strip);

      // Animate RGB colors
      const data = { intensity: 0.8 };
      gsap.to(data, {
        intensity: 0.3,
        duration: 1 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
        onUpdate: () => {
          stripMaterial.emissiveIntensity = data.intensity;
        },
      });
    }

    // GPU fans
    for (let i = 0; i < 2; i++) {
      const fanGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 8);
      const fanMaterial = new THREE.MeshLambertMaterial({
        color: 0x666666,
        emissive: 0x0066ff,
        emissiveIntensity: 0.5,
      });
      const fan = new THREE.Mesh(fanGeometry, fanMaterial);
      fan.position.set(-0.4 + i * 0.8, 1.25, 0.3);
      fan.rotation.x = Math.PI / 2;
      gpuGroup.add(fan);

      // Rotate fans
      gsap.to(fan.rotation, {
        z: Math.PI * 2,
        duration: 0.5,
        repeat: -1,
        ease: "none",
      });
    }

    parent.add(gpuGroup);
  }

  createRGBCooler(parent) {
    const coolerGroup = new THREE.Group();

    // CPU cooler base
    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.8,
      roughness: 0.2,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(-0.2, 0.55, -0.3);
    coolerGroup.add(base);

    // RGB cooling fan
    const fanGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 8);
    const fanMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      emissive: 0xff0066,
      emissiveIntensity: 0.6,
    });
    const fan = new THREE.Mesh(fanGeometry, fanMaterial);
    fan.position.set(-0.2, 0.65, -0.3);
    coolerGroup.add(fan);

    // Animate fan RGB and rotation
    const fanData = { intensity: 0.6 };
    gsap.to(fanData, {
      intensity: 0.2,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      onUpdate: () => {
        fanMaterial.emissiveIntensity = fanData.intensity;
      },
    });

    gsap.to(fan.rotation, {
      y: Math.PI * 2,
      duration: 0.8,
      repeat: -1,
      ease: "none",
    });

    parent.add(coolerGroup);
  }

  createRGBRAM(parent) {
    const ramGroup = new THREE.Group();

    // Create 4 RAM sticks
    for (let i = 0; i < 4; i++) {
      const ramGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.05);
      const ramMaterial = new THREE.MeshLambertMaterial({
        color: 0x1a1a1a,
      });
      const ram = new THREE.Mesh(ramGeometry, ramMaterial);
      ram.position.set(0.2, 0.9, -0.8 + i * 0.2);
      ramGroup.add(ram);

      // RGB strip on top of RAM
      const rgbGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.05);
      const rgbColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
      const rgbMaterial = new THREE.MeshStandardMaterial({
        color: rgbColors[i],
        emissive: rgbColors[i],
        emissiveIntensity: 0.7,
      });
      const rgbStrip = new THREE.Mesh(rgbGeometry, rgbMaterial);
      rgbStrip.position.set(0.2, 1.3, -0.8 + i * 0.2);
      ramGroup.add(rgbStrip);

      // Animate RGB
      const data = { intensity: 0.7 };
      gsap.to(data, {
        intensity: 0.2,
        duration: 1.2 + i * 0.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
        onUpdate: () => {
          rgbMaterial.emissiveIntensity = data.intensity;
        },
      });
    }

    parent.add(ramGroup);
  }

  createMotherboard(parent) {
    // Motherboard
    const mbGeometry = new THREE.BoxGeometry(1.5, 0.05, 1.5);
    const mbMaterial = new THREE.MeshLambertMaterial({
      color: 0x0d2818,
      emissive: 0x001122,
      emissiveIntensity: 0.1,
    });
    const motherboard = new THREE.Mesh(mbGeometry, mbMaterial);
    motherboard.position.set(0, 0.5, 0);
    parent.add(motherboard);
  }

  createFrontPanel(parent) {
    // Front panel RGB strip
    const panelGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.05);
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(0, 0.2, 1.02);
    parent.add(panel);

    // Animate front panel
    const data = { intensity: 0.8 };
    gsap.to(data, {
      intensity: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      onUpdate: () => {
        panelMaterial.emissiveIntensity = data.intensity;
      },
    });
  }

  createPowerSupply(parent) {
    // Power supply unit
    const psuGeometry = new THREE.BoxGeometry(0.8, 0.4, 1);
    const psuMaterial = new THREE.MeshLambertMaterial({
      color: 0x2a2a2a,
    });
    const psu = new THREE.Mesh(psuGeometry, psuMaterial);
    psu.position.set(0, 0.2, -0.5);
    parent.add(psu);

    // PSU fan
    const fanGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 8);
    const fanMaterial = new THREE.MeshLambertMaterial({
      color: 0x444444,
    });
    const fan = new THREE.Mesh(fanGeometry, fanMaterial);
    fan.position.set(0, 0.42, -0.5);
    fan.rotation.x = Math.PI / 2;
    parent.add(fan);

    // Rotate PSU fan
    gsap.to(fan.rotation, {
      z: Math.PI * 2,
      duration: 1.2,
      repeat: -1,
      ease: "none",
    });
  }

  createDecorations() {
    // Add some floating geometric shapes as decoration
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.OctahedronGeometry(0.2);
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x00ffff : 0xff00ff,
        transparent: true,
        opacity: 0.6,
      });

      const decoration = new THREE.Mesh(geometry, material);
      decoration.position.set(
        (Math.random() - 0.5) * 80,
        Math.random() * 30 + 5,
        (Math.random() - 0.5) * 80
      );

      this.scene.add(decoration);
      this.objects.decorations.push(decoration);

      // Animate decorations
      gsap.to(decoration.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: Math.random() * 10 + 5,
        repeat: -1,
        ease: "none",
      });

      gsap.to(decoration.position, {
        y: decoration.position.y + 5,
        duration: Math.random() * 4 + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }

  createParticleEffects() {
    // Floating particles for atmosphere
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = Math.random() * 50;
      positions[i + 2] = (Math.random() - 0.5) * 200;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    this.scene.add(particleSystem);
    this.objects.particleSystems.push(particleSystem);
  }

  createHologram() {
    // Create a holographic code symbol above the desk
    const hologramGroup = new THREE.Group();

    // Main hologram shape - a rotating cube with code-like patterns (BIGGER)
    const cubeGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5); // Increased from 1x1x1 to 2.5x2.5x2.5
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    hologramGroup.add(cube);

    // Add some floating geometric elements around the cube (BIGGER)
    for (let i = 0; i < 8; i++) {
      const elementGeometry = new THREE.SphereGeometry(0.12); // Increased from 0.05 to 0.12
      const elementMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
      });

      const element = new THREE.Mesh(elementGeometry, elementMaterial);
      const angle = (i / 8) * Math.PI * 2;
      element.position.set(
        Math.cos(angle) * 4, // Increased orbit radius from 2 to 4
        Math.sin(i * 0.5) * 1.2, // Increased vertical movement from 0.5 to 1.2
        Math.sin(angle) * 4 // Increased orbit radius from 2 to 4
      );

      hologramGroup.add(element);
    }

    hologramGroup.position.set(0, 10, 0); // Much higher: from Y=6 to Y=10
    this.scene.add(hologramGroup);

    // Animate the hologram
    gsap.to(hologramGroup.rotation, {
      y: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: "none",
    });

    gsap.to(cube.rotation, {
      x: Math.PI * 2,
      z: Math.PI * 2,
      duration: 5,
      repeat: -1,
      ease: "none",
    });
  }

  createHologramScreens() {
    // Create 4 hologram screens circling around the cyberpunk office
    const screenTexts = ["ABOUT", "PROJECTS", "SKILLS", "CONTACT"];
    const positions = [
      [-25, 10, 0], // Left side - closer to office
      [0, 10, -30], // Back center - closer to office
      [25, 10, 0], // Right side - closer to office
      [0, 10, 25], // Front - closer to office
    ];
    const rotations = [
      [0, Math.PI / 2, 0], // Left facing right (toward center)
      [0, 0, 0], // Back facing forward (toward center)
      [0, -Math.PI / 2, 0], // Right facing left (toward center)
      [0, Math.PI, 0], // Front facing back (toward center)
    ];

    screenTexts.forEach((text, index) => {
      const screenGroup = new THREE.Group();

      // Create hologram screen background
      const screenGeometry = new THREE.PlaneGeometry(10, 6);
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x001133,
        emissive: 0x001133,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screenGroup.add(screen);

      // Create bright border frame
      const borderGeometry = new THREE.PlaneGeometry(10.5, 6.5);
      const borderMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.3,
      });
      const border = new THREE.Mesh(borderGeometry, borderMaterial);
      border.position.z = -0.01;
      screenGroup.add(border);

      // Create text using simple geometry with content preview
      const textGroup = this.createHologramText(text, index);
      textGroup.position.z = 0.2;
      screenGroup.add(textGroup);

      // Create internal details button (initially hidden)
      const internalDetailsButton = this.createInternalDetailsButton(index);
      internalDetailsButton.position.set(1.6, -2.25, 0.3); // Right side
      internalDetailsButton.visible = false; // Initially hidden
      internalDetailsButton.userData = {
        isInternalDetailsButton: true,
        screenIndex: index,
      };
      screenGroup.add(internalDetailsButton);

      // Create back button (initially hidden)
      const backButton = this.createBackButton();
      backButton.position.set(-1.6, -2.25, 0.3); // Left side, same Y position
      backButton.visible = false; // Initially hidden
      backButton.userData = { isBackButton: true }; // Mark as back button
      screenGroup.add(backButton);

      // Store reference to buttons and text group for easy access
      screenGroup.userData = {
        backButton: backButton,
        internalDetailsButton: internalDetailsButton,
        textGroup: textGroup,
      };

      // Add floating particles around screen
      for (let i = 0; i < 12; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.7,
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);

        const angle = (i / 12) * Math.PI * 2;
        particle.position.set(
          Math.cos(angle) * 5 + (Math.random() - 0.5) * 2,
          Math.sin(angle) * 3 + (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 0.5
        );
        screenGroup.add(particle);

        // Animate particles
        gsap.to(particle.position, {
          x: particle.position.x + (Math.random() - 0.5) * 4,
          y: particle.position.y + (Math.random() - 0.5) * 2,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Position and rotate screen
      screenGroup.position.set(...positions[index]);
      screenGroup.rotation.set(...rotations[index]);

      // Create hologram projector/emitter below the screen
      const projectorGroup = this.createHologramProjector();
      projectorGroup.position.set(
        positions[index][0],
        0, // Place on ground level (Y=0)
        positions[index][2]
      );
      projectorGroup.rotation.set(...rotations[index]);

      this.scene.add(screenGroup);
      this.scene.add(projectorGroup);

      // Store hologram screen for click detection
      this.objects.hologramScreens.push(screenGroup);

      // Create small hologram beam from projector to screen
      this.createSmallHologramBeam(
        projectorGroup.position,
        screenGroup.position
      );

      // Animate screen glow using object wrapper
      const glowData = { intensity: border.material.emissiveIntensity };
      gsap.to(glowData, {
        intensity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5,
        onUpdate: () => {
          border.material.emissiveIntensity = glowData.intensity;
        },
      });
    });
  }

  createHologramText(text, screenIndex) {
    const textGroup = new THREE.Group();

    // Import portfolio content for preview
    const contentPreviews = [
      {
        title: "ABOUT",
        subtitle: "Programmer & 3D Developer",
        preview:
          "Passionate about modern web technologies\nand 3D development with Three.js",
      },
      {
        title: "PROJECTS",
        subtitle: "Portfolio Showcase",
        preview:
          "Interactive 3D websites, E-commerce\nplatforms, and modern web applications",
      },
      {
        title: "SKILLS",
        subtitle: "Technical Expertise",
        preview:
          "JavaScript, React, Vue.js, Three.js\nNode.js, PHP, and modern tools",
      },
      {
        title: "CONTACT",
        subtitle: "Get In Touch",
        preview:
          "Available for freelance projects\nand collaboration opportunities",
      },
    ];

    const content = contentPreviews[screenIndex] || contentPreviews[0];

    // Create main title (always visible)
    const titleCanvas = document.createElement("canvas");
    const titleContext = titleCanvas.getContext("2d");
    titleCanvas.width = 512;
    titleCanvas.height = 100;

    // Clear canvas
    titleContext.fillStyle = "rgba(0, 0, 0, 0)";
    titleContext.fillRect(0, 0, titleCanvas.width, titleCanvas.height);

    // Draw title
    titleContext.fillStyle = "#00ffff";
    titleContext.font = "bold 60px Arial";
    titleContext.textAlign = "center";
    titleContext.textBaseline = "middle";
    titleContext.fillText(
      content.title,
      titleCanvas.width / 2,
      titleCanvas.height / 2
    );

    // Add glow effect
    titleContext.shadowColor = "#00ffff";
    titleContext.shadowBlur = 10;
    titleContext.fillText(
      content.title,
      titleCanvas.width / 2,
      titleCanvas.height / 2
    );

    const titleTexture = new THREE.CanvasTexture(titleCanvas);
    const titleGeometry = new THREE.PlaneGeometry(7, 1.5);
    const titleMaterial = new THREE.MeshBasicMaterial({
      map: titleTexture,
      transparent: true,
      opacity: 1.0,
    });

    const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
    titleMesh.position.y = 0; // Center the title when alone
    textGroup.add(titleMesh);

    // Create subtitle (initially hidden)
    const subtitleCanvas = document.createElement("canvas");
    const subtitleContext = subtitleCanvas.getContext("2d");
    subtitleCanvas.width = 512;
    subtitleCanvas.height = 80;

    subtitleContext.fillStyle = "rgba(0, 0, 0, 0)";
    subtitleContext.fillRect(0, 0, subtitleCanvas.width, subtitleCanvas.height);

    subtitleContext.fillStyle = "#ff00ff";
    subtitleContext.font = "bold 36px Arial";
    subtitleContext.textAlign = "center";
    subtitleContext.textBaseline = "middle";
    subtitleContext.fillText(
      content.subtitle,
      subtitleCanvas.width / 2,
      subtitleCanvas.height / 2
    );

    subtitleContext.shadowColor = "#ff00ff";
    subtitleContext.shadowBlur = 8;
    subtitleContext.fillText(
      content.subtitle,
      subtitleCanvas.width / 2,
      subtitleCanvas.height / 2
    );

    const subtitleTexture = new THREE.CanvasTexture(subtitleCanvas);
    const subtitleGeometry = new THREE.PlaneGeometry(6, 1);
    const subtitleMaterial = new THREE.MeshBasicMaterial({
      map: subtitleTexture,
      transparent: true,
      opacity: 0,
    });

    const subtitleMesh = new THREE.Mesh(subtitleGeometry, subtitleMaterial);
    subtitleMesh.position.y = 0.5;
    subtitleMesh.visible = false; // Initially hidden
    textGroup.add(subtitleMesh);

    // Create preview content (initially hidden)
    const previewCanvas = document.createElement("canvas");
    const previewContext = previewCanvas.getContext("2d");
    previewCanvas.width = 512;
    previewCanvas.height = 120;

    previewContext.fillStyle = "rgba(0, 0, 0, 0)";
    previewContext.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    previewContext.fillStyle = "#ffffff";
    previewContext.font = "24px Arial";
    previewContext.textAlign = "center";
    previewContext.textBaseline = "top";

    // Split preview text by newlines and draw each line
    const lines = content.preview.split("\n");
    lines.forEach((line, index) => {
      previewContext.fillText(line, previewCanvas.width / 2, 20 + index * 30);
    });

    const previewTexture = new THREE.CanvasTexture(previewCanvas);
    const previewGeometry = new THREE.PlaneGeometry(8, 1.8);
    const previewMaterial = new THREE.MeshBasicMaterial({
      map: previewTexture,
      transparent: true,
      opacity: 0,
    });

    const previewMesh = new THREE.Mesh(previewGeometry, previewMaterial);
    previewMesh.position.y = -0.5;
    previewMesh.visible = false; // Initially hidden
    textGroup.add(previewMesh);

    // Store references for later access
    textGroup.userData = {
      titleMesh: titleMesh,
      subtitleMesh: subtitleMesh,
      previewMesh: previewMesh,
      titleMaterial: titleMaterial,
      subtitleMaterial: subtitleMaterial,
      previewMaterial: previewMaterial,
    };

    return textGroup;
  }

  createBackButton() {
    const buttonGroup = new THREE.Group();

    // Button background - same as details button
    const buttonGeometry = new THREE.PlaneGeometry(2.8, 0.6);
    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: 0x004466,
      emissive: 0x004466,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9,
    });
    const buttonBg = new THREE.Mesh(buttonGeometry, buttonMaterial);
    buttonGroup.add(buttonBg);

    // Button border with animated glow - same as details button
    const borderGeometry = new THREE.PlaneGeometry(3.0, 0.8);
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.7,
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.01;
    buttonGroup.add(border);

    // Button text "BACK"
    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 60;
    const context = canvas.getContext("2d");

    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#00ffff";
    context.font = "bold 20px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("BACK", canvas.width / 2, canvas.height / 2);

    context.shadowColor = "#00ffff";
    context.shadowBlur = 6;
    context.fillText("BACK", canvas.width / 2, canvas.height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 1.0,
    });
    const textMesh = new THREE.Mesh(buttonGeometry, textMaterial);
    textMesh.position.z = 0.02;
    buttonGroup.add(textMesh);

    // Add subtle pulsing animation to the border - same as details button
    const pulseData = { intensity: borderMaterial.emissiveIntensity };
    gsap.to(pulseData, {
      intensity: 1.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      onUpdate: () => {
        borderMaterial.emissiveIntensity = pulseData.intensity;
      },
    });

    return buttonGroup;
  }

  // Commented out - External details button no longer needed
  // createDetailsButton() {
  //   const buttonGroup = new THREE.Group();

  //   // Button background
  //   const buttonGeometry = new THREE.PlaneGeometry(2.5, 0.8);
  //   const buttonMaterial = new THREE.MeshStandardMaterial({
  //     color: 0x330066,
  //     emissive: 0x330066,
  //     emissiveIntensity: 0.5,
  //     transparent: true,
  //     opacity: 0.8,
  //   });
  //   const buttonBg = new THREE.Mesh(buttonGeometry, buttonMaterial);
  //   buttonGroup.add(buttonBg);

  //   // Button border
  //   const borderGeometry = new THREE.PlaneGeometry(2.7, 1);
  //   const borderMaterial = new THREE.MeshStandardMaterial({
  //     color: 0xff00ff,
  //     emissive: 0xff00ff,
  //     emissiveIntensity: 0.8,
  //     transparent: true,
  //     opacity: 0.6,
  //   });
  //   const border = new THREE.Mesh(borderGeometry, borderMaterial);
  //   border.position.z = -0.01;
  //   buttonGroup.add(border);

  //   // Button text "DETAILS"
  //   const canvas = document.createElement("canvas");
  //   canvas.width = 256;
  //   canvas.height = 128;
  //   const context = canvas.getContext("2d");

  //   context.fillStyle = "#001122";
  //   context.fillRect(0, 0, canvas.width, canvas.height);

  //   context.fillStyle = "#ff00ff";
  //   context.font = "bold 36px Arial";
  //   context.textAlign = "center";
  //   context.textBaseline = "middle";
  //   context.fillText("DETAILS", canvas.width / 2, canvas.height / 2);

  //   context.shadowColor = "#ff00ff";
  //   context.shadowBlur = 8;
  //   context.fillText("DETAILS", canvas.width / 2, canvas.height / 2);

  //   const textTexture = new THREE.CanvasTexture(canvas);
  //   const textMaterial = new THREE.MeshBasicMaterial({
  //     map: textTexture,
  //     transparent: true,
  //     opacity: 1.0,
  //   });
  //   const textMesh = new THREE.Mesh(buttonGeometry, textMaterial);
  //   textMesh.position.z = 0.02;
  //   buttonGroup.add(textMesh);

  //   return buttonGroup;
  // }

  createInternalDetailsButton(screenIndex) {
    const buttonGroup = new THREE.Group();

    // Button background - same size as back button
    const buttonGeometry = new THREE.PlaneGeometry(2.8, 0.6);
    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: 0x004466,
      emissive: 0x004466,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9,
    });
    const buttonBg = new THREE.Mesh(buttonGeometry, buttonMaterial);
    buttonGroup.add(buttonBg);

    // Button border with animated glow
    const borderGeometry = new THREE.PlaneGeometry(3.0, 0.8);
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.7,
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.01;
    buttonGroup.add(border);

    // Button text "LIHAT DETAIL"
    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 60;
    const context = canvas.getContext("2d");

    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#00ffff";
    context.font = "bold 20px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("LIHAT DETAIL", canvas.width / 2, canvas.height / 2);

    context.shadowColor = "#00ffff";
    context.shadowBlur = 6;
    context.fillText("LIHAT DETAIL", canvas.width / 2, canvas.height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 1.0,
    });
    const textMesh = new THREE.Mesh(buttonGeometry, textMaterial);
    textMesh.position.z = 0.02;
    buttonGroup.add(textMesh);

    // Add subtle pulsing animation to the border - same as back button
    const pulseData = { intensity: borderMaterial.emissiveIntensity };
    gsap.to(pulseData, {
      intensity: 1.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      onUpdate: () => {
        borderMaterial.emissiveIntensity = pulseData.intensity;
      },
    });

    return buttonGroup;
  }

  createHologramProjector() {
    const projectorGroup = new THREE.Group();

    // Main projector base - cylindrical shape
    const baseGeometry = new THREE.CylinderGeometry(1.5, 2, 1.5, 8);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      emissive: 0x001122,
      emissiveIntensity: 0.3,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.75;
    projectorGroup.add(base);

    // Projector lens/emitter
    const lensGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const lensMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.8,
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.y = 1.8;
    projectorGroup.add(lens);

    // Support pillars
    for (let i = 0; i < 4; i++) {
      const pillarGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
      const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        emissive: 0x00ffff,
        emissiveIntensity: 0.2,
      });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);

      const angle = (i / 4) * Math.PI * 2;
      pillar.position.set(Math.cos(angle) * 1.2, 0.75, Math.sin(angle) * 1.2);
      projectorGroup.add(pillar);
    }

    // Floating energy rings around lens
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(
        1 + i * 0.3,
        1.1 + i * 0.3,
        16
      );
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = 1.8 + i * 0.2;
      ring.rotation.x = Math.PI / 2;
      projectorGroup.add(ring);

      // Animate rings
      gsap.to(ring.rotation, {
        z: Math.PI * 2,
        duration: 3 + i,
        repeat: -1,
        ease: "none",
      });
    }

    return projectorGroup;
  }

  createSmallHologramBeam(fromPos, toPos) {
    // Create medium height beam with multiple segments that fade from bottom to top
    const beamHeight = 4; // Slightly shorter beam - reduced from 5 to 4 units
    const segments = 8; // Good number of segments for smooth effect
    const segmentHeight = beamHeight / segments;

    for (let i = 0; i < segments; i++) {
      // Calculate fade based on height - bottom bright, top faded
      const fadeRatio = 1 - i / segments; // 1.0 at bottom, 0.0 at top
      const bottomRadius = 0.12 + i * 0.18; // Moderate radius expansion for balanced beam
      const topRadius = 0.12 + (i + 1) * 0.18;

      const segmentGeometry = new THREE.CylinderGeometry(
        topRadius,
        bottomRadius,
        segmentHeight,
        8
      );
      const segmentMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.4 * fadeRatio, // Fade emissive intensity
        transparent: true,
        opacity: 0.3 * fadeRatio, // Fade opacity
      });

      const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);

      // Position each segment
      segment.position.set(
        fromPos.x,
        fromPos.y + 1.9 + i * segmentHeight + segmentHeight / 2, // Stack segments at moderate height
        fromPos.z
      );

      this.scene.add(segment);

      // Animate each segment with varying intensity based on height using object wrapper
      const segmentData = {
        opacity: segment.material.opacity,
        intensity: segment.material.emissiveIntensity,
      };
      gsap.to(segmentData, {
        opacity: 0.1 * fadeRatio,
        intensity: 0.2 * fadeRatio,
        duration: 1.5 + i * 0.2, // Slightly different timing for each segment
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1, // Staggered animation
        onUpdate: () => {
          segment.material.opacity = segmentData.opacity;
          segment.material.emissiveIntensity = segmentData.intensity;
        },
      });

      // Add subtle scale animation
      gsap.to(segment.scale, {
        x: 1.1 + i * 0.1,
        z: 1.1 + i * 0.1,
        duration: 2 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.15,
      });
    }
  }

  createYesNoButton(text, color, x, y) {
    const buttonGroup = new THREE.Group();

    // Create canvas for button text
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext("2d");

    // Clear canvas
    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw button text
    context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
    context.font = "bold 24px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Add glow effect
    context.shadowColor = `#${color.toString(16).padStart(6, "0")}`;
    context.shadowBlur = 8;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create button texture
    const buttonTexture = new THREE.CanvasTexture(canvas);
    buttonTexture.needsUpdate = true;

    // Button background
    const buttonBgGeometry = new THREE.PlaneGeometry(1.5, 0.6); // Made larger
    const buttonBgMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const buttonBg = new THREE.Mesh(buttonBgGeometry, buttonBgMaterial);
    buttonGroup.add(buttonBg);

    // Button text plane
    const buttonTextGeometry = new THREE.PlaneGeometry(1.5, 0.6); // Made larger
    const buttonTextMaterial = new THREE.MeshBasicMaterial({
      map: buttonTexture,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
    });
    const buttonTextMesh = new THREE.Mesh(
      buttonTextGeometry,
      buttonTextMaterial
    );
    buttonTextMesh.position.z = 0.01;
    buttonGroup.add(buttonTextMesh);

    // Button border
    const borderGeometry = new THREE.PlaneGeometry(1.7, 0.8); // Made larger
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.5,
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.01;
    buttonGroup.add(border);

    // Add invisible collision box for easier clicking
    const collisionGeometry = new THREE.PlaneGeometry(2.0, 1.0); // Even larger for easier clicking
    const collisionMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const collisionMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
    collisionMesh.position.z = 0.02; // In front for raycasting
    buttonGroup.add(collisionMesh);

    // Position button
    buttonGroup.position.set(x, y, 0);

    // Store materials for animation
    buttonGroup.userData = {
      bgMaterial: buttonBgMaterial,
      borderMaterial: borderMaterial,
      textMaterial: buttonTextMaterial,
    };

    return buttonGroup;
  }

  createRobotHelpText() {
    const textGroup = new THREE.Group();

    // Create canvas for text
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");

    // Clear canvas with transparent background
    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw main text "Need Help?"
    context.fillStyle = "#00ffff";
    context.font = "bold 36px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Need Help?", canvas.width / 2, canvas.height / 2);

    // Add glow effect
    context.shadowColor = "#00ffff";
    context.shadowBlur = 15;
    context.fillText("Need Help?", canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.needsUpdate = true;

    // Create text plane
    const textGeometry = new THREE.PlaneGeometry(4, 1);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGroup.add(textMesh);

    // Create Yes button (initially hidden)
    const yesButton = this.createYesNoButton("YES", 0x00ff00, -2.0, -1.5); // More spread out
    yesButton.userData = { isYesButton: true, buttonType: "yes" }; // Add buttonType for easier detection
    yesButton.visible = false; // Hidden by default
    yesButton.name = "YesButton"; // Add name for easier identification
    textGroup.add(yesButton);

    // Create No button (initially hidden)
    const noButton = this.createYesNoButton("NO", 0xff0000, 2.0, -1.5); // More spread out
    noButton.userData = { isNoButton: true, buttonType: "no" }; // Add buttonType for easier detection
    noButton.visible = false; // Hidden by default
    noButton.name = "NoButton"; // Add name for easier identification
    textGroup.add(noButton);

    // Create background panel for better visibility
    const bgGeometry = new THREE.PlaneGeometry(4.5, 1.2);
    const bgMaterial = new THREE.MeshStandardMaterial({
      color: 0x001122,
      emissive: 0x002244,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.4,
    });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.z = -0.01; // Behind text
    textGroup.add(bgMesh);

    // Create border frame
    const borderGeometry = new THREE.PlaneGeometry(4.8, 1.4);
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.2,
    });
    const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
    borderMesh.position.z = -0.02; // Behind background
    textGroup.add(borderMesh);

    // Add floating particles around text
    for (let i = 0; i < 8; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const particleMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.8,
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);

      const angle = (i / 8) * Math.PI * 2;
      particle.position.set(
        Math.cos(angle) * 2.5 + (Math.random() - 0.5) * 0.5,
        Math.sin(angle) * 0.8 + (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.2
      );
      textGroup.add(particle);

      // Animate particles
      gsap.to(particle.position, {
        x: particle.position.x + (Math.random() - 0.5) * 1,
        y: particle.position.y + (Math.random() - 0.5) * 0.5,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Store references for animation
    textGroup.userData = {
      textMaterial: textMaterial,
      bgMaterial: bgMaterial,
      borderMaterial: borderMaterial,
      yesButton: yesButton,
      noButton: noButton,
    };

    return textGroup;
  }

  createRobot() {
    const robotGroup = new THREE.Group();

    // Robot Body (Main Torso) - More futuristic design
    const bodyGeometry = new THREE.BoxGeometry(1.4, 2.2, 1.0);
    bodyGeometry.scale(1, 1, 0.8); // Make it sleeker
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      emissive: 0x0099ff,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2.8;
    body.castShadow = true;
    robotGroup.add(body);

    // Chest Core (Glowing energy core)
    const coreGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 0.8,
    });
    const chestCore = new THREE.Mesh(coreGeometry, coreMaterial);
    chestCore.position.set(0, 2.8, 0.4);
    robotGroup.add(chestCore);

    // Robot Head - More angular and futuristic, aligned with body
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    // Remove the scaling to keep head aligned with body
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f3460,
      emissive: 0x0066ff,
      emissiveIntensity: 0.6,
      metalness: 0.95,
      roughness: 0.05,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 4.5;
    head.castShadow = true;
    robotGroup.add(head);

    // Robot Eyes (Scanning lines effect)
    const eyeGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0066,
      emissive: 0xff0066,
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 1.0,
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.25, 4.6, 0.5);
    leftEye.rotation.x = Math.PI / 2;
    robotGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.25, 4.6, 0.5);
    rightEye.rotation.x = Math.PI / 2;
    robotGroup.add(rightEye);

    // Robot Arms - More mechanical and futuristic
    const shoulderGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    const shoulderMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      emissive: 0x004488,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
    });

    const armGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1.8, 8);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      emissive: 0x0044aa,
      emissiveIntensity: 0.4,
      metalness: 0.7,
      roughness: 0.3,
    });

    // Left Shoulder
    const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
    leftShoulder.position.set(-0.9, 3.5, 0);
    robotGroup.add(leftShoulder);

    // Left Arm
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.9, 2.4, 0);
    leftArm.castShadow = true;
    robotGroup.add(leftArm);

    // Right Shoulder
    const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
    rightShoulder.position.set(0.9, 3.5, 0);
    robotGroup.add(rightShoulder);

    // Right Arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.9, 2.4, 0);
    rightArm.castShadow = true;
    robotGroup.add(rightArm);

    // Robot Hands - Claw-like
    const handGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const handMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      emissive: 0x00aaff,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
    });

    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-0.9, 1.5, 0);
    robotGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(0.9, 1.5, 0);
    robotGroup.add(rightHand);

    // ===== WHEELS SECTION (Replace legs) =====

    // Wheel Base/Platform
    const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      emissive: 0x0066aa,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
    });
    const wheelBase = new THREE.Mesh(baseGeometry, baseMaterial);
    wheelBase.position.y = 0.5;
    wheelBase.castShadow = true;
    robotGroup.add(wheelBase);

    // Main Wheels (3 wheels for stability)
    // Create wheel geometry with correct orientation (wider than tall for wheel shape)
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      emissive: 0x00ffaa,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
    });

    const wheels = [];
    const wheelPositions = [
      { x: 0, z: 0.8 }, // Front wheel
      { x: -0.7, z: -0.4 }, // Back left wheel
      { x: 0.7, z: -0.4 }, // Back right wheel
    ];

    wheelPositions.forEach((pos, index) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial.clone());
      wheel.position.set(pos.x, 0.15, pos.z);
      // Rotate wheel to correct orientation (Z-axis forward)
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      robotGroup.add(wheel);
      wheels.push(wheel);

      // Add wheel rim details
      const rimGeometry = new THREE.TorusGeometry(0.35, 0.05, 8, 16);
      const rimMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.0,
        metalness: 1.0,
        roughness: 0.0,
      });
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.position.set(pos.x, 0.15, pos.z);
      // Rotate rim to match wheel orientation
      rim.rotation.z = Math.PI / 2;
      robotGroup.add(rim);
    });

    // Hover Effect Emitters (under the base)
    for (let i = 0; i < 6; i++) {
      const emitterGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.1, 6);
      const emitterMaterial = new THREE.MeshStandardMaterial({
        color: 0x0099ff,
        emissive: 0x0099ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
      });
      const emitter = new THREE.Mesh(emitterGeometry, emitterMaterial);

      const angle = (i / 6) * Math.PI * 2;
      emitter.position.set(Math.cos(angle) * 0.8, 0.2, Math.sin(angle) * 0.8);
      robotGroup.add(emitter);
    }

    // Antenna Array - More futuristic
    const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.08, 1.2, 6);
    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.9,
    });

    // Create antenna array
    const antennaPositions = [
      { x: -0.3, z: 0.2 },
      { x: 0, z: 0.3 },
      { x: 0.3, z: 0.2 },
    ];

    const antennas = [];
    antennaPositions.forEach((pos, index) => {
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial.clone());
      antenna.position.set(pos.x, 5.2, pos.z);
      robotGroup.add(antenna);
      antennas.push(antenna);

      // Antenna tip (glowing orb)
      const tipGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const tipMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0099,
        emissive: 0xff0099,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
      });
      const tip = new THREE.Mesh(tipGeometry, tipMaterial);
      tip.position.set(pos.x, 5.8, pos.z);
      robotGroup.add(tip);
    });

    // Hologram Text "Need Help?" above robot head
    const helpTextGroup = this.createRobotHelpText();
    helpTextGroup.position.set(0, 6.5, 0); // Above antennas
    robotGroup.add(helpTextGroup);

    // Position robot in scene (starting position) - Find safe position
    const safeStartPosition = this.findValidPosition(-25, 20);
    robotGroup.position.set(safeStartPosition.x, 0, safeStartPosition.z);

    // Store robot parts for animation
    robotGroup.userData = {
      leftArm: leftArm,
      rightArm: rightArm,
      leftShoulder: leftShoulder,
      rightShoulder: rightShoulder,
      head: head,
      eyes: [leftEye, rightEye],
      antennas: antennas,
      chestCore: chestCore,
      wheels: wheels,
      wheelBase: wheelBase,
      helpText: helpTextGroup,
      isMoving: false,
      targetPosition: { x: safeStartPosition.x, y: 0, z: safeStartPosition.z },
      moveSpeed: 0.03, // Slightly faster for wheel movement
      lastDirectionChange: 0,
    };

    this.scene.add(robotGroup);
    this.objects.robot = robotGroup;

    // Setup robot animations
    this.setupRobotAnimations();
  }

  setupRobotAnimations() {
    if (!this.objects.robot) return;

    const robot = this.objects.robot;
    const userData = robot.userData;

    // Eyes stay static - no animation for cleaner appearance
    // Eyes maintain constant emissive glow without pulsing

    // Antennas stay static - no animation for cleaner appearance
    // Antennas maintain constant emissive glow without movement or pulsing

    // Chest core pulsing (energy core effect)
    gsap.to(userData.chestCore.material, {
      emissiveIntensity: 3.0,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(userData.chestCore.scale, {
      x: 1.1,
      y: 1.1,
      z: 1.1,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Head stays static - no movement for cleaner appearance

    // Wheel base subtle rotation when idle
    gsap.to(userData.wheelBase.rotation, {
      y: Math.PI * 0.1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Shoulder joint movement
    userData.leftShoulder &&
      gsap.to(userData.leftShoulder.rotation, {
        x: 0.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    userData.rightShoulder &&
      gsap.to(userData.rightShoulder.rotation, {
        x: -0.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });

    // Help text animations
    if (userData.helpText) {
      const helpData = userData.helpText.userData;

      // Text pulsing
      gsap.to(helpData.textMaterial, {
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Background glow pulsing
      gsap.to(helpData.bgMaterial, {
        emissiveIntensity: 0.6,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // Border frame animation
      gsap.to(helpData.borderMaterial, {
        emissiveIntensity: 1.2,
        opacity: 0.4,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // Gentle floating animation for the whole text group
      gsap.to(userData.helpText.position, {
        y: 6.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Subtle rotation animation
      gsap.to(userData.helpText.rotation, {
        z: 0.05,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
    }
  }

  updateRobotMovement() {
    if (!this.objects.robot || this.robotInteractionMode) return;

    const robot = this.objects.robot;
    const userData = robot.userData;
    const currentTime = Date.now();

    // Change direction every 3-5 seconds
    if (
      currentTime - userData.lastDirectionChange >
      3000 + Math.random() * 2000
    ) {
      // Find a valid target position that doesn't collide
      const validPosition = this.findValidPosition(
        robot.position.x,
        robot.position.z
      );

      userData.targetPosition = {
        x: validPosition.x,
        y: 0,
        z: validPosition.z,
      };
      userData.lastDirectionChange = currentTime;
      userData.isMoving = true;

      // Start walking animation
      this.startRobotWalkingAnimation();
    }

    // Move towards target
    if (userData.isMoving) {
      const dx = userData.targetPosition.x - robot.position.x;
      const dz = userData.targetPosition.z - robot.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > 1) {
        // Normalize and apply movement
        const moveX = (dx / distance) * userData.moveSpeed;
        const moveZ = (dz / distance) * userData.moveSpeed;

        // Calculate next position
        const nextX = robot.position.x + moveX;
        const nextZ = robot.position.z + moveZ;

        // Check for collision before moving
        if (!this.checkCollision(nextX, nextZ)) {
          // Store previous position for wheel rotation calculation
          const prevX = robot.position.x;
          const prevZ = robot.position.z;

          robot.position.x = nextX;
          robot.position.z = nextZ;

          // Calculate wheel rotation based on actual movement
          const actualMoveX = robot.position.x - prevX;
          const actualMoveZ = robot.position.z - prevZ;
          const actualDistance = Math.sqrt(
            actualMoveX * actualMoveX + actualMoveZ * actualMoveZ
          );

          // Rotate wheels based on distance moved (circumference formula)
          // Use Y-axis rotation since wheels are now rotated to Z-axis orientation
          const wheelRotation = actualDistance / 0.4; // wheel radius is 0.4

          userData.wheels.forEach((wheel) => {
            wheel.rotation.y += wheelRotation;
          });

          // Rotate robot to face movement direction
          const targetRotation = Math.atan2(dx, dz);
          robot.rotation.y = THREE.MathUtils.lerp(
            robot.rotation.y,
            targetRotation,
            0.1
          );
        } else {
          // Collision detected, find new target
          const validPosition = this.findValidPosition(
            robot.position.x,
            robot.position.z
          );
          userData.targetPosition = {
            x: validPosition.x,
            y: 0,
            z: validPosition.z,
          };
        }
      } else {
        // Reached target, stop moving
        userData.isMoving = false;
        this.stopRobotWalkingAnimation();
      }
    }
  }

  startRobotWalkingAnimation() {
    if (!this.objects.robot) return;

    const userData = this.objects.robot.userData;

    // Note: Wheel spinning is now handled dynamically in updateRobotMovement()
    // based on actual robot movement distance

    // Arm mechanical movement during rolling
    gsap.to(userData.leftArm.rotation, {
      x: 0.3,
      z: 0.1,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(userData.rightArm.rotation, {
      x: -0.3,
      z: -0.1,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.6,
    });

    // Shoulder compensating movement
    userData.leftShoulder &&
      gsap.to(userData.leftShoulder.rotation, {
        y: 0.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    userData.rightShoulder &&
      gsap.to(userData.rightShoulder.rotation, {
        y: -0.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.75,
      });

    // Body slight lean during movement
    gsap.to(this.objects.robot.rotation, {
      x: 0.05,
      duration: 1.0,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Wheel base stabilization
    gsap.to(userData.wheelBase.rotation, {
      x: 0.02,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Enhanced energy core during movement
    gsap.to(userData.chestCore.material, {
      emissiveIntensity: 4.0,
      duration: 0.4,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    // Head stays static during walking - no tracking movement
  }

  stopRobotWalkingAnimation() {
    if (!this.objects.robot) return;

    const userData = this.objects.robot.userData;

    // Stop all movement animations
    userData.wheels.forEach((wheel) => {
      gsap.killTweensOf(wheel.rotation);
    });

    gsap.killTweensOf(userData.leftArm.rotation);
    gsap.killTweensOf(userData.rightArm.rotation);
    userData.leftShoulder && gsap.killTweensOf(userData.leftShoulder.rotation);
    userData.rightShoulder &&
      gsap.killTweensOf(userData.rightShoulder.rotation);
    gsap.killTweensOf(this.objects.robot.rotation);
    gsap.killTweensOf(userData.wheelBase.rotation);
    gsap.killTweensOf(userData.head.rotation);

    // Return to neutral positions
    gsap.to(userData.leftArm.rotation, {
      x: 0,
      z: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    gsap.to(userData.rightArm.rotation, {
      x: 0,
      z: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    userData.leftShoulder &&
      gsap.to(userData.leftShoulder.rotation, {
        x: 0.2,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

    userData.rightShoulder &&
      gsap.to(userData.rightShoulder.rotation, {
        x: -0.2,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

    gsap.to(this.objects.robot.rotation, {
      x: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    // Return chest core to normal intensity
    gsap.to(userData.chestCore.material, {
      emissiveIntensity: 2.0,
      duration: 1.0,
      ease: "power2.out",
    });

    // Return head to normal position and keep it static
    gsap.to(userData.head.rotation, {
      x: 0,
      y: 0, // Also reset Y rotation to face forward
      duration: 0.8,
      ease: "back.out(1.7)",
      // No restart of looking animation - head stays static
    });

    // Return wheel base to subtle idle rotation
    gsap.to(userData.wheelBase.rotation, {
      x: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(userData.wheelBase.rotation, {
          y: Math.PI * 0.1,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      },
    });
  }

  checkCollision(x, z, robotRadius = 2) {
    // Check collision with obstacles
    for (let obstacle of this.obstacles) {
      const obstacleLeft = obstacle.x - obstacle.width / 2;
      const obstacleRight = obstacle.x + obstacle.width / 2;
      const obstacleTop = obstacle.z - obstacle.depth / 2;
      const obstacleBottom = obstacle.z + obstacle.depth / 2;

      // Check if robot (with radius) would intersect with obstacle
      if (
        x + robotRadius > obstacleLeft &&
        x - robotRadius < obstacleRight &&
        z + robotRadius > obstacleTop &&
        z - robotRadius < obstacleBottom
      ) {
        return true; // Collision detected
      }
    }

    // Check scene boundaries
    const sceneBoundary = 40;
    if (Math.abs(x) > sceneBoundary || Math.abs(z) > sceneBoundary) {
      return true; // Out of bounds
    }

    return false; // No collision
  }

  findValidPosition(currentX, currentZ, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      const x = (Math.random() - 0.5) * 60; // -30 to 30
      const z = (Math.random() - 0.5) * 60; // -30 to 30

      if (!this.checkCollision(x, z)) {
        return { x, z };
      }
    }

    // If no valid position found, return current position
    return { x: currentX, z: currentZ };
  }

  setupAnimations() {
    // Animate particle systems
    this.objects.particleSystems.forEach((system) => {
      gsap.to(system.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    });
  }

  update() {
    // Update any time-based animations here
    if (this.objects.particleSystems.length > 0) {
      this.objects.particleSystems.forEach((system) => {
        const positions = system.geometry.attributes.position.array;

        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += 0.01; // Slowly move particles up

          // Reset particle position if it goes too high
          if (positions[i] > 50) {
            positions[i] = 0;
          }
        }

        system.geometry.attributes.position.needsUpdate = true;
      });
    }

    // Update robot movement
    this.updateRobotMovement();
  }

  applyPerformanceSettings(settings) {
    // Adjust visual quality based on performance
    if (!settings.particles && this.objects.particleSystems.length > 0) {
      this.objects.particleSystems.forEach((system) => {
        system.visible = false;
      });
    }

    if (!settings.neonEffects && this.objects.neonSigns.length > 0) {
      this.objects.neonSigns.forEach((sign) => {
        if (sign.material) {
          sign.material.emissiveIntensity = 0.2;
        }
      });
    }

    if (!settings.decorations && this.objects.decorations.length > 0) {
      this.objects.decorations.forEach((decoration) => {
        decoration.visible = false;
      });
    }
  }

  // Methods for navigation to different sections
  getHomeViewpoint() {
    return {
      position: { x: -15, y: 8, z: 20 },
      target: { x: 0, y: 2, z: 0 },
    };
  }

  getAboutViewpoint() {
    return {
      position: { x: 0, y: 5, z: 15 },
      target: { x: 0, y: 3, z: 0 },
    };
  }

  getProjectsViewpoint() {
    return {
      position: { x: 0, y: 4, z: 8 },
      target: { x: 0, y: 3, z: -1 },
    };
  }

  getSkillsViewpoint() {
    return {
      position: { x: 10, y: 6, z: 10 },
      target: { x: 0, y: 2, z: 0 },
    };
  }

  getContactViewpoint() {
    return {
      position: { x: -10, y: 6, z: 10 },
      target: { x: 0, y: 2, z: 0 },
    };
  }

  // Get hologram screens for click interaction
  getHologramScreens() {
    return this.objects.hologramScreens;
  }

  // Update active hologram screen to follow camera
  updateActiveHologram(screenIndex, cameraPosition) {
    if (screenIndex >= 0 && screenIndex < this.objects.hologramScreens.length) {
      const hologramScreen = this.objects.hologramScreens[screenIndex];

      // Calculate direction from hologram to camera
      const hologramPosition = hologramScreen.position.clone();
      const direction = new THREE.Vector3();
      direction.subVectors(cameraPosition, hologramPosition);
      direction.y = 0; // Only rotate on Y axis (horizontal rotation)
      direction.normalize();

      // Calculate rotation angle to face camera
      const targetRotationY = Math.atan2(direction.x, direction.z);

      // Smooth rotation using GSAP with faster animation
      gsap.to(hologramScreen.rotation, {
        y: targetRotationY,
        duration: 0.05,
        ease: "none",
        overwrite: true, // Prevent animation conflicts
      });

      // Debug log (can be removed later)
      // console.log(`Hologram ${screenIndex} rotating to face camera: ${targetRotationY.toFixed(2)} rad`);
    }
  }

  // Show back button on hologram screen (now handled by showHologramContent)
  showBackButton(screenIndex) {
    // This function is now deprecated as buttons are shown via showHologramContent
    // Keeping for compatibility but functionality moved to showHologramContent
  }

  // Hide back button on hologram screen (now handled by hideHologramContent)
  hideBackButton(screenIndex) {
    // This function is now deprecated as buttons are hidden via hideHologramContent
    // Keeping for compatibility but functionality moved to hideHologramContent
  }

  // Hide all back buttons
  hideAllBackButtons() {
    for (let i = 0; i < this.objects.hologramScreens.length; i++) {
      this.hideBackButton(i);
    }
  }

  // Show subtitle and preview content when screen is focused
  showHologramContent(screenIndex) {
    if (screenIndex >= 0 && screenIndex < this.objects.hologramScreens.length) {
      const hologramScreen = this.objects.hologramScreens[screenIndex];
      const textGroup = hologramScreen.userData.textGroup;
      const backButton = hologramScreen.userData.backButton;
      const internalDetailsButton =
        hologramScreen.userData.internalDetailsButton;

      if (textGroup && textGroup.userData) {
        const {
          titleMesh,
          subtitleMesh,
          previewMesh,
          subtitleMaterial,
          previewMaterial,
        } = textGroup.userData;

        // Animate title to top position
        gsap.to(titleMesh.position, {
          y: 1.5,
          duration: 0.5,
          ease: "power2.out",
        });

        // Show and animate subtitle
        if (subtitleMesh) {
          subtitleMesh.visible = true;
          gsap.fromTo(
            subtitleMaterial,
            { opacity: 0 },
            { opacity: 0.8, duration: 0.5, delay: 0.2 }
          );
          gsap.fromTo(
            subtitleMesh.scale,
            { x: 0.8, y: 0.8, z: 0.8 },
            {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.5,
              delay: 0.2,
              ease: "back.out(1.7)",
            }
          );
        }

        // Show and animate preview
        if (previewMesh) {
          previewMesh.visible = true;
          gsap.fromTo(
            previewMaterial,
            { opacity: 0 },
            { opacity: 0.9, duration: 0.5, delay: 0.4 }
          );
          gsap.fromTo(
            previewMesh.scale,
            { x: 0.8, y: 0.8, z: 0.8 },
            {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.5,
              delay: 0.4,
              ease: "back.out(1.7)",
            }
          );
        }
      }

      // Show and animate back button
      if (backButton) {
        backButton.visible = true;
        gsap.fromTo(
          backButton.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            delay: 0.6,
            ease: "back.out(1.7)",
          }
        );
      }

      // Show and animate internal details button
      if (internalDetailsButton) {
        internalDetailsButton.visible = true;
        gsap.fromTo(
          internalDetailsButton.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            delay: 0.8,
            ease: "back.out(1.7)",
          }
        );
      }
    }
  }

  // Hide subtitle and preview content when screen is unfocused
  hideHologramContent(screenIndex) {
    if (screenIndex >= 0 && screenIndex < this.objects.hologramScreens.length) {
      const hologramScreen = this.objects.hologramScreens[screenIndex];
      const textGroup = hologramScreen.userData.textGroup;
      const backButton = hologramScreen.userData.backButton;
      const internalDetailsButton =
        hologramScreen.userData.internalDetailsButton;

      if (textGroup && textGroup.userData) {
        const {
          titleMesh,
          subtitleMesh,
          previewMesh,
          subtitleMaterial,
          previewMaterial,
        } = textGroup.userData;

        // Animate title back to center
        gsap.to(titleMesh.position, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        // Hide subtitle
        if (subtitleMesh && subtitleMaterial) {
          gsap.to(subtitleMaterial, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              subtitleMesh.visible = false;
            },
          });
        }

        // Hide preview
        if (previewMesh && previewMaterial) {
          gsap.to(previewMaterial, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              previewMesh.visible = false;
            },
          });
        }
      }

      // Hide back button
      if (backButton) {
        gsap.to(backButton.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            backButton.visible = false;
          },
        });
      }

      // Hide internal details button
      if (internalDetailsButton) {
        gsap.to(internalDetailsButton.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            internalDetailsButton.visible = false;
          },
        });
      }
    }
  }

  // Hide all hologram content
  hideAllHologramContent() {
    for (let i = 0; i < this.objects.hologramScreens.length; i++) {
      this.hideHologramContent(i);
    }
  }

  // Get back buttons for click detection
  getBackButtons() {
    const backButtons = [];
    this.objects.hologramScreens.forEach((screen, index) => {
      if (screen.userData.backButton) {
        backButtons.push({
          button: screen.userData.backButton,
          screenIndex: index,
        });
      }
    });
    return backButtons;
  }

  // Commented out - External details buttons no longer needed
  // getDetailsButtons() {
  //   const detailsButtons = [];
  //   this.objects.hologramScreens.forEach((screen, index) => {
  //     if (screen.userData.detailsButton) {
  //       detailsButtons.push({
  //         button: screen.userData.detailsButton,
  //         screenIndex: index,
  //       });
  //     }
  //   });
  //   return detailsButtons;
  // }

  // Get internal details buttons for click detection
  getInternalDetailsButtons() {
    const internalDetailsButtons = [];
    this.objects.hologramScreens.forEach((screen, index) => {
      if (screen.userData.internalDetailsButton) {
        internalDetailsButtons.push({
          button: screen.userData.internalDetailsButton,
          screenIndex: index,
        });
      }
    });
    return internalDetailsButtons;
  }

  // Get robot Yes/No buttons for click detection
  getRobotButtons() {
    const robotButtons = [];
    console.log("getRobotButtons called");

    if (this.objects.robot && this.objects.robot.userData.helpText) {
      const helpText = this.objects.robot.userData.helpText;
      console.log("Help text found:", helpText);
      console.log("Help text userData:", helpText.userData);

      if (helpText.userData.yesButton && helpText.userData.noButton) {
        console.log("Yes/No buttons found in userData");
        robotButtons.push({
          button: helpText.userData.yesButton,
          type: "yes",
        });
        robotButtons.push({
          button: helpText.userData.noButton,
          type: "no",
        });
      } else {
        console.log("Yes/No buttons NOT found in userData");
      }
    } else {
      console.log("Robot or helpText not found");
    }

    console.log("Returning robotButtons:", robotButtons.length);
    return robotButtons;
  }

  // Reset hologram screen to face cyberpunk office (default orientation)
  resetHologramOrientation(screenIndex) {
    if (screenIndex >= 0 && screenIndex < this.objects.hologramScreens.length) {
      const hologramScreen = this.objects.hologramScreens[screenIndex];

      // Reset to face the center of the office (0, 0, 0)
      const hologramPosition = hologramScreen.position.clone();
      const officeCenter = new THREE.Vector3(0, 0, 0);
      const direction = new THREE.Vector3();
      direction.subVectors(officeCenter, hologramPosition);
      direction.y = 0; // Only rotate on Y axis
      direction.normalize();

      // Calculate rotation angle to face office center
      const defaultRotationY = Math.atan2(direction.x, direction.z);

      // Smooth rotation back to default
      gsap.to(hologramScreen.rotation, {
        y: defaultRotationY,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }

  // Set hologram to immediately face camera (for first click)
  setHologramFaceCamera(screenIndex, cameraPosition) {
    if (screenIndex >= 0 && screenIndex < this.objects.hologramScreens.length) {
      const hologramScreen = this.objects.hologramScreens[screenIndex];

      // Calculate direction from hologram to camera
      const hologramPosition = hologramScreen.position.clone();
      const direction = new THREE.Vector3();
      direction.subVectors(cameraPosition, hologramPosition);
      direction.y = 0; // Only rotate on Y axis
      direction.normalize();

      // Calculate rotation angle to face camera
      const targetRotationY = Math.atan2(direction.x, direction.z);

      // Check if this is for continuous tracking (small rotation difference)
      const currentRotation = hologramScreen.rotation.y;
      const rotationDiff = Math.abs(targetRotationY - currentRotation);

      if (rotationDiff < 0.1) {
        // Small difference - apply immediately for smooth tracking
        hologramScreen.rotation.y = targetRotationY;
      } else {
        // Larger difference - use animation for smooth transition
        gsap.to(hologramScreen.rotation, {
          y: targetRotationY,
          duration: 0.1,
          ease: "power1.out",
          overwrite: true,
        });
      }
    }
  }

  // Robot interaction functions
  activateRobotHelpMode(camera, controls) {
    if (this.robotInteractionMode || !this.objects.robot) return;

    this.robotInteractionMode = true;
    this.robotHelpModeStartTime = Date.now(); // Add timestamp

    // Store original camera state
    this.originalCameraPosition = camera.position.clone();
    this.originalCameraTarget = controls.target.clone();

    // Stop robot movement
    this.objects.robot.userData.isMoving = false;
    this.stopRobotWalkingAnimation();

    // Show Yes/No buttons
    const helpText = this.objects.robot.userData.helpText;
    if (helpText) {
      helpText.userData.yesButton.visible = true;
      helpText.userData.noButton.visible = true;
    }

    // Focus camera on robot head + text area
    const robotPos = this.objects.robot.position;
    const targetPos = new THREE.Vector3(robotPos.x, robotPos.y + 5, robotPos.z);
    const cameraPos = new THREE.Vector3(
      robotPos.x + 8,
      robotPos.y + 5,
      robotPos.z + 8
    );

    // Animate camera
    gsap.to(camera.position, {
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to(controls.target, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 2,
      ease: "power2.inOut",
    });

    // Update controls
    controls.update();
  }

  deactivateRobotHelpMode(camera, controls) {
    if (!this.robotInteractionMode) return;

    this.robotInteractionMode = false;
    this.robotHelpModeStartTime = null; // Clear timestamp

    // Hide Yes/No buttons
    const helpText = this.objects.robot.userData.helpText;
    if (helpText) {
      helpText.userData.yesButton.visible = false;
      helpText.userData.noButton.visible = false;
    }

    // Restore original camera
    if (this.originalCameraPosition && this.originalCameraTarget) {
      gsap.to(camera.position, {
        x: this.originalCameraPosition.x,
        y: this.originalCameraPosition.y,
        z: this.originalCameraPosition.z,
        duration: 2,
        ease: "power2.inOut",
      });

      gsap.to(controls.target, {
        x: this.originalCameraTarget.x,
        y: this.originalCameraTarget.y,
        z: this.originalCameraTarget.z,
        duration: 2,
        ease: "power2.inOut",
      });
    }

    // Resume robot movement
    if (this.objects.robot.userData) {
      const userData = this.objects.robot.userData;
      userData.lastDirectionChange = 0; // Reset timer to trigger immediate direction change
      userData.isMoving = false; // Reset movement state

      // Reset robot rotation to face forward (not camera)
      gsap.to(this.objects.robot.rotation, {
        y: 0, // Face forward
        duration: 1,
        ease: "power2.out",
      });

      // Force immediate movement by triggering new direction
      setTimeout(() => {
        if (!this.robotInteractionMode) {
          // Only if still not in interaction mode
          userData.lastDirectionChange = Date.now() - 4000; // Force direction change on next update
        }
      }, 100);
    }

    controls.update();
  }

  updateRobotFaceCamera(camera) {
    // Only face camera when in interaction mode AND robot is not moving
    if (
      !this.robotInteractionMode ||
      !this.objects.robot ||
      this.objects.robot.userData.isMoving
    )
      return;

    // Make robot face camera
    const robotPos = this.objects.robot.position;
    const cameraPos = camera.position;
    const direction = new THREE.Vector3()
      .subVectors(cameraPos, robotPos)
      .normalize();

    const targetRotationY = Math.atan2(direction.x, direction.z);

    // Smooth rotation
    gsap.to(this.objects.robot.rotation, {
      y: targetRotationY,
      duration: 0.5,
      ease: "power2.out",
    });
  }

  updatePhoneHologramFaceCamera(camera) {
    // Always try to make hologram face camera if it exists and is visible
    if (this.phoneHologram && this.phoneHologram.visible) {
      // Simple billboard effect - directly set rotation every frame
      const hologramPos = this.phoneHologram.position;
      const cameraPos = camera.position;

      // Calculate angle to face camera
      const dx = cameraPos.x - hologramPos.x;
      const dz = cameraPos.z - hologramPos.z;
      const angle = Math.atan2(dx, dz);

      // Directly set rotation (no animation to avoid conflicts)
      this.phoneHologram.rotation.y = angle;
    }
  }

  showTutorialModal() {
    // Create modal content with detailed instructions
    const tutorialContent = `
      <div style="text-align: left; line-height: 1.8; color: #ffffff;">
        <h2 style="color: #00ffff; margin-bottom: 1.5rem; text-align: center;">📱 How to Use This 3D Portfolio</h2>
        
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(0,255,255,0.1); border-radius: 8px;">
          <strong style="color: #00ff00; font-size: 18px;">�️ Basic Navigation:</strong><br>
          • <strong>Mouse</strong>: Click and drag to rotate camera view<br>
          • <strong>Scroll</strong>: Zoom in/out of the office<br>
          • <strong>Click</strong>: Interactive elements will show pointer cursor
        </div>

        <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,0,255,0.1); border-radius: 8px;">
          <strong style="color: #ff00ff; font-size: 18px;">� Hologram Screens Guide:</strong><br>
          • <span style="color: #00ffff; font-weight: bold;">Click "ABOUT" hologram</span> → View my background and experience<br>
          • <span style="color: #00ffff; font-weight: bold;">Click "PROJECTS" hologram</span> → See my portfolio projects<br>
          • <span style="color: #00ffff; font-weight: bold;">Click "SKILLS" hologram</span> → Technical expertise and tools<br>
          • <span style="color: #00ffff; font-weight: bold;">Click "CONTACT" hologram</span> → Get in touch for collaboration
        </div>

        <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,0,0.1); border-radius: 8px;">
          <strong style="color: #ffff00; font-size: 18px;">⚡ Interactive Features:</strong><br>
          • <strong>"LIHAT DETAIL"</strong> button → View detailed information<br>
          • <strong>"BACK"</strong> button → Return to main view<br>
          • <strong>Robot Helper</strong> → Click me anytime for help!<br>
          • <strong>Auto Focus</strong> → Camera automatically centers on selected content
        </div>

        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(0,255,0,0.1); border-radius: 8px;">
          <strong style="color: #00ff00; font-size: 18px;">� Pro Tips:</strong><br>
          • Explore all 4 hologram screens around the office<br>
          • Each screen has unique content and details<br>
          • Robot moves randomly - click for instant help<br>
          • Use mouse wheel for best viewing angle
        </div>

        <div style="text-align: center; margin-top: 1.5rem; color: #00ffff;">
          <strong>Welcome to my Cyberpunk Office! 🚀</strong>
        </div>
      </div>
    `;

    // Use existing modal system
    if (window.modalManager) {
      window.modalManager.showModal(tutorialContent, "tutorial");
    }
  }
}
