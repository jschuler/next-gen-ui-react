import { Card, CardBody } from "@patternfly/react-core";
import {
  InfoCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from "@patternfly/react-icons";
import React from "react";

interface EmptyStateProps {
  title: string;
  content: string;
  icon?: string;
  variant?: 'success' | 'info' | 'warning' | 'error';
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
  // Map icon names to PatternFly icon components
  const iconMap: Record<string, React.ComponentType<any>> = {
    InfoCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ExclamationCircleIcon,
  };

  // Default icons based on variant
  const defaultIcons: Record<string, React.ComponentType<any>> = {
    info: InfoCircleIcon,
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: ExclamationCircleIcon,
  };

  // Resolve icon: use provided icon name, or default based on variant
  const IconComponent = icon && iconMap[icon] 
    ? iconMap[icon] 
    : defaultIcons[variant];

  return (
    <Card 
      id={id} 
      className={`empty-state-container empty-state-${variant} ${className || ''}`}
    >
      <CardBody className="empty-state-body">
        <div className="empty-state-icon">
          <IconComponent />
        </div>
        <h3 className="empty-state-title">{title}</h3>
        <div className="empty-state-content">
          {content.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default EmptyStateWrapper;

