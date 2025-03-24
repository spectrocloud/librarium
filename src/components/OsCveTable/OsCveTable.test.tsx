import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import OsCveTable from "./OsCveTable";
import { MemoryRouter } from "react-router-dom";

// Mock the Docusaurus dependencies
jest.mock("@docusaurus/theme-common", () => ({
  useColorMode: () => ({
    colorMode: "light",
    setColorMode: jest.fn(),
  }),
}));

jest.mock("@theme/Admonition");

// Enable fetch mocking
fetchMock.enableMocks();

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => {
      console.log("query", query);
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    }),
  });
});

describe("OsCveTable Component", () => {
  const mockData = {
    provider: [
      {
        kind: "os",
        metadata: {
          uid: "u-2004-0-k-12815-fips",
          summary: "Security Advisory for Ubuntu 20.04 with Kubernetes 1.28.15 FIPS",
          advCreatedTimestamp: "2025-02-05T10:06:21.041Z",
          advLastModifiedTimestamp: "2025-02-25T11:45:51.212Z",
        },
        spec: {
          assessment: {
            impact: "LOW",
            severity: "LOW",
            thirdParty: {
              isDependentOnThirdParty: true,
            },
          },
          impact: {
            isImpacting: true,
            impactedVersions: ["4.5.21", "4.5.22"],
          },
        },
      },
      {
        kind: "os",
        metadata: {
          uid: "r-9-0-k-1260",
          summary: "Security Advisory for RHEL 9 with Kubernetes 1.26.0",
          advCreatedTimestamp: "2025-01-15T12:30:00.000Z",
          advLastModifiedTimestamp: "2025-01-16T09:45:00.000Z",
        },
        spec: {
          assessment: {
            impact: "MEDIUM",
            severity: "MEDIUM",
            thirdParty: {
              isDependentOnThirdParty: false,
            },
          },
          impact: {
            isImpacting: true,
            impactedVersions: ["4.6.0", "4.6.1"],
          },
        },
      },
    ],
  };

  // Reset the mock before each test
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should show loader initially", () => {
    const { container } = render(<OsCveTable />);
    expect(container.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("should hide loader and display packs after API call", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    const { container } = render(
      <MemoryRouter>
        <OsCveTable />
      </MemoryRouter>
    );

    await waitFor(() => expect(container.querySelector(".ant-spin")).not.toBeInTheDocument());
    expect(screen.getByText("RHEL 9")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes 1.28.15 FIPS")).toBeInTheDocument();
  });
});
