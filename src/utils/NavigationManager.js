import { gsap } from "gsap";

export default class NavigationManager {
  constructor() {
    this.camera = null;
    this.controls = null;
    this.scene = null;

    this.isNavigating = false;
    this.navigationDuration = 2;

    this.viewpoints = {
      home: {
        position: { x: -15, y: 8, z: 20 },
        target: { x: 0, y: 2, z: 0 },
      },
      about: {
        position: { x: 0, y: 5, z: 15 },
        target: { x: 0, y: 3, z: 0 },
      },
      projects: {
        position: { x: 0, y: 4, z: 8 },
        target: { x: 0, y: 3, z: -1 },
      },
      skills: {
        position: { x: 10, y: 6, z: 10 },
        target: { x: 0, y: 2, z: 0 },
      },
      contact: {
        position: { x: -10, y: 6, z: 10 },
        target: { x: 0, y: 2, z: 0 },
      },
    };
  }

  setup(camera, controls, scene) {
    this.camera = camera;
    this.controls = controls;
    this.scene = scene;
  }

  async navigateTo(section) {
    if (this.isNavigating || !this.viewpoints[section]) {
      return;
    }

    this.isNavigating = true;
    const viewpoint = this.viewpoints[section];

    // Disable controls during navigation
    this.controls.enabled = false;

    // Create navigation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        this.isNavigating = false;
        this.controls.enabled = true;

        // Update controls target
        this.controls.target.set(
          viewpoint.target.x,
          viewpoint.target.y,
          viewpoint.target.z
        );

        // Apply section-specific settings
        this.applySectionSettings(section);
      },
    });

    // Animate camera position
    tl.to(this.camera.position, {
      x: viewpoint.position.x,
      y: viewpoint.position.y,
      z: viewpoint.position.z,
      duration: this.navigationDuration,
      ease: "power2.inOut",
    });

    // Animate camera target (controls target)
    tl.to(
      this.controls.target,
      {
        x: viewpoint.target.x,
        y: viewpoint.target.y,
        z: viewpoint.target.z,
        duration: this.navigationDuration,
        ease: "power2.inOut",
      },
      0
    ); // Start at the same time as camera position

    // Add section-specific animations
    this.addSectionTransition(tl, section);

    return tl;
  }

  applySectionSettings(section) {
    switch (section) {
      case "home":
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;
        break;

      case "about":
        this.controls.autoRotate = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 30;
        break;

      case "projects":
        this.controls.autoRotate = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 20;
        break;

      case "skills":
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 25;
        break;

      case "contact":
        this.controls.autoRotate = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 25;
        break;
    }
  }

  addSectionTransition(timeline, section) {
    switch (section) {
      case "home":
        // Add some dramatic lighting changes for home
        this.animateLighting(timeline, { intensity: 1, color: 0x4080ff });
        break;

      case "about":
        // Focus lighting on the desk area
        this.animateLighting(timeline, { intensity: 1.2, color: 0x6060ff });
        break;

      case "projects":
        // Highlight the monitors
        this.animateLighting(timeline, { intensity: 1.5, color: 0x00ffff });
        this.animateMonitors(timeline);
        break;

      case "skills":
        // Emphasize neon signs and decorations
        this.animateLighting(timeline, { intensity: 0.8, color: 0xff00ff });
        this.animateSkillsDisplay(timeline);
        break;

      case "contact":
        // Warm, inviting lighting
        this.animateLighting(timeline, { intensity: 1.1, color: 0x8040ff });
        break;
    }
  }

  animateLighting(timeline, settings) {
    // Find lights in the scene and animate them
    this.scene.traverse((object) => {
      if (object.isDirectionalLight || object.isPointLight) {
        timeline.to(
          object,
          {
            intensity: settings.intensity,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        );

        if (object.color) {
          timeline.to(
            object.color,
            {
              r: ((settings.color >> 16) & 255) / 255,
              g: ((settings.color >> 8) & 255) / 255,
              b: (settings.color & 255) / 255,
              duration: 1,
              ease: "power2.inOut",
            },
            0
          );
        }
      }
    });
  }

  animateMonitors(timeline) {
    // Find monitor screens and create special effects
    this.scene.traverse((object) => {
      if (object.isMesh && object.material && object.material.emissive) {
        if (object.material.color.getHex() === 0x00ffff) {
          // This is likely a monitor screen - use object wrapper for animation
          const materialData = { intensity: object.material.emissiveIntensity };
          timeline.to(
            materialData,
            {
              intensity: 1.5,
              duration: 0.5,
              yoyo: true,
              repeat: 3,
              ease: "power2.inOut",
              onUpdate: () => {
                object.material.emissiveIntensity = materialData.intensity;
              },
            },
            0.5
          );
        }
      }
    });
  }

  animateSkillsDisplay(timeline) {
    // Animate decorative elements for skills section
    this.scene.traverse((object) => {
      if (object.isMesh && object.material && object.material.transparent) {
        // Animate floating decorations
        timeline.to(
          object.rotation,
          {
            x: object.rotation.x + Math.PI * 2,
            y: object.rotation.y + Math.PI * 2,
            duration: 2,
            ease: "power1.inOut",
          },
          0
        );

        timeline.to(
          object.material,
          {
            opacity: 1,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        );
      }
    });
  }

  // Method to smoothly transition between any two viewpoints
  customTransition(fromViewpoint, toViewpoint, duration = 2) {
    if (this.isNavigating) return;

    this.isNavigating = true;
    this.controls.enabled = false;

    const tl = gsap.timeline({
      onComplete: () => {
        this.isNavigating = false;
        this.controls.enabled = true;
        this.controls.target.set(
          toViewpoint.target.x,
          toViewpoint.target.y,
          toViewpoint.target.z
        );
      },
    });

    tl.to(this.camera.position, {
      x: toViewpoint.position.x,
      y: toViewpoint.position.y,
      z: toViewpoint.position.z,
      duration: duration,
      ease: "power2.inOut",
    });

    tl.to(
      this.controls.target,
      {
        x: toViewpoint.target.x,
        y: toViewpoint.target.y,
        z: toViewpoint.target.z,
        duration: duration,
        ease: "power2.inOut",
      },
      0
    );

    return tl;
  }

  // Method to add custom viewpoints
  addViewpoint(name, position, target) {
    this.viewpoints[name] = {
      position: { ...position },
      target: { ...target },
    };
  }

  // Method to get current viewpoint
  getCurrentViewpoint() {
    return {
      position: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      },
      target: {
        x: this.controls.target.x,
        y: this.controls.target.y,
        z: this.controls.target.z,
      },
    };
  }

  // Method to quickly snap to a viewpoint without animation
  snapTo(section) {
    if (!this.viewpoints[section]) return;

    const viewpoint = this.viewpoints[section];

    this.camera.position.set(
      viewpoint.position.x,
      viewpoint.position.y,
      viewpoint.position.z
    );

    this.controls.target.set(
      viewpoint.target.x,
      viewpoint.target.y,
      viewpoint.target.z
    );

    this.applySectionSettings(section);
    this.controls.update();
  }
}
