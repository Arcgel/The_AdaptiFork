# 🚀 Ultimate Web Toolkit - Chrome Extension

A professional Chrome extension with **50+ powerful tools** to customize and enhance your web browsing experience!

## ✨ Features

### 🎨 Visual Effects (10 Tools)
- **Dark Mode** - Toggle dark theme on any website
- **Brightness** - Adjust page brightness (50-200%)
- **Contrast** - Control contrast levels
- **Saturation** - Modify color saturation
- **Hue Rotate** - Shift color spectrum (0-360°)
- **Blur Effect** - Add blur to page elements
- **Grayscale** - Convert to black & white
- **Sepia** - Apply vintage sepia tone
- **Invert Colors** - Reverse all colors
- **Page Opacity** - Adjust overall transparency

### 📝 Typography (8 Tools)
- **Font Family** - Choose from 10+ fonts
- **Font Size** - Scale text (50-200%)
- **Line Height** - Adjust line spacing
- **Letter Spacing** - Control character spacing
- **Word Spacing** - Adjust space between words
- **Text Transform** - UPPERCASE, lowercase, Capitalize
- **Font Weight** - Control text boldness (100-900)
- **Text Decoration** - Underline, overline, strike-through

### 📐 Layout & Display (10 Tools)
- **Page Width** - Adjust content width
- **Page Zoom** - Zoom in/out (50-200%)
- **Hide Images** - Remove all images
- **Hide Videos** - Remove video elements
- **Hide Ads** - Block advertisement elements
- **Hide Popups** - Remove modal overlays
- **Rotate Page** - Rotate view (0-360°)
- **Flip Horizontal** - Mirror horizontally
- **Flip Vertical** - Mirror vertically
- **Full Width** - Expand content to full width

### 📖 Reading & Focus (8 Tools)
- **Reading Mode** - Distraction-free reading
- **Focus Mode** - Dim non-focused elements
- **Highlight Links** - Make links more visible
- **Dyslexia Font** - Accessible font for dyslexia
- **Text Alignment** - Left, center, right, justify
- **Cursor Style** - Change cursor appearance
- **Paragraph Spacing** - Add space between paragraphs
- **Text Shadow** - Add shadow to text

### 🎨 Colors & Theme (6 Tools)
- **Background Color** - Custom background color
- **Text Color** - Custom text color
- **Link Color** - Custom link color
- **Preset Themes** - 8 pre-designed themes
- **Border Highlight** - Visualize element borders
- **Color Temperature** - Warm/cool color adjustment

### ✨ Animations & Effects (6 Tools)
- **Disable Animations** - Stop all animations
- **Smooth Scroll** - Enable smooth scrolling
- **Page Transition** - Fade-in effect
- **Shadow Effects** - Add shadows to elements
- **Hover Zoom** - Zoom on hover
- **Parallax Effect** - 3D scrolling effect

### ⚡ Productivity (8 Tools)
- **Auto Scroll** - Automatic page scrolling
- **Scroll Speed** - Control auto-scroll speed
- **Screenshot** - Capture visible page
- **Print Friendly** - Optimize for printing
- **Word Counter** - Count words and characters
- **Copy All Text** - Copy page text to clipboard
- **Select All** - Select all page content
- **Translate** - Open Google Translate

### 🎯 Additional Features
- **Settings Panel** - Customize visible tool categories
- **Save/Load Presets** - Save your favorite configurations
- **Reset All** - Restore default settings
- **Professional UI** - Modern, dark-themed interface
- **Persistent Settings** - Settings saved across sessions

## 📦 Installation

### For Development/Testing:

1. **Download/Clone** this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the extension folder
6. The extension icon will appear in your toolbar!

### For Production:

1. Package the extension as a `.crx` file
2. Upload to Chrome Web Store
3. Install from the store

## 🎮 Usage

1. **Click the extension icon** in your toolbar
2. **Browse through categories** of tools
3. **Toggle switches** or **adjust sliders** to apply effects
4. **Open Settings** (⚙️) to customize which categories are visible
5. **Save presets** to quickly apply your favorite configurations
6. **Reset all** to restore defaults

## 🎨 Customization

### Hide/Show Categories:
1. Click the **Settings icon** (⚙️) in the header
2. Toggle categories you want to see
3. Click **Save & Apply**

### Save Your Configuration:
1. Adjust tools to your preference
2. Click **💾 Save Preset**
3. Enter a name for your preset
4. Load it anytime with **📂 Load Preset**

## 🛠️ Technical Details

### Files Structure:
```
├── manifest.json       # Extension configuration
├── popup.html         # Main UI structure
├── popup.css          # Professional styling
├── popup.js           # UI logic and controls
├── content.js         # Page manipulation script
├── background.js      # Service worker
└── README.md          # Documentation
```

### Technologies:
- **Manifest V3** - Latest Chrome extension standard
- **Pure CSS** - No frameworks, custom styling
- **Vanilla JavaScript** - No dependencies
- **Chrome Storage API** - Persistent settings
- **Chrome Tabs API** - Tab management
- **Chrome Scripting API** - Content injection

### Permissions:
- `activeTab` - Access current tab
- `storage` - Save settings
- `scripting` - Inject content scripts
- `tabs` - Tab management
- `<all_urls>` - Work on all websites

## 🎯 Hackathon Ready!

This extension is designed for hackathon presentations with:
- ✅ **50+ features** - Impressive feature count
- ✅ **Professional UI** - Modern, polished interface
- ✅ **User customization** - Settings panel for personalization
- ✅ **Real-time updates** - Instant visual feedback
- ✅ **Persistent storage** - Settings saved automatically
- ✅ **Clean code** - Well-organized and documented
- ✅ **No dependencies** - Pure vanilla implementation

## 🚀 Future Enhancements

Potential features for future versions:
- Export/Import settings as JSON
- Keyboard shortcuts for quick access
- Per-website settings memory
- More preset themes
- Custom CSS injection
- Advanced color picker
- Accessibility improvements
- Multi-language support

## 📝 Notes

- **Icons**: Replace placeholder icons (icon16.png, icon48.png, icon128.png) with actual images
- **Testing**: Test on various websites to ensure compatibility
- **Performance**: Some features may impact page performance on complex sites
- **Compatibility**: Works on Chrome and Chromium-based browsers

## 🎉 Demo Tips

For your hackathon presentation:
1. Show the **professional UI** first
2. Demonstrate **3-4 popular features** (dark mode, font size, hide ads)
3. Show the **settings customization** panel
4. Demonstrate **save/load presets**
5. Highlight the **50+ tools** available
6. Show **real-time updates** as you adjust sliders

## 📄 License

Open Source - Feel free to use, modify, and distribute!

## 👨‍💻 Author

Created for Hackathon - October 2025

---

**Good luck with your hackathon! 🎉**
