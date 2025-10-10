# 🚀 Quick Installation Guide

## Step 1: Generate Icons

You need to create 3 icon files. You have two options:

### Option A: Use the Icon Generator (Recommended)
1. Open `create-icons.html` in your browser
2. Click each download button to get the 3 icon files
3. Save them in the extension folder

### Option B: Use Any Image Editor
Create 3 PNG files with these specifications:
- **icon16.png** - 16x16 pixels
- **icon48.png** - 48x48 pixels  
- **icon128.png** - 128x128 pixels

Use a simple gradient background (purple/blue) with a tools icon.

### Option C: Temporary Placeholder
For quick testing, you can temporarily comment out the icons in `manifest.json`:
```json
// Comment out these lines temporarily:
// "default_icon": { ... }
// "icons": { ... }
```

## Step 2: Load Extension in Chrome

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked** button
5. Select the `test` folder
6. Done! The extension icon will appear in your toolbar

## Step 3: Test the Extension

1. Click the extension icon in your toolbar
2. Try toggling some features:
   - Dark Mode
   - Font Size slider
   - Brightness control
3. Open Settings (⚙️ icon) to customize visible categories
4. Test on different websites

## Troubleshooting

**Extension won't load?**
- Make sure all files are in the same folder
- Check that manifest.json has no syntax errors
- Look at the Chrome extensions page for error messages

**Features not working?**
- Refresh the webpage after enabling the extension
- Check browser console for errors (F12)
- Some websites may block modifications

**Icons missing?**
- Use Option C above to temporarily disable icons
- Or create simple colored squares as placeholders

## File Structure

Your folder should contain:
```
test/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── content.js
├── background.js
├── icon16.png (create this)
├── icon48.png (create this)
├── icon128.png (create this)
├── create-icons.html
├── README.md
└── INSTALLATION.md (this file)
```

## Ready for Hackathon! 🎉

Once loaded, you have:
- ✅ 50+ working tools
- ✅ Professional dark UI
- ✅ Customizable settings panel
- ✅ Save/load presets
- ✅ Real-time updates

Good luck with your presentation!
