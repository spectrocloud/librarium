import React from "react";
import Video from "./Video/index";
const eagerLoadRegex = /(?:^|\s)eager-load(?:\s|$)/i;

const widthRegex = /#width=(\d+px)/;

const customMdxComponents = {
  img: (props) => {
    const widthMatch = props?.title?.match(widthRegex);
    const customWidth =
      widthMatch && widthMatch.length > 1 ? widthMatch[1] : null;
    const isEagerLoading = eagerLoadRegex.test(props.alt);
    const loadingTechnique = isEagerLoading ? "eager" : "lazy";
    const fetchpriority = isEagerLoading ? "high" : "auto";

    return (
      <img
        className="markdown-image"
        {...props}
        style={customWidth ? { width: customWidth } : {}}
        loading={loadingTechnique}
        // eslint-disable-next-line react/no-unknown-property
        fetchpriority={fetchpriority}
      />
    );
  },
  Video: Video,
};

export default customMdxComponents;
