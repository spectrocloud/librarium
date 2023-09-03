const sharp = require("sharp");

sharp("./static/assets/docs/images/docs_introduction_product-overview.png")
  .png({ quality: 80 })
  .toFile("./light-image.png");
