import "./popup/style.css";
import ReactDOM from "react-dom/client";
import App from "./popup/App";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    let root: ReactDOM.Root | null; // Declare root to store the ReactDOM root reference

    const ui = await createShadowRootUi(ctx, {
      name: "example-ui",
      position: "inline",
      onMount: (container) => {
        const observer = new MutationObserver((mutations, obs) => {
          const chatboxInput = document.querySelector(
            ".msg-form__msg-content-container"
          );
          if (chatboxInput) {
            const app = document.createElement("div");
            app.id = "react-extension-container";
            app.style.position = "absolute";
            app.style.top = "72px";
            app.style.right = "45px";
            app.style.zIndex = "9999";

            chatboxInput.append(app);

            const shadowRoot = app.attachShadow({ mode: "open" });

            // Injecting Tailwind CSS
            const styleTag = document.createElement("style");
            styleTag.textContent = `@import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");`;
            shadowRoot.appendChild(styleTag);

            const shadowApp = document.createElement("div");
            shadowRoot.appendChild(shadowApp);

            root = ReactDOM.createRoot(shadowApp);
            root.render(<App />);

            obs.disconnect();
          }
        });

        observer.observe(document, {
          childList: true,
          subtree: true,
        });
      },
      onRemove: () => {
        // Properly unmount the root if it exists
        if (root) {
          root.unmount(); // Unmount the React app
          root = null; // Clean up the reference
        }
      },
    });

    ui.mount();
  },
});
