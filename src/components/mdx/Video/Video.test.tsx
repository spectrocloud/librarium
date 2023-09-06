import React from "react";
import { render } from "@testing-library/react";
import Video from "./Video"; // adjust the import path as needed

describe("Displays Video component", () => {
  it("renders video element", () => {
    const { container } = render(<Video></Video>);
    const videoElement = container.querySelector("video");
    expect(videoElement).toBeInTheDocument();
  });
});
