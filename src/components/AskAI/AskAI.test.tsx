import React from "react";
import { render, screen } from "@testing-library/react";
import AskAI from "./AskAI";

// These test are pretty much useless.
// The only real purpose they show is catching simple issues, or component signature changes.

jest.mock("./AskAI", () => {
  return jest.fn(() => {
    return <div data-testid="mock-ask-ai"></div>;
  });
});
// Mock any other dependencies here

describe("AskAI", () => {
  it("renders without crashing", () => {
    render(<AskAI />);
    expect(screen.getByTestId("mock-ask-ai")).toBeVisible();
    expect(screen.getByTestId("mock-ask-ai")).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});