import React from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import AdmonitionLayout from "@theme/Admonition/Layout";
import IconTechPreview from "../Icon/TechPreview";

const infimaClassName = "alert custom-admonition";

const defaultProps = {
  icon: <IconTechPreview />,
  title: (
    <Translate
      id="theme.admonition.review"
      description="The default label used for the Tech Preview admonition (:::preview)"
    >
      tech preview
    </Translate>
  ),
};

export default function AdmonitionTypeTechPreview(props) {
  return (
    <AdmonitionLayout
      {...defaultProps}
      {...props}
      className={clsx(infimaClassName, props.className)}
    >
      {props.children}
    </AdmonitionLayout>
  );
}
