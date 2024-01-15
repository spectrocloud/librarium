import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Technologies from "./Technologies"; // Replace with your actual import

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

const mockData = [
  {
    fields: {
      title: "React",
      description: "A JavaScript library for building user interfaces",
      hide_table_of_contents: false,
      type: "library",
      category: ["frontend"],
      logoUrl: "react-logo.png",
      slug: "/react",
      id: "1",
      sidebar_label: "React.js",
    },
  },
  {
    fields: {
      title: "Node.js",
      description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
      hide_table_of_contents: false,
      type: "runtime",
      category: ["backend"],
      logoUrl: "nodejs-logo.png",
      slug: "/nodejs",
      id: "2",
      sidebar_label: "Node",
    },
  },
];

describe("<Technologies />", () => {
  it("should filter technologies based on search", async () => {
    render(<Technologies data={mockData} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "React" },
    });

    // Assuming you're debouncing, we wait
    await waitFor(() => {}, { timeout: 300 });

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
  });

  it("searches the technologies and checks if React is rendered", async () => {
    render(<Technologies data={mockData} />);

    // Simulate a user clicking the "frontend" category
    fireEvent.click(screen.getByText("frontend"));

    // Wait for the DOM to update
    await waitFor(() => {}, { timeout: 300 });

    // Check if React is displayed after selecting the "frontend" category
    expect(screen.getByText("React")).toBeInTheDocument();

    // Optionally, check if other technologies are not displayed
    expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
  });

  it("searches the technologies using the input field and checks if React.js is rendered with Fuse search", async () => {
    render(<Technologies data={mockData} />);

    // Get the input field by its role
    const searchInput = screen.getByRole("textbox");

    // Simulate a user typing "React.js" into the search input
    fireEvent.change(searchInput, { target: { value: "React.js" } });

    // Wait for the DOM to update
    await waitFor(() => {}, { timeout: 300 });

    // Check if React.js is displayed after searching for it
    expect(screen.getByText("React")).toBeInTheDocument();

    // Optionally, check if other technologies are not displayed
    expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
  });
});
