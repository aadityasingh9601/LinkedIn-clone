import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MyErrorBoundary from "./components/MyErrorBoundary.jsx";
import App from "./components/App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <MyErrorBoundary fallback="There was an error loading the application.">
    <App />
  </MyErrorBoundary>
);
