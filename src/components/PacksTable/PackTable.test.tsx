import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import FilteredTable from "./PacksTable";
// Enable fetch mocking
fetchMock.enableMocks();

describe("FilteredTable Tests", () => {
  const mockPacks = [
    {
      name: "alpine",
      displayName: "Alpine",
      layer: "os",
      addonType: "",
      cloudTypesFormatted: "edge-native",
      version: "0.1.0",
      status: "deprecated",
      packCreateDate: "2022-09-13",
      packLastModifiedDate: "2022-09-15",
      timeLastUpdated: "11 months",
      releaseType: "Experimental",
      contributor: "",
      docsURL: "",
    },
    {
      name: "amazon-linux-eks",
      displayName: "Amazon EKS optimized Linux",
      layer: "os",
      addonType: "",
      cloudTypesFormatted: "eks",
      version: "1.0.0",
      status: "deprecated",
      packCreateDate: "2021-04-21",
      packLastModifiedDate: "2021-05-07",
      timeLastUpdated: "2 years",
      releaseType: "Stable",
      contributor: "",
      docsURL: "",
    },
  ];

  // Reset the mock before each test
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should show loader initially", () => {
    const { container } = render(<FilteredTable />);
    expect(container.querySelector(".loader")).toBeInTheDocument();
  });

  it("should hide loader and display packs after API call", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ dateCreated: "2022-08-25", Packs: mockPacks }));
    const { container } = render(<FilteredTable />);

    await waitFor(() => expect(container.querySelector(".loader")).not.toBeInTheDocument());
    expect(screen.getByText("Alpine")).toBeInTheDocument();
    expect(screen.getByText("Amazon EKS optimized Linux")).toBeInTheDocument();
  });

  it("should filter packs based on search", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ dateCreated: "2022-08-25", Packs: mockPacks }));
    render(<FilteredTable />);

    await waitFor(() => screen.getByText("Alpine"));

    // Fire the event to change the search textbox
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Amazon" } });

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Now run the expectations
    expect(screen.getByText("Amazon EKS optimized Linux")).toBeInTheDocument();
    expect(screen.queryByText("Alpine")).not.toBeInTheDocument();
  });

  it("shows error message when fetch fails", async () => {
    fetchMock.mockReject(new Error("fake error message"));

    render(<FilteredTable />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load Deprecated Packs")).toBeInTheDocument();
    });
  });

  it("should properly format cloud types", async () => {
    const customMockPacks = [
      {
        ...mockPacks[0],
        cloudTypesFormatted: "eks,vsphere"
      }
    ];

    fetchMock.mockResponseOnce(JSON.stringify({ dateCreated: "2022-08-25", Packs: customMockPacks }));
    render(<FilteredTable />);

    await waitFor(() => screen.getByText("Alpine"));
    
    expect(screen.getByText("EKS, vSphere")).toBeInTheDocument();
  });

});
