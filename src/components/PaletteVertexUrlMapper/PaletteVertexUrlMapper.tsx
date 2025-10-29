import React from "react";
import VersionedLink from "../VersionedLink/VersionedLink";

// This component is used to generate the correct URL for the palette and vertex versions of the documentation.
// It takes the edition, text, and URL as props and returns the correct URL based on the edition.
// If the vertex and palette pages have different URLs, the component takes palettePath and vertexPath as individual props and returns the correct URL.
// For installation-specific content, the install prop can be used to specify 'kubernetes', 'vmware', or 'management-appliance'.

interface ComponentProperties {
  [key: string]: string;
}

export default function PaletteVertexUrlMapper(props: ComponentProperties) {
  const { edition, text, url, palettePath, vertexPath, install } = props;
  const normalizedEdition = edition?.toLowerCase();
  const normalizedInstall = install?.toLowerCase();

  if (normalizedEdition !== "palette" && normalizedEdition !== "vertex") {
    throw new Error("Invalid edition. Please provide either 'palette' or 'vertex'.");
  }

  if (normalizedInstall && !["kubernetes", "vmware", "management-appliance"].includes(normalizedInstall)) {
    throw new Error("Invalid install method. Please provide 'kubernetes', 'vmware', or 'management-appliance'.");
  }

  const isPalette = normalizedEdition === "palette";

  // Construct base URL with optional installation method
  let baseUrl = `/self-hosted-setup/${isPalette ? "palette" : "vertex"}`;
  if (normalizedInstall) {
    baseUrl += `/supported-environments/${normalizedInstall}`;
  }

  const mappedUrl =
    palettePath && vertexPath ? `${baseUrl}${isPalette ? palettePath : vertexPath}` : `${baseUrl}${url}`;

  return <VersionedLink url={mappedUrl} text={text} />;
}
