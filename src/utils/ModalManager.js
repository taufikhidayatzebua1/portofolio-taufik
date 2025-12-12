// Modal manager for displaying portfolio content

export default class ModalManager {
  constructor() {
    this.activeModal = null;
  }

  showModal(content, type) {
    // Close any existing modal first
    this.closeModal();

    // Create modal overlay
    const modal = document.createElement("div");
    modal.className = "portfolio-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      backdrop-filter: blur(5px);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    // Create modal content container
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.style.cssText = `
      background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(0, 17, 34, 0.95) 100%);
      border: 2px solid #00ffff;
      border-radius: 12px;
      padding: 2rem;
      max-width: 800px;
      max-height: 80vh;
      width: 90%;
      color: #fff;
      font-family: 'Rajdhani', sans-serif;
      box-shadow: 
        0 0 30px rgba(0, 255, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      overflow-y: auto;
      position: relative;
      transform: scale(0.8);
      transition: transform 0.3s ease;
      scrollbar-width: none;
      -ms-overflow-style: none;
    `;

    // Add responsive CSS for mobile
    const responsiveStyle = document.createElement("style");
    responsiveStyle.textContent = `
      @media (max-width: 768px) {
        .modal-content {
          max-width: 95% !important;
          width: 95% !important;
          padding: 1.5rem !important;
          max-height: 85vh !important;
          margin: 1rem !important;
          border-radius: 8px !important;
        }
        
        .modal-header h2 {
          font-size: 1.5rem !important;
          margin-bottom: 0.8rem !important;
          padding-right: 3rem !important;
          line-height: 1.3 !important;
        }
        
        .close-modal {
          top: 0.8rem !important;
          right: 0.8rem !important;
          width: 35px !important;
          height: 35px !important;
          font-size: 1rem !important;
        }
        
        .modal-body {
          font-size: 0.95rem !important;
        }
        
        .modal-body h3 {
          font-size: 1.1rem !important;
          margin-bottom: 0.8rem !important;
        }
        
        .tech-tag {
          font-size: 0.8rem !important;
          padding: 0.3rem 0.6rem !important;
        }
        
        .project-card {
          padding: 1rem !important;
          margin-bottom: 1rem !important;
        }
        
        .project-card h4 {
          font-size: 1.1rem !important;
        }
        
        .skill-category {
          margin-bottom: 1.2rem !important;
        }
        
        .skill-category h4 {
          font-size: 1rem !important;
        }
        
        .contact-item {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 0.3rem !important;
        }
        
        .contact-item span:first-child {
          font-size: 0.9rem !important;
        }
      }
      
      .modal-content::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(responsiveStyle);

    // Generate content based on type
    modalContent.innerHTML = this.generateContent(content, type);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Store reference
    this.activeModal = modal;

    // Animate modal appearance
    requestAnimationFrame(() => {
      modal.style.opacity = "1";
      modalContent.style.transform = "scale(1)";
    });

    // Close modal handlers
    const closeButton = modalContent.querySelector(".close-modal");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.closeModal());
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.closeModal();
    });

    // Close with escape key
    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        this.closeModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }

  generateContent(content, type) {
    switch (type) {
      case "about":
        return this.generateAboutContent(content);
      case "projects":
        return this.generateProjectsContent(content);
      case "skills":
        return this.generateSkillsContent(content);
      case "contact":
        return this.generateContactContent(content);
      case "tutorial":
        return this.generateTutorialContent(content);
      default:
        return "<p>Content not available</p>";
    }
  }

  generateAboutContent(content) {
    return `
      <div class="modal-header">
        <h2 style="color: #00ffff; margin-bottom: 1rem; font-family: 'Orbitron', monospace; font-size: 2rem;">
          ${content.title}
        </h2>
        <button class="close-modal" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: 2px solid #ff00ff;
          color: #ff00ff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,0,255,0.2)'" onmouseout="this.style.background='transparent'">×</button>
      </div>
      
      <div class="modal-body">
        <div style="white-space: pre-line; line-height: 1.8; margin-bottom: 2rem; font-size: 1.1rem;">
          ${content.description}
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <h3 style="color: #ff00ff; margin-bottom: 1rem; font-size: 1.3rem;">Technologies</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${content.technologies
              .map(
                (tech) => `
              <span class="tech-tag" style="
                background: rgba(0, 255, 255, 0.2);
                border: 1px solid #00ffff;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.9rem;
                color: #00ffff;
              ">${tech}</span>
            `
              )
              .join("")}
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
          <div>
            <strong style="color: #ff00ff;">Experience:</strong> ${
              content.experience
            }
          </div>
          <div>
            <strong style="color: #ff00ff;">Location:</strong> ${
              content.location
            }
          </div>
        </div>
      </div>
    `;
  }

  generateProjectsContent(content) {
    return `
      <div class="modal-header">
        <h2 style="color: #00ffff; margin-bottom: 1rem; font-family: 'Orbitron', monospace; font-size: 2rem;">
          ${content.title}
        </h2>
        <button class="close-modal" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: 2px solid #ff00ff;
          color: #ff00ff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,0,255,0.2)'" onmouseout="this.style.background='transparent'">×</button>
      </div>
      
      <div class="modal-body">
        <p style="line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">
          ${content.description}
        </p>
        
        <div style="display: grid; gap: 1.5rem;">
          ${content.projectList
            .map(
              (project) => `
            <div class="project-card" style="
              background: rgba(0, 0, 0, 0.3);
              border: 1px solid rgba(0, 255, 255, 0.3);
              border-radius: 8px;
              padding: 1.5rem;
              transition: border-color 0.3s ease;
            " onmouseover="this.style.borderColor='#00ffff'" onmouseout="this.style.borderColor='rgba(0,255,255,0.3)'">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <h4 style="color: #00ffff; margin: 0; font-size: 1.2rem;">${
                  project.name
                }</h4>
                <div style="display: flex; gap: 1rem; font-size: 0.9rem;">
                  <span style="color: #ff00ff;">${project.year}</span>
                  <span style="
                    background: ${
                      project.status === "Completed"
                        ? "rgba(0,255,0,0.2)"
                        : "rgba(255,165,0,0.2)"
                    };
                    color: ${
                      project.status === "Completed" ? "#00ff00" : "#ffa500"
                    };
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                  ">${project.status}</span>
                </div>
              </div>
              <p style="margin-bottom: 1rem; line-height: 1.6;">${
                project.description
              }</p>
              <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                ${project.technologies
                  .map(
                    (tech) => `
                  <span class="tech-tag" style="
                    background: rgba(255, 0, 255, 0.2);
                    border: 1px solid #ff00ff;
                    padding: 0.2rem 0.6rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    color: #ff00ff;
                  ">${tech}</span>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  generateSkillsContent(content) {
    return `
      <div class="modal-header">
        <h2 style="color: #00ffff; margin-bottom: 1rem; font-family: 'Orbitron', monospace; font-size: 2rem;">
          ${content.title}
        </h2>
        <button class="close-modal" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: 2px solid #ff00ff;
          color: #ff00ff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,0,255,0.2)'" onmouseout="this.style.background='transparent'">×</button>
      </div>
      
      <div class="modal-body">
        <p style="line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">
          ${content.description}
        </p>
        
        <div style="display: grid; gap: 2rem;">
          ${content.skillCategories
            .map(
              (category) => `
            <div class="skill-category">
              <h4 style="color: #ff00ff; margin-bottom: 1rem; font-size: 1.3rem; border-bottom: 1px solid rgba(255,0,255,0.3); padding-bottom: 0.5rem;">
                ${category.category}
              </h4>
              <div style="display: grid; gap: 0.8rem;">
                ${category.skills
                  .map(
                    (skill) => `
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.8rem;
                    border-radius: 6px;
                    border-left: 3px solid ${this.getSkillLevelColor(
                      skill.level
                    )};
                  ">
                    <span style="font-weight: 500;">${skill.name}</span>
                    <span style="
                      background: ${this.getSkillLevelColor(skill.level)};
                      color: #000;
                      padding: 0.3rem 0.6rem;
                      border-radius: 12px;
                      font-size: 0.8rem;
                      font-weight: bold;
                    ">${skill.level}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  generateContactContent(content) {
    return `
      <div class="modal-header">
        <h2 style="color: #00ffff; margin-bottom: 1rem; font-family: 'Orbitron', monospace; font-size: 2rem;">
          ${content.title}
        </h2>
        <button class="close-modal" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: 2px solid #ff00ff;
          color: #ff00ff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,0,255,0.2)'" onmouseout="this.style.background='transparent'">×</button>
      </div>
      
      <div class="modal-body">
        <p style="line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">
          ${content.description}
        </p>
        
        <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
          ${content.contactInfo
            .map(
              (contact) => `
            <div class="contact-item" style="
              display: flex;
              align-items: center;
              background: rgba(0, 0, 0, 0.3);
              padding: 1rem;
              border-radius: 8px;
              border: 1px solid rgba(0, 255, 255, 0.2);
              transition: border-color 0.3s ease;
            " onmouseover="this.style.borderColor='#00ffff'" onmouseout="this.style.borderColor='rgba(0,255,255,0.2)'">
              <span style="font-size: 1.5rem; margin-right: 1rem;">${
                contact.icon
              }</span>
              <div style="flex: 1;">
                <div style="color: #ff00ff; font-weight: bold; margin-bottom: 0.3rem;">${
                  contact.type
                }</div>
                ${
                  contact.link
                    ? `
                  <a href="${contact.link}" target="_blank" style="
                    color: #00ffff;
                    text-decoration: none;
                    transition: color 0.3s ease;
                  " onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#00ffff'">
                    ${contact.value}
                  </a>
                `
                    : `
                  <span style="color: #00ffff;">${contact.value}</span>
                `
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        
        <div style="
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
        ">
          <div style="color: #00ffff; font-weight: bold; margin-bottom: 0.5rem;">
            🌟 ${content.availability}
          </div>
          <div style="color: #ff00ff; font-size: 0.9rem;">
            📍 Timezone: ${content.timezone}
          </div>
        </div>
      </div>
    `;
  }

  generateTutorialContent(content) {
    return `
      <div class="modal-header">
        <button class="close-modal" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: 2px solid #ff00ff;
          color: #ff00ff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,0,255,0.2)'" onmouseout="this.style.background='transparent'">×</button>
      </div>
      
      <div class="modal-body">
        ${content}
      </div>
    `;
  }

  getSkillLevelColor(level) {
    switch (level.toLowerCase()) {
      case "advanced":
        return "#00ff00";
      case "intermediate":
        return "#ffff00";
      case "beginner":
        return "#ff8800";
      default:
        return "#00ffff";
    }
  }

  closeModal() {
    if (this.activeModal) {
      const modalContent = this.activeModal.querySelector(".modal-content");

      // Animate modal disappearance
      this.activeModal.style.opacity = "0";
      if (modalContent) {
        modalContent.style.transform = "scale(0.8)";
      }

      setTimeout(() => {
        if (this.activeModal && this.activeModal.parentNode) {
          this.activeModal.parentNode.removeChild(this.activeModal);
        }
        this.activeModal = null;
      }, 300);
    }
  }
}
