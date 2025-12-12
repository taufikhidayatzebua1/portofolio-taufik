// Portfolio content data for modal displays

export const portfolioContent = {
  about: {
    title: "About Me",
    description: `Saya Taufik Hidayat Zebua, seorang programmer dengan passion dalam mengembangkan aplikasi web modern dan teknologi AI. Dengan pengalaman dalam berbagai teknologi programming, saya selalu antusias untuk belajar hal-hal baru dan menghadapi tantangan teknis yang menarik.

Saya memiliki minat khusus dalam:
• Frontend Development dengan teknologi terkini
• 3D Web Development menggunakan Three.js
• UI/UX Design yang user-friendly
• Performance Optimization
• Clean Code & Best Practices`,
    technologies: [
      "JavaScript",
      "React",
      "Vue.js",
      "Node.js",
      "Three.js",
      "HTML5",
      "CSS3",
      "SASS",
      "PHP",
      "MySQL",
      "Git",
    ],
    experience: "3+ years",
    location: "Indonesia",
  },

  projects: {
    title: "My Projects",
    description: `Berikut adalah beberapa project yang telah saya kerjakan, menunjukkan kemampuan saya dalam berbagai teknologi dan domain aplikasi.`,
    projectList: [
      {
        name: "3D Portfolio Website",
        description:
          "Interactive 3D portfolio website menggunakan Three.js dengan tema cyberpunk office environment.",
        technologies: ["Three.js", "JavaScript", "WebGL", "GSAP"],
        status: "Completed",
        year: "2025",
      },
      {
        name: "E-Commerce Platform",
        description:
          "Full-stack e-commerce solution dengan fitur shopping cart, payment integration, dan admin dashboard.",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        status: "In Progress",
        year: "2024",
      },
      {
        name: "Task Management App",
        description:
          "Aplikasi manajemen tugas dengan real-time collaboration dan drag-drop interface.",
        technologies: ["Vue.js", "Firebase", "CSS3", "PWA"],
        status: "Completed",
        year: "2024",
      },
      {
        name: "Weather Dashboard",
        description:
          "Dashboard cuaca interaktif dengan data visualization dan forecast accuracy.",
        technologies: ["React", "D3.js", "API Integration", "Chart.js"],
        status: "Completed",
        year: "2023",
      },
    ],
  },

  skills: {
    title: "Technical Skills",
    description: `Saya memiliki pengalaman dalam berbagai teknologi dan tools development modern. Berikut adalah skills utama yang saya kuasai:`,
    skillCategories: [
      {
        category: "Frontend Development",
        skills: [
          { name: "JavaScript (ES6+)", level: "Advanced" },
          { name: "React", level: "Advanced" },
          { name: "Vue.js", level: "Intermediate" },
          { name: "Three.js", level: "Intermediate" },
          { name: "HTML5/CSS3", level: "Advanced" },
          { name: "SASS/SCSS", level: "Advanced" },
        ],
      },
      {
        category: "Backend Development",
        skills: [
          { name: "Node.js", level: "Intermediate" },
          { name: "Express.js", level: "Intermediate" },
          { name: "PHP", level: "Intermediate" },
          { name: "MySQL", level: "Intermediate" },
          { name: "MongoDB", level: "Beginner" },
        ],
      },
      {
        category: "Tools & Others",
        skills: [
          { name: "Git/GitHub", level: "Advanced" },
          { name: "VS Code", level: "Advanced" },
          { name: "Figma", level: "Intermediate" },
          { name: "Photoshop", level: "Intermediate" },
          { name: "Linux", level: "Intermediate" },
        ],
      },
    ],
  },

  contact: {
    title: "Contact Information",
    description: `Jika Anda tertarik untuk berkolaborasi atau memiliki pertanyaan tentang project saya, jangan ragu untuk menghubungi saya melalui channel berikut:`,
    contactInfo: [
      {
        type: "Email",
        value: "taufikhidayatzebua@gmail.com",
        icon: "✉️",
      },
      {
        type: "LinkedIn",
        value: "linkedin.com/in/taufikhizet",
        icon: "💼",
        link: "https://linkedin.com/in/taufikhizet",
      },
      {
        type: "GitHub",
        value: "github.com/taufikhizet",
        icon: "🐱",
        link: "https://github.com/taufikhizet",
      },
      {
        type: "Portfolio",
        value: "taufikhizet.github.io",
        icon: "🌐",
        link: "https://taufikhizet.github.io",
      },
      {
        type: "Phone",
        value: "+62 xxx-xxx-xxxx",
        icon: "📱",
      },
    ],
    availability:
      "Available for freelance projects and full-time opportunities",
    timezone: "WIB (UTC+7)",
  },
};
