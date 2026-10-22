// Release versions are "X.Y.Z" or "X.Y.Z-patch.N". A patch release ships after its base release and before the
// next one, so 4.10.17 < 4.10.17-patch.1 < 4.10.17-patch.5 < 4.10.18.

// parseVersion returns [major, minor, patch, patch release]. The patch release is 0 when there is no -patch.N suffix.
function parseVersion(version: string): number[] {
  const [core, patchRelease] = version.split("-patch.");
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

export function compareVersions(a: string, b: string, direction: "ASC" | "DESC" = "DESC"): number {
  // Handle component-updates-* versions by extracting the starting version of the range
  if (a.includes("component-updates-")) {
    const range = a.split("-RANGE-")[1] ?? ""; // "4.7.20-4.7.23"
    const [rangeFrom, _] = range.split("-");
    a = rangeFrom;
  }
  if (b.includes("component-updates-")) {
    const range = b.split("-RANGE-")[1] ?? ""; // "4.7.20-4.7.23"
    const [rangeFrom, _] = range.split("-");
    b = rangeFrom;
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
