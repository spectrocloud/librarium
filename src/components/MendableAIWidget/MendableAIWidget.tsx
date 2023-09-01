import { useEffect } from "react";
import spectrocloudLogo from "@site/static/assets/spectrocloud-logo.png";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import spectrologoUser from "@site/static/assets/spectrocloud-logo-black.svg";

export const MENDABLE_SCRIPT_URL =
  "https://unpkg.com/@mendable/search@0.0.125/dist/umd/mendable-bundle.min.js";

export default function MendableAIWidget() {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = MENDABLE_SCRIPT_URL;
    script.defer = true;

    setTimeout(() => {
      document.body.appendChild(script);
    }, 500);

    script.onload = () => {
      if (window.Mendable) {
        window.Mendable.initialize({
          anon_key: customFields?.mendableKey,
          type: "floatingButton",
          dialogPlaceholder: "What is Palette?",
          floatingButtonStyle: {
            color: "#FFFFFF",
            backgroundColor: "#3E4FB5",
            icon: spectrocloudLogo as string,
            botIcon: spectrologoUser,
            isPinnable: true,
          },
          style: { accentColor: "#3E4FB5" },
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
