// --- 1. CORE CONFIGURATION: MODULAR FEATURE DEFINITIONS ---
// This configuration is repeated here for the content script to know the feature structure and apply logic.
const ALL_FEATURES = [
    {
        id: 'font-size',
        label: 'Text Size',
        icon: 'A+',
        actionValue: 100, // Placeholder value - actual comes from storage
        actionLogic: (feature) => feature,
        applyLogic: (feature) => {
            // Applies a scaling factor to the base font size for the whole page.
            document.documentElement.style.setProperty('--custom-font-scale', feature.actionValue / 100);
        }
    },
    {
        id: 'brightness',
        label: 'Brightness',
        icon: '☀️',
        actionValue: 100,
        actionLogic: (feature) => feature,
        applyLogic: (feature) => {
            // Applies a CSS filter for brightness to the entire body.
            document.body.style.filter = `brightness(${feature.actionValue / 100})`;
        }
    },
    {
        id: 'high-contrast',
        label: 'High Contrast',
        icon: '⚫⚪',
        actionValue: false,
        actionLogic: (feature) => feature,
        applyLogic: (feature) => {
            if (feature.actionValue) {
                // Inverts colors and shifts hue for high contrast effect.
                document.body.style.filter += ' invert(100%) hue-rotate(180deg)'; 
            }
        }
    },
    {
        id: 'letter-spacing',
        label: 'Spacing',
        icon: '↔',
        actionValue: 0,
        actionLogic: (feature) => feature,
        applyLogic: (feature) => {
            // Applies letter spacing using a custom CSS variable.
            document.documentElement.style.setProperty('--custom-letter-spacing', `${feature.actionValue}px`);
        }
    }
];

// --- 2. SETUP & STATE MANAGEMENT (Content Script) ---

const STORAGE_KEY = 'accessibilityHubSettings';
let currentSettings = [];

// Inject Tailwind CSS CDN and custom CSS variables needed for features
const injectStyles = () => {
    // Inject Tailwind CDN (optional, but good practice if needed for injected elements)
    if (!document.getElementById('tailwind-cdn')) {
        const twScript = document.createElement('script');
        twScript.src = "https://cdn.tailwindcss.com";
        twScript.id = "tailwind-cdn";
        document.head.appendChild(twScript);
    }
    
    // Inject custom CSS variables and base rules
    if (!document.getElementById('acc-hub-base-styles')) {
        const style = document.createElement('style');
        style.id = 'acc-hub-base-styles';
        style.innerHTML = `
            /* Define global CSS variables used by applyLogic */
            :root {
                --custom-font-scale: 1; 
                --custom-letter-spacing: 0px;
            }
            /* Apply CSS variables to common elements for font size and spacing effects */
            p, a, span, div, h1, h2, h3, h4, h5 {
                font-size: calc(1em * var(--custom-font-scale, 1)); 
                letter-spacing: var(--custom-letter-spacing, 0px);
                transition: all 0.3s ease; /* Smooth transition for visual changes */
            }
        `;
        // Use document.documentElement for styles that should be applied early
        document.head.appendChild(style);
    }
};


const loadSettings = async (forceApply = false) => {
    const stored = await chrome.storage.sync.get(STORAGE_KEY);
    
    // Merge stored settings with ALL_FEATURES defaults
    if (stored[STORAGE_KEY] && stored[STORAGE_KEY].length) {
        const storedMap = new Map(stored[STORAGE_KEY].map(f => [f.id, f]));
        currentSettings = ALL_FEATURES.map(defaultFeature => {
            const storedFeature = storedMap.get(defaultFeature.id);
            if (storedFeature) {
                // Overwrite default actionValue with stored value
                return { ...defaultFeature, ...storedFeature };
            }
            return defaultFeature;
        });
    } else if (forceApply) {
        // If storage is empty but we are forced to apply, use defaults.
        currentSettings = ALL_FEATURES.map((f, i) => ({ ...f, order: i + 1, active: true, actionValue: f.actionValue || 100 }));
    }

    if (currentSettings.length > 0) {
        applyAllSettings();
    }
};

const applyAllSettings = () => {
    // Reset global styles first before applying new ones
    document.documentElement.style.removeProperty('--custom-font-scale');
    document.documentElement.style.removeProperty('--custom-letter-spacing');
    document.body.style.removeProperty('filter');

    // Apply active features by calling their specific applyLogic function
    const activeFeatures = currentSettings
        .filter(f => f.active)
        .sort((a, b) => a.order - b.order);

    activeFeatures.forEach(feature => {
        if (feature.applyLogic) {
            feature.applyLogic(feature);
        }
    });
};

// --- 3. MESSAGE LISTENER ---
// Listens for messages from the popup (popup.js) whenever a setting is changed.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "APPLY_SETTINGS") {
        // Reload settings from storage and apply them to the current page immediately
        loadSettings(true); 
    }
});


// --- 4. INITIAL EXECUTION ---

// Inject styles immediately (document_start)
injectStyles(); 
// Apply stored settings once the entire page content is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});
