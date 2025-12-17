import React from "react";
import { render, screen } from "@testing-library/react";
import VersionedLink from "./VersionedLink";

describe("Versioned link", () => {
  it("latest version", () => {
    const text = "Test link";
    const url = "/path/url";
    render(<VersionedLink text={text} url={url} />);
    const link = screen.getByText(text).getAttribute("href");
    expect(link).not.toBeNull();
    expect(link).toBe(url);
  });

  it("latest version with component", () => {
    const componentText = "Component text";
    const component = <p>{componentText}</p>;
    const url = "/path/url";
    render(<VersionedLink component={component} url={url} />);
    const componentRender = screen.getByText(componentText);
    expect(componentRender).not.toBeNull();
    const link = screen.getByRole("link").getAttribute("href");
    expect(link).not.toBeNull();
    expect(link).toBe(url);
  });

  it("url with back dots", () => {
    const text = "Test link";
    const url = "../path/url";
    expect(() => render(<VersionedLink text={text} url={url} />)).toThrow(
      "Versioned links should provide the path of the destination URL from root, without any `./` or `..` references."
    );
  });

  it("url with back relative reference", () => {
    const text = "Test link";
    const url = "./path/url";
    expect(() => render(<VersionedLink text={text} url={url} />)).toThrow(
      "Versioned links should provide the path of the destination URL from root, without any `./` or `..` references."
    );
  });

  it("url with external domain", () => {
    const text = "Test link";
    const url = "https://google.com";
    expect(() => render(<VersionedLink text={text} url={url} />)).toThrow(
      "Versioned links should not be used for external URLs. Please use the default markdown syntax instead."
    );
  });
});
