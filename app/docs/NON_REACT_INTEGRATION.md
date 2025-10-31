# Non-React Integration Guide

This document explains how to use RHNGUI PatternFly React components in non-React applications.

## 🎯 What Was Implemented

We've created two complete integration approaches that allow you to use these React components in any HTML/JavaScript application:

### ✅ Option 4A: Standalone Bundle (JavaScript API)

- Simple JavaScript API for mounting React components
- File: `src/standalone.tsx`
- Build config: `configs/vite.config.standalone.ts`
- Output: `app/dist/standalone/`
- Example: `app/public/examples/standalone-example.html`

### ✅ Option 4B: Web Components (Custom HTML Elements)

- React components wrapped as native Custom Elements
- Files: `src/web-components/index.tsx`
- Build config: `configs/vite.config.webcomponents.ts`
- Output: `app/dist/webcomponents/`
- Example: `app/public/examples/webcomponents-example.html`

## 🚀 Quick Start

### 1. Build the Bundles

```bash
# From the root directory:
npm run build:app

# OR from the app directory:
cd app
npm run build:standalone     # Build standalone bundle only
npm run build:webcomponents  # Build web components bundle only
npm run build:all           # Build everything (demo app + bundles)
```

### 2. Try the Examples

```bash
# From the root directory, start the demo app
# (This automatically builds the bundles first, then starts the dev server)
npm run dev

# Then navigate to:
# http://localhost:5176/examples/standalone
# http://localhost:5176/examples/webcomponents
```

**Note:** The `dev` command automatically builds the standalone and web component bundles before starting the server, so the example pages work immediately.

The examples are integrated into the demo app and load in iframes. You can also access the raw HTML files at:

- `http://localhost:5176/examples/standalone-example.html`
- `http://localhost:5176/examples/webcomponents-example.html`

## 📦 What Gets Built

### Standalone Bundle

- Output directory: `app/dist/standalone/`
- Files:
  - `rhngui-standalone.iife.js` - Main bundle (IIFE format, minified with Terser)
  - `rhngui-standalone.css` - Component styles (minimal, PatternFly loaded separately)
- Size: ~540KB JS (React is external, PatternFly CSS loaded from CDN)
- Requires: React & ReactDOM as peer dependencies

### Web Components Bundle

- Output directory: `app/dist/webcomponents/`
- Files:
  - `rhngui-webcomponents.js` - Main bundle (ES module)
  - `rhngui-webcomponents.css` - Styles
- Size: ~larger (React bundled)
- Requires: Nothing (self-contained)

## 💡 Usage Examples

### Standalone API Example

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- React dependencies -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

    <!-- RHNGUI standalone bundle -->
    <link rel="stylesheet" href="dist-standalone/rhngui-standalone.css" />
    <script src="dist-standalone/rhngui-standalone.iife.js"></script>
  </head>
  <body>
    <div id="my-chart"></div>

    <script>
      const renderer = window.RHNGUIRenderer;

      const chart = renderer.render("my-chart", {
        component: "chart",
        key: "chart-1",
        props: {
          id: "sales",
          title: "Sales Data",
          chartType: "bar",
          data: [
            {
              name: "Q1",
              data: [{ x: "Jan", y: 1000 }],
            },
          ],
          width: 600,
          height: 400,
        },
      });

      // Update later
      chart.update({
        /* new config */
      });

      // Clean up
      chart.unmount();
    </script>
  </body>
</html>
```

### Web Components Example

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- RHNGUI web components bundle -->
    <link rel="stylesheet" href="dist-webcomponents/rhngui-webcomponents.css" />
    <script
      type="module"
      src="dist-webcomponents/rhngui-webcomponents.js"
    ></script>
  </head>
  <body>
    <!-- Use as regular HTML tags -->
    <rhngui-chart
      id="sales"
      title="Sales Data"
      chart-type="bar"
      width="600"
      height="400"
      data='[{"name":"Q1","data":[{"x":"Jan","y":1000}]}]'
    ></rhngui-chart>

    <!-- Update with JavaScript -->
    <script>
      const chart = document.querySelector("rhngui-chart");
      chart.setAttribute("chart-type", "line");
    </script>
  </body>
</html>
```

## 🎨 Available Components

All components work with both approaches:

### Chart Component (`chart`)

- Bar, Line, Pie, Donut charts
- Large number formatting (K, M, B)
- Dynamic scaling
- Customizable themes and legends

### Table Component (`table`)

- Dynamic columns
- Multiple data types support
- PatternFly styling

### Image Component (`image`)

- Simple image display
- Optional titles

### Card Component (`one-card`)

- Information cards
- Optional images
- Field-based layout

### Set of Cards (`set-of-cards`)

- Multiple cards display
- Grid layout

### Video Player (`video-player`)

- YouTube and direct video support
- Multiple aspect ratios
- Custom posters

## 📊 Comparison

| Feature                | Standalone Bundle  | Web Components          |
| ---------------------- | ------------------ | ----------------------- |
| **Usage**              | JavaScript API     | HTML tags               |
| **Data Passing**       | JavaScript objects | JSON strings            |
| **React Required**     | Yes (external)     | No (bundled)            |
| **Bundle Size**        | Smaller            | Larger                  |
| **Updates**            | `update()` method  | `setAttribute()`        |
| **Browser Support**    | Excellent          | Good (polyfill for old) |
| **Style Isolation**    | No                 | Yes (Shadow DOM)        |
| **Framework Agnostic** | Yes                | Yes                     |

## 🔧 Build Configuration

### Standalone Build

File: `configs/vite.config.standalone.ts`

```typescript
{
  lib: {
    entry: 'src/standalone.tsx',
    name: 'RHNGUIRenderer',
    formats: ['umd', 'iife']
  },
  rollupOptions: {
    external: ['react', 'react-dom'],
    output: {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    }
  }
}
```

### Web Components Build

File: `configs/vite.config.webcomponents.ts`

```typescript
{
  lib: {
    entry: 'src/web-components/index.ts',
    name: 'RHNGUIWebComponents',
    formats: ['es']
  }
}
```

## 📚 API Reference

### Standalone API

#### `RHNGUIRenderer.render(containerId, config)`

Renders a component into a container.

**Parameters:**

- `containerId` (string): DOM element ID
- `config` (object): Component configuration
  - `component` (string): Component type
  - `key` (string): Unique key
  - `props` (object): Component props

**Returns:** `{ update, unmount }`

#### `RHNGUIRenderer.renderMultiple(containerId, configs)`

Renders multiple components.

#### `RHNGUIRenderer.unmount(containerId)`

Unmounts a component.

#### `RHNGUIRenderer.unmountAll()`

Unmounts all components.

### Web Components API

#### Custom Elements

- `<rhngui-chart>`
- `<rhngui-table>`
- `<rhngui-image>`
- `<rhngui-card>`

All elements support standard DOM APIs:

- `getAttribute(name)`
- `setAttribute(name, value)`
- `remove()`
- Event listeners

## 🎯 Use Cases

### When to Use Standalone Bundle

- You have control over the build process
- You want minimal bundle size
- You're comfortable with JavaScript APIs
- You need dynamic component updates
- You're using a JavaScript framework (Vue, Angular, Svelte, etc.)

### When to Use Web Components

- You want true framework independence
- You need style encapsulation
- You prefer HTML-first approach
- You want to use components in static HTML
- You need components in a CMS or no-build environment

## 🐛 Troubleshooting

### Components not rendering

**Standalone:**

- Check that React is loaded before the bundle
- Verify container element exists
- Check browser console for errors

**Web Components:**

- Ensure script is loaded as ES module (`type="module"`)
- Check that CSS is loaded
- Verify JSON in attributes is valid

### Styles not applying

- Load CSS file before JavaScript
- Check for CSS conflicts
- Clear browser cache

### Updates not working

- **Standalone**: Use `.update()` method
- **Web Components**: Use `.setAttribute()`

## 📝 Examples Directory

See `examples/` for complete working examples:

1. **standalone-example.html** - Complete standalone bundle demo
2. **webcomponents-example.html** - Complete web components demo
3. **README.md** - Detailed examples documentation

## 🚢 Deployment

### Standalone Bundle

1. Build: `npm run build:standalone`
2. Deploy files from `dist-standalone/`:
   - `rhngui-standalone.iife.js`
   - `rhngui-standalone.css`
3. Include React CDN or bundle
4. Use the API in your HTML

### Web Components

1. Build: `npm run build:webcomponents`
2. Deploy files from `dist-webcomponents/`:
   - `rhngui-webcomponents.js`
   - `rhngui-webcomponents.css`
3. Include in HTML with `<script type="module">`
4. Use custom elements directly

## 📖 Further Reading

- Full API documentation in `examples/README.md`
- Component examples in HTML files
- Main library docs in root `README.md`

## 🤝 Contributing

To add support for new components:

### For Standalone Bundle

Update `src/standalone.tsx` - no changes needed (uses DynamicComponent)

### For Web Components

Add new class in `src/web-components/index.tsx`:

```typescript
class RHNGUINewComponent extends RHNGUIElement {
  static get observedAttributes() {
    return ["prop1", "prop2"];
  }

  protected getComponentConfig(): ComponentConfig {
    return {
      component: "new-component",
      key: "web-component-new",
      props: {
        prop1: this.getAttribute("prop1"),
        prop2: this.parseJsonAttribute("prop2"),
      },
    };
  }
}

customElements.define("rhngui-new-component", RHNGUINewComponent);
```

## ✨ Summary

You now have two powerful ways to integrate React components into non-React applications:

1. **Standalone Bundle**: For developers who want full JavaScript control
2. **Web Components**: For HTML-first, framework-agnostic usage

Both approaches are production-ready and fully functional!
