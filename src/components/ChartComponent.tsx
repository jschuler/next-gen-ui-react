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
import { useEffect, useRef, useState } from "react";

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
  component:
    | "chart-bar"
    | "chart-line"
    | "chart-pie"
    | "chart-donut"
    | "chart-mirrored-bar";
  id: string;
  title?: string;
  data: ChartSeries[];
  width?: number;
  height?: number;
  themeColor?: keyof typeof ChartThemeColor;
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
  component,
  id,
  title,
  data,
  width,
  height,
  themeColor = "multi",
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
  horizontal,
  // domainPadding,
  tickLabelComponent = <ChartLabel />,
}: ChartComponentProps): JSX.Element {
  // Extract chart type from component name (e.g., "chart-bar" -> "bar")
  const chartType = component.replace("chart-", "") as
    | "bar"
    | "line"
    | "pie"
    | "donut"
    | "mirrored-bar";

  const theme = ChartThemeColor[themeColor] || ChartThemeColor.multi;

  // For responsive charts without explicit width, measure container width
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (width) return; // Skip if width is explicitly provided

    let timeoutId: ReturnType<typeof setTimeout>;

    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.floor(rect.width);

        // Only update if width actually changed significantly (avoid sub-pixel updates)
        setContainerWidth((prevWidth) => {
          if (!prevWidth || Math.abs(newWidth - prevWidth) > 10) {
            return newWidth;
          }
          return prevWidth;
        });
      }
    };

    const debouncedUpdateWidth = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWidth, 100); // Debounce for 100ms
    };

    // Initial measurement (with slight delay to ensure DOM is ready)
    timeoutId = setTimeout(updateWidth, 0);

    // Update on window resize with debouncing
    window.addEventListener("resize", debouncedUpdateWidth);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedUpdateWidth);
    };
  }, [width]);

  // Use provided width, or measured container width, or undefined (Victory will use default)
  const effectiveWidth = width || containerWidth;

  // Automatically determine legend position based on chart type and data
  const legendPosition: "bottom" | "right" = (() => {
    // Pie and donut charts always use right
    if (chartType === "pie" || chartType === "donut") {
      return "right";
    }

    // For bar and line charts, use bottom if 3 or fewer series, otherwise right
    if (chartType === "bar" || chartType === "line") {
      return data.length <= 3 ? "bottom" : "right";
    }

    // Default to bottom for other chart types
    return "bottom";
  })();

  // Auto-detect horizontal mode for bar charts with long labels
  const effectiveHorizontal = (() => {
    // If horizontal is explicitly set, use that value
    if (horizontal !== undefined) {
      return horizontal;
    }
    if (chartType !== "bar") return false;

    // Check for very long labels
    const maxLabelLength = Math.max(
      ...data.flatMap((series) =>
        series.data.map((point) => String(point.x || "").length)
      )
    );

    // Auto-horizontal if any label is longer than 20 characters
    return maxLabelLength > 20;
  })();

  // Calculate dynamic minimum height based on data
  const calculateDynamicHeight = (): number => {
    // For pie and donut charts, use default
    if (chartType === "pie" || chartType === "donut") {
      return 400;
    }

    // For horizontal bar charts, calculate based on number of data points
    if (
      effectiveHorizontal &&
      (chartType === "bar" || chartType === "mirrored-bar")
    ) {
      // Get all unique data points (x values)
      const uniqueDataPoints = new Set(
        data.flatMap((series) => series.data.map((point) => String(point.x)))
      );
      const numberOfDataPoints = uniqueDataPoints.size;

      // Each data point needs space for:
      // - Bar height: ~25px
      // - Spacing between bars: ~8px
      // - Label space: ~7px (labels are positioned with dy={15} dx={15})
      const spacePerDataPoint = 40;

      // Calculate base height needed for bars
      const barsHeight = numberOfDataPoints * spacePerDataPoint;

      // Add padding (top + bottom from commonChartPadding)
      // We'll estimate these since calculateBottomPadding/calculateLeftPadding depend on other factors
      // For horizontal charts: top ~50, bottom ~70-120 (depending on legend)
      const estimatedTopPadding = 50;
      const estimatedBottomPadding = legendPosition === "bottom" ? 120 : 70;

      const totalHeight =
        barsHeight + estimatedTopPadding + estimatedBottomPadding;

      // Minimum height of 200px, maximum of 1200px to prevent excessive height
      return Math.max(200, Math.min(totalHeight, 1200));
    }

    // For vertical bar charts, check if labels need rotation
    if (chartType === "bar" || chartType === "line") {
      // Check if we have string labels that might need rotation
      const hasStringLabels = data.some((series) =>
        series.data.some((point) => typeof point.x === "string")
      );

      if (hasStringLabels) {
        // Get all unique x-axis labels
        const xLabels = data.flatMap((series) =>
          series.data.map((point) => String(point.x || ""))
        );
        const uniqueLabels = [...new Set(xLabels)];

        // Calculate average label length
        const avgLabelLength =
          uniqueLabels.length > 0
            ? uniqueLabels.reduce((sum, label) => sum + label.length, 0) /
              uniqueLabels.length
            : 0;

        // If labels are long, we might need more bottom padding
        // Base height + extra for long labels
        const baseHeight = 400;
        const extraHeightForLabels = avgLabelLength > 15 ? 60 : 0;

        return baseHeight + extraHeightForLabels;
      }
    }

    // Default height for other chart types
    return 400;
  };

  // Use dynamic height calculation when height is not explicitly provided
  const calculatedHeight = height || calculateDynamicHeight();

  // Apply scale to height
  const scaledHeight = calculatedHeight * scale;

  // Format large numbers for axis labels
  const formatNumber = (value: number | string, isXAxis = false): string => {
    // If it's a number type, format it
    if (typeof value === "number") {
      const displayNum = showAbsoluteValues ? Math.abs(value) : value;
      return formatNumericValue(displayNum, isXAxis);
    }

    // For strings, check if it's a pure number before parsing
    const trimmed = value.trim();
    const num = parseFloat(trimmed);

    // If parsing fails, return the original string
    if (isNaN(num)) return String(value);

    // Check if the string represents a pure number by comparing
    // the parsed number back to string with the original
    // This handles cases like "06:19" which parses to 6 but shouldn't be formatted
    if (trimmed !== num.toString() && trimmed !== String(num)) {
      return String(value);
    }

    // It's a valid number string, format it
    const displayNum = showAbsoluteValues ? Math.abs(num) : num;
    return formatNumericValue(displayNum, isXAxis);
  };

  // Helper function to format numeric values
  const formatNumericValue = (displayNum: number, isXAxis = false): string => {
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
    if (effectiveHorizontal) {
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
  const safeHeight = calculatedHeight; // Use calculated dynamic height
  // For bar/line charts, use measured container width when no width is provided
  const commonChartProps = {
    height: safeHeight,
    ...(effectiveWidth && { width: effectiveWidth }),
    themeColor: theme,
  };

  // Pie and donut charts need explicit dimensions to maintain circular shape
  // Use constrained container approach to prevent overflow
  const pieDonutHeight = height || calculateDynamicHeight();
  const pieDonutWidth = width || 500;
  const pieDonutProps = {
    height: pieDonutHeight,
    width: pieDonutWidth,
    themeColor: theme,
    containerComponent: <ChartContainer />,
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

  // Check if x-axis has numeric values
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
      effectiveHorizontal
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
    const chartWidth = effectiveWidth || 700; // Use effective width or default for calculation
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
    if (effectiveHorizontal && yAxisLabelAngle !== undefined) {
      return { angle: yAxisLabelAngle, textAnchor: "start" };
    }
    if (xAxisLabelAngle !== undefined) {
      return {
        angle: xAxisLabelAngle,
        textAnchor: xAxisLabelAngle === -90 ? "middle" : "end",
      };
    }
    if (shouldRotateLabels) {
      return { angle: -15, textAnchor: "end" };
    }
    if (effectiveHorizontal) {
      return { textAnchor: "start" };
    }
    return {};
  };

  const xAxisLabelStyle = getXAxisLabelStyle();

  // Determine y-axis label style (only for non-horizontal charts)
  const yAxisLabelStyle =
    !effectiveHorizontal && yAxisLabelAngle !== undefined
      ? { angle: yAxisLabelAngle }
      : {};

  const renderChart = () => {
    switch (chartType) {
      case "bar": {
        // Add label function to each data point
        const hasMultipleSeries = data.length > 1;
        const barData = data.map((series) => ({
          ...series,
          data: series.data.map((point) => ({
            ...point,
            seriesName: series.name,
            label: ({
              datum,
            }: {
              datum: { seriesName: string; x: string | number; y: number };
            }) => {
              // For tooltips: show series name (only if multiple series), then x value (if string), then y value
              const parts = [];
              if (hasMultipleSeries) {
                parts.push(datum.seriesName);
              }
              if (typeof datum.x === "string") {
                parts.push(datum.x);
              }
              const prefix = parts.join(" - ");
              return prefix
                ? `${prefix}: ${formatNumberWithCommas(datum.y)}`
                : formatNumberWithCommas(datum.y);
            },
          })),
        }));

        return (
          <Chart
            {...getAriaProps("Bar")}
            {...commonChartProps}
            {...commonLegendProps}
            // domainPadding={domainPadding || (effectiveHorizontal ? { y: [30, 25] } : { x: [30, 25] })}
            padding={commonChartPadding}
            horizontal={effectiveHorizontal}
          >
            <ChartAxis
              tickFormat={(t) => {
                if (hideXAxisLabels) return "";
                // In horizontal mode, this axis shows categories (strings), not values
                if (effectiveHorizontal) return String(t);
                // In vertical mode, this axis shows categories on x-axis
                return formatNumber(t, true);
              }}
              fixLabelOverlap
              style={{
                tickLabels: xAxisLabelStyle,
                axis: { stroke: "none" },
                ticks: { stroke: "none" },
              }}
              tickLabelComponent={
                effectiveHorizontal ? (
                  <HorizontalBarLabel />
                ) : (
                  tickLabelComponent
                )
              }
            />
            <ChartAxis
              dependentAxis
              showGrid
              tickFormat={(t) => {
                if (hideYAxisLabels) return "";
                // In horizontal mode, this axis shows values (numbers)
                if (effectiveHorizontal) return formatNumber(t, false);
                // In vertical mode, this axis shows values on y-axis
                return formatNumber(t, false);
              }}
              style={{
                tickLabels: yAxisLabelStyle,
                axis: { stroke: "none" },
                ticks: { stroke: "none" },
              }}
            />
            <ChartGroup offset={11} horizontal={effectiveHorizontal}>
              {barData.map((series, index) => (
                <ChartBar
                  key={index}
                  data={series.data}
                  labelComponent={tooltip}
                  horizontal={effectiveHorizontal}
                />
              ))}
            </ChartGroup>
          </Chart>
        );
      }

      case "line": {
        // Add series name to each data point for consistent tooltips
        const hasMultipleSeries = data.length > 1;
        const lineData = data.map((series) => ({
          ...series,
          data: series.data.map((point) => ({
            ...point,
            seriesName: series.name,
          })),
        }));

        // Line chart uses VoronoiContainer for better tooltip interaction
        const formatLineTooltip = (datum: {
          seriesName?: string;
          x: string | number;
          y: number;
        }) => {
          // Show series name (only if multiple series), then x value (if string), then y value
          const parts = [];
          if (hasMultipleSeries && datum.seriesName) {
            parts.push(datum.seriesName);
          }
          if (typeof datum.x === "string") {
            parts.push(datum.x);
          }
          const prefix = parts.join(" - ");
          return prefix
            ? `${prefix}: ${formatNumberWithCommas(datum.y)}`
            : formatNumberWithCommas(datum.y);
        };

        const lineChartProps = {
          ...commonChartProps,
          containerComponent: (
            <ChartVoronoiContainer
              labels={({ datum }) => formatLineTooltip(datum)}
              constrainToVisibleArea
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
              fixLabelOverlap
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
              {lineData.map((series, index) => (
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
          <div style={{ maxWidth: `${pieDonutWidth}px`, width: "100%" }}>
            <ChartPie
              {...getAriaProps("Pie")}
              {...pieDonutProps}
              data={flattenedData}
              labels={({ datum }) =>
                `${datum.x}: ${formatNumberWithCommas(datum.y)}`
              }
              labelComponent={tooltip}
              legendData={flattenedData.map((point) => ({
                name: `${point.x}`,
              }))}
              legendOrientation="vertical"
              legendPosition={legendPosition}
              padding={piePadding}
            />
          </div>
        );

      case "donut": {
        const total = flattenedData.reduce((sum, point) => sum + point.y, 0);
        return (
          <div style={{ maxWidth: `${pieDonutWidth}px`, width: "100%" }}>
            <ChartDonut
              {...getAriaProps("Donut")}
              {...pieDonutProps}
              data={flattenedData}
              labels={({ datum }) =>
                `${datum.x}: ${formatNumberWithCommas(datum.y)}`
              }
              labelComponent={tooltip}
              legendData={flattenedData.map((point) => ({
                name: `${point.x}`,
              }))}
              legendOrientation="vertical"
              legendPosition={legendPosition}
              padding={piePadding}
              subTitle={donutSubTitle}
              title={`${total}`}
            />
          </div>
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

        // Split width between charts if provided, otherwise use undefined for responsive
        const childWidth = effectiveWidth ? effectiveWidth / 2 : undefined;

        return (
          <div style={{ display: "flex", gap: "0px", width: "100%" }}>
            {/* Left Chart */}
            <ChartComponent
              {...{
                component: "chart-bar" as const,
                id: `${id}-left`,
                data: leftChartData,
                width: childWidth,
                height,
                themeColor: leftColor,
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
                component: "chart-bar" as const,
                id: `${id}-right`,
                data: [rightSeries],
                width: childWidth,
                height,
                themeColor: rightColor,
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
    <div id={id} ref={containerRef} className="chart-container">
      {title && <h3>{title}</h3>}
      <div
        className="chart-wrapper"
        style={{
          height: scaledHeight || calculatedHeight,
        }}
      >
        <div
          className="chart-scale-wrapper"
          style={{
            transform: `scale(${scale})`,
            height: calculatedHeight,
          }}
        >
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
