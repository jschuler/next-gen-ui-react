import { Card, CardBody, CardHeader, CardTitle } from "@patternfly/react-core";
import React, { useState } from "react";

import ErrorPlaceholder from "./ErrorPlaceholder";

export interface ImageComponentProps {
  component: "image";
  id: string;
  image?: string | null;
  title: string;
  className?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  id,
  image,
  title,
  className,
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  return (
    <Card id={id} className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        {image && !hasImageError ? (
          <img
            src={image}
            alt={title}
            className="image-component-img"
            onError={handleImageError}
          />
        ) : (
          <ErrorPlaceholder
            hasError={hasImageError}
            errorMessage="Image failed to load"
            noContentMessage="No image provided"
          />
        )}
      </CardBody>
    </Card>
  );
};

export default ImageComponent;
