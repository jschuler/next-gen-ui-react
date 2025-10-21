// Central registry for all component demos
// Adding a new component is as simple as adding an entry here!

import {
  dynamicDemo,
  dynamicDemoImage,
  dynamicDemoTable,
  imageDemo,
  imageDemoLarge,
  oneCardDemo,
  oneCardDemoNoImage,
  oneCardDemoSmallImage,
  setOfCardsDemo,
  setOfCardsDemoTwoCards,
  tableDemo,
  tableDemoComplexData,
  videoDemo,
  videoDemoAuto,
  videoDemo4x3,
} from "../demo/demoData";

export interface ComponentExample {
  title: string;
  data: unknown;
}

export interface ComponentConfig {
  id: string;
  name: string;
  path: string;
  sourceUrl: string;
  componentImportPath: string;
  examples: ComponentExample[];
}

export const componentRegistry: ComponentConfig[] = [
  {
    id: "dynamic",
    name: "DynamicComponents",
    path: "/dynamic",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/DynamicComponents.tsx",
    componentImportPath: "@local-lib/components/DynamicComponents",
    examples: [
      { title: "One Card Component", data: dynamicDemo },
      { title: "Image Component", data: dynamicDemoImage },
      { title: "Table Component", data: dynamicDemoTable },
    ],
  },
  {
    id: "error",
    name: "ErrorPlaceholder",
    path: "/error",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/ErrorPlaceholder.tsx",
    componentImportPath: "@local-lib/components/ErrorPlaceholder",
    examples: [
      {
        title: "No content example",
        data: { hasError: false, noContentMessage: "No demo content" },
      },
      {
        title: "Error example",
        data: { hasError: true, errorMessage: "Demo error" },
      },
    ],
  },
  {
    id: "image",
    name: "ImageComponent",
    path: "/image",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/ImageComponent.tsx",
    componentImportPath: "@local-lib/components/ImageComponent",
    examples: [
      { title: "Standard Image", data: imageDemo },
      { title: "Large Image", data: imageDemoLarge },
    ],
  },
  {
    id: "onecard",
    name: "OneCardWrapper",
    path: "/onecard",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/OneCardWrapper.tsx",
    componentImportPath: "@local-lib/components/OneCardWrapper",
    examples: [
      { title: "With Medium Image", data: oneCardDemo },
      { title: "Without Image", data: oneCardDemoNoImage },
      { title: "With Small Image", data: oneCardDemoSmallImage },
    ],
  },
  {
    id: "setofcards",
    name: "SetOfCardsWrapper",
    path: "/setofcards",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/SetOfCardsWrapper.tsx",
    componentImportPath: "@local-lib/components/SetOfCardsWrapper",
    examples: [
      { title: "Three Cards", data: setOfCardsDemo },
      { title: "Two Cards", data: setOfCardsDemoTwoCards },
    ],
  },
  {
    id: "table",
    name: "TableWrapper",
    path: "/table",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/TableWrapper.tsx",
    componentImportPath: "@local-lib/components/TableWrapper",
    examples: [
      { title: "Simple Table", data: tableDemo },
      { title: "Complex Data Types", data: tableDemoComplexData },
    ],
  },
  {
    id: "video",
    name: "VideoPlayerWrapper",
    path: "/video",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/VideoPlayerWrapper.tsx",
    componentImportPath: "@local-lib/components/VideoPlayerWrapper",
    examples: [
      { title: "YouTube with Poster Image (16:9)", data: videoDemo },
      { title: "Direct Video with Auto Aspect Ratio", data: videoDemoAuto },
      { title: "Classic 4:3 Format", data: videoDemo4x3 },
    ],
  },
];

// Helper functions
export const getComponentByPath = (path: string) =>
  componentRegistry.find((c) => c.path === path);

export const getComponentById = (id: string) =>
  componentRegistry.find((c) => c.id === id);
