// Central registry for all component demos
// Adding a new component is as simple as adding an entry here!

import {
  chartDemoBar,
  chartDemoBarLargeNumbers,
  chartDemoBarMoviesHorizontal,
  chartDemoBarScaled,
  chartDemoBarStacked,
  chartDemoBarSubscriptionRuntimes,
  chartDemoDonut,
  chartDemoDonutCostBreakdown,
  chartDemoLine,
  chartDemoLineLargeNumbers,
  chartDemoLinePerformance,
  chartDemoPie,
  chartDemoPieServerDistribution,
  chartMovieROISimple,
  dataViewDateSort,
  dataViewMinimal,
  dataViewMinimalSmall,
  dataViewNumericSort,
  dataViewItemClick,
  dataViewServers,
  dataViewSubscriptions,
  dataViewWithIcons,
  dynamicDemo,
  dynamicDemoDataViewWithFormatters,
  dynamicDemoImage,
  dynamicDemoTable,
  emptyStateCustomIcon,
  emptyStateError,
  emptyStateInfo,
  emptyStateSuccess,
  emptyStateWarning,
  imageDemo,
  imageDemoLarge,
  imageLogoGrid,
  oneCardDemo,
  oneCardDemoAPIEndpoint,
  oneCardDemoNoImage,
  oneCardDemoSmallImage,
  oneCardDemoWithDates,
  setOfCardsDemo,
  setOfCardsDemoTwoCards,
  setOfCardsDemoWithImages,
  videoDemo,
  videoDemoAuto,
  videoDemo4x3,
} from "../demo/demoData";

export interface ComponentExample {
  title: string;
  data: unknown;
  /** Optional short description shown below the example title */
  description?: string;
  /** Optional explanation for "How this was set up" (e.g. registry formatters) */
  setupDescription?: string;
  /** Optional code snippet shown with setupDescription */
  setupCode?: string;
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
    id: "dataview",
    name: "DataViewWrapper",
    path: "/component/dataview",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/DataViewWrapper.tsx",
    componentImportPath: "@local-lib/components/DataViewWrapper",
    examples: [
      { title: "Server List", data: dataViewServers },
      {
        title: "Minimal (12 items, filters & pagination enabled)",
        data: dataViewMinimal,
      },
      {
        title: "Minimal (5 items, filters & pagination auto-disabled)",
        data: dataViewMinimalSmall,
      },
      { title: "Numeric Sorting Demo", data: dataViewNumericSort },
      { title: "ISO Date/Time Sorting Demo", data: dataViewDateSort },
      { title: "Item Click Handler Demo", data: dataViewItemClick },
      {
        title: "Column Formatters",
        data: dataViewWithIcons,
        description:
          "Status, Health, and CPU Usage columns are formatted with icons. Formatters are registered by field id; DataViewWrapper resolves them automatically when rendered inside a registry provider.",
        setupDescription:
          "Wrap your app (or the subtree that contains the table) with ComponentHandlerRegistryProvider. Where you have access to the tree (e.g. a layout or parent component), call useComponentHandlerRegistry() and register formatters by field id. Each table field has a matching id (server-status, server-health, server-cpu). DataViewWrapper resolves formatters via the registry when rendered inside the provider; field definitions do not include a formatter property.",
        setupCode: `// 1. Wrap your app (or subtree) with ComponentHandlerRegistryProvider
<ComponentHandlerRegistryProvider>
  <App />
</ComponentHandlerRegistryProvider>

// 2. In a component inside the provider, get the registry and register formatters
function MyLayout() {
  const registry = useComponentHandlerRegistry();

  useMemo(() => {
    registry.registerFormatter({ id: "server-status" }, (value) => {
      const status = String(value);
      return (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {status === "Running" ? <Icon status="success"><CheckCircleIcon /></Icon> : ...}
          {status}
        </span>
      );
    });
    registry.registerFormatter({ id: "server-health" }, (value) => { ... });
    registry.registerFormatter({ id: "server-cpu" }, (value) => { ... });
  }, [registry]);

  return <DataViewWrapper id="dataview-with-icons" fields={fields} />;
}`,
      },
      { title: "Subscriptions", data: dataViewSubscriptions },
    ],
  },
  {
    id: "dynamic",
    name: "DynamicComponents",
    path: "/component/dynamic",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/DynamicComponents.tsx",
    componentImportPath: "@local-lib/components/DynamicComponents",
    examples: [
      { title: "One Card Component", data: dynamicDemo },
      { title: "Image Component", data: dynamicDemoImage },
      {
        title: "Data View Component (Table - Backwards Compatible)",
        data: dynamicDemoTable,
      },
      {
        title: "Data View with Formatted Columns",
        data: dynamicDemoDataViewWithFormatters,
      },
      { title: "Bar Chart", data: chartDemoBar },
      { title: "Line Chart", data: chartDemoLine },
      { title: "Pie Chart", data: chartDemoPie },
      { title: "Set of Cards", data: setOfCardsDemo },
    ],
  },
  {
    id: "error",
    name: "ErrorPlaceholder",
    path: "/component/error",
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
    id: "emptystate",
    name: "EmptyStateWrapper",
    path: "/component/emptystate",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/EmptyStateWrapper.tsx",
    componentImportPath: "@local-lib/components/EmptyStateWrapper",
    examples: [
      { title: "Info State", data: emptyStateInfo },
      { title: "Success State", data: emptyStateSuccess },
      { title: "Warning State", data: emptyStateWarning },
      { title: "Error State", data: emptyStateError },
      { title: "Custom Icon", data: emptyStateCustomIcon },
    ],
  },
  {
    id: "image",
    name: "ImageComponent",
    path: "/component/image",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/ImageComponent.tsx",
    componentImportPath: "@local-lib/components/ImageComponent",
    examples: [
      { title: "Standard Image", data: imageDemo },
      { title: "Large Image", data: imageDemoLarge },
      { title: "Red Hat Logo", data: imageLogoGrid },
    ],
  },
  {
    id: "onecard",
    name: "OneCardWrapper",
    path: "/component/onecard",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/OneCardWrapper.tsx",
    componentImportPath: "@local-lib/components/OneCardWrapper",
    examples: [
      { title: "With Medium Image", data: oneCardDemo },
      { title: "Without Image", data: oneCardDemoNoImage },
      { title: "With Small Image", data: oneCardDemoSmallImage },
      { title: "API Endpoint Status", data: oneCardDemoAPIEndpoint },
      { title: "With Date Fields", data: oneCardDemoWithDates },
    ],
  },
  {
    id: "setofcards",
    name: "SetOfCardsWrapper",
    path: "/component/setofcards",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/SetOfCardsWrapper.tsx",
    componentImportPath: "@local-lib/components/SetOfCardsWrapper",
    examples: [
      { title: "Three Cards", data: setOfCardsDemo },
      { title: "Two Cards", data: setOfCardsDemoTwoCards },
      { title: "Team Members (Four Cards)", data: setOfCardsDemoWithImages },
    ],
  },
  {
    id: "video",
    name: "VideoPlayerWrapper",
    path: "/component/video",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/VideoPlayerWrapper.tsx",
    componentImportPath: "@local-lib/components/VideoPlayerWrapper",
    examples: [
      { title: "YouTube with Poster Image (16:9)", data: videoDemo },
      { title: "Direct Video with Auto Aspect Ratio", data: videoDemoAuto },
      { title: "Classic 4:3 Format", data: videoDemo4x3 },
    ],
  },
  {
    id: "chart",
    name: "ChartComponent",
    path: "/component/chart",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/ChartComponent.tsx",
    componentImportPath: "@local-lib/components/ChartComponent",
    examples: [
      { title: "Bar Chart - Quarterly Revenue", data: chartDemoBar },
      { title: "Bar Chart - Large Numbers", data: chartDemoBarLargeNumbers },
      {
        title: "Bar Chart - Movie Box Office (Horizontal)",
        data: chartDemoBarMoviesHorizontal,
      },
      { title: "Bar Chart - Scaled (70%)", data: chartDemoBarScaled },
      {
        title: "Bar Chart - Subscription Runtimes (Long Labels)",
        data: chartDemoBarSubscriptionRuntimes,
      },
      { title: "Bar Chart - Stacked Sales", data: chartDemoBarStacked },
      { title: "Line Chart - Website Traffic", data: chartDemoLine },
      { title: "Line Chart - Large Numbers", data: chartDemoLineLargeNumbers },
      { title: "Line Chart - Performance", data: chartDemoLinePerformance },
      { title: "Pie Chart - Browser Market Share", data: chartDemoPie },
      {
        title: "Pie Chart - Server Distribution",
        data: chartDemoPieServerDistribution,
      },
      { title: "Donut Chart - Storage Usage", data: chartDemoDonut },
      {
        title: "Donut Chart - Cost Breakdown",
        data: chartDemoDonutCostBreakdown,
      },
      {
        title: "Mirrored Bar Chart - Movie ROI vs Budget",
        data: chartMovieROISimple,
      },
    ],
  },
  {
    id: "registry",
    name: "ComponentHandlerRegistry",
    path: "/component/registry",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/ComponentHandlerRegistry.tsx",
    componentImportPath: "@local-lib/components/ComponentHandlerRegistry",
    examples: [
      {
        title: "Basic Formatter Registration",
        data: { type: "registry-basic" },
      },
      {
        title: "Data-Type Specific Formatters",
        data: { type: "registry-datatype" },
      },
      {
        title: "Field-ID Specific Formatters",
        data: { type: "registry-fieldid" },
      },
      {
        title: "Row Click Handlers",
        data: { type: "registry-rowclick" },
      },
      {
        title: "Multiple Resolution Strategies",
        data: { type: "registry-strategies" },
      },
    ],
  },
];

// Helper functions
export const getComponentByPath = (path: string) =>
  componentRegistry.find((c) => c.path === path);

export const getComponentById = (id: string) =>
  componentRegistry.find((c) => c.id === id);
