# Experimental Non-React Integrations

This directory contains **experimental** approaches for using RHNGUI components in non-React frontends (vanilla JS, jQuery, PHP, Django, Ruby on Rails, etc.).

## 📁 Directory Structure

```
experimental/
├── standalone/         # Imperative JavaScript API
│   └── index.tsx      # RHNGUIRenderer class with render() methods
└── web-components/    # Declarative HTML API
    └── index.tsx      # Custom HTML elements (Web Components)
```

---

## 🎯 Which Approach Should I Use?

### Use **Standalone** if you want:

- ✅ **Programmatic control** via JavaScript
- ✅ Dynamic mounting/unmounting
- ✅ Multiple components in a single container
- ✅ Works in any JavaScript environment

**Example:**

```javascript
window.RHNGUIRenderer.render('my-container', {
  component: 'chart',
  props: { data: [...], chartType: 'bar' }
});
```

### Use **Web Components** if you want:

- ✅ **Declarative HTML syntax**
- ✅ Works without writing JavaScript
- ✅ CMS/static site friendly
- ✅ Familiar HTML element API

**Example:**

```html
<rhngui-chart chart-type="bar" data='[{"name":"Series 1","data":[...]}]'>
</rhngui-chart>
```

---

## 🚀 Getting Started

### Option 1: Standalone (Imperative API)

**Build:**

```bash
npm run build:standalone
```

**Usage:**

```html
<!-- Load React dependencies -->
<script
  crossorigin
  src="https://unpkg.com/react@18/umd/react.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
></script>

<!-- Load RHNGUI Standalone bundle -->
<link rel="stylesheet" href="/standalone/rhngui-standalone.css" />
<script src="/standalone/rhngui-standalone.iife.js"></script>

<!-- Your container -->
<div id="chart-container"></div>

<script>
  // Render a chart
  window.RHNGUIRenderer.render("chart-container", {
    component: "chart",
    key: "my-chart",
    props: {
      chartType: "bar",
      data: [
        {
          name: "Revenue",
          data: [
            { x: "Jan", y: 100 },
            { x: "Feb", y: 150 },
            { x: "Mar", y: 200 },
          ],
        },
      ],
      width: 600,
      height: 400,
    },
  });
</script>
```

**API:**

```typescript
// Single component
window.RHNGUIRenderer.render(containerId, componentConfig);

// Multiple components
window.RHNGUIRenderer.renderMultiple(containerId, [config1, config2]);

// Unmount
window.RHNGUIRenderer.unmount(containerId);
window.RHNGUIRenderer.unmountAll();
```

---

### Option 2: Web Components (Declarative API)

**Build:**

```bash
npm run build:webcomponents
```

**Usage:**

```html
<!-- Load React and ReactDOM (required) -->
<script
  crossorigin
  src="https://unpkg.com/react@18/umd/react.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
></script>

<!-- Load PatternFly CSS -->
<link
  rel="stylesheet"
  href="https://unpkg.com/@patternfly/patternfly/patternfly.min.css"
/>

<!-- Load RHNGUI Web Components -->
<link rel="stylesheet" href="/webcomponents/rhngui-webcomponents.css" />
<script type="module" src="/webcomponents/rhngui-webcomponents.js"></script>

<!-- Use the components -->
<rhngui-chart
  chart-type="bar"
  width="600"
  height="400"
  theme-color="multi"
  data='[
    {
      "name": "Revenue",
      "data": [
        {"x": "Jan", "y": 100},
        {"x": "Feb", "y": 150},
        {"x": "Mar", "y": 200}
      ]
    }
  ]'
>
</rhngui-chart>

<rhngui-table
  title="Users"
  fields='[
    {"label": "Name", "value": "John Doe"},
    {"label": "Email", "value": "john@example.com"}
  ]'
>
</rhngui-table>

<rhngui-card
  title="Profile"
  image="/avatar.jpg"
  fields='[
    {"label": "Name", "value": "Jane Smith"},
    {"label": "Role", "value": "Developer"}
  ]'
>
</rhngui-card>
```

---

## 📚 Available Components

### Standalone Components

- `chart` - Bar, line, pie, donut, mirrored-bar charts
- `table` - Data tables with fields
- `image` - Image display
- `one-card` - Card with image and fields
- `set-of-cards` - Multiple cards in a grid
- `video` - Video player

### Web Components

- `<rhngui-chart>` - Charts
- `<rhngui-table>` - Tables
- `<rhngui-image>` - Images
- `<rhngui-card>` - Cards

---

## ⚠️ Important Notes

1. **React is still required** - Both approaches internally use React, so React/ReactDOM must be loaded
2. **Experimental status** - These APIs may change in future versions
3. **Bundle size** - These bundles include PatternFly Charts and are larger (~500KB+)
4. **Browser support** - Web Components require modern browsers with Custom Elements support

---

## 📖 Full Documentation

See the demo app examples:

- **Standalone**: http://localhost:5173/standalone
- **Web Components**: http://localhost:5173/webcomponents

Or view the HTML examples:

- `app/public/examples/standalone-example.html`
- `app/public/examples/webcomponents-example.html`

---

## 🏗️ Development

**Build commands:**

```bash
# Build standalone bundle
npm run build:standalone

# Build web components bundle
npm run build:webcomponents

# Build both
npm run build:all
```

**Test locally:**

```bash
# Start demo app
cd app && npm run dev

# Or serve examples directly
npm run serve:examples
```
