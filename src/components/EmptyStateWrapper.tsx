import { Card, CardBody } from "@patternfly/react-core";
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
  icon = "ℹ️",
  variant = "info",
  id,
  className,
}) => {
  return (
    <Card 
      id={id} 
      className={`empty-state-container empty-state-${variant} ${className || ''}`}
    >
      <CardBody className="empty-state-body">
        <div className="empty-state-icon">{icon}</div>
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

