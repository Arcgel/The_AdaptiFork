# 🍄 How to Add Your Custom Icon

You've uploaded a mushroom icon! Here's how to use it:

## Option 1: Manual Method (Easiest)

1. **Save the mushroom image** you uploaded to your computer

2. **Use an online image resizer** (like https://www.iloveimg.com/resize-image):
   - Upload your mushroom image
   - Create 3 versions:
     - **icon16.png** - 16x16 pixels
     - **icon48.png** - 48x48 pixels
     - **icon128.png** - 128x128 pixels

3. **Save all 3 files** in the `test` folder (same folder as manifest.json)

4. **Update manifest.json** - Add this section back:
   ```json
   "action": {
     "default_popup": "popup.html",
     "default_icon": {
       "16": "icon16.png",
       "48": "icon48.png",
       "128": "icon128.png"
     }
   },
   "icons": {
     "16": "icon16.png",
     "48": "icon48.png",
     "128": "icon128.png"
   },
   ```

5. **Reload the extension** in Chrome

---

## Option 2: Using Paint (Windows)

1. **Save the mushroom image** to your desktop

2. **Open Paint** (Windows built-in app)

3. **For each size:**
   - Open the mushroom image in Paint
   - Click "Resize" → Select "Pixels"
   - Uncheck "Maintain aspect ratio"
   - Enter width: 16, height: 16 (or 48, or 128)
   - Save as PNG: `icon16.png` (or icon48.png, icon128.png)

4. **Move all 3 files** to the test folder

5. **Update manifest.json** (see Option 1 step 4)

6. **Reload extension**

---

## Option 3: Quick Test (Use Default Chrome Icon)

If you want to test the extension first without custom icons:
- Keep manifest.json as it is (without icon sections)
- The extension will use Chrome's default puzzle piece icon
- You can add custom icons later

---

## 📝 Current Status

Your manifest.json currently has NO icons defined (which is fine for testing).

To add the mushroom icon, you need to:
1. Create the 3 PNG files (16x16, 48x48, 128x128)
2. Update manifest.json with the icon configuration

---

## ✅ After Adding Icons

Your extension will show the mushroom icon:
- In the Chrome toolbar
- On the chrome://extensions/ page
- In the extension popup

Good luck! 🍄
