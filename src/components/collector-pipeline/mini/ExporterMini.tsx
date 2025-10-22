import { Handle, Position } from "@xyflow/react";

interface ExporterMiniProps {
  data: any;
}

export const ExporterMini = ({ data: _data }: ExporterMiniProps) => {
  return (
    <div className="relative">
      <div className="w-4 h-4 rounded-full bg-purple-500 dark:bg-purple-400 shadow-sm border border-purple-600 dark:border-purple-300" />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          left: "-6px",
          backgroundColor: "#8b5cf6",
          border: "1px solid white",
          width: "8px",
          height: "8px",
        }}
      />
    </div>
  );
};

export default ExporterMini;
