import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    manifest_version: 3,
    web_accessible_resources: [
      {
        resources: ["/assets/frame.svg"], // Path to your SVG
        matches: ["<all_urls>"], // Specify where this resource can be accessed from
      },
    ],
    name: "LinkedIn Chat Extension",
    version: "1.0",
    permissions: ["tabs", "webNavigation", "activeTab"],
    background: {
      service_worker: "background.js",
    },

    contentScripts: [
      {
        matches: ["*://*.linkedin.com/*"], // Match LinkedIn URLs
        js: ["entrypoints/content.tsx"], // Path to your content script
        css: ["/assets/tailwind.css"], // Path to your Tailwind CSS file
      },
    ],

    action: {},
    host_permissions: ["https://www.linkedin.com/*"],
  },
});
