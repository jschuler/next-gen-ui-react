import { render, screen } from "@testing-library/react";

import SetOfCardsWrapper from "../../components/SetOfCardsWrapper";

describe("SetOfCardsWrapper", () => {
  const mockProps = {
    component: "set-of-cards" as const,
    id: "test-set-of-cards",
    title: "Test Movies",
    fields: [
      {
        name: "Title",
        data_path: "movie.title",
        data: ["Toy Story", "Finding Nemo"],
      },
      {
        name: "Year",
        data_path: "movie.year",
        data: [1995, 2003],
      },
      {
        name: "Rating",
        data_path: "movie.rating",
        data: [8.3, 8.1],
      },
    ],
  };

  it("renders the component with correct title", () => {
    render(<SetOfCardsWrapper {...mockProps} />);
    expect(screen.getByText("Test Movies")).toBeInTheDocument();
  });

  it("renders the correct number of cards", () => {
    render(<SetOfCardsWrapper {...mockProps} />);
    // Should render 2 cards based on the data length
    expect(screen.getByText("Test Movies 1")).toBeInTheDocument();
    expect(screen.getByText("Test Movies 2")).toBeInTheDocument();
  });

  it("renders cards with correct field data", () => {
    render(<SetOfCardsWrapper {...mockProps} />);

    // Check first card data (numbers use locale formatting, e.g. 1,995)
    expect(screen.getByText("Toy Story")).toBeInTheDocument();
    expect(screen.getByText("1,995")).toBeInTheDocument();
    expect(screen.getByText("8.3")).toBeInTheDocument();

    // Check second card data
    expect(screen.getByText("Finding Nemo")).toBeInTheDocument();
    expect(screen.getByText("2,003")).toBeInTheDocument();
    expect(screen.getByText("8.1")).toBeInTheDocument();
  });

  it("handles empty fields array", () => {
    const emptyProps = {
      ...mockProps,
      fields: [],
    };
    render(<SetOfCardsWrapper {...emptyProps} />);
    expect(screen.getByText("Test Movies")).toBeInTheDocument();
    // Should not render any cards
    expect(screen.queryByText("Test Movies 1")).not.toBeInTheDocument();
  });

  it("handles fields with different data lengths", () => {
    const unevenProps = {
      ...mockProps,
      fields: [
        {
          name: "Title",
          data_path: "movie.title",
          data: ["Movie 1", "Movie 2", "Movie 3"],
        },
        {
          name: "Year",
          data_path: "movie.year",
          data: [1995, 2003], // Shorter array
        },
      ],
    };
    render(<SetOfCardsWrapper {...unevenProps} />);

    // Should render 3 cards based on the longest data array
    expect(screen.getByText("Test Movies 1")).toBeInTheDocument();
    expect(screen.getByText("Test Movies 2")).toBeInTheDocument();
    expect(screen.getByText("Test Movies 3")).toBeInTheDocument();
  });

  it("handles array data correctly", () => {
    const arrayProps = {
      ...mockProps,
      fields: [
        {
          name: "Actors",
          data_path: "movie.actors",
          data: [
            ["Tom Hanks", "Tim Allen"],
            ["Albert Brooks", "Ellen DeGeneres"],
          ],
        },
      ],
    };
    render(<SetOfCardsWrapper {...arrayProps} />);

    // Arrays should be joined with commas
    expect(screen.getByText("Tom Hanks, Tim Allen")).toBeInTheDocument();
    expect(
      screen.getByText("Albert Brooks, Ellen DeGeneres")
    ).toBeInTheDocument();
  });

  it("handles null/undefined values", () => {
    const nullProps = {
      ...mockProps,
      fields: [
        {
          name: "Title",
          data_path: "movie.title",
          data: ["Movie 1", null, "Movie 3"],
        },
      ],
    };
    render(<SetOfCardsWrapper {...nullProps} />);

    // Should render 3 cards, with empty content for null value
    expect(screen.getByText("Test Movies 1")).toBeInTheDocument();
    expect(screen.getByText("Test Movies 2")).toBeInTheDocument();
    expect(screen.getByText("Test Movies 3")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customProps = {
      ...mockProps,
      className: "custom-class",
    };
    const { container } = render(<SetOfCardsWrapper {...customProps} />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with correct container structure", () => {
    const { container } = render(<SetOfCardsWrapper {...mockProps} />);

    // Check container structure
    const containerElement = container.querySelector("#test-set-of-cards");
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveClass("set-of-cards-container");

    // Check grid structure
    const gridElement = container.querySelector(".set-of-cards-grid");
    expect(gridElement).toBeInTheDocument();
  });
});
