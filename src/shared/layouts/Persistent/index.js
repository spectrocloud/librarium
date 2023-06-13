import React, { useEffect } from "react";
import Provider from "./provider";
import spectrocloudLogo from "assets/spectrocloud-logo.png";

const Persistent = ({ children }) => {
  useEffect(() => {
    window.Mendable &&
      window.Mendable.initialize({
        anon_key: process.env.GATSBY_MENDABLE_API_KEY,
        type: "floatingButton",
        dialogPlaceholder: "What is Palette?",
        floatingButtonStyle: {
          color: "#fff",
          backgroundColor: "#3E4FB5",
        },
        icon: spectrocloudLogo,
        style: { accentColor: "#3E4FB5" },
      });
  }, []);

  return <Provider>{children}</Provider>;
};
export default Persistent;
