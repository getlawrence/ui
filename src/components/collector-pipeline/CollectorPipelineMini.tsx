import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import { AlertCircle } from "lucide-react";
import { useEffect, useMemo } from "react";

import "@xyflow/react/dist/style.css";

import {
  ReceiverMini,
  ProcessorMini,
  ExporterMini,
  ConnectorMini,
  SectionMini,
} from "./mini";
import { generateMiniPipelineNodes } from "./MiniPipelineGenerator";

const nodeTypes = {
  "section-mini": SectionMini,
  "receiver-mini": ReceiverMini,
  "processor-mini": ProcessorMini,
  "exporter-mini": ExporterMini,
  "connector-mini": ConnectorMini,
};

interface CollectorPipelineMiniProps {
  effectiveConfig?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function CollectorPipelineMini({
  effectiveConfig: propEffectiveConfig,
  className = "",
  width = 300,
  height = 200,
}: CollectorPipelineMiniProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Determine the effective config to use
  const effectiveConfig = propEffectiveConfig;

  // Memoize the config hash to prevent unnecessary re-renders
  const configHash = useMemo(() => {
    return effectiveConfig ? `${effectiveConfig.length}` : 'empty';
  }, [effectiveConfig]);

  // Generate mini nodes and edges for React Flow
  useEffect(() => {
    if (!effectiveConfig) {
      setNodes([]);
      setEdges([]);
      return;
    }

    try {
      const { nodes: generatedNodes, edges: generatedEdges } =
        generateMiniPipelineNodes(effectiveConfig);

      setNodes(generatedNodes);
      setEdges(generatedEdges);
    } catch (error) {
      setNodes([]);
      setEdges([]);
    }
  }, [effectiveConfig]);

  return (
    <div 
      className={`relative ${className}`} 
      data-testid="collector-pipeline-mini"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {nodes.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-600">No pipeline found</p>
          </div>
        </div>
      ) : (
        <ReactFlow
          key={`react-flow-mini-${configHash}`}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          minZoom={0.5}
          maxZoom={2}
          attributionPosition="bottom-left"
          style={{ width: '100%', height: '100%' }}
          fitView={true}
          fitViewOptions={{ 
            padding: 0.1, 
            duration: 300,
            includeHiddenNodes: false,
            minZoom: 0.5,
            maxZoom: 1.5
          }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll={false}
        />
      )}
    </div>
  );
}

export default CollectorPipelineMini;
