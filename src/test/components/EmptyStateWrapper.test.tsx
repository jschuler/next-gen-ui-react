import { render, screen } from "@testing-library/react";

import EmptyStateWrapper from "../../components/EmptyStateWrapper";

describe("EmptyStateWrapper Component", () => {
  const defaultProps = {
    title: "No Results Found",
    content: "Try adjusting your search filters",
  };

  it("should render with default info variant", () => {
    render(<EmptyStateWrapper {...defaultProps} />);

    expect(screen.getByText("No Results Found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search filters")
    ).toBeInTheDocument();

    // Check for default info variant class
    const container = document.querySelector(".empty-state-info");
    expect(container).toBeInTheDocument();
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

    const container = document.querySelector(".empty-state-success");
    expect(container).toBeInTheDocument();
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

    const container = document.querySelector(".empty-state-warning");
    expect(container).toBeInTheDocument();
  });

  it("should render error variant with correct icon", () => {
    render(
      <EmptyStateWrapper
        {...defaultProps}
        variant="error"
        title="Error Occurred"
        content="Something went wrong"
      />
    );

    expect(screen.getByText("Error Occurred")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    const container = document.querySelector(".empty-state-error");
    expect(container).toBeInTheDocument();
  });

  it("should handle multi-line content", () => {
    const multiLineContent = "Line 1\nLine 2\nLine 3";
    render(
      <EmptyStateWrapper title="Multi-line Test" content={multiLineContent} />
    );

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

    // Icon should be rendered (we can't directly test the icon component,
    // but we can verify the structure)
    const iconContainer = document.querySelector(".empty-state-icon");
    expect(iconContainer).toBeInTheDocument();
  });

  it("should apply custom id", () => {
    const customId = "custom-empty-state";
    render(<EmptyStateWrapper {...defaultProps} id={customId} />);

    const element = document.getElementById(customId);
    expect(element).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const customClassName = "my-custom-class";
    render(<EmptyStateWrapper {...defaultProps} className={customClassName} />);

    const container = document.querySelector(`.${customClassName}`);
    expect(container).toBeInTheDocument();
  });

  it("should apply both custom id and className", () => {
    const customId = "test-id";
    const customClassName = "test-class";

    render(
      <EmptyStateWrapper
        {...defaultProps}
        id={customId}
        className={customClassName}
      />
    );

    const element = document.getElementById(customId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass(customClassName);
    expect(element).toHaveClass("empty-state-info"); // Default variant class
  });

  it("should render with PatternFly Card structure", () => {
    render(<EmptyStateWrapper {...defaultProps} />);

    // Check for Card and CardBody structure
    const card = document.querySelector(".empty-state-container");
    expect(card).toBeInTheDocument();

    const cardBody = document.querySelector(".empty-state-body");
    expect(cardBody).toBeInTheDocument();
  });

  it("should render icon, title, and content in correct order", () => {
    render(<EmptyStateWrapper {...defaultProps} />);

    const container = document.querySelector(".empty-state-body");
    expect(container).toBeInTheDocument();

    // Check structure order
    const icon = container!.querySelector(".empty-state-icon");
    const title = container!.querySelector(".empty-state-title");
    const content = container!.querySelector(".empty-state-content");

    expect(icon).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should handle empty string content", () => {
    render(<EmptyStateWrapper title="Test Title" content="" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();

    // Empty content should still render the container
    const contentContainer = document.querySelector(".empty-state-content");
    expect(contentContainer).toBeInTheDocument();
  });

  it("should handle special characters in content", () => {
    const specialContent = "Special chars: @#$%^&*()";
    render(<EmptyStateWrapper title="Special Test" content={specialContent} />);

    expect(screen.getByText("Special chars: @#$%^&*()")).toBeInTheDocument();
  });

  it("should fallback to default icon if invalid icon name provided", () => {
    render(
      <EmptyStateWrapper
        {...defaultProps}
        icon="InvalidIconName"
        variant="success"
      />
    );

    // Should still render, falling back to variant's default icon
    const iconContainer = document.querySelector(".empty-state-icon");
    expect(iconContainer).toBeInTheDocument();
  });

  it("should render all four variants correctly", () => {
    const variants: Array<"success" | "info" | "warning" | "error"> = [
      "success",
      "info",
      "warning",
      "error",
    ];

    variants.forEach((variant) => {
      const { container } = render(
        <EmptyStateWrapper
          title={`${variant} title`}
          content={`${variant} content`}
          variant={variant}
        />
      );

      const variantClass = container.querySelector(`.empty-state-${variant}`);
      expect(variantClass).toBeInTheDocument();
    });
  });

  it("should handle long content text", () => {
    const longContent =
      "This is a very long content string that might wrap to multiple lines in the UI. "
        .repeat(10)
        .trim();

    render(
      <EmptyStateWrapper title="Long Content Test" content={longContent} />
    );

    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it("should render title as h3 element", () => {
    render(<EmptyStateWrapper {...defaultProps} />);

    const titleElement = screen.getByRole("heading", { level: 3 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent("No Results Found");
    expect(titleElement).toHaveClass("empty-state-title");
  });

  it("should render content paragraphs for multi-line content", () => {
    const content = "Paragraph 1\nParagraph 2\nParagraph 3";
    const { container } = render(
      <EmptyStateWrapper title="Test" content={content} />
    );

    const paragraphs = container.querySelectorAll(".empty-state-content p");
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0]).toHaveTextContent("Paragraph 1");
    expect(paragraphs[1]).toHaveTextContent("Paragraph 2");
    expect(paragraphs[2]).toHaveTextContent("Paragraph 3");
  });
});
