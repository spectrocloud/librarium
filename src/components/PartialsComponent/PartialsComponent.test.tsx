import React, { FunctionComponent } from "react";
import { render, screen } from "@testing-library/react";

let category = "testCat1";
let name = "nameCat1";
let propValue = "testValue1";

const Partial: React.FunctionComponent<{}> = ({}) => (
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
    allPartials[mapKey] = Partial as FunctionComponent;
    return allPartials;
  });
});

jest.mock("./GetVersion", () => {
  return jest.fn(() => {
    return "current";
  });
});

import PartialsComponent from "./PartialsComponent";
import { PartialsMap } from "./PartialsImporter";

describe("Partials Component", () => {
  it("partial exists", () => {
    render(<PartialsComponent category={category} name={name} propTest={propValue} />);
    expect(screen.getByText(category)).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(propValue)).toBeInTheDocument();
  });

  it("partial does not exist", () => {
    expect(() => render(<PartialsComponent category="unknownCat" name="unknownName" propTest={propValue} />)).toThrow(
      "No partial found for name unknownName in category unknownCat for version current."
    );
  });
});
