import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import AdmonitionLayout from "@theme/Admonition/Layout";
import IconDeprecated from "../Icon/Deprecated";

const infimaClassName = "alert admonition-deprecated";

const defaultContent = (
  <>
    This feature is deprecated and will no longer receive new updates. Refer to the{" "}
    <Link to="/release-notes/announcements/">Announcements</Link> page for additional information, as well as
    alternatives.
  </>
);

const defaultProps = {
  icon: <IconDeprecated />,
  title: (
    <Translate
      id="theme.admonition.deprecated"
      description="The default label used for the Deprecated admonition (:::deprecated)"
    >
      deprecated
    </Translate>
  ),
};

export default function AdmonitionTypeDeprecated(props) {
  const content = props.children || defaultContent;
  return (
    <AdmonitionLayout {...defaultProps} className={clsx(infimaClassName, props.className)}>
      {content}
    </AdmonitionLayout>
  );
}
