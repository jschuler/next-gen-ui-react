import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Card,
  CardBody,
  Divider,
  Flex,
  FlexItem,
  Title,
} from "@patternfly/react-core";
import React, { useState } from "react";

import ErrorPlaceholder from "./ErrorPlaceholder";
import { formatValue } from "../utils/valueFormatter";

interface DataField {
  name: string;
  data_path: string;
  data: (string | number | boolean | null)[];
}

interface OneCardProps {
  title: string;
  fields: DataField[];
  image?: string | null;
  id?: string;
  imageSize?: "sm" | "md" | "lg";
  className?: string;
}

const OneCardWrapper: React.FC<OneCardProps> = ({
  title,
  fields,
  image,
  id,
  imageSize = "md",
  className,
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;
  const hasNoTitle = !title || title.trim() === "";

  // If no title and no fields, show error
  if (hasNoTitle && hasNoFields) {
    return (
      <Card
        id={id}
        className={`onecard-component-container ${className || ""}`}
      >
        <CardBody>
          <ErrorPlaceholder
            hasError={false}
            noContentMessage="No content available"
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card id={id} className={`onecard-component-container ${className || ""}`}>
      <CardBody>
        <Flex
          spaceItems={{ default: "spaceItemsLg" }}
          alignItems={{ default: "alignItemsFlexStart" }}
        >
          {/* Left Column - Image */}
          {image && !hasImageError ? (
            <FlexItem
              className={`onecard-component-image-container size-${imageSize}`}
            >
              <img
                src={image}
                alt={title}
                className="onecard-component-img"
                onError={handleImageError}
              />
            </FlexItem>
          ) : image && hasImageError ? (
            <FlexItem
              className={`onecard-component-image-container size-${imageSize}`}
            >
              <ErrorPlaceholder
                hasError={true}
                errorMessage="Image failed to load"
                noContentMessage=""
              />
            </FlexItem>
          ) : null}

          {/* Right Column - Title + Fields */}
          <FlexItem grow={{ default: "grow" }}>
            <Title
              headingLevel="h4"
              size="lg"
              className="onecard-component-title"
            >
              {title}
            </Title>
            <Divider component="div" className="onecard-component-divider" />
            <div>
              {hasNoFields ? (
                <ErrorPlaceholder
                  hasError={false}
                  noContentMessage="No data fields available"
                />
              ) : (
                <DescriptionList isAutoFit>
                  {fields?.map((field, idx) => (
                    <DescriptionListGroup key={idx}>
                      <DescriptionListTerm>{field.name}</DescriptionListTerm>
                      <DescriptionListDescription>
                        {field.data
                          .map((item) =>
                            item === null ? "N/A" : formatValue(item)
                          )
                          .join(", ")}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  ))}
                </DescriptionList>
              )}
            </div>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default OneCardWrapper;
