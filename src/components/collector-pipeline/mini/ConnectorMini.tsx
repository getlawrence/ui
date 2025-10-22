import { Handle, Position } from "@xyflow/react";

interface ConnectorMiniProps {
  data: any;
}

export const ConnectorMini = ({ data }: ConnectorMiniProps) => {
  return (
    <div className="relative">
      <div className="w-4 h-4 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm border border-amber-600 dark:border-amber-300" />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          left: "-6px",
          backgroundColor: "#f59e0b",
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
          backgroundColor: "#f59e0b",
          border: "1px solid white",
          width: "8px",
          height: "8px",
        }}
      />
    </div>
  );
};

export default ConnectorMini;
