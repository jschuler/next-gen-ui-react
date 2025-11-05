import { Card, CardBody } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from "@patternfly/react-icons";
import React from "react";

interface EmptyStateProps {
  title: string;
  content: string;
  icon?: string;
  variant?: "success" | "info" | "warning" | "error";
  id?: string;
  className?: string;
}

const EmptyStateWrapper: React.FC<EmptyStateProps> = ({
  title,
  content,
  icon,
  variant = "info",
  id,
  className,
}) => {
  const iconMap: Record<string, React.ComponentType<object>> = {
    InfoCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ExclamationCircleIcon,
  };

  const defaultIcons: Record<string, React.ComponentType<object>> = {
    info: InfoCircleIcon,
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: ExclamationCircleIcon,
  };

  const IconComponent =
    icon && iconMap[icon] ? iconMap[icon] : defaultIcons[variant];

  const variantColors: Record<string, string> = {
    info: "var(--pf-v6-global--info-color--100)",
    success: "var(--pf-v6-global--success-color--100)",
    warning: "var(--pf-v6-global--warning-color--100)",
    error: "var(--pf-v6-global--danger-color--100)",
  };

  return (
    <Card
      id={id}
      className={className}
      style={{
        textAlign: "center",
        padding: "var(--pf-v6-global--spacer--lg)",
      }}
    >
      <CardBody>
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "var(--pf-v6-global--spacer--md)",
            color: variantColors[variant],
          }}
        >
          <IconComponent />
        </div>
        <h3
          style={{
            marginBottom: "var(--pf-v6-global--spacer--sm)",
            fontSize: "var(--pf-v6-global--FontSize--lg)",
          }}
        >
          {title}
        </h3>
        <div style={{ color: "var(--pf-v6-global--Color--200)" }}>
          {content.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default EmptyStateWrapper;
