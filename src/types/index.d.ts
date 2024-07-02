export {};

declare module "*.module.scss";

declare module "*.png";

declare module '*.md' {
  const value: string; // markdown is just a string
  export default value;
}

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
