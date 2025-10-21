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
  image: "https://www.patternfly.org/images/f18506f4.svg",
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
  image: "https://www.patternfly.org/images/f18506f4.svg",
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
  video_img: "https://www.patternfly.org/images/f18506f4.svg",
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
  width: 600,
  height: 400,
  themeColor: "multi" as const,
  legendPosition: "bottom" as const,
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
  legendPosition: "right" as const,
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
  legendPosition: "right" as const,
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
  width: 500,
  height: 400,
  themeColor: "multi" as const,
  legendPosition: "bottom" as const,
  donutSubTitle: "GB Used",
};
