// --- 1. CORE CONFIGURATION: MODULAR FEATURE DEFINITIONS ---
// This configuration is repeated here so the popup can render tiles without cross-file dependencies.
const ALL_FEATURES = [
    {
        id: 'font-size',
        label: 'Text Size',
        icon: 'A+', 
        tailwindClass: 'col-span-2', 
        type: 'action',
        initialValue: 100, 
        unit: '%',
        // Logic remains the same, but execution context is the popup.
        actionLogic: (feature) => {
            const nextScale = feature.actionValue >= 120 ? 100 : feature.actionValue + 10;
            feature.actionValue = nextScale;
            return feature;
        }
    },
    {
        id: 'brightness',
        label: 'Brightness',
        icon: '☀️',
        tailwindClass: 'col-span-2', 
        type: 'slider', 
        initialValue: 100, 
        min: 20,
        max: 100,
        unit: '%',
        actionLogic: (feature) => feature // Sliders handle interaction internally
    },
    {
        id: 'high-contrast',
        label: 'High Contrast',
        icon: '⚫⚪',
        tailwindClass: 'col-span-1', 
        type: 'toggle',
        initialValue: false,
        actionLogic: (feature) => {
            feature.actionValue = !feature.actionValue;
            return feature;
        }
    },
    {
        id: 'letter-spacing',
        label: 'Spacing',
        icon: '↔',
        tailwindClass: 'col-span-1',
        type: 'action',
        initialValue: 0, 
        unit: 'px',
        actionLogic: (feature) => {
            const nextSpacing = feature.actionValue >= 2 ? 0 : feature.actionValue + 1;
            feature.actionValue = nextSpacing;
            return feature;
        }
    }
];

// --- 2. SETUP & STATE MANAGEMENT (Local to Popup) ---

const STORAGE_KEY = 'accessibilityHubSettings';
let currentSettings = [];

const loadSettings = async () => {
    // 1. Load from storage
    const stored = await chrome.storage.sync.get(STORAGE_KEY);
    
    if (stored[STORAGE_KEY] && stored[STORAGE_KEY].length) {
        const storedMap = new Map(stored[STORAGE_KEY].map(f => [f.id, f]));
        currentSettings = ALL_FEATURES.map(defaultFeature => {
            const storedFeature = storedMap.get(defaultFeature.id);
            if (storedFeature) {
                return { ...defaultFeature, ...storedFeature };
            }
            return defaultFeature;
        });
    } else {
        // Use default configuration
        currentSettings = ALL_FEATURES.map((f, i) => ({ ...f, order: i + 1, active: true, actionValue: f.initialValue }));
        await saveSettings();
    }
    
    // 2. Render the panel
    renderPanel();
};

const saveSettings = async (shouldClose = false) => {
    // Only save the dynamic parts of the feature (active, order, actionValue)
    const savableSettings = currentSettings.map(f => ({
        id: f.id,
        active: f.active,
        order: f.order,
        actionValue: f.actionValue
    }));

    await chrome.storage.sync.set({ [STORAGE_KEY]: savableSettings });
    
    // Send a message to the active tab's content script to tell it to re-apply the new settings immediately.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "APPLY_SETTINGS" });
        }
    });
    
    // Re-render the panel UI in the popup
    renderPanel();

    if (shouldClose) {
        // Close the popup after a save operation in the edit modal
        window.close();
    }
};

// --- 3. UI RENDERING (Popup) ---

const renderPanel = () => {
    const panel = document.getElementById('accessibility-hub-panel');
    const editModal = document.getElementById('accessibility-hub-edit-modal');
    
    // Ensure we are in the main panel view
    editModal.classList.add('hidden');
    panel.classList.remove('hidden');

    panel.innerHTML = ''; // Clear previous content

    const activeFeatures = currentSettings
        .filter(f => f.active)
        .sort((a, b) => a.order - b.order);

    // 1. Grid container for tiles
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-4 gap-2 mb-2';
    panel.appendChild(gridContainer);
    
    activeFeatures.forEach(feature => {
        const valueDisplay = feature.type === 'toggle' ? (feature.actionValue ? 'ON' : 'OFF') : `${feature.actionValue}${feature.unit}`;
        
        const tile = document.createElement('div');
        tile.className = `acc-tile ${feature.tailwindClass} p-2 bg-white border border-gray-200 rounded-lg text-center cursor-pointer shadow-sm hover:bg-blue-50 transition duration-150 relative group`;
        tile.dataset.id = feature.id;
        tile.dataset.type = feature.type;
        tile.title = feature.label;
        tile.innerHTML = `
            <span class="text-xl font-bold block text-blue-600">${feature.icon}</span>
            <span class="text-xs font-semibold text-gray-700 block mt-1 leading-none">${feature.label}</span>
            <span class="text-[10px] text-gray-500 block leading-none mt-0.5">${valueDisplay}</span>
        `;
        
        // Attach feature interaction listener
        tile.addEventListener('click', (e) => handleFeatureAction(e.currentTarget.dataset.id));
        gridContainer.appendChild(tile);
    });
    
    // 2. Edit Button Section
    const editButton = document.createElement('div');
    editButton.id = 'panel-edit-button';
    editButton.className = 'text-center pt-2 border-t border-gray-100 cursor-pointer text-blue-600 font-medium text-sm hover:text-blue-800 transition';
    editButton.textContent = 'Edit Tiles';
    panel.appendChild(editButton);
    
    // Attach edit button listener
    editButton.addEventListener('click', renderEditModal);
};


// --- 4. TILE INTERACTION HANDLER ---

const handleFeatureAction = (featureId) => {
    const featureIndex = currentSettings.findIndex(f => f.id === featureId);
    if (featureIndex === -1) return;

    let feature = currentSettings[featureIndex];

    if (feature.actionLogic) {
        feature = feature.actionLogic(feature); 
    }
    
    currentSettings[featureIndex] = feature;
    saveSettings(); 
};


// --- 5. CUSTOMIZATION VIEW (Edit Modal) ---

const renderEditModal = () => {
    const modal = document.getElementById('accessibility-hub-edit-modal');
    const panel = document.getElementById('accessibility-hub-panel');
    
    // Switch to modal view
    panel.classList.add('hidden');
    modal.classList.remove('hidden');

    const activeTiles = currentSettings
        .filter(f => f.active)
        .sort((a, b) => a.order - b.order);

    const unusedTiles = currentSettings
        .filter(f => !f.active)
        .sort((a, b) => a.order - b.order);
    
    const maxActiveOrder = activeTiles.length > 0 ? activeTiles[activeTiles.length - 1].order : 0;

    let html = `
        <div class="edit-content bg-white p-6 md:p-8 rounded-xl w-full max-w-full shadow-2xl space-y-4">
            <h2 class="text-2xl font-bold text-gray-800 border-b pb-2">Customize Control Center</h2>
            <p class="text-sm text-gray-500">Drag tiles to reorder them in the panel. Use the buttons to add or remove features.</p>
            
            <div class="space-y-3">
                <h3 class="text-lg font-semibold text-blue-600">Active Tiles (Your Panel)</h3>
                <div id="active-tiles-grid" 
                     class="tile-grid grid grid-cols-4 gap-2 bg-gray-100 p-3 rounded-lg min-h-[100px]" 
                     ondragover="event.preventDefault();"
                >
                    ${activeTiles.map(tileToEditHTML).join('')}
                </div>
            </div>

            <div class="space-y-3">
                <h3 class="text-lg font-semibold text-gray-600">Available Tiles</h3>
                <div id="unused-tiles-list" class="tile-list flex flex-wrap gap-2 bg-gray-50 p-3 rounded-lg">
                    ${unusedTiles.map(tileToEditHTML).join('')}
                </div>
            </div>
            
            <button id="close-edit-modal" class="w-full py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition duration-150">Done & Close</button>
        </div>
    `;
    modal.innerHTML = html;
    
    // --- Attach Listeners ---
    modal.querySelector('#close-edit-modal').addEventListener('click', handleSaveAndCloseEdit);
    
    modal.querySelectorAll('.edit-button').forEach(btn => {
        btn.addEventListener('click', (e) => handleEditToggle(e, maxActiveOrder));
    });

    // Simple Drag/Drop implementation for reordering (within Active Tiles)
    const activeGrid = modal.querySelector('#active-tiles-grid');
    let dragSrcEl = null;

    const handleDragStart = (e) => {
        e.target.classList.add('opacity-40');
        dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'move';
        return false;
    };

    const handleDrop = (e) => {
        e.stopPropagation();
        const dropTarget = e.target.closest('.edit-tile');
        if (dragSrcEl !== dropTarget && dropTarget) {
            const dragId = dragSrcEl.dataset.id;
            const dropId = dropTarget.dataset.id;
            
            const dragIndex = currentSettings.findIndex(f => f.id === dragId);
            const dropIndex = currentSettings.findIndex(f => f.id === dropId);
            
            // Swap orders
            const tempOrder = currentSettings[dragIndex].order;
            currentSettings[dragIndex].order = currentSettings[dropIndex].order;
            currentSettings[dropIndex].order = tempOrder;

            renderEditModal(); // Re-render to show new order
        }
        return false;
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('opacity-40');
    };

    activeGrid.querySelectorAll('.edit-tile').forEach(tile => {
        tile.addEventListener('dragstart', handleDragStart);
        tile.addEventListener('dragover', handleDragOver);
        tile.addEventListener('drop', handleDrop);
        tile.addEventListener('dragend', handleDragEnd);
    });

};

const tileToEditHTML = (feature) => {
    const isRemove = feature.active;
    const buttonClass = isRemove ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';
    
    // Apply grid space class for active tiles to match panel
    const tileClasses = isRemove ? `${feature.tailwindClass} p-2` : 'p-2';

    return `
        <div class="edit-tile ${tileClasses} bg-white border border-gray-300 rounded-lg flex items-center justify-between text-sm shadow-sm" data-id="${feature.id}" draggable="${isRemove}">
            <div class="flex items-center space-x-2">
                <span class="text-lg font-semibold text-blue-600">${feature.icon}</span>
                <span class="font-medium text-gray-800">${feature.label}</span>
            </div>
            <button class="edit-button ${buttonClass} text-white font-bold rounded-full w-6 h-6 flex items-center justify-center transition duration-150" data-id="${feature.id}" data-action="${isRemove ? 'remove' : 'add'}">
                ${isRemove ? '−' : '+'}
            </button>
        </div>
    `;
};

const handleEditToggle = (e, maxActiveOrder) => {
    const id = e.currentTarget.dataset.id;
    const action = e.currentTarget.dataset.action;
    const index = currentSettings.findIndex(f => f.id === id);

    if (index === -1) return;

    if (action === 'add') {
        currentSettings[index].active = true;
        currentSettings[index].order = maxActiveOrder + 1;
    } else if (action === 'remove') {
        currentSettings[index].active = false;
        currentSettings[index].order = 999; 
    }
    
    // Re-render the edit modal immediately after a change
    renderEditModal(); 
};

const handleSaveAndCloseEdit = () => {
    // 1. Re-normalize the 'order' field for all active tiles
    const active = currentSettings
        .filter(f => f.active)
        .sort((a, b) => a.order - b.order);

    active.forEach((f, i) => f.order = i + 1); 
    
    // Pass 'true' to indicate the popup should close after saving
    saveSettings(true); 
};


// --- 6. INITIAL EXECUTION ---
document.addEventListener('DOMContentLoaded', loadSettings);
