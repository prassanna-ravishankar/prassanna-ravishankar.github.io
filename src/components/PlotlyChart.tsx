import { useState, useEffect, useCallback } from "react";
import Plot from "react-plotly.js";
import type { Data, Layout, Config } from "plotly.js";

function getThemeColors() {
  const isDark = document.documentElement.classList.contains("dark");
  const style = getComputedStyle(document.documentElement);

  const rgb = (name: string) => {
    const val = style.getPropertyValue(name).trim();
    return `rgb(${val})`;
  };

  return {
    isDark,
    background: "rgba(0,0,0,0)",
    paper: "rgba(0,0,0,0)",
    text: rgb("--color-text-main"),
    muted: rgb("--color-text-muted"),
    gridColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    primary: rgb("--color-primary"),
    accent: rgb("--color-accent"),
  };
}

interface PlotlyChartProps {
  data: Data[];
  layout?: Partial<Layout>;
  config?: Partial<Config>;
  style?: React.CSSProperties;
}

export default function PlotlyChart({
  data,
  layout = {},
  config = {},
  style,
}: PlotlyChartProps) {
  const [theme, setTheme] = useState<ReturnType<typeof getThemeColors> | null>(
    null
  );
  const [revision, setRevision] = useState(0);

  const updateTheme = useCallback(() => {
    setTheme(getThemeColors());
    setRevision((r) => r + 1);
  }, []);

  useEffect(() => {
    updateTheme();
    window.addEventListener("theme-change", updateTheme);
    return () => window.removeEventListener("theme-change", updateTheme);
  }, [updateTheme]);

  if (!theme) return null;

  const themedLayout: Partial<Layout> = {
    ...layout,
    paper_bgcolor: theme.paper,
    plot_bgcolor: theme.background,
    font: {
      ...layout.font,
      color: theme.text,
    },
    title: layout.title
      ? {
          ...(typeof layout.title === "string"
            ? { text: layout.title }
            : layout.title),
          font: {
            color: theme.text,
            size: 16,
            ...(typeof layout.title === "object" ? layout.title.font : {}),
          },
        }
      : undefined,
    xaxis: {
      ...layout.xaxis,
      color: theme.muted,
      gridcolor: theme.gridColor,
      linecolor: theme.gridColor,
    },
    yaxis: {
      ...layout.yaxis,
      color: theme.muted,
      gridcolor: theme.gridColor,
      linecolor: theme.gridColor,
    },
    legend: {
      ...layout.legend,
      font: { color: theme.text, ...layout.legend?.font },
    },
    margin: { t: 60, r: 20, b: 60, l: 60, ...layout.margin },
    autosize: true,
  };

  const themedConfig: Partial<Config> = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      "toImage",
      "sendDataToCloud",
      "lasso2d",
      "select2d",
    ],
    ...config,
  };

  return (
    <Plot
      data={data}
      layout={themedLayout}
      config={themedConfig}
      revision={revision}
      useResizeHandler
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}
