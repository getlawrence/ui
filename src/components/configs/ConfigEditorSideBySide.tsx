import { AlertCircle, Workflow, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";
import type { editor } from "monaco-editor";

import { CollectorPipelineView } from "../collector-pipeline/CollectorPipelineView";
import { YamlEditor } from "../editor/YamlEditor";
import { Badge } from "../ui/badge";
import { SideBySide } from "../ui/side-by-side";
import { useYamlParser } from "../../hooks/useYamlParser";
import type { Validator, ValidationResult } from "../../lib/validation";

interface ConfigEditorSideBySideProps {
  value: string;
  onChange: (value: string) => void;
  validators?: Validator[];
  validationDebounceMs?: number;
}

export function ConfigEditorSideBySide({
  value,
  onChange,
  validators,
  validationDebounceMs,
}: ConfigEditorSideBySideProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    valid: true,
    errors: [],
  });
  const [isValidating, setIsValidating] = useState(false);
  const { parseResult, isParsing } = useYamlParser(value, { debounceMs: 300 });
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleValidationChange = (result: ValidationResult, validating: boolean) => {
    setValidationResult(result);
    setIsValidating(validating);
  };

  const leftContent = (
    <div className="h-full border-r">
      <YamlEditor
        value={value}
        onChange={onChange}
        height="100%"
        showValidation={true}
        showHeader={true}
        editorRef={editorRef}
        validators={validators}
        validationDebounceMs={validationDebounceMs}
        onValidationChange={handleValidationChange}
      />
    </div>
  );

  const rightContent = (
    <div className="h-full flex flex-col bg-background">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Pipeline</span>
        </div>
        <div className="flex items-center gap-2">
          {parseResult.valid && validationResult.valid && (
            <Badge
              variant="outline"
              className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
            >
              Valid
            </Badge>
          )}
          {parseResult.valid &&
            !validationResult.valid &&
            validationResult.errors.some(
              (e) => e.severity === "warning",
            ) &&
            !validationResult.errors.some(
              (e) => e.severity === "error",
            ) && (
              <Badge
                variant="outline"
                className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Warnings
              </Badge>
            )}
          {(!parseResult.valid ||
            (parseResult.valid &&
              validationResult.errors.some(
                (e) => e.severity === "error",
              ))) && (
            <Badge
              variant="outline"
              className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Invalid
            </Badge>
          )}
        </div>
      </div>

      {/* Pipeline Content */}
      <div className="flex-1 overflow-hidden bg-muted/10">
        {parseResult.valid ? (
          <CollectorPipelineView
            effectiveConfig={value}
            previewMode={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <AlertCircle className="h-16 w-16 text-muted-foreground/40 mx-auto" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Invalid Configuration
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Fix YAML errors to see pipeline visualization
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Main Editor Area */}
      <SideBySide
        leftContent={leftContent}
        rightContent={rightContent}
        className="flex-1 min-h-0"
        leftPanelProps={{ defaultSize: 50, minSize: 30 }}
        rightPanelProps={{ defaultSize: 50, minSize: 30 }}
      />
    </div>
  );
}

export default ConfigEditorSideBySide;
