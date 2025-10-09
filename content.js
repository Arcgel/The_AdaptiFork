// ===========================
// Content Script - Applies modifications to web pages
// ===========================

// Create style element for dynamic CSS
let styleElement;

// Initialize when DOM is ready
function initStyleElement() {
    if (!styleElement && document.head) {
        styleElement = document.createElement('style');
        styleElement.id = 'ultimate-toolkit-styles';
        document.head.appendChild(styleElement);
    }
}

// Try to initialize immediately
if (document.head) {
    initStyleElement();
} else {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStyleElement);
    } else {
        initStyleElement();
    }
}

// State management
let currentFilters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotate: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    opacity: 100
};

let autoScrollInterval = null;
let flipState = { horizontal: false, vertical: false };

// ===========================
// Message Listener
// ===========================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message);
    try {
        handleAction(message);
        sendResponse({ success: true });
    } catch (error) {
        console.error('Error handling action:', error);
        sendResponse({ success: false, error: error.message });
    }
    return true;
});

// ===========================
// Action Handler
// ===========================
function handleAction(message) {
    const { action, value, enabled } = message;
    
    switch (action) {
        // Visual Effects
        case 'darkMode':
            applyDarkMode(enabled);
            break;
        case 'brightness':
            currentFilters.brightness = value;
            applyFilters();
            break;
        case 'contrast':
            currentFilters.contrast = value;
            applyFilters();
            break;
        case 'saturation':
            currentFilters.saturation = value;
            applyFilters();
            break;
        case 'hueRotate':
            currentFilters.hueRotate = value;
            applyFilters();
            break;
        case 'blur':
            currentFilters.blur = value;
            applyFilters();
            break;
        case 'grayscale':
            currentFilters.grayscale = value;
            applyFilters();
            break;
        case 'sepia':
            currentFilters.sepia = value;
            applyFilters();
            break;
        case 'invert':
            currentFilters.invert = enabled ? 100 : 0;
            applyFilters();
            break;
        case 'opacity':
            currentFilters.opacity = value;
            applyFilters();
            break;
            
        // Typography
        case 'fontFamily':
            applyFontFamily(value);
            break;
        case 'fontSize':
            applyFontSize(value);
            break;
        case 'lineHeight':
            applyLineHeight(value);
            break;
        case 'letterSpacing':
            applyLetterSpacing(value);
            break;
        case 'wordSpacing':
            applyWordSpacing(value);
            break;
        case 'textTransform':
            applyTextTransform(value);
            break;
        case 'fontWeight':
            applyFontWeight(value);
            break;
        case 'textDecoration':
            applyTextDecoration(value);
            break;
            
        // Layout & Display
        case 'pageWidth':
            applyPageWidth(value);
            break;
        case 'pageZoom':
            applyPageZoom(value);
            break;
        case 'hideImages':
            applyHideImages(enabled);
            break;
        case 'hideVideos':
            applyHideVideos(enabled);
            break;
        case 'hideAds':
            applyHideAds(enabled);
            break;
        case 'hidePopups':
            applyHidePopups(enabled);
            break;
        case 'rotatePage':
            applyRotatePage(value);
            break;
        case 'flipHorizontal':
            flipState.horizontal = enabled;
            applyFlip();
            break;
        case 'flipVertical':
            flipState.vertical = enabled;
            applyFlip();
            break;
        case 'fullWidth':
            applyFullWidth(enabled);
            break;
            
        // Reading & Focus
        case 'readingMode':
            applyReadingMode(enabled);
            break;
        case 'focusMode':
            applyFocusMode(enabled);
            break;
        case 'highlightLinks':
            applyHighlightLinks(enabled);
            break;
        case 'dyslexiaFont':
            applyDyslexiaFont(enabled);
            break;
        case 'textAlign':
            applyTextAlign(value);
            break;
        case 'cursorStyle':
            applyCursorStyle(value);
            break;
        case 'paragraphSpacing':
            applyParagraphSpacing(value);
            break;
        case 'textShadow':
            applyTextShadow(enabled);
            break;
            
        // Color & Theme
        case 'bgColor':
            applyBgColor(value);
            break;
        case 'textColor':
            applyTextColor(value);
            break;
        case 'linkColor':
            applyLinkColor(value);
            break;
        case 'presetTheme':
            applyPresetTheme(value);
            break;
        case 'borderHighlight':
            applyBorderHighlight(enabled);
            break;
        case 'colorTemp':
            applyColorTemp(value);
            break;
            
        // Animations & Effects
        case 'disableAnimations':
            applyDisableAnimations(enabled);
            break;
        case 'smoothScroll':
            applySmoothScroll(enabled);
            break;
        case 'pageTransition':
            applyPageTransition(enabled);
            break;
        case 'shadowEffects':
            applyShadowEffects(enabled);
            break;
        case 'hoverZoom':
            applyHoverZoom(enabled);
            break;
        case 'parallax':
            applyParallax(enabled);
            break;
            
        // Productivity
        case 'autoScroll':
            applyAutoScroll(enabled, message.speed);
            break;
        case 'printFriendly':
            applyPrintFriendly(enabled);
            break;
        case 'selectAll':
            selectAllText();
            break;
    }
}

// ===========================
// Visual Effects Implementation
// ===========================
function applyFilters() {
    const filterString = `
        brightness(${currentFilters.brightness}%)
        contrast(${currentFilters.contrast}%)
        saturate(${currentFilters.saturation}%)
        hue-rotate(${currentFilters.hueRotate}deg)
        blur(${currentFilters.blur}px)
        grayscale(${currentFilters.grayscale}%)
        sepia(${currentFilters.sepia}%)
        invert(${currentFilters.invert}%)
        opacity(${currentFilters.opacity}%)
    `;
    
    updateStyle('filters', `
        body {
            filter: ${filterString} !important;
        }
    `);
}

function applyDarkMode(enabled) {
    if (enabled) {
        updateStyle('darkMode', `
            html {
                filter: invert(1) hue-rotate(180deg) !important;
                background: #1a1a1a !important;
            }
            img, video, picture, [style*="background-image"] {
                filter: invert(1) hue-rotate(180deg) !important;
            }
        `);
    } else {
        removeStyle('darkMode');
    }
}

// ===========================
// Typography Implementation
// ===========================
function applyFontFamily(value) {
    if (value === 'default') {
        removeStyle('fontFamily');
    } else {
        updateStyle('fontFamily', `
            * {
                font-family: ${value} !important;
            }
        `);
    }
}

function applyFontSize(value) {
    updateStyle('fontSize', `
        body {
            font-size: ${value}% !important;
        }
    `);
}

function applyLineHeight(value) {
    updateStyle('lineHeight', `
        * {
            line-height: ${value} !important;
        }
    `);
}

function applyLetterSpacing(value) {
    updateStyle('letterSpacing', `
        * {
            letter-spacing: ${value}px !important;
        }
    `);
}

function applyWordSpacing(value) {
    updateStyle('wordSpacing', `
        * {
            word-spacing: ${value}px !important;
        }
    `);
}

function applyTextTransform(value) {
    if (value === 'none') {
        removeStyle('textTransform');
    } else {
        updateStyle('textTransform', `
            * {
                text-transform: ${value} !important;
            }
        `);
    }
}

function applyFontWeight(value) {
    updateStyle('fontWeight', `
        * {
            font-weight: ${value} !important;
        }
    `);
}

function applyTextDecoration(value) {
    if (value === 'none') {
        removeStyle('textDecoration');
    } else {
        updateStyle('textDecoration', `
            * {
                text-decoration: ${value} !important;
            }
        `);
    }
}

// ===========================
// Layout & Display Implementation
// ===========================
function applyPageWidth(value) {
    updateStyle('pageWidth', `
        body {
            max-width: ${value}% !important;
            margin: 0 auto !important;
        }
    `);
}

function applyPageZoom(value) {
    document.body.style.zoom = `${value}%`;
}

function applyHideImages(enabled) {
    if (enabled) {
        updateStyle('hideImages', `
            img {
                display: none !important;
            }
        `);
    } else {
        removeStyle('hideImages');
    }
}

function applyHideVideos(enabled) {
    if (enabled) {
        updateStyle('hideVideos', `
            video, iframe[src*="youtube"], iframe[src*="vimeo"] {
                display: none !important;
            }
        `);
    } else {
        removeStyle('hideVideos');
    }
}

function applyHideAds(enabled) {
    if (enabled) {
        updateStyle('hideAds', `
            [class*="ad-"], [id*="ad-"], [class*="advertisement"],
            [id*="advertisement"], .ad, #ad, ins.adsbygoogle {
                display: none !important;
            }
        `);
    } else {
        removeStyle('hideAds');
    }
}

function applyHidePopups(enabled) {
    if (enabled) {
        updateStyle('hidePopups', `
            [class*="popup"], [class*="modal"], [class*="overlay"],
            [id*="popup"], [id*="modal"], [id*="overlay"] {
                display: none !important;
            }
        `);
    } else {
        removeStyle('hidePopups');
    }
}

function applyRotatePage(value) {
    updateStyle('rotatePage', `
        body {
            transform: rotate(${value}deg) !important;
        }
    `);
}

function applyFlip() {
    const scaleX = flipState.horizontal ? -1 : 1;
    const scaleY = flipState.vertical ? -1 : 1;
    
    updateStyle('flip', `
        body {
            transform: scale(${scaleX}, ${scaleY}) !important;
        }
    `);
}

function applyFullWidth(enabled) {
    if (enabled) {
        updateStyle('fullWidth', `
            body, main, .container, .content, article {
                max-width: 100% !important;
                width: 100% !important;
            }
        `);
    } else {
        removeStyle('fullWidth');
    }
}

// ===========================
// Reading & Focus Implementation
// ===========================
function applyReadingMode(enabled) {
    if (enabled) {
        updateStyle('readingMode', `
            body {
                background: #f5f5dc !important;
                color: #333 !important;
                font-family: Georgia, serif !important;
                line-height: 1.8 !important;
                max-width: 800px !important;
                margin: 0 auto !important;
                padding: 40px !important;
            }
            * {
                background: transparent !important;
            }
            img, video, aside, nav, header, footer, .sidebar {
                display: none !important;
            }
        `);
    } else {
        removeStyle('readingMode');
    }
}

function applyFocusMode(enabled) {
    if (enabled) {
        updateStyle('focusMode', `
            * {
                opacity: 0.3 !important;
                transition: opacity 0.3s !important;
            }
            *:hover, *:focus {
                opacity: 1 !important;
            }
        `);
    } else {
        removeStyle('focusMode');
    }
}

function applyHighlightLinks(enabled) {
    if (enabled) {
        updateStyle('highlightLinks', `
            a {
                background: yellow !important;
                color: black !important;
                padding: 2px 4px !important;
                border-radius: 3px !important;
                font-weight: bold !important;
            }
        `);
    } else {
        removeStyle('highlightLinks');
    }
}

function applyDyslexiaFont(enabled) {
    if (enabled) {
        updateStyle('dyslexiaFont', `
            * {
                font-family: 'Comic Sans MS', 'Arial', sans-serif !important;
                letter-spacing: 0.12em !important;
                word-spacing: 0.16em !important;
                line-height: 2 !important;
            }
        `);
    } else {
        removeStyle('dyslexiaFont');
    }
}

function applyTextAlign(value) {
    if (value === 'default') {
        removeStyle('textAlign');
    } else {
        updateStyle('textAlign', `
            * {
                text-align: ${value} !important;
            }
        `);
    }
}

function applyCursorStyle(value) {
    if (value === 'default') {
        removeStyle('cursorStyle');
    } else {
        updateStyle('cursorStyle', `
            * {
                cursor: ${value} !important;
            }
        `);
    }
}

function applyParagraphSpacing(value) {
    updateStyle('paragraphSpacing', `
        p {
            margin-bottom: ${value}px !important;
        }
    `);
}

function applyTextShadow(enabled) {
    if (enabled) {
        updateStyle('textShadow', `
            * {
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;
            }
        `);
    } else {
        removeStyle('textShadow');
    }
}

// ===========================
// Color & Theme Implementation
// ===========================
function applyBgColor(value) {
    updateStyle('bgColor', `
        body, * {
            background-color: ${value} !important;
        }
    `);
}

function applyTextColor(value) {
    updateStyle('textColor', `
        * {
            color: ${value} !important;
        }
    `);
}

function applyLinkColor(value) {
    updateStyle('linkColor', `
        a {
            color: ${value} !important;
        }
    `);
}

function applyPresetTheme(value) {
    const themes = {
        default: null,
        dark: {
            bg: '#1a1a1a',
            text: '#e0e0e0',
            link: '#6b9eff'
        },
        sepia: {
            bg: '#f4ecd8',
            text: '#5c4a3a',
            link: '#8b4513'
        },
        night: {
            bg: '#0a1929',
            text: '#b0c4de',
            link: '#4da6ff'
        },
        forest: {
            bg: '#1a2f1a',
            text: '#c8e6c9',
            link: '#81c784'
        },
        sunset: {
            bg: '#2d1b2e',
            text: '#ffd1dc',
            link: '#ff69b4'
        },
        ocean: {
            bg: '#001f3f',
            text: '#7fdbff',
            link: '#39cccc'
        },
        highContrast: {
            bg: '#000000',
            text: '#ffffff',
            link: '#ffff00'
        }
    };
    
    if (value === 'default' || !themes[value]) {
        removeStyle('presetTheme');
    } else {
        const theme = themes[value];
        updateStyle('presetTheme', `
            body, * {
                background-color: ${theme.bg} !important;
                color: ${theme.text} !important;
            }
            a {
                color: ${theme.link} !important;
            }
        `);
    }
}

function applyBorderHighlight(enabled) {
    if (enabled) {
        updateStyle('borderHighlight', `
            * {
                border: 1px solid rgba(255, 0, 0, 0.3) !important;
            }
        `);
    } else {
        removeStyle('borderHighlight');
    }
}

function applyColorTemp(value) {
    const temp = parseInt(value);
    if (temp === 0) {
        removeStyle('colorTemp');
    } else {
        const filter = temp > 0 
            ? `sepia(${temp}%) saturate(150%)` 
            : `hue-rotate(${temp * 2}deg)`;
        
        updateStyle('colorTemp', `
            body {
                filter: ${filter} !important;
            }
        `);
    }
}

// ===========================
// Animations & Effects Implementation
// ===========================
function applyDisableAnimations(enabled) {
    if (enabled) {
        updateStyle('disableAnimations', `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
        `);
    } else {
        removeStyle('disableAnimations');
    }
}

function applySmoothScroll(enabled) {
    if (enabled) {
        updateStyle('smoothScroll', `
            html {
                scroll-behavior: smooth !important;
            }
        `);
    } else {
        removeStyle('smoothScroll');
    }
}

function applyPageTransition(enabled) {
    if (enabled) {
        updateStyle('pageTransition', `
            body {
                animation: fadeIn 0.5s ease !important;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `);
    } else {
        removeStyle('pageTransition');
    }
}

function applyShadowEffects(enabled) {
    if (enabled) {
        updateStyle('shadowEffects', `
            * {
                box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
            }
        `);
    } else {
        removeStyle('shadowEffects');
    }
}

function applyHoverZoom(enabled) {
    if (enabled) {
        updateStyle('hoverZoom', `
            * {
                transition: transform 0.3s ease !important;
            }
            *:hover {
                transform: scale(1.05) !important;
            }
        `);
    } else {
        removeStyle('hoverZoom');
    }
}

function applyParallax(enabled) {
    if (enabled) {
        document.addEventListener('scroll', handleParallax);
    } else {
        document.removeEventListener('scroll', handleParallax);
    }
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('img, section, div');
    
    parallaxElements.forEach((el, index) => {
        const speed = (index % 3 + 1) * 0.1;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// ===========================
// Productivity Implementation
// ===========================
function applyAutoScroll(enabled, speed) {
    if (enabled) {
        const scrollSpeed = parseInt(speed) || 3;
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, scrollSpeed);
        }, 50);
    } else {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
}

function applyPrintFriendly(enabled) {
    if (enabled) {
        updateStyle('printFriendly', `
            @media print {
                body {
                    background: white !important;
                    color: black !important;
                }
                nav, header, footer, aside, .sidebar, .ad {
                    display: none !important;
                }
            }
        `);
    } else {
        removeStyle('printFriendly');
    }
}

function selectAllText() {
    const range = document.createRange();
    range.selectNodeContents(document.body);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

// ===========================
// Style Management Helpers
// ===========================
function updateStyle(id, css) {
    // Ensure DOM is ready
    if (!document.head) return;
    
    let style = document.getElementById(`toolkit-${id}`);
    if (!style) {
        style = document.createElement('style');
        style.id = `toolkit-${id}`;
        document.head.appendChild(style);
    }
    style.textContent = css;
}

function removeStyle(id) {
    const style = document.getElementById(`toolkit-${id}`);
    if (style) {
        style.remove();
    }
}

// ===========================
// Initialize
// ===========================
console.log('Ultimate Web Toolkit - Content Script Loaded');
