const ignoredPrefixPattern = /^\d+[-_]\d+/;

const numberPrefixPattern = /^(?<numberPrefix>\d+\.?\d*)\s*[-_.]+\s*(?<suffix>[^-_.\s].*)$/;

const numberPrefixParser = (filename) => {
  if (ignoredPrefixPattern.test(filename)) {
    return { filename, numberPrefix: undefined };
  }
  const match = numberPrefixPattern.exec(filename);
  if (!match) {
    return { filename, numberPrefix: undefined };
  }

  return {
    filename: match.groups?.suffix,
    numberPrefix: parseFloat(match.groups?.numberPrefix || ""),
  };
};

export default numberPrefixParser;
