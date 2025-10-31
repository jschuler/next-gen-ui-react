// Documentation content for standalone bundle example

export const standaloneDocsHTML = `
  <div class="docs-section basic-usage-section">
    <h2>📚 Basic Usage</h2>
    <pre><code>&lt;!-- 1. Include React dependencies --&gt;
&lt;script src="https://unpkg.com/react@18/umd/react.production.min.js"&gt;&lt;/script&gt;
&lt;script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"&gt;&lt;/script&gt;

&lt;!-- 2. Include PatternFly styles --&gt;
&lt;link rel="stylesheet" href="https://unpkg.com/@patternfly/patternfly@6/patternfly.min.css"&gt;

&lt;!-- 3. Include RHNGUI component styles --&gt;
&lt;link rel="stylesheet" href="dist/standalone/rhngui-standalone.css"&gt;

&lt;!-- 4. Include RHNGUI standalone bundle --&gt;
&lt;script src="dist/standalone/rhngui-standalone.iife.js"&gt;&lt;/script&gt;

&lt;!-- 5. Use the API --&gt;
&lt;div id="my-chart"&gt;&lt;/div&gt;
&lt;script&gt;
  const renderer = window.RHNGUIRenderer;
  
  const chart = renderer.render('my-chart', {
    component: 'chart',
    key: 'chart-1',
    props: {
      id: 'sales',
      title: 'Sales Data',
      chartType: 'bar',
      data: [{ name: 'Q1', data: [{ x: 'Jan', y: 1000 }] }],
      width: 600,
      height: 400
    }
  });
  
  // Update later: chart.update({ /* new config */ });
  // Clean up: chart.unmount();
&lt;/script&gt;</code></pre>
    <p class="basic-usage-benefits">
      <strong>💡 Key Benefits:</strong> JavaScript API with full control, smaller bundle size, React as peer dependency!
    </p>
  </div>

  <div class="container">
    <h2>📖 API Reference</h2>
    
    <!-- render method -->
    <div class="api-method">
      <h3>RHNGUIRenderer.render(containerId, config)</h3>
      <p class="api-method-description">Renders a single component into a container.</p>
      
      <div class="api-method-section">
        <strong>Parameters:</strong>
        <ul>
          <li><code>containerId</code> <em>(string)</em> - DOM element ID where component will be mounted</li>
          <li><code>config</code> <em>(object)</em> - Component configuration:
            <ul>
              <li><code>component</code> - Component type</li>
              <li><code>key</code> - Unique identifier</li>
              <li><code>props</code> - Component-specific properties</li>
            </ul>
          </li>
        </ul>
      </div>
      
      <div class="api-method-section">
        <strong>Returns:</strong> <code>{ update(config), unmount() }</code>
      </div>
      
      <div class="api-method-section api-method-example">
        <strong>Example:</strong>
        <pre><code>const instance = renderer.render('my-container', {
  component: 'chart',
  key: 'chart-1',
  props: {
    id: 'sales',
    title: 'Sales Data',
    chartType: 'bar',
    data: [{ name: 'Q1', data: [...] }]
  }
});

// Update the component
instance.update({ props: { title: 'Updated Title' } });

// Remove the component
instance.unmount();</code></pre>
      </div>
    </div>

    <!-- renderMultiple method -->
    <div class="api-method">
      <h3>RHNGUIRenderer.renderMultiple(containerId, configs[])</h3>
      <p class="api-method-description">Renders multiple components into a single container.</p>
      
      <div class="api-method-section">
        <strong>Parameters:</strong>
        <ul>
          <li><code>containerId</code> <em>(string)</em> - DOM element ID</li>
          <li><code>configs</code> <em>(array)</em> - Array of configuration objects</li>
        </ul>
      </div>
      
      <div class="api-method-section">
        <strong>Returns:</strong> <code>{ unmountAll() }</code>
      </div>
    </div>

    <!-- unmount method -->
    <div class="api-method">
      <h3>RHNGUIRenderer.unmount(containerId)</h3>
      <p class="api-method-description">Unmounts a specific component by container ID.</p>
      
      <div class="api-method-section">
        <strong>Parameters:</strong>
        <ul>
          <li><code>containerId</code> <em>(string)</em> - DOM element ID to unmount</li>
        </ul>
      </div>
    </div>

    <!-- unmountAll method -->
    <div class="api-method">
      <h3>RHNGUIRenderer.unmountAll()</h3>
      <p class="api-method-description">Unmounts all components managed by the renderer.</p>
    </div>

    <!-- Available components -->
    <div class="available-components">
      <h3>Available Components</h3>
      <div class="components-grid">
        <div><code>chart</code></div>
        <div><code>table</code></div>
        <div><code>image</code></div>
        <div><code>one-card</code></div>
        <div><code>set-of-cards</code></div>
        <div><code>video-player</code></div>
      </div>
    </div>
  </div>
`;

// Function to inject documentation into the page
export function loadStandaloneDocs(targetElementId = 'docs-container') {
  const target = document.getElementById(targetElementId);
  if (target) {
    target.innerHTML = standaloneDocsHTML;
  }
}

