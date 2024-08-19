import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Technologies from "./Technologies"; // Replace with your actual import
import { FrontMatterData, RepositoryData } from "../Integrations/IntegrationTypes";

/*
 * TODO: Docusaurus Link import not resolving in Jest,
 * so mocking TechnologyCard which uses Link.
 */

jest.mock("./TechnologyCard", () => {
  return jest.fn(({ title, slug, logoUrl }) => {
    return (
      <div data-testid="mock-technology-card">
        <a href={slug}>
          <div>{title}</div>
          <div>{logoUrl}</div>
        </a>
      </div>
    );
  });
});

const mockData: FrontMatterData[] = [
  {
    name: "React",
    title: "React",
    description: "A JavaScript library for building user interfaces",
    type: "library",
    category: ["frontend"],
    logoUrl: "react-logo.png",
    slug: "/react",
    id: "1",
    packType: "library", // Example value, adjust as needed
    verified: true, // Example value, adjust as needed
    cloudTypes: ["cloudA", "cloudB"], // Example values, adjust as needed
    packUidMap: new Map<string, any>(), // Initialize as empty map
    versions: [], // Initialize as empty array
    community: true, // Example value, adjust as needed
    registries: ["npm"], // Example values, adjust as needed
    disabled: false, // Example value, adjust as needed
    latestVersion: "17.0.2", // Example value, adjust as needed
  },
  {
    name: "Node.js",
    title: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    type: "runtime",
    category: ["backend"],
    logoUrl: "nodejs-logo.png",
    slug: "/nodejs",
    id: "2",
    packType: "runtime", // Example value, adjust as needed
    verified: true, // Example value, adjust as needed
    cloudTypes: ["cloudA", "cloudB"], // Example values, adjust as needed
    packUidMap: new Map<string, any>(), // Initialize as empty map
    versions: [], // Initialize as empty array
    community: true, // Example value, adjust as needed
    registries: ["64eaff453040297344bcad5d", "5eecc89d0b150045ae661cef"], // Example values, adjust as needed
    disabled: false, // Example value, adjust as needed
    latestVersion: "14.17.0", // Example value, adjust as needed
  },
];

const mockRepositories: RepositoryData[] = [
  {
    name: "Palette Registry",
    uid: "64eaff453040297344bcad5d",
  },
  {
    name: "Community Registry",
    uid: "5eecc89d0b150045ae661cef",
  },
];

describe("<Technologies />", () => {
  it("should filter technologies based on search", async () => {
    render(<Technologies data={mockData} repositories={mockRepositories} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "React" } });

    // Assuming you're debouncing, we wait
    await waitFor(() => {}, { timeout: 300 });

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
  });
});
