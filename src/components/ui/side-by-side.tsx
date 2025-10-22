import { ReactNode } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

interface SideBySideProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  leftPanelProps?: {
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
  };
  rightPanelProps?: {
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
  };
  direction?: "horizontal" | "vertical";
  className?: string;
  showHandle?: boolean;
}

export function SideBySide({
  leftContent,
  rightContent,
  leftPanelProps = {},
  rightPanelProps = {},
  direction = "horizontal",
  className = "",
  showHandle = true,
}: SideBySideProps) {
  const {
    defaultSize: leftDefaultSize = 50,
    minSize: leftMinSize = 30,
    maxSize: leftMaxSize,
  } = leftPanelProps;

  const {
    defaultSize: rightDefaultSize = 50,
    minSize: rightMinSize = 30,
    maxSize: rightMaxSize,
  } = rightPanelProps;

  return (
    <ResizablePanelGroup direction={direction} className={className}>
      <ResizablePanel
        defaultSize={leftDefaultSize}
        minSize={leftMinSize}
        maxSize={leftMaxSize}
      >
        {leftContent}
      </ResizablePanel>

      {showHandle && <ResizableHandle withHandle />}

      <ResizablePanel
        defaultSize={rightDefaultSize}
        minSize={rightMinSize}
        maxSize={rightMaxSize}
      >
        {rightContent}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
