// popup.js
document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    chrome.storage.sync.get(['yourlsApiUrl', 'yourlsSignature'], function(result) {
      if (result.yourlsApiUrl) {
        document.getElementById('apiUrl').value = result.yourlsApiUrl;
      }
      if (result.yourlsSignature) {
        document.getElementById('signature').value = result.yourlsSignature;
      }
    });
    
    // Save settings
    document.getElementById('saveButton').addEventListener('click', function() {
      const apiUrl = document.getElementById('apiUrl').value;
      const signature = document.getElementById('signature').value;
      
      chrome.storage.sync.set({
        yourlsApiUrl: apiUrl,
        yourlsSignature: signature
      }, function() {
        // Show saved message
        const status = document.getElementById('status');
        status.style.display = 'block';
        setTimeout(function() {
          status.style.display = 'none';
        }, 2000);
      });
    });
  });