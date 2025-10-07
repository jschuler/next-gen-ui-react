import { Card, CardBody, CardHeader, CardTitle } from "@patternfly/react-core";
import React, { useState } from "react";

interface ImageComponentProps {
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
  const [imageError, setImageError] = useState(false);

  return (
    <Card id={id} className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        {image && !imageError ? (
          <img
            src={image}
            alt={title}
            className="image-component-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-component-placeholder">
            {imageError ? "Image failed to load" : "No image provided"}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ImageComponent;
