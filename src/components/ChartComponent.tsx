import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartDonut,
  ChartGroup,
  ChartLine,
  ChartPie,
  ChartThemeColor,
  ChartTooltip,
  ChartVoronoiContainer,
} from "@patternfly/react-charts/victory";

export interface ChartDataPoint {
  name?: string;
  x: string | number;
  y: number;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
}

export interface ChartComponentProps {
  component: "chart";
  id: string;
  title?: string;
  chartType: "bar" | "line" | "pie" | "donut";
  data: ChartSeries[];
  width?: number;
  height?: number;
  themeColor?: keyof typeof ChartThemeColor;
  legendPosition?: "bottom" | "right";
  ariaTitle?: string;
  ariaDesc?: string;
  donutSubTitle?: string;
  scale?: number; // Scale factor for the entire chart (e.g., 0.8 for 80%, 1.2 for 120%)
}

export default function ChartComponent({
  id,
  title,
  chartType,
  data,
  width = 600,
  height = 400,
  themeColor = "multi",
  legendPosition = "bottom",
  ariaTitle,
  ariaDesc,
  donutSubTitle = "Total",
  scale = 1,
}: ChartComponentProps): JSX.Element {
  const theme = ChartThemeColor[themeColor] || ChartThemeColor.multi;

  // Apply scale to dimensions
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Format large numbers for axis labels
  const formatNumber = (value: number | string, isXAxis = false): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);

    // Don't format years (4-digit numbers between 1900-2100)
    if (isXAxis && num >= 1900 && num <= 2100 && Number.isInteger(num)) {
      return num.toString();
    }

    if (Math.abs(num) >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B";
    } else if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Format numbers with commas for tooltips (full number display)
  const formatNumberWithCommas = (value: number | string): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);

    // Handle decimals
    if (num % 1 !== 0) {
      return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }

    // Format integers with commas
    return num.toLocaleString("en-US");
  };

  // Calculate dynamic padding based on max value length
  const getMaxYValue = (): number => {
    if (chartType === "pie" || chartType === "donut") return 0;

    let maxY = 0;
    data.forEach((series) => {
      series.data.forEach((point) => {
        if (point.y > maxY) maxY = point.y;
      });
    });
    return maxY;
  };

  const calculateLeftPadding = (): number => {
    const maxY = getMaxYValue();
    const formattedMaxY = formatNumber(maxY);
    // Base padding + approximate character width (10px per char)
    const estimatedWidth = 40 + formattedMaxY.length * 10;
    return Math.max(60, Math.min(estimatedWidth, 120)); // Min 60, Max 120
  };

  const calculateBottomPadding = (): number => {
    if (chartType === "pie" || chartType === "donut") {
      return legendPosition === "bottom" ? 120 : 40;
    }

    // For bar and line charts, check if we have numeric x-axis values
    const hasNumericX = data.some((series) =>
      series.data.some((point) => typeof point.x === "number")
    );

    if (hasNumericX) {
      // Check the max length of formatted x values
      let maxX = 0;
      data.forEach((series) => {
        series.data.forEach((point) => {
          if (typeof point.x === "number" && point.x > maxX) maxX = point.x;
        });
      });
      const formattedMaxX = formatNumber(maxX, true);
      const baseBottomPadding = legendPosition === "bottom" ? 140 : 80;
      // Add extra padding if labels are long
      return formattedMaxX.length > 4
        ? baseBottomPadding + 20
        : baseBottomPadding;
    }

    return legendPosition === "bottom" ? 140 : 80;
  };

  // For pie and donut charts, flatten data to single array
  const flattenedData =
    chartType === "pie" || chartType === "donut"
      ? data.flatMap((series) =>
          series.data.map((point) => ({
            x: point.name || point.x,
            y: point.y,
          }))
        )
      : [];

  // Common props for all charts
  const commonChartProps = {
    height,
    width,
    themeColor: theme,
  };

  // Common legend props for bar/line charts
  const commonLegendProps = {
    legendData: data.map((series) => ({ name: series.name })),
    legendOrientation:
      legendPosition === "right"
        ? "vertical"
        : ("horizontal" as "vertical" | "horizontal"),
    legendPosition,
  };

  // Common padding for bar/line charts
  const commonChartPadding = {
    bottom: calculateBottomPadding(),
    left: calculateLeftPadding(),
    right: legendPosition === "right" ? 120 : 60,
    top: 60,
  };

  // Common padding for pie/donut charts
  const piePadding = {
    bottom: legendPosition === "bottom" ? 120 : 40,
    left: 40,
    right: legendPosition === "right" ? 120 : 40,
    top: 40,
  };

  // Common aria props
  const getAriaProps = (type: string) => ({
    ariaDesc: ariaDesc || `${type} chart showing ${title || "data"}`,
    ariaTitle: ariaTitle || title || `${type} chart`,
  });

  // Constrained tooltip
  const tooltip = <ChartTooltip constrainToVisibleArea />;

  const renderChart = () => {
    switch (chartType) {
      case "bar": {
        // Add label function to each data point
        const barData = data.map((series) => ({
          ...series,
          data: series.data.map((point) => ({
            ...point,
            name: series.name,
            label: ({ datum }: { datum: { name: string; y: number } }) =>
              `${datum.name}: ${formatNumberWithCommas(datum.y)}`,
          })),
        }));

        return (
          <Chart
            {...getAriaProps("Bar")}
            {...commonChartProps}
            {...commonLegendProps}
            domainPadding={{ x: [30, 25] }}
            padding={commonChartPadding}
          >
            <ChartAxis
              tickFormat={(t) => formatNumber(t, true)}
              fixLabelOverlap
            />
            <ChartAxis
              dependentAxis
              showGrid
              tickFormat={(t) => formatNumber(t, false)}
            />
            <ChartGroup offset={11}>
              {barData.map((series, index) => (
                <ChartBar
                  key={index}
                  data={series.data}
                  labelComponent={tooltip}
                />
              ))}
            </ChartGroup>
          </Chart>
        );
      }

      case "line":
        return (
          <Chart
            {...getAriaProps("Line")}
            {...commonChartProps}
            {...commonLegendProps}
            containerComponent={
              <ChartVoronoiContainer
                labels={({ datum }) =>
                  `${datum.name || datum.x}: ${formatNumberWithCommas(datum.y)}`
                }
                constrainToVisibleArea
              />
            }
            padding={commonChartPadding}
          >
            <ChartAxis
              tickFormat={(t) => formatNumber(t, true)}
              fixLabelOverlap
            />
            <ChartAxis
              dependentAxis
              showGrid
              tickFormat={(t) => formatNumber(t, false)}
            />
            <ChartGroup>
              {data.map((series, index) => (
                <ChartLine
                  key={index}
                  data={series.data}
                  name={series.name}
                  labelComponent={tooltip}
                />
              ))}
            </ChartGroup>
          </Chart>
        );

      case "pie":
        return (
          <ChartPie
            {...getAriaProps("Pie")}
            {...commonChartProps}
            data={flattenedData}
            labels={({ datum }) =>
              `${datum.x}: ${formatNumberWithCommas(datum.y)}`
            }
            labelComponent={tooltip}
            legendData={flattenedData.map((point) => ({ name: `${point.x}` }))}
            legendOrientation={commonLegendProps.legendOrientation}
            legendPosition={legendPosition}
            padding={piePadding}
          />
        );

      case "donut": {
        const total = flattenedData.reduce((sum, point) => sum + point.y, 0);
        return (
          <ChartDonut
            {...getAriaProps("Donut")}
            {...commonChartProps}
            data={flattenedData}
            labels={({ datum }) =>
              `${datum.x}: ${formatNumberWithCommas(datum.y)}`
            }
            labelComponent={tooltip}
            legendData={flattenedData.map((point) => ({ name: `${point.x}` }))}
            legendOrientation={commonLegendProps.legendOrientation}
            legendPosition={legendPosition}
            padding={piePadding}
            subTitle={donutSubTitle}
            title={`${total}`}
          />
        );
      }

      default:
        return <div>Unsupported chart type: {chartType}</div>;
    }
  };

  return (
    <div
      id={id}
      style={{
        marginTop: 16,
        marginBottom: 16,
        overflow: "visible",
      }}
    >
      {title && <h3>{title}</h3>}
      <div
        style={{
          overflow: "visible",
          width: scaledWidth,
          height: scaledHeight,
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: width,
            height: height,
          }}
        >
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
