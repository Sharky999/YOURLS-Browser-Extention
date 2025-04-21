// content.js
(function() {
  // Configuration (will be loaded from storage)
  let yourlsConfig = {
    apiUrl: '',
    signature: ''
  };

  // Keep track of the last right-clicked element
  let lastRightClickedElement = null;

  // Add a listener for the contextmenu event to capture the target element
  document.addEventListener('contextmenu', function(e) {
    lastRightClickedElement = e.target;
  }, true);

  // Load configuration from storage
  chrome.storage.sync.get(['yourlsApiUrl', 'yourlsSignature'], function(result) {
    if (result.yourlsApiUrl && result.yourlsSignature) {
      yourlsConfig.apiUrl = result.yourlsApiUrl;
      yourlsConfig.signature = result.yourlsSignature;
      
      // Listen for context menu messages
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'shortenLinkFromContextMenu') {
          // Got a direct URL to shorten
          shortenUrl(request.url, function(shortUrl) {
            if (shortUrl) {
              sendResponse({ success: true, shortUrl: shortUrl });
            } else {
              sendResponse({ success: false });
            }
          });
          return true; // Keep message channel open for async response
        } else if (request.action === 'shortenElementUrl') {
          // Need to extract URL from the right-clicked element
          const url = extractUrlFromElement(lastRightClickedElement);
          if (url) {
            shortenUrl(url, function(shortUrl) {
              // Notify background script that shortening was successful
              if (shortUrl) {
                chrome.runtime.sendMessage({ action: 'showNotification' });
              }
            });
          }
        } else if (request.action === 'shortenTextUrl') {
          // Need to extract URL from selected text
          const url = extractUrlFromText(request.text);
          if (url) {
            shortenUrl(url, function(shortUrl) {
              // Notify background script that shortening was successful
              if (shortUrl) {
                chrome.runtime.sendMessage({ action: 'showNotification' });
              }
            });
          }
        }
      });
    }
  });

  // Function to extract URL from selected text
  function extractUrlFromText(text) {
    if (!text) return null;
    
    // Check for markdown link format: [text](url)
    const markdownMatch = text.match(/\[.*?\]\((.*?)\)/);
    if (markdownMatch && markdownMatch[1]) {
      return markdownMatch[1];
    }
    
    // Check for HTML link format: <a href="url">text</a>
    const htmlMatch = text.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/i);
    if (htmlMatch && htmlMatch[1]) {
      return htmlMatch[1];
    }
    
    // Check if the text itself is a URL
    if (text.match(/^(https?:\/\/|www\.)/i)) {
      // Ensure it has http/https prefix
      if (text.startsWith('www.')) {
        return 'https://' + text;
      }
      return text;
    }
    
    // If nothing else, try to see if the text looks like a URL
    if (isLikelyUrl(text)) {
      return text;
    }
    
    // No URL found
    return null;
  }

  // Function to extract URL from an element
  function extractUrlFromElement(element) {
    if (!element) return window.location.href; // Default to current page
    
    // Try to extract URL from various element attributes and properties
    
    // 1. Check if it's an <a> tag
    if (element.tagName === 'A' && element.href) {
      return element.href;
    }
    
    // 2. Check if it's a button with a data-url attribute or onClick that contains a URL
    if (element.tagName === 'BUTTON' || (element.tagName === 'INPUT' && element.type === 'button')) {
      // Check data attributes for URLs
      for (const attr of element.attributes) {
        if (attr.name.startsWith('data-') && isLikelyUrl(attr.value)) {
          return attr.value;
        }
      }
      
      // Check for onclick attribute that might contain a URL
      const onClickAttr = element.getAttribute('onclick');
      if (onClickAttr) {
        const urlMatch = onClickAttr.match(/(https?:\/\/[^\s'"]+)|(www\.[^\s'"]+)/);
        if (urlMatch && urlMatch[0]) {
          return urlMatch[0];
        }
      }
    }
    
    // 3. Check for data-* attributes that might contain URLs
    for (const attr of element.attributes) {
      if (attr.name.startsWith('data-') && isLikelyUrl(attr.value)) {
        return attr.value;
      }
      
      // Common URL-containing attributes
      if (['href', 'src', 'action', 'data-url', 'data-link', 'data-href'].includes(attr.name) && isLikelyUrl(attr.value)) {
        return attr.value;
      }
    }
    
    // 4. Check if element has textContent that looks like a URL
    if (element.textContent && isLikelyUrl(element.textContent.trim())) {
      return element.textContent.trim();
    }
    
    // 5. Check parent elements (for cases where the user clicked on a child of a link)
    if (element.parentElement) {
      return extractUrlFromElement(element.parentElement);
    }
    
    // If we can't find a URL, return the current page URL as a fallback
    return window.location.href;
  }

  // Helper function to check if a string looks like a URL
  function isLikelyUrl(str) {
    if (!str) return false;
    str = str.trim();
    return (
      str.startsWith('http://') || 
      str.startsWith('https://') || 
      str.startsWith('www.') ||
      (str.includes('.') && !str.includes(' ') && str.length > 4)
    );
  }

  // Function to shorten a URL
  function shortenUrl(url, callback) {
    // Make sure URL is properly formatted
    if (url) {
      // Ensure the URL has a protocol
      if (url.indexOf('://') === -1 && !url.startsWith('mailto:')) {
        // If it looks like a URL but has no protocol, add https
        if (url.match(/^(www\.)/i) || (url.indexOf('.') > 0 && !url.includes(' '))) {
          url = 'https://' + url;
        }
      }
    }

    // Send message to background script to handle API call
    chrome.runtime.sendMessage({
      action: 'shortenUrl',
      url: url,
      config: yourlsConfig
    }, function(response) {
      if (response && response.shortUrl) {
        // Copy to clipboard
        navigator.clipboard.writeText(response.shortUrl).then(() => {
          // If there's a callback, call it with the short URL
          if (callback) {
            callback(response.shortUrl);
          }
        }).catch(err => {
          console.error("Failed to copy to clipboard:", err);
          if (callback) {
            callback(response.shortUrl);
          }
        });
      } else {
        // If there's a callback, call it with null
        if (callback) {
          callback(null);
        }
      }
    });
  }
})();