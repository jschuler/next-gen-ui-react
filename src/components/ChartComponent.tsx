import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartContainer,
  ChartDonut,
  ChartGroup,
  ChartLabel,
  ChartLine,
  ChartPie,
  ChartThemeColor,
  ChartTooltip,
  ChartVoronoiContainer,
} from "@patternfly/react-charts/victory";

const HorizontalBarLabel = (props: React.ComponentProps<typeof ChartLabel>) => (
  <ChartLabel {...props} textAnchor="start" dy={15} dx={15} />
);

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
  chartType: "bar" | "line" | "pie" | "donut" | "mirrored-bar";
  data: ChartSeries[];
  width?: number;
  height?: number;
  themeColor?: keyof typeof ChartThemeColor;
  legendPosition?: "bottom" | "right";
  ariaTitle?: string;
  ariaDesc?: string;
  donutSubTitle?: string;
  scale?: number; // Scale factor for the entire chart (e.g., 0.8 for 80%, 1.2 for 120%)
  showAbsoluteValues?: boolean; // Show absolute values on Y-axis (useful for mirrored charts with negative values)
  overridePadding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  }; // Override calculated padding
  hideXAxisLabels?: boolean; // Hide x-axis labels (useful for mirrored charts)
  hideYAxisLabels?: boolean; // Hide y-axis labels (useful for horizontal mirrored charts)
  xAxisLabelAngle?: number; // Custom rotation angle for x-axis labels (e.g., -90 for vertical)
  yAxisLabelAngle?: number; // Custom rotation angle for y-axis labels (e.g., 0 for horizontal alignment with bars)
  horizontal?: boolean; // Display bars horizontally instead of vertically
  // domainPadding?: { x?: [number, number]; y?: [number, number] }; // Padding around bars/data points
  tickLabelComponent?: React.ReactElement; // Custom label component for tick labels
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
  showAbsoluteValues = false,
  overridePadding,
  hideXAxisLabels = false,
  hideYAxisLabels = false,
  xAxisLabelAngle,
  yAxisLabelAngle,
  horizontal = false,
  // domainPadding,
  tickLabelComponent = <ChartLabel />,
}: ChartComponentProps): JSX.Element {
  const theme = ChartThemeColor[themeColor] || ChartThemeColor.multi;

  // Apply scale to dimensions
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Format large numbers for axis labels
  const formatNumber = (value: number | string, isXAxis = false): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);

    // Use absolute value if showAbsoluteValues is enabled
    const displayNum = showAbsoluteValues ? Math.abs(num) : num;

    // Don't format years (4-digit numbers between 1900-2100)
    if (
      isXAxis &&
      displayNum >= 1900 &&
      displayNum <= 2100 &&
      Number.isInteger(displayNum)
    ) {
      return displayNum.toString();
    }

    if (Math.abs(displayNum) >= 1000000000) {
      return (displayNum / 1000000000).toFixed(1) + "B";
    } else if (Math.abs(displayNum) >= 1000000) {
      return (displayNum / 1000000).toFixed(1) + "M";
    } else if (Math.abs(displayNum) >= 1000) {
      return (displayNum / 1000).toFixed(1) + "K";
    }
    return displayNum.toString();
  };

  // Format numbers with commas for tooltips (full number display)
  const formatNumberWithCommas = (value: number | string): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);

    // Use absolute value if showAbsoluteValues is enabled
    const displayNum = showAbsoluteValues ? Math.abs(num) : num;

    // Handle decimals
    if (displayNum % 1 !== 0) {
      return displayNum.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }

    // Format integers with commas
    return displayNum.toLocaleString("en-US");
  };

  // Calculate dynamic padding based on max value length
  const getMaxYValue = (): number => {
    if (chartType === "pie" || chartType === "donut") return 0;

    let maxY = 0;
    data.forEach((series) => {
      series.data.forEach((point) => {
        const absY = Math.abs(point.y);
        if (absY > maxY) maxY = absY;
      });
    });
    return maxY;
  };

  const calculateLeftPadding = (): number => {
    // horizontal charts have the labels within the chart area
    if (horizontal) {
      return 40;
    }

    // For vertical charts, calculate based on y-axis values
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

  const calculateRightPadding = (): number => {
    if (legendPosition !== "right") {
      return 60; // Default right padding when legend is not on right
    }

    // Get legend labels based on chart type
    let legendLabels: string[] = [];

    if (chartType === "pie" || chartType === "donut") {
      // For pie/donut, legend shows data point names
      legendLabels = data.flatMap((series) =>
        series.data.map((point) => String(point.name || point.x || ""))
      );
    } else {
      // For bar/line, legend shows series names
      legendLabels = data.map((series) => series.name || "");
    }

    if (legendLabels.length === 0) return 120;

    // Find the longest legend label
    const maxLabelLength = Math.max(
      ...legendLabels.map((label) => label.length)
    );

    // Estimate width needed: base padding + character width (~9px per char for legend font)
    const estimatedWidth = 80 + maxLabelLength * 9;

    // Return with min 120, max 280 to prevent excessive padding
    return Math.max(120, Math.min(estimatedWidth, 280));
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
  // If width is not provided, use responsive container
  const commonChartProps = width
    ? {
        height,
        width,
        themeColor: theme,
      }
    : {
        height,
        themeColor: theme,
        containerComponent: <ChartContainer responsive />,
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
    bottom: overridePadding?.bottom ?? calculateBottomPadding(),
    left: overridePadding?.left ?? calculateLeftPadding(),
    right: overridePadding?.right ?? calculateRightPadding(),
    top: overridePadding?.top ?? 60,
  };

  // Common padding for pie/donut charts
  const piePadding = {
    bottom: overridePadding?.bottom ?? (legendPosition === "bottom" ? 120 : 40),
    left: overridePadding?.left ?? 40,
    right: overridePadding?.right ?? calculateRightPadding(),
    top: overridePadding?.top ?? 40,
  };

  // Common aria props
  const getAriaProps = (type: string) => ({
    ariaDesc: ariaDesc || `${type} chart showing ${title || "data"}`,
    ariaTitle: ariaTitle || title || `${type} chart`,
  });

  // Constrained tooltip
  const tooltip = <ChartTooltip constrainToVisibleArea />;

  // Check if x-axis has numeric values (for fixLabelOverlap decision)
  const hasNumericXAxis = data.some((series) =>
    series.data.some((point) => typeof point.x === "number")
  );

  // Check if string labels are long enough to need rotation
  const needsRotatedLabels = () => {
    // Don't rotate for horizontal charts, numeric axes, or pie/donut charts
    if (
      hasNumericXAxis ||
      chartType === "pie" ||
      chartType === "donut" ||
      horizontal
    ) {
      return false;
    }

    // Get all unique x-axis labels
    const xLabels = data.flatMap((series) =>
      series.data.map((point) => String(point.x || point.name || ""))
    );
    const uniqueLabels = [...new Set(xLabels)];

    if (uniqueLabels.length === 0) return false;

    // Calculate average label length
    const avgLabelLength =
      uniqueLabels.reduce((sum, label) => sum + label.length, 0) /
      uniqueLabels.length;

    // Calculate available space per label (rough estimate)
    const chartWidth = width || 600;
    const rightPad = calculateRightPadding();
    const leftPad = calculateLeftPadding();
    const availableWidth = chartWidth - rightPad - leftPad;
    const spacePerLabel = availableWidth / uniqueLabels.length;

    // Rough estimate: average character is ~8px wide
    const estimatedLabelWidth = avgLabelLength * 8;

    // Need rotation if labels would overlap (with some buffer for spacing)
    return estimatedLabelWidth > spacePerLabel * 0.8;
  };

  const shouldRotateLabels = needsRotatedLabels();

  // Determine x-axis label style based on custom angle or automatic rotation
  const getXAxisLabelStyle = () => {
    // In horizontal mode, apply yAxisLabelAngle to x-axis (which shows categories)
    if (horizontal && yAxisLabelAngle !== undefined) {
      return { angle: yAxisLabelAngle, textAnchor: "start" };
    }
    if (xAxisLabelAngle !== undefined) {
      return {
        angle: xAxisLabelAngle,
        textAnchor: xAxisLabelAngle === -90 ? "middle" : "end",
      };
    }
    if (shouldRotateLabels) {
      return { angle: -45, textAnchor: "end" };
    }
    if (horizontal) {
      return { textAnchor: "start" };
    }
    return {};
  };

  const xAxisLabelStyle = getXAxisLabelStyle();

  // Determine y-axis label style (only for non-horizontal charts)
  const yAxisLabelStyle =
    !horizontal && yAxisLabelAngle !== undefined
      ? { angle: yAxisLabelAngle }
      : {};

  const renderChart = () => {
    switch (chartType) {
      case "bar": {
        // Add label function to each data point
        const barData = data.map((series) => ({
          ...series,
          data: series.data.map((point) => ({
            ...point,
            name: series.name,
            label: ({
              datum,
            }: {
              datum: { name: string; x: string | number; y: number };
            }) => {
              // For tooltips only
              return `${datum.name}: ${formatNumberWithCommas(datum.y)}`;
            },
          })),
        }));

        return (
          <Chart
            {...getAriaProps("Bar")}
            {...commonChartProps}
            {...commonLegendProps}
            // domainPadding={domainPadding || (horizontal ? { y: [30, 25] } : { x: [30, 25] })}
            padding={commonChartPadding}
            horizontal={horizontal}
          >
            <ChartAxis
              tickFormat={(t) => {
                if (hideXAxisLabels) return "";
                // In horizontal mode, this axis shows categories (strings), not values
                if (horizontal) return String(t);
                // In vertical mode, this axis shows categories on x-axis
                return formatNumber(t, true);
              }}
              fixLabelOverlap={hasNumericXAxis}
              style={{
                tickLabels: xAxisLabelStyle,
                axis: { stroke: "none" },
                ticks: { stroke: "none" },
              }}
              tickLabelComponent={
                horizontal ? <HorizontalBarLabel /> : tickLabelComponent
              }
            />
            <ChartAxis
              dependentAxis
              showGrid
              tickFormat={(t) => {
                if (hideYAxisLabels) return "";
                // In horizontal mode, this axis shows values (numbers)
                if (horizontal) return formatNumber(t, false);
                // In vertical mode, this axis shows values on y-axis
                return formatNumber(t, false);
              }}
              style={{
                tickLabels: yAxisLabelStyle,
                axis: { stroke: "none" },
                ticks: { stroke: "none" },
              }}
            />
            <ChartGroup offset={11} horizontal={horizontal}>
              {barData.map((series, index) => (
                <ChartBar
                  key={index}
                  data={series.data}
                  labelComponent={tooltip}
                  horizontal={horizontal}
                />
              ))}
            </ChartGroup>
          </Chart>
        );
      }

      case "line": {
        // Line chart uses VoronoiContainer for better tooltip interaction
        const lineChartProps = width
          ? {
              ...commonChartProps,
              containerComponent: (
                <ChartVoronoiContainer
                  labels={({ datum }) =>
                    `${datum.name || datum.x}: ${formatNumberWithCommas(datum.y)}`
                  }
                  constrainToVisibleArea
                />
              ),
            }
          : {
              height,
              themeColor: theme,
              containerComponent: (
                <ChartVoronoiContainer
                  labels={({ datum }) =>
                    `${datum.name || datum.x}: ${formatNumberWithCommas(datum.y)}`
                  }
                  constrainToVisibleArea
                  responsive
                />
              ),
            };

        return (
          <Chart
            {...getAriaProps("Line")}
            {...lineChartProps}
            {...commonLegendProps}
            padding={commonChartPadding}
          >
            <ChartAxis
              tickFormat={(t) => (hideXAxisLabels ? "" : formatNumber(t, true))}
              fixLabelOverlap={hasNumericXAxis}
              style={{
                tickLabels: xAxisLabelStyle,
                axis: { stroke: "none" },
                ticks: { stroke: "none" },
              }}
            />
            <ChartAxis
              dependentAxis
              showGrid
              tickFormat={(t) => formatNumber(t, false)}
              style={{
                axis: { stroke: "none" },
                ticks: { stroke: "none" },
              }}
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
      }

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

      case "mirrored-bar": {
        // Mirrored bar chart: two horizontal charts side by side
        // First series goes right (positive), second series goes left (negative shown as absolute)
        if (data.length < 2) {
          return <div>Mirrored bar chart requires exactly 2 data series</div>;
        }

        const rightSeries = data[0]; // First series (e.g., ROI)
        const leftSeries = data[1]; // Second series (e.g., Budget)

        // Helper to calculate padding for legends
        const calculateRightPaddingForLegend = (seriesName: string) => {
          if (legendPosition !== "right") return 60;
          const estimatedWidth = 80 + seriesName.length * 9;
          return Math.max(120, Math.min(estimatedWidth, 280));
        };

        const rightPadding = Math.max(
          calculateRightPaddingForLegend(rightSeries.name),
          calculateRightPaddingForLegend(leftSeries.name)
        );

        const sharedPadding = {
          left: 0,
          right: rightPadding,
          top: 60,
          bottom: 60,
        };

        // Left chart config (negative values shown as absolute)
        const leftChartData = [
          {
            ...leftSeries,
            data: leftSeries.data.map((point) => ({
              ...point,
              y: -Math.abs(point.y), // Ensure negative for left-pointing bars
            })),
          },
        ];

        // Determine colors for left and right charts
        // If themeColor is "multi", use "blue" for right and "green" for left
        // Otherwise use the specified color for both
        const rightColor = themeColor === "multi" ? "green" : themeColor;
        const leftColor = themeColor === "multi" ? "blue" : themeColor;

        return (
          <div style={{ display: "flex", gap: "0px" }}>
            {/* Left Chart */}
            <ChartComponent
              {...{
                component: "chart" as const,
                id: `${id}-left`,
                chartType: "bar" as const,
                data: leftChartData,
                width,
                height,
                themeColor: leftColor,
                legendPosition,
                horizontal: true,
                hideXAxisLabels: true, // will be the y-axis in horizontal mode
                hideYAxisLabels: false, // will be the x-axis in horizontal mode
                showAbsoluteValues: true,
                overridePadding: { ...sharedPadding, right: 0, left: 0 },
              }}
            />

            {/* Right Chart */}
            <ChartComponent
              {...{
                component: "chart" as const,
                id: `${id}-right`,
                chartType: "bar" as const,
                data: [rightSeries],
                width,
                height,
                themeColor: rightColor,
                legendPosition,
                horizontal: true,
                hideXAxisLabels: false, // will be the y-axis in horizontal mode
                hideYAxisLabels: false, // will be the x-axis in horizontal mode
                overridePadding: { ...sharedPadding, left: 0, right: 0 },
                tickLabelComponent: <HorizontalBarLabel />,
              }}
            />
          </div>
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
          width: width ? scaledWidth : "100%",
          height: scaledHeight,
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: width || "100%",
            height: height,
          }}
        >
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
