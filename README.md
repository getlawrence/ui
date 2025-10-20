# Lawrence UI Components

A shared UI component library for Lawrence projects, providing reusable React components for OpenTelemetry collector configuration and pipeline visualization.

## Components

### YamlEditor

A standalone YAML editor component with built-in validation, syntax highlighting, and error reporting. Built on top of Monaco Editor with custom validation logic.

**Features:**
- Monaco Editor with YAML syntax highlighting
- Real-time YAML parsing and validation
- Error and warning indicators
- Theme support (light/dark)
- Configurable header and validation display
- Read-only mode support
- Placeholder text support

**Usage:**
```tsx
import { YamlEditor } from '@lawrence/ui';

function MyComponent() {
  const [config, setConfig] = useState(yamlConfig);
  
  return (
    <YamlEditor
      value={config}
      onChange={setConfig}
      height="400px"
      showValidation={true}
      showHeader={true}
      placeholder="Enter your YAML configuration..."
    />
  );
}
```

### CollectorPipelineView

A React Flow-based component that visualizes OpenTelemetry collector pipeline configurations. It displays receivers, processors, and exporters in a flow diagram with real-time metrics support.

**Features:**
- Interactive pipeline visualization
- Real-time metrics display
- Support for traces, metrics, and logs pipelines
- Responsive design with zoom and pan
- Preview mode for configuration validation

**Usage:**
```tsx
import { CollectorPipelineView } from '@lawrence/ui';

function MyComponent() {
  return (
    <CollectorPipelineView
      effectiveConfig={yamlConfig}
      previewMode={true}
      agentId="my-agent"
    />
  );
}
```

### ConfigEditorSideBySide

A side-by-side editor that combines a Monaco YAML editor with the pipeline visualization. Perfect for configuration editing with real-time validation and preview.

**Features:**
- Monaco Editor with YAML syntax highlighting
- Real-time YAML parsing and validation
- Side-by-side pipeline visualization
- Resizable panels
- Error and warning indicators
- Theme support (light/dark)

**Usage:**
```tsx
import { ConfigEditorSideBySide } from '@lawrence/ui';

function MyComponent() {
  const [config, setConfig] = useState(yamlConfig);
  
  return (
    <ConfigEditorSideBySide
      value={config}
      onChange={setConfig}
    />
  );
}
```

## Getting Started

### Installation

```bash
npm install @lawrence/ui
```

### Dependencies

The components require the following peer dependencies:
- React 18+
- React DOM 18+

### Basic Setup

```tsx
import { ThemeProvider } from '@lawrence/ui';
import '@lawrence/ui/dist/styles.css';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start Storybook for development
npm run storybook

# Build the library
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Storybook

The project includes Storybook for component development and testing:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006` where you can:
- View all components with different configurations
- Test component interactions
- Develop new features
- Document component usage

### Available Stories

- **YamlEditor**: Standalone editor with various configurations and validation states
- **CollectorPipelineView**: Various pipeline configurations and states
- **ConfigEditorSideBySide**: Editor with different YAML configurations

## Testing

This project includes comprehensive testing with multiple approaches:

### Test Types

- **Unit Tests**: Jest + React Testing Library for component logic
- **Visual Tests**: Storybook Test Runner for real DOM interactions  
- **Visual Regression**: Screenshot comparison for UI consistency
- **Accessibility**: Automated a11y testing with axe-core

### Running Tests

```bash
# Run all tests (unit + visual + accessibility)
npm run test:all

# Unit tests only
npm test

# Visual & interaction tests
npm run test:storybook

# Visual regression tests
npm run test:visual

# Unit tests with coverage
npm run test:coverage
```

For detailed testing information, see [TESTING.md](./TESTING.md).

## Configuration Format

The components expect OpenTelemetry collector configuration in YAML format:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:
  batch:
    timeout: 1s

exporters:
  logging:
    loglevel: debug

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [logging]
```

## Theming

The components support light and dark themes. Use the `ThemeProvider` to control the theme:

```tsx
import { ThemeProvider, useTheme } from '@lawrence/ui';

function App() {
  return (
    <ThemeProvider>
      <MyApp />
    </ThemeProvider>
  );
}

function MyApp() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

## API Reference

### YamlEditor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | YAML configuration string |
| `onChange` | `(value: string) => void` | - | Callback when configuration changes |
| `height` | `string \| number` | `"100%"` | Height of the editor |
| `showValidation` | `boolean` | `true` | Whether to show validation badges |
| `showHeader` | `boolean` | `true` | Whether to show the header with validation status |
| `readOnly` | `boolean` | `false` | Whether the editor is read-only |
| `placeholder` | `string` | - | Placeholder text when editor is empty |
| `className` | `string` | - | Additional CSS classes |

### CollectorPipelineView Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `agentId` | `string` | - | Agent ID for metrics fetching |
| `agentName` | `string` | - | Display name for the agent |
| `effectiveConfig` | `string` | - | YAML configuration string |
| `previewMode` | `boolean` | `false` | If true, disables metrics fetching |

### ConfigEditorSideBySide Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | YAML configuration string |
| `onChange` | `(value: string) => void` | - | Callback when configuration changes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and stories
5. Submit a pull request

## License

MIT
