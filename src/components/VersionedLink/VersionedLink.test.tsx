import React from "react";
import { render, screen } from "@testing-library/react";
import VersionedLink from "./VersionedLink";

let prevVersionPath = "";
jest.mock("./CheckVersion", () => {
  return jest.fn(() => {
    return prevVersionPath;
  });
});

describe("Versioned link", () => {
  it("latest version", () => {
    prevVersionPath = "";
    const text = "Test link";
    const url = "/path/url";
    render(<VersionedLink text={text} url={url} />);
    const link = screen.getByText(text).getAttribute("href");
    expect(link).not.toBeNull();
    expect(link).toBe(url);
  });

  it("latest version with component", () => {
    prevVersionPath = "";
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

  it("previous version", () => {
    prevVersionPath = "/v4.3.1";
    const text = "Test link";
    const url = "/path/url";
    render(<VersionedLink text={text} url={url} />);
    const link = screen.getByText(text).getAttribute("href");
    expect(link).not.toBeNull();
    expect(link).toBe(prevVersionPath.concat(url));
  });

  it("previous version with component", () => {
    prevVersionPath = "/v4.3.1";
    const componentText = "Component text";
    const component = <p>{componentText}</p>;
    const url = "/path/url";
    render(<VersionedLink component={component} url={url} />);
    const componentRender = screen.getByText(componentText);
    expect(componentRender).not.toBeNull();
    const link = screen.getByRole("link").getAttribute("href");
    expect(link).not.toBeNull();
    expect(link).toBe(prevVersionPath.concat(url));
  });

  it("url with back dots", () => {
    prevVersionPath = "";
    const text = "Test link";
    const url = "../path/url";
    expect(() => render(<VersionedLink text={text} url={url} />)).toThrow(
      "Versioned links should provide the path of the destination URL from root, without any `./` or `..` references."
    );
  });

  it("url with back relative reference", () => {
    prevVersionPath = "";
    const text = "Test link";
    const url = "./path/url";
    expect(() => render(<VersionedLink text={text} url={url} />)).toThrow(
      "Versioned links should provide the path of the destination URL from root, without any `./` or `..` references."
    );
  });

  it("url with external domain", () => {
    prevVersionPath = "";
    const text = "Test link";
    const url = "https://google.com";
    expect(() => render(<VersionedLink text={text} url={url} />)).toThrow(
      "Versioned links should not be used for external URLs. Please use the default markdown syntax instead."
    );
  });
});
