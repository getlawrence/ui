import { Handle, Position } from "@xyflow/react";

interface ProcessorMiniProps {
  data: any;
}

export const ProcessorMini = ({ data: _data }: ProcessorMiniProps) => {
  return (
    <div className="relative">
      <div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 shadow-sm border border-green-600 dark:border-green-300" />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          left: "-6px",
          backgroundColor: "#10b981",
          border: "1px solid white",
          width: "8px",
          height: "8px",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          right: "-6px",
          backgroundColor: "#10b981",
          border: "1px solid white",
          width: "8px",
          height: "8px",
        }}
      />
    </div>
  );
};

export default ProcessorMini;
