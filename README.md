# Next Gen UI Patternfly React Renderer

This npm package provides a collection of reusable Patternfly React components to support dynamic UI rendering for Next Gen UI Agent.

[**DEMO**](https://redhat-ux.github.io/next-gen-ui-react/)

This module is part of the [Next Gen UI Agent project](https://github.com/RedHat-UX/next-gen-ui-agent)

[![Module Category](https://img.shields.io/badge/Module_Category-UI_Renderer-green)](https://github.com/RedHat-UX/next-gen-ui-agent)
[![Module Status](https://img.shields.io/badge/Module_Status-Tech_Preview-orange)](https://github.com/RedHat-UX/next-gen-ui-agent)

## Provides:

- Rendering for [Next Gen UI Dynamic Componets](https://redhat-ux.github.io/next-gen-ui-agent/guide/data_ui_blocks/dynamic_components/) using React components:
  - Implemented components: `one-card`, `image`, `data-view` (or `table` for backwards compatibility), `video-player`, `set-of-cards`, `chart-bar`, `chart-line`, `chart-pie`, `chart-donut`, `chart-mirrored-bar`
  - `video-player` supports YouTube video URLs and direct video file URLs
  - `set-of-cards` displays multiple OneCard components in an auto-aligned grid layout
  - Chart components support multiple data series with interactive legends and tooltips
- Dynamic Component Renderer
  - `DynamicComponent`
- Patternfly React Components
  - `OneCardWrapper`
  - `ImageComponent`
  - `DataViewWrapper`
  - `VideoPlayerWrapper`
  - `SetOfCardsWrapper`
  - `ChartComponent` (Bar, Line, Pie, Donut, Mirrored Bar)

## Installation

**Pre-requisites:**

- React 18+
- TypeScript

```bash
npm install @rhngui/patternfly-react-renderer
```

## Usage Examples

**Note:** JSON configs used in examples are normally produced by _Next Gen UI Agent_.

### OneCard Component

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const onecardConfig = {
  component: "one-card",
  image:
    "https://image.tmdb.org/t/p/w440_and_h660_face/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
  id: "one-card-id",
  title: "Toy Story Movie",
  fields: [
    {
      name: "Title",
      data_path: "$..movie.title",
      data: ["Toy Story"],
    },
    {
      name: "Year",
      data_path: "$..movie.year",
      data: [1995],
    },
    {
      name: "Rating",
      data_path: "$..movie.imdbRating",
      data: [8.3],
    },
    {
      name: "Release Date",
      data_path: "$..movie.released",
      data: ["2022-11-02"],
    },
  ],
};

function App() {
  return <DynamicComponent config={onecardConfig} />;
}
```

### Image Component

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const imageConfig = {
  component: "image",
  title: "Movie Poster",
  image:
    "https://image.tmdb.org/t/p/w440_and_h660_face/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
  id: "movie-poster-image",
};

function App() {
  return <DynamicComponent config={imageConfig} />;
}
```

### Data View Component

The Data View component provides a feature-rich table with sorting, filtering, and pagination. The `component: "table"` is supported for backwards compatibility and uses DataViewWrapper.

#### Basic Configuration

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const dataViewConfig = {
  component: "data-view", // Use "table" for backwards compatibility
  id: "movie-stats-table",
  fields: [
    {
      name: "Movie Title",
      data_path: "movies.title",
      data: ["Toy Story", "Finding Nemo", "The Incredibles"],
    },
    {
      name: "Release Year",
      data_path: "movies.year",
      data: [1995, 2003, 2004],
    },
    {
      name: "Genres",
      data_path: "movies.genres",
      data: [
        ["Animation", "Adventure"],
        ["Animation", "Adventure"],
        ["Animation", "Action"],
      ],
    },
    {
      name: "Rating",
      data_path: "movies.rating",
      data: [8.3, 8.1, 8.0],
    },
  ],
  perPage: 5,
  enableFilters: true,
  enablePagination: true,
  enableSort: true,
};

function App() {
  return <DynamicComponent config={dataViewConfig} />;
}
```

#### Advanced Features

**Item Click Handler (`onItemClick`)**

You can add a click handler to make rows (or items) interactive. When provided, rows become clickable with hover styling:

```jsx
import DataViewWrapper from "@rhngui/patternfly-react-renderer";

const dataViewConfig = {
  component: "data-view",
  id: "interactive-table",
  fields: [
    {
      name: "Product",
      data_path: "products.name",
      data: ["Laptop", "Mouse", "Keyboard"],
    },
    {
      name: "Price",
      data_path: "products.price",
      data: ["$999", "$25", "$79"],
    },
  ],
};

function App() {
  return (
    <DataViewWrapper
      {...dataViewConfig}
      onItemClick={(event, itemData) => {
        console.log("Item clicked:", itemData);
        // itemData contains all column values as key-value pairs
      }}
    />
  );
}
```

**Column Formatters**

You can customize how cell values are displayed using the **Component Handler Registry** and **built-in formatters**. Formatters are registered in the registry (by field id, name, or data path); types are detected automatically so no formatter is required in your field definitions.

**Registry + built-in formatters (auto by type)**

Wrap your app with `ComponentHandlerRegistryProvider`, call `registerAutoFormatters(registry)` once, and pass fields with `id`, `name`, `data_path`, and `data` only. The resolver detects each value’s type and applies a built-in formatter (ISO date, boolean → Yes/No, number, percent for 0–1, empty → —).

```jsx
import { useMemo } from "react";
import {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
  registerAutoFormatters,
  DataViewWrapper,
} from "@rhngui/patternfly-react-renderer";

function TableWithBuiltIns() {
  const registry = useComponentHandlerRegistry();
  useMemo(() => {
    registerAutoFormatters(registry);
  }, [registry]);

  const fields = [
    {
      id: "col-date",
      name: "Date",
      data_path: "row.date",
      data: ["2025-01-15", "2024-12-31"],
    },
    {
      id: "col-active",
      name: "Active",
      data_path: "row.active",
      data: [true, false, true],
    },
    {
      id: "col-count",
      name: "Count",
      data_path: "row.count",
      data: [1234.5, 42],
    },
  ];

  return (
    <DataViewWrapper
      id="my-table"
      inputDataType="built-in-formatters"
      fields={fields}
    />
  );
}

function App() {
  return (
    <ComponentHandlerRegistryProvider>
      <TableWithBuiltIns />
    </ComponentHandlerRegistryProvider>
  );
}
```

**Customization:** You can opt out of some built-ins or override them:

```jsx
// Exclude percent and currency-usd
registerAutoFormatters(registry, { exclude: ["boolean", "number"] });

// Override boolean to show Y/N
registerAutoFormatters(registry, {
  overrides: { boolean: (v) => (v ? "Y" : "N") },
});

// Combine: exclude one, override another
registerAutoFormatters(registry, {
  exclude: ["number"],
  overrides: { datetime: myDateFormatter },
});
```

Built-in ids: `datetime`, `boolean`, `number`, `currency-usd`, `percent`, `empty`. See the [Registry Demo](https://redhat-ux.github.io/next-gen-ui-react/) for more examples.

**CSS Classes for Customization**

Each field can have an optional `id` property. When provided, CSS classes are automatically generated and added to all data cells (not headers) in that column. This allows you to style specific columns using CSS:

- Format: `field-id-{sanitized-id}`
- Example: If `field.id = "user-name"`, cells get class `field-id-user-name`
- Fallback: If no `id` is provided, the field `name` is used (sanitized)

```jsx
const dataViewConfig = {
  component: "data-view",
  id: "customizable-table",
  fields: [
    {
      id: "user-name", // CSS class: field-id-user-name
      name: "Name",
      data_path: "users.name",
      data: ["Alice", "Bob", "Carol"],
    },
    {
      id: "user-email", // CSS class: field-id-user-email
      name: "Email",
      data_path: "users.email",
      data: ["alice@example.com", "bob@example.com", "carol@example.com"],
    },
  ],
};

// Then in your CSS:
// .field-id-user-name { color: blue; font-weight: bold; }
// .field-id-user-email { font-style: italic; }
```

### VideoPlayer Component

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const videoConfig = {
  component: "video-player",
  video: "https://www.youtube.com/embed/v-PjgYDrg70",
  video_img: "https://img.youtube.com/vi/v-PjgYDrg70/maxresdefault.jpg",
  title: "Toy Story Trailer",
};

function App() {
  return <DynamicComponent config={videoConfig} />;
}
```

### SetOfCards Component

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const setOfCardsConfig = {
  component: "set-of-cards",
  id: "test-id",
  title: "My Favorite Movies",
  fields: [
    {
      data: ["Toy Story", "My Name is Khan"],
      data_path: "movie.title",
      name: "Title",
    },
    {
      data: [1995, 2003],
      data_path: "movie.year",
      name: "Year",
    },
    {
      data: [8.3, 8.5],
      data_path: "movie.imdbRating",
      name: "IMDB Rating",
    },
    {
      data: [
        ["Jim Varney", "Tim Allen", "Tom Hanks", "Don Rickles"],
        ["Shah Rukh Khan", "Kajol Devgan"],
      ],
      data_path: "actors[*]",
      name: "Actors",
    },
  ],
};

function App() {
  return <DynamicComponent config={setOfCardsConfig} />;
}
```

### Chart Components

#### Bar Chart

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const barChartConfig = {
  component: "chart-bar",
  id: "revenue-chart",
  title: "Quarterly Revenue",
  data: [
    {
      name: "Product A",
      data: [
        { x: "Q1", y: 30 },
        { x: "Q2", y: 45 },
        { x: "Q3", y: 60 },
        { x: "Q4", y: 55 },
      ],
    },
    {
      name: "Product B",
      data: [
        { x: "Q1", y: 25 },
        { x: "Q2", y: 35 },
        { x: "Q3", y: 40 },
        { x: "Q4", y: 50 },
      ],
    },
  ],
};

function App() {
  return <DynamicComponent config={barChartConfig} />;
}
```

#### Line Chart

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const lineChartConfig = {
  component: "chart-line",
  id: "traffic-chart",
  title: "Website Traffic",
  data: [
    {
      name: "Desktop",
      data: [
        { x: "Jan", y: 1200 },
        { x: "Feb", y: 1500 },
        { x: "Mar", y: 1800 },
      ],
    },
    {
      name: "Mobile",
      data: [
        { x: "Jan", y: 800 },
        { x: "Feb", y: 1100 },
        { x: "Mar", y: 1400 },
      ],
    },
  ],
};

function App() {
  return <DynamicComponent config={lineChartConfig} />;
}
```

#### Pie Chart

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const pieChartConfig = {
  component: "chart-pie",
  id: "market-share",
  title: "Market Share",
  data: [
    {
      name: "Browsers",
      data: [
        { name: "Chrome", x: "Chrome", y: 65 },
        { name: "Safari", x: "Safari", y: 19 },
        { name: "Firefox", x: "Firefox", y: 9 },
        { name: "Edge", x: "Edge", y: 5 },
        { name: "Other", x: "Other", y: 2 },
      ],
    },
  ],
};

function App() {
  return <DynamicComponent config={pieChartConfig} />;
}
```

#### Donut Chart

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const donutChartConfig = {
  component: "chart-donut",
  id: "storage-usage",
  title: "Storage Usage",
  data: [
    {
      name: "Storage",
      data: [
        { name: "Documents", x: "Documents", y: 45 },
        { name: "Photos", x: "Photos", y: 30 },
        { name: "Videos", x: "Videos", y: 15 },
        { name: "Other", x: "Other", y: 10 },
      ],
    },
  ],
};

function App() {
  return <DynamicComponent config={donutChartConfig} />;
}
```

#### Mirrored Bar Chart

```jsx
import DynamicComponent from "@rhngui/patternfly-react-renderer";

const mirroredBarChartConfig = {
  component: "chart-mirrored-bar",
  id: "movie-comparison",
  title: "Movie ROI vs Budget",
  data: [
    {
      name: "ROI",
      data: [
        { x: "Toy Story", y: 11.45 },
        { x: "The Dark Knight", y: 4.43 },
        { x: "Inception", y: 4.23 },
        { x: "The Matrix", y: 6.36 },
      ],
    },
    {
      name: "Budget",
      data: [
        { x: "Toy Story", y: 30000000 },
        { x: "The Dark Knight", y: 185000000 },
        { x: "Inception", y: 160000000 },
        { x: "The Matrix", y: 63000000 },
      ],
    },
  ],
};

function App() {
  return <DynamicComponent config={mirroredBarChartConfig} />;
}
```

## Development

### Contributing

See the [Contributing Guide](https://github.com/RedHat-UX/next-gen-ui-react/blob/main/CONTRIBUTING.md) for guidelines on adding new components.

### Releases

This project uses automated releases via GitHub Actions. See the [Release Guide](https://github.com/RedHat-UX/next-gen-ui-react/blob/main/RELEASING.md) for the complete release process.

## Links

- [Documentation](https://redhat-ux.github.io/next-gen-ui-agent/guide/renderer/patternfly_npm/)
- [Source Code](https://github.com/RedHat-UX/next-gen-ui-react)
- [Component Demo](https://redhat-ux.github.io/next-gen-ui-react/)
- [Contributing Guide](https://github.com/RedHat-UX/next-gen-ui-react/blob/main/CONTRIBUTING.md)
- [Release Guide](https://github.com/RedHat-UX/next-gen-ui-react/blob/main/RELEASING.md)
