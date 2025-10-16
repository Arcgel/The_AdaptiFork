// ===========================
// State Management
// ===========================
let currentSettings = {};
let autoScrollInterval = null;

// Default category visibility
const defaultCategories = {
    visual: true,
    typography: true,
    layout: true,
    reading: true,
    color: true,
    animations: true,
    productivity: true
};

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    initializeEventListeners();
    initializeSettingsPanel();
    loadCategoryVisibility();
    updateToolCount();
});

// ===========================
// Settings Management
// ===========================
async function loadSettings() {
    try {
        const result = await chrome.storage.local.get('toolkitSettings');
        if (result.toolkitSettings) {
            currentSettings = result.toolkitSettings;
            applySettingsToUI();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSettings() {
    try {
        await chrome.storage.local.set({ toolkitSettings: currentSettings });
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function applySettingsToUI() {
    Object.keys(currentSettings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = currentSettings[key];
            } else if (element.type === 'range') {
                element.value = currentSettings[key];
                updateValueDisplay(key, currentSettings[key]);
            } else {
                element.value = currentSettings[key];
            }
        }
    });
}

// ===========================
// Event Listeners
// ===========================
function initializeEventListeners() {
    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('closeSettings').addEventListener('click', closeSettings);
    document.getElementById('saveSettings').addEventListener('click', saveCategorySettings);
    document.getElementById('selectAllTools').addEventListener('click', selectAllCategories);
    document.getElementById('deselectAllTools').addEventListener('click', deselectAllCategories);

    // Category collapse
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', (e) => {
            const category = header.closest('.category');
            category.classList.toggle('collapsed');
        });
    });

    // Visual Effects
    addToggleListener('darkMode', applyDarkMode);
    addRangeListener('brightness', applyBrightness, '%');
    addRangeListener('contrast', applyContrast, '%');
    addRangeListener('saturation', applySaturation, '%');
    addRangeListener('hueRotate', applyHueRotate, '°');
    addRangeListener('blur', applyBlur, 'px');
    addRangeListener('grayscale', applyGrayscale, '%');
    addRangeListener('sepia', applySepia, '%');
    addToggleListener('invert', applyInvert);
    addRangeListener('opacity', applyOpacity, '%');

    // Typography
    addSelectListener('fontFamily', applyFontFamily);
    addRangeListener('fontSize', applyFontSize, '%');
    addRangeListener('lineHeight', applyLineHeight, '');
    addRangeListener('letterSpacing', applyLetterSpacing, 'px');
    addRangeListener('wordSpacing', applyWordSpacing, 'px');
    addSelectListener('textTransform', applyTextTransform);
    addRangeListener('fontWeight', applyFontWeight, '');
    addSelectListener('textDecoration', applyTextDecoration);

    // Layout & Display
    addRangeListener('pageWidth', applyPageWidth, '%');
    addRangeListener('pageZoom', applyPageZoom, '%');
    addToggleListener('hideImages', applyHideImages);
    addToggleListener('hideVideos', applyHideVideos);
    addToggleListener('hideAds', applyHideAds);
    addToggleListener('hidePopups', applyHidePopups);
    addRangeListener('rotatePage', applyRotatePage, '°');
    addToggleListener('flipHorizontal', applyFlipHorizontal);
    addToggleListener('flipVertical', applyFlipVertical);
    addToggleListener('fullWidth', applyFullWidth);

    // Reading & Focus
    addToggleListener('readingMode', applyReadingMode);
    addToggleListener('focusMode', applyFocusMode);
    addToggleListener('highlightLinks', applyHighlightLinks);
    addToggleListener('dyslexiaFont', applyDyslexiaFont);
    addSelectListener('textAlign', applyTextAlign);
    addSelectListener('cursorStyle', applyCursorStyle);
    addRangeListener('paragraphSpacing', applyParagraphSpacing, 'px');
    addToggleListener('textShadow', applyTextShadow);

    // Color & Theme
    addColorListener('bgColor', applyBgColor);
    addColorListener('textColor', applyTextColor);
    addColorListener('linkColor', applyLinkColor);
    addSelectListener('presetTheme', applyPresetTheme);
    addToggleListener('borderHighlight', applyBorderHighlight);
    addRangeListener('colorTemp', applyColorTemp, '');

    // Animations & Effects
    addToggleListener('disableAnimations', applyDisableAnimations);
    addToggleListener('smoothScroll', applySmoothScroll);
    addToggleListener('pageTransition', applyPageTransition);
    addToggleListener('shadowEffects', applyShadowEffects);
    addToggleListener('hoverZoom', applyHoverZoom);
    addToggleListener('parallax', applyParallax);

    // Productivity
    addToggleListener('autoScroll', applyAutoScroll);
    addRangeListener('scrollSpeed', () => {}, '');
    document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);
    addToggleListener('printFriendly', applyPrintFriendly);
    document.getElementById('wordCountBtn').addEventListener('click', countWords);
    document.getElementById('copyTextBtn').addEventListener('click', copyAllText);
    document.getElementById('selectAllBtn').addEventListener('click', selectAllText);
    document.getElementById('translateBtn').addEventListener('click', translatePage);

    // Color reset buttons
    document.querySelectorAll('.btn-reset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.dataset.reset;
            resetColorInput(targetId);
        });
    });

    // Quick Actions
    document.getElementById('resetAll').addEventListener('click', resetAllSettings);
    document.getElementById('savePreset').addEventListener('click', savePreset);
    document.getElementById('loadPreset').addEventListener('click', loadPreset);
}

// ===========================
// Helper Functions for Event Listeners
// ===========================
function addToggleListener(id, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('change', (e) => {
            console.log(`Toggle ${id}:`, e.target.checked);
            currentSettings[id] = e.target.checked;
            callback(e.target.checked);
            saveSettings();
        });
    } else {
        console.warn(`Element not found: ${id}`);
    }
}

function addRangeListener(id, callback, unit) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', (e) => {
            const value = e.target.value;
            console.log(`Range ${id}:`, value);
            currentSettings[id] = value;
            updateValueDisplay(id, value, unit);
            callback(value);
            saveSettings();
        });
    } else {
        console.warn(`Element not found: ${id}`);
    }
}

function addSelectListener(id, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('change', (e) => {
            currentSettings[id] = e.target.value;
            callback(e.target.value);
            saveSettings();
        });
    }
}

function addColorListener(id, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('change', (e) => {
            currentSettings[id] = e.target.value;
            callback(e.target.value);
            saveSettings();
        });
    }
}

function updateValueDisplay(id, value, unit = '') {
    const display = document.getElementById(`${id}Value`);
    if (display) {
        display.textContent = value + unit;
    }
}

// ===========================
// Apply Functions - Visual Effects
// ===========================
async function applyDarkMode(enabled) {
    await executeInActiveTab({
        action: 'darkMode',
        enabled: enabled
    });
}

async function applyBrightness(value) {
    await executeInActiveTab({
        action: 'brightness',
        value: value
    });
}

async function applyContrast(value) {
    await executeInActiveTab({
        action: 'contrast',
        value: value
    });
}

async function applySaturation(value) {
    await executeInActiveTab({
        action: 'saturation',
        value: value
    });
}

async function applyHueRotate(value) {
    await executeInActiveTab({
        action: 'hueRotate',
        value: value
    });
}

async function applyBlur(value) {
    await executeInActiveTab({
        action: 'blur',
        value: value
    });
}

async function applyGrayscale(value) {
    await executeInActiveTab({
        action: 'grayscale',
        value: value
    });
}

async function applySepia(value) {
    await executeInActiveTab({
        action: 'sepia',
        value: value
    });
}

async function applyInvert(enabled) {
    await executeInActiveTab({
        action: 'invert',
        enabled: enabled
    });
}

async function applyOpacity(value) {
    await executeInActiveTab({
        action: 'opacity',
        value: value
    });
}

// ===========================
// Apply Functions - Typography
// ===========================
async function applyFontFamily(value) {
    await executeInActiveTab({
        action: 'fontFamily',
        value: value
    });
}

async function applyFontSize(value) {
    await executeInActiveTab({
        action: 'fontSize',
        value: value
    });
}

async function applyLineHeight(value) {
    await executeInActiveTab({
        action: 'lineHeight',
        value: value
    });
}

async function applyLetterSpacing(value) {
    await executeInActiveTab({
        action: 'letterSpacing',
        value: value
    });
}

async function applyWordSpacing(value) {
    await executeInActiveTab({
        action: 'wordSpacing',
        value: value
    });
}

async function applyTextTransform(value) {
    await executeInActiveTab({
        action: 'textTransform',
        value: value
    });
}

async function applyFontWeight(value) {
    await executeInActiveTab({
        action: 'fontWeight',
        value: value
    });
}

async function applyTextDecoration(value) {
    await executeInActiveTab({
        action: 'textDecoration',
        value: value
    });
}

// ===========================
// Apply Functions - Layout & Display
// ===========================
async function applyPageWidth(value) {
    await executeInActiveTab({
        action: 'pageWidth',
        value: value
    });
}

async function applyPageZoom(value) {
    await executeInActiveTab({
        action: 'pageZoom',
        value: value
    });
}

async function applyHideImages(enabled) {
    await executeInActiveTab({
        action: 'hideImages',
        enabled: enabled
    });
}

async function applyHideVideos(enabled) {
    await executeInActiveTab({
        action: 'hideVideos',
        enabled: enabled
    });
}

async function applyHideAds(enabled) {
    await executeInActiveTab({
        action: 'hideAds',
        enabled: enabled
    });
}

async function applyHidePopups(enabled) {
    await executeInActiveTab({
        action: 'hidePopups',
        enabled: enabled
    });
}

async function applyRotatePage(value) {
    await executeInActiveTab({
        action: 'rotatePage',
        value: value
    });
}

async function applyFlipHorizontal(enabled) {
    await executeInActiveTab({
        action: 'flipHorizontal',
        enabled: enabled
    });
}

async function applyFlipVertical(enabled) {
    await executeInActiveTab({
        action: 'flipVertical',
        enabled: enabled
    });
}

async function applyFullWidth(enabled) {
    await executeInActiveTab({
        action: 'fullWidth',
        enabled: enabled
    });
}

// ===========================
// Apply Functions - Reading & Focus
// ===========================
async function applyReadingMode(enabled) {
    await executeInActiveTab({
        action: 'readingMode',
        enabled: enabled
    });
}

async function applyFocusMode(enabled) {
    await executeInActiveTab({
        action: 'focusMode',
        enabled: enabled
    });
}

async function applyHighlightLinks(enabled) {
    await executeInActiveTab({
        action: 'highlightLinks',
        enabled: enabled
    });
}

async function applyDyslexiaFont(enabled) {
    await executeInActiveTab({
        action: 'dyslexiaFont',
        enabled: enabled
    });
}

async function applyTextAlign(value) {
    await executeInActiveTab({
        action: 'textAlign',
        value: value
    });
}

async function applyCursorStyle(value) {
    await executeInActiveTab({
        action: 'cursorStyle',
        value: value
    });
}

async function applyParagraphSpacing(value) {
    await executeInActiveTab({
        action: 'paragraphSpacing',
        value: value
    });
}

async function applyTextShadow(enabled) {
    await executeInActiveTab({
        action: 'textShadow',
        enabled: enabled
    });
}

// ===========================
// Apply Functions - Color & Theme
// ===========================
async function applyBgColor(value) {
    await executeInActiveTab({
        action: 'bgColor',
        value: value
    });
}

async function applyTextColor(value) {
    await executeInActiveTab({
        action: 'textColor',
        value: value
    });
}

async function applyLinkColor(value) {
    await executeInActiveTab({
        action: 'linkColor',
        value: value
    });
}

async function applyPresetTheme(value) {
    await executeInActiveTab({
        action: 'presetTheme',
        value: value
    });
}

async function applyBorderHighlight(enabled) {
    await executeInActiveTab({
        action: 'borderHighlight',
        enabled: enabled
    });
}

async function applyColorTemp(value) {
    await executeInActiveTab({
        action: 'colorTemp',
        value: value
    });
}

// ===========================
// Apply Functions - Animations & Effects
// ===========================
async function applyDisableAnimations(enabled) {
    await executeInActiveTab({
        action: 'disableAnimations',
        enabled: enabled
    });
}

async function applySmoothScroll(enabled) {
    await executeInActiveTab({
        action: 'smoothScroll',
        enabled: enabled
    });
}

async function applyPageTransition(enabled) {
    await executeInActiveTab({
        action: 'pageTransition',
        enabled: enabled
    });
}

async function applyShadowEffects(enabled) {
    await executeInActiveTab({
        action: 'shadowEffects',
        enabled: enabled
    });
}

async function applyHoverZoom(enabled) {
    await executeInActiveTab({
        action: 'hoverZoom',
        enabled: enabled
    });
}

async function applyParallax(enabled) {
    await executeInActiveTab({
        action: 'parallax',
        enabled: enabled
    });
}

// ===========================
// Apply Functions - Productivity
// ===========================
async function applyAutoScroll(enabled) {
    await executeInActiveTab({
        action: 'autoScroll',
        enabled: enabled,
        speed: document.getElementById('scrollSpeed').value
    });
}

async function takeScreenshot() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const dataUrl = await chrome.tabs.captureVisibleTab();
        
        // Download the screenshot
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `screenshot-${Date.now()}.png`;
        link.click();
        
        showNotification('Screenshot captured!');
    } catch (error) {
        console.error('Screenshot error:', error);
        showNotification('Screenshot failed', 'error');
    }
}

async function applyPrintFriendly(enabled) {
    await executeInActiveTab({
        action: 'printFriendly',
        enabled: enabled
    });
}

async function countWords() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const text = document.body.innerText;
                const words = text.trim().split(/\s+/).length;
                const chars = text.length;
                return { words, chars };
            }
        });
        
        if (result[0]?.result) {
            const { words, chars } = result[0].result;
            showNotification(`Words: ${words} | Characters: ${chars}`);
        }
    } catch (error) {
        console.error('Word count error:', error);
    }
}

async function copyAllText() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const text = document.body.innerText;
                navigator.clipboard.writeText(text);
            }
        });
        showNotification('Text copied to clipboard!');
    } catch (error) {
        console.error('Copy error:', error);
    }
}

async function selectAllText() {
    await executeInActiveTab({
        action: 'selectAll'
    });
}

async function translatePage() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const translateUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(tab.url)}`;
        await chrome.tabs.create({ url: translateUrl });
    } catch (error) {
        console.error('Translate error:', error);
    }
}

// ===========================
// Color Reset
// ===========================
function resetColorInput(id) {
    const defaults = {
        bgColor: '#ffffff',
        textColor: '#000000',
        linkColor: '#0000ff'
    };
    
    const element = document.getElementById(id);
    if (element && defaults[id]) {
        element.value = defaults[id];
        currentSettings[id] = defaults[id];
        
        if (id === 'bgColor') applyBgColor(defaults[id]);
        if (id === 'textColor') applyTextColor(defaults[id]);
        if (id === 'linkColor') applyLinkColor(defaults[id]);
        
        saveSettings();
    }
}

// ===========================
// Quick Actions
// ===========================
async function resetAllSettings() {
    if (confirm('Reset all settings to default? This will refresh the page.')) {
        currentSettings = {};
        await chrome.storage.local.clear();
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.reload(tab.id);
        
        window.location.reload();
    }
}

async function savePreset() {
    const presetName = prompt('Enter a name for this preset:');
    if (presetName) {
        try {
            const presets = await chrome.storage.local.get('savedPresets') || {};
            const savedPresets = presets.savedPresets || {};
            savedPresets[presetName] = currentSettings;
            
            await chrome.storage.local.set({ savedPresets });
            showNotification(`Preset "${presetName}" saved!`);
        } catch (error) {
            console.error('Save preset error:', error);
        }
    }
}

async function loadPreset() {
    try {
        const presets = await chrome.storage.local.get('savedPresets');
        const savedPresets = presets.savedPresets || {};
        const presetNames = Object.keys(savedPresets);
        
        if (presetNames.length === 0) {
            showNotification('No saved presets found', 'error');
            return;
        }
        
        const presetName = prompt(`Available presets:\n${presetNames.join('\n')}\n\nEnter preset name to load:`);
        if (presetName && savedPresets[presetName]) {
            currentSettings = savedPresets[presetName];
            applySettingsToUI();
            await saveSettings();
            
            // Apply all settings by triggering their respective apply functions
            Object.keys(currentSettings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    const value = currentSettings[key];
                    
                    // Trigger the appropriate event based on element type
                    if (element.type === 'checkbox') {
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                    } else if (element.type === 'range') {
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            });
            
            showNotification(`Preset "${presetName}" loaded!`);
        }
    } catch (error) {
        console.error('Load preset error:', error);
    }
}

// ===========================
// Settings Panel
// ===========================
function initializeSettingsPanel() {
    const settingsOptions = document.getElementById('settingsOptions');
    const categories = [
        { id: 'visual', name: '🎨 Visual Effects', icon: '🎨' },
        { id: 'typography', name: '📝 Typography', icon: '📝' },
        { id: 'layout', name: '📐 Layout & Display', icon: '📐' },
        { id: 'reading', name: '📖 Reading & Focus', icon: '📖' },
        { id: 'color', name: '🎨 Colors & Theme', icon: '🎨' },
        { id: 'animations', name: '✨ Animations & Effects', icon: '✨' },
        { id: 'productivity', name: '⚡ Productivity', icon: '⚡' }
    ];
    
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'setting-item';
        item.innerHTML = `
            <span class="setting-label">
                <span>${cat.icon}</span>
                <span>${cat.name}</span>
            </span>
            <label class="toggle-switch">
                <input type="checkbox" data-category="${cat.id}" checked>
                <span class="toggle-slider"></span>
            </label>
        `;
        settingsOptions.appendChild(item);
    });
}

function openSettings() {
    document.getElementById('settingsPanel').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('active');
}

async function saveCategorySettings() {
    const checkboxes = document.querySelectorAll('#settingsOptions input[data-category]');
    const visibility = {};
    
    checkboxes.forEach(cb => {
        visibility[cb.dataset.category] = cb.checked;
    });
    
    await chrome.storage.local.set({ categoryVisibility: visibility });
    applyCategoryVisibility(visibility);
    closeSettings();
    showNotification('Settings saved!');
}

function selectAllCategories() {
    document.querySelectorAll('#settingsOptions input[data-category]').forEach(cb => {
        cb.checked = true;
    });
}

function deselectAllCategories() {
    document.querySelectorAll('#settingsOptions input[data-category]').forEach(cb => {
        cb.checked = false;
    });
}

async function loadCategoryVisibility() {
    try {
        const result = await chrome.storage.local.get('categoryVisibility');
        const visibility = result.categoryVisibility || defaultCategories;
        applyCategoryVisibility(visibility);
        
        // Update checkboxes in settings panel
        Object.keys(visibility).forEach(cat => {
            const checkbox = document.querySelector(`#settingsOptions input[data-category="${cat}"]`);
            if (checkbox) {
                checkbox.checked = visibility[cat];
            }
        });
    } catch (error) {
        console.error('Load visibility error:', error);
    }
}

function applyCategoryVisibility(visibility) {
    Object.keys(visibility).forEach(cat => {
        const category = document.querySelector(`.category[data-category="${cat}"]`);
        if (category) {
            if (visibility[cat]) {
                category.classList.remove('hidden');
            } else {
                category.classList.add('hidden');
            }
        }
    });
    updateToolCount();
}

function updateToolCount() {
    const visibleCategories = document.querySelectorAll('.category:not(.hidden)');
    let totalTools = 0;
    visibleCategories.forEach(cat => {
        totalTools += cat.querySelectorAll('.tool-card').length;
    });
    document.getElementById('toolCount').textContent = `${totalTools}+`;
}

// ===========================
// Execute in Active Tab
// ===========================
async function executeInActiveTab(message) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log('Sending message:', message, 'to tab:', tab.id);
        
        // Check if it's a chrome:// or extension page
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
            showNotification('Cannot modify Chrome system pages', 'error');
            return;
        }
        
        // Try to send message
        try {
            const response = await chrome.tabs.sendMessage(tab.id, message);
            console.log('Message sent successfully:', response);
        } catch (error) {
            // Content script not loaded, try to inject it
            console.log('Content script not loaded, injecting...');
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                });
                
                // Wait for script to initialize
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Try sending message again
                const response = await chrome.tabs.sendMessage(tab.id, message);
                console.log('Message sent after injection:', response);
            } catch (injectError) {
                console.error('Injection failed:', injectError);
                showNotification('Please refresh the page and try again', 'error');
            }
        }
    } catch (error) {
        console.error('Execute error:', error);
    }
}

// ===========================
// Notifications
// ===========================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
