# Contributing to Cyberpunk 3D Portfolio

Terima kasih atas minat Anda untuk berkontribusi pada project ini! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

Project ini mengadopsi kode etik untuk menciptakan lingkungan yang welcome dan inklusif. Dengan berpartisipasi, Anda diharapkan untuk menjunjung tinggi kode etik ini.

### Our Standards

- Gunakan bahasa yang welcome dan inklusif
- Hormati sudut pandang dan pengalaman yang berbeda
- Terima kritik konstruktif dengan baik
- Fokus pada apa yang terbaik untuk komunitas

## 💡 How Can I Contribute?

### Reporting Bugs

Sebelum membuat bug report:
- Cek apakah bug sudah dilaporkan di [Issues](https://github.com/yourusername/cyberpunk-portfolio-3d/issues)
- Pastikan Anda menggunakan versi terbaru

Bug report yang baik harus mencakup:
- **Deskripsi jelas** tentang masalahnya
- **Steps to reproduce** - langkah-langkah untuk mereproduksi bug
- **Expected behavior** - apa yang seharusnya terjadi
- **Actual behavior** - apa yang sebenarnya terjadi
- **Screenshots** - jika memungkinkan
- **Environment details** - browser, OS, versi Node.js, dll

### Suggesting Enhancements

Enhancement suggestions sangat diterima! Saat membuat suggestion:
- Gunakan judul yang jelas dan deskriptif
- Berikan penjelasan detail tentang enhancement yang diusulkan
- Jelaskan use case dan manfaatnya
- Sertakan mockup atau contoh jika memungkinkan

### Pull Requests

1. Fork repository
2. Create branch dari `main` untuk feature Anda
3. Implementasikan perubahan
4. Pastikan kode mengikuti coding guidelines
5. Test perubahan Anda secara menyeluruh
6. Commit dengan message yang deskriptif
7. Push ke fork Anda
8. Submit Pull Request

## 🛠️ Development Setup

### Prerequisites

- Node.js v16+ 
- npm atau yarn
- Git

### Setup Steps

```bash
# 1. Fork dan clone repository
git clone https://github.com/YOUR_USERNAME/cyberpunk-portfolio-3d.git
cd cyberpunk-portfolio-3d

# 2. Install dependencies
npm install

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Start development server
npm run dev

# 5. Make your changes and test
# Browser akan auto-reload pada perubahan

# 6. Build untuk test production
npm run build
npm run preview
```

## 📝 Coding Guidelines

### JavaScript Style

- Gunakan **ES6+ syntax**
- Gunakan **const** dan **let**, hindari **var**
- Gunakan **arrow functions** untuk callbacks
- Gunakan **template literals** untuk string concatenation
- Gunakan **async/await** daripada promises chains

#### ✅ Good Example

```javascript
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
};
```

#### ❌ Bad Example

```javascript
var fetchData = function(url) {
  return fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    return data;
  }).catch(function(error) {
    console.error('Error fetching data: ' + error.message);
  });
};
```

### File Structure

- **Components**: Satu class per file
- **Utilities**: Fungsi-fungsi helper yang reusable
- **Data**: Static data dan configurations
- **Scenes**: Three.js scenes dan 3D objects

### Naming Conventions

- **Files**: PascalCase untuk classes (`NavigationManager.js`), camelCase untuk utilities (`loadingUtils.js`)
- **Variables**: camelCase (`userName`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PARTICLES`, `DEFAULT_COLOR`)
- **Classes**: PascalCase (`CyberpunkOffice`, `PerformanceManager`)
- **Functions**: camelCase (`initScene()`, `handleResize()`)

### Comments

```javascript
/**
 * Initialize the 3D scene with cyberpunk environment
 * @param {Object} config - Configuration object
 * @param {number} config.quality - Quality level (1-3)
 * @returns {THREE.Scene} The initialized scene
 */
function initScene(config) {
  // Implementation...
}
```

### Code Organization

```javascript
// 1. Imports
import * as THREE from 'three';
import { gsap } from 'gsap';

// 2. Constants
const DEFAULT_FOV = 75;

// 3. Class definition
export class MyClass {
  // Constructor
  constructor() {}
  
  // Public methods
  publicMethod() {}
  
  // Private methods
  _privateMethod() {}
}

// 4. Export default (if applicable)
export default MyClass;
```

## 📋 Commit Message Guidelines

Gunakan format Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Feature baru
- **fix**: Bug fix
- **docs**: Perubahan dokumentasi
- **style**: Format code (tidak mengubah logic)
- **refactor**: Refactoring code
- **perf**: Performance improvements
- **test**: Menambah atau mengubah tests
- **chore**: Perubahan pada build process atau tools

### Examples

```bash
feat(navigation): add smooth camera transitions

Implement GSAP-based camera animations for section navigation
with easing and duration controls.

Closes #123
```

```bash
fix(performance): resolve memory leak in particle system

Properly dispose geometries and materials when removing particles.
```

```bash
docs(readme): update installation instructions

Add troubleshooting section and browser compatibility table.
```

## 🔄 Pull Request Process

1. **Update Documentation** - Pastikan README dan comments ter-update
2. **Test Thoroughly** - Test di berbagai browser dan devices
3. **Build Check** - Pastikan `npm run build` berhasil tanpa error
4. **Clean Commits** - Squash commits jika perlu
5. **Descriptive PR** - Jelaskan perubahan, alasan, dan impact

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on Mobile

## Screenshots (if applicable)
Add screenshots of visual changes

## Related Issues
Closes #issue_number
```

## ❓ Questions?

Jangan ragu untuk:
- Membuka [Issue](https://github.com/yourusername/cyberpunk-portfolio-3d/issues) untuk pertanyaan
- Reach out via email: your.email@example.com

---

**Thank you for contributing! 🚀**
