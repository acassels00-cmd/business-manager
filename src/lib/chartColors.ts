export const CATEGORICAL = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
];

export const SERVICE_COLOR: Record<string, string> = {
  "Pressure Washing": CATEGORICAL[0],
  "Window Cleaning": CATEGORICAL[1],
  "Soft Washing": CATEGORICAL[2],
  "Roof Cleaning": CATEGORICAL[3],
};

export function colorForService(service: string, index: number): string {
  return SERVICE_COLOR[service] ?? CATEGORICAL[index % CATEGORICAL.length];
}

export const CHART_INK = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e1e0d9",
  baseline: "#c3c2b7",
  surface: "#fcfcfb",
};

export const SEQUENTIAL_BLUE = "#2a78d6";
