import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useEffect, useCallback, useMemo } from "react";

import "@xyflow/react/dist/style.css";

import {
  ReceiverNode,
  ProcessorNode,
  ExporterNode,
  ConnectorNode,
  SectionNode,
} from "./nodes";
import { generatePipelineNodes } from "./PipelineGenerator";
import { Alert, AlertDescription } from "../ui/alert";

const nodeTypes = {
  section: SectionNode,
  receiver: ReceiverNode,
  processor: ProcessorNode,
  exporter: ExporterNode,
  connector: ConnectorNode,
};


interface CollectorPipelineViewProps {
  effectiveConfig?: string;
  previewMode?: boolean;
}

export function CollectorPipelineView({
  effectiveConfig: propEffectiveConfig,
  previewMode = false,
}: CollectorPipelineViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // For standalone usage, we'll use mock metrics
  const metricsData: any[] = [];

  // Determine the effective config to use
  const effectiveConfig = propEffectiveConfig;

  const loading = false;
  const error = null;

  // Memoize the config hash to prevent unnecessary re-renders
  const configHash = useMemo(() => {
    return effectiveConfig ? `${effectiveConfig.length}-${previewMode}` : 'empty';
  }, [effectiveConfig, previewMode]);

  // Generate nodes and edges for React Flow
  useEffect(() => {
    console.log('CollectorPipelineView: useEffect triggered', { 
      effectiveConfig: effectiveConfig ? 'present' : 'empty', 
      previewMode, 
      configHash 
    });

    if (!effectiveConfig) {
      // No config available yet
      console.log('CollectorPipelineView: Setting empty nodes/edges');
      setNodes([]);
      setEdges([]);
      return;
    }

    try {
      // Use the generator to create nodes from config
      // In preview mode, don't pass metrics to hide them from the visualization
      const { nodes: generatedNodes, edges: generatedEdges } =
        generatePipelineNodes(
          effectiveConfig,
          previewMode ? [] : metricsData || [],
        );

      console.log('CollectorPipelineView: Generated nodes/edges', { 
        nodeCount: generatedNodes.length, 
        edgeCount: generatedEdges.length 
      });

      setNodes(generatedNodes);
      setEdges(generatedEdges);
    } catch (error) {
      console.error('CollectorPipelineView: Error generating nodes/edges', error);
      setNodes([]);
      setEdges([]);
    }
  }, [effectiveConfig, previewMode]); // REMOVED setNodes, setEdges, configHash from dependencies

  // Track when component unmounts
  useEffect(() => {
    return () => {
      console.log('CollectorPipelineView: Component unmounting');
    };
  }, []);

  // Handle React Flow initialization
  const onInit = useCallback((reactFlowInstance: any) => {
    console.log('CollectorPipelineView: React Flow initialized');
    
    // Only fit view after initialization and if we have nodes
    setTimeout(() => {
      try {
        console.log('CollectorPipelineView: Fitting view after initialization');
        reactFlowInstance.fitView({ padding: 0.1, duration: 1000 });
      } catch (error) {
        console.warn('CollectorPipelineView: FitView failed after init:', error);
      }
    }, 500);
  }, []); // Empty dependency array to prevent re-creation

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pipeline configuration...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  console.log('CollectorPipelineView: Rendering', { 
    nodeCount: nodes.length, 
    edgeCount: edges.length, 
    configHash,
    hasEffectiveConfig: !!effectiveConfig,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="h-full flex flex-col" data-testid="collector-pipeline-view">
      <div className="flex-1 relative" data-testid="react-flow-container" style={{ minHeight: '400px' }}>
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pipeline components found</p>
              <p className="text-sm text-gray-500">
                {effectiveConfig ? 'Configuration parsed but no components found' : 'No configuration available'}
              </p>
            </div>
          </div>
        ) : (
          <ReactFlow
            key={`react-flow-${configHash}`}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={onInit}
            nodeTypes={nodeTypes}
            minZoom={0.2}
            maxZoom={2}
            attributionPosition="bottom-left"
            style={{ width: '100%', height: '100%' }}
            fitView={false}
            fitViewOptions={{ padding: 0.1, duration: 800 }}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            {/* Temporarily disable FitViewOnLoad to test */}
            {/* <FitViewOnLoad /> */}
          </ReactFlow>
        )}
      </div>
    </div>
  );
}

export default CollectorPipelineView;
