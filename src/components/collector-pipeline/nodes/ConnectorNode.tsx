import { Handle, Position } from "@xyflow/react";
import { ArrowRightLeft, Grip } from "lucide-react";

import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";

interface ConnectorNodeProps {
  data: any;
}

export const ConnectorNode = ({ data }: ConnectorNodeProps) => {
  const nodeStyle = {
    zIndex: 10,
  };

  return (
    <Card
      className="min-w-48 p-0 gap-0 shadow-md hover:shadow-lg transition-all duration-200 border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-background"
      style={nodeStyle}
    >
      <div className="px-1 py-0.5 bg-amber-100/50 dark:bg-amber-900/20 flex items-center justify-between border-b border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-1 pl-1">
          <Grip size={12} className="text-amber-400 dark:text-amber-500" />
          <Badge
            variant="outline"
            className="text-[10px] py-0 h-4 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
          >
            Connector
          </Badge>
        </div>
      </div>
      <CardContent
        className={
          data.metrics?.processed !== undefined || data.config?.endpoint
            ? "p-2 pt-3"
            : "p-2"
        }
      >
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <ArrowRightLeft
              size={12}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>
          <div className="font-medium text-sm leading-none">{data.label}</div>
        </div>
        {data.config?.endpoint && (
          <div className="text-xs text-muted-foreground mt-2 pl-6 truncate max-w-40">
            {data.config.endpoint}
          </div>
        )}
        {data.metrics?.processed !== undefined && (
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-2 pl-6">
            Processed: {data.metrics.processed.toLocaleString()}
          </div>
        )}
        {data.connectorType && (
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 pl-6">
            {data.connectorType === 'exporter' ? 'Source → Target' : 'Target ← Source'}
          </div>
        )}
      </CardContent>
      {/* Connector nodes have both input and output handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          left: "-7px",
          backgroundColor: "#f59e0b",
          border: "2px solid var(--background)",
          zIndex: 20,
          width: "14px",
          height: "14px",
        }}
        id="left"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          right: "-7px",
          backgroundColor: "#f59e0b",
          border: "2px solid var(--background)",
          zIndex: 20,
          width: "14px",
          height: "14px",
        }}
        id="right"
      />
    </Card>
  );
};

export default ConnectorNode;
