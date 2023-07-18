import React, { useEffect } from "react";
import spectrocloudLogo from "assets/spectrocloud-logo.png";
import spectrologoUser from "assets/spectrocloud-logo-black.svg";
export const MENDABLE_SCRIPT_URL =
  "https://unpkg.com/@mendable/search@0.0.125/dist/umd/mendable-bundle.min.js";

export default function MendableAIWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = MENDABLE_SCRIPT_URL;
    script.async = true;

    document.body.appendChild(script);
    script.onload = () => {
      if (window.Mendable) {
        window.Mendable.initialize({
          anon_key: process.env.GATSBY_MENDABLE_API_KEY,
          type: "floatingButton",
          dialogPlaceholder: "What is Palette?",
          floatingButtonStyle: {
            color: "#FFFFFF",
            backgroundColor: "#3E4FB5",
          },
          botIcon: spectrologoUser,
          isPinnable: true,
          icon: spectrocloudLogo,
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
