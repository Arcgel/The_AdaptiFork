Contributing to 🍴 The AdaptiFork

Project Overview

A highly modular and contributor-friendly browser extension that acts as a customizable accessibility hub for the web, featuring decoupled architecture and a clear path for feature expansion.

⚙️ Installation (For Development)
Since this project is a browser extension, you need to load it directly into your browser's Developer Mode for testing and development.

Clone the Repository: Download or clone the entire project folder locally.

Open Extensions: Navigate to your browser's extension management page (e.g., chrome://extensions or edge://extensions).

Enable Developer Mode: Toggle the Developer mode switch (usually found in the top right corner).

Load Unpacked: Click the Load unpacked button.

Select Folder: Select the root directory of the project (the folder containing manifest.json, popup.html, etc.).

Testing: Go to any live webpage and click the extension icon in your toolbar to open the custom popup.

🚀 How to Add a New Feature (The "Forking" Process)
We're excited you want to help expand The AdaptiFork! The core design of this extension separates features into modular, self-contained definitions. This makes adding a new accessibility tool extremely fast and efficient. You only need to modify two files: popup.js and content.js.

Step 1: Define the Feature in popup.js
Open the popup.js file and locate the global ALL_FEATURES array near the top. Add a new object to this array following the modular format.

Property

Description

Example Value

id

Required. Unique identifier (kebab-case).

'inverted-colors'

label

The title displayed in the popup.

'Inverted Colors'

icon

The icon displayed on the tile (use Emojis or simple characters).

'🔄'

type

How the feature interacts (toggle, slider, action).

'toggle'

grid_space

The width the tile takes up in the grid (up to 4).

2

actionValue

The default/initial state (false, 100, 0).

false

unit

Unit for sliders/values (if applicable).

''

Example of a New Feature Object:

{
    id: 'inverted-colors',
    label: 'Inverted Colors',
    icon: '🔄',
    type: 'toggle',
    grid_space: 2,
    actionValue: false, // Default is OFF
    unit: ''
},

Step 2: Implement the Logic in popup.js
In popup.js, you must define the actionLogic function. This function handles what happens when the user clicks the tile.

Locate the handleTileClick function in popup.js.

Add a case to the switch statement for your new feature's id.

// Inside handleTileClick in popup.js
case 'inverted-colors':
    // If it's a toggle, flip the boolean actionValue
    feature.actionValue = !feature.actionValue;
    break;

Step 3: Implement the Application Logic in content.js
The content.js file is responsible for applying the actual CSS effects to the live webpage.

Open content.js and locate the global ALL_FEATURES array. You must add the exact same object definition here that you created in Step 1.

Add the applyLogic function to your feature object.

Example of the Feature Object in content.js:

{
    id: 'inverted-colors',
    label: 'Inverted Colors',
    icon: '🔄',
    actionValue: false,
    applyLogic: (feature) => {
        // This is the code that modifies the webpage!
        if (feature.actionValue) {
            // Apply a simple CSS filter to the whole document body
            document.body.style.filter += ' invert(100%)';
        }
    }
},

💡 Best Practices
Tailwind CSS: All UI elements injected or styled within the popup should use Tailwind classes for responsive design and aesthetic consistency.

CSS Variables: For effects on the webpage (in content.js), always try to use CSS Variables (e.g., --custom-font-scale) applied to the document.documentElement (:root). This makes the effects easy to reset and manage.

Persistence: Do not worry about saving data! The core logic in popup.js handles saving and loading your feature's actionValue automatically.