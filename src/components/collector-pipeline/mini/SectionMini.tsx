import { COLOR_SCHEME } from "../canvas-constants";
import type { PipelineType } from "../canvas-types";

interface SectionMiniProps {
  data: {
    type: PipelineType;
    width?: number;
    height?: number;
    label?: string;
  };
}

export const SectionMini = ({ data }: SectionMiniProps) => {
  const colorScheme = COLOR_SCHEME[data.type] || COLOR_SCHEME.traces;
  const baseColor = colorScheme.color;

  // Use explicit Tailwind classes based on the color
  const colors = (() => {
    switch (baseColor) {
      case "blue":
        return {
          bg: "bg-blue-50/30 dark:bg-blue-500/[0.01]",
          border: "border-blue-200 dark:border-blue-800/20",
        };
      case "green":
        return {
          bg: "bg-green-50/30 dark:bg-green-500/[0.01]",
          border: "border-green-200 dark:border-green-800/20",
        };
      case "purple":
        return {
          bg: "bg-purple-50/30 dark:bg-purple-500/[0.01]",
          border: "border-purple-200 dark:border-purple-800/20",
        };
      default:
        return {
          bg: "bg-gray-50/30 dark:bg-gray-500/[0.01]",
          border: "border-gray-200 dark:border-gray-800/20",
        };
    }
  })();

  return (
    <div
      className={`${colors.bg} rounded border ${colors.border} shadow-sm transition-all duration-300 overflow-visible pointer-events-none`}
      style={{
        width: `${data.width || 200}px`,
        height: `${data.height || 60}px`,
        zIndex: 0,
      }}
    >
      {/* Section header */}
      <div
        className={`h-6 px-2 flex items-center justify-center border-b ${colors.border} bg-white dark:bg-background rounded-t text-xs font-medium`}
      >
        {data.label || colorScheme.label}
      </div>
    </div>
  );
};

export default SectionMini;
