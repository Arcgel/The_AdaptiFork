// --- 1. CORE CONFIGURATION: MODULAR FEATURE DEFINITIONS ---
const ALL_FEATURES = [
    {
        id: 'font-size-px',
        label: 'Text Size',
        icon: 'A+',
        // actionValue will now hold the desired font size in pixels (e.g., 16 = normal)
        actionValue: 16, // Default to normal size (16px)
        
        // actionLogic should be updated to return the selected pixel value, 
        // assuming it comes from a radio button group.
        // For this example, we keep it simple, but in a real UI, this would handle the radio input change.
        actionLogic: (feature) => feature, 

        applyLogic: (feature) => {
            // Get the pixel value directly from actionValue
            const fontSizePx = feature.actionValue; 

            // Apply the chosen pixel value directly to the root element's font-size
            document.documentElement.style.setProperty(
                'font-size',
                `${fontSizePx}px` // Set the font size using the pixel value
            );

            // Optionally, remove the scaling variable if it's no longer used
            document.documentElement.style.removeProperty('--custom-font-scale'); 
        }
    },

    // 🌟 NEW FEATURE: DARK MODE
    {
        id: 'dark-mode',
        label: 'Dark Mode',
        icon: '🌙',
        actionValue: false, // Boolean: true/false
        actionLogic: (feature) => feature,
        applyLogic: (feature) => {
            if (feature.actionValue) {
                // Returns the filter string for combination
                return 'invert(100%) hue-rotate(180deg)';
            }
            return ''; 
        }
    },
    
    // 🌟 NEW FEATURE: MEDIA VOLUME CONTROL (FIXED)
    {
        id: 'volume-master',
        label: 'Volume Master',
        icon: '🔊',
        actionValue: 100, // Percentage (0 to 100)
        actionLogic: (feature) => feature,
        applyLogic: (feature) => {
            // Volume is not a CSS property, so we handle it outside the filter chain.
            const volume = feature.actionValue / 100; 

            const applyVolume = (media) => {
                 // Volume property maxes out at 1.0 (100%). We can only *boost* up to 1.0.
                 // The system volume control is a facade.
                 media.volume = Math.min(1.0, Math.max(0.0, volume));
            };
            
            // Apply to existing media elements
            document.querySelectorAll('audio, video').forEach(applyVolume);

            // Optional: If you want to handle dynamically added media elements,
            // you'd typically use a MutationObserver here, but for simplicity
            // we rely on the extension reloading settings when the popup closes.
        }
    },

    {
        id: 'brightness',
        label: 'Brightness',
        icon: '☀️',
        actionValue: 100,
        actionLogic: (feature) => feature,
        applyLogic: (feature) => {
             // Only return a brightness filter if it's not the default 100%
            return feature.actionValue === 100 ? '' : `brightness(${feature.actionValue / 100})`;
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
                return 'grayscale(100%) contrast(150%)'; 
            }
            return ''; 
        }
    },
    {
        id: 'letter-spacing',
        label: 'Spacing',
        icon: '↔',
        actionValue: 0,
        actionLogic: (feature) => feature,
        applyLogic: (feature) => {
             // APPLY FIX: Spacing logic is correct, no change needed here.
            document.documentElement.style.setProperty('--custom-letter-spacing', `${feature.actionValue}px`);
        }
    }
];

// --- 2. SETUP & STATE MANAGEMENT (Content Script) ---

const STORAGE_KEY = 'accessibilityHubSettings';
let currentSettings = [];

// Inject styles (Removed CDN for Mv3 compliance, keeping only custom styles)
const injectStyles = () => {
    // NOTE: The Tailwind CDN injection code MUST BE REMOVED from the final product
    // to comply with Manifest V3 CSP rules. For now, I'm keeping your style injection.

    // --- Inject custom base styles ---
    if (!document.getElementById('acc-hub-base-styles')) {
        const style = document.createElement('style');
        style.id = 'acc-hub-base-styles';
        style.innerHTML = `
            /* --- Accessibility Hub Global Variables --- */
            :root {
                --custom-font-scale: 1;
                --custom-letter-spacing: 0px;
            }

            /* --- Tailwind-Compatible Font Scaling (Applies Font Size & Spacing) --- */
            html {
                font-size: calc(16px * var(--custom-font-scale, 1)) !important;
                transition: font-size 0.25s ease-in-out;
            }

            /* --- Apply Letter Spacing to Common Text Elements --- */
            p, a, span, div, h1, h2, h3, h4, h5, h6 {
                letter-spacing: var(--custom-letter-spacing, 0px) !important;
                transition: letter-spacing 0.25s ease-in-out;
            }

            /* --- Transition Filters (Brightness/Contrast/Dark Mode) --- */
            body {
                transition: filter 0.25s ease-in-out;
            }

            /* --- Dark Mode Exception: Prevents images and media from being inverted twice --- */
            /* NOTE: This relies on the 'acc-hub-dark-mode' class being added to <body> */
            body.acc-hub-dark-mode {
                filter: none; /* Reset body filter to apply composition */
            }

            body.acc-hub-dark-mode img, 
            body.acc-hub-dark-mode video {
                filter: invert(100%) hue-rotate(180deg);
            }
        `;

        const target = document.head || document.documentElement;
        if (target) {
            target.appendChild(style);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                (document.head || document.documentElement).appendChild(style);
            });
        }
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
                return { ...defaultFeature, ...storedFeature };
            }
            return defaultFeature;
        });
    } else if (forceApply || !stored[STORAGE_KEY]) {
        // If storage is empty or non-existent, initialize with defaults
        currentSettings = ALL_FEATURES.map((f, i) => ({ 
            ...f, 
            order: i + 1, 
            active: true, 
            // Use the feature's default actionValue, or 100 if undefined
            actionValue: f.actionValue === undefined ? 100 : f.actionValue
        }));
        // Store the initial default settings
        await chrome.storage.sync.set({ [STORAGE_KEY]: currentSettings });
    }

    if (currentSettings.length > 0) {
        applyAllSettings();
    }
};

const applyAllSettings = () => {
    // --- 1. GLOBAL RESET ---
    document.documentElement.style.removeProperty('--custom-font-scale');
    document.documentElement.style.removeProperty('--custom-letter-spacing');
    document.body.style.removeProperty('filter'); 
    document.body.classList.remove('acc-hub-dark-mode'); 

    // --- 2. PREPARE FILTERS ---
    // Start with the default filter values (Identity filters)
    const filterStrings = [];

    // --- 3. APPLY ACTIVE FEATURES ---
    const activeFeatures = currentSettings
        .filter(f => f.active)
        .sort((a, b) => a.order - b.order);

    activeFeatures.forEach(feature => {
        if (feature.applyLogic) {
            const result = feature.applyLogic(feature);
            
            // Collect filter strings (used by dark-mode, brightness, high-contrast)
            if (typeof result === 'string' && result.trim() !== '') {
                filterStrings.push(result);
            }

            // Special handling for Dark Mode to add a class for exceptions
            if (feature.id === 'dark-mode' && feature.actionValue === true) {
                 document.body.classList.add('acc-hub-dark-mode');
            }
        }
    });

    // --- 4. APPLY FINAL FILTERS ---
    
    // If Dark Mode is active, we apply the inverse filter to the body, 
    // and let the CSS handle the image/media exception.
    if (document.body.classList.contains('acc-hub-dark-mode')) {
        // Find the invert filter from the collected strings
        const darkModeFilter = filterStrings.find(f => f.includes('invert(100%)'));
        
        if (darkModeFilter) {
            // Remove the dark mode filter from the main array so it's not applied twice
            const index = filterStrings.indexOf(darkModeFilter);
            filterStrings.splice(index, 1);
            
            // Apply the dark mode filter first to the body
            document.body.style.filter = darkModeFilter;

            // Now, apply the other filters (like brightness, contrast) to the body as well,
            // using the existing filter value.
            if (filterStrings.length > 0) {
                 document.body.style.filter += ' ' + filterStrings.join(' ');
            }
        }
    } 
    // If Dark Mode is NOT active, or if it failed to find the filter, apply the rest normally.
    else if (filterStrings.length > 0) {
        document.body.style.filter = filterStrings.join(' ');
    }
    
    // If no filter is needed, the style remains reset (document.body.style.filter = "")
};

// --- 3. MESSAGE LISTENER ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "APPLY_SETTINGS") {
        loadSettings(true); 
    }
});


// --- 4. INITIAL EXECUTION ---

injectStyles(); 
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});