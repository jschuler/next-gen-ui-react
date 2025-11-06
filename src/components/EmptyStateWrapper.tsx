import { Card, CardBody } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from "@patternfly/react-icons";
import React from "react";

import "./EmptyStateWrapper.css";

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

  return (
    <Card
      id={id}
      className={`empty-state-container empty-state-${variant} ${className || ""}`}
    >
      <CardBody>
        <div className="empty-state-icon">
          <IconComponent />
        </div>
        <h3 className="empty-state-title">{title}</h3>
        <div className="empty-state-content">
          {content.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default EmptyStateWrapper;
