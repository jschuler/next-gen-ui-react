import React from "react";

interface ErrorPlaceholderProps {
  hasError: boolean;
  errorMessage?: string;
  noContentMessage?: string;
  className?: string;
}

const ErrorPlaceholder: React.FC<ErrorPlaceholderProps> = ({
  hasError,
  errorMessage = "Content failed to load",
  noContentMessage = "No content available",
  className = "",
}) => {
  const message = hasError ? errorMessage : noContentMessage;
  const errorClass = hasError ? "error-state" : "";

  return (
    <div className={`error-placeholder ${errorClass} ${className}`}>
      {message}
    </div>
  );
};

export default ErrorPlaceholder;
