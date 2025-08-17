import React from "react";
import ReactDOM from "react-dom";
import Settings from "./pages/settings";
import Dashboard from "./pages/dashboard";

interface ExampleReactComponentProps {}

document.addEventListener("DOMContentLoaded", () => {
  // console.log("DOMContentLoaded");
  // alert("DOMContentLoaded");

  const settingsDiv = document.querySelector("#pika-settings");
  if (settingsDiv) {
    ReactDOM.render(
      <Settings />,
      settingsDiv,
    );
  }

  const dashboardDiv = document.querySelector("#pika-dashboard");
  if (dashboardDiv) {
    ReactDOM.render(
      <Dashboard />,
      dashboardDiv,
    );
  }
});
