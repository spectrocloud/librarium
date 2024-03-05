import React from "react";
import { render, screen } from "@testing-library/react";
import SimpleCardGrid from ".";

describe("Display SimpleCardGrid", () => {
  interface testCard {
    title: string;
    description: string;
    buttonText: string;
    relativeURL: string;
  }

  interface testCase {
    name: string;
    cardsPerRow: number;
    cards: testCard[];
  }

  const testCards: testCard[] = [
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

  const testCases: testCase[] = [
    {
      name: "multiple row cards",
      cardsPerRow: 2,
      cards: testCards.slice(),
    },
    {
      name: "single row cards",
      cardsPerRow: 2,
      cards: testCards.slice(2),
    },
    {
      name: "less cards than a single row",
      cardsPerRow: 2,
      cards: testCards.slice(1),
    },
    {
      name: "empty cards",
      cardsPerRow: 2,
      cards: [],
    },
  ];

  function assert(cardsPerRow: number, testCards: testCard[]) {
    const { container } = render(<SimpleCardGrid cardsPerRow={cardsPerRow} cards={testCards} />);
    testCards.forEach((tc) => {
      expect(screen.getByText(tc.title)).toBeInTheDocument();
      expect(screen.getByText(tc.description)).toBeInTheDocument();
      expect(screen.getByText(tc.buttonText, { selector: "button" })).toBeInTheDocument();
      expect(
        screen.getAllByRole("link").filter((value) => {
          return value.getAttribute("href") == tc.relativeURL;
        })
      ).not.toBeNull();
    });

    if (testCards.length != 0) {
      expect(screen.getAllByRole("button")).toHaveLength(testCards.length);
      expect(container.querySelectorAll(".row")).toHaveLength(Math.ceil(testCards.length / cardsPerRow));
    } else {
      expect(container.querySelectorAll(".row")).toHaveLength(0)
    }
  }

  testCases.forEach((tc) => {
    it(tc.name, () => {
      assert(tc.cardsPerRow, tc.cards);
    });
  });
});
