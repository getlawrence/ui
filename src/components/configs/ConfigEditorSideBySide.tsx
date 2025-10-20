import { AlertCircle, Workflow, AlertTriangle } from "lucide-react";
import { useState } from "react";

import { CollectorPipelineView } from "../collector-pipeline/CollectorPipelineView";
import { YamlEditor } from "../editor/YamlEditor";
import { Badge } from "../ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { useYamlParser } from "../../hooks/useYamlParser";
import { useYamlValidation } from "../../hooks/useYamlValidation";

interface ConfigEditorSideBySideProps {
  value: string;
  onChange: (value: string) => void;
}

export function ConfigEditorSideBySide({
  value,
  onChange,
}: ConfigEditorSideBySideProps) {
  const [showPipeline] = useState(true);
  const { parseResult } = useYamlParser(value, { debounceMs: 300 });
  const { validationResult } = useYamlValidation(value, { current: null });

  return (
    <div className="flex flex-col h-full">
      {/* Main Editor Area */}
      {showPipeline ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
          {/* Left Panel - YAML Editor */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full border-r">
              <YamlEditor
                value={value}
                onChange={onChange}
                height="100%"
                showValidation={true}
                showHeader={true}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Pipeline Visualization */}
          <ResizablePanel defaultSize={50} minSize={30}>
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
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex-1 overflow-hidden">
          <YamlEditor
            value={value}
            onChange={onChange}
            height="100%"
            showValidation={true}
            showHeader={false}
          />
        </div>
      )}
    </div>
  );
}

export default ConfigEditorSideBySide;
