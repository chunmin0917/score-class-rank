// Allow users to open the sidebar by clicking the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

/**
 * Inject content script in all tabs when the extension is installed or updated
 * need below permissions in manifest.json:
 * "host_permissions": [
        "<all_urls>"
    ],
    comment it for safe
 */
// chrome.runtime.onInstalled.addListener(async () => {
//   console.log("chrome.runtime.onInstalled event fired!");
//   const tabs = await chrome.tabs.query({});
//   tabs.forEach(({ id: tabId }) => {
//     console.log("Injecting content scripts into tabs:", tabId);
//     chrome.scripting
//       .executeScript({
//         target: { tabId },
//         files: ["content_scripts/parseScore.js", "content_scripts/content.js"],
//       })
//       .catch((error) => console.log("Injection failed:", error))
//   });
// });

console.log("Service worker is loaded!");