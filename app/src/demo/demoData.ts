// Demo data used by the app pages to render components from the monorepo

export const imageDemo = {
  component: "image" as const,
  id: "demo-image-1",
  image: "https://www.patternfly.org/images/f18506f4.svg",
  title: "PatternFly Logo (demo)",
};

export const imageDemoLarge = {
  component: "image" as const,
  id: "demo-image-2",
  image: "https://picsum.photos/800/600",
  title: "Random Image (Large)",
};

export const oneCardDemo = {
  title: "Server Details",
  id: "onecard-1",
  image: "https://avatars.githubusercontent.com/u/6391110?v=4",
  imageSize: "md",
  fields: [
    { name: "Hostname", data_path: "host.name", data: ["server-01"] },
    { name: "IP", data_path: "host.ip", data: ["10.0.0.5"] },
    { name: "Uptime", data_path: "host.uptime", data: ["72 days"] },
  ],
};

export const oneCardDemoNoImage = {
  title: "Database Configuration",
  id: "onecard-2",
  fields: [
    { name: "Database", data_path: "db.name", data: ["PostgreSQL"] },
    { name: "Version", data_path: "db.version", data: ["15.2"] },
    { name: "Port", data_path: "db.port", data: [5432] },
    { name: "Max Connections", data_path: "db.max_conn", data: [100] },
  ],
};

export const oneCardDemoSmallImage = {
  title: "User Profile",
  id: "onecard-3",
  image: "https://avatars.githubusercontent.com/u/6391110?v=4",
  imageSize: "sm",
  fields: [
    { name: "Username", data_path: "user.name", data: ["admin"] },
    { name: "Role", data_path: "user.role", data: ["Administrator"] },
  ],
};

export const setOfCardsDemo = {
  component: "set-of-cards" as const,
  id: "setof-1",
  title: "Disks",
  fields: [
    { name: "Device", data_path: "disk.device", data: ["sda", "sdb", "sdc"] },
    { name: "Size", data_path: "disk.size", data: ["100GB", "200GB", "500GB"] },
    { name: "Mount", data_path: "disk.mount", data: ["/", "/data", "/backup"] },
  ],
};

export const setOfCardsDemoTwoCards = {
  component: "set-of-cards" as const,
  id: "setof-2",
  title: "Network Interfaces",
  fields: [
    {
      name: "Interface",
      data_path: "network.interface",
      data: ["eth0", "eth1"],
    },
    {
      name: "IP Address",
      data_path: "network.ip",
      data: ["192.168.1.100", "10.0.0.50"],
    },
    { name: "Status", data_path: "network.status", data: ["up", "down"] },
    {
      name: "Speed",
      data_path: "network.speed",
      data: ["1000 Mbps", "1000 Mbps"],
    },
  ],
};

export const tableDemo = {
  component: "table" as const,
  id: "table-1",
  title: "Users",
  fields: [
    { name: "Name", data_path: "user.name", data: ["Alice", "Bob", "Carol"] },
    {
      name: "Email",
      data_path: "user.email",
      data: ["alice@example.com", "bob@example.com", "carol@example.com"],
    },
    { name: "Active", data_path: "user.active", data: [true, false, true] },
  ],
};

export const tableDemoComplexData = {
  component: "table" as const,
  id: "table-2",
  title: "System Metrics",
  fields: [
    {
      name: "Service",
      data_path: "service.name",
      data: ["API", "Database", "Cache", "Queue"],
    },
    { name: "CPU %", data_path: "service.cpu", data: [45.2, 78.9, 12.3, 34.1] },
    {
      name: "Memory (GB)",
      data_path: "service.memory",
      data: [2.5, 8.3, 0.5, 1.2],
    },
    {
      name: "Healthy",
      data_path: "service.healthy",
      data: [true, false, true, true],
    },
    {
      name: "Tags",
      data_path: "service.tags",
      data: [
        ["production", "critical"],
        ["production"],
        ["staging"],
        ["production", "worker"],
      ],
    },
  ],
};

export const videoDemo = {
  id: "video-1",
  title: "YouTube Video with Poster",
  video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  video_img: "https://avatars.githubusercontent.com/u/6391110?v=4",
  autoPlay: false,
  controls: true,
  aspectRatio: "16:9" as const,
};

export const videoDemoAuto = {
  id: "video-2",
  title: "Direct Video (Auto Aspect Ratio)",
  video: "https://www.w3schools.com/html/mov_bbb.mp4",
  autoPlay: true,
  controls: true,
  aspectRatio: "auto" as const,
};

export const videoDemo4x3 = {
  id: "video-3",
  title: "Classic 4:3 Format",
  video: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  autoPlay: false,
  controls: true,
  aspectRatio: "4:3" as const,
};

export const dynamicDemo = {
  component: "one-card" as const,
  key: "onecard-demo",
  props: oneCardDemo,
};

export const dynamicDemoImage = {
  component: "image" as const,
  key: "image-demo",
  props: imageDemo,
};

export const dynamicDemoTable = {
  component: "table" as const,
  key: "table-demo",
  props: tableDemo,
};

// Chart component demos
export const chartDemoBar = {
  component: "chart" as const,
  id: "chart-bar-demo",
  title: "Quarterly Revenue by Product",
  chartType: "bar" as const,
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
    {
      name: "Product C",
      data: [
        { x: "Q1", y: 20 },
        { x: "Q2", y: 30 },
        { x: "Q3", y: 35 },
        { x: "Q4", y: 45 },
      ],
    },
  ],
  themeColor: "multi" as const,
};

export const chartDemoLine = {
  component: "chart" as const,
  id: "chart-line-demo",
  title: "Website Traffic Over Time",
  chartType: "line" as const,
  data: [
    {
      name: "Desktop",
      data: [
        { x: "Jan", y: 1200 },
        { x: "Feb", y: 1500 },
        { x: "Mar", y: 1800 },
        { x: "Apr", y: 2100 },
        { x: "May", y: 2400 },
        { x: "Jun", y: 2700 },
      ],
    },
    {
      name: "Mobile",
      data: [
        { x: "Jan", y: 800 },
        { x: "Feb", y: 1100 },
        { x: "Mar", y: 1400 },
        { x: "Apr", y: 1700 },
        { x: "May", y: 2000 },
        { x: "Jun", y: 2300 },
      ],
    },
    {
      name: "Tablet",
      data: [
        { x: "Jan", y: 400 },
        { x: "Feb", y: 500 },
        { x: "Mar", y: 600 },
        { x: "Apr", y: 700 },
        { x: "May", y: 800 },
        { x: "Jun", y: 900 },
      ],
    },
  ],
  width: 750,
  height: 400,
  themeColor: "multi" as const,
};

export const chartDemoPie = {
  component: "chart" as const,
  id: "chart-pie-demo",
  title: "Market Share by Browser",
  chartType: "pie" as const,
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
  width: 650,
  height: 400,
  themeColor: "blue" as const,
};

export const chartDemoDonut = {
  component: "chart" as const,
  id: "chart-donut-demo",
  title: "Storage Usage",
  chartType: "donut" as const,
  data: [
    {
      name: "Storage",
      data: [
        { name: "Documents", x: "Documents", y: 45 },
        { name: "Photos", x: "Photos", y: 30 },
        { name: "Videos", x: "Videos", y: 15 },
        { name: "Music", x: "Music", y: 8 },
        { name: "Other", x: "Other", y: 2 },
      ],
    },
  ],
  height: 400,
  themeColor: "multi" as const,
  donutSubTitle: "GB Used",
};

// Chart demo with large numbers
export const chartDemoBarLargeNumbers = {
  component: "chart" as const,
  id: "chart-bar-large-demo",
  title: "Annual Revenue by Region (in USD)",
  chartType: "bar" as const,
  data: [
    {
      name: "North America",
      data: [
        { x: 2020, y: 125000000 },
        { x: 2021, y: 145000000 },
        { x: 2022, y: 178000000 },
        { x: 2023, y: 205000000 },
        { x: 2024, y: 240000000 },
      ],
    },
    {
      name: "Europe",
      data: [
        { x: 2020, y: 98000000 },
        { x: 2021, y: 112000000 },
        { x: 2022, y: 135000000 },
        { x: 2023, y: 158000000 },
        { x: 2024, y: 185000000 },
      ],
    },
    {
      name: "Asia Pacific",
      data: [
        { x: 2020, y: 87000000 },
        { x: 2021, y: 105000000 },
        { x: 2022, y: 142000000 },
        { x: 2023, y: 189000000 },
        { x: 2024, y: 256000000 },
      ],
    },
  ],
  width: 750,
  height: 450,
  themeColor: "multi" as const,
};

export const chartDemoLineLargeNumbers = {
  component: "chart" as const,
  id: "chart-line-large-demo",
  title: "Global User Growth (Total Active Users)",
  chartType: "line" as const,
  data: [
    {
      name: "Platform A",
      data: [
        { x: 2018, y: 850000000 },
        { x: 2019, y: 1200000000 },
        { x: 2020, y: 1750000000 },
        { x: 2021, y: 2300000000 },
        { x: 2022, y: 2850000000 },
        { x: 2023, y: 3400000000 },
      ],
    },
    {
      name: "Platform B",
      data: [
        { x: 2018, y: 450000000 },
        { x: 2019, y: 675000000 },
        { x: 2020, y: 925000000 },
        { x: 2021, y: 1250000000 },
        { x: 2022, y: 1620000000 },
        { x: 2023, y: 2100000000 },
      ],
    },
    {
      name: "Platform C",
      data: [
        { x: 2018, y: 125000000 },
        { x: 2019, y: 280000000 },
        { x: 2020, y: 525000000 },
        { x: 2021, y: 890000000 },
        { x: 2022, y: 1350000000 },
        { x: 2023, y: 1900000000 },
      ],
    },
  ],
  width: 800,
  height: 450,
  themeColor: "multi" as const,
};

export const chartDemoBarScaled = {
  component: "chart" as const,
  id: "chart-bar-scaled-demo",
  title: "Quarterly Revenue (Scaled to 70%)",
  chartType: "bar" as const,
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
  width: 600,
  height: 400,
  themeColor: "blue" as const,
  scale: 0.7,
};

// Additional DynamicComponent examples
export const setOfCardsDemoWithImages = {
  component: "set-of-cards" as const,
  id: "setof-3",
  title: "Team Members",
  fields: [
    {
      name: "Name",
      data_path: "team.name",
      data: ["Alice Johnson", "Bob Smith", "Carol Williams", "David Brown"],
    },
    {
      name: "Role",
      data_path: "team.role",
      data: [
        "Lead Developer",
        "DevOps Engineer",
        "UI/UX Designer",
        "Product Manager",
      ],
    },
    {
      name: "Email",
      data_path: "team.email",
      data: [
        "alice@company.com",
        "bob@company.com",
        "carol@company.com",
        "david@company.com",
      ],
    },
    {
      name: "Years",
      data_path: "team.years",
      data: [5, 3, 4, 7],
    },
  ],
};

export const tableDemoServerMetrics = {
  component: "table" as const,
  id: "table-3",
  title: "Server Performance Metrics",
  fields: [
    {
      name: "Server",
      data_path: "server.name",
      data: ["web-01", "web-02", "db-01", "cache-01", "queue-01"],
    },
    {
      name: "CPU Usage",
      data_path: "server.cpu",
      data: ["45%", "67%", "89%", "23%", "34%"],
    },
    {
      name: "Memory Usage",
      data_path: "server.memory",
      data: ["3.2 GB", "5.8 GB", "12.4 GB", "1.5 GB", "2.1 GB"],
    },
    {
      name: "Disk I/O",
      data_path: "server.disk_io",
      data: ["120 MB/s", "85 MB/s", "450 MB/s", "35 MB/s", "78 MB/s"],
    },
    {
      name: "Status",
      data_path: "server.status",
      data: ["healthy", "healthy", "warning", "healthy", "healthy"],
    },
  ],
};

export const oneCardDemoAPIEndpoint = {
  component: "one-card" as const,
  title: "API Endpoint Status",
  id: "onecard-4",
  fields: [
    { name: "Endpoint", data_path: "api.endpoint", data: ["/api/v1/users"] },
    { name: "Method", data_path: "api.method", data: ["GET"] },
    { name: "Response Time", data_path: "api.response_time", data: ["125ms"] },
    { name: "Success Rate", data_path: "api.success_rate", data: ["99.8%"] },
    { name: "Requests/min", data_path: "api.requests", data: [1250] },
  ],
};

export const chartDemoBarStacked = {
  component: "chart" as const,
  id: "chart-bar-stacked-demo",
  title: "Monthly Sales by Category",
  chartType: "bar" as const,
  data: [
    {
      name: "Electronics",
      data: [
        { x: "Jan", y: 45000 },
        { x: "Feb", y: 52000 },
        { x: "Mar", y: 48000 },
        { x: "Apr", y: 61000 },
        { x: "May", y: 58000 },
        { x: "Jun", y: 67000 },
      ],
    },
    {
      name: "Clothing",
      data: [
        { x: "Jan", y: 28000 },
        { x: "Feb", y: 31000 },
        { x: "Mar", y: 35000 },
        { x: "Apr", y: 29000 },
        { x: "May", y: 42000 },
        { x: "Jun", y: 38000 },
      ],
    },
    {
      name: "Home & Garden",
      data: [
        { x: "Jan", y: 18000 },
        { x: "Feb", y: 22000 },
        { x: "Mar", y: 25000 },
        { x: "Apr", y: 28000 },
        { x: "May", y: 31000 },
        { x: "Jun", y: 35000 },
      ],
    },
  ],
  width: 700,
  height: 400,
  themeColor: "multi" as const,
};

export const chartDemoLinePerformance = {
  component: "chart" as const,
  id: "chart-line-performance-demo",
  title: "Application Performance (Response Time)",
  chartType: "line" as const,
  data: [
    {
      name: "API Server",
      data: [
        { x: "00:00", y: 125 },
        { x: "04:00", y: 98 },
        { x: "08:00", y: 245 },
        { x: "12:00", y: 389 },
        { x: "16:00", y: 278 },
        { x: "20:00", y: 156 },
      ],
    },
    {
      name: "Database",
      data: [
        { x: "00:00", y: 45 },
        { x: "04:00", y: 38 },
        { x: "08:00", y: 112 },
        { x: "12:00", y: 198 },
        { x: "16:00", y: 145 },
        { x: "20:00", y: 67 },
      ],
    },
  ],
  width: 750,
  height: 350,
  themeColor: "green" as const,
};

export const chartDemoPieServerDistribution = {
  component: "chart" as const,
  id: "chart-pie-server-demo",
  title: "Server Distribution by Region",
  chartType: "pie" as const,
  data: [
    {
      name: "Regions",
      data: [
        { name: "US East", x: "US East", y: 45 },
        { name: "US West", x: "US West", y: 30 },
        { name: "EU Central", x: "EU Central", y: 15 },
        { name: "Asia Pacific", x: "Asia Pacific", y: 10 },
      ],
    },
  ],
  width: 550,
  height: 400,
  themeColor: "purple" as const,
};

export const chartDemoDonutCostBreakdown = {
  component: "chart" as const,
  id: "chart-donut-cost-demo",
  title: "Monthly Cloud Cost Breakdown",
  chartType: "donut" as const,
  data: [
    {
      name: "Cost",
      data: [
        { name: "Compute", x: "Compute", y: 12500 },
        { name: "Storage", x: "Storage", y: 4800 },
        { name: "Networking", x: "Networking", y: 2100 },
        { name: "Database", x: "Database", y: 8900 },
        { name: "Other", x: "Other", y: 1700 },
      ],
    },
  ],
  width: 600,
  height: 400,
  themeColor: "orange" as const,
  donutSubTitle: "USD",
};

export const chartDemoBarMoviesHorizontal = {
  component: "chart" as const,
  id: "chart-bar-movies-horizontal-demo",
  title: "Box Office Revenue by Movie (Horizontal)",
  chartType: "bar" as const,
  data: [
    {
      name: "Domestic Revenue (USD)",
      data: [
        { x: "Toy Story (1995)", y: 373554033 },
        { x: "The Shawshank Redemption (1994)", y: 29140617 },
        { x: "The Dark Knight (2008)", y: 533316061 },
        { x: "Inception (2010)", y: 292576195 },
        { x: "The Matrix (1999)", y: 171479930 },
        { x: "Interstellar (2014)", y: 188341469 },
      ],
    },
  ],
  width: 1000,
  height: 450,
  themeColor: "blue" as const,
  horizontal: true,
  yAxisLabelAngle: 0,
};

export const chartDemoBarLongTitlesHorizontal = {
  component: "chart" as const,
  id: "chart-bar-long-titles-horizontal",
  title: "Top Revenue by Movie Title",
  chartType: "bar" as const,
  data: [
    {
      name: "Revenue (Millions)",
      data: [
        { x: "The Shawshank Redemption", y: 58.3 },
        { x: "The Lord of the Rings: The Return of the King", y: 1119.9 },
        { x: "Pirates of the Caribbean: Dead Man's Chest", y: 1066.2 },
        { x: "Harry Potter and the Deathly Hallows – Part 2", y: 1342.0 },
        { x: "The Dark Knight Rises", y: 1081.0 },
      ],
    },
  ],
  width: 600,
  height: 400,
  themeColor: "green" as const,
  horizontal: true,
};

export const chartDemoBarLongLabelsVertical = {
  component: "chart" as const,
  id: "chart-bar-long-labels-vertical",
  title: "Product Performance by Category",
  chartType: "bar" as const,
  data: [
    {
      name: "Sales (USD)",
      data: [
        { x: "Enterprise Software Solutions", y: 245000 },
        { x: "Cloud Infrastructure Services", y: 189000 },
        { x: "Data Analytics Platform", y: 312000 },
        { x: "Cybersecurity Solutions", y: 156000 },
        { x: "Mobile Application Development", y: 98000 },
      ],
    },
  ],
  width: 600,
  height: 400,
  themeColor: "purple" as const,
};

export const chartDemoBarResponsive = {
  component: "chart" as const,
  id: "chart-bar-responsive",
  title: "Responsive Bar Chart (No Fixed Width)",
  chartType: "bar" as const,
  data: [
    {
      name: "Revenue",
      data: [
        { x: "Q1 2024", y: 12500 },
        { x: "Q2 2024", y: 15800 },
        { x: "Q3 2024", y: 18200 },
        { x: "Q4 2024", y: 21000 },
      ],
    },
    {
      name: "Expenses",
      data: [
        { x: "Q1 2024", y: 8500 },
        { x: "Q2 2024", y: 9200 },
        { x: "Q3 2024", y: 10100 },
        { x: "Q4 2024", y: 11500 },
      ],
    },
  ],
  // No width specified - will be responsive to parent container
  height: 350,
  themeColor: "cyan" as const,
};

export const imageLogoGrid = {
  component: "image" as const,
  id: "demo-image-logos",
  image:
    "https://www.redhat.com/cms/managed-files/Logo-Red_Hat-A-Reverse-RGB.svg",
  title: "Red Hat Logo",
};

export const tableDemoEmpty = {
  component: "table" as const,
  id: "table-empty",
  title: "No Data Available",
  fields: [
    { name: "Column 1", data_path: "data.col1", data: [] },
    { name: "Column 2", data_path: "data.col2", data: [] },
  ],
};

// Mirrored Bar Chart Example (Simplified API)
export const chartMovieROISimple = {
  component: "chart" as const,
  id: "chart-movie-roi-simple",
  title: "Movie ROI vs Budget Comparison",
  chartType: "mirrored-bar" as const,
  data: [
    {
      name: "ROI",
      data: [
        { x: "Toy Story", y: 11.45 },
        { x: "Shawshank Redemption", y: 1.35 },
        { x: "The Dark Knight", y: 4.43 },
        { x: "Inception", y: 4.23 },
        { x: "The Matrix", y: 6.36 },
        { x: "Interstellar", y: 3.11 },
      ],
    },
    {
      name: "Budget",
      data: [
        { x: "Toy Story", y: 30000000 },
        { x: "Shawshank Redemption", y: 25000000 },
        { x: "The Dark Knight", y: 185000000 },
        { x: "Inception", y: 160000000 },
        { x: "The Matrix", y: 63000000 },
        { x: "Interstellar", y: 165000000 },
      ],
    },
  ],
  height: 350,
  themeColor: "multi" as const,
};

// Mirrored Chart Examples
// Top chart for ROI (positive values)
export const chartMovieROI = {
  component: "chart" as const,
  id: "chart-movie-roi",
  title: "Return on Investment (ROI Multiplier)",
  chartType: "bar" as const,
  data: [
    {
      name: "ROI",
      data: [
        { x: "Toy Story", y: 11.45 },
        { x: "Shawshank Redemption", y: 1.35 },
        { x: "The Dark Knight", y: 4.43 },
        { x: "Inception", y: 4.23 },
        { x: "The Matrix", y: 6.36 },
        { x: "Interstellar", y: 3.11 },
      ],
    },
  ],
  width: 700,
  height: 250,
  themeColor: "green" as const,
};

// Bottom chart for Budget (negative values with absolute display)
export const chartMovieBudget = {
  component: "chart" as const,
  id: "chart-movie-budget",
  title: "Production Budget (USD)",
  chartType: "bar" as const,
  data: [
    {
      name: "Budget",
      data: [
        { x: "Toy Story", y: -30000000 },
        { x: "Shawshank Redemption", y: -25000000 },
        { x: "The Dark Knight", y: -185000000 },
        { x: "Inception", y: -160000000 },
        { x: "The Matrix", y: -63000000 },
        { x: "Interstellar", y: -165000000 },
      ],
    },
  ],
  width: 700,
  height: 250,
  themeColor: "blue" as const,
  showAbsoluteValues: true,
};

// Empty State demos
export const emptyStateInfo = {
  component: "empty-state" as const,
  id: "empty-state-info",
  title: "No Data Available",
  content: "We couldn't find any data to display at this time.",
  variant: "info" as const,
};

export const emptyStateSuccess = {
  component: "empty-state" as const,
  id: "empty-state-success",
  title: "All Tasks Complete",
  content: "Great job! You've completed all your tasks successfully.",
  variant: "success" as const,
};

export const emptyStateWarning = {
  component: "empty-state" as const,
  id: "empty-state-warning",
  title: "Action Required",
  content: "Some configurations need your attention before you can proceed.",
  variant: "warning" as const,
};

export const emptyStateError = {
  component: "empty-state" as const,
  id: "empty-state-error",
  title: "Connection Failed",
  content: "Unable to connect to the server. Please try again later.",
  variant: "error" as const,
};

export const emptyStateCustomIcon = {
  component: "empty-state" as const,
  id: "empty-state-custom",
  title: "Custom Icon Example",
  content: "This demonstrates a custom icon configuration.",
  variant: "info" as const,
  icon: "CheckCircleIcon",
};
