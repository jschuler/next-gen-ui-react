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
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "var(--pf-global--BorderRadius--sm)",
              objectFit: "cover",
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "var(--pf-global--Color--200)",
              borderRadius: "var(--pf-global--BorderRadius--sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--pf-global--Color--300)",
            }}
          >
            {imageError ? "Image failed to load" : "No image provided"}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ImageComponent;
