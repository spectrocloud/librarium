import React from "react";
import { PageHit } from "../src/shared/layouts/Default/search/hitComps";
import { render, fireEvent } from "@testing-library/react";
import { InstantSearch } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";

describe("Displays hitComps Component", () => {
  it("renders the link with the correct URL", () => {
    const mockNavigate = jest.fn();
    window.___navigate = mockNavigate;
    const searchClient = algoliasearch("1234", "abcd");
    const hit = { slug: "/example-slug" };
    const { getByRole } = render(
      <InstantSearch searchClient={searchClient} indexName="test">
        <PageHit hit={hit} />
      </InstantSearch>
    );
    const link = getByRole("link");
    expect(link.getAttribute("href")).toBe("/example-slug");
    fireEvent.click(link);
    expect(window.___navigate.mock.calls[0][0]).toBe("/example-slug");
  });
});
