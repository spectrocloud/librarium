import React from "react";
import VersionedLink from "../VersionedLink/VersionedLink";

// This component is used to generate the correct URL for the palette and vertex versions of the documentation.
// It takes the edition, text, and URL as props and returns the correct URL based on the edition.
// If the vertex and palette pages have different URLs, the component takes palettePath and vertexPath as individual props and returns the correct URL.

interface ComponentProperties {
  [key: string]: string;
}

export default function PaletteVertexUrlMapper(props: ComponentProperties) {
  const { edition, text, url, palettePath, vertexPath } = props;
  const isPalette = edition?.toLowerCase() === "palette";
  const baseUrl = isPalette ? "/enterprise-version" : "/vertex";

  const mappedUrl =
    palettePath && vertexPath ? `${baseUrl}${isPalette ? palettePath : vertexPath}` : `${baseUrl}${url}`;

  return <VersionedLink url={mappedUrl} text={text} />;
}
