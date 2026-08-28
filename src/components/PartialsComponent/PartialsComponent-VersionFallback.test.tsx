import React, { FunctionComponent } from "react";
import { render, screen } from "@testing-library/react";

// A product doc collection that has been versioned, but whose partials have NOT been versioned
// alongside it. Only a "current" partial exists in the map; the page being rendered is on 1.0.x.
// Without the fallback, every frozen page using a partial would fail the build.

const category = "testCat1";
const name = "nameCat1";
const propValue = "testValue1";

const CurrentPartial: React.FunctionComponent<Record<string, never>> = () => (
  <div>
    <p>{category}</p>
    <p>{name}</p>
    <p>{propValue}</p>
  </div>
);

jest.mock("./PartialsImporter", () => {
  return jest.fn(() => {
    const allPartials: PartialsMap = {};
    const mapKey = "current".concat("#").concat(category).concat("#").concat(name);
    allPartials[mapKey] = CurrentPartial as FunctionComponent;
    return allPartials;
  });
});

jest.mock("./GetVersion", () => {
  return jest.fn(() => {
    return "1.0.x";
  });
});

import PartialsComponent from "./PartialsComponent";
import { PartialsMap } from "./PartialsImporter";

describe("Partials Component version fallback", () => {
  it("falls back to the current partial when no versioned partial exists", () => {
    render(<PartialsComponent category={category} name={name} propTest={propValue} />);
    expect(screen.getByText(category)).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(propValue)).toBeInTheDocument();
  });

  it("still throws when the partial exists in neither the version nor current", () => {
    expect(() => render(<PartialsComponent category="unknownCat" name="unknownName" propTest={propValue} />)).toThrow(
      "No partial found for name unknownName in category unknownCat for version 1.0.x."
    );
  });
});
