import React from "react";
import VersionedLink from "../VersionedLink/VersionedLink";

// This component is used to generate the correct URL for the palette and vertex versions of the documentation.
// It takes the edition, text, and URL as props and returns the correct URL based on the edition.

interface ComponentProperties {
  [key: string]: string;
}

export default function PaletteVertexUrlMapper(props: ComponentProperties) {
  const { edition, text, url } = props;
  const isPalette = edition?.toLowerCase() === "palette";
  const mappedUrl = isPalette ? `/enterprise-version${url}` : `/vertex${url}`;

  return <VersionedLink url={mappedUrl} text={text} />;
}
