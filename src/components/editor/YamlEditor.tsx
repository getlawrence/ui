import Editor, { type OnMount } from "@monaco-editor/react";
import { AlertCircle, Loader2, AlertTriangle } from "lucide-react";
import type { editor } from "monaco-editor";
import React, { useRef, useEffect } from "react";

import { useTheme } from "../ThemeProvider/ThemeProvider";
import { Badge } from "../ui/badge";
import { useYamlParser } from "../../hooks/useYamlParser";
import { useYamlValidation } from "../../hooks/useYamlValidation";
import type { Validator, ValidationResult } from "../../lib/validation";

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string | number;
  showValidation?: boolean;
  showHeader?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  editorRef?: React.RefObject<editor.IStandaloneCodeEditor | null>;
  validators?: Validator[];
  validationDebounceMs?: number;
  onValidationChange?: (validationResult: ValidationResult, isValidating: boolean) => void;
}

export function YamlEditor({
  value,
  onChange,
  height = "100%",
  showValidation = true,
  showHeader = true,
  readOnly = false,
  placeholder,
  className,
  editorRef: externalEditorRef,
  validators,
  validationDebounceMs,
  onValidationChange,
}: YamlEditorProps) {
  const { theme } = useTheme();
  const internalEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorRef = externalEditorRef || internalEditorRef;
  
  const { parseResult, isParsing } = useYamlParser(value, { debounceMs: 300 });
  const { validationResult, isValidating } = useYamlValidation(
    value,
    editorRef,
    {
      debounceMs: validationDebounceMs,
      validators,
    },
  );

  // Call the validation callback when validation results change
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validationResult, isValidating);
    }
  }, [validationResult, isValidating, onValidationChange]);

  const handleEditorDidMount: OnMount = (editor) => {
    if (editorRef.current !== editor) {
      (editorRef as React.MutableRefObject<editor.IStandaloneCodeEditor | null>).current = editor;
    }

    // Configure hover provider to show validation errors
    const monaco = (
      window as unknown as { monaco?: typeof import("monaco-editor") }
    ).monaco;
    if (monaco) {
      monaco.languages.registerHoverProvider("yaml", {
        provideHover: (model, position) => {
          const markers = monaco.editor.getModelMarkers({
            resource: model.uri,
          });

          const hoveredMarkers = markers.filter(
            (marker) =>
              marker.startLineNumber <= position.lineNumber &&
              marker.endLineNumber >= position.lineNumber &&
              marker.startColumn <= position.column &&
              marker.endColumn >= position.column,
          );

          if (hoveredMarkers.length > 0) {
            const contents = hoveredMarkers.map((marker) => ({
              value: `**${marker.severity === 8 ? "Error" : "Warning"}**: ${marker.message}`,
            }));

            return {
              contents,
            };
          }

          return null;
        },
      });
    }
  };

  const renderValidationBadges = () => {
    if (!showValidation) return null;

    return (
      <div className="flex items-center gap-2">
        {(isParsing || isValidating) && (
          <Badge variant="outline" className="gap-1 text-xs">
            <Loader2 className="h-3 w-3 animate-spin" />
            {isValidating ? "Validating..." : "Updating..."}
          </Badge>
        )}
        {!isParsing &&
          !isValidating &&
          !parseResult.valid &&
          parseResult.error && (
            <Badge
              variant="outline"
              className="gap-1 text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
            >
              <AlertCircle className="h-3 w-3" />
              Parse Error
            </Badge>
          )}
        {!isParsing &&
          !isValidating &&
          parseResult.valid &&
          validationResult.errors.length > 0 && (
            <Badge
              variant="outline"
              className={
                validationResult.errors.some((e) => e.severity === "error")
                  ? "gap-1 text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
                  : "gap-1 text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800"
              }
            >
              {validationResult.errors.some((e) => e.severity === "error") ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}
              {validationResult.errors.filter((e) => e.severity === "error")
                .length > 0 && (
                <>
                  {
                    validationResult.errors.filter((e) => e.severity === "error")
                      .length
                  }{" "}
                  error
                  {validationResult.errors.filter((e) => e.severity === "error")
                    .length !== 1
                    ? "s"
                    : ""}
                </>
              )}
              {validationResult.errors.filter((e) => e.severity === "error")
                .length > 0 &&
                validationResult.errors.filter((e) => e.severity === "warning")
                  .length > 0 &&
                ", "}
              {validationResult.errors.filter((e) => e.severity === "warning")
                .length > 0 && (
                <>
                  {
                    validationResult.errors.filter(
                      (e) => e.severity === "warning",
                    ).length
                  }{" "}
                  warning
                  {validationResult.errors.filter(
                    (e) => e.severity === "warning",
                  ).length !== 1
                    ? "s"
                    : ""}
                </>
              )}
            </Badge>
          )}
        {!isParsing &&
          !isValidating &&
          parseResult.valid &&
          validationResult.valid && (
            <Badge
              variant="outline"
              className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
            >
              Valid
            </Badge>
          )}
      </div>
    );
  };

  const editorElement = (
    <Editor
      height={height}
      defaultLanguage="yaml"
      value={value}
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorDidMount}
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly,
        automaticLayout: true,
        wordWrap: "on",
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        padding: { top: 16, bottom: 16 },
        placeholder: placeholder,
      }}
    />
  );

  if (!showHeader) {
    return (
      <div className={className}>
        {editorElement}
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className || ""}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Config</span>
        </div>
        {renderValidationBadges()}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        {editorElement}
      </div>
    </div>
  );
}

export default YamlEditor;
