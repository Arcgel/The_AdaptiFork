// ===========================
// Background Service Worker
// ===========================

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Ultimate Web Toolkit installed!');
        
        // Set default settings
        chrome.storage.local.set({
            toolkitSettings: {},
            categoryVisibility: {
                visual: true,
                typography: true,
                layout: true,
                reading: true,
                color: true,
                animations: true,
                productivity: true
            }
        });
        
        // Open welcome page
        chrome.tabs.create({
            url: 'https://github.com'
        });
    }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getSettings') {
        chrome.storage.local.get('toolkitSettings', (result) => {
            sendResponse({ settings: result.toolkitSettings || {} });
        });
        return true;
    }
    
    if (message.action === 'saveSettings') {
        chrome.storage.local.set({ toolkitSettings: message.settings }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

// Keep service worker alive
chrome.runtime.onConnect.addListener((port) => {
    console.log('Connected to port:', port.name);
});

console.log('Ultimate Web Toolkit - Background Service Worker Active');
