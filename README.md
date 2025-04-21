# YOURLS URL Shortener Browser Extension

A browser extension that lets you quickly shorten URLs using your own [YOURLS](https://yourls.org/) (Your Own URL Shortener) instance.

## Features

- **Simple right-click shortening**: Right-click on any link, text, image, or element to shorten its URL
- **Intelligent URL detection**: Works with:
  - Regular hyperlinks
  - Selected text containing URLs
  - Markdown-style links
  - HTML links
  - Images
  - Buttons
  - Any clickable element that leads to a URL
- **Clipboard integration**: Automatically copies shortened URLs to your clipboard
- **Custom YOURLS integration**: Use your own YOURLS instance with your own domain

## Installation

### Chrome/Edge/Brave
1. Download this repository as a ZIP file or clone it
2. Unzip the file (if you downloaded the ZIP)
3. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
4. Enable "Developer mode" (toggle in the top-right corner)
5. Click "Load unpacked" and select the extension folder

### Firefox
1. Download this repository as a ZIP file or clone it
2. Unzip the file (if you downloaded the ZIP)
3. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on" and select any file from the extension folder

## Configuration

Before using the extension, you need to configure it with your YOURLS instance details:

1. Click the extension icon in your browser toolbar
2. Enter your YOURLS API URL (e.g., `https://yourdomain.com/yourls-api.php`)
3. Enter your signature token (found in your YOURLS admin interface)
4. Click "Save Settings"

To find your signature token:
1. Log in to your YOURLS admin interface
2. Go to Tools → API
3. Look for your signature token or generate a new one

## Usage

### Shortening a URL
1. Right-click on any link, text, image, or element that contains a URL
2. Select "Shorten URL" from the context menu
3. The shortened URL will be automatically copied to your clipboard
4. A notification will appear confirming the URL has been shortened

### Works with:
- Regular links: Right-click on any hyperlink
- Text: Select text containing a URL, then right-click
- Markdown links: Select text with a markdown link `[text](url)`, then right-click
- Images: Right-click on any image
- Buttons: Right-click on buttons that lead to URLs
- Any element: Right-click on any element that may contain a URL

## Privacy and Permissions

This extension requires the following permissions:
- **storage**: To save your YOURLS API configuration
- **clipboardWrite/clipboardRead**: To copy shortened URLs to your clipboard
- **activeTab**: To interact with the current webpage
- **contextMenus**: To add the "Shorten URL" option to the right-click menu
- **notifications**: To display confirmation when a URL is shortened

## Troubleshooting

### URL not shortening
- Verify your YOURLS API URL and signature token are correct
- Ensure your YOURLS instance is online and accessible
- Check that your YOURLS instance allows API access

### Context menu option not appearing
- Restart your browser
- Reinstall the extension

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the extension.

## Credits

- Icon: Simplified link icon for easy recognition
- Created by Sharky999
- Built for the YOURLS community 