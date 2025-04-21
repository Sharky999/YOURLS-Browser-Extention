// background.js
// Create context menu item on extension install
chrome.runtime.onInstalled.addListener(function() {
  // Single context menu item for all URL shortening
  chrome.contextMenus.create({
    id: "shortenUrl",
    title: "Shorten URL",
    contexts: ["all"] // Show on all elements
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // Determine which URL to shorten based on available info
  let urlToShorten = '';
  
  // Use the most appropriate URL source
  if (info.linkUrl) {
    // It's a regular link
    urlToShorten = info.linkUrl;
    shortenUrlViaContent(tab.id, urlToShorten);
  } else if (info.selectionText) {
    // Selected text might contain a URL
    chrome.tabs.sendMessage(tab.id, {
      action: "shortenTextUrl",
      text: info.selectionText
    });
  } else if (info.srcUrl) {
    // It's an image or media element with src
    urlToShorten = info.srcUrl;
    shortenUrlViaContent(tab.id, urlToShorten);
  } else {
    // It might be a button, custom element, or just the page itself
    chrome.tabs.sendMessage(tab.id, {
      action: "shortenElementUrl"
    });
  }
});

// Function to send URL to content script for shortening
function shortenUrlViaContent(tabId, url) {
  chrome.tabs.sendMessage(tabId, {
    action: "shortenLinkFromContextMenu",
    url: url
  }, function(response) {
    if (response && response.success) {
      // Show a notification that URL was shortened
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/link_icon.png",
        title: "URL Shortened",
        message: "Short URL copied to clipboard"
      });
    }
  });
}

// Handle messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'shortenUrl') {
    const url = request.url;
    const config = request.config;
    
    if (!config || !config.apiUrl || !config.signature) {
      sendResponse({ error: 'Configuration missing' });
      return false;
    }
    
    // Call YOURLS API
    fetch(`${config.apiUrl}?signature=${config.signature}&action=shorturl&format=json&url=${encodeURIComponent(url)}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && data.shorturl) {
          sendResponse({ shortUrl: data.shorturl });
        } else {
          sendResponse({ error: 'Failed to shorten URL' });
        }
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });
    
    // Keep the message channel open for the async response
    return true;
  } else if (request.action === 'showNotification') {
    // Show notification when content script requests it
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/link_icon.png",
      title: "URL Shortened",
      message: "Short URL copied to clipboard"
    });
  }
});