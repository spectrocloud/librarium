export {};

declare module "*.module.scss";

declare module "*.png";

interface Mendable {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  initialize: (config: any) => void;
  // Add other methods or properties as needed
}

// Extend the global Window interface
declare global {
  interface Window {
    Mendable: Mendable;
  }
}
