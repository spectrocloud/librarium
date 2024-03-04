import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import SimpleCardGrid from ".";

describe("Display SimpleCardGrid", () => {
  it("multiple row cards", () => {
    const { container } = render(
      <SimpleCardGrid
        cardsPerRow={2}
        cards={[
          {
            title: "1. First Card",
            description: "Card 1",
            buttonText: "Learn more",
            relativeURL: "./getting-started",
          },
          {
            title: "2. Second Card",
            description: "Card 2",
            buttonText: "Learn more",
            relativeURL: "./getting-started",
          },
          {
            title: "3. Third Card",
            description: "Card 3",
            buttonText: "Learn more",
            relativeURL: "./getting-started",
          },
        ]}
      />
    );

    expect(screen.getByText(/1. First Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Card 1/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Second Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Card 2/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Third Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Card 3/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    screen.getAllByRole("button").forEach((btn) => {
        expect(btn).toHaveTextContent(/Learn More/i);
    });
    expect(container.querySelectorAll(".row")).toHaveLength(2);
  });

  it("single row cards", () => {
    const { container } = render(
      <SimpleCardGrid
        cardsPerRow={2}
        cards={[
          {
            title: "1. First Card",
            description: "Card 1",
            buttonText: "Learn more",
            relativeURL: "./getting-started",
          },
          {
            title: "2. Second Card",
            description: "Card 2",
            buttonText: "Learn more",
            relativeURL: "./getting-started",
          },
        ]}
      />
    );

    expect(screen.getByText(/1. First Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Card 1/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Second Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Card 2/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
    screen.getAllByRole("button").forEach((btn) => {
        expect(btn).toHaveTextContent(/Learn More/i);
    });
    expect(container.querySelectorAll(".row")).toHaveLength(1);
  });

  it("less cards than a single row", () => {
    const { container } = render(
      <SimpleCardGrid
        cardsPerRow={2}
        cards={[
          {
            title: "1. First Card",
            description: "Card 1",
            buttonText: "Learn more",
            relativeURL: "./getting-started",
          },
        ]}
      />
    );

    expect(screen.getByText(/1. First Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Card 1/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    screen.getAllByRole("button").forEach((btn) => {
        expect(btn).toHaveTextContent(/Learn More/i);
    });
    expect(container.querySelectorAll(".row")).toHaveLength(1);
  });
});
