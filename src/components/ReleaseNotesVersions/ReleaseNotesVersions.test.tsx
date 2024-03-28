import React from "react";
import { render } from "@testing-library/react";
import ReleaseNotesVersions from "./ReleaseNotesVersions";
import { isExternalDomain } from "./ReleaseNotesVersions";
import { useHistory } from "@docusaurus/router";

// Mock any external modules or hooks here
jest.mock("./ReleaseNotesVersions", () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));
// Mock any other dependencies here

// describe("ReleaseNotesVersions", () => {
//   it("renders without crashing", () => {
//     const { getByText } = render(<ReleaseNotesVersions />);
//     expect(getByText("Are you looking for the release notes to a specific version of Palette?")).toBeInTheDocument();
//   });

//   // Add more test cases as needed
// });

describe("isExternalDomain", () => {
  // Mock window.location.hostname to return a specific value
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      value: {
        hostname: "docs.spectrocloud.com",
      },
      configurable: true, // This allows you to redefine it later
    });
  });

  it("should return true for external domains", () => {
    // Testing against a subdomain of the mocked hostname, should be considered internal, thus false
    // expect(isExternalDomain("https://legacy.docs.spectrocloud.com")).toBe(false);
    expect(isExternalDomain("https://docs.spectrocloud.com", "https://legacy.docs.spectrocloud.com")).toBe(false);
  });

  // Add more tests as needed for different scenarios
});

afterEach(() => {
  jest.clearAllMocks();
});

// describe("ReleaseNotesVersions Component", () => {
//   it("renders without crashing", () => {
//     const { getByText } = render(<ReleaseNotesVersions />);
//     expect(getByText(/Are you looking for the release notes to a specific version of Palette?/i)).toBeInTheDocument();
//   });
// });
