import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent FOUC by showing content only after styles load
window.addEventListener('load', () => {
  document.documentElement.classList.add('loaded');
});

// Fallback: show content after a short delay in case load event doesn't fire
setTimeout(() => {
  document.documentElement.classList.add('loaded');
}, 100);

createRoot(document.getElementById("root")!).render(<App />);
