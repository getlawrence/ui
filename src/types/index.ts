// Re-export commonly used types from dependencies
export type { ComponentProps } from "react";
export type { Node, Edge } from "@xyflow/react";

// Component prop types
export interface CollectorPipelineViewProps {
  effectiveConfig?: string;
  previewMode?: boolean;
}

export interface CollectorPipelineMiniProps {
  effectiveConfig?: string;
  className?: string;
  width?: number;
  height?: number;
}

export interface ConfigEditorSideBySideProps {
  leftContent: string;
  rightContent: string;
  onLeftChange?: (content: string) => void;
  onRightChange?: (content: string) => void;
  leftPanelProps?: Record<string, any>;
  rightPanelProps?: Record<string, any>;
  direction?: "horizontal" | "vertical";
  className?: string;
  showHandle?: boolean;
}

export interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  className?: string;
  readOnly?: boolean;
  theme?: "vs-dark" | "vs-light";
}

// Hook types
export interface UseYamlParserOptions {
  debounceMs?: number;
}

export interface ParseResult {
  valid: boolean;
  data?: any;
  error?: string;
}

export interface ValidationError {
  severity: "error" | "warning";
  message: string;
  line?: number;
  column?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Node types for pipeline components
export interface PipelineNodeData {
  id: string;
  type: string;
  label: string;
  status?: "active" | "inactive" | "error";
  metrics?: ComponentMetrics;
}

export interface ComponentMetrics {
  id: string;
  name: string;
  status: string;
  lastUpdated: string;
  data?: Record<string, any>;
}
