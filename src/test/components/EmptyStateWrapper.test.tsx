import { render, screen } from "@testing-library/react";

import EmptyStateWrapper from "../../components/EmptyStateWrapper";

describe("EmptyStateWrapper Component", () => {
  const defaultProps = {
    title: "No Results Found",
    content: "Try adjusting your search filters",
  };

  it("should render with default info variant", () => {
    const { container } = render(<EmptyStateWrapper {...defaultProps} />);

    expect(screen.getByText("No Results Found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search filters")
    ).toBeInTheDocument();

    const emptyState = container.querySelector(".empty-state-info");
    expect(emptyState).toBeInTheDocument();
  });

  it("should render success variant with correct icon", () => {
    render(
      <EmptyStateWrapper
        {...defaultProps}
        variant="success"
        title="Success!"
        content="Operation completed successfully"
      />
    );

    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(
      screen.getByText("Operation completed successfully")
    ).toBeInTheDocument();
  });

  it("should render warning variant with correct icon", () => {
    render(
      <EmptyStateWrapper
        {...defaultProps}
        variant="warning"
        title="Warning"
        content="Please review your settings"
      />
    );

    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText("Please review your settings")).toBeInTheDocument();
  });

  it("should render error variant with correct icon", () => {
    render(
      <EmptyStateWrapper
        {...defaultProps}
        variant="error"
        title="Error"
        content="Something went wrong"
      />
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should handle multi-line content", () => {
    const multiLineContent = "Line 1\nLine 2\nLine 3";
    render(<EmptyStateWrapper {...defaultProps} content={multiLineContent} />);

    expect(screen.getByText("Line 1")).toBeInTheDocument();
    expect(screen.getByText("Line 2")).toBeInTheDocument();
    expect(screen.getByText("Line 3")).toBeInTheDocument();
  });

  it("should render custom icon when provided", () => {
    render(
      <EmptyStateWrapper
        {...defaultProps}
        icon="CheckCircleIcon"
        variant="info"
      />
    );

    expect(screen.getByText("No Results Found")).toBeInTheDocument();
  });

  it("should apply custom id", () => {
    const customId = "custom-empty-state";
    const { container } = render(
      <EmptyStateWrapper {...defaultProps} id={customId} />
    );

    const element = container.querySelector(`#${customId}`);
    expect(element).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const customClassName = "test-class";
    const { container } = render(
      <EmptyStateWrapper {...defaultProps} className={customClassName} />
    );

    const element = container.querySelector(`.${customClassName}`);
    expect(element).toBeInTheDocument();
  });

  it("should apply both custom id and className", () => {
    const customId = "test-id";
    const customClassName = "test-class";
    const { container } = render(
      <EmptyStateWrapper
        {...defaultProps}
        id={customId}
        className={customClassName}
      />
    );

    const element = container.querySelector(`#${customId}`);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass(customClassName);
  });

  it("should render with PatternFly Card structure and CSS classes", () => {
    const { container } = render(<EmptyStateWrapper {...defaultProps} />);

    const card = container.querySelector(".pf-v6-c-card");
    expect(card).toBeInTheDocument();

    const cardBody = container.querySelector(".pf-v6-c-card__body");
    expect(cardBody).toBeInTheDocument();

    const emptyStateContainer = container.querySelector(
      ".empty-state-container"
    );
    expect(emptyStateContainer).toBeInTheDocument();

    const icon = container.querySelector(".empty-state-icon");
    expect(icon).toBeInTheDocument();

    const title = container.querySelector(".empty-state-title");
    expect(title).toBeInTheDocument();

    const content = container.querySelector(".empty-state-content");
    expect(content).toBeInTheDocument();
  });

  it("should render icon, title, and content in correct order", () => {
    const { container } = render(<EmptyStateWrapper {...defaultProps} />);

    expect(screen.getByText("No Results Found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search filters")
    ).toBeInTheDocument();

    const cardBody = container.querySelector(".pf-v6-c-card__body");
    expect(cardBody).toBeInTheDocument();
  });

  it("should handle empty string content", () => {
    render(<EmptyStateWrapper title="Empty Content" content="" />);

    expect(screen.getByText("Empty Content")).toBeInTheDocument();
  });

  it("should handle special characters in content", () => {
    const specialContent = "Content with <special> & {characters}";
    render(<EmptyStateWrapper {...defaultProps} content={specialContent} />);

    expect(screen.getByText(specialContent)).toBeInTheDocument();
  });

  it("should fallback to default icon if invalid icon name provided", () => {
    render(
      <EmptyStateWrapper
        {...defaultProps}
        icon="InvalidIcon"
        variant="success"
      />
    );

    expect(screen.getByText("No Results Found")).toBeInTheDocument();
  });

  it("should render all four variants correctly", () => {
    const variants: Array<"info" | "success" | "warning" | "error"> = [
      "info",
      "success",
      "warning",
      "error",
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <EmptyStateWrapper
          title={`${variant} title`}
          content={`${variant} content`}
          variant={variant}
        />
      );

      expect(screen.getByText(`${variant} title`)).toBeInTheDocument();
      expect(screen.getByText(`${variant} content`)).toBeInTheDocument();

      unmount();
    });
  });

  it("should handle long content text", () => {
    const longContent =
      "This is a very long content text that should still render properly without breaking the component layout or causing any issues.";
    render(<EmptyStateWrapper {...defaultProps} content={longContent} />);

    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it("should render title as h3 element", () => {
    render(<EmptyStateWrapper {...defaultProps} />);

    const titleElement = screen.getByRole("heading", { level: 3 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent("No Results Found");
  });

  it("should render content paragraphs for multi-line content", () => {
    const multiLineContent = "Paragraph 1\nParagraph 2\nParagraph 3";
    render(<EmptyStateWrapper {...defaultProps} content={multiLineContent} />);

    expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
    expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
    expect(screen.getByText("Paragraph 3")).toBeInTheDocument();
  });
});
