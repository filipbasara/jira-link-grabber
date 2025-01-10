// Create a context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "parseLinks",
        title: "Parse Links for Teams",
        contexts: ["all"]
    });
});


// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "parseLinks") {
        parseLinks(tab.id);
    }
});

// Listen for keyboard shortcut commands
chrome.commands.onCommand.addListener((command, tab) => {
    if (command === "parse_links") {
        parseLinks(tab.id);
    }
});

// Function to inject the content script and parse links
function parseLinks(tabId) {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabId },
            files: ["content.js"]
        },
        () => {
            console.log("Content script executed.");
        }
    );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "show_notification") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "assets/icon.png", // Path to your extension icon
            title: message.title,
            message: message.message
        });
    }
});
