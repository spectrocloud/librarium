import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pre from "../src/shared/mdx/components/Pre";
import Clipboard from "clipboard";

jest.mock("clipboard");

const TextComponent = (props) => {
  return <div>{props.text}</div>;
};

describe("Displays the correct title", () => {
  afterEach(() => {
    Clipboard.mockRestore();
  });

  it("renders the component with default props", () => {
    const { getByText, getByRole } = render(
      <Pre>
        <TextComponent text={"Testing code"}></TextComponent>
      </Pre>
    );

    expect(getByText("Testing code")).toBeInTheDocument();

    expect(getByRole("button", { name: /copy/i })).toBeInTheDocument();
    expect(Clipboard).toBeCalled();
  });

  it("does not render the copy button when hideClipboard prop is true", () => {
    const { queryByRole } = render(
      <Pre>
        <TextComponent text={"Sample code"} hideClipboard={true}></TextComponent>
      </Pre>
    );
    expect(queryByRole("button", { name: /copy/i })).toBeNull();
    expect(Clipboard).not.toHaveBeenCalled();
  });
});
