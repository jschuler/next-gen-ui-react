# Next Gen UI Patternfly React Renderer

This module is part of the [Next Gen UI Agent project](https://github.com/RedHat-UX/next-gen-ui-agent)

[![Module Category](https://img.shields.io/badge/Module_Category-UI_Renderer-green)](https://github.com/RedHat-UX/next-gen-ui-agent)
[![Module Status](https://img.shields.io/badge/Module_Status-Tech_Preview-orange)](https://github.com/RedHat-UX/next-gen-ui-agent)

This npm package provides a collection of reusable Patternfly React components to support dynamic UI rendering for Next Gen UI Agent.

## Provides:

- Patternfly React Components
  - OneCardWrapper
  - ImageComponent
  - TableWrapper
  - VideoPlayerWrapper
* Dynamic Component Renderer
  - DynamicComponents
* Supported Components
  - `one-card`, `image`, `table`, `video-player`
  - `video-player` supports YouTube video URLs and direct video file URLs

## Installation

**Pre-requisites:**

- React 18+
- TypeScript

```bash
npm install @rhngui/patternfly-react-renderer
```

## Usage Examples

### OneCard Component

```jsx
import { OneCardWrapper } from "@rhngui/patternfly-react-renderer";

const mockData = {
  title: "Movie Details",
  image:
    "https://image.tmdb.org/t/p/w440_and_h660_face/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
  fields: [
    {
      name: "Title",
      data_path: "movie.title",
      data: ["Toy Story"],
    },
    {
      name: "Year",
      data_path: "movie.year",
      data: [1995],
    },
    {
      name: "Genres",
      data_path: "movie.genres",
      data: ["Animation", "Adventure"],
    },
  ],
  imageSize: "md",
  id: "movie-card",
};

function App() {
  return <OneCardWrapper {...mockData} />;
}
```

### Image Component

```jsx
import { DynamicComponent } from "@rhngui/patternfly-react-renderer";

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

### Table Component

```jsx
import { DynamicComponent } from "@rhngui/patternfly-react-renderer";

const tableConfig = {
  component: "table",
  title: "Movie Statistics",
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
};

function App() {
  return <DynamicComponent config={tableConfig} />;
}
```

### VideoPlayer Component

```jsx
import { VideoPlayerWrapper } from '@rhngui/patternfly-react-renderer';

const videoData = {
  component: "video-player",
  video: "https://www.youtube.com/embed/v-PjgYDrg70",
  video_img: "https://img.youtube.com/vi/v-PjgYDrg70/maxresdefault.jpg",
  title: "Toy Story Trailer"
};

function App() {
  return <VideoPlayerWrapper {...videoData} />;
}
```

## Links

- [Documentation](https://redhat-ux.github.io/next-gen-ui-agent/guide/renderer/patternfly_npm/)
- [Source Code](https://github.com/RedHat-UX/next-gen-ui-agent/tree/main/libs_js/next_gen_ui_react)
- [Contributing](https://redhat-ux.github.io/next-gen-ui-agent/development/contributing/)
