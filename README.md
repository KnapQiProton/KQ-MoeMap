# KQ-MoeMap 🌸⚡
> **Smart SVG Gradient Map Studio** — A modern, anime-tech aesthetic web application that maps custom multi-stop gradients to image luminance using pure SVG filters.

![KQ-MoeMap](https://img.shields.io/badge/Aesthetic-Yostar%20%2F%20Anime--tech-pink?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

---

## ✨ Overview

**KQ-MoeMap** is an advanced SVG Filter generator and real-time image gradient-mapping tool. Inspired by the clean, tactical UI design of **Yostar / Blue Archive / Arknights** fused with soft **cute-core** aesthetics, it allows creators, designers, and developers to convert any photo or illustration into stylized duotone and multi-color gradient maps.

---

## 🎨 Key Features

### 1. 🖥️ Layout & Aesthetic Experience
- **Two-Column Layout**: High-density controls on the left, interactive real-time preview canvas on the right. Seamlessly collapses to a mobile-optimized vertical stack.
- **Yostar & Cute-core Visual Design**: Frosted glass panels (`backdrop-blur-md`), pill badges, soft glowing borders, and tactical HUD micro-accents.
- **Full Dark Mode**: High-contrast dark theme with zinc/slate foundations and luminous pastel accents, synchronized with `localStorage` and system preferences.

### 2. ⚡ The SVG Filter Engine
- **Luminance Extraction**: Employs `<feColorMatrix type="luminanceToAlpha">` using Rec. 709 weights (`0.2126R + 0.7152G + 0.0722B`) to convert pixel brightness into alpha luminance.
- **RGB Component Routing**: Accurately maps luminance across the red, green, and blue color channels via a matrix transformation.
- **Dynamic Table Values Calculation**: Dynamically generates equidistant `tableValues` for `<feFuncR>`, `<feFuncG>`, and `<feFuncB>` in `<feComponentTransfer>`.
- **Accurate Hex Math**: Converts Hex colors directly into normalized float values `[0.0 - 1.0]` with smooth piecewise linear interpolation between arbitrary stop offsets.

### 3. 🎯 Smart Color Panel & Magic Search
- **Multi-stop Gradients**: Add, remove, reorder, reverse, or evenly distribute stops (minimum 2 stops).
- **Smart Hex Field**: Real-time validation, automatic formatting, and integrated color picker.
- **Position Sliders**: Fine-tune each stop offset from `0%` to `100%`.
- **Magic Search / 20+ Curated Palettes**:
  - 🌸 **Moe Pastel** (soft pinks, baby blues, warm whites)
  - 🍓 **Cute-core** (strawberry blushes, cotton candy)
  - ⚡ **Yostar Blue** (clinical Kivotos academy blues & whites)
  - 🌊 **Ocean** (deep abyss to cerulean and tropical seafoam)
  - 🍰 **Süße Farbe** (German sweet bakery pastels: apricot, vanilla, blackberry)
  - 🌑 **Nacht** (tactical night-ops slate and stealth gunmetal)
  - 🌆 **Cyber Neon**, 🍵 **Matcha Latte**, 🌇 **Sunset Glow**, 🍇 **Candy Pop**, and more!

### 4. 🖼️ Real-time Interactive Preview
- **Split Comparison Slider**: Drag interactive handle to compare filtered output with original image side-by-side.
- **Zoom & Pan Controls**: 50% to 250% zoom and 1:1 pixel toggle.
- **Image Upload**: Drag-and-drop file upload, file explorer picker, and built-in vector & photography presets.

### 5. 📦 Export & Developer Tools
- **Copy SVG Code**: One-click copy of the ready-to-use `<svg><filter>...</filter></svg>` markup.
- **Copy CSS**: One-click copy of the `.filter { filter: url(#kq-moemap-filter); }` rule.
- **Export Filtered Image**: High-resolution PNG, JPG, or WEBP download via HTML5 Canvas using an optimized 256-entry lookup table.
- **Live Code Inspector**: Expandable drawer displaying dynamic table values and matrix transformations in real-time.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/KnapQiProton/KQ-MoeMap.git
cd KQ-MoeMap
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for production
```bash
npm run build
```

---

## 📐 How the SVG Filter Works

```xml
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
    <filter id="kq-moemap-filter" color-interpolation-filters="sRGB">
      <!-- 1. Convert pixel luminance into an Alpha channel map -->
      <feColorMatrix type="luminanceToAlpha" result="lumAlpha" />

      <!-- 2. Re-route Alpha channel into RGB for transfer mapping -->
      <feColorMatrix in="lumAlpha" type="matrix" 
        values="0 0 0 1 0
                0 0 0 1 0
                0 0 0 1 0
                0 0 0 0 1" result="lumRGB" />

      <!-- 3. Map grayscale values through discrete color stop tables -->
      <feComponentTransfer in="lumRGB" result="colorMapped">
        <feFuncR type="table" tableValues="0.169 0.514 0.780 0.969 1" />
        <feFuncG type="table" tableValues="0.165 0.482 0.808 0.698 0.945" />
        <feFuncB type="table" tableValues="0.290 0.651 0.918 0.741 0.902" />
        <feFuncA type="table" tableValues="1 1" />
      </feComponentTransfer>
    </filter>
  </defs>
</svg>
```

Apply to any image via CSS:
```css
.filtered-element {
  filter: url(#kq-moemap-filter);
}
```

---

## 📄 License

MIT © [KnapQiProton](https://github.com/KnapQiProton)
