import React from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import AdmonitionLayout from "@theme/Admonition/Layout";
import IconFurtherGuidance from "../Icon/FurtherGuidance";

const infimaClassName = "alert admonition-further-guidance";

const defaultProps = {
  icon: <IconFurtherGuidance />,
  title: (
    <Translate
      id="theme.admonition.review"
      description="The default label used for the Further Guidance admonition (:::further)"
    >
      further guidance
    </Translate>
  ),
  defaultText: "",
};

export default function AdmonitionTypeFurtherGuidance(props) {
  const text = props.children || defaultProps.defaultText;
  return (
    <AdmonitionLayout {...defaultProps} className={clsx(infimaClassName, props.className)}>
      {text}
    </AdmonitionLayout>
  );
}
