import type { Node, Edge } from "@xyflow/react";
import * as yaml from "js-yaml";

// Generate mini nodes and edges for the pipeline based on actual agent configuration
export function generateMiniPipelineNodes(
  effectiveConfig: string,
): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let yOffset = 0;

  // Check if effective config exists
  if (!effectiveConfig) {
    return {
      nodes: [
        {
          id: "no-config",
          type: "default",
          position: { x: 50, y: 50 },
          data: {
            label: "No config",
          },
        },
      ],
      edges: [],
    };
  }

  // Parse the YAML configuration
  let parsedConfig;
  try {
    parsedConfig = yaml.load(effectiveConfig) as any;
  } catch (error) {
    return {
      nodes: [
        {
          id: "parse-error",
          type: "default",
          position: { x: 50, y: 50 },
          data: {
            label: "Parse Error",
          },
        },
      ],
      edges: [],
    };
  }

  if (!parsedConfig.service || !parsedConfig.service.pipelines) {
    return {
      nodes: [
        {
          id: "no-service",
          type: "default",
          position: { x: 50, y: 50 },
          data: {
            label: "No service",
          },
        },
      ],
      edges: [],
    };
  }

  const { pipelines } = parsedConfig.service;
  const connectors = parsedConfig.connectors || {};

  // Check if there are any pipelines configured
  if (!pipelines || Object.keys(pipelines).length === 0) {
    return {
      nodes: [
        {
          id: "no-pipelines",
          type: "default",
          position: { x: 50, y: 50 },
          data: {
            label: "No pipelines",
          },
        },
      ],
      edges: [],
    };
  }

  // Helper function to find connectors used in pipelines
  function findConnectorsInPipelines(pipelines: any) {
    const connectorUsage: { [connectorName: string]: { sourcePipeline: string; targetPipeline: string } } = {};
    
    Object.entries(pipelines).forEach(([pipelineName, pipelineConfig]: [string, any]) => {
      const pipelineExporters = pipelineConfig?.exporters || [];
      const pipelineReceivers = pipelineConfig?.receivers || [];
      
      // Check if any exporters are actually connectors
      pipelineExporters.forEach((exporter: string) => {
        if (connectors[exporter]) {
          if (!connectorUsage[exporter]) {
            connectorUsage[exporter] = { sourcePipeline: pipelineName, targetPipeline: '' };
          } else {
            connectorUsage[exporter].sourcePipeline = pipelineName;
          }
        }
      });
      
      // Check if any receivers are actually connectors
      pipelineReceivers.forEach((receiver: string) => {
        if (connectors[receiver]) {
          if (!connectorUsage[receiver]) {
            connectorUsage[receiver] = { sourcePipeline: '', targetPipeline: pipelineName };
          } else {
            connectorUsage[receiver].targetPipeline = pipelineName;
          }
        }
      });
    });
    
    return connectorUsage;
  }

  const connectorUsage = findConnectorsInPipelines(pipelines);

  // Create mini pipeline nodes based on actual configuration
  Object.entries(pipelines).forEach(
    ([pipelineName, pipelineConfig]: [string, any]) => {
      const pipelineType = pipelineName.toLowerCase();

      // Determine pipeline display name
      const displayName =
        pipelineName === "traces" ||
        pipelineName === "metrics" ||
        pipelineName === "logs"
          ? pipelineName.toUpperCase()
          : `${pipelineType.toUpperCase()}`;

      // Get the actual components used in THIS pipeline from the service.pipelines section
      const pipelineReceivers = pipelineConfig?.receivers || [];
      const pipelineProcessors = pipelineConfig?.processors || [];
      const pipelineExporters = pipelineConfig?.exporters || [];
      
      // Separate regular exporters from connector exporters
      const regularExporters = pipelineExporters.filter((exporter: string) => !connectors[exporter]);
      const connectorExporters = pipelineExporters.filter((exporter: string) => connectors[exporter]);
      
      // Separate regular receivers from connector receivers
      const regularReceivers = pipelineReceivers.filter((receiver: string) => !connectors[receiver]);
      const connectorReceivers = pipelineReceivers.filter((receiver: string) => connectors[receiver]);

      // Calculate mini section dimensions using the same logic as PipelineGenerator but scaled down
      const receiverCount = regularReceivers.length + connectorReceivers.length;
      const processorCount = pipelineProcessors.length;
      const exporterCount = regularExporters.length + connectorExporters.length;
      
      // Mini dimensions - much smaller for dot-based nodes
      const miniProcessorSpacingX = 15; // Horizontal spacing between processors (reduced from 25)
      const miniProcessorStartX = 25; // First processor x position (reduced from 40)
      const miniBaseWidth = 50; // Base width (reduced from 80)
      const miniAdditionalWidth = processorCount > 1 ? (processorCount - 1) * miniProcessorSpacingX : 0;
      const miniWidth = Math.max(miniBaseWidth, miniBaseWidth + miniAdditionalWidth);

      // Calculate dynamic mini section height based on number of receivers/exporters
      const miniReceiverSpacing = 10; // Vertical spacing between receivers (increased from 8)
      const miniExporterSpacing = 10; // Vertical spacing between exporters (increased from 8)
      const miniBaseHeight = 30; // Base height (increased from 25)
      const miniNodeHeight = 8; // Approximate height of a single mini node (increased from 6)

      // Calculate required height for receivers and exporters
      const miniReceiverHeight = receiverCount > 0 ? miniNodeHeight + (receiverCount - 1) * miniReceiverSpacing : 0;
      const miniExporterHeight = exporterCount > 0 ? miniNodeHeight + (exporterCount - 1) * miniExporterSpacing : 0;
      const miniMaxVerticalHeight = Math.max(miniReceiverHeight, miniExporterHeight, miniNodeHeight);

      // Add padding (6px top + 6px bottom, increased from 4px)
      const miniHeight = Math.max(miniBaseHeight, miniMaxVerticalHeight + 12);

      // Create mini section container node
      const sectionNode: Node = {
        id: `section-mini-${pipelineName}`,
        type: "section-mini",
        position: { x: 20, y: yOffset },
        data: {
          type: pipelineType as "traces" | "metrics" | "logs",
          label: displayName,
          width: miniWidth,
          height: miniHeight,
        },
        selectable: false,
        draggable: false,
      };
      nodes.push(sectionNode);

      // Calculate positions for proper mini pipeline flow: Fan-in → Chain → Fan-out (same as PipelineGenerator)
      const centerY = yOffset + miniHeight / 2;

      // Fan-in: Receivers positioned to converge toward center
      // Offset by -4 to center the node (accounting for mini node height)
      const miniReceiverStartY = centerY - ((receiverCount - 1) * miniReceiverSpacing) / 2 - 4;

      // Process regular receivers
      regularReceivers.forEach((receiver: string, index: number) => {
        const receiverNode: Node = {
          id: `receiver-mini-${pipelineType}-${receiver}`,
          type: "receiver-mini",
          position: {
            x: 25, // Fixed x position for receivers (scaled down from 100)
            y: miniReceiverStartY + index * miniReceiverSpacing,
          },
          data: {
            label: receiver,
            pipelineType: pipelineType,
          },
        };
        nodes.push(receiverNode);
      });

      // Process connector receivers
      connectorReceivers.forEach((connector: string, index: number) => {
        const connectorIndex = regularReceivers.length + index;
        const connectorNode: Node = {
          id: `connector-receiver-mini-${pipelineType}-${connector}`,
          type: "connector-mini",
          position: {
            x: 25, // Fixed x position for receivers (scaled down from 100)
            y: miniReceiverStartY + connectorIndex * miniReceiverSpacing,
          },
          data: {
            label: connector,
            pipelineType: pipelineType,
            connectorType: 'receiver',
          },
        };
        nodes.push(connectorNode);
      });

      // Chain: Processors positioned horizontally in sequence
      pipelineProcessors.forEach((processor: string, index: number) => {
        const processorNode: Node = {
          id: `processor-mini-${pipelineType}-${processor}`,
          type: "processor-mini",
          position: {
            x: miniProcessorStartX + index * miniProcessorSpacingX,
            y: centerY - 6, // Center vertically (adjust based on mini node height)
          },
          data: {
            label: processor,
            pipelineType: pipelineType,
          },
        };
        nodes.push(processorNode);
      });

      // Fan-out: Exporters positioned to diverge from center
      // Offset by -6 to center the node (accounting for mini node height)
      const miniExporterStartY = centerY - ((exporterCount - 1) * miniExporterSpacing) / 2 - 6;

      // Position exporters after the last processor (or at default position if no processors)
      const miniExporterX = processorCount > 0 
        ? miniProcessorStartX + (processorCount - 1) * miniProcessorSpacingX + 30 // 30px after last processor (scaled down from 250)
        : 50; // Default position if no processors

      // Process regular exporters
      regularExporters.forEach((exporter: string, index: number) => {
        const exporterNode: Node = {
          id: `exporter-mini-${pipelineType}-${exporter}`,
          type: "exporter-mini",
          position: {
            x: miniExporterX,
            y: miniExporterStartY + index * miniExporterSpacing,
          },
          data: {
            label: exporter,
            pipelineType: pipelineType,
          },
        };
        nodes.push(exporterNode);
      });

      // Process connector exporters
      connectorExporters.forEach((connector: string, index: number) => {
        const connectorIndex = regularExporters.length + index;
        const connectorNode: Node = {
          id: `connector-exporter-mini-${pipelineType}-${connector}`,
          type: "connector-mini",
          position: {
            x: miniExporterX,
            y: miniExporterStartY + connectorIndex * miniExporterSpacing,
          },
          data: {
            label: connector,
            pipelineType: pipelineType,
            connectorType: 'exporter',
          },
        };
        nodes.push(connectorNode);
      });

      // Create mini connections following OTEL pipeline logic (same as PipelineGenerator):
      // Fan-in: Receivers → Processors (or Exporters if no processors)
      // Chain: Processors → Processors (in sequence)
      // Fan-out: Last processor → Exporters (or Receivers → Exporters if no processors)

      if (pipelineProcessors.length > 0) {
        // Fan-in: Connect all regular receivers to first processor (converging pattern)
        regularReceivers.forEach((receiver: string) => {
          edges.push({
            id: `edge-mini-${pipelineType}-${receiver}-to-${pipelineProcessors[0]}`,
            source: `receiver-mini-${pipelineType}-${receiver}`,
            target: `processor-mini-${pipelineType}-${pipelineProcessors[0]}`,
            type: "straight",
            style: {
              stroke: "#ff9800",
              strokeWidth: 1,
            },
          });
        });

        // Fan-in: Connect all connector receivers to first processor (converging pattern)
        connectorReceivers.forEach((connector: string) => {
          edges.push({
            id: `edge-mini-${pipelineType}-connector-receiver-${connector}-to-${pipelineProcessors[0]}`,
            source: `connector-receiver-mini-${pipelineType}-${connector}`,
            target: `processor-mini-${pipelineType}-${pipelineProcessors[0]}`,
            type: "straight",
            style: {
              stroke: "#ff9800",
              strokeWidth: 1,
            },
          });
        });

        // Chain: Connect processors in sequence (horizontal chain)
        for (let i = 0; i < pipelineProcessors.length - 1; i++) {
          const currentProcessor = pipelineProcessors[i];
          const nextProcessor = pipelineProcessors[i + 1];
          if (currentProcessor && nextProcessor) {
            edges.push({
              id: `edge-mini-${pipelineType}-${currentProcessor}-to-${nextProcessor}`,
              source: `processor-mini-${pipelineType}-${currentProcessor}`,
              target: `processor-mini-${pipelineType}-${nextProcessor}`,
              type: "straight",
              style: {
                stroke: "#ff9800",
                strokeWidth: 1,
              },
            });
          }
        }

        // Fan-out: Connect last processor to all regular exporters (diverging pattern)
        const lastProcessor = pipelineProcessors[pipelineProcessors.length - 1];
        regularExporters.forEach((exporter: string) => {
          edges.push({
            id: `edge-mini-${pipelineType}-${lastProcessor}-to-${exporter}`,
            source: `processor-mini-${pipelineType}-${lastProcessor}`,
            target: `exporter-mini-${pipelineType}-${exporter}`,
            type: "straight",
            style: {
              stroke: "#ff9800",
              strokeWidth: 1,
            },
          });
        });

        // Fan-out: Connect last processor to all connector exporters (diverging pattern)
        connectorExporters.forEach((connector: string) => {
          edges.push({
            id: `edge-mini-${pipelineType}-${lastProcessor}-to-connector-exporter-${connector}`,
            source: `processor-mini-${pipelineType}-${lastProcessor}`,
            target: `connector-exporter-mini-${pipelineType}-${connector}`,
            type: "straight",
            style: {
              stroke: "#ff9800",
              strokeWidth: 1,
            },
          });
        });
      } else {
        // No processors: Direct fan-in to fan-out (receivers → exporters)
        // Connect regular receivers to regular exporters
        regularReceivers.forEach((receiver: string) => {
          regularExporters.forEach((exporter: string) => {
            edges.push({
              id: `edge-mini-${pipelineType}-${receiver}-to-${exporter}`,
              source: `receiver-mini-${pipelineType}-${receiver}`,
              target: `exporter-mini-${pipelineType}-${exporter}`,
              type: "straight",
              style: {
                stroke: "#ff9800",
                strokeWidth: 1,
              },
            });
          });
        });

        // Connect regular receivers to connector exporters
        regularReceivers.forEach((receiver: string) => {
          connectorExporters.forEach((connector: string) => {
            edges.push({
              id: `edge-mini-${pipelineType}-${receiver}-to-connector-exporter-${connector}`,
              source: `receiver-mini-${pipelineType}-${receiver}`,
              target: `connector-exporter-mini-${pipelineType}-${connector}`,
              type: "straight",
              style: {
                stroke: "#ff9800",
                strokeWidth: 1,
              },
            });
          });
        });

        // Connect connector receivers to regular exporters
        connectorReceivers.forEach((connector: string) => {
          regularExporters.forEach((exporter: string) => {
            edges.push({
              id: `edge-mini-${pipelineType}-connector-receiver-${connector}-to-${exporter}`,
              source: `connector-receiver-mini-${pipelineType}-${connector}`,
              target: `exporter-mini-${pipelineType}-${exporter}`,
              type: "straight",
              style: {
                stroke: "#ff9800",
                strokeWidth: 1,
              },
            });
          });
        });

        // Connect connector receivers to connector exporters
        connectorReceivers.forEach((connector: string) => {
          connectorExporters.forEach((connectorExporter: string) => {
            edges.push({
              id: `edge-mini-${pipelineType}-connector-receiver-${connector}-to-connector-exporter-${connectorExporter}`,
              source: `connector-receiver-mini-${pipelineType}-${connector}`,
              target: `connector-exporter-mini-${pipelineType}-${connectorExporter}`,
              type: "straight",
              style: {
                stroke: "#ff9800",
                strokeWidth: 1,
              },
            });
          });
        });
      }

      // Move yOffset for next pipeline
      yOffset += miniHeight + 20;
    },
  );

  // Create mini edges between connector nodes (from source pipeline exporter to target pipeline receiver)
  Object.entries(connectorUsage).forEach(([connectorName, usage]) => {
    if (usage.sourcePipeline && usage.targetPipeline) {
      const sourcePipelineType = usage.sourcePipeline.toLowerCase();
      const targetPipelineType = usage.targetPipeline.toLowerCase();
      
      edges.push({
        id: `connector-edge-mini-${connectorName}-${sourcePipelineType}-to-${targetPipelineType}`,
        source: `connector-exporter-mini-${sourcePipelineType}-${connectorName}`,
        target: `connector-receiver-mini-${targetPipelineType}-${connectorName}`,
        type: "smoothstep",
        style: {
          stroke: "#f59e0b", // Amber color for connector edges
          strokeWidth: 1, // Scaled down from 4
          strokeDasharray: "2,2", // Dashed line to distinguish connector edges (scaled down from 5,5)
        },
        label: "Connector",
        labelStyle: {
          fontSize: "8px", // Scaled down from 10px
          fill: "#f59e0b",
          fontWeight: "bold",
        },
        labelBgStyle: {
          fill: "white",
          fillOpacity: 0.8,
        },
      });
    }
  });

  return { nodes, edges };
}
