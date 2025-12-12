export default class PerformanceManager {
  constructor() {
    this.fps = 60;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.maxHistoryLength = 60; // Track last 60 frames

    this.settings = {
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      shadows: true,
      particles: true,
      neonEffects: true,
      decorations: true,
      autoRotate: true,
    };

    this.onPerformanceChange = null;

    // Add cooldown to prevent excessive adjustments
    this.lastAdjustmentTime = 0;
    this.adjustmentCooldown = 5000; // 5 seconds between adjustments
    this.hasReachedMaxQuality = false; // Track if we've reached maximum quality

    this.detectDeviceCapabilities();
    this.startMonitoring();
  }

  detectDeviceCapabilities() {
    // Basic device detection
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isLowEnd = navigator.hardwareConcurrency <= 4;

    // Adjust settings based on device
    if (isMobile || isLowEnd) {
      this.settings.pixelRatio = 1;
      this.settings.particles = false;
      this.settings.decorations = false;
      this.settings.shadows = false;
    }

    // GPU detection (basic)
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        // Check for integrated graphics or lower-end GPUs
        if (renderer.includes("Intel") || renderer.includes("integrated")) {
          this.settings.particles = false;
          this.settings.shadows = false;
        }
      }
    }

    // Memory detection
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      this.settings.particles = false;
      this.settings.decorations = false;
    }

    this.applySettings();
  }

  startMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.checkPerformance();
    }, 1000); // Check every second
  }

  update() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Calculate FPS
    this.frameCount++;
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Add to history
      this.fpsHistory.push(this.fps);
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
    }
  }

  checkPerformance() {
    if (this.fpsHistory.length < 30) return; // Wait for enough data

    const currentTime = performance.now();

    // Check cooldown period
    if (currentTime - this.lastAdjustmentTime < this.adjustmentCooldown) {
      return;
    }

    const averageFps =
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    // If FPS is consistently low, reduce quality
    if (averageFps < 30 && this.canReduceQuality()) {
      this.reduceQuality();
      this.lastAdjustmentTime = currentTime;
      this.hasReachedMaxQuality = false; // Reset max quality flag
    }
    // If FPS is consistently high and we haven't reached max quality, increase it
    else if (
      averageFps > 55 &&
      this.canIncreaseQuality() &&
      !this.hasReachedMaxQuality
    ) {
      this.increaseQuality();
      this.lastAdjustmentTime = currentTime;
    }
  }

  canReduceQuality() {
    return (
      this.settings.particles ||
      this.settings.decorations ||
      this.settings.shadows ||
      this.settings.pixelRatio > 1
    );
  }

  canIncreaseQuality() {
    return (
      this.settings.pixelRatio < Math.min(window.devicePixelRatio, 2) ||
      !this.settings.shadows ||
      !this.settings.particles ||
      !this.settings.decorations
    );
  }

  reduceQuality() {
    let changed = false;

    if (this.settings.decorations) {
      this.settings.decorations = false;
      changed = true;
    } else if (this.settings.particles) {
      this.settings.particles = false;
      changed = true;
    } else if (this.settings.shadows) {
      this.settings.shadows = false;
      changed = true;
    } else if (this.settings.pixelRatio > 1) {
      this.settings.pixelRatio = 1;
      changed = true;
    }

    if (changed) {
      console.log("Performance: Reducing quality", this.settings);
      this.applySettings();
    }
  }

  increaseQuality() {
    let changed = false;

    if (this.settings.pixelRatio < Math.min(window.devicePixelRatio, 2)) {
      this.settings.pixelRatio = Math.min(
        this.settings.pixelRatio + 0.25,
        Math.min(window.devicePixelRatio, 2)
      );
      changed = true;
    } else if (!this.settings.shadows) {
      this.settings.shadows = true;
      changed = true;
    } else if (!this.settings.particles) {
      this.settings.particles = true;
      changed = true;
    } else if (!this.settings.decorations) {
      this.settings.decorations = true;
      changed = true;
    }

    if (changed) {
      console.log("Performance: Increasing quality", this.settings);
      this.applySettings();
    } else {
      // Mark that we've reached maximum quality
      this.hasReachedMaxQuality = true;
      console.log("Performance: Maximum quality reached");
    }
  }

  applySettings() {
    if (this.onPerformanceChange) {
      this.onPerformanceChange(this.settings);
    }
  }

  getAverageFPS() {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
  }

  getCurrentFPS() {
    return this.fps;
  }

  getPerformanceLevel() {
    const avgFps = this.getAverageFPS();

    if (avgFps >= 50) return "high";
    if (avgFps >= 30) return "medium";
    return "low";
  }

  destroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}
