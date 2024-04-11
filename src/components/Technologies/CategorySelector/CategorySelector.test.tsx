import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CategorySelector from "./TypeSelector";

describe("CategorySelector Component", () => {
  const mockSelectCategory = jest.fn();
  const categories = ["all", "category_one", "category_two"];

  beforeEach(() => {
    render(<CategorySelector categories={categories} selected="all" selectCategory={mockSelectCategory} />);
  });

  it("renders all categories", () => {
    categories.forEach((category) => {
      expect(screen.getByText(category.split("_").join(" "))).toBeInTheDocument();
    });
  });

  it("indicates which category is selected", () => {
    const selectedCategory = screen.getByText("all");
    expect(selectedCategory).toHaveClass("isSelected");
  });

  it("calls the selectCategory function with the correct argument when clicked", () => {
    const unselectedCategory = screen.getByText("category one");
    fireEvent.click(unselectedCategory);
    expect(mockSelectCategory).toHaveBeenCalledWith("category_one");
  });
});
