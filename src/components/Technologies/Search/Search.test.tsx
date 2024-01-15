import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Search from "./Search";

describe("Search component", () => {
  it("should render correctly", () => {
    const { container } = render(
      <Search placeholder={"Search for integration..."} onSearch={jest.fn()} />,
    );
    expect(container).toBeInTheDocument();
  });

  it("should call onSearch when typing", () => {
    const onSearchMock = jest.fn();
    render(
      <Search
        placeholder={"Search for integration..."}
        onSearch={onSearchMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Search for integration..."), {
      target: { value: "Amazon" },
    });

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it("should clear input and focus when clicking clear icon", () => {
    const { container } = render(
      <Search placeholder={"Search for integration..."} onSearch={jest.fn()} />,
    );
    const input = screen.getByPlaceholderText(
      "Search for integration...",
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "Amazon" },
    });

    // Input should have a value
    expect(input.value).toBe("Amazon");

    // Click on clear (times) icon
    const clearIcon = container.querySelector(".clearIcon");
    if (clearIcon) {
      fireEvent.click(clearIcon);
    }

    // Input should be cleared
    expect(input.value).toBe("");

    // Input should be focused
    expect(document.activeElement).toEqual(input);
  });
});
