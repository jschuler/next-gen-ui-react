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
import React from "react";

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

  return (
    <Card 
      id={id} 
      className={`onecard-component-container ${className || ''}`}
    >
      <CardBody>
        <Flex spaceItems={{ default: "spaceItemsLg" }} alignItems={{ default: "alignItemsFlexStart" }}>
          {/* Left Column - Image */}
          {image && (
            <FlexItem className={`onecard-component-image-container size-${imageSize}`}>
              <img
                src={image}
                alt={title}
                className="onecard-component-img"
              />
            </FlexItem>
          )}

          {/* Right Column - Title + Fields */}
          <FlexItem grow={{ default: "grow" }}>
            <Title headingLevel="h4" size="lg" className="onecard-component-title">
              {title}
            </Title>
            <Divider component="div" className="onecard-component-divider" />
            <div>
              <DescriptionList isAutoFit>
                {fields?.map((field, idx) => (
                  <DescriptionListGroup key={idx}>
                    <DescriptionListTerm>{field.name}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {field.data.map((item) =>
                        item === null ? "N/A" : String(item)
                      ).join(", ")}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ))}
              </DescriptionList>
            </div>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default OneCardWrapper;
