import DefaultAdmonitionTypes from "@theme-original/Admonition/Types";
import AdmonitionTypeTechPreview from "../Admonition/Type/TechPreview";
import AdmonitionTypeFurtherGuidance from "./Type/FurtherGuidance";
import AdmonitionTypeDeprecated from "./Type/Deprecated";

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  preview: AdmonitionTypeTechPreview,
  further: AdmonitionTypeFurtherGuidance,
  deprecated: AdmonitionTypeDeprecated,
};

export default AdmonitionTypes;
