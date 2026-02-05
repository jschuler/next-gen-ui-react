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
import React, { useState, useMemo } from "react";

import { useComponentHandlerRegistry } from "./ComponentHandlerRegistry";
import ErrorPlaceholder from "./ErrorPlaceholder";
import { getDataTypeClass } from "../utils/cssClassHelpers";
import { resolveFormatterForField } from "../utils/formatterResolution";

interface DataField {
  name: string;
  data_path: string;
  data: (string | number | boolean | null)[];
  id?: string;
}

export interface OneCardProps {
  title: string;
  fields: DataField[];
  image?: string | null;
  id?: string;
  imageSize?: "sm" | "md" | "lg";
  className?: string;
  inputDataType?: string;
}

const OneCardWrapper: React.FC<OneCardProps> = ({
  title,
  fields,
  image,
  id,
  imageSize = "md",
  className,
  inputDataType,
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const registry = useComponentHandlerRegistry();

  const handleImageError = () => {
    setHasImageError(true);
  };

  // Resolve formatters for fields (shared logic with DataViewWrapper)
  const fieldsWithFormatters = useMemo(() => {
    return fields.map((field) => {
      const resolvedFormatter = resolveFormatterForField(registry, field, {
        inputDataType,
        componentId: id,
      });
      return {
        ...field,
        resolvedFormatter,
      };
    });
  }, [fields, registry, inputDataType, id]);

  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;
  const hasNoTitle = !title || title.trim() === "";

  // Combine className with dataType-based class
  const dataTypeClass = getDataTypeClass(inputDataType, "one-card");
  const combinedClassName = [
    "onecard-component-container",
    className,
    dataTypeClass,
  ]
    .filter(Boolean)
    .join(" ");

  // If no title and no fields, show error
  if (hasNoTitle && hasNoFields) {
    return (
      <Card id={id} className={combinedClassName}>
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
    <Card id={id} className={combinedClassName}>
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
                  {fieldsWithFormatters?.map((field, idx) => (
                    <DescriptionListGroup key={idx}>
                      <DescriptionListTerm>{field.name}</DescriptionListTerm>
                      <DescriptionListDescription>
                        {field.data.map((item, itemIdx) => {
                          if (item === null) {
                            return (
                              <React.Fragment key={itemIdx}>
                                N/A
                                {itemIdx < field.data.length - 1 ? ", " : ""}
                              </React.Fragment>
                            );
                          }
                          // Formatter from registry or autoFormatter (resolveFormatterForField always returns a formatter)
                          const formatted =
                            typeof field.resolvedFormatter === "function"
                              ? field.resolvedFormatter(item)
                              : String(item);

                          // Render formatted value (handles both ReactNode and primitive values)
                          return (
                            <React.Fragment key={itemIdx}>
                              {formatted}
                              {itemIdx < field.data.length - 1 ? ", " : ""}
                            </React.Fragment>
                          );
                        })}
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
