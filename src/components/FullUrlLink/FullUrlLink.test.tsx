import React from "react";
import { render, screen } from "@testing-library/react";
import FullUrlLink from "./FullUrlLink";

const mockedOrigin = "https://mocked-origin.com";

Object.defineProperty(window, "location", {
  writable: true,
  value: { ...window.location, origin: mockedOrigin },
});

describe("FullUrlLink", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...window.location,
        origin: mockedOrigin,
      },
    });
  });

  it("latest version", () => {
    const url = "/path/url";
    const text = mockedOrigin + url;
    render(<FullUrlLink path={url} />);
    const link = screen.getByText(text).getAttribute("href");
    expect(link).not.toBeNull();
    expect(link).toBe(text);
  });

  it("url with back dots", () => {
    const url = "../path/url";
    expect(() => render(<FullUrlLink path={url} />)).toThrow(
      "FullUrlLink links should provide the path of the destination URL from root, without any `./` or `..` references."
    );
  });

  it("url with back relative reference", () => {
    const url = "./path/url";
    expect(() => render(<FullUrlLink path={url} />)).toThrow(
      "FullUrlLink links should provide the path of the destination URL from root, without any `./` or `..` references."
    );
  });

  it("url with external domain", () => {
    const text = "Test link";
    const url = "https://google.com";
    expect(() => render(<FullUrlLink path={url} />)).toThrow(
      "FullUrlLink links should not be used for external URLs. Please use the default markdown syntax instead."
    );
  });
});
