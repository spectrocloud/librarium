import React from "react";
import { render, screen } from "@testing-library/react";
import YouTube from "./Youtube";

describe("YouTube Component", () => {
  it("renders an iframe with the correct src when URL is provided", () => {
    render(<YouTube url="https://www.youtube.com/embed/test" title="Test Video" />);

    const iframeElement = screen.getByTitle("Test Video");

    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute("src", "https://www.youtube.com/embed/test");
  });

  it("renders an error message when no URL is provided", () => {
    render(<YouTube url="" title="Test Video" />);

    const errorMessage = screen.getByText("Error: No YouTube URL provided.");

    expect(errorMessage).toBeInTheDocument();
  });
});
