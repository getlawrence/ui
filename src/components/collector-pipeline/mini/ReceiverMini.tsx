import { Handle, Position } from "@xyflow/react";

interface ReceiverMiniProps {
  data: any;
}

export const ReceiverMini = ({ data: _data }: ReceiverMiniProps) => {
  return (
    <div className="relative">
      <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 shadow-sm border border-blue-600 dark:border-blue-300" />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          right: "-6px",
          backgroundColor: "#3b82f6",
          border: "1px solid white",
          width: "8px",
          height: "8px",
        }}
      />
    </div>
  );
};

export default ReceiverMini;
