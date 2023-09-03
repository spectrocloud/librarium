export {};

declare module "*.module.scss";

declare module "*.png";

interface Mendable {
  initialize: () => void;
  // Add other methods or properties as needed
}

// Extend the global Window interface
declare global {
  interface Window {
    Mendable: Mendable;
  }
}
