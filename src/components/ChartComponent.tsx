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
}: ChartComponentProps): JSX.Element {
  const theme = ChartThemeColor[themeColor] || ChartThemeColor.multi;

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
              `${datum.name}: ${datum.y}`,
          })),
        }));

        return (
          <Chart
            ariaDesc={ariaDesc || `Bar chart showing ${title || "data"}`}
            ariaTitle={ariaTitle || title || "Bar chart"}
            domainPadding={{ x: [30, 25] }}
            height={height}
            legendData={data.map((series) => ({ name: series.name }))}
            legendOrientation={
              legendPosition === "right" ? "vertical" : "horizontal"
            }
            legendPosition={legendPosition}
            padding={{
              bottom: legendPosition === "bottom" ? 120 : 60,
              left: 60,
              right: legendPosition === "right" ? 120 : 60,
              top: 60,
            }}
            themeColor={theme}
            width={width}
          >
            <ChartAxis />
            <ChartAxis dependentAxis showGrid />
            <ChartGroup offset={11}>
              {barData.map((series, index) => (
                <ChartBar
                  key={index}
                  data={series.data}
                  labelComponent={<ChartTooltip constrainToVisibleArea />}
                />
              ))}
            </ChartGroup>
          </Chart>
        );
      }

      case "line":
        return (
          <Chart
            ariaDesc={ariaDesc || `Line chart showing ${title || "data"}`}
            ariaTitle={ariaTitle || title || "Line chart"}
            containerComponent={
              <ChartVoronoiContainer
                labels={({ datum }) => `${datum.name || datum.x}: ${datum.y}`}
                constrainToVisibleArea
              />
            }
            height={height}
            legendData={data.map((series) => ({ name: series.name }))}
            legendOrientation={
              legendPosition === "right" ? "vertical" : "horizontal"
            }
            legendPosition={legendPosition}
            padding={{
              bottom: legendPosition === "bottom" ? 120 : 60,
              left: 60,
              right: legendPosition === "right" ? 120 : 60,
              top: 60,
            }}
            themeColor={theme}
            width={width}
          >
            <ChartAxis />
            <ChartAxis dependentAxis showGrid />
            <ChartGroup>
              {data.map((series, index) => (
                <ChartLine key={index} data={series.data} name={series.name} />
              ))}
            </ChartGroup>
          </Chart>
        );

      case "pie":
        return (
          <ChartPie
            ariaDesc={ariaDesc || `Pie chart showing ${title || "data"}`}
            ariaTitle={ariaTitle || title || "Pie chart"}
            data={flattenedData}
            height={height}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            legendData={flattenedData.map((point) => ({ name: `${point.x}` }))}
            legendOrientation={
              legendPosition === "right" ? "vertical" : "horizontal"
            }
            legendPosition={legendPosition}
            padding={{
              bottom: legendPosition === "bottom" ? 120 : 40,
              left: 40,
              right: legendPosition === "right" ? 120 : 40,
              top: 40,
            }}
            themeColor={theme}
            width={width}
          />
        );

      case "donut": {
        const total = flattenedData.reduce((sum, point) => sum + point.y, 0);
        return (
          <ChartDonut
            ariaDesc={ariaDesc || `Donut chart showing ${title || "data"}`}
            ariaTitle={ariaTitle || title || "Donut chart"}
            data={flattenedData}
            height={height}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            legendData={flattenedData.map((point) => ({ name: `${point.x}` }))}
            legendOrientation={
              legendPosition === "right" ? "vertical" : "horizontal"
            }
            legendPosition={legendPosition}
            padding={{
              bottom: legendPosition === "bottom" ? 120 : 40,
              left: 40,
              right: legendPosition === "right" ? 120 : 40,
              top: 40,
            }}
            subTitle={donutSubTitle}
            themeColor={theme}
            title={`${total}`}
            width={width}
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
        minHeight: height,
      }}
    >
      {title && <h3>{title}</h3>}
      <div style={{ overflow: "visible" }}>{renderChart()}</div>
    </div>
  );
}
