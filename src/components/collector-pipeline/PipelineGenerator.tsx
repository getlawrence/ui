import type { Node, Edge } from "@xyflow/react";
import * as yaml from "js-yaml";

// Mock ComponentMetrics interface for standalone usage
export interface ComponentMetrics {
  component_type: string;
  component_name: string;
  pipeline_type: string;
  received?: number;
  accepted?: number;
  sent?: number;
  errors: number;
}

// Helper function to find metrics for a specific component
function findComponentMetrics(
  metrics: ComponentMetrics[],
  componentType: string,
  componentName: string,
  pipelineType: string,
): ComponentMetrics | undefined {
  return metrics.find(
    (m) =>
      m.component_type === componentType &&
      m.component_name === componentName &&
      m.pipeline_type === pipelineType,
  );
}

// Generate nodes and edges for the pipeline based on actual agent configuration
export function generatePipelineNodes(
  effectiveConfig: string,
  metrics: ComponentMetrics[] = [],
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
          position: { x: 300, y: 200 },
          data: {
            label: "No configuration available",
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
    const errorMessage =
      error instanceof Error ? error.message : "Error parsing configuration";
    return {
      nodes: [
        {
          id: "parse-error",
          type: "default",
          position: { x: 300, y: 200 },
          data: {
            label: `YAML Parse Error: ${errorMessage}`,
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
          position: { x: 300, y: 200 },
          data: {
            label: "No service configuration found",
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
          position: { x: 300, y: 200 },
          data: {
            label: "No pipelines configured",
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
          // This exporter is actually a connector
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
          // This receiver is actually a connector
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

  // Create pipeline nodes based on actual configuration
  Object.entries(pipelines).forEach(
    ([pipelineName, pipelineConfig]: [string, any]) => {
      const pipelineType = pipelineName.toLowerCase();

      // Determine pipeline display name
      const displayName =
        pipelineName === "traces" ||
        pipelineName === "metrics" ||
        pipelineName === "logs"
          ? pipelineName.toUpperCase()
          : `${pipelineType.toUpperCase()} (${pipelineName})`;

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
      

      // Calculate aggregate metrics for this pipeline
      const pipelineMetrics = metrics.filter(
        (m) => m.pipeline_type === pipelineType,
      );
      const totalReceived = pipelineMetrics.reduce(
        (sum, m) => sum + (m.received || 0),
        0,
      );
      const totalErrors = pipelineMetrics.reduce((sum, m) => sum + m.errors, 0);

      // Calculate dynamic section width based on number of processors
      const processorCount = pipelineProcessors.length;
      const processorSpacingX = 220; // Horizontal spacing between processors (increased from 150)
      const processorStartX = 350; // First processor x position
      const baseWidth = 850;
      const additionalWidth =
        processorCount > 1 ? (processorCount - 1) * processorSpacingX : 0;
      const sectionWidth = Math.max(baseWidth, baseWidth + additionalWidth);

      // Calculate dynamic section height based on number of receivers/exporters
      const receiverCount = regularReceivers.length + connectorReceivers.length;
      const exporterCount = regularExporters.length + connectorExporters.length;
      const receiverSpacing = 120; // Vertical spacing between receivers
      const exporterSpacing = 120; // Vertical spacing between exporters
      const baseHeight = 320;
      const nodeHeight = 100; // Approximate height of a single node

      // Calculate required height for receivers and exporters
      const receiverHeight =
        receiverCount > 0
          ? nodeHeight + (receiverCount - 1) * receiverSpacing
          : 0;
      const exporterHeight =
        exporterCount > 0
          ? nodeHeight + (exporterCount - 1) * exporterSpacing
          : 0;
      const maxVerticalHeight = Math.max(
        receiverHeight,
        exporterHeight,
        nodeHeight,
      );

      // Add padding (80px top + 80px bottom)
      const sectionHeight = Math.max(baseHeight, maxVerticalHeight + 160);

      // Create section container node (styled)
      const sectionNode: Node = {
        id: `section-${pipelineName}`,
        type: "section",
        position: { x: 50, y: yOffset },
        data: {
          type: pipelineType as "traces" | "metrics" | "logs",
          label: displayName,
          width: sectionWidth,
          height: sectionHeight,
          // Only include metrics if there are any
          ...(pipelineMetrics.length > 0 && {
            metrics: {
              received: totalReceived,
              errors: totalErrors,
            },
          }),
        },
        selectable: false,
        draggable: false,
      };
      nodes.push(sectionNode);

      // Calculate positions for proper pipeline flow: Fan-in → Chain → Fan-out
      const centerY = yOffset + sectionHeight / 2;

      // Fan-in: Receivers positioned to converge toward center
      // (receiverCount and receiverSpacing already defined above for section height)
      // Offset by -30 to center the node (accounting for node height)
      const receiverStartY =
        centerY - ((receiverCount - 1) * receiverSpacing) / 2 - 30;

      // Process regular receivers
      regularReceivers.forEach((receiver: string, index: number) => {
        // Find metrics for this receiver
        const receiverMetrics = findComponentMetrics(
          metrics,
          "receiver",
          receiver,
          pipelineType,
        );

        const receiverNode: Node = {
          id: `receiver-${pipelineType}-${receiver}`,
          type: "receiver",
          position: {
            x: 100,
            y: receiverStartY + index * receiverSpacing,
          },
          data: {
            label: receiver,
            pipelineType: pipelineType,
            // Only include metrics if they exist
            ...(receiverMetrics && {
              metrics: {
                received:
                  receiverMetrics.received || receiverMetrics.accepted || 0,
              },
            }),
          },
        };
        nodes.push(receiverNode);
      });

      // Process connector receivers
      connectorReceivers.forEach((connector: string, index: number) => {
        const connectorIndex = regularReceivers.length + index;
        const connectorMetrics = findComponentMetrics(
          metrics,
          "connector",
          connector,
          pipelineType,
        );

        const connectorNode: Node = {
          id: `connector-receiver-${pipelineType}-${connector}`,
          type: "connector",
          position: {
            x: 100,
            y: receiverStartY + connectorIndex * receiverSpacing,
          },
          data: {
            label: connector,
            pipelineType: pipelineType,
            connectorType: 'receiver',
            targetPipeline: pipelineName,
            sourcePipeline: connectorUsage[connector]?.sourcePipeline,
            // Only include metrics if they exist
            ...(connectorMetrics && {
              metrics: {
                processed: connectorMetrics.received || connectorMetrics.accepted || 0,
              },
            }),
          },
        };
        nodes.push(connectorNode);
      });

      // Chain: Processors positioned horizontally in sequence
      // (processorCount, processorSpacingX, processorStartX already defined above for section width)

      pipelineProcessors.forEach((processor: string, index: number) => {
        // Find metrics for this processor
        const processorMetrics = findComponentMetrics(
          metrics,
          "processor",
          processor,
          pipelineType,
        );

        const processorNode: Node = {
          id: `processor-${pipelineType}-${processor}`,
          type: "processor",
          position: {
            x: processorStartX + index * processorSpacingX,
            y: centerY - 30, // Center vertically (adjust based on node height)
          },
          data: {
            label: processor,
            pipelineType: pipelineType,
            // Only include metrics if they exist
            ...(processorMetrics && {
              metrics: {
                processed:
                  processorMetrics.accepted || processorMetrics.received || 0,
                batches: 0, // batches info not available in current metrics
              },
            }),
          },
        };
        nodes.push(processorNode);
      });

      // Fan-out: Exporters positioned to diverge from center
      // (exporterCount and exporterSpacing already defined above for section height)
      // Offset by -30 to center the node (accounting for node height)
      const exporterStartY =
        centerY - ((exporterCount - 1) * exporterSpacing) / 2 - 30;

      // Position exporters after the last processor (or at default position if no processors)
      const exporterX =
        processorCount > 0
          ? processorStartX + (processorCount - 1) * processorSpacingX + 250
          : 600;

      // Process regular exporters
      regularExporters.forEach((exporter: string, index: number) => {
        // Find metrics for this exporter
        const exporterMetrics = findComponentMetrics(
          metrics,
          "exporter",
          exporter,
          pipelineType,
        );

        const exporterNode: Node = {
          id: `exporter-${pipelineType}-${exporter}`,
          type: "exporter",
          position: {
            x: exporterX,
            y: exporterStartY + index * exporterSpacing,
          },
          data: {
            label: exporter,
            pipelineType: pipelineType,
            // Only include metrics if they exist
            ...(exporterMetrics && {
              metrics: {
                exported: exporterMetrics.sent || 0,
              },
            }),
          },
        };
        nodes.push(exporterNode);
      });

      // Process connector exporters
      connectorExporters.forEach((connector: string, index: number) => {
        const connectorIndex = regularExporters.length + index;
        const connectorMetrics = findComponentMetrics(
          metrics,
          "connector",
          connector,
          pipelineType,
        );

        const connectorNode: Node = {
          id: `connector-exporter-${pipelineType}-${connector}`,
          type: "connector",
          position: {
            x: exporterX,
            y: exporterStartY + connectorIndex * exporterSpacing,
          },
          data: {
            label: connector,
            pipelineType: pipelineType,
            connectorType: 'exporter',
            sourcePipeline: pipelineName,
            targetPipeline: connectorUsage[connector]?.targetPipeline,
            // Only include metrics if they exist
            ...(connectorMetrics && {
              metrics: {
                processed: connectorMetrics.sent || 0,
              },
            }),
          },
        };
        nodes.push(connectorNode);
      });

      // Create connections following OTEL pipeline logic:
      // Fan-in: Receivers → Processors (or Exporters if no processors)
      // Chain: Processors → Processors (in sequence)
      // Fan-out: Last processor → Exporters (or Receivers → Exporters if no processors)

      if (pipelineProcessors.length > 0) {
        // Fan-in: Connect all regular receivers to first processor (converging pattern)
        regularReceivers.forEach((receiver: string) => {
          edges.push({
            id: `edge-${pipelineType}-${receiver}-to-${pipelineProcessors[0]}`,
            source: `receiver-${pipelineType}-${receiver}`,
            target: `processor-${pipelineType}-${pipelineProcessors[0]}`,
            type: "default", // Using bezier curves
            animated: true,
            style: {
              stroke: "#ff9800",
              strokeWidth: 3,
              zIndex: 1000,
            },
          });
        });

        // Fan-in: Connect all connector receivers to first processor (converging pattern)
        connectorReceivers.forEach((connector: string) => {
          edges.push({
            id: `edge-${pipelineType}-connector-receiver-${connector}-to-${pipelineProcessors[0]}`,
            source: `connector-receiver-${pipelineType}-${connector}`,
            target: `processor-${pipelineType}-${pipelineProcessors[0]}`,
            type: "default", // Using bezier curves
            animated: true,
            style: {
              stroke: "#ff9800",
              strokeWidth: 3,
              zIndex: 1000,
            },
          });
        });

        // Chain: Connect processors in sequence (horizontal chain)
        for (let i = 0; i < pipelineProcessors.length - 1; i++) {
          const currentProcessor = pipelineProcessors[i];
          const nextProcessor = pipelineProcessors[i + 1];
          if (currentProcessor && nextProcessor) {
            edges.push({
              id: `edge-${pipelineType}-${currentProcessor}-to-${nextProcessor}`,
              source: `processor-${pipelineType}-${currentProcessor}`,
              target: `processor-${pipelineType}-${nextProcessor}`,
              type: "default", // Using bezier curves
              animated: true,
              style: {
                stroke: "#ff9800",
                strokeWidth: 3,
                zIndex: 1000,
              },
            });
          }
        }

        // Fan-out: Connect last processor to all regular exporters (diverging pattern)
        const lastProcessor = pipelineProcessors[pipelineProcessors.length - 1];
        regularExporters.forEach((exporter: string) => {
          edges.push({
            id: `edge-${pipelineType}-${lastProcessor}-to-${exporter}`,
            source: `processor-${pipelineType}-${lastProcessor}`,
            target: `exporter-${pipelineType}-${exporter}`,
            type: "default", // Using bezier curves
            animated: true,
            style: {
              stroke: "#ff9800",
              strokeWidth: 3,
              zIndex: 1000,
            },
          });
        });

        // Fan-out: Connect last processor to all connector exporters (diverging pattern)
        connectorExporters.forEach((connector: string) => {
          edges.push({
            id: `edge-${pipelineType}-${lastProcessor}-to-connector-exporter-${connector}`,
            source: `processor-${pipelineType}-${lastProcessor}`,
            target: `connector-exporter-${pipelineType}-${connector}`,
            type: "default", // Using bezier curves
            animated: true,
            style: {
              stroke: "#ff9800",
              strokeWidth: 3,
              zIndex: 1000,
            },
          });
        });
      } else {
        // No processors: Direct fan-in to fan-out (receivers → exporters)
        // Connect regular receivers to regular exporters
        regularReceivers.forEach((receiver: string) => {
          regularExporters.forEach((exporter: string) => {
            edges.push({
              id: `edge-${pipelineType}-${receiver}-to-${exporter}`,
              source: `receiver-${pipelineType}-${receiver}`,
              target: `exporter-${pipelineType}-${exporter}`,
              type: "default", // Using bezier curves
              animated: true,
              style: {
                stroke: "#ff9800",
                strokeWidth: 3,
                zIndex: 1000,
              },
            });
          });
        });

        // Connect regular receivers to connector exporters
        regularReceivers.forEach((receiver: string) => {
          connectorExporters.forEach((connector: string) => {
            edges.push({
              id: `edge-${pipelineType}-${receiver}-to-connector-exporter-${connector}`,
              source: `receiver-${pipelineType}-${receiver}`,
              target: `connector-exporter-${pipelineType}-${connector}`,
              type: "default", // Using bezier curves
              animated: true,
              style: {
                stroke: "#ff9800",
                strokeWidth: 3,
                zIndex: 1000,
              },
            });
          });
        });

        // Connect connector receivers to regular exporters
        connectorReceivers.forEach((connector: string) => {
          regularExporters.forEach((exporter: string) => {
            edges.push({
              id: `edge-${pipelineType}-connector-receiver-${connector}-to-${exporter}`,
              source: `connector-receiver-${pipelineType}-${connector}`,
              target: `exporter-${pipelineType}-${exporter}`,
              type: "default", // Using bezier curves
              animated: true,
              style: {
                stroke: "#ff9800",
                strokeWidth: 3,
                zIndex: 1000,
              },
            });
          });
        });

        // Connect connector receivers to connector exporters
        connectorReceivers.forEach((connector: string) => {
          connectorExporters.forEach((connectorExporter: string) => {
            edges.push({
              id: `edge-${pipelineType}-connector-receiver-${connector}-to-connector-exporter-${connectorExporter}`,
              source: `connector-receiver-${pipelineType}-${connector}`,
              target: `connector-exporter-${pipelineType}-${connectorExporter}`,
              type: "default", // Using bezier curves
              animated: true,
              style: {
                stroke: "#ff9800",
                strokeWidth: 3,
                zIndex: 1000,
              },
            });
          });
        });
      }

      // Move yOffset for next pipeline (based on dynamic section height + gap)
      yOffset += sectionHeight + 40; // Dynamic height based on content + gap
    },
  );

  // Create edges between connector nodes (from source pipeline exporter to target pipeline receiver)
  Object.entries(connectorUsage).forEach(([connectorName, usage]) => {
    if (usage.sourcePipeline && usage.targetPipeline) {
      const sourcePipelineType = usage.sourcePipeline.toLowerCase();
      const targetPipelineType = usage.targetPipeline.toLowerCase();
      
      edges.push({
        id: `connector-edge-${connectorName}-${sourcePipelineType}-to-${targetPipelineType}`,
        source: `connector-exporter-${sourcePipelineType}-${connectorName}`,
        target: `connector-receiver-${targetPipelineType}-${connectorName}`,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#f59e0b", // Amber color for connector edges
          strokeWidth: 4,
          strokeDasharray: "5,5", // Dashed line to distinguish connector edges
          zIndex: 1000,
        },
        label: "Connector",
        labelStyle: {
          fontSize: "10px",
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
