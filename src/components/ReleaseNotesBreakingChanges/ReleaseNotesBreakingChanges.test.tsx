import React from "react";
import { render, screen, logRoles } from "@testing-library/react";
import ReleaseNotesBreakingChanges from "./ReleaseNotesBreakingChanges";

// These test are pretty much useless.
// The only real purpose they show is catching simple issues, or component signature changes.

jest.mock("./ReleaseNotesBreakingChanges", () => {
  return jest.fn(() => {
    return <div data-testid="mock-rl-note-admn"></div>;
  });
});
// Mock any other dependencies here

describe("ReleaseNotesBreakingChanges", () => {
  it("renders without crashing", () => {
    render(<ReleaseNotesBreakingChanges />);
    expect(screen.getByTestId("mock-rl-note-admn")).toBeVisible();
    expect(screen.getByTestId("mock-rl-note-admn")).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
