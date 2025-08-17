
import React from "react";
import ReactDOM from "react-dom";

const ExampleReactComponent = () => {
  return <div className="text-red-500">Hello World</div>;
};



document.addEventListener("DOMContentLoaded", () => {
  // console.log("DOMContentLoaded");
  // alert("DOMContentLoaded");

  if (document.querySelector("#render-react-example-here")) {
    ReactDOM.render(
      <ExampleReactComponent />,
      document.querySelector("#render-react-example-here"),
    );
  } else {
    console.log("🚀 ~ No element found")
  }
});