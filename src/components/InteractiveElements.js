import * as THREE from "three";

export default class InteractiveElements {
  constructor(scene) {
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = null;

    this.interactiveObjects = [];
    this.hoveredObject = null;

    this.setupEventListeners();
  }

  setCamera(camera) {
    this.camera = camera;
  }

  setupEventListeners() {
    window.addEventListener("mousemove", (event) => {
      this.onMouseMove(event);
    });

    window.addEventListener("click", (event) => {
      this.onClick(event);
    });
  }

  addInteractiveObject(object, callbacks = {}) {
    const interactiveItem = {
      object: object,
      onHover: callbacks.onHover || null,
      onLeave: callbacks.onLeave || null,
      onClick: callbacks.onClick || null,
      originalMaterial: object.material ? object.material.clone() : null,
    };

    this.interactiveObjects.push(interactiveItem);
    return interactiveItem;
  }

  onMouseMove(event) {
    if (!this.camera) return;

    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get objects that intersect with the ray
    const objects = this.interactiveObjects.map((item) => item.object);
    const intersects = this.raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const interactiveItem = this.interactiveObjects.find(
        (item) =>
          item.object === intersectedObject ||
          item.object.children.includes(intersectedObject)
      );

      if (interactiveItem && this.hoveredObject !== interactiveItem) {
        // Leave previous object
        if (this.hoveredObject && this.hoveredObject.onLeave) {
          this.hoveredObject.onLeave();
        }

        // Enter new object
        this.hoveredObject = interactiveItem;
        document.body.style.cursor = "pointer";

        if (interactiveItem.onHover) {
          interactiveItem.onHover();
        }
      }
    } else {
      // No objects hovered
      if (this.hoveredObject && this.hoveredObject.onLeave) {
        this.hoveredObject.onLeave();
      }

      this.hoveredObject = null;
      document.body.style.cursor = "default";
    }
  }

  onClick(event) {
    if (!this.camera) return;

    // Calculate mouse position
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get objects that intersect with the ray
    const objects = this.interactiveObjects.map((item) => item.object);
    const intersects = this.raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const interactiveItem = this.interactiveObjects.find(
        (item) =>
          item.object === intersectedObject ||
          item.object.children.includes(intersectedObject)
      );

      if (interactiveItem && interactiveItem.onClick) {
        interactiveItem.onClick();
      }
    }
  }

  // Helper methods for common interactions
  createHoverEffect(object, hoverColor = 0x00ffff, originalColor = null) {
    return {
      onHover: () => {
        if (object.material) {
          object.material.emissive.setHex(hoverColor);
          object.material.emissiveIntensity = 0.3;
        }
      },
      onLeave: () => {
        if (object.material) {
          object.material.emissive.setHex(originalColor || 0x000000);
          object.material.emissiveIntensity = 0;
        }
      },
    };
  }

  createClickEffect(callback) {
    return {
      onClick: callback,
    };
  }

  // Method to add portfolio content interactions
  setupPortfolioInteractions(cyberpunkOffice) {
    // All interactive elements (monitors, keyboard, chair) are no longer clickable
    // Removed click functionality to prevent modal popups
  }

  showInfoModal(content) {
    // Create a simple modal overlay
    const modal = document.createElement("div");
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(10px);
        `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
            background: rgba(26, 26, 46, 0.95);
            border: 1px solid #00ffff;
            border-radius: 8px;
            padding: 2rem;
            max-width: 500px;
            color: #fff;
            font-family: 'Rajdhani', sans-serif;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        `;

    modalContent.innerHTML = `
            <h2 style="color: #00ffff; margin-bottom: 1rem; font-family: 'Orbitron', monospace;">
                ${content.title || content.name}
            </h2>
            <p style="margin-bottom: 1rem; line-height: 1.6;">
                ${content.description}
            </p>
            ${
              content.technologies
                ? `
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #ff00ff;">Technologies:</strong>
                    <div style="margin-top: 0.5rem;">
                        ${content.technologies
                          .map(
                            (tech) =>
                              `<span style="background: rgba(0, 255, 255, 0.2); padding: 0.25rem 0.5rem; margin: 0.25rem; border-radius: 4px; display: inline-block; font-size: 0.9rem;">${tech}</span>`
                          )
                          .join("")}
                    </div>
                </div>
            `
                : ""
            }
            ${
              content.experience
                ? `
                <p style="margin-bottom: 0.5rem;"><strong style="color: #ff00ff;">Experience:</strong> ${content.experience}</p>
            `
                : ""
            }
            ${
              content.location
                ? `
                <p style="margin-bottom: 1rem;"><strong style="color: #ff00ff;">Location:</strong> ${content.location}</p>
            `
                : ""
            }
            <button id="close-modal" style="
                background: rgba(0, 255, 255, 0.2);
                border: 1px solid #00ffff;
                color: #00ffff;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-family: 'Rajdhani', sans-serif;
                font-weight: 600;
                margin-top: 1rem;
            ">Close</button>
        `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal handlers
    const closeModal = () => {
      document.body.removeChild(modal);
    };

    document
      .getElementById("close-modal")
      .addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Close with escape key
    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }

  destroy() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("click", this.onClick);
    this.interactiveObjects = [];
    this.hoveredObject = null;
  }
}
