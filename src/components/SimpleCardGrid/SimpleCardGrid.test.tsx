import React from "react";
import { render, screen } from "@testing-library/react";
import SimpleCardGrid from "./SimpleCardGrid";

jest.mock("./SimpleCardFooterArrow", () => {
  return jest.fn(() => {
    return <div data-testid="mock-arrow"></div>;
  });
});

describe("Display SimpleCardGrid", () => {
  interface testCard {
    title: string;
    description: string;
    buttonText: string;
    relativeURL: string;
  }

  interface testCase {
    name: string;
    cards: testCard[];
  }

  const testCards: testCard[] = [
    {
      title: "First Card",
      description: "Card 1",
      buttonText: "Learn more 1",
      relativeURL: "./getting-started-1",
    },
    {
      title: "Second Card",
      description: "Card 2",
      buttonText: "Learn more 2",
      relativeURL: "./getting-started-2",
    },
    {
      title: "Third Card",
      description: "Card 3",
      buttonText: "Learn more 3",
      relativeURL: "./getting-started-3",
    },
  ];

  const testCases: testCase[] = [
    {
      name: "multiple row cards",
      cards: testCards.slice(),
    },
    {
      name: "single row cards",
      cards: testCards.slice(2),
    },
    {
      name: "less cards than a single row",
      cards: testCards.slice(1),
    },
    {
      name: "empty cards",
      cards: [],
    },
  ];

  function assert(testCards: testCard[]) {
    render(<SimpleCardGrid cards={testCards} />);
    if (testCards.length == 0) {
      expect(screen.queryAllByRole("button")).toHaveLength(0);
      return;
    }

    testCards.forEach((tc, index) => {
      expect(screen.getByText(tc.title)).toBeInTheDocument();
      expect(screen.getByText(tc.description)).toBeInTheDocument();
      expect(screen.getByText(tc.buttonText, { selector: "button" })).toBeInTheDocument();
      expect(
        screen.getAllByRole("link").filter((value) => {
          return value.getAttribute("href") == tc.relativeURL;
        })
      ).not.toBeNull();
    });

    expect(screen.getAllByTestId("mock-arrow")).toHaveLength(testCards.length);
    expect(screen.getAllByRole("button")).toHaveLength(testCards.length);
  }

  testCases.forEach((tc) => {
    it(tc.name, () => {
      assert(tc.cards);
    });
  });
});
