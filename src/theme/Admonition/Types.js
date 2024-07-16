import DefaultAdmonitionTypes from "@theme-original/Admonition/Types";
import AdmonitionTypeTechPreview from "../Admonition/Type/TechPreview";
import AdmonitionTypeFurtherGuidance from "./Type/FurtherGuidance";

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  further: AdmonitionTypeFurtherGuidance,
};

export default AdmonitionTypes;
