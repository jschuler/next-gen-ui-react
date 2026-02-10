import OneCardWrapper from "./OneCardWrapper";

interface FieldData {
  name: string;
  data_path: string;
  data: (string | number | boolean | null | (string | number)[])[];
  id?: string;
}

export interface SetOfCardsWrapperProps {
  component: "set-of-cards";
  id: string;
  title: string;
  fields: FieldData[];
  images?: (string | null)[] | null;
  className?: string;
  inputDataType?: string;
}

const SetOfCardsWrapper = (props: SetOfCardsWrapperProps) => {
  const { title, id, fields, images, className, inputDataType } = props;

  // Transform fields data into individual card data
  const transformFieldsToCardsData = () => {
    if (!fields || fields.length === 0) return [];

    // Find the maximum number of data items across all fields
    const maxDataLength = Math.max(...fields.map((field) => field.data.length));

    // Create individual card data for each row
    const cardsData = [];
    for (let i = 0; i < maxDataLength; i++) {
      const cardFields = fields.map((field) => {
        const item = field.data[i];
        // If the item is an array, use it directly; otherwise wrap it in an array
        const data = Array.isArray(item) ? item : [item];
        return {
          name: field.name,
          data_path: field.data_path,
          data: data,
          ...(field.id !== undefined && { id: field.id }),
        };
      });

      cardsData.push({
        title: `${title} ${i + 1}`,
        fields: cardFields,
        id: `${id}-card-${i}`,
        image: images?.[i] ?? null,
        ...(inputDataType && { inputDataType }),
      });
    }

    return cardsData;
  };

  const cardsData = transformFieldsToCardsData();

  return (
    <div id={id} className={`set-of-cards-container ${className || ""}`}>
      <h2 className="set-of-cards-title">{title}</h2>
      <div className="set-of-cards-grid">
        {cardsData.map((cardData, index) => (
          <OneCardWrapper
            key={index}
            {...cardData}
            className="set-of-cards-item"
          />
        ))}
      </div>
    </div>
  );
};

export default SetOfCardsWrapper;
