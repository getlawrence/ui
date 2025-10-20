import '@testing-library/jest-dom';

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ onChange, onMount, ...props }: any) => {
    const React = require('react');
    const { useEffect, useRef } = React;
    
    const editorRef = useRef();
    
    useEffect(() => {
      if (onMount) {
        onMount({
          getModel: () => ({
            uri: { toString: () => 'mock-uri' },
          }),
        });
      }
    }, [onMount]);
    
    // Filter out Monaco-specific props that shouldn't be on DOM elements
    const { 
      defaultLanguage, 
      theme, 
      options, 
      height, 
      ...domProps 
    } = props;
    
    return React.createElement('textarea', {
      ...domProps,
      'data-testid': 'monaco-editor',
      onChange: (e: any) => {
        // Call onChange with the new value immediately
        if (onChange) {
          onChange(e.target.value);
        }
      },
      value: props.value || '',
      placeholder: props.placeholder || props.options?.placeholder,
      readOnly: props.readOnly || props.options?.readOnly,
      style: { 
        height: height || '100%',
        width: '100%',
        ...props.style 
      },
    });
  },
}));

// Mock React Flow
jest.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, edges, ...props }: any) => {
    const React = require('react');
    
    // Filter out React Flow-specific props that shouldn't be on DOM elements
    const { 
      onNodesChange, 
      onEdgesChange, 
      nodeTypes, 
      fitView, 
      minZoom, 
      maxZoom, 
      attributionPosition,
      ...domProps 
    } = props;
    
    // Always render the ReactFlow container, even if nodes/edges are empty
    return React.createElement('div', {
      ...domProps,
      'data-testid': 'react-flow',
    }, [
      // Render nodes as divs for testing
      ...(nodes || []).map((node: any) => 
        React.createElement('div', {
          key: node.id,
          'data-testid': `react-flow-node-${node.id}`,
          'data-node-type': node.type,
        }, node.data?.label || node.id)
      ),
      // Render edges as divs for testing
      ...(edges || []).map((edge: any) => 
        React.createElement('div', {
          key: edge.id,
          'data-testid': `react-flow-edge-${edge.id}`,
        })
      ),
      // Render children (like Background)
      children
    ]);
  },
  Background: () => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'react-flow-background' });
  },
  useNodesState: (initialNodes: any) => {
    // Return the actual initialNodes, don't add mock data
    return [initialNodes || [], jest.fn(), jest.fn()];
  },
  useEdgesState: (initialEdges: any) => {
    // Return the actual initialEdges, don't add mock data
    return [initialEdges || [], jest.fn(), jest.fn()];
  },
  Handle: ({ ...props }: any) => {
    const React = require('react');
    return React.createElement('div', {
      ...props,
      'data-testid': 'react-flow-handle',
    });
  },
  Position: {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
  },
}));

// Mock js-yaml - only mock specific error cases, use real implementation for valid YAML
jest.mock('js-yaml', () => {
  const realYaml = jest.requireActual('js-yaml');
  
  return {
    load: jest.fn((str: string) => {
      if (!str || str.trim() === '') {
        return null;
      }
      if (str.includes('invalid') || str.includes('YAML Parse Error')) {
        throw new Error('YAML Parse Error: Invalid YAML');
      }
      if (str.includes('no-service')) {
        return {
          receivers: { otlp: {} },
          processors: { batch: {} },
          exporters: { logging: {} }
          // No service section
        };
      }
      if (str.includes('no-pipelines') || str.includes('pipelines: {}')) {
        return {
          receivers: { otlp: {} },
          processors: { batch: {} },
          exporters: { logging: {} },
          service: {
            // No pipelines
          }
        };
      }
      // Use the real YAML parser for valid YAML
      return realYaml.load(str);
    }),
    dump: jest.fn((obj: any) => JSON.stringify(obj)),
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
