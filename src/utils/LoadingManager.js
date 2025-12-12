export default class LoadingManager {
  constructor() {
    this.totalItems = 15; // Increased for more realistic loading
    this.loadedItems = 0;
    this.progress = 0;

    this.onProgress = null;
    this.onLoad = null;
    this.onError = null;

    this.isLoading = true;
    this.hasError = false;
    this.sceneLoaded = false;

    this.loadingMessages = [
      "Initializing Cyberpunk Terminal...",
      "Loading 3D Environment...",
      "Booting Neon Systems...",
      "Synchronizing Holograms...",
      "Calibrating Neural Interface...",
      "Loading Portfolio Data...",
      "Rendering Cyberpunk Office...",
      "Activating Interactive Elements...",
      "Finalizing Matrix Connection...",
      "Ready to Enter Cyberspace...",
    ];

    // Start simulation but don't auto-finish
    this.simulateLoading();
  }

  simulateLoading() {
    this.loadingInterval = setInterval(() => {
      if (this.loadedItems < this.totalItems) {
        this.loadedItems++;
        this.updateProgress();
        this.updateLoadingMessage();

        if (this.onProgress) {
          this.onProgress(this.progress);
        }

        // If we've reached 100%, finish loading
        if (this.loadedItems >= this.totalItems) {
          clearInterval(this.loadingInterval);
          console.log("Loading complete, calling finishLoading()");
          this.finishLoading();
        }
      }
    }, 150 + Math.random() * 200); // Random delay between 150-350ms
  }

  updateProgress() {
    this.progress = Math.min((this.loadedItems / this.totalItems) * 100, 100);
  }

  updateLoadingMessage() {
    const messageIndex = Math.floor(
      (this.loadedItems / this.totalItems) * this.loadingMessages.length
    );
    const clampedIndex = Math.min(
      messageIndex,
      this.loadingMessages.length - 1
    );
    const message = this.loadingMessages[clampedIndex];

    const loadingText = document.getElementById("loading-text");
    if (loadingText && loadingText.textContent !== message) {
      loadingText.textContent = message;
    }
  }

  finishLoading() {
    this.isLoading = false;
    this.progress = 100;

    // Update to final message
    const loadingText = document.getElementById("loading-text");
    if (loadingText) {
      loadingText.textContent =
        this.loadingMessages[this.loadingMessages.length - 1];
    }

    if (this.onProgress) {
      this.onProgress(100);
    }

    setTimeout(() => {
      console.log("Loading manager onLoad callback triggered");
      if (this.onLoad) {
        this.onLoad();
      }
    }, 500); // Reduced delay to see 100% briefly
  }

  // Method to signal that scene loading is complete
  notifySceneLoaded() {
    console.log("Scene loading notified as complete");
    this.sceneLoaded = true;
  }

  reportError(error) {
    this.hasError = true;
    this.isLoading = false;

    if (this.onError) {
      this.onError(error);
    }

    console.error("Loading error:", error);
  }

  // Method to manually update progress (for real asset loading)
  setProgress(loaded, total) {
    this.loadedItems = loaded;
    this.totalItems = total;
    this.updateProgress();

    if (this.onProgress) {
      this.onProgress(this.progress);
    }

    if (loaded >= total) {
      this.finishLoading();
    }
  }
}
