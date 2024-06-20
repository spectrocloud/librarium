// import { useEffect } from "react";
// import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
// import useBaseUrl from "@docusaurus/useBaseUrl";

// export const MENDABLE_SCRIPT_URL = "https://unpkg.com/@mendable/search@0.0.205/dist/umd/mendable-bundle.min.js";

export default function MendableAIWidget() {
  // const {
  //   siteConfig: { customFields },
  // } = useDocusaurusContext();

  // const logoUrl = useBaseUrl("/spectrocloud-logo.png");
  // const botUrl = useBaseUrl("/spectrocloud-logo-black.svg");

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = MENDABLE_SCRIPT_URL;
  //   script.defer = true;

  //   setTimeout(() => {
  //     document.body.appendChild(script);
  //   }, 500);

  //   script.onload = () => {
  //     if (window.Mendable) {
  //       window.Mendable.initialize({
  //         anon_key: customFields?.mendableKey,
  //         type: "floatingButton",
  //         dialogPlaceholder: "What is Palette?",
  //         welcomeMessage: "Ask me anything about Palette",
  //         cmdShortcutKey: "l",
  //         icon: logoUrl,
  //         botIcon: botUrl,
  //         isPinnable: true,
  //         floatingButtonStyle: {
  //           color: "#FFFFFF",
  //           backgroundColor: "#3E4FB5",
  //         },
  //         style: { accentColor: "#3E4FB5" },
  //       });
  //     }
  //   };

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return null;
}
