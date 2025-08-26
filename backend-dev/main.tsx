import React from "react";
import { createRoot } from "react-dom/client";
import Settings from "./pages/settings";
import Dashboard from "./pages/dashboard";

function mountReact(Component: React.FC, host: HTMLElement, cssHref: string) {
  const shadowRoot = host.attachShadow({ mode: "open" });

  // Inject your admin CSS (the one you enqueue with wp_enqueue_style)
  const linkEl = document.createElement("link");
  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", cssHref);
  shadowRoot.appendChild(linkEl);

  // Create a React root container inside shadow
  const container = document.createElement("div");
  shadowRoot.appendChild(container);

  // Mount React into that container
  const root = createRoot(container);
  root.render(<Component />);
}

document.addEventListener("DOMContentLoaded", () => {
  const settingsDiv = document.querySelector("#pika-settings");
  if (settingsDiv && (window as any).pikaAdmin?.cssUrl) {
    mountReact(Settings, settingsDiv as HTMLElement, (window as any).pikaAdmin.cssUrl);
  }

  const dashboardDiv = document.querySelector("#pika-dashboard");
  if (dashboardDiv && (window as any).pikaAdmin?.cssUrl) {
    mountReact(Dashboard, dashboardDiv as HTMLElement, (window as any).pikaAdmin.cssUrl);
  }
});
