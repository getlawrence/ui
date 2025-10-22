// Re-export commonly used types from dependencies
export type { ComponentProps } from "react";
export type { Node, Edge } from "@xyflow/react";
export type { Validator, ValidationResult } from "../lib/validation";

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
  value: string;
  onChange: (value: string) => void;
  validators?: import("../lib/validation").Validator[];
  validationDebounceMs?: number;
}

export interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  className?: string;
  readOnly?: boolean;
  theme?: "vs-dark" | "vs-light";
  validators?: import("../lib/validation").Validator[];
  validationDebounceMs?: number;
  onValidationChange?: (validationResult: import("../lib/validation").ValidationResult, isValidating: boolean) => void;
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

// ValidationError and ValidationResult are now exported from the validation library

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
