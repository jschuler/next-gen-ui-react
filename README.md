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
- [Hand Build Components (HBC)](https://redhat-ux.github.io/next-gen-ui-agent/spec/component/#hand-build-component-aka-hbc) support:
  - Register custom React components via `register()` function
  - Support for single or batch component registration
  - Full integration with `DynamicComponent` system
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

One-card supports the same [Component Handler Registry](ADVANCED.md#column-formatters-and-registry) formatters as data-view for formatting field values (e.g. dates, numbers, booleans). Pass `input_data_type` in config when using the registry.

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

**Advanced:** Data View supports item click handlers (`onItemClick`), column formatters via the Component Handler Registry (including auto formatters and `autoFormatterOptions`), and CSS classes per column. The same formatters and registry also apply to **one-card** and **set-of-cards** for field value display. See [Advanced usage](ADVANCED.md) for details.

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

Set-of-cards supports the same [Component Handler Registry](ADVANCED.md#column-formatters-and-registry) formatters as data-view and one-card for formatting field values. Pass `input_data_type` in config when using the registry.

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

### Hand Build Components (HBC)

Register custom React components to render through `DynamicComponent`. Follows the [HBC specification](https://redhat-ux.github.io/next-gen-ui-agent/spec/component/#hand-build-component-aka-hbc).

#### Component API

When you register an HBC component, it will receive the following props:

- **`data`** (required): The JSON backend data to be rendered. The structure depends on your backend implementation.
- **`id`** (required): The ID of the backend data this component is for.
- **`input_data_type`** (optional): The type of the input data. Can be used for frontend customization of the component for concrete data type, e.g. by using it in CSS class names or conditional rendering.
- **`component`**: The component type string (typically not needed in your component implementation).

Your component should return a valid React element (JSX). The component can be a functional component or a class component.

**Example component implementation:**

```tsx
import DynamicComponent, {
  register,
  type HBCConfig,
} from "@rhngui/patternfly-react-renderer";

interface MovieDetailProps {
  data: {
    title: string;
    year: string;
    poster?: string;
  };
  id: string;
  input_data_type?: string | null;
}

const MovieDetail = ({ data, id, input_data_type }: MovieDetailProps) => {
  const dataTypeClass = input_data_type ? `movie-${input_data_type}` : "";

  return (
    <div className={dataTypeClass} data-id={id}>
      <h1>{data.title}</h1>
      <p>Year: {data.year}</p>
      {data.poster && <img src={data.poster} alt={data.title} />}
    </div>
  );
};

// Register the component
register("movies:movie-detail", MovieDetail);

// Use HBCConfig type for type-safe configuration
const config: HBCConfig = {
  component: "movies:movie-detail",
  id: "movie-123",
  input_data_type: "action",
  data: {
    title: "Avatar",
    year: "2009",
    poster: "https://example.com/avatar.jpg",
  },
};

<DynamicComponent config={config} />;
```

#### Using PatternFly Components

Yes, you can use existing PatternFly components in your HBC implementations! Create a wrapper component that transforms the HBC data into the props expected by PatternFly components.

**Example using PatternFly Card:**

```tsx
import { Card, CardBody, CardHeader, CardTitle } from "@patternfly/react-core";
import DynamicComponent, {
  register,
  type HBCConfig,
} from "@rhngui/patternfly-react-renderer";

interface MovieCardProps {
  data: {
    title: string;
    year: string;
    description?: string;
  };
  id: string;
  input_data_type?: string | null;
}

const MovieCard = ({ data, id, input_data_type }: MovieCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardBody>
        <p>Year: {data.year}</p>
        {data.description && <p>{data.description}</p>}
        {input_data_type && <span className="badge">{input_data_type}</span>}
      </CardBody>
    </Card>
  );
};

// Register the component
register("movies:movie-card", MovieCard);

// Use HBCConfig type for type-safe configuration
const config: HBCConfig = {
  component: "movies:movie-card",
  id: "movie-card-123",
  input_data_type: "drama",
  data: {
    title: "The Shawshank Redemption",
    year: "1994",
    description: "Two imprisoned men bond over a number of years...",
  },
};

<DynamicComponent config={config} />;
```

#### Loading Additional Resources

HBC components can load additional resources (JS files, images, CSS files) just like any React component. You can:

- **Import CSS files**: Use standard CSS imports in your component file
- **Import images**: Use standard image imports or public URLs
- **Load external scripts**: Use `useEffect` hooks to dynamically load scripts
- **Use CSS-in-JS**: Use any styling solution (styled-components, emotion, etc.)

**Example with external resources:**

```tsx
import { useEffect } from "react";
import DynamicComponent, {
  register,
  type HBCConfig,
} from "@rhngui/patternfly-react-renderer";
import "./MovieDetail.css"; // Import CSS file
import defaultPoster from "./default-poster.png"; // Import image

interface MovieDetailProps {
  data: {
    title: string;
    poster?: string;
  };
  id: string;
  input_data_type?: string | null;
}

const MovieDetail = ({ data, id, input_data_type }: MovieDetailProps) => {
  useEffect(() => {
    // Load external script if needed
    const script = document.createElement("script");
    script.src = "https://example.com/movie-widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={`movie-detail ${input_data_type || ""}`}>
      <img src={data.poster || defaultPoster} alt={data.title} />
      <h1>{data.title}</h1>
    </div>
  );
};

// Register the component
register("movies:movie-detail", MovieDetail);

// Use HBCConfig type for type-safe configuration
const config: HBCConfig = {
  component: "movies:movie-detail",
  id: "movie-123",
  input_data_type: "action",
  data: {
    title: "Avatar",
    poster: "https://example.com/avatar.jpg",
  },
};

<DynamicComponent config={config} />;
```

#### Registering Components

**Register a single component:**

```tsx
import DynamicComponent, {
  register,
  type HBCConfig,
} from "@rhngui/patternfly-react-renderer";

// Define your component
const MovieDetail = ({
  data,
  id,
  input_data_type,
}: {
  data: { title: string; year: string };
  id: string;
  input_data_type?: string | null;
}) => (
  <div>
    <h1>{data.title}</h1>
    <p>Year: {data.year}</p>
  </div>
);

// Register the component
register("movies:movie-detail", MovieDetail);

// Use HBCConfig type for type-safe configuration
const config: HBCConfig = {
  component: "movies:movie-detail",
  id: "movie-123",
  input_data_type: "action", // Optional: used for customization
  data: {
    title: "Avatar",
    year: "2009",
  },
};

<DynamicComponent config={config} />;
```

**Register multiple components:**

```tsx
import DynamicComponent, {
  register,
  type HBCConfig,
} from "@rhngui/patternfly-react-renderer";

// Define your components
const MovieDetail = ({ data, id }: { data: { title: string }; id: string }) => (
  <div>
    <h1>{data.title}</h1>
  </div>
);

const MovieList = ({
  data,
  id,
}: {
  data: { movies: string[] };
  id: string;
}) => (
  <ul>
    {data.movies.map((m) => (
      <li key={m}>{m}</li>
    ))}
  </ul>
);

const MovieCard = ({ data, id }: { data: { title: string }; id: string }) => (
  <div className="card">{data.title}</div>
);

// Register multiple components at once
register({
  "movies:movie-detail": MovieDetail,
  "movies:movie-list": MovieList,
  "movies:movie-card": MovieCard,
});

// Use HBCConfig type for type-safe configuration
const detailConfig: HBCConfig = {
  component: "movies:movie-detail",
  id: "movie-1",
  data: { title: "Avatar" },
};

const listConfig: HBCConfig = {
  component: "movies:movie-list",
  id: "movie-list-1",
  data: { movies: ["Avatar", "Inception"] },
};

function App() {
  return (
    <>
      <DynamicComponent config={detailConfig} />
      <DynamicComponent config={listConfig} />
    </>
  );
}
```

#### TypeScript Support

For TypeScript users, import the `HBCConfig` type to ensure your config objects match the expected shape:

```tsx
import DynamicComponent, {
  register,
  type HBCConfig,
} from "@rhngui/patternfly-react-renderer";

// Define your component with proper types
interface MovieData {
  title: string;
  year: string;
  poster?: string;
}

const MovieDetail = ({
  data,
  id,
  input_data_type,
}: {
  data: MovieData;
  id: string;
  input_data_type?: string | null;
}) => {
  return (
    <div className={input_data_type ? `movie-${input_data_type}` : ""}>
      <h1>{data.title}</h1>
      <p>Year: {data.year}</p>
    </div>
  );
};

// Register the component
register("movies:movie-detail", MovieDetail);

// Create config using HBCConfig type for type safety
const config: HBCConfig = {
  component: "movies:movie-detail",
  id: "movie-123",
  data: {
    title: "Avatar",
    year: "2009",
    poster: "https://example.com/avatar.jpg",
  },
  input_data_type: "action", // Optional: used for customization
};

// Use with DynamicComponent
function App() {
  return <DynamicComponent config={config} />;
}
```

**Benefits of using HBCConfig:**

- Type safety: Ensures your config matches the expected HBC specification
- IntelliSense: Get autocomplete for all config fields
- Documentation: Type definition includes JSDoc comments explaining each field
- Validation: Catch configuration errors at compile time

## Development

### Contributing

See the [Contributing Guide](https://github.com/RedHat-UX/next-gen-ui-react/blob/main/CONTRIBUTING.md) for guidelines on adding new components.

### Releases

This project uses automated releases via GitHub Actions. See the [Release Guide](https://github.com/RedHat-UX/next-gen-ui-react/blob/main/RELEASING.md) for the complete release process.

## Links

- [Documentation](https://redhat-ux.github.io/next-gen-ui-agent/guide/renderer/patternfly_npm/)
- [Source Code](https://github.com/RedHat-UX/next-gen-ui-react)
- [Component Demo](https://redhat-ux.github.io/next-gen-ui-react/)
- [Advanced usage](ADVANCED.md) — Data View item click; formatters and registry (data-view, one-card, set-of-cards); CSS
- [Contributing Guide](CONTRIBUTING.md)
- [Release Guide](RELEASING.md)
