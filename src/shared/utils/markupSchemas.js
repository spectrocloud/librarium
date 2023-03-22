import React from "react";
const { Helmet } = require("react-helmet");

export const GenericSeoSchema = () => {
  return (
    <Helmet>
      <script type="application/ld+json">{`
      {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Spectro Cloud",
      "url": "https://www.spectrocloud.com/",
      "logo": "https://www.spectrocloud.com/static/f4c90ec413e55fc0528766d9f1ee7d44/5c11c/logo_landscape_for_white.png",
      "sameAs": [
        "https://github.com/spectrocloud",
        "https://www.linkedin.com/company/spectro-cloud/",
        "https://twitter.com/spectrocloudinc",
        "https://www.facebook.com/spectrocloud"
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "HomePage",
          "item": "https://www.spectrocloud.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Documentation",
          "item": "https://docs.spectrocloud.com/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Release Notes",
          "item": "https://docs.spectrocloud.com/release-notes/"
        }
      ]
    }
  ]
}
      `}</script>
    </Helmet>
  );
};
