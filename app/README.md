# Next Gen UI — Demo App

This demo app loads the local `next-gen-ui-react` components for development and testing.

## 🌐 Live Demo

The demo app is automatically deployed to GitHub Pages:
**https://redhat-ux.github.io/next-gen-ui-react/**

The deployment happens automatically on every push to the `main` branch.

## Quick Start

1. From the repo root, install dependencies for the demo:

```bash
cd app
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the app at http://localhost:5176

## Architecture

The demo app uses a **component registry pattern** to make it easy to add and manage component demonstrations.

### Key Files

- **`src/config/componentRegistry.ts`** - Central registry of all components
- **`src/demo/demoData.ts`** - Demo data for all components
- **`src/pages/`** - Individual component demo pages
- **`src/layout/Sidebar.tsx`** - Auto-generated navigation
- **`src/App.tsx`** - Routes and layout

### How It Works

The component registry (`componentRegistry.ts`) is the single source of truth for:
- Component names and paths
- GitHub source code links
- Demo examples and data
- Navigation structure

When you add a component to the registry, it automatically appears in:
- ✅ Sidebar navigation
- ✅ Home page links
- ✅ Page titles
- ✅ Source code links

## Adding a New Component Demo

### Step 1: Add Demo Data

In `src/demo/demoData.ts`, add your demo data:

```typescript
export const myNewComponentDemo = {
  component: "my-component" as const,
  id: "demo-1",
  title: "Example Title",
  // ... your component props
};

// Add variations if you want multiple examples
export const myNewComponentDemoVariation = {
  component: "my-component" as const,
  id: "demo-2",
  title: "Variation Example",
  // ... variant props
};
```

### Step 2: Register in Component Registry

In `src/config/componentRegistry.ts`, add an entry to the `componentRegistry` array:

```typescript
{
  id: "mynewcomponent",           // Unique ID
  name: "MyNewComponent",         // Display name
  path: "/mynewcomponent",        // Route path
  sourceUrl: "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/MyNewComponent.tsx",
  componentImportPath: "@local-lib/components/MyNewComponent",
  examples: [
    { title: "Basic Example", data: myNewComponentDemo },
    { title: "Variation", data: myNewComponentDemoVariation },
  ],
}
```

### Step 3: Create Component Page

Create `src/pages/MyNewComponent.tsx`:

```typescript
import MyNewComponent from "@local-lib/components/MyNewComponent";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
} from "@patternfly/react-core";

import { myNewComponentDemo, myNewComponentDemoVariation } from "../demo/demoData";

export default function MyNewComponentPage() {
  return (
    <div>
      {/* First Example */}
      <Content component={ContentVariants.h3}>Basic Example</Content>
      <MyNewComponent {...myNewComponentDemo} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          {JSON.stringify(myNewComponentDemo, null, 2)}
        </CodeBlockCode>
      </CodeBlock>

      {/* Divider between examples */}
      <Divider style={{ marginTop: 32, marginBottom: 32 }} />

      {/* Second Example */}
      <Content component={ContentVariants.h3}>Variation</Content>
      <MyNewComponent {...myNewComponentDemoVariation} />
      <Content component={ContentVariants.h4} style={{ marginTop: 16 }}>
        Props
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          {JSON.stringify(myNewComponentDemoVariation, null, 2)}
        </CodeBlockCode>
      </CodeBlock>
    </div>
  );
}
```

### Step 4: Add Route

In `src/App.tsx`, import and add the route:

```typescript
// Add import
import MyNewComponentPage from "./pages/MyNewComponent";

// Add route in the Routes section
<Route path="/mynewcomponent" element={<MyNewComponentPage />} />
```

**That's it!** The component will automatically appear in:
- Sidebar navigation
- Home page links
- Page title header
- Source code link

## Project Structure

```
app/
├── src/
│   ├── config/
│   │   └── componentRegistry.ts    ← Register components here
│   ├── demo/
│   │   └── demoData.ts             ← Add demo data here
│   ├── layout/
│   │   └── Sidebar.tsx             ← Auto-generated from registry
│   ├── pages/
│   │   ├── Home.tsx                ← Auto-generated links
│   │   ├── DynamicComponents.tsx   ← Example page
│   │   └── ...                     ← Add new pages here
│   ├── App.tsx                     ← Add routes here
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md                       ← You are here
```

## Available Scripts

```bash
npm run dev            # Start development server
npm run build          # Build for production (GitHub Pages)
npm run build:netlify  # Build for Netlify/Vercel (root path)
npm run preview        # Preview production build
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format with Prettier
npm run format:check   # Check formatting
```

## Deployment

The demo app can be deployed to multiple platforms.

### GitHub Pages (Automatic)

The demo app is automatically deployed to GitHub Pages via GitHub Actions.

**Deployment happens automatically when:**
- Code is pushed to the `main` branch
- The workflow can also be triggered manually from the Actions tab

**Manual Deployment:**
1. Go to the repository's **Actions** tab on GitHub
2. Select the **Deploy Demo App to GitHub Pages** workflow
3. Click **Run workflow**

**How It Works:**

The deployment workflow (`.github/workflows/deploy-demo.yml`):
1. Builds the library (`npm run build` in root)
2. Installs app dependencies
3. Builds the demo app with production settings
4. Deploys the `app/dist` folder to GitHub Pages

**GitHub Pages Settings:**

To enable GitHub Pages for the first time:
1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The app will be available at `https://redhat-ux.github.io/next-gen-ui-react/`

### Netlify/Vercel (Manual)

For one-time or manual deployments to Netlify, Vercel, or similar platforms:

**Build for Netlify/Vercel:**
```bash
cd app
npm run build:netlify
```

**Deploy the `dist` folder:**
- **Netlify Drop:** Drag `app/dist` to https://app.netlify.com/drop
- **Vercel CLI:** Run `npx vercel dist --prod` from the `app` directory

**Note:** Use `build:netlify` instead of `build` when deploying to platforms that serve from the root path (not a subdirectory).

## Linting and Formatting

This project uses:
- **ESLint** for code quality and catching bugs
- **Prettier** for code formatting
- Import ordering rules for consistent imports

All code is automatically checked and formatted. The linter enforces:
- TypeScript best practices
- React hooks rules
- Import ordering (external → internal → relative)
- No unused variables

## Development Notes

- The demo imports components directly from the parent package source using a Vite alias `@local-lib`
- Changes to library code in `../src/components` will hot-reload automatically
- If you run into duplicate React instances or hooks errors, set `resolve.preserveSymlinks = true` in your Vite config
- The app runs on port 5176 by default (configured in `vite.config.ts`)

## Component Demo Best Practices

1. **Multiple Examples** - Show different variations and use cases
2. **Descriptive Titles** - Use clear, specific titles for each example
3. **Props Display** - Always show the props JSON for reference
4. **Visual Separation** - Use `Divider` between multiple examples
5. **Realistic Data** - Use meaningful, realistic demo data
6. **Type Safety** - Use `as const` for literal types

## Tips

- Keep demo data in `demoData.ts` separate from page components
- Use the registry pattern - don't hardcode navigation or links
- Follow the established page component pattern for consistency
- Test your component in different scenarios (with/without optional props)
- Add comments to complex demo data explaining what it demonstrates

## Need Help?

- Check existing component pages for patterns to follow
- Look at `src/config/componentRegistry.ts` to see how other components are registered
- Run `npm run lint` before committing to catch issues early
