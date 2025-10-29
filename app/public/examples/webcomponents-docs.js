// Documentation content for web components example

export const webComponentsDocsHTML = `
  <div class="docs-section basic-usage-section">
    <h2>📚 Basic Usage</h2>
    <pre><code>&lt;!-- 1. Include PatternFly styles --&gt;
&lt;link rel="stylesheet" href="https://unpkg.com/@patternfly/patternfly@6/patternfly.min.css"&gt;

&lt;!-- 2. Include RHNGUI component styles --&gt;
&lt;link rel="stylesheet" href="dist/webcomponents/rhngui-webcomponents.css"&gt;

&lt;!-- 3. Include RHNGUI web components bundle --&gt;
&lt;script type="module" src="dist/webcomponents/rhngui-webcomponents.js"&gt;&lt;/script&gt;

&lt;!-- 4. Use as regular HTML tags --&gt;
&lt;rhngui-chart
  id="sales"
  title="Sales Data"
  chart-type="bar"
  width="600"
  height="400"
  data='[{"name":"Q1","data":[{"x":"Jan","y":1000}]}]'
&gt;&lt;/rhngui-chart&gt;

&lt;!-- 5. Update with JavaScript (optional) --&gt;
&lt;script&gt;
  const chart = document.querySelector('rhngui-chart');
  chart.setAttribute('chart-type', 'line');
&lt;/script&gt;</code></pre>
    <p class="basic-usage-benefits">
      <strong>💡 Key Benefits:</strong> No React required, no build step, works in any HTML page!
    </p>
  </div>

  <div class="docs-section">
    <h2>📖 Available Components</h2>
    <table class="wc-table">
      <thead>
        <tr>
          <th>Element</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>&lt;rhngui-chart&gt;</code></td>
          <td>Bar, line, pie, and donut charts</td>
        </tr>
        <tr>
          <td><code>&lt;rhngui-table&gt;</code></td>
          <td>Data tables with PatternFly styling</td>
        </tr>
        <tr>
          <td><code>&lt;rhngui-image&gt;</code></td>
          <td>Image display with optional title</td>
        </tr>
        <tr>
          <td><code>&lt;rhngui-card&gt;</code></td>
          <td>Information cards with fields</td>
        </tr>
      </tbody>
    </table>
    <p style="margin-top: 15px;"><strong>💡 Tip:</strong> All elements support standard DOM APIs like <code>getAttribute()</code>, <code>setAttribute()</code>, and <code>remove()</code>.</p>
  </div>
`;

// Function to inject documentation into the page
export function loadWebComponentsDocs(targetElementId = 'docs-container') {
  const target = document.getElementById(targetElementId);
  if (target) {
    target.innerHTML = webComponentsDocsHTML;
  }
}

