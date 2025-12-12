# 🌆 Cyberpunk 3D Portfolio - Taufik Hidayat Zebua

<div align="center">

![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)

**Interactive 3D Portfolio Website dengan Tema Cyberpunk Office Environment**

[🚀 Live Demo](https://your-portfolio-url.vercel.app) • [📝 Documentation](#-dokumentasi) • [🐛 Report Bug](https://github.com/yourusername/cyberpunk-portfolio-3d/issues)

</div>

---

## 📖 Tentang Project

Portofolio interaktif 3D yang menampilkan karya dan kemampuan sebagai programmer dan software developer dalam bentuk kantor cyberpunk yang futuristik dan dapat dijelajahi. Dibangun dengan Three.js untuk memberikan pengalaman visual yang immersive dan memorable.

### ✨ Fitur Utama

- 🎮 **3D Interactive Environment** - Kantor cyberpunk yang fully explorable dengan kontrol intuitif
- 🎬 **Smooth Camera Transitions** - Animasi kamera yang halus dengan GSAP untuk perpindahan section
- ⚡ **Adaptive Performance** - Sistem optimasi otomatis berdasarkan kemampuan perangkat user
- 📱 **Fully Responsive** - Dioptimasi untuk desktop, tablet, dan mobile devices
- 💫 **Neon Visual Effects** - Pencahayaan neon cyberpunk yang dinamis dan atmospheric
- ✨ **Particle Systems** - Sistem partikel untuk meningkatkan immersion
- 🔮 **Holographic UI** - Elemen holografik untuk informasi dan navigasi
- 🎨 **Custom 3D Models** - Model dan tekstur yang dibuat khusus untuk tema cyberpunk

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Three.js** `^0.158.0` | 3D rendering engine untuk WebGL |
| **GSAP** `^3.12.2` | Animation library untuk smooth transitions |
| **Vite** `^5.0.0` | Lightning-fast build tool & dev server |
| **JavaScript ES6+** | Core application logic |
| **HTML5 / CSS3** | Structure & styling |

## 📁 Struktur Project

```
cyberpunk-portfolio-3d/
├── 📂 src/
│   ├── 📄 main.js                      # Entry point & initialization
│   ├── 📂 scenes/
│   │   └── CyberpunkOffice.js         # Main 3D scene & environment
│   ├── 📂 utils/
│   │   ├── LoadingManager.js          # Asset loading & progress tracking
│   │   ├── PerformanceManager.js      # Performance optimization system
│   │   ├── NavigationManager.js       # Section navigation & camera control
│   │   └── ModalManager.js            # Modal dialog management
│   ├── 📂 components/
│   │   └── InteractiveElements.js     # Interactive UI components
│   └── 📂 data/
│       └── portfolioContent.js        # Portfolio content data
├── 📂 assets/
│   └── 📂 textures/                   # 3D textures & images
├── 📂 .github/
│   └── copilot-instructions.md        # GitHub Copilot config
├── 📄 index.html                      # Main HTML file
├── 📄 package.json                    # Dependencies & scripts
├── 📄 vite.config.js                  # Vite configuration
├── 📄 vercel.json                     # Vercel deployment config
├── 📄 jsconfig.json                   # JavaScript config
├── 📄 .gitignore                      # Git ignore rules
└── 📄 README.md                       # Project documentation
```

## 🎮 Kontrol

- **Mouse**: Gerakkan untuk melihat sekeliling
- **Scroll**: Zoom in/out
- **Click Navigation**: Gunakan tombol navigasi untuk berpindah section
- **Auto-rotate**: Otomatis berputar pada section tertentu

## 🎨 Sections

1. **Home**: Tampilan overview kantor cyberpunk
2. **About**: Fokus pada area kerja utama
3. **Projects**: Highlight pada monitor dan workspace
4. **Skills**: Menampilkan elemen dekoratif dan skill
5. **Contact**: Area kontak dengan pencahayaan hangat

## 🚀 Quick Start

### 📋 Prerequisites

Pastikan Anda telah menginstal:
- **Node.js** (v16.0.0 atau lebih baru) - [Download](https://nodejs.org/)
- **npm** atau **yarn** package manager
- Browser modern dengan WebGL support (Chrome, Firefox, Safari, Edge)

### ⚙️ Installation

1️⃣ **Clone repository**
```bash
git clone https://github.com/yourusername/cyberpunk-portfolio-3d.git
cd cyberpunk-portfolio-3d
```

2️⃣ **Install dependencies**
```bash
npm install
# atau
yarn install
```

3️⃣ **Start development server**
```bash
npm run dev
# atau
yarn dev
```

4️⃣ **Open browser**
```
http://localhost:5173
```

### 🏗️ Build Commands

```bash
# Development server
npm run dev

# Build untuk production
npm run build

# Preview production build locally
npm run preview

# Serve production build (after build)
npm run serve
```

File production akan tersedia di folder `dist/` setelah build.

## 🎯 Deployment

### Vercel (Recommended)

1. Push code ke GitHub repository
2. Import project di [Vercel](https://vercel.com)
3. Vercel akan otomatis detect Vite dan deploy

Atau menggunakan Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag & drop folder 'dist' ke Netlify
```

### GitHub Pages

```bash
npm run build
# Deploy folder 'dist' ke gh-pages branch
```

## 🎮 Usage & Controls

### 🖱️ Desktop Controls
- **Mouse Move**: Pan camera untuk melihat sekeliling
- **Mouse Wheel**: Zoom in/out
- **Click Navigation Buttons**: Berpindah antar section
- **Auto-rotate**: Otomatis aktif pada beberapa section

### 📱 Mobile Controls
- **Touch & Drag**: Pan camera
- **Pinch**: Zoom in/out
- **Tap Navigation**: Gunakan tombol navigasi

### 🗺️ Navigation Sections

| Section | Description |
|---------|-------------|
| 🏠 **Home** | Overview kantor cyberpunk |
| 👨‍💻 **About** | Informasi pribadi & background |
| 💼 **Projects** | Showcase project-project terbaik |
| ⚡ **Skills** | Technical skills & expertise |
| 📧 **Contact** | Informasi kontak & social media |

## ⚡ Performance Optimization

Website ini dilengkapi dengan **adaptive performance system**:

- ✅ **Auto Device Detection** - Deteksi otomatis kemampuan perangkat
- ✅ **Dynamic Quality Adjustment** - Kualitas visual disesuaikan real-time
- ✅ **Mobile-First Optimization** - Optimasi khusus untuk mobile devices
- ✅ **FPS Monitoring** - Monitoring frame rate untuk performa optimal
- ✅ **Lazy Loading** - Asset loading yang efisien
- ✅ **Memory Management** - Manajemen memori untuk mencegah memory leaks

**Target Performance:**
- Desktop: 60 FPS
- Mobile: 30+ FPS
- Initial Load: < 3s

## 🎨 Customization

### Mengubah Konten Portfolio

Edit file [src/data/portfolioContent.js](src/data/portfolioContent.js):

```javascript
export const portfolioContent = {
  about: {
    title: "About Me",
    description: "Your description here...",
    // ...
  },
  projects: {
    projectList: [
      {
        name: "Project Name",
        description: "Project description",
        technologies: ["Tech1", "Tech2"],
        // ...
      }
    ]
  }
  // ...
};
```

### Mengubah Warna & Tema

Edit variabel di [src/scenes/CyberpunkOffice.js](src/scenes/CyberpunkOffice.js):

```javascript
const neonColors = {
  primary: 0x00ffff,    // Cyan
  secondary: 0xff00ff,  // Magenta
  accent: 0x00ff00      // Green
};
```

### Menambah Section Baru

1. Tambahkan section data di `portfolioContent.js`
2. Update navigation di `NavigationManager.js`
3. Tambahkan camera position di `CyberpunkOffice.js`

## 🏗️ Architecture

### Component Structure

```
Application
├── LoadingManager      → Handle asset loading
├── PerformanceManager  → Optimize rendering
├── NavigationManager   → Control navigation
├── ModalManager        → Handle modals
└── CyberpunkOffice    → Main 3D scene
    ├── Lights
    ├── Objects
    ├── Particles
    └── Interactive Elements
```

### Key Classes

- **`CyberpunkOffice`** - Main scene setup & rendering
- **`PerformanceManager`** - FPS monitoring & quality adjustment  
- **`NavigationManager`** - Section navigation & camera animations
- **`LoadingManager`** - Asset loading with progress tracking
- **`ModalManager`** - Modal dialogs for content display

## 🐛 Troubleshooting

### Issue: Black screen atau tidak muncul 3D

**Solusi:**
- Pastikan browser support WebGL
- Check console untuk error messages
- Clear browser cache
- Update graphic drivers

### Issue: Performance lambat

**Solusi:**
- Performance Manager akan otomatis adjust quality
- Close aplikasi lain yang berat
- Update browser ke versi terbaru
- Gunakan hardware acceleration di browser

### Issue: Build error

**Solusi:**
```bash
# Clear cache & reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 76+ | ✅ Full |
| Mobile Safari | iOS 14+ | ✅ Full |
| Chrome Mobile | Latest | ✅ Full |

**Requirements:**
- WebGL 2.0 support
- ES6+ JavaScript support
- Modern CSS features (Grid, Flexbox)

## 🤝 Contributing

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Project ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

## 👨‍💻 Author

**Taufik Hidayat Zebua**
- Portfolio: [your-portfolio-url.vercel.app](https://your-portfolio-url.vercel.app)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - Amazing 3D library
- [GSAP](https://greensock.com/gsap/) - Animation platform
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- Inspiration dari berbagai cyberpunk artworks & designs

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/cyberpunk-portfolio-3d)
![GitHub stars](https://img.shields.io/github/stars/yourusername/cyberpunk-portfolio-3d?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/cyberpunk-portfolio-3d?style=social)

---

<div align="center">

**⭐ Star this repo if you like it! ⭐**

Made with ❤️ and lots of ☕

</div>

## 🎨 Customization

### Mengubah Tema Warna

Edit material di `src/scenes/CyberpunkOffice.js`:

```javascript
this.materials.neonCyan = new THREE.MeshBasicMaterial({
    color: 0x00ffff, // Ganti warna sesuai keinginan
    emissive: 0x00ffff,
    emissiveIntensity: 1
});
```

### Menambah Section Baru

1. Tambahkan viewpoint di `src/utils/NavigationManager.js`
2. Tambahkan button di `index.html`
3. Update event listener di `src/main.js`

### Menambah Objek 3D

Tambahkan method baru di `CyberpunkOffice.js`:

```javascript
createNewObject() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
    const object = new THREE.Mesh(geometry, material);
    this.scene.add(object);
}
```

## 📱 Mobile Support

- Touch controls untuk navigasi
- Reduced particle effects untuk performa
- Optimized UI untuk layar kecil
- Auto-performance adjustment

## 🔧 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**Catatan**: WebGL diperlukan untuk menjalankan aplikasi ini.

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 👨‍💻 Developer

**Taufik Hidayat Zebua**

## 🙏 Acknowledgments

- Inspirasi dari [Jesse Zhou's Portfolio](https://www.jesse-zhou.com/)
- Three.js community untuk dokumentasi yang luar biasa
- GSAP untuk library animasi yang powerful
- Brandon James Greer untuk inspirasi pixel art cyberpunk

## 🐛 Bug Reports & Feature Requests

Jika menemukan bug atau ingin request fitur baru, silakan buat issue di repository ini.

---

*Dibuat dengan ❤️ menggunakan Three.js dan teknologi web modern*
