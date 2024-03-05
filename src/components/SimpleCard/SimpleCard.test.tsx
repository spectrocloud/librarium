import React from "react";
import { render, screen } from "@testing-library/react";
import SimpleCardGrid from ".";

describe("Display SimpleCardGrid", () => {
  interface testCase {
    title: string;
    description: string;
    buttonText: string;
    relativeURL: string;
  }

  function assert(cardsPerRow: number, testCases: testCase[], container: HTMLElement) {
    testCases.forEach((tc) => {
      expect(screen.getByText(tc.title)).toBeInTheDocument();
      expect(screen.getByText(tc.description)).toBeInTheDocument();
      expect(screen.getByText(tc.buttonText, { selector: "button" })).toBeInTheDocument();
      expect(
        screen.getAllByRole("link").filter((value) => {
          return value.getAttribute("href") == tc.relativeURL;
        })
      ).not.toBeNull();
    });

    expect(screen.getAllByRole("button")).toHaveLength(testCases.length);
    expect(container.querySelectorAll(".row")).toHaveLength(Math.ceil(testCases.length / cardsPerRow));
  }

  it("multiple row cards", () => {
    const cardsPerRow: number = 2;
    const testCases: testCase[] = [
      {
        title: "1. First Card",
        description: "Card 1",
        buttonText: "Learn more 1",
        relativeURL: "./getting-started-1",
      },
      {
        title: "2. Second Card",
        description: "Card 2",
        buttonText: "Learn more 2",
        relativeURL: "./getting-started-2",
      },
      {
        title: "3. Third Card",
        description: "Card 3",
        buttonText: "Learn more 3",
        relativeURL: "./getting-started-3",
      },
    ];

    const { container } = render(<SimpleCardGrid cardsPerRow={cardsPerRow} cards={testCases} />);
    assert(cardsPerRow, testCases, container);
  });

  it("single row cards", () => {
    const cardsPerRow: number = 2;
    const testCases: testCase[] = [
      {
        title: "1. First Card",
        description: "Card 1",
        buttonText: "Learn more 1",
        relativeURL: "./getting-started-1",
      },
      {
        title: "2. Second Card",
        description: "Card 2",
        buttonText: "Learn more 2",
        relativeURL: "./getting-started-2",
      },
    ];

    const { container } = render(<SimpleCardGrid cardsPerRow={2} cards={testCases} />);
    assert(cardsPerRow, testCases, container);
  });

  it("less cards than a single row", () => {
    const cardsPerRow: number = 2;
    const testCases: testCase[] = [
      {
        title: "1. First Card",
        description: "Card 1",
        buttonText: "Learn more 1",
        relativeURL: "./getting-started-1",
      },
    ];

    const { container } = render(<SimpleCardGrid cardsPerRow={2} cards={testCases} />);
    assert(cardsPerRow, testCases, container);
  });
});
