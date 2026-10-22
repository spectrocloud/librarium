// Release versions are "X.Y.Z" or "X.Y.Z-patch.N". A patch release ships after its base release and before the
// next one, so 4.10.17 < 4.10.17-patch.1 < 4.10.17-patch.5 < 4.10.18.

// parseVersion returns [major, minor, patch, patch release]. The patch release is 0 when there is no -patch.N suffix.
function parseVersion(version: string): number[] {
  const [core, patchRelease] = (version ?? "").split("-patch.");
  const parts = core.split(".").map(Number);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0, Number(patchRelease) || 0];
}

// diffVersions returns a negative number if a is older than b, a positive number if a is newer, and 0 if they are equal.
function diffVersions(a: string, b: string): number {
  const aParts = parseVersion(a);
  const bParts = parseVersion(b);

  for (let i = 0; i < aParts.length; i++) {
    if (aParts[i] !== bParts[i]) {
      return aParts[i] - bParts[i];
    }
  }

  return 0; // equal
}

// A dash between the two ends of a Component Updates range: a hyphen, en dash, or em dash that is followed by a
// digit, so the hyphen in "-patch.N" is not a separator.
const RANGE_SEPARATOR = /\s*[-\u2013\u2014]\s*(?=\d)/;

// parseComponentUpdatesRange returns the [from, to] Palette versions of a Component Updates partial name, such as
// "component-updates-2026-07-TITLE-{February 13, 2026}-RANGE-4.8.6-4.8.27". A single version is a range of one.
export function parseComponentUpdatesRange(name: string): [string, string] {
  const range = name.split("-RANGE-")[1] ?? "";
  const [from = "", to] = range.split(RANGE_SEPARATOR);
  return [from, to ?? from];
}

// isComponentUpdatesInRange reports whether either end of a Component Updates range falls in the upgrade range,
// using the same rule as isVersionInRange.
export function isComponentUpdatesInRange(name: string, from: string, to: string): boolean {
  const [rangeFrom, rangeTo] = parseComponentUpdatesRange(name);
  return isVersionInRange(rangeFrom, from, to) || isVersionInRange(rangeTo, from, to);
}

export function compareVersions(a: string, b: string, direction: "ASC" | "DESC" = "DESC"): number {
  // Handle component-updates-* versions by extracting the starting version of the range
  if (a.includes("component-updates-")) {
    a = parseComponentUpdatesRange(a)[0];
  }
  if (b.includes("component-updates-")) {
    b = parseComponentUpdatesRange(b)[0];
  }

  return direction === "ASC" ? diffVersions(a, b) : diffVersions(b, a);
}

export function isGreaterVersion(a: string, b: string): boolean {
  return diffVersions(a, b) > 0;
}

export function isVersionInRange(input: string, from: string, to: string): boolean {
  // Strictly greater than from, and less than or equal to to
  return diffVersions(input, from) > 0 && diffVersions(input, to) <= 0;
}
