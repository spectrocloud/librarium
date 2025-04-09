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

jest.mock("../../../.docusaurus/security-bulletins/default/data.json", () => ({
  __esModule: true,
  default: mockDataFile,
}));

const mockDataFile = {
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

// Enable fetch mocking
fetchMock.enableMocks();

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => {
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
  const mockData = mockDataFile;

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
        <OsCveTable dataOverride={mockData} />
      </MemoryRouter>
    );

    await waitFor(() => expect(container.querySelector(".ant-spin")).not.toBeInTheDocument());
    // expect(screen.getByText("RHEL 9")).toBeInTheDocument();
    expect(screen.getAllByText("1.28.15").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Yes").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", {
        name: /security advisory for ubuntu 20\.04 with kubernetes 1\.28\.15/i,
      })
    ).toBeInTheDocument();
  });

  it("should filter packs based on search", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    const { container } = render(
      <MemoryRouter>
        <OsCveTable dataOverride={mockData} />
      </MemoryRouter>
    );

    // await waitFor(() => screen.getByText("RHEL"));
    await waitFor(() => expect(container.querySelector(".ant-spin")).not.toBeInTheDocument());

    // Fire the event to change the search textbox
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ubuntu" } });

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Now run the expectations
    expect(
      screen.getByRole("link", {
        name: /security advisory for ubuntu 20\.04 with kubernetes 1\.28\.15/i,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText("RHEL")).not.toBeInTheDocument();
  });

  it("should have unique row keys", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    const { container } = render(
      <MemoryRouter>
        <OsCveTable dataOverride={mockData} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const rows = container.querySelectorAll(".ant-table-row");
      const keys = Array.from(rows).map((row) => row.getAttribute("data-row-key"));
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });
  });
});
